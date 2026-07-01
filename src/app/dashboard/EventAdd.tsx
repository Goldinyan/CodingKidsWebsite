"use client";

import { Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { addEvent, getAllCourses } from "@/lib/db";
import type { EventData, CourseData } from "@/BackEnd/type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const defaultEvent: EventData = {
  name: "",
  uid: "",
  course: "",
  date: Timestamp.fromDate(new Date()),
  length: 0,
  memberCount: 0,
  place: ["", "", ""],
  users: [],
  queue: [],
  leftUsers: [],
  typeOfEvent: "",
  tag: "",
  difficulty: "",
  requirements: "",
  description: "",
};

function getNextWednesday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7;
  const nextWednesday = new Date(today);
  nextWednesday.setDate(today.getDate() + daysUntilWednesday);
  nextWednesday.setHours(18, 0, 0, 0);
  return nextWednesday;
}

export default function EventAdd(props: {
  mode?: "card" | "dialog";
  onCreated?: () => void;
  onClose?: () => void;
}) {
  const { user, userRole } = useAuth();
  const { mode = "card", onCreated, onClose } = props;

  const [EventInfo, setEventInfo] = useState<EventData>(defaultEvent);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseList = await getAllCourses(
          user?.uid || "anonymous",
          userRole,
        );
        setCourses(courseList);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadCourses();
  }, [user?.uid, userRole]);

  useEffect(() => {
    presetEvent1();
  }, []);

  const presetEvent1 = () => {
    setEventInfo({
      name: "Scratch Workshop",
      uid: "",
      course: "Scratch & Spieleenwicklung",
      date: Timestamp.fromDate(getNextWednesday()),
      length: 90,
      memberCount: 18,
      place: [
        "CUBES Wesel - Konferenzraum EG links",
        "Rudolf-Diesel-Str. 115",
        "46485 Wesel",
      ],
      users: [],
      queue: [],
      leftUsers: [],
      typeOfEvent: "CoderDojo",
      tag: "Scratch",
      difficulty: "Einsteigerfreundlich",
      requirements:
        "Keine Vorkenntnisse erforderlich. Ideal für Kinder ab 8 Jahren",
      description:
        "In diesem Workshop lernen Kinder spielerisch die Grundlagen des Programmierens mit Scratch. Gemeinsam entwickeln wir kleine interaktive Geschichten und Spiele.",
    });
  };
  const handleEventAddcustom = async () => {
    if (!user) return;

    if (!EventInfo.name.trim()) {
      alert("Event-Name ist erforderlich");
      return;
    }

    if (!EventInfo.course.trim()) {
      alert("Kurs auswählen ist erforderlich");
      return;
    }

    try {
      await addEvent(EventInfo, user.uid, userRole);
      console.log("Event erfolgreich hinzugefügt");
      setEventInfo(defaultEvent);
      onCreated?.();
      onClose?.();
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Events:", error);
    }
  };

  const form = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-2">
        <Label htmlFor="name" className="font-semibold text-gray-700">
          Event-Name *
        </Label>
        <Input
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="name"
          placeholder="z.B. Scratch Workshop"
          value={EventInfo.name}
          onChange={(e) => setEventInfo({ ...EventInfo, name: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="course" className="font-semibold text-gray-700">
          Kurs *
        </Label>
        <select
          id="course"
          value={EventInfo.course}
          onChange={(e) =>
            setEventInfo({ ...EventInfo, course: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          disabled={isLoadingCourses}
        >
          <option value="">
            {isLoadingCourses
              ? "Kurse werden geladen..."
              : "Wählen Sie einen Kurs"}
          </option>
          {courses.map((course) => (
            <option key={course.uid} value={course.uid}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date" className="font-semibold text-gray-700">
          Datum *
        </Label>
        <Input
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="date"
          type="date"
          value={EventInfo.date.toDate().toISOString().split("T")[0]}
          onChange={(e) => {
            const selectedDate = Timestamp.fromDate(
              new Date(e.target.value + "T18:00:00"),
            );
            setEventInfo({ ...EventInfo, date: selectedDate });
          }}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="length" className="font-semibold text-gray-700">
          Dauer (Minuten) *
        </Label>
        <Input
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="length"
          type="number"
          placeholder="90"
          value={EventInfo.length}
          onChange={(e) =>
            setEventInfo({
              ...EventInfo,
              length: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="memberCount" className="font-semibold text-gray-700">
          Teilnehmerzahl *
        </Label>
        <Input
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="memberCount"
          type="number"
          placeholder="18"
          value={EventInfo.memberCount}
          onChange={(e) =>
            setEventInfo({
              ...EventInfo,
              memberCount: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      <div className="col-span-1 md:col-span-2 grid gap-2">
        <Label className="font-semibold text-gray-700">Ort *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EventInfo.place.map((p, i) => (
            <Input
              key={i}
              className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                i === 0 ? "Veranstaltungsort" : i === 1 ? "Straße" : "Stadt"
              }
              value={p}
              onChange={(e) => {
                const updated = [...EventInfo.place];
                updated[i] = e.target.value;
                setEventInfo({ ...EventInfo, place: updated });
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type" className="font-semibold text-gray-700">
          Event-Typ *
        </Label>
        <Input
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="type"
          placeholder="z.B. CoderDojo"
          value={EventInfo.typeOfEvent}
          onChange={(e) =>
            setEventInfo({ ...EventInfo, typeOfEvent: e.target.value })
          }
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tag" className="font-semibold text-gray-700">
          Tag / Thema
        </Label>
        <Input
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="tag"
          placeholder="z.B. Scratch, Python"
          value={EventInfo.tag}
          onChange={(e) => setEventInfo({ ...EventInfo, tag: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="difficulty" className="font-semibold text-gray-700">
          Schwierigkeitsgrad
        </Label>
        <Input
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="difficulty"
          placeholder="z.B. Anfänger, Fortgeschritten"
          value={EventInfo.difficulty}
          onChange={(e) =>
            setEventInfo({ ...EventInfo, difficulty: e.target.value })
          }
        />
      </div>

      <div className="col-span-1 md:col-span-2 grid gap-2">
        <Label htmlFor="description" className="font-semibold text-gray-700">
          Beschreibung
        </Label>
        <textarea
          id="description"
          className="border border-gray-300 rounded-lg p-3 resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Geben Sie eine detaillierte Beschreibung des Events ein..."
          value={EventInfo.description}
          onChange={(e) =>
            setEventInfo({ ...EventInfo, description: e.target.value })
          }
        />
      </div>
    </div>
  );

  if (mode === "dialog") {
    return (
      <div className="space-y-4">
        {form}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={presetEvent1}>
            Preset: Scratch
          </Button>
          <Button variant="outline" className="flex-1" onClick={presetEvent2}>
            Preset: Versammlung
          </Button>
        </div>
        <div className="text-xs text-gray-500">* Erforderliche Felder</div>
        <Button
          onClick={handleEventAddcustom}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          Erstellen
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Neues Event erstellen
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Füllen Sie alle Felder aus oder verwenden Sie einen Preset
        </p>
      </div>
      {form}
      <div className="pt-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={presetEvent1}>
            Preset: Scratch
          </Button>
          <Button variant="outline" className="flex-1" onClick={presetEvent2}>
            Preset: Versammlung
          </Button>
        </div>
        <Button
          onClick={handleEventAddcustom}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          Event speichern
        </Button>
      </div>
    </div>
  );
}

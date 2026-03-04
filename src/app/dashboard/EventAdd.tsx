"use client";

import { Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { addEvent, getUserData } from "@/lib/db";
import type { EventData } from "@/BackEnd/type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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

export default function EventAdd() {
  const { user } = useAuth();

  const [EventInfo, setEventInfo] = useState<EventData>(defaultEvent);

  const presetEvent1 = () => {
    setEventInfo({
      name: "Scratch Workshop",
      uid: "",
      course: "",
      date: Timestamp.fromDate(getNextWednesday()),
      length: 90,
      memberCount: 18,
      place: [
        "CUBES Wesel – Konferenzraum EG links",
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
        "Keine Vorkenntnisse erforderlich – ideal für Kinder ab 8 Jahren",
      description:
        "In diesem Workshop lernen Kinder spielerisch die Grundlagen des Programmierens mit Scratch. Gemeinsam entwickeln wir kleine interaktive Geschichten und Spiele.",
    });
  };

  const presetEvent2 = () => {
    setEventInfo({
      name: "Mitgliederversammlung",
      uid: "",
      date: Timestamp.fromDate(getNextWednesday()),
      course: "DA",
      length: 180,
      memberCount: 50,
      place: [
        "CUBES Wesel – Hauptraum",
        "Rudolf-Diesel-Str. 115",
        "46485 Wesel",
      ],
      users: [],
      queue: [],
      leftUsers: [],
      typeOfEvent: "MemberOnly",
      tag: "Verein",
      difficulty: "Keine",
      requirements: "Nur für registrierte Mitglieder – Anmeldung erforderlich",
      description:
        "Jährliche Versammlung aller Vereinsmitglieder zur Abstimmung über aktuelle Themen, Finanzen und zukünftige Projekte. Es wird um pünktliches Erscheinen gebeten.",
    });
  };

  const handleEventAddcustom = async () => {
    if (!user) return;

    if (!EventInfo.name.trim()) {
      alert("Event-Name ist erforderlich");
      return;
    }

    try {
      await addEvent(EventInfo);
      console.log("Event erfolgreich hinzugefügt");
      setEventInfo(defaultEvent);
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Events:", error);
    }
  };

  return (
    <Card className="w-full border-2 border-primaryOwn shadow-lg p-6 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Neues Event erstellen
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Füllen Sie alle Felder aus oder verwenden Sie einen Preset
        </p>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name" className="font-semibold text-gray-700">
            Event-Name *
          </Label>
          <Input
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg"
            id="name"
            placeholder="z.B. Scratch Workshop"
            value={EventInfo.name}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, name: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date" className="font-semibold text-gray-700">
            Datum *
          </Label>
          <Input
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg"
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
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg"
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
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg"
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
                className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg"
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
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg"
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
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg"
            id="tag"
            placeholder="z.B. Scratch, Python"
            value={EventInfo.tag}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, tag: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="difficulty" className="font-semibold text-gray-700">
            Schwierigkeitsgrad
          </Label>
          <Input
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg"
            id="difficulty"
            placeholder="z.B. Anfänger, Fortgeschritten"
            value={EventInfo.difficulty}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, difficulty: e.target.value })
            }
          />
        </div>

        <div className="col-span-1 md:col-span-2 grid gap-2">
          <Label htmlFor="requirements" className="font-semibold text-gray-700">
            Voraussetzungen
          </Label>
          <textarea
            id="requirements"
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg p-3 resize-none min-h-[100px]"
            placeholder="z.B. Keine Vorkenntnisse erforderlich"
            value={EventInfo.requirements}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, requirements: e.target.value })
            }
          />
        </div>

        <div className="col-span-1 md:col-span-2 grid gap-2">
          <Label htmlFor="description" className="font-semibold text-gray-700">
            Beschreibung
          </Label>
          <textarea
            id="description"
            className="border-2 border-gray-300 focus:border-primaryOwn focus:ring-2 focus:ring-primaryOwn/20 rounded-lg p-3 resize-none min-h-[140px]"
            placeholder="Geben Sie eine detaillierte Beschreibung des Events ein..."
            value={EventInfo.description}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, description: e.target.value })
            }
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="w-full text-sm text-gray-600">
          <p>* Erforderliche Felder</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3 w-full">
          <div className="flex gap-2 flex-1">
            <Button
              onClick={presetEvent1}
              variant="outline"
              className="flex-1 border-2 border-blue-400 text-blue-600 hover:bg-blue-50 font-medium"
            >
              Preset: Scratch
            </Button>
            <Button
              onClick={presetEvent2}
              variant="outline"
              className="flex-1 border-2 border-green-400 text-green-600 hover:bg-green-50 font-medium"
            >
              Preset: Versammlung
            </Button>
          </div>
          <Button
            onClick={handleEventAddcustom}
            className="flex-1  text-white font-bold py-2 rounded-lg shadow-md transition-all"
          >
            Event speichern
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

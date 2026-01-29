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

  console.log(user?.uid == "hyNDqT9azTbPQT0gAhqu37DKCyX2");

  const handleEventAddcustom = async () => {
    if (!user) return;

    try {
      await addEvent(EventInfo);
      console.log("Event erfolgreich hinzugefügt");
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Events:", error);
    }
  };

  return (
    <Card className="w-70 border border-primaryOwn  shadow-md p-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Neues Event erstellen</h2>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Event-Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">Event-Name</Label>
          <Input
            className="border-primaryOwn"
            id="name"
            value={EventInfo.name}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, name: e.target.value })
            }
          />
        </div>

        {/* Datum */}
        <div className="grid gap-2">
          <Label htmlFor="date">Datum</Label>
          <Input
            className="border-primaryOwn"
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

        {/* Dauer */}
        <div className="grid gap-2">
          <Label htmlFor="length">Dauer (Minuten)</Label>
          <Input
            className="border-primaryOwn"
            id="length"
            type="number"
            value={EventInfo.length}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, length: parseInt(e.target.value) })
            }
          />
        </div>

        {/* Teilnehmerzahl */}
        <div className="grid gap-2">
          <Label htmlFor="memberCount">Teilnehmerzahl</Label>
          <Input
            className="border-primaryOwn"
            id="memberCount"
            type="number"
            value={EventInfo.memberCount}
            onChange={(e) =>
              setEventInfo({
                ...EventInfo,
                memberCount: parseInt(e.target.value),
              })
            }
          />
        </div>

        {/* Plätze */}
        <div className="col-span-1 md:col-span-2 grid gap-2">
          <Label>Plätze</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {EventInfo.place.map((p, i) => (
              <Input
                key={i}
                placeholder={`Platz ${i + 1}`}
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

        {/* Event-Typ */}
        <div className="grid gap-2">
          <Label htmlFor="type">Event-Typ</Label>
          <Input
            className="border-primaryOwn"
            id="type"
            value={EventInfo.typeOfEvent}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, typeOfEvent: e.target.value })
            }
          />
        </div>

        {/* Tag */}
        <div className="grid gap-2">
          <Label htmlFor="tag">Tag / Thema</Label>
          <Input
            className="border-primaryOwn"
            id="tag"
            value={EventInfo.tag}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, tag: e.target.value })
            }
          />
        </div>

        {/* Schwierigkeitsgrad */}
        <div className="grid gap-2">
          <Label htmlFor="difficulty">Schwierigkeitsgrad</Label>
          <Input
            className="border-primaryOwn"
            id="difficulty"
            value={EventInfo.difficulty}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, difficulty: e.target.value })
            }
          />
        </div>

        {/* Voraussetzungen */}
        <div className="col-span-1 md:col-span-2 grid gap-2">
          <Label htmlFor="requirements">Voraussetzungen</Label>
          <textarea
            id="requirements"
            className="border border-primaryOwn rounded-md p-2 resize-y min-h-[80px]"
            value={EventInfo.requirements}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, requirements: e.target.value })
            }
          />
        </div>

        {/* Beschreibung */}
        <div className="col-span-1 md:col-span-2 grid gap-2">
          <Label htmlFor="description">Beschreibung</Label>
          <textarea
            id="description"
            className="border border-primaryOwn rounded-md p-2 resize-y min-h-[120px]"
            value={EventInfo.description}
            onChange={(e) =>
              setEventInfo({ ...EventInfo, description: e.target.value })
            }
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Button
            onClick={presetEvent1}
            variant="outline"
            className="border-primaryOwn"
          >
            Preset 1
          </Button>
          <Button
            onClick={presetEvent2}
            variant="outline"
            className="border-primaryOwn"
          >
            Preset 2
          </Button>
        </div>
        <Button
          onClick={handleEventAddcustom}
          variant="outline"
          className="border-primaryOwn"
        >
          Event speichern
        </Button>
      </CardFooter>
    </Card>
  );
}

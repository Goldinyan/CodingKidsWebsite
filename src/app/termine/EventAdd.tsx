"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { addEvent, EventData } from "@/lib/db";
import { getUserData } from "@/lib/db";
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
  date: new Date(),
  length: 0,
  memberCount: 0,
  place: ["", "", ""],
  typeOfEvent: "",
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
  const { user, loading } = useAuth();
  const [EventInfo, setEventInfo] = useState<EventData | null>(null);
  const [premiumUser, setPremiumUser] = useState<boolean>(false);

  useEffect(() => {
    setEventInfo(defaultEvent);
  }, []);
  const presetEvent1 = async () => {
    setEventInfo({
      name: "Coding Kids Workshop",
      date: getNextWednesday(),
      length: 90,
      memberCount: 18,
      place: [
        "CUBES Wesel Konferenzraum EG links",
        "Rudolf-Diesel-Str. 115",
        "46485 Wesel",
      ],
      typeOfEvent: "CoderDojo",
    });
  };

  const presetEvent2 = async () => {
    setEventInfo({
      name: "Mitgliederversammlung",
      date: getNextWednesday(),
      length: 3,
      memberCount: 50,
      place: ["Rudolf-Diesel-Str. 115 46485 Wesel"],
      typeOfEvent: "MemberOnly",
    });
  };

  const handleEventAddcustom = async () => {
    if (!user) return;

    const newEvent: EventData = {
      name: EventInfo?.name || "N/A",
      date: EventInfo?.date || new Date(),
      length: EventInfo?.length || 0,
      memberCount: EventInfo?.memberCount || 0,
      place: EventInfo?.place || ["N/A", "N/A", "N/A"],
      typeOfEvent: EventInfo?.typeOfEvent || "N/A",
    };

    try {
      await addEvent(newEvent);
      console.log("Event erfolgreich hinzugefügt");
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Events:", error);
    }
  };

  return (
    <Card className="w-full  border border-primaryOwn shadow-md p-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Neues Event erstellen</h2>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Event-Name</Label>
          <Input
            className="border-primaryOwn"
            id="name"
            value={EventInfo?.name ?? ""}
            onChange={(e) =>
              setEventInfo({
                ...(EventInfo ?? defaultEvent),
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">Datum</Label>
          <Input
            className="border-primaryOwn"
            id="date"
            type="date"
            value={EventInfo?.date.toISOString().split("T")[0] || ""}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              setEventInfo({
                ...(EventInfo ?? defaultEvent),
                date: selectedDate,
              });
            }}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="length">Dauer (Minuten)</Label>
          <Input
            className="border-primaryOwn"
            id="length"
            type="number"
            value={EventInfo?.length ?? 0}
            onChange={(e) =>
              setEventInfo({
                ...(EventInfo ?? defaultEvent),
                length: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="memberCount">Teilnehmerzahl</Label>
          <Input
            className="border-primaryOwn"
            id="memberCount"
            type="number"
            value={EventInfo?.memberCount ?? 0}
            onChange={(e) =>
              setEventInfo({
                ...(EventInfo ?? defaultEvent),
                memberCount: parseInt(e.target.value),
              })
            }
          />
        </div>

        <div className="col-span-1 md:col-span-2 grid gap-2">
          <Label>Plätze</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              className=" border-primaryOwn"
              placeholder="Platz 1"
              value={EventInfo?.place?.[0] ?? ""}
              onChange={(e) => {
                const updatedPlaces = [...(EventInfo?.place ?? ["", "", ""])];
                updatedPlaces[0] = e.target.value;
                setEventInfo({
                  ...(EventInfo ?? defaultEvent),
                  place: updatedPlaces,
                });
              }}
            />{" "}
            <Input
              className=" border-primaryOwn"
              placeholder="Platz 2"
              value={EventInfo?.place?.[1] ?? ""}
              onChange={(e) => {
                const updatedPlaces = [...(EventInfo?.place ?? ["", "", ""])];
                updatedPlaces[1] = e.target.value;
                setEventInfo({
                  ...(EventInfo ?? defaultEvent),
                  place: updatedPlaces,
                });
              }}
            />{" "}
            <Input
              className=" border-primaryOwn"
              placeholder="Platz 3"
              value={EventInfo?.place?.[2] ?? ""}
              onChange={(e) => {
                const updatedPlaces = [...(EventInfo?.place ?? ["", "", ""])];
                updatedPlaces[2] = e.target.value;
                setEventInfo({
                  ...(EventInfo ?? defaultEvent),
                  place: updatedPlaces,
                });
              }}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type">Event-Typ</Label>
          <Input
            className="border-primaryOwn"
            id="type"
            value={EventInfo?.typeOfEvent ?? ""}
            onChange={(e) =>
              setEventInfo({
                ...(EventInfo ?? defaultEvent),
                typeOfEvent: e.target.value,
              })
            }
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Button
            onClick={() => presetEvent1()}
            variant="outline"
            className="border-primaryOwn "
          >
            Preset 1
          </Button>
          <Button
            onClick={() => presetEvent2()}
            variant="outline"
            className="border-primaryOwn "
          >
            Preset 2
          </Button>
        </div>
        <Button
          onClick={() => handleEventAddcustom()}
          variant="outline"
          className="border-primaryOwn "
        >
          Event speichern
        </Button>
      </CardFooter>
    </Card>
  );
}

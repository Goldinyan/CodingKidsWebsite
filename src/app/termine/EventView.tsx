"use client";
import { useState, useEffect } from "react";
import {
  getAllEvents,
  addEvent,
  addUserToEvent,
  removeUserFromEvent,
  isUserInEvent,
} from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import { getUserData } from "@/lib/db";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import EventNavbar from "./EventNavbar";
import EventAdd from "./EventAdd";
import { EventData } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, Ban, AlertTriangle, Loader2 } from "lucide-react";

interface Event {
  uid: string;
  name: string;
  date: string;
  length: number;
  memberCount: number;
  place: string[];
  typeOfEvent: string;
  users: [];
  queue: [];
}

export default function EventViewHandlerAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const { user, loading } = useAuth();
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [premiumUser, setPremiumUser] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ [key: string]: boolean | string }>({
    showOnlyAvailable: false,
    showOnlyJoinable: false,
    course: "all",
  });

  useEffect(() => {
    if (!user) return;
    const checkPremiumStatus = async () => {
      const userData = await getUserData(user.uid);
      if (
        userData &&
        (userData.role === "premium" || userData.role === "admin")
      ) {
        setPremiumUser(true);
      } else {
        setPremiumUser(false);
      }
    };
    checkPremiumStatus();
  }, [user]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events: Event[] = (await getAllEvents()) as Event[];
      const now = new Date();
      const upcomingEvents = events
        .filter((event) => new Date(event.date) >= now)
        .slice(0, 10);
      setEvents(upcomingEvents);

      const statusMap: Record<string, string> = {};
      for (const event of upcomingEvents) {
        statusMap[event.uid] = "loading"; // Initialstatus
        try {
          const status = await isUserInEvent(event.uid, user?.uid || "");
          statusMap[event.uid] = status;
        } catch (error) {
          console.log(error);
          statusMap[event.uid] = "error";
        }
      }
      setStatuses({ ...statusMap });
    };

    fetchEvents();
  }, []);

  const handleEvents = async (eventId: string, action: "join" | "leave") => {
    if (!user) return;

    try {
      if (action === "join") {
        await addUserToEvent(eventId, user.uid);
      } else {
        await removeUserFromEvent(eventId, user.uid);
      }
      setStatuses((prev) => ({
        ...prev,
        [eventId]: action === "join" ? "User" : "false",
      }));
    } catch (error) {
      console.error("Error handling event:", error);
    }
  };

  const checkIfEventIsInRange = (eventDate: Date): boolean => {
    const now = new Date();
    const deadline = new Date();

    const allowedDays = premiumUser ? 21 : 14;
    deadline.setDate(now.getDate() + allowedDays);

    return eventDate >= now && eventDate <= deadline;
  };

  return (
    <div className="flex items-center flex-col gap-4 p-6 ">
      <EventNavbar
        callback={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
      />
      {events.map((event) => {
        const status = statuses[event.uid];

        const statusIcon = {
          loading: <Loader2 className="animate-spin w-4 h-4" />,
          User: <Check className="text-green-500 w-4 h-4" />,
          Queue: <Clock className="text-yellow-500 w-4 h-4" />,
          false: <Ban className="text-red-500 w-4 h-4" />,
          error: <AlertTriangle className="text-orange-500 w-4 h-4" />,
        }[status];

        const isInEvent = status === "User" || status === "Queue";
        const tooEarly = !checkIfEventIsInRange(new Date(event.date));
        const EndOfEvent = new Date(event.date);
        EndOfEvent.setMinutes(EndOfEvent.getMinutes() + event.length);

        const isEventFull = event.users.length >= event.memberCount;
        const RemainingUsers = event.memberCount - event.users.length;
        return (
          <Card
            key={event.uid}
            className="border border-primaryOwn shadow-sm w-full "
          >
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <Badge className="rounded-4 bg-white border border-primaryOwn p-2">
                {statusIcon}
              </Badge>
            </CardHeader>

            <CardContent className="text-sm space-y-2">
              <div className="flex flex-col text-muted-foreground">
                {event.place.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>

              <div className="flex flex-col">
                <p className="text-base font-semibold text-primary">
                  {new Date(event.date).toLocaleString("de-DE", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}

                  {new Date(EndOfEvent).toLocaleString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Freie Plätze:{" "}
                  <span className="font-medium text-foreground">
                    {RemainingUsers}
                  </span>
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className={`${
                  tooEarly ? "cursor-not-allowed border border-primaryOwn" : ""
                }`}
                variant={
                  !tooEarly
                    ? isInEvent
                      ? "destructive"
                      : "default"
                    : "secondary"
                }
                onClick={() => {
                  if (!tooEarly) {
                    handleEvents(event.uid, isInEvent ? "leave" : "join");
                  }
                }}
              >
                {!tooEarly
                  ? isInEvent
                    ? "Verlassen"
                    : "Beitreten"
                  : "Zu früh"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

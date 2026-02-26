"use client";
import { useState, useEffect } from "react";
import {
  getAllEvents,
  addEvent,
  addUserToEvent,
  removeUserFromEvent,
  isUserInEvent,
  getAllCoureses,
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
import EventAdd from "../dashboard/EventAdd";
import type { CourseData, EventData } from "@/BackEnd/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, Ban, AlertTriangle, Loader2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { setFips } from "crypto";

interface termineProps {
  searchParams: {
    selectedCourse?: string;
  };
}

export default function EventView({ searchParams }: termineProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const { user, loading } = useAuth();
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [premiumUser, setPremiumUser] = useState<boolean>(false);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [filters, setFilters] = useState<{
    [key: string]: boolean | string;
  }>({
    showOnlyAvailable: false,
    showOnlyJoinable: false,
    course: "",
    nameSort: "",
    dateSort: "",
  });

  useEffect(() => {
    if (!searchParams.selectedCourse) return;

    console.log(searchParams.selectedCourse);

    if (filters.course === searchParams.selectedCourse) return;
    setFilters((prev) => ({
      ...prev,
      course: searchParams.selectedCourse ?? "",
    }));
  }, [searchParams.selectedCourse]);

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
    const fetchCourses = async () => {
      const courses: CourseData[] = (await getAllCoureses()) as CourseData[];
      setCourses(courses);
    };

    fetchCourses();
    console.log(courses);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const events: EventData[] = (await getAllEvents()) as EventData[];
      const now = new Date();
      const normalizeDate = (d: any) =>
        d?.seconds ? new Date(d.seconds * 1000) : new Date(d);

      const upcomingEvents = events
        .filter((event) => normalizeDate(event.date) >= now)
        .slice(0, 10);

      const pastEvents = events.filter(
        (event) => normalizeDate(event.date) < now,
      );
      setUpcomingEvents(upcomingEvents);
      setPastEvents(pastEvents);

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
      console.log(statusMap);
    };

    fetchEvents();
  }, []);

  const handleEvents = async (eventId: string, action: "join" | "leave") => {
    console.log("handleEvent");
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

  const getSortedEvents = (events: EventData[]): EventData[] => {
    const sorted = [...events];
    const nameSort = filters["nameSort"] as string;
    const dateSort = filters["dateSort"] as string;

    // Sortiere nach Name falls aktiviert
    if (nameSort === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "de"));
    } else if (nameSort === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name, "de"));
    }

    // Sortiere nach Datum falls aktiviert (überschreibt Name-Sortierung)
    if (dateSort === "asc") {
      sorted.sort(
        (a, b) =>
          new Date(a.date.seconds * 1000).getTime() -
          new Date(b.date.seconds * 1000).getTime(),
      );
    } else if (dateSort === "desc") {
      sorted.sort(
        (a, b) =>
          new Date(b.date.seconds * 1000).getTime() -
          new Date(a.date.seconds * 1000).getTime(),
      );
    } else if (!dateSort) {
      // Standard: sortiere nach Datum aufsteigend
      sorted.sort(
        (a, b) =>
          new Date(a.date.seconds * 1000).getTime() -
          new Date(b.date.seconds * 1000).getTime(),
      );
    }

    return sorted;
  };

  const EventCard = ({
    event,
    isPast = false,
  }: {
    event: EventData;
    isPast?: boolean;
  }) => {
    const status = statuses[event.uid];
    const statusIcon = {
      loading: <Loader2 className="animate-spin w-4 h-4" />,
      User: <Check className="text-green-500 w-4 h-4" />,
      Queue: <Clock className="text-yellow-500 w-4 h-4" />,
      false: <Ban className="text-red-500 w-4 h-4" />,
      error: <AlertTriangle className="text-orange-500 w-4 h-4" />,
    }[status];

    const isInEvent = status === "User" || status === "Queue";
    const tooEarly = !checkIfEventIsInRange(
      new Date(event.date.seconds * 1000),
    );
    const EndOfEvent = new Date(event.date.seconds * 1000);
    EndOfEvent.setMinutes(EndOfEvent.getMinutes() + event.length);
    const RemainingUsers = event.memberCount - event.users.length;

    return (
      <Card
        key={event.uid}
        className="border border-primaryOwn shadow-sm w-full"
      >
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{event.name}</h3>
          {!isPast && (
            <Badge className="rounded-4 bg-white border border-primaryOwn p-2">
              {statusIcon}
            </Badge>
          )}
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
            {!isPast && (
              <p className="text-sm text-muted-foreground">
                Freie Plätze:{" "}
                <span className="font-medium text-foreground">
                  {RemainingUsers}
                </span>
              </p>
            )}
          </div>
        </CardContent>

        {!isPast && (
          <CardFooter>
            <Button
              className={`${tooEarly ? "cursor-not-allowed border border-primaryOwn" : ""}`}
              disabled={tooEarly}
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
              {!tooEarly ? (isInEvent ? "Verlassen" : "Beitreten") : "Zu früh"}
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="flex items-center flex-col gap-4 p-6 pt-20">
      <EventNavbar
        callback={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        filters={filters}
        courses={courses}
      />

      {upcomingEvents.length > 0 && (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3 mt-6">
            <h2 className="text-2xl font-bold text-primary">Kommende Events</h2>
            <Badge className="bg-primaryOwn text-white">
              {upcomingEvents.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {getSortedEvents(upcomingEvents).map((event) => (
              <EventCard key={event.uid} event={event} isPast={false} />
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="w-full space-y-4 mt-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-muted-foreground">
              Vergangene Events
            </h2>
            <Badge variant="outline">{pastEvents.length}</Badge>
          </div>
          <div className="space-y-4">
            {getSortedEvents(pastEvents).map((event) => (
              <EventCard key={event.uid} event={event} isPast={true} />
            ))}
          </div>
        </div>
      )}

      {upcomingEvents.length === 0 && pastEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-lg text-muted-foreground">Keine Events gefunden</p>
        </div>
      )}
    </div>
  );
}

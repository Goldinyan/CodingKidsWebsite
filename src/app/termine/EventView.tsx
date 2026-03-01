"use client";
import { useState, useEffect } from "react";
import {
  getAllEvents,
  addUserToEvent,
  removeUserFromEvent,
  isUserInEvent,
  getAllCoureses,
} from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import { getUserData } from "@/lib/db";

import EventNavbar from "./EventNavbar";
import type { CourseData, EventData } from "@/BackEnd/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Clock,
  Ban,
  AlertTriangle,
  Loader2,
  Calendar,
  MapPin,
  Users,
  UserRoundX,
} from "lucide-react";
import { toJsDate } from "@/BackEnd/utils";
import { motion } from "framer-motion";
import { defaults } from "joi";

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

  const getHoverMessage = (status: string): string => {
    switch (status) {
      case "loading":
        return "Der Status dieses Events wird derzeit geladen.";
      case "User":
        return "Sie sind als Teilnehmer:in für dieses Event eingetragen.";
      case "Queue":
        return "Sie befinden sich in der Warteschlange für dieses Event.";
      case "false":
        return "Sie sind nicht als Teilnehmer:in für dieses Event registriert.";
      case "Error":
        return "Beim Laden dieses Events ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.";
      default:
        return "Unbekannter Status.";
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
      loading: <Loader2 className="animate-spin w-7 h-7" />,
      User: <Check className="text-green-400 w-7 h-7" />,
      Queue: <Clock className="text-yellow-400 w-7 h-7" />,
      false: <UserRoundX className="text-red-400 w-7 h-7" />,
      error: <AlertTriangle className="text-orange-400 w-7 h-7" />,
    }[status];

    const isInEvent = status === "User" || status === "Queue";
    const tooEarly = !checkIfEventIsInRange(
      new Date(event.date.seconds * 1000),
    );
    const EndOfEvent = new Date(event.date.seconds * 1000);
    EndOfEvent.setMinutes(EndOfEvent.getMinutes() + event.length);

    return (
      <div>
        <div className="flex items-start justify-between mb-4">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {event.difficulty}
          </span>
          <span className="ml-auto mr-10 mt-3 text-sm text-gray-500">
            {event.typeOfEvent}
          </span>
          {!isPast && (
            <div className="group relative">
              <div className="rounded-full p-2 bg-white border border-gray-400">
                {statusIcon}
              </div>

              <div className="absolute left-1/4 -translate-x-50 w-50 mt-2 hidden group-hover:flex bg-white p-2 rounded-md shadow-md">
                {getHoverMessage(status)}
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-3">{event.name}</h3>
        <p className="text-sm text-gray-600 mb-4  line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-fourthOwn" />
            <p className="">
              {toJsDate(event.date).toLocaleString("de-DE", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {toJsDate(EndOfEvent).toLocaleString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {event.place && (
            <div className="flex justify-start items-start gap-2">
              <MapPin className="w-4 h-4 text-fourthOwn" />
              <div className="flex flex-col ">
                {event.place.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-fourthOwn" />
            <span>
              {event.users?.length + (event.queue?.length || 0)}/
              {event.memberCount} Plätze belegt
            </span>
          </div>
        </div>

        {!isPast && (
          <Button
            className={`${tooEarly ? "cursor-not-allowed border border-primaryOwn" : ""}`}
            disabled={tooEarly}
            variant={
              !tooEarly ? (isInEvent ? "destructive" : "default") : "secondary"
            }
            onClick={() => {
              if (!tooEarly) {
                handleEvents(event.uid, isInEvent ? "leave" : "join");
              }
            }}
          >
            {!tooEarly ? (isInEvent ? "Verlassen" : "Beitreten") : "Zu früh"}
          </Button>
        )}
      </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getSortedEvents(upcomingEvents).map((event, idx) => (
              <motion.div
                key={event.uid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <EventCard key={event.uid} event={event} isPast={false} />
              </motion.div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getSortedEvents(pastEvents).map((event, idx) => (
              <motion.div
                key={event.uid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <EventCard key={event.uid} event={event} isPast={false} />
              </motion.div>
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

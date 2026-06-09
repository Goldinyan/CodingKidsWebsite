"use client";

import { useState, useEffect } from "react";
import {
  getAllEvents,
  addUserToEvent,
  removeUserFromEvent,
  isUserInEvent,
  getAllCourses,
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
  ChevronRight,
  ChevronLeft,
  Users,
  UserRoundX,
  ArrowDown,
} from "lucide-react";
import { toJsDate } from "@/BackEnd/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function EventView() {
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const { user, loading, userRole } = useAuth();
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

  const { theme, isRounded } = useTheme();
  /*
  useEffect(() => {
    if (!searchParams.selectedCourse) return;

    console.log(searchParams.selectedCourse);

    if (filters.course === searchParams.selectedCourse) return;
    setFilters((prev) => ({
      ...prev,
      course: searchParams.selectedCourse ?? "",
    }));
  }, [searchParams.selectedCourse]);
  */

  useEffect(() => {
    if (!user) return;
    const checkPremiumStatus = async () => {
      const userData = await getUserData(user.uid);
      if (userData && userData.role === "admin") {
        setPremiumUser(true);
      } else {
        setPremiumUser(false);
      }
    };
    checkPremiumStatus();
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses: CourseData[] = (await getAllCourses(
        user?.uid || "anonymous",
        userRole,
      )) as CourseData[];
      setCourses(courses);
    };

    fetchCourses();
    console.log(courses);
  }, [user?.uid, userRole]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events: EventData[] = (await getAllEvents(
        user?.uid || "anonymous",
        userRole,
      )) as EventData[];
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
          const status = await isUserInEvent(
            event.uid,
            user?.uid || "",
            user?.uid || "anonymous",
            userRole,
          );
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
        await addUserToEvent(eventId, user.uid, user.uid, userRole);
      } else {
        await removeUserFromEvent(eventId, user.uid, user.uid, userRole);
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

    if (filters.course != "") {
      sorted.filter((a) => a.course == filters.course);
    }

    if (nameSort === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "de"));
    } else if (nameSort === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name, "de"));
    }

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
    isPast: boolean;
  }) => {
    const [showAllPlaces, setShowAllPlaces] = useState(false);

    const status = statuses[event.uid];
    const isInEvent = status === "User" || status === "Queue";
    const tooEarly = !checkIfEventIsInRange(toJsDate(event.date));
    const EndOfEvent = toJsDate(event.date);

    const statusIcon = {
      loading: <Loader2 className="animate-spin w-5 h-5 text-zinc-400" />,
      User: (
        <Check className="text-emerald-500 dark:text-emerald-400 w-5 h-5" />
      ),
      Queue: <Clock className="text-amber-500 dark:text-amber-400 w-5 h-5" />,
      false: (
        <UserRoundX className="text-rose-500 dark:text-rose-400 w-5 h-5" />
      ),
      error: (
        <AlertTriangle className="text-orange-500 dark:text-orange-400 w-5 h-5" />
      ),
    }[status];

    const cardClass =
      theme === "dark"
        ? "bg-white/5 border-zinc-800 text-white"
        : "bg-zinc-50 border-zinc-200 text-black";

    const badgeClass =
      theme === "dark"
        ? "bg-white/10 text-zinc-300"
        : "bg-zinc-200/60 text-zinc-700";

    const textMutedClass = theme === "dark" ? "text-zinc-400" : "text-zinc-500";
    const textBodyClass = theme === "dark" ? "text-white" : "text-zinc-700";
    const iconClass = theme === "dark" ? "text-zinc-500" : "text-zinc-400";

    const getButtonClass = () => {
      if (tooEarly)
        return "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50";
      if (isInEvent) {
        return theme === "dark"
          ? "bg-rose-950/40 text-rose-400 border border-rose-900/50 hover:bg-rose-900/30"
          : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100";
      }
      return theme === "dark"
        ? "bg-white text-black hover:bg-zinc-200"
        : "bg-black text-white hover:bg-zinc-800";
    };

    return (
      <div
        className={`flex flex-col h-full p-6 border backdrop-blur-2xl transition-colors duration-200 ${cardClass} ${isRounded ? "rounded-2xl" : "rounded-none"}`}
      >
        <div className="flex items-start justify-between mb-4">
          <span
            className={`text-xs font-semibold px-3 py-1 ${badgeClass} ${isRounded ? "rounded-full" : "rounded-none"}`}
          >
            {event.difficulty}
          </span>
          {isPast && (
            <span className={`ml-auto mr-4 mt-1 text-sm ${textMutedClass}`}>
              {event.typeOfEvent}
            </span>
          )}
          {!isPast && (
            <div className="group relative">
              <div
                className={`p-2 border backdrop-blur-md bg-transparent ${theme === "dark" ? "border-zinc-800" : "border-zinc-300"} ${isRounded ? "rounded-full" : "rounded-none"}`}
              >
                {statusIcon}
              </div>
              <div
                className={`absolute right-0 top-full mt-2 hidden group-hover:flex min-w-50 p-5 border text-xs shadow-xl z-10 backdrop-blur-md ${theme === "dark"
                    ? "bg-zinc-950 border-zinc-800 text-zinc-300"
                    : "bg-white border-zinc-200 text-zinc-600"
                  } ${isRounded ? "rounded-md" : "rounded-none"}`}
              >
                {getHoverMessage(status)}
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold mb-2 tracking-tight">{event.name}</h3>
        <p
          className={`text-sm font-light mb-4 leading-relaxed ${textMutedClass}`}
        >
          {event.description}
        </p>

        <div className="flex-grow" />

        <div className={`space-y-3 mb-6 text-sm font-light ${textBodyClass}`}>
          <div className="flex items-center gap-2.5">
            <Calendar className={`w-4 h-4 shrink-0 ${iconClass}`} />
            <p>
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

          {event.place && event.place.length > 0 && (
            <div className="flex justify-start items-start gap-2.5">
              <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} />
              <div className="flex flex-col flex-1 overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  {showAllPlaces ? (
                    <motion.div
                      key="all-places"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: "tween",
                        ease: "easeInOut",
                        duration: 0.2,
                      }}
                      className="space-y-0.5"
                    >
                      {event.place.map((line: string, index: number) => (
                        <p key={index}>{line}</p>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.p
                      key="single-place"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="truncate"
                    >
                      {event.place[0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {event.place.length > 1 && (
                <motion.button
                  onClick={() => setShowAllPlaces(!showAllPlaces)}
                  className={`p-1 border flex items-center justify-center transition-colors duration-200 ${theme === "dark"
                      ? "border-zinc-800 hover:bg-white/5"
                      : "border-zinc-200 hover:bg-zinc-100"
                    } ${isRounded ? "rounded" : "rounded-none"}`}
                  animate={{ rotate: showAllPlaces ? 90 : 0 }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.2,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <Users className={`w-4 h-4 shrink-0 ${iconClass}`} />
            <span>
              {event.users?.length + (event.queue?.length || 0)} /{" "}
              {event.memberCount} Plätze belegt
            </span>
          </div>
        </div>

        {!isPast && (
          <Button
            disabled={tooEarly}
            onClick={() => {
              if (!tooEarly)
                handleEvents(event.uid, isInEvent ? "leave" : "join");
            }}
            className={`w-full py-2.5 font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-none ${getButtonClass()} ${isRounded ? "rounded-xl" : "rounded-none"
              }`}
          >
            {!tooEarly ? (isInEvent ? "Verlassen" : "Beitreten") : "Zu früh"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center flex-col gap-4 p-6 pt-5">
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
          <div className="grid min-h-100 grid-cols-1 md:grid-cols-3 gap-6">
            {getSortedEvents(upcomingEvents).map((event, idx) => (
              <motion.div
                key={event.uid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className=""
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
          <div className="grid min-h-100 grid-cols-1 md:grid-cols-3 gap-6">
            {getSortedEvents(pastEvents).map((event, idx) => (
              <motion.div
                key={event.uid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className=""
              >
                <EventCard key={event.uid} event={event} isPast={true} />
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

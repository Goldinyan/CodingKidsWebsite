"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  getAllMentors,
  getAllEvents,
  getAllCourses,
  getAllAnnouncements,
} from "@/lib/db";
import { useAuth } from "./AuthContext";
import {
  AnnouncementData,
  EventData,
  Mentor,
  CourseData,
} from "@/BackEnd/type";

interface DataContextType {
  loadingStates: {
    mentors: boolean;
    events: boolean;
    courses: boolean;
    announcements: boolean;
  };
  getMentors: () => Mentor[];
  getEvents: () => EventData[];
  getCourses: () => CourseData[];
  getAnnouncements: () => AnnouncementData[];
  refreshData: (
    type: "mentors" | "events" | "courses" | "announcements",
  ) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, userRole, loading: authLoading } = useAuth();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);

  const [loadingStates, setLoadingStates] = useState({
    mentors: false,
    events: false,
    courses: false,
    announcements: false,
  });

  const fetchedKeys = useRef<Record<string, string>>({
    mentors: "",
    events: "",
    courses: "",
    announcements: "",
  });

  // Cache-Reset bei Session-Wechsel
  useEffect(() => {
    if (authLoading) return;
    fetchedKeys.current = {
      mentors: "",
      events: "",
      courses: "",
      announcements: "",
    };
    setMentors([]);
    setEvents([]);
    setCourses([]);
    setAnnouncements([]);
  }, [user, userRole, authLoading]);

  const fetchSingleTarget = async (
    target: "mentors" | "events" | "courses" | "announcements",
    force = false,
  ) => {
    if (authLoading) return;
    const currentKey = user ? `${user.uid}-${userRole}` : "guest";

    if (!force && fetchedKeys.current[target] === currentKey) return;

    setLoadingStates((prev) => ({ ...prev, [target]: true }));
    try {
      fetchedKeys.current[target] = currentKey;

      if (target === "mentors") {
        const res = await getAllMentors(user?.uid, userRole);
        setMentors(res.sort((a: any, b: any) => a.id - b.id));
      } else if (target === "events") {
        const res = await getAllEvents(user?.uid, userRole) as EventData[];
        setEvents(res);
      } else if (target === "courses") {
        const res = await getAllCourses(user?.uid, userRole);
        setCourses(res);
      } else if (target === "announcements") {
        const res = await getAllAnnouncements(user?.uid, userRole);
        setAnnouncements(res);
      }
    } catch (error) {
      console.error(`Fehler beim Laden von ${target}:`, error);
      fetchedKeys.current[target] = "";
    } finally {
      setLoadingStates((prev) => ({ ...prev, [target]: false }));
    }
  };

  const getMentors = () => {
    if (mentors.length === 0) fetchSingleTarget("mentors");
    return mentors;
  };
  const getEvents = () => {
    if (events.length === 0) fetchSingleTarget("events");
    return events;
  };
  const getCourses = () => {
    if (courses.length === 0) fetchSingleTarget("courses");
    return courses;
  };
  const getAnnouncements = () => {
    if (announcements.length === 0) fetchSingleTarget("announcements");
    return announcements;
  };

  const refreshData = async (
    target: "mentors" | "events" | "courses" | "announcements",
  ) => {
    await fetchSingleTarget(target, true);
  };

  return (
    <DataContext.Provider
      value={{
        loadingStates,
        getMentors,
        getEvents,
        getCourses,
        getAnnouncements,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(DataContext);
  if (!context)
    throw new Error(
      "useAppData muss innerhalb eines DataProviders verwendet werden",
    );
  return context;
}

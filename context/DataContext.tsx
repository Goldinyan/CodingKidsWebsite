"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  getAllMentors,
  getAllEvents,
  getAllCourses,
  getAllAnnouncements,
  getAllUsers,
} from "@/lib/db";
import { useAuth } from "./AuthContext";
import {
  AnnouncementData,
  EventData,
  Mentor,
  CourseData,
  UserData,
} from "@/BackEnd/type";
import { useNotificationToast } from "@/hooks/useNotificationToast";

interface DataContextType {
  loadingStates: {
    mentors: boolean;
    events: boolean;
    courses: boolean;
    announcements: boolean;
    users: boolean;
  };
  getMentors: () => Mentor[];
  getEvents: () => EventData[];
  getCourses: () => CourseData[];
  getAnnouncements: () => AnnouncementData[];
  getUsers: () => UserData[];
  refreshData: (
    type: "mentors" | "events" | "courses" | "announcements" | "users",
  ) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, userRole, loading: authLoading } = useAuth();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);

  const { showErrorToast } = useNotificationToast();

  const [loadingStates, setLoadingStates] = useState({
    mentors: false,
    events: false,
    courses: false,
    announcements: false,
    users: false,
  });

  const fetchedKeys = useRef<Record<string, string>>({
    mentors: "",
    events: "",
    courses: "",
    announcements: "",
    users: "",
  });

  const isFetching = useRef<Record<string, boolean>>({
    mentors: false,
    events: false,
    courses: false,
    announcements: false,
    users: false,
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isInitialized.current) {
      isInitialized.current = true;
      return; 
    }
    // beim aller ersten nicht leeren

    console.log(
      `[DataContext] Dynamischer Rollenwechsel erkannt! Neuer State: ${userRole}. Cache wird geleert...`,
    );

    fetchedKeys.current = {
      mentors: "",
      events: "",
      courses: "",
      announcements: "",
      users: "",
    };
    isFetching.current = {
      mentors: false,
      events: false,
      courses: false,
      announcements: false,
      users: false,
    };

    setMentors([]);
    setEvents([]);
    setCourses([]);
    setUsers([]);
    setAnnouncements([]);
  }, [userRole, authLoading]);

  const fetchSingleTarget = async (
    target: "mentors" | "events" | "courses" | "announcements" | "users",
    force = false,
  ) => {
    if (authLoading || (user && !userRole)) return;

    const currentKey = user ? `${user.uid}-${userRole}` : "guest";

    // wenn key überstimtm oder bereits fetching läuft, dann return
    if (
      !force &&
      (fetchedKeys.current[target] === currentKey || isFetching.current[target])
    )
      return;

    // Synchron direkt blockieren, bevor irgendetwas asynchrones passiert
    fetchedKeys.current[target] = currentKey;
    isFetching.current[target] = true;

    setTimeout(async () => {
      setLoadingStates((prev) => ({ ...prev, [target]: true }));

      try {
        if (target === "mentors") {
          const res = await getAllMentors(user?.uid, userRole);
          setMentors(res.sort((a: any, b: any) => a.id - b.id));
        } else if (target === "events") {
          const res = (await getAllEvents(user?.uid, userRole)) as EventData[];
          setEvents(res);
        } else if (target === "courses") {
          const res = await getAllCourses(user?.uid, userRole);
          setCourses(res);
        } else if (target === "announcements") {
          const res = await getAllAnnouncements(user?.uid, userRole);
          setAnnouncements(res);
        } else if (target === "users") {
          const res = await getAllUsers(user?.uid, userRole);
          setUsers(res);
        }
      } catch (error) {
        showErrorToast(`Fehler beim Laden von ${target}: ${error}`);
        // Nur bei echtem Fehler zurücksetzen
        fetchedKeys.current[target] = "";
      } finally {
        setLoadingStates((prev) => ({ ...prev, [target]: false }));
        isFetching.current[target] = false;
      }
    }, 0);
  };

  const getMentors = () => {
    if (mentors.length === 0 && !isFetching.current["mentors"])
      fetchSingleTarget("mentors");
    return mentors;
  };
  const getEvents = () => {
    if (events.length === 0 && !isFetching.current["events"])
      fetchSingleTarget("events");
    return events;
  };
  const getCourses = () => {
    if (courses.length === 0 && !isFetching.current["courses"])
      fetchSingleTarget("courses");
    return courses;
  };
  const getAnnouncements = () => {
    if (announcements.length === 0 && !isFetching.current["announcements"])
      fetchSingleTarget("announcements");
    return announcements;
  };
  const getUsers = () => {
    if (users.length === 0 && !isFetching.current["users"])
      fetchSingleTarget("users");
    return users;
  };

  const refreshData = async (
    target: "mentors" | "events" | "courses" | "announcements" | "users",
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
        getUsers,
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

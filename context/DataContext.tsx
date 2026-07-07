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

  // Cache-Reset bei Session-Wechsel -> auto reset
  useEffect(() => {
    if (authLoading) return;
    fetchedKeys.current = {
      mentors: "",
      events: "",
      courses: "",
      announcements: "",
      users: "",
    };
    setMentors([]);
    setEvents([]);
    setCourses([]);
    setUsers([]);
    setAnnouncements([]);
  }, [user, userRole, authLoading]);

  const fetchSingleTarget = async (
    target: "mentors" | "events" | "courses" | "announcements" | "users",
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

  const getUsers = () => {
    if (users.length === 0) fetchSingleTarget("users");
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

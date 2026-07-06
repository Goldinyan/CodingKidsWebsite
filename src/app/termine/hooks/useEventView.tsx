// hooks/useEventView.ts
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import {
  getAllEvents,
  getAllCourses,
  isUserInEvent,
  addUserToEvent,
  removeUserFromEvent,
} from "@/lib/db";
import { Timestamp } from "firebase/firestore";
import { EventData, CourseData, EventStatus } from "@/BackEnd/type";

export function useEventView() {
  const { user, userRole, userData, loading } = useAuth();
  const { showErrorToast } = useNotificationToast();
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [filteredUpcomingEvents, setFilteredUpcomingEvents] = useState<
    EventData[]
  >([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const [statuses, setStatuses] = useState<Record<string, EventStatus>>({});
  const [premiumUser, setPremiumUser] = useState<boolean>(false);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [filters, setFilters] = useState<Record<string, string | boolean>>({
    showOnlyAvailable: false,
    showOnlyJoinable: false,
    course: "",
    nameSort: "",
    dateSort: "",
    joinableOnly: false,
  });

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !userData) return;
    setPremiumUser(
      userData.role === "admin" ||
      userData.role == "mentor" ||
      userData.role == "member",
    );
  }, [userData, user]);

  useEffect(() => {
    if (loading) return;

    if (user) {
      const currentKey = `${user.uid}-${userRole}`;
      if (hasFetched.current === currentKey) return;

      hasFetched.current = currentKey;
    }

    const fetchCourses = async () => {
      const allCourses = (await getAllCourses(
        user?.uid,
        userRole,
      )) as CourseData[];
      setCourses(allCourses);
    };
    fetchCourses();

    const fetchEvents = async () => {
      const events: EventData[] = (await getAllEvents(
        user?.uid ?? "",
        userRole,
      )) as EventData[];

      const now = new Date();

      const normalizeDate = (
        d: Timestamp | Date | string | null | undefined,
      ) => {
        if (!d) return new Date(0);

        if (typeof d === "object" && "seconds" in d) {
          return new Date(d.seconds * 1000);
        }

        return new Date(d);
      };

      const upcoming = events
        .filter((event) => normalizeDate(event.date) >= now)
        .sort(
          (a, b) =>
            normalizeDate(a.date).getTime() - normalizeDate(b.date).getTime(),
        )
        .slice(0, 10);

      const past = events.filter((event) => normalizeDate(event.date) < now);

      setUpcomingEvents(upcoming);
      setPastEvents(past);

      const statusMap: Record<string, EventStatus> = {};
      for (const event of upcoming) {
        statusMap[event.uid] = EventStatus.Loading;
        if (!user) {
          statusMap[event.uid] = EventStatus.NotRegistered;
          continue;
        }
        try {
          const status = await isUserInEvent(event.uid, user.uid, userRole);
          statusMap[event.uid] = status;
        } catch (error) {
          showErrorToast(error);
          statusMap[event.uid] = EventStatus.Error;
        }
      }
      setStatuses({ ...statusMap });
    };

    fetchEvents();
  }, [userRole, user?.uid, user, loading]);

  const getSortedEvents = (events: EventData[]): EventData[] => {
    let sorted = [...events];
    const nameSort = filters["nameSort"];
    const dateSort = filters["dateSort"];
    const joinableOnly = filters["joinableOnly"] as boolean;

    if (filters.course && filters.course !== "") {
      sorted = sorted.filter((a) => a.course === filters.course);
    }

    if (joinableOnly) {
      sorted = sorted.filter((event) => {
        const taken = (event.users?.length || 0) + (event.queue?.length || 0);
        const left = event.memberCount - taken;
        return left > 0;
      });
    }

    if (nameSort === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "de"));
    } else if (nameSort === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name, "de"));
    }

    if (dateSort === "asc") {
      sorted.sort((a, b) => (a.date.seconds || 0) - (b.date.seconds || 0));
    } else if (dateSort === "desc") {
      sorted.sort((a, b) => (b.date.seconds || 0) - (a.date.seconds || 0));
    } else if (!dateSort) {
      sorted.sort((a, b) => (a.date.seconds || 0) - (b.date.seconds || 0));
    }

    return sorted;
  };

  useEffect(() => {
    setFilteredUpcomingEvents(getSortedEvents(upcomingEvents));
  }, [
    filters.course,
    filters.nameSort,
    filters.dateSort,
    filters.joinableOnly,
    upcomingEvents,
  ]);

  const handleEvents = async (
    eventId: string,
    action: "join" | "leave",
    toast: (customConfig?: any) => void,
  ) => {
    if (!user) {
      toast({
        title: "Fehler",
        description:
          "Du musst eingeloggt sein, um dich für ein Event anzumelden.",
      });
      return;
    }
    try {
      if (action === "join") {
        await addUserToEvent(eventId, user.uid, user.uid, userRole);
      } else {
        await removeUserFromEvent(eventId, user.uid, user.uid, userRole);
      }
      setStatuses((prev) => ({
        ...prev,
        [eventId]:
          action === "join" ? EventStatus.User : EventStatus.NotRegistered,
      }));
    } catch (error) {
      showErrorToast(error);
    }
  };

  const checkIfEventIsInRange = (eventDate: Date): boolean => {
    const now = new Date();
    const deadline = new Date();
    const allowedDays = premiumUser ? 21 : 14;
    deadline.setDate(now.getDate() + allowedDays);
    return eventDate >= now && eventDate <= deadline;
  };

  return {
    upcomingEvents,
    filteredUpcomingEvents,
    pastEvents,
    courses,
    filters,
    setFilters,
    statuses,
    handleEvents,
    checkIfEventIsInRange,
    getSortedEvents,
  };
}

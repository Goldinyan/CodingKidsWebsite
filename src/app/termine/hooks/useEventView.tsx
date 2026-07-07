// hooks/useEventView.ts
import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/DataContext";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { addUserToEvent, removeUserFromEvent } from "@/lib/db";
import { toJsDate } from "@/BackEnd/utils";
import { EventData, EventStatus } from "@/BackEnd/type";

export function useEventView() {
  const { user, userRole, userData } = useAuth();
  const { getEvents, getCourses, refreshData } = useAppData();
  const { showErrorToast, showFetchError } = useNotificationToast();

  const [filters, setFilters] = useState<Record<string, string | boolean>>({
    showOnlyAvailable: false,
    showOnlyJoinable: false,
    course: "",
    nameSort: "",
    dateSort: "",
    joinableOnly: false,
  });

  const allEvents = getEvents();
  const courses = getCourses();

  const premiumUser = useMemo(() => {
    if (!userData?.role) return false;
    return ["admin", "mentor", "member"].includes(userData.role);
  }, [userData?.role]);

  const { upcoming: upcomingEvents, past: pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming: EventData[] = [];
    const past: EventData[] = [];

    allEvents.forEach((event) => {
      const eventDate = toJsDate(event.date);
      if (eventDate >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    return { upcoming, past };
  }, [allEvents]);

  const filteredUpcomingEvents = useMemo(() => {
    let sorted = [...upcomingEvents];
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
      sorted.sort(
        (a, b) => toJsDate(a.date).getTime() - toJsDate(b.date).getTime(),
      );
    } else if (dateSort === "desc") {
      sorted.sort(
        (a, b) => toJsDate(b.date).getTime() - toJsDate(a.date).getTime(),
      );
    } else {
      sorted.sort(
        (a, b) => toJsDate(a.date).getTime() - toJsDate(b.date).getTime(),
      );
    }

    return sorted.slice(0, 10);
  }, [upcomingEvents, filters]);

  const statuses = useMemo(() => {
    const map: Record<string, EventStatus> = {};

    upcomingEvents.forEach((event: EventData) => {
      if (!user?.uid) {
        map[event.uid] = EventStatus.NotRegistered;
        return;
      }

      const isUser = event.users?.includes(user.uid);
      const isQueue = event.queue?.includes(user.uid);

      if (isUser) {
        map[event.uid] = EventStatus.User;
      } else if (isQueue) {
        map[event.uid] = EventStatus.Queue;
      } else {
        map[event.uid] = EventStatus.NotRegistered;
      }
    });

    return map;
  }, [upcomingEvents, user?.uid]);

  const handleEvents = async (eventId: string, action: "join" | "leave") => {
    if (!user) {
      showFetchError(
        "Du musst eingeloggt sein, um dich für ein Event anzumelden.",
      );
      return;
    }

    try {
      if (action === "join") {
        await addUserToEvent(eventId, user.uid, user.uid, userRole);
      } else {
        await removeUserFromEvent(eventId, user.uid, user.uid, userRole);
      }

      await refreshData("events");
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

  const filteredPastEvents = useMemo(() => {
    let sorted = [...pastEvents];
    const nameSort = filters["nameSort"];
    const dateSort = filters["dateSort"];

    if (filters.course && filters.course !== "") {
      sorted = sorted.filter((a) => a.course === filters.course);
    }

    if (nameSort === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "de"));
    } else if (nameSort === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name, "de"));
    }

    if (dateSort === "asc") {
      sorted.sort(
        (a, b) => toJsDate(a.date).getTime() - toJsDate(b.date).getTime(),
      );
    } else if (dateSort === "desc") {
      sorted.sort(
        (a, b) => toJsDate(b.date).getTime() - toJsDate(a.date).getTime(),
      );
    } else {
      sorted.sort(
        (a, b) => toJsDate(b.date).getTime() - toJsDate(a.date).getTime(),
      );
    }

    return sorted.slice(0, 10);
  }, [pastEvents, filters]);

  return {
    upcomingEvents,
    filteredUpcomingEvents,
    pastEvents,
    filteredPastEvents,
    courses,
    filters,
    setFilters,
    statuses,
    handleEvents,
    checkIfEventIsInRange,
  };
}

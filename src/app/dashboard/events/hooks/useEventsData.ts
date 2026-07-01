import { useCallback, useEffect, useState } from "react";
import type { EventData, UserRole } from "@/BackEnd/type";
import { getAllEvents } from "@/lib/db";

export function useEventsData(userId: string | undefined, userRole: UserRole) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = (await getAllEvents(
        userId || "anonymous",
        userRole,
      )) as EventData[];
      setEvents(data);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { events, setEvents, refresh, isLoading, error };
}


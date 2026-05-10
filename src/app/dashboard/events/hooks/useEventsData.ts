import { useCallback, useEffect, useState } from "react";
import type { EventData } from "@/BackEnd/type";
import { getAllEvents } from "@/lib/db";

export function useEventsData(userId: string | undefined, userRole: unknown) {
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


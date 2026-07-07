import { useMemo } from "react";
import type { EventData, UserData } from "@/BackEnd/type";
import { useAppData } from "@/context/DataContext"; // Pfad anpassen

type UserIdSelector = (event: EventData) => string[];

export function useEventUsersMap(
  events: EventData[],
  selectIds: UserIdSelector,
) {
  const { getUsers } = useAppData();

  const safeUsers = getUsers();

  return useMemo(() => {
    const next: Record<string, UserData[]> = {};

    if (events.length === 0 || safeUsers.length === 0) {
      return next;
    }

    for (const event of events) {
      const ids = new Set(selectIds(event));
      next[event.uid] = safeUsers.filter((u) => ids.has(u.uid));
    }

    return next;
  }, [events, safeUsers, selectIds]);
}

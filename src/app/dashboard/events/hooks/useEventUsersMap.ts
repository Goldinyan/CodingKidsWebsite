import { useEffect, useState } from "react";
import type { EventData, UserData, UserRole } from "@/BackEnd/type";
import { getAllUsers } from "@/lib/db";

type UserIdSelector = (event: EventData) => string[];

export function useEventUsersMap(
  events: EventData[],
  userId: string | undefined,
  userRole: UserRole,
  selectIds: UserIdSelector,
) {
  const [map, setMap] = useState<Record<string, UserData[]>>({});

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (events.length === 0) {
        setMap({});
        return;
      }

      const allUsers = await getAllUsers(userId || "anonymous", userRole);
      const safeUsers = (allUsers || []) as UserData[];

      const next: Record<string, UserData[]> = {};
      for (const event of events) {
        const ids = new Set(selectIds(event));
        next[event.uid] = safeUsers.filter((u) => ids.has(u.uid));
      }

      if (!cancelled) setMap(next);
    };

    run().catch((e) => {
      console.error("Fehler beim Laden der User für Events:", e);
      if (!cancelled) setMap({});
    });

    return () => {
      cancelled = true;
    };
  }, [events, userId, userRole, selectIds]);

  return map;
}


import { useMemo } from "react";
import type { EventData } from "@/BackEnd/type";
import { toJsDate } from "@/BackEnd/utils";
import type { EventTimeFilter } from "../constants";

export function useFilteredEvents(
  events: EventData[],
  time: EventTimeFilter,
  search: string,
  limit = 10,
) {
  return useMemo(() => {
    let filtered = events;

    const now = new Date();
    filtered =
      time === "Upcoming"
        ? filtered.filter((e) => toJsDate(e.date) >= now)
        : filtered.filter((e) => toJsDate(e.date) <= now);

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      filtered = filtered.filter((e) => e.name.toLowerCase().includes(s));
    }

    return filtered.slice(0, limit);
  }, [events, time, search, limit]);
}


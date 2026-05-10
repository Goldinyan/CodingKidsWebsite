import { useMemo } from "react";
import type { AnnouncementData } from "@/BackEnd/type";

export function useFilteredAnnouncements(announcements: AnnouncementData[], search: string) {
  return useMemo(() => {
    if (!search.trim()) return announcements;
    const s = search.toLowerCase();
    return announcements.filter(
      (a) => a.title.toLowerCase().includes(s) || a.content.toLowerCase().includes(s),
    );
  }, [announcements, search]);
}


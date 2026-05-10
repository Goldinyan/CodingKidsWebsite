import { useCallback, useEffect, useState } from "react";
import type { AnnouncementData } from "@/BackEnd/type";
import { getAllAnnouncements } from "@/lib/db/announcements";

export function useAnnouncementsData(userId: string | undefined, userRole: unknown) {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllAnnouncements(userId || "anonymous", userRole as any);
      setAnnouncements(data || []);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { announcements, setAnnouncements, refresh, isLoading, error };
}


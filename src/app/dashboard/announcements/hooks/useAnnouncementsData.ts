// hooks/useAnnouncementsData.ts
import { useCallback } from "react";
import { useAppData } from "@/context/DataContext";

export function useAnnouncementsData() {
  const { getAnnouncements, refreshData, loadingStates } = useAppData();

  const announcements = getAnnouncements();

  const refresh = useCallback(async () => {
    await refreshData("announcements");
  }, [refreshData]);

  return {
    announcements,
    refresh,
    isLoading: loadingStates.announcements && announcements.length === 0,
  };
}

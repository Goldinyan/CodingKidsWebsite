import { useCallback } from "react";
import { useAppData } from "@/context/DataContext";
import { useMemo } from "react";

export function useMentorsData() {
  const { getUsers, refreshData, loadingStates } = useAppData();

  const users = getUsers();

  const mentors = useMemo(() => {
    return users.filter((user) => user.role === "mentor" || user.role === "admin");
  }, [users]);

  const refresh = useCallback(async () => {
    await refreshData("mentors");
  }, [refreshData]);

  return {
    mentors,
    refresh,
    isLoading: loadingStates.mentors && mentors.length === 0,
  };
}

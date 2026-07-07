// hooks/useCoursesData.ts
import { useCallback } from "react";
import { useAppData } from "@/context/DataContext";

export function useCoursesData() {
  const { getCourses, refreshData, loadingStates } = useAppData();

  const courses = getCourses();

  const refresh = useCallback(async () => {
    await refreshData("courses");
  }, [refreshData]);

  return {
    courses,
    refresh,
    isLoading: loadingStates.courses && courses.length === 0,
    error: null,
  };
}

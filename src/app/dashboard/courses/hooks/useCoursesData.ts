import { useCallback, useEffect, useState } from "react";
import type { CourseData } from "@/BackEnd/type";
import { getAllCourses } from "@/lib/db/courses";

export function useCoursesData(userId: string | undefined, userRole: unknown) {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllCourses(userId, (userRole || "user") as any);
      setCourses(data);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { courses, setCourses, refresh, isLoading, error };
}


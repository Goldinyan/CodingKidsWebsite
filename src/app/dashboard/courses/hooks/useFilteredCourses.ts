import { useMemo } from "react";
import type { CourseData } from "@/BackEnd/type";

export function useFilteredCourses(courses: CourseData[], search: string) {
  return useMemo(() => {
    const s = search.toLowerCase();
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(s) ||
        course.des.toLowerCase().includes(s) ||
        course.tags?.some((tag) => tag.toLowerCase().includes(s)),
    );
  }, [courses, search]);
}


"use client";

import { useEffect, useState } from "react";
import { getAllCoureses } from "@/lib/db";
import { CourseData } from "@/BackEnd/type";
import { BookOpen, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FeaturedCoursesView() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await getAllCoureses();
        // Take the first 3 courses
        setCourses(allCourses.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-8 py-16">
        <p className="text-2xl font-bold mb-8">Unsere Kurse</p>
        <p className="text-gray-500">Lädt...</p>
      </div>
    );
  }

  const courseIcons: { [key: string]: React.ReactNode } = {
    beginner: <BookOpen className="w-6 h-6" />,
    intermediate: <Zap className="w-6 h-6" />,
    advanced: <Zap className="w-6 h-6" />,
  };

  return (
    <div className="w-full px-8 py-16">
      <p className="text-3xl font-bold mb-2">Unsere Kurse</p>
      <p className="text-gray-600 mb-10">
        Von Anfänger bis Fortgeschrittene - für jeden Level das richtige
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <motion.div
            key={course.uid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
                {courseIcons[course.tags?.[0]?.toLowerCase()] || (
                  <BookOpen className="w-6 h-6" />
                )}
              </div>
              {course.tags && (
                <div className="flex gap-2">
                  {course.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.des}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-700 mb-6">
              <Users className="w-4 h-4 text-secondaryOwn" />
              <span>{course.mentors?.length || 0} Mentoren</span>
            </div>

            <Button
              onClick={() => router.push("/termine")}
              className="w-full bg-secondaryOwn hover:bg-pink-600 text-white"
            >
              Zum Kurs
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

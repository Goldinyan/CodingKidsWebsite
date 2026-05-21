"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { getAllCourses } from "@/lib/db";
import { CourseData } from "@/BackEnd/type";
import { BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FeaturedCoursesView() {
  const { user, userRole } = useAuth();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await getAllCourses(user?.uid || "anonymous", userRole);
        setCourses(allCourses.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.uid, userRole]);

  if (loading) {
    return (
      <div className="w-full px-8 py-16">
        <p className="text-2xl font-bold text-white mb-8">Unsere Kurse</p>
        <p className="text-gray-500">Lädt...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-3">Unsere Kurse</h2>
        <p className="text-gray-400 text-lg">
          Von Anfänger bis Fortgeschrittene - für jeden Level das richtige
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {courses.map((course) => (
          <motion.div
            key={course.uid}
            variants={itemVariants}
            className="group bg-white/5 border border-white/10 backdrop-blur-sm p-6 hover:border-white/20 hover:bg-white/8 transition-all duration-300 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/10 group-hover:bg-white/20 transition-colors rounded flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              {course.tags && (
                <div className="flex gap-2">
                  {course.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white/10 text-gray-300 px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {course.name}
            </h3>
            <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-grow">
              {course.des}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{course.mentors?.length || 0} Mentoren</span>
            </div>

            <button
              onClick={() => router.push("/termine")}
              className="w-full px-4 py-2 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-100"
            >
              Zum Kurs
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

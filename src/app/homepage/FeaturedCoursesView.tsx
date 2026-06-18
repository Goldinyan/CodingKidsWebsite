"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { getAllCourses } from "@/lib/db";
import { CourseData } from "@/BackEnd/type";
import { BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function FeaturedCoursesView({
  isRounded,
}: {
  isRounded: boolean;
}) {
  const { user, userRole } = useAuth();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await getAllCourses(
          user?.uid || "anonymous",
          userRole,
        );
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
      <div className={`w-full px-8 py-16 transition-colors duration-300 `}>
        <p
          className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-white" : "text-slate-900"
            }`}
        >
          Unsere Kurse
        </p>
        <p className={theme === "dark" ? "text-gray-500" : "text-slate-500"}>
          Lädt...
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      scale: 0.95,
      y: 30,
    },
    visible: {
      scale: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.25,
      },
    },
  };

  return (
    <div className={`w-full px-8 py-20 transition-colors duration-300 `}>
      <div className="mb-12">
        <motion.div
          initial={{ y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <span
            className={`text-xs font-mono tracking-widest uppercase block mb-3 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"
              }`}
          >
            Lernplan
          </span>
          <h2
            className={`text-4xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Unsere Kurse
          </h2>
          <p
            className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-slate-600"
              }`}
          >
            Von Anfänger bis Fortgeschrittene - für jeden Level das richtige
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: false, margin: "0px 0px -50px 0px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {courses.map((course) => (
          <motion.div
            key={course.uid}
            variants={itemVariants}
            layout
            className={`group backdrop-blur-xl p-6 border transition-colors duration-300 flex flex-col ${isRounded && "rounded-lg"} ${theme === "dark"
                ? "bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-white/8"
                : "bg-slate-50 border-slate-300 hover:border-purple-500 hover:bg-purple-50"
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${theme === "dark"
                    ? "bg-white/10 group-hover:bg-white/20"
                    : "bg-slate-200 group-hover:bg-slate-300"
                  }`}
              >
                <BookOpen
                  className={`w-5 h-5 ${theme === "dark"
                      ? "text-gray-300 group-hover:text-white"
                      : "text-slate-600"
                    }`}
                />
              </div>
              {course.tags && (
                <div className="flex gap-2">
                  {course.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-1 ${isRounded && "rounded-md"} ${theme === "dark"
                          ? "bg-white/10 text-gray-300"
                          : "bg-slate-200 text-slate-700"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h3
              className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              {course.name}
            </h3>
            <p
              className={`text-sm mb-6 line-clamp-2 flex-grow ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                }`}
            >
              {course.des}
            </p>

            <div
              className={`flex items-center gap-2 text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                }`}
            >
              <Users
                className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}
              />
              <span>{course.mentors?.length || 0} Mentoren</span>
            </div>

            <button
              onClick={() => router.push("/termine")}
              className={`w-full px-4 py-2 font-medium border transition-all duration-200 hover:scale-105 active:scale-100 ${isRounded && "rounded-lg"} ${theme === "dark"
                  ? "bg-white text-black border-white hover:bg-gray-100"
                  : "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                }`}
            >
              Zum Kurs
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

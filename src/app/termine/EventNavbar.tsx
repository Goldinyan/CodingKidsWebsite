"use client";

import { useState, useEffect } from "react";
import { getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import { UserData, CourseData } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react"; // Nur noch ArrowUp nötig, da wir es rotieren

interface EventNavbarProps {
  callback: (key: string, value: boolean | string) => void;
  filters: { [key: string]: boolean | string };
  courses: CourseData[];
}

const baseTags: { name: string; value: string }[] = [
  { name: "Teilnahme möglich", value: "showOnlyAvailable" },
  { name: "Für dich offen", value: "showOnlyJoinable" },
];

const toggleFilters: { name: string; value: string; states: string[] }[] = [
  { name: "Name", value: "nameSort", states: ["A - Z", "Z - A"] },
  { name: "Datum", value: "dateSort", states: ["Datum ↑", "Datum ↓"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
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
    opacity: 0,
  },
  visible: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.55,
    },
  },
};

export default function EventNavbar({
  callback,
  filters,
  courses,
}: EventNavbarProps) {
  const { theme, isRounded } = useTheme();
  const [showDetailedCourseView, setShowDetailedCourseView] = useState<boolean>(false);

  const arrowClass =
    theme === "dark"
      ? "ml-2 w-10 h-10 p-2 border backdrop-blur-2xl bg-white/5 border-zinc-800 text-white hover:bg-white/10 hover:border-zinc-700 flex items-center justify-center"
      : "ml-2 w-10 h-10 p-2 border backdrop-blur-2xl bg-zinc-50 border-zinc-200 text-black hover:bg-zinc-100/70 hover:border-zinc-300 flex items-center justify-center";

  const activeClass =
    theme === "dark"
      ? "bg-white/5 text-white border-green-800 shadow-sm font-semibold"
      : "bg-zinc-50 text-black border-green-600 shadow-sm font-semibold";

  const inactiveCardClass =
    theme === "dark"
      ? "bg-white/5 border-zinc-800 text-white hover:bg-white/10 hover:border-zinc-700"
      : "bg-zinc-50 border-zinc-200 text-black hover:bg-zinc-100/70 hover:border-zinc-300";

  const tagClass =
    theme === "dark"
      ? "bg-white/10 text-zinc-300"
      : "bg-zinc-200/60 text-zinc-700";

  const activeTagClass =
    theme === "dark"
      ? "bg-white/10 text-zinc-300"
      : "bg-zinc-200/60 text-zinc-700";

  return (
    <div className="w-full flex flex-col space-y-8">
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full pb-2 scrollbar-none">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false }}
            className="flex flex-wrap items-center gap-2.5 w-full"
          >
            {courses.map((course) => {
              const isSelected = filters["course"] === course.name;
              return (
                <motion.button
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  exit="hidden"
                  viewport={{ once: false }}
                  key={`tab-${course.uid}`}
                  onClick={() =>
                    callback("course", isSelected ? "" : course.name)
                  }
                  className={`backdrop-blur-2xl px-4 py-2 border text-sm font-medium hover:scale-[1.02] active:scale-100 transition-all duration-200 ${
                    isSelected ? activeClass : inactiveCardClass
                  } ${isRounded ? "rounded-lg" : "rounded-none"}`}
                >
                  {course.name}
                </motion.button>
              );
            })}

            <motion.button
              variants={itemVariants}
              onClick={() => setShowDetailedCourseView(!showDetailedCourseView)}
              className={`${arrowClass} ${isRounded ? "rounded-lg" : "rounded-none"}`}
              animate={{ rotate: showDetailedCourseView ? 180 : 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-full h-full" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {showDetailedCourseView &&
          courses.map((course) => {
            const isSelected = filters["course"] === course.name;
            return (
              <motion.button
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                exit="hidden"
                viewport={{ once: false }}
                key={course.uid}
                onClick={() => callback("course", isSelected ? "" : course.name)}
                className={`backdrop-blur-2xl text-left p-6 border flex flex-col justify-between group h-full ${
                  isSelected ? activeClass : inactiveCardClass
                } ${isRounded ? "rounded-2xl" : "rounded-none"}`}
              >
                <div>
                  <p className="font-bold text-lg mb-2 tracking-tight">
                    {course.name}
                  </p>
                  <p
                    className={`text-sm mb-4 font-light leading-relaxed ${
                      isSelected
                        ? "opacity-90"
                        : theme === "dark"
                          ? "text-zinc-400"
                          : "text-zinc-600"
                    }`}
                  >
                    {course.des}
                  </p>
                </div>

                <div className="space-y-3 pt-2 w-full">
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 font-medium transition-colors ${
                            isSelected ? activeTagClass : tagClass
                          } ${isRounded ? "rounded" : "rounded-none"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {course.mentors && course.mentors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 border-t border-current/10 pt-3">
                      {course.mentors.map((mentor) => (
                        <span
                          key={mentor.uid}
                          className={`text-xs px-2 py-1 duration-300 font-medium flex items-center gap-1 transition-colors ${
                            isSelected ? activeTagClass : tagClass
                          } ${isRounded ? "rounded" : "rounded-none"}`}
                        >
                          {mentor.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
      </motion.div>
    </div>
  );
}

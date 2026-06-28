"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { getAllCourses } from "@/lib/db";
import { CourseData } from "@/BackEnd/type";
import { Code2, ChevronRight, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import SectionLabel from "./components/SectionLabel";
import SectionHeading from "./components/SectionHeading";


export default function FeaturedCoursesView() {
  const { user, userRole, loading } = useAuth();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const { theme, isRounded } = useTheme();

  const router = useRouter();
  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      const currentKey = `${user.uid}-${userRole}`;
      if (hasFetched.current === currentKey) return;

      hasFetched.current = currentKey;
    }

    const fetchCourses = async () => {
      try {
        const allCourses = await getAllCourses(user?.uid, userRole);
        setCourses(allCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, [user?.uid, userRole, loading, user]);

  if (loading) {
    return (
      <section className="py-14">
        <p className="text-2xl font-bold mb-8">Lädt...</p>
      </section>
    );
  }

  return (
    <section className="py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <SectionLabel>Kurse &amp; Themen</SectionLabel>
          <SectionHeading>Was wird angeboten?</SectionHeading>
        </div>
        <p className="hidden md:block text-sm max-w-xs text-right text-gray-500">
          Jedes Dojo hat einen Kurs-Fokus. Such dir das aus, was dich
          interessiert.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, i) => {
          const isEven = i % 2 === 0;
          const accentColor = isEven ? "green" : "purple";
          const isGreen = accentColor === "green";

          return (
            <motion.div
              key={course.uid}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="group"
            >
              <div
                className={`rounded-2xl border p-6 cursor-pointer transition-all duration-200 h-full ${isGreen
                    ? "bg-white/[0.025] border-white/[0.07] hover:bg-green-500/[0.07] hover:border-green-500/18"
                    : "bg-white/[0.025] border-white/[0.07] hover:bg-purple-500/[0.07] hover:border-purple-500/18"
                  }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isGreen
                          ? "bg-green-500/12 border-green-500/25"
                          : "bg-purple-500/[0.18] border-purple-500/30"
                        }`}
                    >
                      <Code2
                        className={`w-5 h-5 ${isGreen ? "text-green-500" : "text-purple-400"
                          }`}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white leading-tight font-grotesk">
                        {course.name}
                      </div>
                      <div className="text-[11px] mt-0.5 font-mono text-gray-500">
                        {course.dates.length} Termin
                        {course.dates.length !== 1 ? "e" : ""} geplant
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-gray-700" />
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-4 text-gray-500">
                  {course.des}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-mono ${ti === 0
                          ? isGreen
                            ? "text-green-500 bg-green-500/18 border-green-500/30"
                            : "text-purple-400 bg-purple-500/18 border-purple-500/30"
                          : "text-gray-400 bg-white/[0.04] border-white/[0.08]"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {course.mentors?.slice(0, 3).map((m) => (
                        <div
                          key={m.uid}
                          className={`w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-bold font-grotesk ${isGreen
                              ? "bg-green-500 text-white border-green-600"
                              : "bg-purple-500 text-white border-purple-600"
                            }`}
                        >
                          {m.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-gray-500">
                      {course.mentors?.length} Mentor
                      {course.mentors?.length !== 1 ? "en" : ""}
                    </span>
                  </div>

                  {/* Next date chip */}
                  {course.dates[0] && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(course.dates[0]).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

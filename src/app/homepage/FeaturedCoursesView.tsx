"use client";

import { Code2, ChevronRight, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import SectionLabel from "./components/SectionLabel";
import SectionHeading from "./components/SectionHeading";
import { toJsDate } from "@/BackEnd/utils";
import { useAppData } from "@/context/DataContext";

export default function FeaturedCoursesView() {
  const { theme, isRounded } = useTheme();
  const isDark = theme === "dark";

  const { getCourses, loadingStates } = useAppData();
  const router = useRouter();

  const rawCourseData = getCourses();

  if (loadingStates.courses && (!rawCourseData || rawCourseData.length === 0)) {
    return (
      <section className="py-14">
        <p
          className={`text-2xl font-bold mb-8 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Lädt...
        </p>
      </section>
    );
  }

  return (
    <section className="py-14 mx-4">
      <div className="flex items-end justify-between mb-10">
        <div>
          <SectionLabel>Kurse &amp; Themen</SectionLabel>
          <SectionHeading>Was wird angeboten?</SectionHeading>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rawCourseData.map((course, i) => {
          const isEven = i % 2 === 0;
          const accentColor = isEven ? "green" : "purple";
          const isGreen = accentColor === "green";

          console.log(course.dates);
          return (
            <motion.div
              key={course.uid}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="group"
            >
              <div
                onClick={() => {
                  router.push("/termine");
                }}
                className={`border p-6 cursor-pointer transition-all duration-200 h-full ${isRounded ? "rounded-2xl" : "rounded-none"
                  } ${isDark
                    ? "bg-white/[0.025] border-white/[0.07] hover:bg-white/[0.05]"
                    : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                  }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 flex items-center justify-center shrink-0 border ${isRounded ? "rounded-xl" : "rounded-none"
                        } ${isGreen
                          ? isDark
                            ? "bg-green-500/12 border-green-500/25"
                            : "bg-green-50 border-green-200"
                          : isDark
                            ? "bg-purple-500/[0.18] border-purple-500/30"
                            : "bg-purple-50 border-purple-200"
                        }`}
                    >
                      <Code2
                        className={`w-5 h-5 ${isGreen ? "text-green-500" : "text-purple-500"}`}
                      />
                    </div>
                    <div>
                      <div
                        className={`font-bold leading-tight font-grotesk ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {course.name}
                      </div>
                      <div className="text-[11px] mt-0.5 font-mono text-gray-500">
                        {course.dates.length} Termin
                        {course.dates.length !== 1 ? "e" : ""} geplant
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-gray-400" />
                </div>

                <p
                  className={`text-sm leading-relaxed mb-4 ${isDark ? "text-gray-500" : "text-slate-600"}`}
                >
                  {course.des}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-mono ${ti === 0
                          ? isGreen
                            ? isDark
                              ? "text-green-500 bg-green-500/18 border-green-500/30"
                              : "text-green-700 bg-green-100 border-green-200"
                            : isDark
                              ? "text-purple-400 bg-purple-500/18 border-purple-500/30"
                              : "text-purple-700 bg-purple-100 border-purple-200"
                          : isDark
                            ? "text-gray-400 bg-white/[0.04] border-white/[0.08]"
                            : "text-slate-500 bg-slate-200/50 border-slate-300"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className={`flex items-center justify-between pt-4 border-t ${isDark ? "border-white/[0.06]" : "border-slate-200"}`}
                >
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

                  {course.dates[0] && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {toJsDate(course.dates[0]).toLocaleDateString("de-DE", {
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

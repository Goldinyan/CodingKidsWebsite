"use client";

import { CalendarDays, Lock } from "lucide-react";
import EventCard from "./EventCard";
import EventNavbar from "./EventNavbar";
import { toJsDate } from "@/BackEnd/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/BackEnd/AuthContext";
import { useEventView } from "./hooks/useEventView";
import React, { useEffect } from "react";
import { getAllCourses } from "@/lib/db";
import { CourseData } from "@/BackEnd/type";

export default function EventView() {
  const { theme, isRounded } = useTheme();
  const { user, userData, loading } = useAuth();

  const {
    upcomingEvents,
    filteredUpcomingEvents,
    pastEvents,
    courses,
    filters,
    setFilters,
    statuses,
    handleEvents,
    checkIfEventIsInRange,
    getSortedEvents,
  } = useEventView();

  const isMember =
    userData?.role === "admin" ||
    userData?.role === "mentor" ||
    userData?.role === "member";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-white text-slate-900"}`}
    >
      <div className="max-w-6xl mx-auto px-6 pt-2 pb-20 relative">
        <div className="mb-10 relative">
          <p
            className={`text-[10px] tracking-[0.22em] uppercase mb-2 font-mono ${theme === "dark" ? "text-purple-500" : "text-purple-600"}`}
          >
            CoderDojo Niederrhein
          </p>
          <h1
            className={`text-4xl font-black tracking-tight mb-3 font-grotesk ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Alle Termine
          </h1>
          <p
            className={`text-sm max-w-xl ${theme === "dark" ? "text-gray-500" : "text-slate-600"}`}
          >
            Jeden Mittwoch 18:00–19:30 Uhr · CUBES Wesel · Kostenlos und offen
            für alle
          </p>
        </div>

        <EventNavbar
          callback={(key, value) =>
            setFilters((prev) => ({ ...prev, [key]: value }))
          }
          filters={filters}
          courses={courses}
        />

        <div
          className={`mb-4 text-xs font-mono ${theme === "dark" ? "text-gray-700" : "text-slate-500"}`}
        >
          {filteredUpcomingEvents.length} Veranstaltung
          {filteredUpcomingEvents.length !== 1 ? "en" : ""} gefunden
        </div>

        {!isMember && (
          <div
            className={`mb-6 flex items-start gap-3 px-4 py-3 rounded-xl border border-l-4 transition-colors duration-300 ${theme === "dark"
                ? "border-purple-500/20 border-l-purple-500 bg-purple-500/[0.06]"
                : "border-purple-300/40 border-l-purple-500 bg-purple-50"
              }`}
          >
            <Lock
              className={`w-4 h-4 mt-0.5 shrink-0 ${theme === "dark" ? "text-purple-500" : "text-purple-600"}`}
            />
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}
            >
              <span
                className={
                  theme === "dark"
                    ? "text-white font-semibold"
                    : "text-slate-900 font-semibold"
                }
              >
                Vereinsmitglieder
              </span>{" "}
              können sich früher anmelden und haben reservierte Plätze.{" "}
            </p>
          </div>
        )}

        {/* Event list */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filteredUpcomingEvents.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <CalendarDays
                  className={`w-10 h-10 mx-auto mb-3 ${theme === "dark" ? "opacity-40" : "opacity-30"}`}
                />
                <p
                  className={`text-sm font-mono ${theme === "dark" ? "text-gray-700" : "text-slate-500"}`}
                >
                  Keine Veranstaltungen gefunden
                </p>
              </motion.div>
            ) : (
              filteredUpcomingEvents.map((event) => {
                const course = courses.find((c) => c.uid === event.course);
                return (
                  <EventCard
                    key={event.uid}
                    event={event}
                    course={course!}
                    isPast={false}
                    status={statuses[event.uid]}
                    tooEarly={!checkIfEventIsInRange(toJsDate(event.date))}
                    theme={theme}
                    isRounded={isRounded}
                    handleEvents={handleEvents}
                  />
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Past events section */}
        {pastEvents.length > 0 && filteredUpcomingEvents.length > 0 && (
          <div className="w-full mt-12">
            <h2
              className={`text-2xl font-bold mb-6 font-grotesk ${theme === "dark" ? "text-gray-500" : "text-slate-500"}`}
            >
              Vergangene Events
            </h2>
            <div className="flex flex-col gap-3">
              {pastEvents
                .sort((a, b) => (b.date.seconds || 0) - (a.date.seconds || 0))
                .map((event) => (
                  <EventCard
                    key={event.uid}
                    event={event}
                    isPast={true}
                    status={statuses[event.uid]}
                    tooEarly={false}
                    theme={theme}
                    isRounded={isRounded}
                    handleEvents={handleEvents}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/db";
import { EventData } from "@/BackEnd/type";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toJsDate } from "@/BackEnd/utils";
import { useTheme } from "@/context/ThemeContext";

export default function FeaturedEventsView({
  isRounded,
}: {
  isRounded: boolean;
}) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = (await getAllEvents()) as EventData[];

        const upcomingEvents = allEvents
          .sort(
            (a, b) => toJsDate(a.date).getTime() - toJsDate(b.date).getTime(),
          )
          .slice(0, 3);
        setEvents(upcomingEvents as EventData[]);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className={`w-full px-8 py-16 transition-colors duration-300 `}>
        <p
          className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-white" : "text-slate-900"
            }`}
        >
          Kommende Events
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
          viewport={{ once: true }}
        >
          <h2
            className={`text-4xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Kommende Events
          </h2>
          <p
            className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-slate-600"
              }`}
          >
            Entdecke die nächsten Kurse und Workshops
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
        {events.map((event) => {
          return (
            <motion.div
              variants={itemVariants}
              layout
              key={event.uid}
              className={`group ${isRounded ? "rounded-lg" : "rounded-none"} backdrop-blur-2xl p-6 border transition-colors duration-300 ${theme === "dark"
                  ? "bg-white/5 border-white/10 hover:border-green-500/50 hover:bg-white/8"
                  : "bg-slate-50 border-slate-300 hover:border-green-500 hover:bg-green-50"
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 transition-colors ${theme === "dark"
                      ? "bg-white/10 text-gray-300 group-hover:text-white"
                      : "bg-slate-200 text-slate-700 group-hover:text-slate-900"
                    }`}
                >
                  {event.difficulty}
                </span>
                <span
                  className={`text-xs transition-colors ${theme === "dark"
                      ? "text-gray-500 group-hover:text-gray-400"
                      : "text-slate-500 group-hover:text-slate-700"
                    }`}
                >
                  {event.typeOfEvent}
                </span>
              </div>

              <h3
                className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
              >
                {event.name}
              </h3>
              <p
                className={`text-sm mb-6 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                  }`}
              >
                {event.description}
              </p>

              <div
                className={`space-y-2 mb-8 text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar
                    className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                      }`}
                  />
                  <span>
                    {toJsDate(event.date).toLocaleDateString("de-DE")}
                  </span>
                </div>
                {event.place && (
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                        }`}
                    />
                    <span>{event.place[0]}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users
                    className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                      }`}
                  />
                  <span>
                    {event.users?.length + (event.queue?.length || 0)}/
                    {event.memberCount} Plätze belegt
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/termine")}
                className={`w-full px-4 py-2 font-medium border transition-all duration-200 hover:scale-105 active:scale-100 ${isRounded && "rounded-lg"}  ${theme === "dark"
                    ? "bg-white text-black border-white hover:bg-gray-100"
                    : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                  }`}
              >
                Mehr erfahren
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

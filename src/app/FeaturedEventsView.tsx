"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/db";
import { EventData } from "@/BackEnd/type";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toJsDate } from "@/BackEnd/utils";

export default function FeaturedEventsView() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="w-full px-8 py-16">
        <p className="text-2xl font-bold text-white mb-8">Kommende Events</p>
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
        <h2 className="text-4xl font-bold text-white mb-3">Kommende Events</h2>
        <p className="text-gray-400 text-lg">
          Entdecke die nächsten Kurse und Workshops
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {events.map((event) => {
          return (
            <motion.div
              key={event.uid}
              variants={itemVariants}
              className="group bg-white/5 border border-white/10 backdrop-blur-sm p-6 hover:border-white/20 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-semibold px-3 py-1 bg-white/10 text-gray-300 group-hover:text-white transition-colors">
                  {event.difficulty}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                  {event.typeOfEvent}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">
                {event.name}
              </h3>
              <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2 mb-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    {toJsDate(event.date).toLocaleDateString("de-DE")}
                  </span>
                </div>
                {event.place && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{event.place[0]}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>
                    {event.users?.length + (event.queue?.length || 0)}/
                    {event.memberCount} Plätze belegt
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/termine")}
                className="w-full px-4 py-2 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-100"
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

"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/db";
import { EventData } from "@/BackEnd/type";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <p className="text-2xl font-bold mb-8">Kommende Events</p>
        <p className="text-gray-500">Lädt...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-16 bg-gradient-to-b from-transparent to-blue-50">
      <p className="text-3xl font-bold mb-2">Kommende Events</p>
      <p className="text-gray-600 mb-10">
        Entdecke die nächsten Kurse und Workshops
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event, idx) => {
          console.log("DATE:", event.date);
          console.log("TYPE:", typeof event.date);

          return (
            <motion.div
              key={event.uid}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {event.difficulty}
                </span>
                <span className="text-sm text-gray-500">
                  {event.typeOfEvent}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-3">{event.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2 mb-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-fourthOwn" />
                  <span>
                    {toJsDate(event.date).toLocaleDateString("de-DE")}
                  </span>
                </div>
                {event.place && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-fourthOwn" />
                    <span>{event.place[0]}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-fourthOwn" />
                  <span>
                    {event.users?.length + (event.queue?.length || 0)}/
                    {event.memberCount} Plätze belegt
                  </span>
                </div>
              </div>

              <Button
                onClick={() => router.push("/termine")}
                className="w-full bg-fourthOwn hover:bg-blue-700 text-white"
              >
                Mehr erfahren
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

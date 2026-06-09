"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, Clock, UserRoundX, AlertTriangle, Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button"; // Falls shadcn genutzt wird, ansonsten anpassen

interface EventCardProps {
  event: any; // Hier deinen EventData Typen einsetzen
  isPast?: boolean;
}

export const EventCard = ({ event, isPast = false }: EventCardProps) => {
  const { theme, isRounded } = useTheme();
  const [showAllPlaces, setShowAllPlaces] = useState(false);

  const status = statuses[event.uid];
  const statusIcon = {
    loading: <Loader2 className="animate-spin w-5 h-5" />,
    User: <Check className="text-green-400 w-5 h-5" />,
    Queue: <Clock className="text-yellow-400 w-5 h-5" />,
    false: <UserRoundX className="text-red-400 w-5 h-5" />,
    error: <AlertTriangle className="text-orange-400 w-5 h-5" />,
  }[status];

  const isInEvent = status === "User" || status === "Queue";
  const tooEarly = !checkIfEventIsInRange(toJsDate(event.date));
  const EndOfEvent = toJsDate(event.date);

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-start justify-between mb-4">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          {event.difficulty}
        </span>
        <span className="ml-auto mr-10 mt-3 text-sm text-gray-500">
          {event.typeOfEvent}
        </span>
        {!isPast && (
          <div className="group relative">
            <div className="rounded-full p-2 bg-white border border-gray-400">
              {statusIcon}
            </div>
            <div className="absolute left-1/4 -translate-x-1/2 w-48 mt-2 hidden group-hover:flex bg-white p-2 rounded-md shadow-md z-10 text-xs">
              {getHoverMessage(status)}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold mb-3">{event.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{event.description}</p>

      <div className="flex-grow" />

      {/* Info Liste */}
      <div className="space-y-2 mb-6 text-sm text-gray-700">
        {/* Datum */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-fourthOwn" />
          <p>
            {toJsDate(event.date).toLocaleString("de-DE", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" - "}
            {toJsDate(EndOfEvent).toLocaleString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Orte mit Smooth-Height-Slide & Rotations-Chevron */}
        {event.place && (
          <div className="flex justify-start items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-fourthOwn shrink-0" />
            <div className="flex flex-col flex-1 overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                {showAllPlaces ? (
                  <motion.div
                    key="all-places"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                  >
                    {event.place.map((line: string, index: number) => (
                      <p key={index}>{line}</p>
                    ))}
                  </motion.div>
                ) : (
                  <motion.p 
                    key="single-place"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {event.place[0]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            {/* Animierter Drehpfeil */}
            <motion.button
              onClick={() => setShowAllPlaces(!showAllPlaces)}
              className="hover:bg-gray-100 p-1 rounded flex items-center justify-center transition-colors duration-200"
              animate={{ rotate: showAllPlaces ? 90 : 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4 text-fourthOwn" />
            </motion.button>
          </div>
        )}

        {/* Belegung */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-fourthOwn" />
          <span>
            {event.users?.length + (event.queue?.length || 0)}/
            {event.memberCount} Plätze belegt
          </span>
        </div>
      </div>

      {/* Action Button */}
      {!isPast && (
        <Button
          className={`w-full ${tooEarly ? "cursor-not-allowed border border-primaryOwn" : ""}`}
          disabled={tooEarly}
          variant={!tooEarly ? (isInEvent ? "destructive" : "default") : "secondary"}
          onClick={() => {
            if (!tooEarly) handleEvents(event.uid, isInEvent ? "leave" : "join");
          }}
        >
          {!tooEarly ? (isInEvent ? "Verlassen" : "Beitreten") : "Zu früh"}
        </Button>
      )}
    </div>
  );
};

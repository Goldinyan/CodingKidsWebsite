"use client";

import EventCard from "./EventCard";
import EventNavbar from "./EventNavbar";
import { Badge } from "@/components/ui/badge";
import { toJsDate } from "@/BackEnd/utils";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
// Importiere deinen neuen Custom Hook:
import { useEventView } from "./hooks/useEventView";

export default function EventView() {
  const { theme, isRounded } = useTheme();

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

  return (
    <div className="flex max-w-7xl mx-auto items-center flex-col gap-4 p-6 pt-5">
      <EventNavbar
        callback={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        filters={filters}
        courses={courses}
      />

      {filteredUpcomingEvents.length > 0 && (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3 mt-6">
            <h2 className="text-2xl font-bold text-primary">Kommende Events</h2>
            <Badge
              variant="outline"
              className="bg-primaryOwn text-white mt-1 rounded-full "
            >
              {filteredUpcomingEvents.length}
            </Badge>
          </div>
          <div className="grid min-h-100 grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUpcomingEvents.map((event, idx) => (
              <motion.div
                key={event.uid}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <EventCard
                  event={event}
                  isPast={false}
                  status={statuses[event.uid]}
                  tooEarly={!checkIfEventIsInRange(toJsDate(event.date))}
                  theme={theme}
                  isRounded={isRounded}
                  handleEvents={handleEvents}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="w-full space-y-4 mt-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-muted-foreground">
              Vergangene Events
            </h2>
            <Badge variant="outline">{pastEvents.length}</Badge>
          </div>
          <div className="grid min-h-100 grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents
              .sort((a, b) => (a.date.seconds || 0)  - (b.date.seconds || 0))
              .map((event, idx) => (
                <motion.div
                  key={event.uid}
                  initial={{ opacity: 1, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <EventCard
                    event={event}
                    isPast={true}
                    status={statuses[event.uid]}
                    tooEarly={!checkIfEventIsInRange(toJsDate(event.date))}
                    theme={theme}
                    isRounded={isRounded}
                    handleEvents={handleEvents}
                  />
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {upcomingEvents.length === 0 && pastEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-lg text-muted-foreground">Keine Events gefunden</p>
        </div>
      )}
    </div>
  );
}

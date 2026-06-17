import { useState } from "react";
import type { EventData } from "@/BackEnd/type";
import { Button } from "@/components/ui/button";
import {
  Check,
  Clock,
  AlertTriangle,
  Loader2,
  Calendar,
  MapPin,
  ChevronRight,
  Users,
  UserRoundX,
} from "lucide-react";
import { toJsDate } from "@/BackEnd/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Theme } from "@/context/ThemeContext";
import { EventStatus } from "@/BackEnd/type";

const getHoverMessage = (status: EventStatus): string => {
  switch (status) {
    case EventStatus.Loading:
      return "Der Status dieses Events wird derzeit geladen.";
    case EventStatus.User:
      return "Sie sind als Teilnehmer:in für dieses Event eingetragen.";
    case EventStatus.Queue:
      return "Sie befinden sich in der Warteschlange für dieses Event.";
    case EventStatus.NotRegistered:
      return "Sie sind nicht als Teilnehmer:in für dieses Event registriert.";
    case EventStatus.Error:
      return "Beim Laden dieses Events ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.";
    default:
      return "Unbekannter Status.";
  }
};

const statusIcons: Record<EventStatus, React.ReactNode> = {
  [EventStatus.Loading]: (
    <Loader2 className="animate-spin w-5 h-5 text-zinc-400" />
  ),
  [EventStatus.User]: <Check className="text-emerald-500 w-5 h-5" />,
  [EventStatus.Queue]: <Clock className="text-amber-500 w-5 h-5" />,
  [EventStatus.NotRegistered]: <UserRoundX className="text-rose-500 w-5 h-5" />,
  [EventStatus.Error]: <AlertTriangle className="text-orange-500 w-5 h-5" />,
};

export default function EventCard(props: {
  event: EventData;
  isPast: boolean;
  status: EventStatus;
  tooEarly: boolean;
  theme: Theme;
  isRounded: boolean;
  handleEvents: (eventId: string, action: "join" | "leave") => void;
}) {
  const { event, isPast = false, status, tooEarly, theme, isRounded, handleEvents } = props;

  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<boolean>(false);

  //const tooEarly = !checkIfEventIsInRange(toJsDate(event.date));
  //const status = statuses[event.uid];

  const isInEvent = status === EventStatus.User || status === EventStatus.Queue;

  const EndOfEvent = toJsDate(event.date);
  const currentIcon = statusIcons[status];

  const cardClass =
    theme === "dark"
      ? "bg-white/5 border-zinc-800 text-white"
      : "bg-zinc-50 border-zinc-200 text-black";

  const badgeClass =
    theme === "dark"
      ? "bg-white/10 text-zinc-300"
      : "bg-zinc-200/60 text-zinc-700";

  const textMutedClass = theme === "dark" ? "text-zinc-400" : "text-zinc-500";
  const textBodyClass = theme === "dark" ? "text-white" : "text-zinc-700";
  const iconClass = theme === "dark" ? "text-zinc-500" : "text-zinc-400";

  const getButtonClass = () => {
    if (tooEarly)
      return "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50";
    if (isInEvent) {
      return theme === "dark"
        ? "bg-rose-950/40 text-rose-400 border border-rose-900/50 hover:bg-rose-900/30"
        : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100";
    }
    return theme === "dark"
      ? "bg-white text-black hover:bg-zinc-200"
      : "bg-black text-white hover:bg-zinc-800";
  };

  return (
    <div
      className={`flex flex-col h-full p-6 border backdrop-blur-2xl transition-colors duration-200 ${cardClass} ${isRounded ? "rounded-2xl" : "rounded-none"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 ${badgeClass} ${isRounded ? "rounded-full" : "rounded-none"}`}
        >
          {event.difficulty}
        </span>
        {isPast && (
          <span className={`ml-auto mr-4 mt-1 text-sm ${textMutedClass}`}>
            {event.typeOfEvent}
          </span>
        )}
        {!isPast && (
          <div className="group relative">
            <div
              onClick={() => setShowStatus(!showStatus)}
              className={`p-2 border backdrop-blur-md bg-transparent ${theme === "dark" ? "border-zinc-800" : "border-zinc-300"} ${isRounded ? "rounded-full" : "rounded-none"}`}
            >
              {currentIcon}
            </div>
            <div
              className={`absolute right-0 top-full mt-2 min-w-50 p-5 border text-xs shadow-xl z-10 backdrop-blur-md ${showStatus ? "flex" : "hidden group-hover:flex"
                } ${theme === "dark"
                  ? "bg-zinc-950 border-zinc-800 text-zinc-300"
                  : "bg-white border-zinc-200 text-zinc-600"
                } ${isRounded ? "rounded-md" : "rounded-none"}`}
            >
              {getHoverMessage(status)}
            </div>
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold mb-2 tracking-tight">{event.name}</h3>
      <p
        className={`text-sm font-light mb-4 leading-relaxed ${textMutedClass}`}
      >
        {event.description}
      </p>
      <div className="grow" />
      <div className={`space-y-3 mb-6 text-sm font-light ${textBodyClass}`}>
        <div className="flex items-center gap-2.5">
          <Calendar className={`w-4 h-4 shrink-0 ${iconClass}`} />
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

        {event.place && event.place.length > 0 && (
          <div className="flex justify-start items-start gap-2.5">
            <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                {showAllPlaces ? (
                  <motion.div
                    key="all-places"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.2,
                    }}
                    className="space-y-0.5"
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

            {event.place.length > 1 && (
              <motion.button
                onClick={() => setShowAllPlaces(!showAllPlaces)}
                className={`p-1 flex items-center justify-center transition-colors duration-200 ${theme === "dark"
                    ? "border-zinc-800 hover:bg-white/5"
                    : "border-zinc-200 hover:bg-zinc-100"
                  } ${isRounded ? "rounded" : "rounded-none"}`}
                animate={{ rotate: showAllPlaces ? 90 : 0 }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.2,
                }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <Users className={`w-4 h-4 shrink-0 ${iconClass}`} />
          <span>
            {event.users?.length + (event.queue?.length || 0)} /{" "}
            {event.memberCount} Plätze belegt
          </span>
        </div>
      </div>
      {!isPast && (
        <Button
          disabled={tooEarly || loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              if (!tooEarly) {
                handleEvents(event.uid, isInEvent ? "leave" : "join");
              }
              setLoading(false);
            }, 1000);
          }}
          className={`w-full py-2.5 font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-none ${getButtonClass()} ${isRounded ? "rounded-xl" : "rounded-none"
            } ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Lädt...</span>
            </div>
          ) : !tooEarly ? (
            isInEvent ? (
              "Verlassen"
            ) : (
              "Beitreten"
            )
          ) : (
            "Zu früh"
          )}
        </Button>
      )}{" "}
    </div>
  );
}

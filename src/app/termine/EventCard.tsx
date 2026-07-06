import { useState, useMemo } from "react";
import {
  CourseData,
  Difficulties,
  EventData,
  EventStatus,
} from "@/BackEnd/type";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  ChevronDown,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Pin,
} from "lucide-react";
import { toJsDate } from "@/BackEnd/utils";
import { Theme } from "@/context/ThemeContext";
import { useErrorToast } from "@/hooks/useErrorToast";

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // z.B. "Do."
    day: "2-digit", // z.B. "03"
    month: "long", // z.B. "September"
    year: "numeric", // z.B. "2026"
  };

  return date.toLocaleDateString("de-DE", options);
}

const diffStyle: Record<
  Difficulties,
  { color: string; bg: string; border: string }
> = {
  [Difficulties.Einsteiger]: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.25)",
  },
  [Difficulties.Mittel]: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.25)",
  },
  [Difficulties.Fortgeschritten]: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.25)",
  },
};

function DiffBadge({ diff }: { diff: string }) {
  const s =
    diffStyle[diff as Difficulties] ?? diffStyle[Difficulties.Einsteiger];
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-md border shrink-0"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: s.color,
        background: s.bg,
        borderColor: s.border,
      }}
    >
      {diff}
    </span>
  );
}

function StatusPill({
  status,
  queueCount,
  userCount,
  theme,
}: {
  status: EventStatus;
  queueCount: number;
  userCount: number;
  theme: Theme;
}) {
  const baseStyle = { fontFamily: "'JetBrains Mono', monospace" };

  if (status === EventStatus.Loading) {
    return (
      <span
        className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md ${theme === "dark"
            ? "bg-white/5 text-zinc-400"
            : "bg-zinc-200 text-zinc-600"
          }`}
        style={baseStyle}
      >
        <Loader2 className="w-3 h-3 animate-spin" /> Lädt...
      </span>
    );
  }
  if (status === EventStatus.Queue) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap"
        style={baseStyle}
      >
        <Clock className="w-3 h-3" /> Warteliste ({queueCount})
      </span>
    );
  }
  if (status === EventStatus.User) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 whitespace-nowrap"
        style={baseStyle}
      >
        <CheckCircle2 className="w-3 h-3 shrink-0" />
        <span>Eingetragen</span>
      </span>
    );
  }
  if (status === EventStatus.Error) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-rose-500/10 text-rose-500 whitespace-nowrap border border-rose-500/20"
        style={baseStyle}
      >
        <AlertCircle className="w-3 h-3" /> Fehler
      </span>
    );
  }
  return (
    <span
      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: "rgba(74,222,128,0.1)",
        color: "#16a34a",
      }}
    >
      <CheckCircle2 className="w-3 h-3" /> {userCount} Platz
      {userCount !== 1 ? "e" : ""} frei
    </span>
  );
}

export default function EventCard(props: {
  event: EventData;
  isPast: boolean;
  status: EventStatus;
  tooEarly: boolean;
  course: CourseData;
  theme: Theme;
  isRounded: boolean;
  handleEvents: (eventId: string, action: "join" | "leave", toast: any) => void;
}) {
  const {
    event,
    isPast = false,
    status,
    course,
    tooEarly,
    theme,
    isRounded,
    handleEvents,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { showErrorToast, showUpdateError } = useErrorToast();

  const isInEvent = status === EventStatus.User || status === EventStatus.Queue;
  const eventDate = useMemo(() => toJsDate(event.date), [event.date]);

  const day = eventDate.toLocaleDateString("de-DE", { day: "2-digit" });
  const month = eventDate
    .toLocaleDateString("de-DE", { month: "short" })
    .toUpperCase();

  const totalUsers = event.users?.length || 0;
  const queueCount = event.queue?.length || 0;
  const maxPlaces = event.memberCount || 20;
  const pct = Math.min(100, Math.round((totalUsers / maxPlaces) * 100));
  const spotsLeft = Math.max(0, maxPlaces - totalUsers);

  return (
    <motion.div
      layout
      className={`border overflow-hidden transition-all duration-200 ${isRounded ? "rounded-2xl" : "rounded-none"
        } ${theme === "dark"
          ? expanded
            ? "bg-white/[0.04] border-white/14 text-white"
            : "bg-white/[0.025] border-white/07 text-white"
          : expanded
            ? "bg-zinc-100 border-zinc-300 text-black"
            : "bg-zinc-50 border-zinc-200 text-black"
        }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-center gap-4 bg-transparent border-none cursor-pointer focus:outline-none"
      >
        {/* Month / Day Container */}
        <div
          className={`shrink-0 px-3 py-2 text-center border transition-colors duration-200
            ${isRounded ? "rounded-xl" : "rounded-none"}
            ${isInEvent
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              : theme === "dark"
                ? "bg-white/5 border-white/10"
                : "bg-zinc-200/60 border-zinc-300"
            }`}
          style={{
            minWidth: 54,
          }}
        >
          <div
            className={`text-[9px] tracking-widest transition-colors ${isInEvent
                ? "text-emerald-500/70"
                : theme === "dark"
                  ? "text-zinc-500"
                  : "text-zinc-600"
              }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {month}
          </div>
          <div
            className={`text-2xl font-black leading-tight transition-colors
              ${isInEvent
                ? "text-emerald-500"
                : theme === "dark"
                  ? "text-white"
                  : "text-black"
              }`}
            style={{ fontFamily: "'Familjen Grotesk', sans-serif" }}
          >
            {day}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`font-bold text-sm truncate ${theme === "dark" ? "text-white" : "text-black"
                }`}
              style={{ fontFamily: "'Familjen Grotesk', sans-serif" }}
            >
              {event.name}
            </span>
            <DiffBadge diff={event.difficulty} />
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md ${theme === "dark"
                  ? "bg-white/5 text-zinc-400"
                  : "bg-zinc-200 text-zinc-600"
                }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {event.typeOfEvent}
            </span>
          </div>

          <div
            className={`text-[11px] flex items-center flex-wrap gap-x-3 gap-y-1 ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"
              }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {eventDate.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              Uhr
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {totalUsers}/{maxPlaces}
            </span>
            <span className="flex items-center gap-1 font-medium">
              {event.course}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {!isPast && (
            <div className="hidden sm:block">
              <StatusPill
                status={status}
                queueCount={queueCount}
                userCount={event.memberCount - event.users.length}
                theme={theme}
              />
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"
              }`}
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className={`px-5 pb-5 border-t ${theme === "dark" ? "border-white/06" : "border-zinc-200"}`}
            >
              <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 flex flex-col gap-4">
                  <div>
                    <div
                      className={`text-[10px] uppercase tracking-widest mb-1.5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"
                        }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Beschreibung
                    </div>
                    <p
                      className={`text-xxs leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-zinc-700"}`}
                    >
                      {event.description}
                    </p>
                  </div>

                  <div>
                    <div
                      className={`text-[10px] uppercase flex flex-row tracking-widest mb-1.5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"
                        }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Voraussetzungen
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                      <p
                        className={`text-xxs leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-zinc-700"}`}
                      >
                        {event.requirements || "Keine Voraussetzungen"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div
                      className={`text-[10px] uppercase flex flex-row tracking-widest mb-1.5 ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"
                        }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Kurs
                    </div>
                    <div className="flex flex-row items-start gap-2 flex-wrap">
                      {course.tags &&
                        course?.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md border"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              background:
                                theme === "dark"
                                  ? "rgba(255,255,255,0.04)"
                                  : "rgba(0,0,0,0.05)",
                              borderColor:
                                theme === "dark"
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.1)",
                              color: theme === "dark" ? "#9ca3af" : "#4b5563",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <p
                      className={`text-xxs mt-2 leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-zinc-700"}`}
                    >
                      {course.des}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div
                    className={`rounded-xl border p-4 ${theme === "dark"
                        ? "bg-white/[0.02] border-white/06"
                        : "bg-zinc-100/50 border-zinc-200"
                      }`}
                  >
                    <div
                      className={`text-[10px] uppercase tracking-widest mb-2 ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"
                        }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Kapazität
                    </div>

                    <div
                      className="flex justify-between text-xs mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      <span
                        className={
                          theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                        }
                      >
                        {totalUsers} angemeldet
                      </span>
                      <span
                        style={{
                          color: spotsLeft === 0 ? "#ef4444" : "#22c55e",
                        }}
                      >
                        {spotsLeft} frei
                      </span>
                    </div>

                    <div
                      className={`h-1.5 rounded-full mb-3 ${theme === "dark" ? "bg-white/10" : "bg-zinc-200"}`}
                    >
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: spotsLeft === 0 ? "#ef4444" : "#22c55e",
                        }}
                      />
                    </div>

                    <div
                      className={`flex flex-col gap-1.5 text-[11px] ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{formatDate(eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{event.length} Minuten</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pin className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{event.place[0]}</span>
                      </div>
                    </div>
                  </div>

                  {!isPast && (
                    <Button
                      disabled={tooEarly || loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLoading(true);
                        setTimeout(() => {
                          if (!tooEarly) {
                            handleEvents(
                              event.uid,
                              isInEvent ? "leave" : "join",
                              showUpdateError,
                            );
                          }
                          setLoading(false);
                        }, 1000);
                      }}
                      className={`w-full py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${isRounded ? "rounded-xl" : "rounded-none"
                        } ${tooEarly
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50 shadow-none"
                          : isInEvent
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
                            : "bg-[#4ade80] text-black hover:bg-[#86efac]"
                        }`}
                      style={{ fontFamily: "'Familjen Grotesk', sans-serif" }}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
                      ) : tooEarly ? (
                        "Zu früh"
                      ) : isInEvent ? (
                        "Verlassen"
                      ) : (
                        <>
                          Beitreten <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

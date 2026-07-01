"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  Gamepad2,
  Globe,
  MapPin,
  Notebook,
  Star,
} from "lucide-react";
import GlassCard from "./components/GlassCard";
import SectionHeading from "./components/SectionHeading";
import Chip from "./components/Chip";
import SectionLabel from "./components/SectionLabel";
import { useRouter } from "next/navigation";

const activities = [
  {
    Icon: Code2,
    title: "Programmieren",
    color: "#4ade80", // green
    desc: "Lerne die Grundlagen und schreibe deinen ersten Code. Egal ob Anfänger oder schon erfahren.",
  },
  {
    Icon: Gamepad2,
    title: "Videospiele",
    color: "#a78bfa", // purple
    desc: "Entwirf und programmiere eigene Spiele und teile sie mit anderen Ninjas.",
  },
  {
    Icon: Globe,
    title: "Webseiten",
    color: "#38bdf8", // blue
    desc: "Baue deine eigene Website von Grund auf, HTML, CSS und mehr.",
  },
  {
    Icon: Cpu,
    title: "Hardware & Robotik",
    color: "#fb923c",
    desc: "Erwecke Code zum Leben! Steuere kleine Roboter, LEDs und Sensoren mit Einplatinencomputern.",
  },
];

const requirements = [
  "Du bist zwischen 8 und 17 Jahre alt",
  "Du kannst ein Notebook zum Dojo mitbringen",
  "Bei Erst­teilnahme unter 13 Jahren: Elternteil anwesend",
];

export default function MiddleView() {
  const { theme, isRounded } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  return (
    <div className="px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <SectionLabel>Beim CoderDojo</SectionLabel>
          <SectionHeading>Was kannst du machen?</SectionHeading>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activities.map(({ Icon, title, desc, color }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            viewport={{ once: false }}
          >
            <GlassCard
              className={`p-6 cursor-pointer h-full transition-all duration-300 group ${isDark
                ? "hover:!border-[var(--hover-border)] hover:!bg-[var(--hover-bg)]"
                : "hover:!border-[var(--hover-border)] hover:bg-slate-50"
                }`}
              style={{
                // @ts-expect-error: CSS-Variablen sind dynamisch und werden hier gesetzt
                "--hover-border": `${color}40`,
                "--hover-bg": `${color}06`,
              }}
            >
              <div className="h-full flex flex-col gap-4">
                {/* ICON BOX */}
                <div
                  className={`w-10 h-10 flex items-center justify-center transition-colors duration-300 ${isRounded ? "rounded-xl" : "rounded-none"
                    }`}
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>

                <div>
                  <div
                    className={`font-bold mb-1.5 font-gro transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"
                      }`}
                  >
                    {title}
                  </div>
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? "text-gray-400" : "text-slate-600"
                      }`}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <GlassCard
        className={`mt-4 p-6 flex flex-col md:flex-row items-start md:items-center gap-4 transition-colors duration-300 ${isRounded ? "rounded-2xl" : "rounded-none"
          } ${isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center shrink-0 ${isRounded ? "rounded-xl" : "rounded-none"
            }`}
          style={{
            background: isDark
              ? "rgba(74,222,128,0.15)"
              : "rgba(22,163,74,0.1)",
            border: isDark
              ? "1px solid rgba(74,222,128,0.25)"
              : "1px solid rgba(22,163,74,0.2)",
          }}
        >
          <Star
            className="w-5 h-5"
            style={{ color: isDark ? "#4ade80" : "#16a34a" }}
          />
        </div>
        <div className="flex-1">
          <div
            className={`font-bold mb-1 font-gro transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            Du stellst vor, was du gebaut hast
          </div>
          <p
            className={`text-sm transition-colors duration-300 ${isDark ? "text-gray-400" : "text-slate-600"
              }`}
          >
            Am Ende jedes Dojos hast du die Möglichkeit, deine Projekte den
            anderen Ninjas zu zeigen. Kein Druck, nur Stolz auf das, was du
            geschaffen hast.
          </p>
        </div>
      </GlassCard>
      {/* wann und wo*/}
      <section className="py-14 w-full">
        <div className="mb-8 w-full">
          <SectionLabel>Wann & Wo</SectionLabel>
          <SectionHeading>Komm einfach vorbei</SectionHeading>
        </div>

        <div className="grid w-full grid-cols-1 xl:grid-cols-5 gap-4">
          <GlassCard className="xl:col-span-3 flex flex-col lg:flex-row w-full justify-between p-6 hover:!border-purple-400/40 ">
            <div className="flex flex-col min-w-80 items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-purple-500/15 border border-purple-500/25">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className={`font-bold font-gro ${isDark ? "text-white" : "text-slate-900"} mb-0.5`}>
                  CUBES Wesel
                </div>
                <div className="text-sm text-gray-500">
                  Rudolf-Diesel-Straße 115, 46485 Wesel
                </div>
                <div className="text-sm mt-0.5 text-gray-500">
                  Erster Konferenzraum links im EG · barrierefrei
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Rudolf-Diesel-Straße+115+46485+Wesel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm no-underline transition-colors text-purple-400 hover:text-purple-300"
              >
                In Google Maps öffnen <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className={`rounded-xl p-4 mb-6 border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}>
              <p className="text-[10px] font-mono uppercase tracking-widest mb-2 text-gray-500">
                Anfahrt
              </p>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                B58 aus Schermbeck kommend Richtung Wesel → bei Polster Aktuell
                rechts → gegenüber BlueCraft GmbH links (Schilder "LASE").
                Parkplatz am Ende der Straße rechts. Links neben GUSTO Cubes
                befindet sich der Eingang.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="w-full xl:col-span-2 p-6 flex flex-col gap-5 hover:!border-purple-400/40 ">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest mb-1 text-gray-500">
                Termin
              </div>
              <div className={`text-2xl font-black font-gro ${isDark ? "text-white" : "text-slate-900"} leading-none`}>
                Jeden Mittwoch
              </div>
              <div className="text-xl font-bold font-gro mt-1 text-purple-400">
                18:00 – 19:30 Uhr
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col gap-2.5">
              {[
                "Außer an Feiertagen",
                "Außer in den Schulferien (NRW)",
                "Keine Anmeldung nötig. Einfach kommen!",
              ].map((note) => (
                <div key={note} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-purple-400" />
                  <span className="text-sm text-gray-400">{note}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/termine")}
              className="mt-auto w-full font-gro flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[14px] no-underline transition-colors bg-purple-500 hover:bg-purple-400 text-black"
            >
              Nächste Dojos ansehen <ArrowRight className="w-4 h-4" />
            </button>
          </GlassCard>
        </div>
      </section>
      {/* ── Voraussetzungen ──────────────────────────────── */}
      <section className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(74,222,128,0.15)",
                  border: "1px solid rgba(74,222,128,0.25)",
                }}
              >
                <Notebook className="w-4 h-4" style={{ color: "#4ade80" }} />
              </div>
              <div className={`font-bold font-gro ${isDark ? "text-white" : "text-slate-900"}`}>
                Voraussetzungen
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: "#4ade80" }}
                  />
                  <span className="text-[14px]" style={{ color: "#9ca3af" }}>
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6">
            <div
              className="text-[10px] uppercase font-mono tracking-widest mb-3"
              style={{
                color: "#4ade80",
              }}
            >
              Warum programmieren?
            </div>
            <div className={`text-lg font-black font-gro ${isDark ? "text-white" : "text-slate-900"} leading-snug mb-3`}>
              Deine Ideen. Deine Regeln. Deine Projekte.
            </div>
            <p
              className="text-[14px] font-thin leading-relaxed"
              style={{ color: "#9ca3af" }}
            >
              Eigene Spiele, Apps und Websites zu erstellen ist nicht nur cool,
              Programmieren und digitale Kreativität gehören heute zu den
              wichtigsten Fähigkeiten überhaupt. Und die CoderDojos sind kein
              Unterricht: Du lernst spielerisch und in deinem eigenen Tempo.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Spielerisch",
                "Kein Unterricht",
                "Gruppenarbeit",
                "Eigene Projekte",
              ].map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

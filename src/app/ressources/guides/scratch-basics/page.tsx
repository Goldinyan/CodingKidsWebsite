"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import GlassCard from "@/app/homepage/components/GlassCard";
import SectionHeading from "@/app/homepage/components/SectionHeading";
import SectionLabel from "@/app/homepage/components/SectionLabel";
import { useRouter } from "next/navigation";

export default function ScratchBasicsGuide() {
  const { theme, isRounded } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const sections = [
    {
      id: "what-is-scratch",
      title: "Was ist Scratch?",
      description: "Scratch ist eine visuelle Programmiersprache für Anfänger.",
      icon: BookOpen,
      color: "#4ade80",
      content: [
        "Scratch ist speziell für Anfänger konzipiert",
        "Du verwendest bunte Blöcke statt Code zu schreiben",
        "Kostenlos und online verfügbar",
        "Millionen von Nutzern weltweit",
      ],
    },
    {
      id: "first-steps",
      title: "Erste Schritte",
      description: "So fängst du an mit Scratch.",
      icon: BookOpen,
      color: "#38bdf8",
      content: [
        "Gehe zu scratch.mit.edu",
        "Klicke auf 'Anmelden'",
        "Erstelle einen Account",
        "Klicke auf 'Erstellen'",
      ],
    },
    {
      id: "blocks",
      title: "Die Blöcke verstehen",
      description: "Lerne die verschiedenen Blöcke kennen.",
      icon: BookOpen,
      color: "#a78bfa",
      content: [
        "🟠 Bewegung: Figur bewegen",
        "🔵 Aussehen: Figur verändern",
        "🟡 Sound: Geräusche abspielen",
        "🟢 Events: Auf Eingaben reagieren",
      ],
    },
  ];

  return (
    <div className={`w-full min-h-screen relative main-view-container transition-colors ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionLabel>TUTORIAL</SectionLabel>
          <h1
            className={`text-4xl md:text-5xl font-black font-gro tracking-medium leading-none mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Scratch Basics
          </h1>
          <p
            className={`text-lg font-thin leading-relaxed max-w-2xl ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Lerne die Grundlagen von Scratch und erstelle dein erstes Programm. Dieses
            Tutorial ist perfekt für absolute Anfänger.
          </p>
        </motion.div>

        {/* SECTIONS */}
        <div className="space-y-8 mb-20">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* ICON */}
                  <div
                    className={`w-12 h-12 flex items-center justify-center shrink-0 ${
                      isRounded ? "rounded-xl" : "rounded-none"
                    }`}
                    style={{
                      background: `${section.color}15`,
                      border: `1px solid ${section.color}30`,
                    }}
                  >
                    <section.icon className="w-6 h-6" style={{ color: section.color }} />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <h2
                      className={`text-2xl font-black font-gro mb-2 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {section.title}
                    </h2>
                    <p
                      className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-slate-600"}`}
                    >
                      {section.description}
                    </p>

                    {/* LIST ITEMS */}
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-3 text-sm ${
                            isDark ? "text-gray-300" : "text-slate-700"
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded-full shrink-0 mt-0.5"
                            style={{
                              background: `${section.color}30`,
                              border: `2px solid ${section.color}`,
                            }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-gradient-to-r from-green-500/10 to-purple-500/10 p-8 rounded-2xl border border-green-500/20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3
                className={`text-2xl font-black font-gro mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Bereit zum Starten?
              </h3>
              <p
                className={`text-base font-thin ${isDark ? "text-gray-400" : "text-slate-600"}`}
              >
                Gehe zu scratch.mit.edu und erschaffe etwas Großartiges!
              </p>
            </div>
            <a
              href="https://scratch.mit.edu"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 font-bold text-sm uppercase tracking-wider bg-green-500 text-white hover:bg-green-600 transition-all inline-flex items-center gap-2 ${
                isRounded ? "rounded-lg" : "rounded-none"
              }`}
            >
              Zu Scratch
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* BACK BUTTON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => router.back()}
            className={`px-4 py-2 text-sm font-mono uppercase tracking-widest ${
              isDark
                ? "text-gray-500 hover:text-gray-400"
                : "text-slate-500 hover:text-slate-600"
            }`}
          >
            ← Zurück
          </button>
        </motion.div>
      </div>
    </div>
  );
}

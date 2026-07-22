"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import GlassCard from "@/app/homepage/components/GlassCard";
import SectionLabel from "@/app/homepage/components/SectionLabel";
import { useRouter } from "next/navigation";

const TOPICS = [
  {
    title: "Python Installation",
    description: "Python für dein Betriebssystem herunterladen und installieren",
    color: "#4ade80",
  },
  {
    title: "Erste Programme",
    description: "Dein erstes Python Programm: print() und Variablen",
    color: "#38bdf8",
  },
  {
    title: "Datentypen",
    description: "Strings, Zahlen, Listen und Dictionaries verstehen",
    color: "#a78bfa",
  },
  {
    title: "Logik & Kontrollfluss",
    description: "If/Else, Schleifen und Funktionen schreiben",
    color: "#fb923c",
  },
  {
    title: "Spiele mit Turtle",
    description: "Interaktive Grafiken und einfache Spiele zeichnen",
    color: "#ec4899",
  },
  {
    title: "Projekte",
    description: "Kleine Projekte zusammen bauen und erweitern",
    color: "#06b6d4",
  },
];

export default function PythonGuide() {
  const { theme, isRounded } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

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
            Python Intro
          </h1>
          <p
            className={`text-lg font-thin leading-relaxed max-w-2xl ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Python ist eine der beliebtesten Programmiersprachen. Perfekt für Anfänger und
            mächtig für Profis!
          </p>
        </motion.div>

        {/* TOPICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {TOPICS.map((topic, idx) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
            >
              <GlassCard className="p-6 h-full">
                <div
                  className={`w-10 h-10 flex items-center justify-center mb-4 ${
                    isRounded ? "rounded-xl" : "rounded-none"
                  }`}
                  style={{
                    background: `${topic.color}15`,
                    border: `1px solid ${topic.color}30`,
                  }}
                >
                  <Zap className="w-5 h-5" style={{ color: topic.color }} />
                </div>

                <h3
                  className={`font-bold font-gro mb-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {topic.title}
                </h3>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}
                >
                  {topic.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* HELLO WORLD */}
        <GlassCard className="p-8 mb-12">
          <h3
            className={`text-xl font-black font-gro mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            🐍 Dein erstes Python Programm
          </h3>
          <pre
            className={`p-4 rounded-lg overflow-x-auto text-sm font-mono ${
              isDark
                ? "bg-black/30 border border-white/10 text-blue-400"
                : "bg-slate-100 border border-slate-200 text-blue-700"
            }`}
          >
            {`# Dein erstes Python Programm!
print("Hallo, Welt!")

# Variablen
name = "Ninja"
age = 13
print(f"Ich heiße {name} und bin {age} Jahre alt.")

# Schleifen
for i in range(5):
    print(f"Nummer: {i}")`}
          </pre>
        </GlassCard>

        {/* INFO */}
        <GlassCard className="p-8 mb-12 border-green-400/20">
          <div className="flex gap-4">
            <div className="text-2xl">🎯</div>
            <div>
              <h4
                className={`font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Warum Python?
              </h4>
              <ul
                className={`space-y-1 text-sm ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                <li>✓ Einfache und lesbare Syntax</li>
                <li>✓ Sehr vielseitig (Web, AI, Data Science)</li>
                <li>✓ Große Community und viele Ressourcen</li>
                <li>✓ Kostenlos und Open Source</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* BACK BUTTON */}
        <motion.div className="text-center">
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

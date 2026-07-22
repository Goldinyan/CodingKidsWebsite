"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import GlassCard from "@/app/homepage/components/GlassCard";
import SectionLabel from "@/app/homepage/components/SectionLabel";
import { useRouter } from "next/navigation";

const CHAPTERS = [
  {
    title: "HTML Grundlagen",
    topics: ["Was ist HTML?", "Tags & Elemente", "Semantic HTML"],
    color: "#38bdf8",
  },
  {
    title: "CSS Styling",
    topics: ["Selektoren", "Box Model", "Flexbox & Grid"],
    color: "#fb923c",
  },
  {
    title: "Responsive Design",
    topics: ["Media Queries", "Mobile First", "Layout Patterns"],
    color: "#a78bfa",
  },
  {
    title: "Deine erste Website",
    topics: ["Portfolio aufbauen", "Hosting", "Domain"],
    color: "#4ade80",
  },
];

export default function HtmlCssGuide() {
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
            HTML & CSS
          </h1>
          <p
            className={`text-lg font-thin leading-relaxed max-w-2xl ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Lerne, wie man professionelle Websites baut. Mit HTML für die Struktur und CSS
            für das Design.
          </p>
        </motion.div>

        {/* CHAPTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {CHAPTERS.map((chapter, idx) => (
            <motion.div
              key={chapter.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex flex-col gap-4">
                  {/* ICON */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center ${
                      isRounded ? "rounded-xl" : "rounded-none"
                    }`}
                    style={{
                      background: `${chapter.color}15`,
                      border: `1px solid ${chapter.color}30`,
                    }}
                  >
                    <Code2 className="w-5 h-5" style={{ color: chapter.color }} />
                  </div>

                  {/* CONTENT */}
                  <div>
                    <h3
                      className={`font-bold font-gro mb-3 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {chapter.title}
                    </h3>
                    <ul className="space-y-2">
                      {chapter.topics.map((topic) => (
                        <li
                          key={topic}
                          className={`text-sm flex items-center gap-2 ${
                            isDark ? "text-gray-400" : "text-slate-600"
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: chapter.color }}
                          />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* CODE EXAMPLE */}
        <GlassCard className="p-8 mb-12">
          <h3
            className={`text-xl font-black font-gro mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Dein erstes HTML Dokument
          </h3>
          <pre
            className={`p-4 rounded-lg overflow-x-auto text-xs font-mono ${
              isDark
                ? "bg-black/30 border border-white/10 text-green-400"
                : "bg-slate-100 border border-slate-200 text-green-700"
            }`}
          >
            {`<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Meine Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Willkommen!</h1>
    <p>Dies ist meine erste Website.</p>
</body>
</html>`}
          </pre>
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

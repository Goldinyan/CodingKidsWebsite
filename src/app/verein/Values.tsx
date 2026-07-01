"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  Lightbulb,
  Handshake,
  Heart,
  Sparkles,
  Presentation,
  MapPinned,
  School,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/context/ThemeContext";

const values = [
  {
    title: "Möglichkeiten",
    description:
      "Wir geben Kindern die Werkzeuge und das Selbstvertrauen, um Schöpfer und nicht nur Konsumenten von Technologie zu werden.",
    icon: Lightbulb,
  },
  {
    title: "Zusammenarbeit",
    description:
      "Wir fördern eine unterstützende Gemeinschaft, in der Schüler in einer teamorientierten Umgebung voneinander lernen.",
    icon: Handshake,
  },
  {
    title: "Zugänglichkeit",
    description:
      "Unsere Programme sind so konzipiert, dass sie inklusiv und für Kinder aus allen Verhältnissen verfügbar sind.",
    icon: Heart,
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    scale: 0.95,
    y: 30,
  },
  visible: {
    scale: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.25,
    },
  },
};

export default function Values({
  theme,
  isRounded,
}: {
  theme: Theme;
  isRounded: boolean;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      exit="hidden"
      viewport={{ once: false, margin: "0px 0px 40px 0px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {values.map(({ title, description, icon: Icon }, idx) => (
        <motion.div
          variants={itemVariants as Variants}
          layout
          key={title}
          className={`group ${isRounded ? "rounded-lg" : "rounded-none"} backdrop-blur-2xl p-6 border transition-colors duration-300 ${theme === "dark"
              ? "bg-white/5 border-white/10 hover:border-green-500/50 hover:bg-white/8"
              : "bg-slate-50 border-slate-300 hover:border-green-500 hover:bg-green-50"
            }`}
        >
          <div
            className={`w-12 h-12  rounded-lg flex items-center justify-center mb-6 transition-colors ${isRounded ? "rounded-lg" : "rounded-none"} 
${theme == "dark" ? "bg-white/10 group-hover:bg-white/20" : "bg-slate-200 group-hover:bg-slate-300 "}  `}
          >
            <Icon
              className={`w-6 h-6 group-hover:text-green-600 transition-colors duration-300 ${theme == "dark" ? "text-white" : "text-black"}`}
            />
          </div>
          <h3
            className={`text-lg font-semibold mb-4 ${theme == "dark" ? " text-white" : "text-black"}`}
          >
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

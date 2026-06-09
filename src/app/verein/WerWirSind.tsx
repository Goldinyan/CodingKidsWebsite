"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Handshake,
  Heart,
  Sparkles,
  Presentation,
  MapPinned,
  School,
} from "lucide-react";
import MentorenView from "./MentorView";
import { useTheme } from "@/context/ThemeContext";
import Values from "./Values";

export default function WerWirSind() {
  const { theme, isRounded } = useTheme();

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-center flex-col min-h-[450px] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center flex-col text-center px-6"
          >
            <h1
              className={`text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight ${theme == "dark" ? "text-white" : "text-black"}`}
            >
              Wir gestalten die digitale Zukunft.
            </h1>
            <p
              className={`text-lg md:text-xl max-w-2xl font-light leading-relaxed ${theme == "dark" ? "text-gray-300" : "text-gray-800"}`}
            >
              Unsere Mission ist es, Kinder für Technologie zu begeistern, ihre
              Kreativität zu fördern und sie zu den Innovatoren von morgen zu
              machen.
            </p>
          </motion.div>
        </div>

        <div className="w-full flex justify-center px-8 my-8">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.15 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`h-[1.5px]  w-full max-w-5xl origin-center ${theme == "dark" ? "bg-white" : "bg-black"}`}
          />
        </div>

        <div className="w-full px-8 py-20 relative">
          <div className="absolute pointer-events-none opacity-30" />

          <div className="w-full mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              {/* liebe diese badges */}
              <span className={`text-xs font-mono tracking-widest uppercase block mb-3 ${theme == "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                Antrieb & Motivation
              </span>
              
              <h2 className={`text-4xl md:text-5xl font-bold text-start mb-6 ${theme == "dark" ? "text-white" : "text-black"}`}>
                Was uns antreibt
              </h2>
              <p className={`text-xl text-start w-full max-w-2xl mr-auto font-light leading-relaxed ${theme == "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Unsere Mission ist es, digitale Bildung zugänglich und
                unterhaltsam zu machen und Kreativität, kritisches Denken und
                Zusammenarbeit für jedes Kind in unserer Gemeinschaft zu
                fördern.
              </p>
            </motion.div>

            <Values theme={theme} isRounded={isRounded} />
          </div>
        </div>

        <div>
          <MentorenView theme={theme} isRounded={isRounded} />
        </div>
      </div>
    </>
  );
}

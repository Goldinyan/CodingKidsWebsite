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
        <div className="flex items-center justify-center flex-col min-h-80 gap-6 ">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center flex-col text-center px-6"
          >
            <h1
              className={` text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight ${theme == "dark" ? "text-white" : "text-black"}`}
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

        {/*<History theme={theme} isRounded={isRounded}/> */}
        <div className="w-full px-8 py-20  relative">
          <div className="absolute pointer-events-none opacity-30" />

          <div className="max-w-5xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Was uns antreibt
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
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

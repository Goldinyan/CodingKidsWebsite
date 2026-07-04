"use client";

import { motion } from "framer-motion";
import MentorenView from "./MentorView";
import { useTheme } from "@/context/ThemeContext";
import Values from "./Values";

export default function WerWirSind() {
  const { theme, isRounded } = useTheme();

  return (
    <div
      className={`w-full min-h-screen font-['DM_Sans'] transition-colors duration-300 ${theme === "dark" ? "text-[#f4f4f5]" : " text-slate-700"
        }`}
    >
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 text-left max-w-4xl"
        >
          <span
            className={`font-['JetBrains_Mono'] text-[10px] tracking-[0.22em] uppercase block ${theme === "dark" ? "text-[#a855f7]" : "text-purple-600"
              }`}
          >
            Unsere Idee
          </span>
          <h1
            className={`text-4xl md:text-5xl font-black font-['Familjen_Grotesk'] tracking-tight leading-none uppercase ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Wir gestalten die digitale Zukunft.
          </h1>
          <p
            className={`text-xs md:text-md font-normal mt-4 max-w-xl leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
              }`}
          >
            Unsere Mission ist es, Kinder für Technologie zu begeistern, ihre
            Kreativität zu fördern und sie zu den Innovatoren von morgen zu
            machen.
          </p>
        </motion.div>
      </div>

      <div
        className={`w-full border-b ${theme === "dark" ? "border-zinc-900" : "border-slate-200"}`}
      />

      <div className="w-full px-6 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span
              className={`font-['JetBrains_Mono'] text-[10px] tracking-[0.22em] uppercase block mb-2 ${theme === "dark" ? "text-[#4ADE80]" : "text-green-600"
                }`}
            >
              Antrieb & Motivation
            </span>

            <h2
              className={`text-3xl md:text-4xl font-black font-['Familjen_Grotesk'] tracking-tight leading-none uppercase mb-6 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Was uns antreibt
            </h2>
            <p
              className={`text-xs md:text-md max-w-xl font-normal leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
                }`}
            >
              Unsere Mission ist es, digitale Bildung zugänglich und
              unterhaltsam zu machen und Kreativität, kritisches Denken und
              Zusammenarbeit für jedes Kind in unserer Gemeinschaft zu fördern.
            </p>
          </motion.div>

          <Values  />
        </div>
      </div>

      <div
        className={`w-full border-b ${theme === "dark" ? "border-zinc-900" : "border-slate-200"}`}
      />

      <div className="w-full py-16">
        <div className="max-w-6xl mx-auto">
          <MentorenView theme={theme} isRounded={isRounded} />
        </div>
      </div>
    </div>
  );
}

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

        <div className={`w-full px-8 py-20 `}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2
                  className={`text-4xl font-bold mb-6 ${theme == "dark" ? "text-white" : "text-black"}`}
                >
                  Von einer kleinen Idee zu einer regionalen Bewegung
                </h2>
                <p
                  className={`text-lg leading-relaxed font-light ${theme == "dark" ? "text-gray-400" : "text-gray-800"}`}
                >
                  Coding Kids Niederrhein begann mit einer einfachen
                  Überzeugung: Jedes Kind verdient die Chance, die Sprache der
                  Zukunft zu lernen. Was als kleiner Wochenend-Workshop anfing,
                  hat sich zu einer blühenden Gemeinschaft entwickelt, die
                  Hunderte von jungen Köpfen in der gesamten Region erreicht.
                  Wir widmen uns der Bereitstellung zugänglicher, unterhaltsamer
                  und hochwertiger Programmierausbildung, um Kinder auf eine
                  digitale Welt vorzubereiten.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className=""
              >
                <div className="flex">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors duration-300 ${theme === "dark"
                          ? "bg-white/10 border-white/20"
                          : "bg-green-50 border-green-200"
                        }`}
                    >
                      <Sparkles
                        className={`w-5 h-5 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-green-600"}`}
                      />
                    </div>
                    <div
                      className={`w-0.5 h-12 my-2 transition-colors duration-300 ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`}
                    />
                  </div>
                  <div className="pb-6">
                    <h3
                      className={`font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                    >
                      Erfolg 1
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
                    >
                      Datum 1
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors duration-300 ${theme === "dark"
                          ? "bg-white/10 border-white/20"
                          : "bg-green-50 border-green-200"
                        }`}
                    >
                      <Presentation
                        className={`w-5 h-5 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-green-600"}`}
                      />
                    </div>
                    <div
                      className={`w-0.5 h-12 my-2 transition-colors duration-300 ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`}
                    />
                  </div>
                  <div className="pb-6">
                    <h3
                      className={`font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                    >
                      Erfolg 2
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
                    >
                      Datum 2
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors duration-300 ${theme === "dark"
                          ? "bg-white/10 border-white/20"
                          : "bg-green-50 border-green-200"
                        }`}
                    >
                      <MapPinned
                        className={`w-5 h-5 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-green-600"}`}
                      />
                    </div>
                    <div
                      className={`w-0.5 h-12 my-2 transition-colors duration-300 ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`}
                    />
                  </div>
                  <div className="pb-6">
                    <h3
                      className={`font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                    >
                      Erfolg 3
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
                    >
                      Datum 3
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-300 ${theme === "dark"
                          ? "bg-white/10 border-white/20"
                          : "bg-green-50 border-green-200"
                        }`}
                    >
                      <School
                        className={`w-5 h-5 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-green-600"}`}
                      />
                    </div>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                    >
                      Erfolg 4
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
                    >
                      Datum 4
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="w-full px-8 py-20 bg-gradient-to-b from-black via-zinc-950 to-black relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-30" />

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map(({ title, description, icon: Icon }, idx) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/8 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 rounded-lg flex items-center justify-center mb-6 transition-colors">
                    <Icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mentors Section */}
        <div>
          <MentorenView />
        </div>
      </div>
    </>
  );
}

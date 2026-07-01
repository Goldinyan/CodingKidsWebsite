"use client";

import { Theme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { MapPinned, Presentation, School, Sparkle } from "lucide-react";

export default function History({
  theme,
  isRounded,
}: {
  theme: Theme;
  isRounded: boolean;
}) {
  return (
    <div className={`w-full px-8 py-20 `}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center"
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
              Coding Kids Niederrhein begann mit einer einfachen Überzeugung:
              Jedes Kind verdient die Chance, die Sprache der Zukunft zu lernen.
              Was als kleiner Wochenend-Workshop anfing, hat sich zu einer
              blühenden Gemeinschaft entwickelt, die Hunderte von jungen Köpfen
              in der gesamten Region erreicht. Wir widmen uns der Bereitstellung
              zugänglicher, unterhaltsamer und hochwertiger
              Programmierausbildung, um Kinder auf eine digitale Welt
              vorzubereiten.
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
                  <Sparkle
                    className={`w-5 h-5 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-green-600"}`}
                  />
                </div>
                <div
                  className={`w-0.5 h-12 my-2 transition-colors duration-300 ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`}
                />
              </div>
              <div className="pb-6">
                <h3
                  className={`ml-2 font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Erfolg 1
                </h3>
                <p
                  className={`ml-2 text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
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
                  className={`ml-2 font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Erfolg 2
                </h3>
                <p
                  className={`ml-2 text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
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
                  className={`ml-2 font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Erfolg 3
                </h3>
                <p
                  className={`ml-2 text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
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
                  className={`ml-2 font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Erfolg 4
                </h3>
                <p
                  className={`ml-2 text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
                >
                  Datum 4
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

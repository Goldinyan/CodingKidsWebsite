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
  return (
    <>
      {/* Hero Section */}
      <div className="w-full">
        <div className="flex items-center justify-center flex-col min-h-80 gap-6 bg-gradient-to-b from-black via-zinc-950 to-black relative">
          {/* Subtle background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-30" />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center flex-col text-center px-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              Wir gestalten die digitale Zukunft.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
              Unsere Mission ist es, Kinder für Technologie zu begeistern, ihre
              Kreativität zu fördern und sie zu den Innovatoren von morgen zu
              machen.
            </p>
          </motion.div>
        </div>

        {/* History + Timeline Section */}
        <div className="w-full px-8 py-20 bg-black">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* History Text */}
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Von einer kleinen Idee zu einer regionalen Bewegung
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed font-light">
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

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-0.5 h-12 bg-white/10 my-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="text-white font-semibold">Erfolg 1</h3>
                    <p className="text-gray-400 text-sm">Datum 1</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Presentation className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-0.5 h-12 bg-white/10 my-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="text-white font-semibold">Erfolg 2</h3>
                    <p className="text-gray-400 text-sm">Datum 2</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPinned className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-0.5 h-12 bg-white/10 my-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="text-white font-semibold">Erfolg 3</h3>
                    <p className="text-gray-400 text-sm">Datum 3</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <School className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Erfolg 4</h3>
                    <p className="text-gray-400 text-sm">Datum 4</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Values Section */}
        <div className="w-full px-8 py-20 bg-gradient-to-b from-black via-zinc-950 to-black relative">
          {/* Subtle background grid */}
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
                Unsere Mission ist es, digitale Bildung zugänglich und unterhaltsam
                zu machen und Kreativität, kritisches Denken und Zusammenarbeit für
                jedes Kind in unserer Gemeinschaft zu fördern.
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

"use client";

import {
  Clock,
  GraduationCap,
  Heart,
  MapPin,
  Rocket,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import GlassCard from "src/app/homepage/components/GlassCard";
import { useTheme } from "@/context/ThemeContext";

export default function TopView() {
  const router = useRouter();
  const { theme, isRounded } = useTheme();

  const features: { text: string; des: string; icon: React.ElementType }[] = [
    {
      text: "Für alle Altersgruppen",
      des: "Vom Einstieg mit blockbasierter Programmierung bis hin zu fortgeschrittenen textbasierten Sprachen wie JavaScript.",
      icon: GraduationCap,
    },
    {
      text: "Erfahrene Mentoren",
      des: "Lerne von leidenschaftlichen Informatiklern mit Praxiserfahrung in Technologie und Informatik.",
      icon: Users,
    },
    {
      text: "Zukunftsorientiert",
      des: "Wir vermitteln nicht nur Code, sondern auch Problemlösungskonzepte und kreatives Denken für die Welt von morgen.",
      icon: Rocket,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.92 },
    visible: {
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  return (
    <div className="">
      <div className="relative w-full px-4 pt-20 pb-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 1, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/*
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] mb-8"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.1)",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#d1d5db",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#4ade80" }}
              />
              CoderDojo Niederrhein · Wesel
            </div>
          */}
            <h1
              className="text-4xl md:text-5xl font-black tracking-medium leading-none mb-5"
              style={{ fontFamily: "'Familjen Grotesk', sans-serif" }}
            >
              Programmieren.
              <br />
              <span style={{ color: "#4ade80" }}>Kostenlos.</span>
              <br />
              Vor Ort.
            </h1>

            <p
              className="text-[20px] font-thin leading-relaxed mb-8 max-w-md"
              style={{ color: "#9ca3af" }}
            >
              CoderDojos sind kostenlose, reale Veranstaltungen für Kinder und
              Jugendliche zwischen 8 und 17 Jahren. Lerne Programmieren, baue
              Spiele, Webseiten und eigene Projekte — in deinem eigenen Tempo.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={() => router.push("/termine")}
              className={`transition-colors duration-300 px-4 py-2 font-medium text-xs border ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
                  ? "bg-green-400 text-black "
                  : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                }`}
            >
              Zum nächsten Dojo anmelden
            </motion.button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <motion.button
              onClick={() => router.push("/verein")}
              className={`transition-colors duration-300 px-4 py-2 font-thin text-xs border ${isRounded ? "rounded-lg" : "rounded-none"}  ${theme === "dark"
                  ? "bg-black text-white border-white/10 hover:border-white/5 hover:bg-white/5"
                  : "bg-white text-slate-900 border-slate-200 hover:border-slate-900 hover:bg-slate-50"
                }`}
            >
              Über den Verein
            </motion.button>
          </motion.div>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Teilnehmer", value: "8–17 Jahre" },
            { icon: Clock, label: "Jede Woche", value: "Mi, 18–19:30" },
            { icon: MapPin, label: "Standort", value: "Wesel, NRW" },
            { icon: Heart, label: "Eintritt", value: "Kostenlos" },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <GlassCard className="p-5 flex flex-col gap-2">
                <Icon className="w-4 h-4" style={{ color: "#4ade80" }} />
                <div
                  className="text-xl font-black tracking-tight text-white"
                  style={{ fontFamily: "'Familjen Grotesk', sans-serif" }}
                >
                  {value}
                </div>
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#6b7280",
                  }}
                >
                  {label}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/*
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, margin: "0px 0px -50px 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(({ text, des, icon: Icon }, idx) => {
            return (
              <motion.div
                key={text}
                variants={itemVariants}
                whileHover="hover"
                layout
                className={`group relative z-10 p-6 backdrop-blur-2xl border transition-colors duration-300 ${isRounded ? "rounded-lg" : "rounde-none"}  ${theme === "dark"
                    ? "bg-white/5 border-green-500/30 hover:border-green-500/60 hover:bg-white/10"
                    : "bg-slate-50 border-green-300 hover:border-green-500 hover:bg-green-50"
                  }`}
                style={{
                  boxShadow:
                    theme === "dark"
                      ? "0 4px 20px -2px rgba(0,0,0,0.4)"
                      : "0 4px 20px -2px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <Icon
                    className={`w-6 h-6 flex-shrink-0 mt-1 transition-colors duration-300 ${theme === "dark"
                        ? "text-gray-300 group-hover:text-green-400"
                        : "text-green-600"
                      }`}
                  />
                  <h3
                    className={`text-lg font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-slate-900"
                      } leading-tight`}
                  >
                    {text}
                  </h3>
                </div>
                <p
                  className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                    }`}
                >
                  {des}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      */}
      </div>
    </div>
  );
}

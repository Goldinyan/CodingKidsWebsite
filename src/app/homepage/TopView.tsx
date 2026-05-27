"use client";

import { useEffect, useState } from "react";
import type { UserData } from "@/BackEnd/type";
import { GraduationCap, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function TopView({
  data,
  loading,
}: {
  data: UserData | undefined;
  loading: boolean;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const showRegisterButton = data === undefined && !loading;

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
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1.0] },
    },
    hover: {
      y: -6,
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  return (
    <div className="">
      <div className="" />

      <div className="relative w-full px-8 pt-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1
            className={`text-5xl md:text-6xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"
              } tracking-tight mb-6 leading-tight`}
          >
            Die digitale Zukunft ihres Kindes beginnt hier.
          </h1>
          <p
            className={`text-lg md:text-xl ${theme === "dark" ? "text-gray-300" : "text-slate-600"
              } mb-12 leading-relaxed max-w-2xl font-light`}
          >
            Wir bieten unterhaltsame und lehrreiche Programmierkurse, um Kinder
            mit den Fähigkeiten für eine bessere Zukunft auszustatten.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`px-8 py-3 font-medium border ${theme === "dark"
                ? "bg-white text-black border-white hover:bg-gray-100"
                : "bg-green-600 text-white border-green-600 hover:bg-green-700"
              }`}
          >
            Kurse entdecken
          </motion.button>

          {showRegisterButton && (
            <motion.button
              onClick={() => router.push("/login")}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`px-8 py-3 font-medium border  ${theme === "dark"
                  ? "bg-black text-white border-gray-400 hover:border-white hover:bg-white/5"
                  : "bg-white text-slate-900 border-slate-400 hover:border-slate-900 hover:bg-slate-50"
                }`}
            >
              Jetzt registrieren
            </motion.button>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "0px 0px -50px 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(({ text, des, icon: Icon }, idx) => {
            const isGreen = true;
            const isPurple = false;

            return (
              <motion.div
                key={text}
                variants={itemVariants}
                whileHover="hover" // Greift jetzt sauber auf itemVariants.hover zu!
                className={`group relative z-10 p-6 backdrop-blur-sm border transition-colors duration-300 ${theme === "dark"
                    ? `bg-white/5 ${isGreen
                      ? "border-green-500/30 hover:border-green-500/60 hover:bg-white/10"
                      : isPurple
                        ? "border-purple-500/30 hover:border-purple-500/60 hover:bg-white/10"
                        : "border-white/10 hover:border-white/20 hover:bg-white/10"
                    }`
                    : `bg-slate-100 ${isGreen
                      ? "border-green-300 hover:border-green-500 hover:bg-green-50"
                      : isPurple
                        ? "border-purple-300 hover:border-purple-500 hover:bg-purple-50"
                        : "border-slate-300 hover:border-slate-400 hover:bg-slate-200"
                    }`
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
                        ? `text-gray-300 ${isGreen
                          ? "group-hover:text-green-400"
                          : isPurple
                            ? "group-hover:text-purple-400"
                            : "group-hover:text-white"
                        }`
                        : `${isGreen
                          ? "text-green-600"
                          : isPurple
                            ? "text-purple-600"
                            : "text-slate-600"
                        }`
                      }`}
                  />
                  <h3
                    className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"
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
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { UserData } from "@/BackEnd/type";
import { GraduationCap, Rocket, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function TopView({
  data,
  loading,
  isRounded,
}: {
  data: UserData | undefined;
  loading: boolean;
  isRounded: boolean;
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
      <div className="relative w-full px-8 pt-4 pb-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 1, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
              Wir bieten unterhaltsame und lehrreiche Programmierkurse, um
              Kinder mit den Fähigkeiten für eine bessere Zukunft auszustatten.
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
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`px-8 py-3 font-medium border ${isRounded && "rounded-lg"} ${theme === "dark"
                  ? "bg-white text-black border-white hover:bg-gray-200"
                  : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                }`}
            >
              Kurse entdecken
            </motion.button>
          </motion.div>

          <AnimatePresence mode="wait">
            {showRegisterButton && (
              <motion.div
                key="register-btn"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={() => router.push("/login")}
                  className={`px-8 py-3 font-medium border ${isRounded && "rounded-lg"}  ${theme === "dark"
                      ? "bg-black text-white border-gray-400 hover:border-white hover:bg-white/5"
                      : "bg-white text-slate-900 border-slate-400 hover:border-slate-900 hover:bg-slate-50"
                    }`}
                >
                  Jetzt registrieren
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                className={`group relative z-10 p-6 backdrop-blur-2xl border transition-colors duration-300 ${isRounded && "rounded-lg"} ${theme === "dark"
                    ? "bg-white/5 border-green-500/30 hover:border-green-500/60 hover:bg-white/10"
                    : "bg-slate-100 border-green-300 hover:border-green-500 hover:bg-green-50"
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
      </div>
    </div>
  );
}

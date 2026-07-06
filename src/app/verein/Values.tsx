"use client";

import { motion, Variants } from "framer-motion";
import { Lightbulb, Handshake, Heart } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const values = [
  {
    sysId: "CORE_VAL_01",
    title: "Möglichkeiten",
    description:
      "Wir geben Kindern die Werkzeuge und das Selbstvertrauen, um Schöpfer und nicht nur Konsumenten von Technologie zu werden.",
    icon: Lightbulb,
  },
  {
    sysId: "CORE_VAL_02",
    title: "Zusammenarbeit",
    description:
      "Wir fördern eine unterstützende Gemeinschaft, in der Schüler in einer teamorientierten Umgebung voneinander lernen.",
    icon: Handshake,
  },
  {
    sysId: "CORE_VAL_03",
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
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.3,
    },
  },
};

export default function Values() {
  const { theme, isRounded } = useTheme();

  const radiusClass = isRounded ? "rounded-[16px]" : "rounded-none";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -5px 0px" }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {values.map(({ sysId, title, description, icon: Icon }) => (
        <motion.div
          variants={itemVariants as Variants}
          key={title}
          className={`p-6 border transition-colors duration-200 group relative ${radiusClass} ${theme === "dark"
              ? "bg-[rgba(255,255,255,0.025)] border-[rgba(255,255,255,0.07)] hover:border-[#4ADE80] hover:bg-[rgba(255,255,255,0.04)]"
              : "bg-white border-slate-200 hover:border-green-600 hover:shadow-sm"
            }`}
        >
          <div className="flex items-center justify-between mb-6">
            {/*<span
              className={`font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase ${
                theme === "dark" ? "text-zinc-600" : "text-slate-400"
              }`}
            >
              {sysId}
            </span>*/}
            <Icon
              className={`w-4 h-4 transition-colors duration-200 ${theme === "dark"
                  ? "text-zinc-500 group-hover:text-[#4ADE80]"
                  : "text-slate-400 group-hover:text-green-600"
                }`}
            />

            <h3
              className={`text-md md:text-md font-black font-['Familjen_Grotesk'] tracking-tight uppercase  ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              {title}
            </h3>
          </div>

          <p
            className={`text-xs leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
              }`}
          >
            {description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function MiddleView() {
  const { theme } = useTheme();

  return (
    <div className={`w-full px-8 py-20 transition-colors duration-300 `}>
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className={`px-8 py-3 font-medium border transition-all duration-200 hover:scale-105 active:scale-100 ${theme === "dark"
            ? "bg-white text-black border-white hover:bg-gray-100"
            : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
          }`}
      >
        Lernen Sie mehr über Uns
      </motion.button>
    </div>
  );
}

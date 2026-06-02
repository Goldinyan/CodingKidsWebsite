"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function MiddleView() {
  const { theme } = useTheme();

  return (
    <div className="w-full px-8 py-20">
      <motion.button
        initial={{ scale: 0.92, y: 12 }}
        whileInView={{ scale: 1, y: 0 }}
        viewport={{ once: false, margin: "0px 0px -20px 0px" }}
        transition={{ duration: 0.3, ease: "easeOut" }} 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={`px-8 py-3 font-medium border ${theme === "dark"
            ? "bg-white text-black border-white hover:bg-gray-100"
            : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
          }`}
      >
        Lernen Sie mehr über Uns
      </motion.button>
    </div>
  );
}

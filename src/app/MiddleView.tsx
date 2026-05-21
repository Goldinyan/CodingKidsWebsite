"use client";

import { motion } from "framer-motion";

export default function MiddleView() {
  return (
    <div className="w-full px-8 py-20">
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-8 py-3 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-100"
      >
        Lernen Sie mehr über Uns
      </motion.button>
    </div>
  );
}

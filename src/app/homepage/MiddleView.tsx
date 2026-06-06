"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

export default function MiddleView({ isRounded }: { isRounded: boolean }) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className="w-full px-8 py-4">
      <motion.button
        initial={{ scale: 0.92, y: 12 }}
        whileInView={{ scale: 1, y: 0 }}
        viewport={{ once: false, margin: "0px 0px -20px 0px" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          router.push("/verein");
        }}
        className={`px-8 py-3 font-medium border ${isRounded && "rounded-lg"} ${theme === "dark"
            ? "bg-white text-black border-white hover:bg-gray-200"
            : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
          }`}
      >
        Lernen Sie mehr über Uns
      </motion.button>
    </div>
  );
}

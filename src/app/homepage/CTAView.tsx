"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

export default function CTAView() {
  const { theme, isRounded } = useTheme();
  const router = useRouter();

  return (
    <div className={`w-full py-20 transition-colors duration-300 `}>
      <div className="mx-auto px-8 max-w-4xl">
        <motion.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <div
            className={`backdrop-blur-2xl p-12 md:p-16 border transition-all duration-300 ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
                ? "bg-white/5 border-white/10 hover:border-white/20"
                : "bg-slate-50 border-slate-300 hover:border-slate-400"
              }`}
          >
            <div className="max-w-2xl">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
              >
                Bereit für die Zukunft?
              </h2>
              <p
                className={`text-lg mb-10 leading-relaxed font-light ${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  }`}
              >
                Starten Sie jetzt mit kostenlosen Kursen und entdecken Sie die
                spannende Welt der Programmierung. Keine Vorkenntnisse
                erforderlich!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/termine")}
                  className={`px-8 py-3 font-medium border transition-all duration-200 hover:scale-105 active:scale-100 flex items-center justify-center gap-2 group ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
                      ? "bg-white text-black border-white hover:bg-gray-100"
                      : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                    }`}
                >
                  Kostenlos Starten
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/verein")}
                  className={`px-8 py-3 font-medium border transition-all duration-200 hover:scale-105 active:scale-100 ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
                      ? "bg-transparent text-white border-gray-400 hover:border-white hover:bg-white/10"
                      : "bg-transparent text-slate-900 border-slate-400 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                    }`}
                >
                  Mehr erfahren
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

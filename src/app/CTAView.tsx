"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTAView() {
  return (
    <div className="w-full py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto px-8 max-w-4xl"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-12 md:p-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Bereit für die Zukunft?
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
              Starten Sie jetzt mit kostenlosen Kursen und entdecken Sie die
              spannende Welt der Programmierung. Keine Vorkenntnisse erforderlich!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-100 flex items-center justify-center gap-2 group">
                Kostenlos Starten
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-3 bg-transparent text-white font-medium border border-gray-400 hover:border-white hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-100">
                Mehr erfahren
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

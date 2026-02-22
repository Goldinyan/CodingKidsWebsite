"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTAView() {
  return (
    <div className="w-full px-8 py-20 bg-gradient-to-r from-fourthOwn to-secondaryOwn rounded-2xl mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bereit für die Zukunft?
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Starten Sie jetzt mit kostenlosen Kursen und entdecken Sie die spannende Welt der Programmierung. Keine Vorkenntnisse erforderlich!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-fourthOwn hover:bg-gray-100 font-semibold px-8 py-6 h-auto text-base">
            Kostenlos Starten
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/10 font-semibold px-8 py-6 h-auto text-base"
          >
            Mehr erfahren
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

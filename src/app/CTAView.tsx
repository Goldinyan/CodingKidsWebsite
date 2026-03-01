"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTAView() {
  return (
    <div className="w-full  bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="bg-white mx-auto mb-20 py-15 w-90 sm:w-[80%] md:w-[60%] shadow-md rounded-2xl  max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h2 className="text-2xl md:text-4xl w-[80%] mx-auto text-start text-black  font-bold mb-4">
            Bereit für die Zukunft?
          </h2>
          <p className=" md:text-md text-sm w-[80%] text-start text-graytext mb-8 mx-auto">
            Starten Sie jetzt mit kostenlosen Kursen und entdecken Sie die
            spannende Welt der Programmierung. Keine Vorkenntnisse erforderlich!
          </p>

          <div className="flex flex-col lg:flex-row w-[80%] md:w-[60%] lg:w-[30%] md:items-start mx-auto lg:items-start gap-4 justify-center">
            <Button className="bg-white w-full text-black border-1 border-primaryOwn hover:bg-gray-100 font-semibold  py-2 ">
              Kostenlos Starten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button className="bg-white w-full text-black border-1 border-secondaryOwn hover:bg-gray-100 font-semibold py-2 ">
              Mehr erfahren
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

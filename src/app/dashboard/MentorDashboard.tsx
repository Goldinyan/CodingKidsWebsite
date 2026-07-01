"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { getAllMentors, updateMentor } from "@/lib/db";
import { useState, useEffect } from "react";
import MentorCardAdmin from "./MentorCardAdmin";
import type { Mentor } from "@/BackEnd/type";

export default function MentorChangeView() {
  const { theme, isRounded } = useTheme();
  const [mentorData, setMentorData] = useState<Mentor[]>([]);

  const isDark = theme === "dark";
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

  useEffect(() => {
    const handleData = async () => {
      const data = await getAllMentors();
      setMentorData(data);
    };

    handleData();
  }, []);

  return (
    <div 
      className={`w-full p-6 min-h-screen transition-colors duration-200 ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1
              className={`text-4xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              MENTORENVERWALTUNG
            </h1>
            <p className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase mt-1 ${
              isDark ? "text-zinc-500" : "text-slate-400"
            }`}>
              System-Schnittstelle zur Modifikation administrativer Konten und Berechtigungen
            </p>
          </div>

          <div 
            className={`px-3 py-1.5 border border-dashed font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase ${radiusClass} ${
              isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-slate-200 text-slate-500 shadow-sm"
            }`}
          >
            REGISTRIERT: {String(mentorData.length).padStart(2, "0")}
          </div>
        </div>

        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.04 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 grid-cols-1 xl:grid-cols-2"
        >
          {mentorData.map((mentor, index) => (
            <motion.div
              key={mentor.uid || index}
              variants={{
                hidden: { y: 15, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <MentorCardAdmin
                uid={mentor.uid}
                name={mentor.name}
                role={mentor.role}
                insta={mentor.insta}
                linkedin={mentor.linkedin}
                github={mentor.github}
                description={mentor.des}
                picture={mentor.pic}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useInsertionEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import MentorCardAdmin from "./mentors/MentorCardAdmin";
import { useAppData } from "@/context/DataContext";
import { Plus } from "lucide-react";
import { NewMentorDialog } from "./mentors/NewMentorDialog";
import { addMentor } from "@/lib/db"; // Pfad ggf. anpassen
import type { Mentor } from "@/BackEnd/type";
import { useNotificationToast } from "@/hooks/useNotificationToast";

export default function MentorChangeView() {
  const { theme, isRounded } = useTheme();
  const { getMentors, refreshData } = useAppData();
  const { showErrorToast } = useNotificationToast();

  const [isAddingMentor, setIsAddingMentor] = useState(false);
  const [newMentor, setNewMentor] = useState<Partial<Mentor>>({
    name: "",
    role: "",
    des: "",
    pic: "",
    insta: "",
    github: "",
    linkedin: "",
  });

  const isDark = theme === "dark";
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

  const rawMentorData = getMentors();

  const handleAddMentor = async () => {
    if (!newMentor.name) return;
    try {
      await addMentor(newMentor);
      setIsAddingMentor(false);
      setNewMentor({
        name: "",
        role: "",
        des: "",
        pic: "",
        insta: "",
        github: "",
        linkedin: "",
      });

      await refreshData("mentors");
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div
      className={`w-full p-6 min-h-screen transition-colors duration-200 ${isDark ? "text-white" : "text-slate-900"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1
              className={`md:text-4xl text-3xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              MENTOREN
            </h1>
            <p
              className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase mt-1 ${isDark ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              System-Schnittstelle zur Modifikation administrativer Konten und
              Berechtigungen
            </p>
          </div>
          {/*<div
            className={`px-3 py-1.5 border border-dashed font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase ${radiusClass} ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                : "bg-white border-slate-200 text-slate-500 shadow-sm"
            }`}
          >
            REGISTRIERT: {String(rawMentorData.length).padStart(2, "0")}
          </div>*/}
          <button
            onClick={() => setIsAddingMentor(true)}
            className={`px-6 py-3 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} ${theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-600 hover:bg-purple-700 shadow-sm"
              }`}
          >
            <Plus className="w-4 h-4" />
            ADD_MENTOR
          </button>
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
          {rawMentorData.map((mentor, index) => (
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

        <NewMentorDialog
          open={isAddingMentor}
          onOpenChange={setIsAddingMentor}
          newMentor={newMentor}
          onNewMentorChange={setNewMentor}
          onCreate={handleAddMentor}
        />
      </div>
    </div>
  );
}

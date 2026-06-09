"use client";

import { MentorCard } from "./MentorCard";
import { getAllMentors } from "@/lib/db";
import type { Mentor } from "@/BackEnd/type";
import { useState, useEffect } from "react";
import { Theme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { SimpleMentorCard } from "./mentor/SimpleMentorCard";

export default function MentorenView({
  theme,
  isRounded,
}: {
  theme: Theme;
  isRounded: boolean;
}) {
  const [mentorData, setMentorData] = useState<Mentor[]>([]);
  const [filMentors, setFilMentors] = useState<Mentor[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>(null);

  useEffect(() => {
    const sortedMentors = [...mentorData].sort((a, b) =>
      a.uid === expandedMentorId ? -1 : b.uid === expandedMentorId ? 1 : 0,
    );
    const filtered = showAll ? sortedMentors : sortedMentors.slice(0, 3);
    setFilMentors(filtered);
  }, [expandedMentorId, mentorData, showAll]);

  useEffect(() => {
    const handleData = async () => {
      const allMentores = await getAllMentors();
      const orderedMentors = allMentores.sort((a, b) => a.id - b.id);
      setMentorData(orderedMentors);
    };
    handleData();
  }, []);

  const containerVariants = {
    hidden: {},

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.06,

        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      scale: 0.95,

      y: 30,
    },

    visible: {
      scale: 1,

      y: 0,

      transition: {
        type: "tween",

        ease: "easeOut",

        duration: 0.25,
      },
    },
  };

  return (
    <div className="w-full py-24">
      <div className="w-full flex flex-col items-start justify-center gap-16">
        <div className="flex flex-col items-start text-center px-8">
          <span
            className={`text-xs font-mono tracking-widest uppercase mb-3 ${theme == "dark" ? "text-zinc-500" : "text-zinc-400"}`}
          >
            Das Team
          </span>
          <h2
            className={`text-4xl text-start md:text-5xl font-bold tracking-tight mb-6 max-w-2xl leading-tight ${theme == "dark" ? "text-white" : "text-black"}`}
          >
            Lernen Sie die Menschen hinter der Mission kennen
          </h2>
          <p
            className={`text-lg text-start md:text-xl max-w-3xl font-light leading-relaxed ${theme == "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Unser Team ist eine engagierte Gruppe von Entwicklern und
            Freiwilligen, die sich leidenschaftlich dafür einsetzen, die nächste
            Generation von Entwicklern zu formen und zu begleiten.
          </p>
        </div>

        <section id="mentor" className="mx-auto w-full px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false, margin: "0px 0px -50px 0px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 "
          >
            {filMentors.map((mentor) => (
              <motion.div
                key={mentor.uid}
                variants={itemVariants}
                layout="position"
                className=""
              >
                <SimpleMentorCard
                  props={{
                    uid: "0",
                    id: 0,
                    name: mentor.name,
                    role: mentor.role,
                    des1: mentor.des1,
                    des2: mentor.des2,
                    insta: mentor.insta,
                    github: mentor.github,
                    linkedin: mentor.linkedin,
                    pic: mentor.pic,
                    theme: theme,
                    isRounded: isRounded,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="pt-4 w-full flex items-center justify-center">
          <motion.p
            layout
            className={`mx-auto  font-medium backdrop-blur-2xl border transition-colors duration-300 cursor-pointer py-3 px-6 text-sm ${isRounded ? "rounded-md" : "rounded-none"
              } ${theme == "dark"
                ? "border-zinc-800 text-gray-300 bg-white/5 hover:bg-white/10"
                : "border-zinc-200 text-black bg-transparent hover:bg-black/5"
              }`}
            onClick={() => setShowAll((prev) => !prev)}
          >
            {!showAll ? (
              <span>Alle Mentoren anzeigen</span>
            ) : (
              <span>Weniger anzeigen</span>
            )}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

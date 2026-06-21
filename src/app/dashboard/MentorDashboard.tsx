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

  useEffect(() => {
    const handleData = async () => {
      const data = await getAllMentors();
      setMentorData(data);
    };

    handleData();
  }, []);

  return (
    <div className={`w-full p-6 min-h-screen transition-colors duration-300 `}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Mentoren Verwaltung
          </h1>
        </div>

        <motion.div
          variants={{
            hidden: {},
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          className="grid gap-6 grid-cols-1 xl:grid-cols-2 "
        >
          {mentorData.map((mentor, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 1, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
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

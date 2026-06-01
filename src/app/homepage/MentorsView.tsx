"use client";

import { useEffect, useState } from "react";
import { getAllMentors } from "@/lib/db";
import { Mentor } from "@/BackEnd/type";
import { motion } from "framer-motion";
import { MentorCard } from "../verein/MentorCard";
import { useAuth } from "@/BackEnd/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function MentorsView() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [orderedMentors, setOrderedMentors] = useState<Mentor[]>([]);
  const [expanded, setExpanded] = useState<number>(0);




  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();
  const { theme } = useTheme();


  const expandMentor = (id: number): void => {
    const mentors: Mentor[] = [];

    for(let i = 0; i < expanded; i++){
      mentors.push(orderedMentors[i]);
    }

    mentors.push(orderedMentors[id]);


    for(let i = expanded + 1; i < orderedMentors.length; i++){
      mentors.push(orderedMentors[i]);
    }

    setOrderedMentors(mentors);
  }

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const allMentors = await getAllMentors(
          user?.uid || "anonymous",
          userRole,
        );
        setMentors(allMentors.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [user?.uid, userRole]);

  if (loading) {
    return (
      <div className={`w-full px-8 py-16 transition-colors duration-300 `}>
        <p
          className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-white" : "text-slate-900"
            }`}
        >
          Unsere Mentoren
        </p>
        <p className={theme === "dark" ? "text-gray-500" : "text-slate-500"}>
          Lädt...
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className={`w-full px-8 py-20 transition-colors duration-300 `}>
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2
            className={`text-4xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Unsere Mentoren
          </h2>
          <p
            className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-slate-600"
              }`}
          >
            Lerne von erfahrenen Profis mit Leidenschaft für Informatik
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxxl:grid-cols-4 3xl:grid-cols-5 gap-10"
      >
        {mentors.map((mentor) => (
          <div key={mentor.uid}>
            <motion.div variants={itemVariants} layout>
              <MentorCard
                name={mentor.name}
                description1={mentor.des1}
                description2={mentor.des2}
                picture={mentor.pic}
                theme={theme}
              />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

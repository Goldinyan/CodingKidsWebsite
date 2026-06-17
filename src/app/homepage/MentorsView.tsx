"use client";

import { useEffect, useState } from "react";
import { getAllMentors } from "@/lib/db";
import { Mentor } from "@/BackEnd/type";
import { m, motion } from "framer-motion";
import { MentorCard } from "../verein/MentorCard";
import { useAuth } from "@/BackEnd/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  SimpleMentorCard,
  SimpleMentorCardProps,
} from "../verein/mentor/SimpleMentorCard";

export default function MentorsView({ isRounded }: { isRounded: boolean }) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [orderedMentors, setOrderedMentors] = useState<Mentor[]>([]);
  const [expanded, setExpanded] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();
  const { theme } = useTheme();

  const expandMentor = (id: number): void => {
    const mentors: Mentor[] = [];

    for (let i = 0; i < expanded; i++) {
      mentors.push(orderedMentors[i]);
    }

    mentors.push(orderedMentors[id]);

    for (let i = expanded + 1; i < orderedMentors.length; i++) {
      mentors.push(orderedMentors[i]);
    }

    setOrderedMentors(mentors);
  };

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
    hidden: {},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06, //zwischen den children
        delayChildren: 0.05, // vor dem ersten
      },
    },
  };

  const itemVariants = {
    hidden: {
      scale: 0.95,
      y: 30, // Startet tiefer im Bildschirm
    },
    visible: {
      scale: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut", // Schnell starten, abrupt stoppen
        duration: 0.25, // Schön knackig kurz
      },
    },
  };
  return (
    <div className={`w-full px-8 py-20 transition-colors duration-300 `}>
      <div className="mb-12">
        <span
          className={`text-xs font-mono tracking-widest uppercase block mb-3 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}
        >
          Das Team
        </span>
        <h2
          className={`text-4xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
            }`}
        >
          Unser Vorstand
        </h2>
        <p
          className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-slate-600"
            }`}
        >
          Wer wir sind, was uns antreibt und wer hier die Fäden zieht.{" "}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: false, margin: "0px 0px -50px 0px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-10"
      >
        {mentors.slice(0, 3).map((mentor) => (
          <motion.div
            key={mentor.uid}
            variants={itemVariants}
            layout="position"
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
    </div>
  );
}

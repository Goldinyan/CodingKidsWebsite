"use client";

import { useEffect, useState, useRef } from "react";
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
import SectionLabel from "./components/SectionLabel";
import SectionHeading from "./components/SectionHeading";

export default function MentorsView() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [orderedMentors, setOrderedMentors] = useState<Mentor[]>([]);
  const [expanded, setExpanded] = useState<number>(0);

  const { user, userRole, loading } = useAuth();
  const { theme, isRounded } = useTheme();

  const hasFetched = useRef<string | null>(null);

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
    if (loading) {
      return;
    }

    if (user) {
      const currentKey = `${user.uid}-${userRole}`;
      if (hasFetched.current === currentKey) return;

      hasFetched.current = currentKey;
    }

    const fetchMentors = async () => {
      try {
        const allMentors = await getAllMentors(user?.uid, userRole);
        setMentors(allMentors.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      }
    };

    fetchMentors();
  }, [user?.uid, userRole, loading, user]);

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
      <div className="flex items-end justify-between mb-10">
        <div>
          <SectionLabel>Das Team</SectionLabel>
          <SectionHeading>Unser Vorstand</SectionHeading>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: false, margin: "0px 0px -50px 0px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
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
                des: mentor.des,
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

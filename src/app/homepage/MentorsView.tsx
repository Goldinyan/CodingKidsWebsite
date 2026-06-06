"use client";

import { useEffect, useState } from "react";
import { getAllMentors } from "@/lib/db";
import { Mentor } from "@/BackEnd/type";
import { motion } from "framer-motion";
import { MentorCard } from "../verein/MentorCard";
import { useAuth } from "@/BackEnd/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Github, Twitter } from "lucide-react";

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

  /*
   *
   * 
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
                <img src={`https://i.pravatar.cc/150?img=${i + 10}`} className="w-16 h-16 rounded-full object-cover bg-zinc-100" />
                <div>
                    <h3 className="font-bold text-lg dark:text-white">Alex Morgan</h3>
                    <p className="text-blue-600 font-medium text-sm">Full Stack Developer</p>
                </div>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                Passionate about building scalable web applications and accessible user interfaces. Loves coffee and open source.
            </p>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex gap-2">
                    <a href="#" className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors"><Twitter size={16} /></a>
                    <a href="#" className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Github size={16} /></a>
                </div>
                <a href="#" className="text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-wider">Portfolio</a>
            </div>
        </div>
    ))}
</div>

  */

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`https://i.pravatar.cc/150?img=${i + 10}`}
                className="w-16 h-16 rounded-full object-cover bg-zinc-100"
              />
              <div>
                <h3 className="font-bold text-lg dark:text-white">
                  Alex Morgan
                </h3>
                <p className="text-blue-600 font-medium text-sm">
                  Full Stack Developer
                </p>
              </div>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
              Passionate about building scalable web applications and accessible
              user interfaces. Loves coffee and open source.
            </p>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex gap-2">
                <a
                  href="#"
                  className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="#"
                  className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <Github size={16} />
                </a>
              </div>
              <a
                href="#"
                className="text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white uppercase tracking-wider"
              >
                Portfolio
              </a>
            </div>
          </div>
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: false, margin: "0px 0px -50px 0px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxxl:grid-cols-4 3xl:grid-cols-5 gap-10"
      >
        {mentors.map((mentor) => (
          <motion.div
            key={mentor.uid}
            variants={itemVariants}
            layout="position"
          >
            <MentorCard
              name={mentor.name}
              description1={mentor.des1}
              description2={mentor.des2}
              picture={mentor.pic}
              theme={theme}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

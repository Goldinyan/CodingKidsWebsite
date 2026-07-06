"use client";

import { getAllMentors } from "@/lib/db";
import type { Mentor } from "@/BackEnd/type";
import { useState, useEffect, useRef, useMemo } from "react";
import { Theme } from "@/context/ThemeContext";
import { motion, Variants } from "framer-motion";
import { SimpleMentorCard } from "./mentor/SimpleMentorCard";
import { useAuth } from "@/BackEnd/AuthContext";
import { useNotificationToast } from "@/hooks/useNotificationToast";

export default function MentorenView({
  theme,
  isRounded,
}: {
  theme: Theme;
  isRounded: boolean;
}) {
  const [mentorData, setMentorData] = useState<Mentor[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>(null);

  const { user, userRole, loading } = useAuth();
  const { showFetchError } = useNotificationToast();

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (user) {
      const currentKey = user ? `${user.uid}-${userRole}` : "guest";
      if (hasFetched.current === currentKey) return;
      hasFetched.current = currentKey;
    }

    const handleData = async () => {
      try {
        const allMentores = await getAllMentors(user?.uid, userRole);
        const orderedMentors = allMentores.sort((a, b) => a.id - b.id);
        setMentorData(orderedMentors);
      } catch (error) {
        showFetchError(error);
      }
    };

    handleData();
  }, [loading, user, userRole, showFetchError]);

  const containerVariants = {
    hidden: {},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.3,
      },
    },
  };

  const radiusClass = isRounded ? "rounded-lg" : "rounded-none";

  return (
    <div className="w-full py-20 px-4 font-['DM_Sans']">
      <div className="w-full flex flex-col items-start justify-center gap-12">
        <div className="flex flex-col items-start text-left px-8 max-w-4xl">
          <span
            className={`font-['JetBrains_Mono'] text-[10px] tracking-[0.22em] uppercase block mb-2 ${theme === "dark" ? "text-[#4ADE80]" : "text-green-600"
              }`}
          >
            UNSER TEAM{" "}
          </span>

          <h2
            className={`text-3xl md:text-4xl font-black font-['Familjen_Grotesk'] tracking-tight leading-none uppercase mb-6 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Lernen Sie die Menschen hinter der Mission kennen
          </h2>
          <p
            className={`text-sm md:text-md  font-normal leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
              }`}
          >
            Unser Team ist eine engagierte Gruppe von Entwicklern und
            Freiwilligen, die sich leidenschaftlich dafür einsetzen, die nächste
            Generation von Entwicklern zu formen und zu begleiten.
          </p>
        </div>

        <section id="mentor" className="mx-auto w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -10px 0px" }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {mentorData.map((mentor) => (
              <motion.div
                key={mentor.uid}
                variants={itemVariants as Variants}
                layout="position"
              >
                <SimpleMentorCard
                  props={{
                    uid: mentor.uid,
                    id: mentor.id,
                    name: mentor.name,
                    role: mentor.role,
                    des: mentor.des,
                    insta: mentor.insta,
                    github: mentor.github,
                    linkedin: mentor.linkedin,
                    pic: mentor.pic,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
        {/*
        {mentorData.length > 3 && (
          <div className="pt-4 w-full flex items-center justify-center">
            <motion.button
              layout
              type="button"
              className={`font-['JetBrains_Mono'] font-bold text-xs tracking-widest uppercase border transition-all duration-150 py-3.5 px-8 ${radiusClass} ${theme === "dark"
                  ? "border-zinc-800 text-zinc-300 bg-[rgba(255,255,255,0.025)] hover:border-[#4ADE80] hover:bg-[rgba(255,255,255,0.05)] active:bg-zinc-950"
                  : "border-slate-200 text-slate-800 bg-white hover:border-green-600 hover:shadow-sm active:bg-slate-50"
                }`}
              onClick={() => setShowAll((prev) => !prev)}
            >
              {!showAll ? (
                <span>MEHR ANZEIGEN</span>
              ) : (
                <span>WENIGER ANZEIGEN</span>
              )}
            </motion.button>
          </div>
        )}*/}
      </div>
    </div>
  );
}

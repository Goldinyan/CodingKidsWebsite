"use client";

import { Button } from "@/components/ui/button";
import { MentorCard } from "./MentorCard";
import { getAllMentors } from "@/lib/db";
import type { Mentor } from "@/BackEnd/type";
import { useState, useEffect, use } from "react";
import { Theme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
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
      console.log(allMentores);
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
    <div>
      <div>
        <div className="w-full flex flex-col items-center justify-center pt-10 pb-10 gap-10 ">
          <p className="text-center w-[70%] text-4xl lg:text-4xl xl:text-5xl pt-5 font-bold">
            Lernen Sie die Menschen hinter der Mission kennen
          </p>
          <p className=" text-center  1:w-70 text-lg sm:w-100 md:w-140 lg:text-2xl  xl:text-2xl lg:w-200 text-muted-foreground ">
            Unser Team ist eine engagierte Gruppe von Entwicklern und
            Freiwilligen, die sich leidenschaftlich dafür einsetzen, die nächste
            Generation von Entwickelern zu form
          </p>
          <section id="mentor">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              exit="hidden"
              viewport={{ once: false, margin: "0px 0px -50px 0px" }}
              className="mx-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxxl:grid-cols-4 3xl:grid-cols-5 gap-10"
            >
              {filMentors.map((mentor, index) => (
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
          </section>
          <div>
            <motion.p
              layout
              className={`font-medium backdrop-blur-2xl border transition-colors duration-300 cursor-pointer py-3 px-4 ${isRounded ? "rounded-md" : "rounded-none"
                } ${theme == "dark"
                  ? "border-zinc-800 text-gray-300 bg-white/5"
                  : "text-black bg-transparent border-zinc-200"
                }`}
              onClick={() => setShowAll((prev) => !prev)}
            >
              {!showAll ? (
                <span>Alle Mentoren anzeigen</span>
              ) : (
                <span>Weniger anzeigen</span>
              )}{" "}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getAllMentors } from "@/lib/db";
import { Mentor } from "@/BackEnd/type";
import { motion } from "framer-motion";
import { MentorCard } from "./verein/MentorCard";
import { useAuth } from "@/BackEnd/AuthContext";

export default function MentorsView() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();

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
      <div className="w-full px-8 py-16">
        <p className="text-2xl font-bold text-white mb-8">Unsere Mentoren</p>
        <p className="text-gray-500">Lädt...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="w-full px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-3">Unsere Mentoren</h2>
        <p className="text-gray-400 text-lg">
          Lerne von erfahrenen Profis mit Leidenschaft für Informatik
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxxl:grid-cols-4 3xl:grid-cols-5 gap-10"
      >
        {mentors.map((mentor) => (
          <motion.div
            key={mentor.uid}
            variants={itemVariants}
            className="text-center"
          >
            <MentorCard
              name={mentor.name}
              description1={mentor.des1}
              picture={mentor.pic}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getAllMentors } from "@/lib/db";
import { Mentor } from "@/BackEnd/type";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MentorCard } from "./verein/MentorCard";

export default function MentorsView() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const allMentors = await getAllMentors();
        setMentors(allMentors.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-8 py-16">
        <p className="text-2xl font-bold mb-8">Unsere Mentoren</p>
        <p className="text-gray-500">Lädt...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-16 bg-gradient-to-b from-transparent to-purple-50">
      <p className="text-3xl font-bold mb-2">Unsere Mentoren</p>
      <p className="text-gray-600 mb-10">
        Lerne von erfahrenen Profis mit Leidenschaft für Informatik
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-30 mx-auto w-full bg-red-500">
        {mentors.map((mentor, idx) => (
          <motion.div
            key={mentor.uid}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="text-center"
          >
            <MentorCard
              key={mentor.uid}
              name={mentor.name}
              description1={mentor.des1}
              description2={mentor.des2}
              picture={mentor.pic}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

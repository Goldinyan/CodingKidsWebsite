"use client";

import { useEffect, useState } from "react";
import { getAllMentors } from "@/lib/db";
import { Mentor } from "@/BackEnd/type";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function MentorsView() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const allMentors = await getAllMentors();
        setMentors(allMentors.slice(0, 4));
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mentors.map((mentor, idx) => (
          <motion.div
            key={mentor.uid}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="text-center"
          >
            <div className="relative mb-4 group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl overflow-hidden relative">
                {mentor.pic ? (
                  <Image
                    src={"/" + mentor.pic}
                    alt={mentor.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-300 to-blue-300 text-4xl font-bold text-white">
                    {mentor.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <Star className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-1">{mentor.name}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {mentor.des1}
            </p>
            <p className="text-xs text-gray-500">{mentor.des2}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Award, Target } from "lucide-react";

export default function StatsView() {
  const stats = [
    {
      number: "500+",
      label: "Kinder unterrichtet",
      icon: Users,
      color: "text-blue-500",
    },
    {
      number: "30+",
      label: "Kurse & Workshops",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      number: "20+",
      label: "Erfahrene Mentoren",
      icon: Award,
      color: "text-purple-500",
    },
    {
      number: "98%",
      label: "Zufriedenheitsquote",
      icon: Target,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="w-full px-8 py-16">
      <p className="text-3xl font-bold mb-2 text-center">Unser Einfluss</p>
      <p className="text-gray-600 mb-10 text-center">Zahlen, die für sich sprechen</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className={`flex justify-center mb-4 ${stat.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <p className="text-3xl font-bold mb-2">{stat.number}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

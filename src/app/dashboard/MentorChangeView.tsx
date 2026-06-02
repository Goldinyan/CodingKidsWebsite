"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { getAllMentors, updateMentor } from "@/lib/db";
import { useState, useEffect } from "react";
import MentorCardAdmin from "./MentorCardAdmin";
import type { Mentor } from "@/BackEnd/type";

export default function MentorChangeView() {
        const { theme } = useTheme();
        const [mentorData, setMentorData] = useState<Mentor[]>([]);

        useEffect(() => {
                const handleData = async () => {
                        const data = await getAllMentors();
                        setMentorData(data);
                };

                handleData();
        }, []);

        return (
                <div className={`w-full p-6 min-h-screen transition-colors duration-300 ${theme === "dark"
                        ? "bg-black"
                        : "bg-slate-50"
                }`}>
                        <div className="max-w-7xl mx-auto">
                                <div className="mb-8">
                                        <h1 className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                                                Mentoren Verwaltung
                                        </h1>
                                        <p className={theme === "dark" ? "text-gray-400" : "text-slate-600"}>
                                                Verwalten Sie Ihre Mentoren und deren Informationen
                                        </p>
                                </div>

                                <motion.div
                                        variants={{
                                                hidden: {},
                                                visible: {
                                                        opacity: 1,
                                                        transition: { staggerChildren: 0.06 },
                                                },
                                        }}
                                        initial="hidden"
                                        whileInView="visible"
                                        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                >
                                        {mentorData.map((mentor, index) => (
                                                <motion.div
                                                        key={index}
                                                        variants={{
                                                                hidden: { opacity: 0, y: 20 },
                                                                visible: { opacity: 1, y: 0 },
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                >
                                                        <MentorCardAdmin
                                                                uid={mentor.uid}
                                                                name={mentor.name}
                                                                description1={mentor.des1}
                                                                description2={mentor.des2}
                                                                picture={mentor.pic}
                                                        />
                                                </motion.div>
                                        ))}
                                </motion.div>
                        </div>
                </div>
        );
}

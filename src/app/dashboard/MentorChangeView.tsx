"use client";

import { getAllMentors, updateMentor } from "@/lib/db";
import { useState, useEffect } from "react";
import MentorCardAdmin from "./MentorCardAdmin";
import type { Mentor } from "@/BackEnd/type";

export default function MentorChangeView() {
        const [mentorData, setMentorData] = useState<Mentor[]>([]);

        useEffect(() => {
                const handleData = async () => {
                        const data = await getAllMentors();
                        setMentorData(data);
                };

                handleData();
        }, []);

        return (
                <div className="w-full p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
                        <div className="max-w-7xl mx-auto">
                                <div className="mb-8">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                                Mentoren Verwaltung
                                        </h1>
                                        <p className="text-gray-600">
                                                Verwalten Sie Ihre Mentoren und deren Informationen
                                        </p>
                                </div>

                                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                        {mentorData.map((mentor, index) => (
                                                <MentorCardAdmin
                                                        uid={mentor.uid}
                                                        key={index}
                                                        name={mentor.name}
                                                        description1={mentor.des1}
                                                        description2={mentor.des2}
                                                        picture={mentor.pic}
                                                />
                                        ))}
                                </div>
                        </div>
                </div>
        );
}

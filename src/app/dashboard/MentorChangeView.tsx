"use client";

import { getAllMentors, updateMentor } from "@/lib/db";
import { useState, useEffect, use } from "react";
import { ArrowUp, ArrowDown} from "lucide-react"
import  MentorCardAdmin  from "./MentorCardAdmin";
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

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
  );
}


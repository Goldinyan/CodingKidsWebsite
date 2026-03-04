"use client";

import { getAllMentors, updateMentor } from "@/lib/db";
import { useState, useEffect, use } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
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

  useEffect(() => { }, []);

  return (
    <>
      <div className="flex flex-col mx-auto w-[80%] items-center md:items-start justify-center gap-5">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 w-full">
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

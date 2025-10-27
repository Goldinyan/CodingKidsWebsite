"use client";

import { Button } from "@/components/ui/button";
import { MentorCard } from "./MentorCard";
import { getAllMentors, Mentor } from "@/lib/db";
import { useState, useEffect, use } from "react";

export default function MentorenView() {
  const [mentorData, setMentorData] = useState<Mentor[]>([]);
  const [filMentors, setFilMentors] = useState<Mentor[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>(null);

  

  useEffect(() => {
  const sortedMentors = [...mentorData].sort((a, b) =>
    a.uid === expandedMentorId ? -1 : b.uid === expandedMentorId ? 1 : 0
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



  return (
    <div>
      <div>
        <div className="w-full flex flex-col items-center justify-center pt-10 pb-10 gap-10  bg-white">
          <p className="text-center text-4xl lg:text-4xl xl:text-5xl pt-5 font-bold">
            Lernen Sie die Menschen hinter der Mission kennen
          </p>
          <p className=" text-center  1:w-70 text-lg sm:w-100 md:w-140 lg:text-2xl  xl:text-2xl lg:w-200 text-muted-foreground ">
            Unser Team ist eine engagierte Gruppe von Entwicklern und
            Freiwilligen, die sich leidenschaftlich dafür einsetzen, die nächste
            Generation von Entwickelern zu form
          </p>
          <section id="mentor">
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
            {filMentors.map((mentor, index) => (
              <MentorCard
              
                key={mentor.uid}
                name={mentor.name}
                description1={mentor.des1}
                description2={mentor.des2}
                picture={mentor.pic}
                isExpanded={mentor.uid === expandedMentorId}
                    isFirst={index === 0}
                onExpand={() =>
                  setExpandedMentorId((prev) =>
                    prev === mentor.uid ? null : mentor.uid
                  )
                }
              />
            ))}
          </div>
          </section>
          <div>
            <Button variant="outline" onClick={() => (setShowAll((prev) => !prev))}>
              {!showAll? <p>Alle Sehen</p> : <p>Nicht Alle sehen</p>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

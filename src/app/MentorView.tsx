"use client";

import {allMentores, Dummy } from "../../BackEnd/Mentoren";
import { MentorCard } from "./MentorCard";
import {useState, useEffect} from "react";

export default function MentorenView() {
  const orderedMentors = allMentores.sort((a, b) => a.getId() - b.getId());

  return (
    <div>
      
      <div>
        <p className="text-gray-700 text-3xl">Mentoren</p>
        {orderedMentors.map((mentor, index) => (
          <MentorCard
            key={index}
            name={mentor.getName()}
            description={mentor.getDescription()}
            picture={mentor.getPicture()}
          />
        ))}
      </div>
    </div>
  );
}

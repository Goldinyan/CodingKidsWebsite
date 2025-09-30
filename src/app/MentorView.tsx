"use client";

import allMentores from "../../BackEnd/Mentoren";

export default function MentorenView() {
  const orderedMentors = allMentores.sort((a, b) => a.getId() - b.getId());

  return (
    <div>
      <div>
        <p className="text-gray-700 text-3xl">Mentoren</p>
        {orderedMentors.map((mentor) => (
          <div key={mentor.getId()}>
            <p>{mentor.getName()}</p>
            <p>{mentor.getDescription()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

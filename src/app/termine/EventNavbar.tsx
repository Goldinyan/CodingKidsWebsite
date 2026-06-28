"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { CourseData } from "@/BackEnd/type";
import FilterPill from "./components/FilterPill";

interface EventNavbarProps {
  callback: (key: string, value: boolean | string) => void;
  filters: { [key: string]: boolean | string };
  courses: CourseData[];
}

export default function EventNavbar({
  callback,
  filters,
  courses,
}: EventNavbarProps) {
  const [filterJoinable, setFilterJoinable] = useState(false);

  const handleToggleJoinable = () => {
    const newValue = !filterJoinable;
    setFilterJoinable(newValue);
    callback("joinableOnly", newValue);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex flex-wrap gap-2 flex-1">
          <FilterPill
            active={!filters["course"]}
            onClick={() => callback("course", "")}
          >
            Alle Kurse
          </FilterPill>
          {courses.map((course) => (
            <FilterPill
              key={course.uid}
              active={filters["course"] === course.uid}
              onClick={() =>
                callback("course", filters["course"] === course.uid ? "" : course.uid)
              }
            >
              {course.name}
            </FilterPill>
          ))}
        </div>

        {/* Joinable only toggle */}
        <button
          onClick={handleToggleJoinable}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all shrink-0 font-medium ${
            filterJoinable
              ? "bg-green-500/10 border-green-500/35 text-green-500"
              : "bg-white/[0.03] border-white/[0.08] text-gray-500 hover:bg-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Nur freie Plätze
          {filterJoinable && (
            <X className="w-3.5 h-3.5 ml-1 text-green-500" />
          )}
        </button>
      </div>
    </div>
  );
}

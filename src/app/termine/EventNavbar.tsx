import { useState, useEffect } from "react";
import { addCourse, getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import { UserData, CourseData, EventData } from "@/BackEnd/type";

interface EventNavbarProps {
  callback: (key: string, value: boolean | string) => void;
  filters: { [key: string]: boolean | string };
  courses: CourseData[];
}

const baseTags: { name: string; value: string }[] = [
  { name: "Teilnahme möglich", value: "showOnlyAvailable" },
  { name: "Für dich offen", value: "showOnlyJoinable" },
];

const toggleFilters: { name: string; value: string; states: string[] }[] = [
  { name: "Name", value: "nameSort", states: ["A - Z", "Z - A"] },
  { name: "Datum", value: "dateSort", states: ["Datum ↑", "Datum ↓"] },
];

export default function EventNavbar({
  callback,
  filters,
  courses,
}: EventNavbarProps) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const data = await getUserData(user.uid);
      if (!data) return;
      setUserData(data);
    };
    fetchUserData();
  }, [user]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex md:flex-row flex-col">
        <div className="mb-6 pb-6 border-b md:border-r md:border-b-0 md:mr-10 border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter</h3>
          <div className="flex flex-row gap-2 md:mr-10 flex-wrap">
            {baseTags.map((tag) => (
              <button
                key={tag.value}
                onClick={() => {
                  callback(tag.value, !filters[tag.value]);
                }}
                className={`px-4 py-2 rounded-lg  font-medium transition-all duration-200 ${filters[tag.value]
                    ? "bg-black text-white border border-black "
                    : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                  }`}
              >
                {tag.name}
              </button>
            ))}

            {toggleFilters.map((filter) => {
              const currentState = (filters[filter.value] as string) || "";
              const stateIndex = currentState
                ? currentState === "asc"
                  ? 0
                  : 1
                : -1;
              const nextState =
                stateIndex === -1 ? "asc" : stateIndex === 0 ? "desc" : "";
              const displayText =
                stateIndex === -1 ? filter.name : filter.states[stateIndex];

              return (
                <button
                  key={filter.value}
                  onClick={() => {
                    callback(filter.value, nextState);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentState
                      ? "bg-black text-white border border-black"
                      : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  {displayText}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-10 md:mt-7">
          <div className="flex flex-wrap gap-2 min-w-max">
            {courses.map((course) => (
              <button
                key={`tab-${course.uid}`}
                onClick={() => {
                  if (filters["course"] === course.name) {
                    callback("course", "");
                  } else {
                    callback("course", course.name);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${filters["course"] === course.name
                    ? "bg-black text-white border border-black shadow-md"
                    : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                  }`}
              >
                {course.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <button
            key={course.uid}
            onClick={() => {
              if (filters["course"] === course.name) {
                callback("course", "");
              } else {
                callback("course", course.name);
              }
            }}
            className={`text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${filters["course"] === course.name
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white text-black hover:border-gray-400"
              }`}
          >
            <p className="font-bold text-lg mb-1">{course.name}</p>
            <p
              className={`text-sm mb-3 ${filters["course"] === course.name ? "opacity-90" : "text-gray-600"}`}
            >
              {course.des}
            </p>

            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 rounded font-medium ${filters["course"] === course.name
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {course.mentors && course.mentors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.mentors.map((mentor) => (
                  <span
                    key={mentor.uid}
                    className={`text-xs px-2 py-1 rounded font-medium ${filters["course"] === course.name
                        ? "bg-white/20 text-white"
                        : "bg-blue-50 text-blue-700"
                      }`}
                  >
                    👤 {mentor.name}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

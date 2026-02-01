import { useState, useEffect } from "react";
import { addCourse, getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import { UserData, CourseData } from "@/BackEnd/type";

interface EventNavbarProps {
  callback: (key: string, value: boolean | string) => void;
  filters: { [key: string]: boolean | string };
  courses: CourseData[];
}

const baseTags: { name: string; value: string }[] = [
  { name: "Teilnahme möglich", value: "showOnlyAvailable" },
  { name: "Für dich offen", value: "showOnlyJoinable" },
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
    <div className="w-full text-white items-center justify-center flex">
      <div className="flex flex-row justify-baseline gap-4 w-full flex-wrap">
        {baseTags.map((tag) => (
          <div key={tag.value}>
            <p
              className={`${filters[tag.value] ? " " : ""} text-black border-black border-1 rounded-lg p-2 font-normal cursor-pointer hover:bg-gray-100`}
              onClick={() => {
                callback(tag.value, !filters[tag.value]);
              }}
            >
              {tag.name}
            </p>
          </div>
        ))}
        {courses.map((course) => (
          <div key={`course-${course.uid}`}>
            <p
              className={`${filters.course && Array.isArray(filters.course)
                  ? filters.course.includes(course.uid)
                    ? "bg-primaryOwn text-white"
                    : ""
                  : ""
                } text-black border-black border-1 rounded-lg p-2 font-normal cursor-pointer hover:bg-gray-100`}
              onClick={() => {
                const currentCourses = Array.isArray(filters.course)
                  ? filters.course
                  : [];
                const newCourses = currentCourses.includes(course.uid)
                  ? currentCourses.filter((c) => c !== course.uid)
                  : [...currentCourses, course.uid];
                callback("course", newCourses.length > 0 ? newCourses : null);
              }}
            >
              {course.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

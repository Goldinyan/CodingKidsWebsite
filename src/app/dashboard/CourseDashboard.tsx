"use client";

import { useState } from "react";
import { Plus, Search, FolderX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/DataContext"; // ⚡ AppDataContext importiert
import { addCourse, deleteCourse, updateCourse } from "@/lib/db/courses";
import type { CourseData } from "@/BackEnd/type";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import {
  useCoursesData,
  useFilteredCourses,
  useMentorsData,
} from "./courses/hooks";
import {
  CourseCard,
  DeleteCourseDialog,
  NewCourseDialog,
  AssignMentorsDialog,
} from "./courses/components";

export default function CourseDashboard() {
  const { user, userRole } = useAuth();
  const {
    showUpdateSuccess,
    showCreateSuccess,
    showErrorToast,
    showUpdateError,
    showDeleteSuccess,
  } = useNotificationToast();
  const { theme, isRounded } = useTheme();

  const [searchBar, setSearchBar] = useState<string>("");
  const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>("");

  const [assigningMentorsId, setAssigningMentorsId] = useState<string | null>(
    null,
  );
  const [selectedMentorIds, setSelectedMentorIds] = useState<string[]>([]);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    courseId: string | null;
    courseName: string | null;
  }>({
    isOpen: false,
    courseId: null,
    courseName: null,
  });

  const [newCourse, setNewCourse] = useState<Partial<CourseData>>({
    name: "",
    des: "",
    tags: [],
    dates: [],
  });

  const [editValues, setEditValues] = useState<Partial<CourseData>>({});

  const { refreshData } = useAppData();

  const { courses: coursesData, isLoading } = useCoursesData();
  const { mentors, isLoading: mentorsLoading } = useMentorsData();
  const filteredCourses = useFilteredCourses(coursesData, searchBar);

  const isDark = theme === "dark";
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

  const handleTagChange = (val: string) => {
    setTagInput(val);
    setNewCourse({
      ...newCourse,
      tags: val
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    });
  };

  const handleAddCourse = async () => {
    if (!user || !newCourse.name?.trim()) {
      showUpdateError({
        title: "Fehler beim Erstellen des Kurses",
        description: "Bitte füllen Sie alle erforderlichen Felder aus",
      });
      return;
    }

    try {
      const courseToAdd: CourseData = {
        uid: "", 
        name: newCourse.name,
        des: newCourse.des || "",
        tags: newCourse.tags || [],
        dates: newCourse.dates || [],
        mentors: [],
      };

      await addCourse(courseToAdd, user.uid, userRole || "user");

      await refreshData("courses");

      setNewCourse({ name: "", des: "", tags: [], dates: [] });
      setTagInput("");
      setIsAddingCourse(false);

      showCreateSuccess({
        title: "Kurs erfolgreich erstellt",
        description: `Der Kurs "${courseToAdd.name}" wurde erfolgreich erstellt.`,
      });
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleSaveEdit = async (courseId: string) => {
    if (!user) return;

    try {
      await updateCourse(courseId, editValues, user.uid, userRole || "user");

      await refreshData("courses");

      setEditingId(null);
      setEditValues({});

      showUpdateSuccess({
        title: "Kurs erfolgreich aktualisiert",
        description: `Die Änderungen am Kurs "${editValues.name || courseId}" wurden erfolgreich übernommen.`,
      });
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!user || !deleteConfirm.courseId) return;

    try {
      await deleteCourse(deleteConfirm.courseId, user.uid, userRole || "user");

      await refreshData("courses");

      setDeleteConfirm({ isOpen: false, courseId: null, courseName: null });

      showDeleteSuccess({
        title: "Kurs erfolgreich gelöscht",
        description: `Der Kurs "${deleteConfirm.courseName}" wurde erfolgreich gelöscht.`,
      });
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleEditStart = (course: CourseData) => {
    setEditingId(course.uid);
    setEditValues({
      name: course.name,
      des: course.des,
      tags: course.tags,
    });
  };

  const handleAssignMentorsStart = (course: CourseData) => {
    setAssigningMentorsId(course.uid);
    setSelectedMentorIds(course?.mentors.map((m) => m.uid) || []);
  };

  const handleSaveMentors = async () => {
    if (!user || !assigningMentorsId) return;

    try {
      const selectedMentors = mentors.filter((m) =>
        selectedMentorIds.includes(m.uid),
      );

      await updateCourse(
        assigningMentorsId,
        { mentors: selectedMentors },
        user.uid,
        userRole || "user",
      );

      await refreshData("courses");

      const courseName =
        coursesData.find((c) => c.uid === assigningMentorsId)?.name || "";
      setAssigningMentorsId(null);
      setSelectedMentorIds([]);

      showUpdateSuccess({
        title: "Mentoren erfolgreich zugewiesen",
        description: `Die Mentoren für den Kurs "${courseName}" wurden erfolgreich aktualisiert.`,
      });
    } catch (error) {
      showErrorToast(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8 transition-colors duration-200">
        <div
          className={`font-['JetBrains_Mono'] text-xs tracking-widest uppercase animate-pulse ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
        >
          KURSE_WERDEN_GELADEN...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1
              className={`md:text-4xl text-3xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase mb-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              KursVerwaltung
            </h1>
            <p
              className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Administration der Lehr-Module, Fach-Tags und System-Strukturen
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 relative">
              <Search
                className={`absolute left-4 top-3.5 w-4 h-4 ${theme === "dark" ? "text-zinc-600" : "text-slate-400"
                  }`}
              />
              <input
                type="text"
                placeholder="KURSE DURCHSUCHEN..."
                value={searchBar}
                onChange={(e) => setSearchBar(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-all duration-200 focus:outline-none ${radiusClass} ${theme === "dark"
                    ? "bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 focus:border-green-600"
                    : "bg-white border border-slate-200 text-slate-900 placeholder-slate-300 focus:border-green-600 shadow-sm"
                  }`}
              />
            </div>

            <button
              onClick={() => setIsAddingCourse(true)}
              className={`px-6 py-3 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} ${theme === "dark"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-600 hover:bg-green-700 shadow-sm"
                }`}
            >
              <Plus className="w-4 h-4" />
              ADD_COURSE
            </button>
          </div>

          <AnimatePresence mode="wait">
            {filteredCourses.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`w-full min-h-[400px] flex flex-col items-center justify-center border p-8 text-center transition-all duration-200 ${radiusClass} ${theme === "dark"
                    ? "bg-zinc-950/40 border-zinc-900"
                    : "bg-white border-slate-100 shadow-sm"
                  }`}
              >
                <div
                  className={`p-4 mb-4 border ${radiusClass} ${theme === "dark"
                      ? "bg-zinc-900/50 border-zinc-800 text-zinc-500"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                >
                  <FolderX className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3
                  className={`font-['Familjen_Grotesk'] text-lg font-bold uppercase tracking-tight mb-1 ${theme === "dark" ? "text-zinc-200" : "text-slate-800"
                    }`}
                >
                  Keine Kurse gefunden
                </h3>
                <p
                  className={`font-['JetBrains_Mono'] text-[11px] uppercase tracking-wide max-w-sm ${theme === "dark" ? "text-zinc-600" : "text-slate-400"
                    }`}
                >
                  {searchBar
                    ? `Der Filter lieferte keine Matrix-Einträge für "${searchBar}"`
                    : "Es sind aktuell keine Lehr-Module im System hinterlegt."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="courses-grid"
                layout="position"
                className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-2"
              >
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.uid}
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CourseCard
                      course={course}
                      isEditing={editingId === course.uid}
                      editValues={editValues}
                      onEditValuesChange={setEditValues}
                      onStartEdit={() => handleEditStart(course)}
                      onCancelEdit={() => {
                        setEditingId(null);
                        setEditValues({});
                      }}
                      onSaveEdit={() => handleSaveEdit(course.uid)}
                      onRequestDelete={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          courseId: course.uid,
                          courseName: course.name,
                        })
                      }
                      onRequestAssignMentors={() =>
                        handleAssignMentorsStart(course)
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <NewCourseDialog
        open={isAddingCourse}
        onOpenChange={setIsAddingCourse}
        newCourse={newCourse}
        tagInput={tagInput}
        onNewCourseChange={setNewCourse}
        onTagInputChange={handleTagChange}
        onCreate={handleAddCourse}
      />

      <DeleteCourseDialog
        open={deleteConfirm.isOpen}
        courseName={deleteConfirm.courseName}
        onOpenChange={(open) =>
          setDeleteConfirm({
            isOpen: open,
            courseId: open ? deleteConfirm.courseId : null,
            courseName: open ? deleteConfirm.courseName : null,
          })
        }
        onConfirm={handleDeleteCourse}
      />

      <AssignMentorsDialog
        open={assigningMentorsId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAssigningMentorsId(null);
            setSelectedMentorIds([]);
          }
        }}
        courseName={
          filteredCourses.find((c) => c.uid === assigningMentorsId)?.name ||
          null
        }
        availableMentors={mentors}
        selectedMentorIds={selectedMentorIds}
        onSelectedMentorsChange={setSelectedMentorIds}
        onSave={handleSaveMentors}
        isLoading={mentorsLoading}
      />
    </>
  );
}

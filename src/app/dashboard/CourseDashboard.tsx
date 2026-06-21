"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/BackEnd/AuthContext";
import { addCourse, deleteCourse, updateCourse } from "@/lib/db/courses";
import type { CourseData } from "@/BackEnd/type";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useCoursesData, useFilteredCourses } from "./courses/hooks";
import {
  CourseCard,
  DeleteCourseDialog,
  NewCourseDialog,
} from "./courses/components";

export default function CourseDashboard() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const [searchBar, setSearchBar] = useState<string>("");
  const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>("");

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

  const {
    courses: coursesData,
    setCourses,
    refresh,
    isLoading,
  } = useCoursesData(user?.uid, userRole);
  const filteredCourses = useFilteredCourses(coursesData, searchBar);

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

  // Neuen Kurs erstellen
  const handleAddCourse = async () => {
    if (!user || !newCourse.name?.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle erforderlichen Felder aus",
        variant: "destructive",
      });
      return;
    }

    try {
      const courseToAdd: CourseData = {
        uid: newCourse.name,
        name: newCourse.name,
        des: newCourse.des || "",
        tags: newCourse.tags || [],
        dates: newCourse.dates || [],
        mentors: [],
      };

      await addCourse(courseToAdd, user.uid, userRole || "user");

      setCourses([...coursesData, courseToAdd]);
      setNewCourse({
        name: "",
        des: "",
        tags: [],
        dates: [],
      });
      setTagInput("");
      setIsAddingCourse(false);

      toast({
        title: "Erfolg",
        description: "Kurs erfolgreich erstellt",
      });
    } catch (error) {
      console.error("Error adding course:", error);
      toast({
        title: "Fehler",
        description: "Kurs konnte nicht erstellt werden",
        variant: "destructive",
      });
    }
  };

  // Kurs aktualisieren
  const handleSaveEdit = async (courseId: string) => {
    if (!user) return;

    try {
      await updateCourse(courseId, editValues, user.uid, userRole || "user");

      setCourses(
        coursesData.map((course) =>
          course.uid === courseId ? { ...course, ...editValues } : course,
        ),
      );

      setEditingId(null);
      setEditValues({});

      toast({
        title: "Erfolg",
        description: "Kurs erfolgreich aktualisiert",
      });
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Fehler",
        description: "Kurs konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    }
  };

  // Kurs löschen
  const handleDeleteCourse = async () => {
    if (!user || !deleteConfirm.courseId) return;

    try {
      await deleteCourse(deleteConfirm.courseId, user.uid, userRole || "user");

      setCourses(
        coursesData.filter((course) => course.uid !== deleteConfirm.courseId),
      );

      setDeleteConfirm({ isOpen: false, courseId: null, courseName: null });

      toast({
        title: "Erfolg",
        description: "Kurs erfolgreich gelöscht",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Fehler",
        description: "Kurs konnte nicht gelöscht werden",
        variant: "destructive",
      });
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

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center p-8 transition-colors duration-300 `}
      >
        <div className={theme === "dark" ? "text-gray-500" : "text-slate-500"}>
          Kurse werden geladen...
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full px-6 py-8 transition-colors duration-300 `}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1
            className={`text-5xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Kurs-Verwaltung
          </h1>
          <p
            className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-slate-600"
              }`}
          >
            Verwalten Sie Ihre Kurse: Erstellen, Bearbeiten und Löschen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex-1 relative">
            <Search
              className={`absolute z-10 left-3 top-3 w-5 h-5 transition-colors ${theme === "dark" ? "text-gray-600" : "text-slate-400"
                }`}
            />
            <input
              type="text"
              placeholder="Kurse durchsuchen..."
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
              className={`backdrop-blur-2xl w-full pl-10 pr-4 py-2 border transition-all duration-300 focus:outline-none ${theme === "dark"
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/20 focus:bg-white/10"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:bg-white"
                }`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingCourse(true)}
            className={`flex items-center gap-2 px-8 py-3 font-medium border transition-colors duration-300 ${theme === "dark"
                ? "bg-white text-black border-white hover:bg-gray-100"
                : "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
              }`}
          >
            <Plus className="w-5 h-5" />
            Neuer Kurs
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        >
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p
                className={`text-lg ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}
              >
                {searchBar
                  ? "Keine Kurse gefunden, die Ihrer Suche entsprechen"
                  : "Keine Kurse vorhanden. Erstellen Sie einen neuen Kurs!"}
              </p>
            </div>
          ) : (
            filteredCourses.map((course, idx) => (
              <motion.div
                key={course.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
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
                />
              </motion.div>
            ))
          )}
        </motion.div>
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
    </div>
  );
}

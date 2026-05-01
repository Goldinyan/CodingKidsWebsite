"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, X, Save } from "lucide-react";
import { useAuth } from "@/BackEnd/AuthContext";
import {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "@/lib/db/courses";
import type { CourseData } from "@/BackEnd/type";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CourseDashboard() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const [coursesData, setCourses] = useState<CourseData[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
  const [searchBar, setSearchBar] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  // Lade Kurse
  useEffect(() => {
    const loadCourses = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const courses = await getAllCourses(user.uid, userRole || "user");
        setCourses(courses);
        setFilteredCourses(courses);
      } catch (error) {
        console.error("Error loading courses:", error);
        toast({
          title: "Fehler",
          description: "Kurse konnten nicht geladen werden",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user, userRole, toast]);

  // Filter Kurse basierend auf Suchtext
  useEffect(() => {
    const filtered = coursesData.filter(
      (course) =>
        course.name.toLowerCase().includes(searchBar.toLowerCase()) ||
        course.des.toLowerCase().includes(searchBar.toLowerCase()) ||
        course.tags?.some((tag) =>
          tag.toLowerCase().includes(searchBar.toLowerCase()),
        ),
    );
    setFilteredCourses(filtered);
  }, [searchBar, coursesData]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Kurse werden geladen...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kursverwaltung
          </h1>
          <p className="text-gray-600">
            Verwalten Sie Ihre Kurse: Erstellen, Bearbeiten und Löschen
          </p>
        </div>

        {/* Aktions-Bereich */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Kurse durchsuchen..."
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            onClick={() => setIsAddingCourse(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Neuer Kurs
          </Button>
        </div>

        {/* Kurse Liste */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchBar
                  ? "Keine Kurse gefunden, die Ihrer Suche entsprechen"
                  : "Keine Kurse vorhanden. Erstellen Sie einen neuen Kurs!"}
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.uid}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                {editingId === course.uid ? (
                  // Edit Modus
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kursname
                      </label>
                      <input
                        type="text"
                        value={editValues.name || ""}
                        onChange={(e) =>
                          setEditValues({ ...editValues, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Beschreibung
                      </label>
                      <textarea
                        value={editValues.des || ""}
                        onChange={(e) =>
                          setEditValues({ ...editValues, des: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (komma-getrennt)
                      </label>
                      <input
                        type="text"
                        value={editValues.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveEdit(course.uid)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Speichern
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setEditValues({});
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4" />
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Ansicht Modus
                  <>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{course.des}</p>

                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {course.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mb-2">
                        <strong>ID:</strong> {course.uid}
                      </div>

                      {course.dates && course.dates.length > 0 && (
                        <div className="text-xs text-gray-500">
                          <strong>Veranstaltungen:</strong>{" "}
                          {course.dates.length}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditStart(course)}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Bearbeiten
                      </Button>
                      <Button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            courseId: course.uid,
                            courseName: course.name,
                          })
                        }
                        variant="destructive"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Löschen
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Neuer Kurs Dialog */}
      <Dialog open={isAddingCourse} onOpenChange={setIsAddingCourse}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Neuer Kurs</DialogTitle>
            <DialogDescription>
              Erstellen Sie einen neuen Kurs für Ihre Veranstaltungen
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kursname *
              </label>
              <input
                type="text"
                placeholder="z.B. Python Grundlagen"
                value={newCourse.name || ""}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung
              </label>
              <textarea
                placeholder="Kursbeschreibung eingeben..."
                value={newCourse.des || ""}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, des: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (komma-getrennt)
              </label>
              <input
                type="text"
                placeholder="z.B. Python, Anfänger, Programmierung"
                value={newCourse.tags?.join(", ") || ""}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsAddingCourse(false)} variant="outline">
              Abbrechen
            </Button>
            <Button
              onClick={handleAddCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lösch-Bestätigungs Dialog */}
      <Dialog
        open={deleteConfirm.isOpen}
        onOpenChange={(open) =>
          setDeleteConfirm({
            isOpen: open,
            courseId: null,
            courseName: null,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kurs löschen?</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie den Kurs "{deleteConfirm.courseName}"
              löschen möchten? Diese Aktion kann nicht rückgängig gemacht
              werden.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={() =>
                setDeleteConfirm({
                  isOpen: false,
                  courseId: null,
                  courseName: null,
                })
              }
              variant="outline"
            >
              Abbrechen
            </Button>
            <Button onClick={handleDeleteCourse} variant="destructive">
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

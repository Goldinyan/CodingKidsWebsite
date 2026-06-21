"use client";

import { Edit2, Save, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import type { CourseData } from "@/BackEnd/type";

export function CourseCard(props: {
  course: CourseData;
  isEditing: boolean;
  editValues: Partial<CourseData>;
  onEditValuesChange: (next: Partial<CourseData>) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onRequestDelete: () => void;
}) {
  const {
    course,
    isEditing,
    editValues,
    onEditValuesChange,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onRequestDelete,
  } = props;

  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-6 backdrop-blur-2xl border transition-colors duration-300 ${theme === "dark"
          ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
          : "bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100"
        }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}
            >
              Kursname
            </label>
            <input
              type="text"
              value={editValues.name || ""}
              onChange={(e) =>
                onEditValuesChange({ ...editValues, name: e.target.value })
              }
              className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${theme === "dark"
                  ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}
            >
              Beschreibung
            </label>
            <textarea
              value={editValues.des || ""}
              onChange={(e) =>
                onEditValuesChange({ ...editValues, des: e.target.value })
              }
              className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-colors ${theme === "dark"
                  ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              rows={3}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}
            >
              Tags (komma-getrennt)
            </label>
            <input
              type="text"
              value={editValues.tags?.join(", ") || ""}
              onChange={(e) =>
                onEditValuesChange({
                  ...editValues,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t),
                })
              }
              className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${theme === "dark"
                  ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
            />
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSaveEdit}
              className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${theme === "dark"
                  ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                  : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                }`}
            >
              <Save className="w-4 h-4" />
              Speichern
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancelEdit}
              className={`flex-1 px-4 py-2 flex gap-5 font-medium items-center border transition-all duration-300 ${theme === "dark"
                  ? "border-white/20 text-white hover:bg-white/5 hover:border-white/30"
                  : "border-slate-300 text-slate-900 hover:bg-slate-100 hover:border-slate-400"
                }`}
            >
              <X className="w-4 h-4 " />
              <p>Abbrechen</p>
            </motion.button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3
              className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              {course.name}
            </h3>
            <p
              className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}
            >
              {course.des}
            </p>

            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-block text-xs px-3 py-1 ${theme === "dark"
                        ? "bg-green-600/20 text-green-300 border border-green-600/30"
                        : "bg-green-100 text-green-700 border border-green-300"
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              className={`text-xs mb-2 ${theme === "dark" ? "text-gray-500" : "text-slate-500"}`}
            >
              <strong>ID:</strong> {course.uid}
            </div>

            {course.dates && course.dates.length > 0 && (
              <div
                className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-slate-500"}`}
              >
                <strong>Veranstaltungen:</strong> {course.dates.length}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartEdit}
              className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${theme === "dark"
                  ? "bg-amber-600/20 text-amber-300 border-amber-600/30 hover:bg-amber-600/30 hover:border-amber-600/50"
                  : "bg-amber-600 text-white border-amber-600 hover:bg-amber-700"
                }`}
            >
              <Edit2 className="w-4 h-4" />
              Bearbeiten
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRequestDelete}
              className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${theme === "dark"
                  ? "bg-red-600/20 text-red-300 border-red-600/30 hover:bg-red-600/30 hover:border-red-600/50"
                  : "bg-red-600 text-white border-red-600 hover:bg-red-700"
                }`}
            >
              <Trash2 className="w-4 h-4" />
              Löschen
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
}

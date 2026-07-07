"use client";

import { Edit2, Save, Trash2, X, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
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
  onRequestAssignMentors: () => void;
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
    onRequestAssignMentors,
  } = props;

  const { userRole } = useAuth();
  const { theme, isRounded } = useTheme();
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";
  const isDark = theme === "dark";

  const canManageMentors = ["admin", "mentor"].includes(userRole || "");

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-6 border transition-all duration-200 ${radiusClass} ${
        isDark
          ? "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
      }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label
              className={`block font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase mb-1.5 ${
                isDark ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              KURS_NAME
            </label>
            <input
              type="text"
              value={editValues.name || ""}
              onChange={(e) =>
                onEditValuesChange({ ...editValues, name: e.target.value })
              }
              className={`w-full px-3 py-2.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
              }`}
            />
          </div>

          <div>
            <label
              className={`block font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase mb-1.5 ${
                isDark ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              BESCHREIBUNG
            </label>
            <textarea
              value={editValues.des || ""}
              onChange={(e) =>
                onEditValuesChange({ ...editValues, des: e.target.value })
              }
              className={`w-full px-3 py-2.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 resize-none transition-colors ${radiusClass} ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
              }`}
              rows={3}
            />
          </div>

          <div>
            <label
              className={`block font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase mb-1.5 ${
                isDark ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              TAGS (KOMMA_GETRENNT)
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
              className={`w-full px-3 py-2.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
              }`}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onSaveEdit}
              className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} ${
                isDark ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700 shadow-sm"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              SPEICHERN
            </button>
            <button
              onClick={onCancelEdit}
              className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${
                isDark
                  ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
              }`}
            >
              <X className="w-3.5 h-3.5" />
              ABBRECHEN
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <div className="mb-6">
            <h3
              className={`text-2xl font-black font-['Familjen_Grotesk'] uppercase tracking-tight mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {course.name}
            </h3>
            <p
              className={`text-xs mb-4 leading-relaxed font-medium ${
                isDark ? "text-zinc-400" : "text-slate-600"
              }`}
            >
              {course.des || "Keine Beschreibung hinterlegt."}
            </p>

            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-block font-['JetBrains_Mono'] text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 border ${radiusClass} ${
                      isDark
                        ? "bg-green-600/10 text-green-400 border-green-600/20"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-1 border-t border-dashed border-zinc-200 dark:border-zinc-800/80 pt-3">
              <div
                className={`font-['JetBrains_Mono'] text-[10px] tracking-wide ${
                  isDark ? "text-zinc-600" : "text-slate-400"
                }`}
              >
                <span className="font-bold uppercase opacity-70">MATRIX_ID:</span> {course.uid}
              </div>

              {course.dates && course.dates.length > 0 && (
                <div
                  className={`font-['JetBrains_Mono'] text-[10px] tracking-wide ${
                    isDark ? "text-zinc-600" : "text-slate-400"
                  }`}
                >
                  <span className="font-bold uppercase opacity-70">VERANSTALTUNGEN:</span> {course.dates.length}
                </div>
              )}

              {course.mentors && course.mentors.length > 0 && (
                <div
                  className={`font-['JetBrains_Mono'] text-[10px] tracking-wide ${
                    isDark ? "text-zinc-600" : "text-slate-400"
                  }`}
                >
                  <span className="font-bold uppercase opacity-70">MENTOREN:</span> {course.mentors.length}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 border-t border-zinc-100 dark:border-zinc-900/60 pt-4">
            {canManageMentors && (
              <button
                onClick={onRequestAssignMentors}
                className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${
                  isDark
                    ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-blue-400 hover:border-blue-500/30"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 shadow-sm"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                MENTOR
              </button>
            )}
            <button
              onClick={onStartEdit}
              className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${
                isDark
                  ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-amber-400 hover:border-amber-500/30"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-amber-600 hover:border-amber-200 shadow-sm"
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              EDIT
            </button>
            <button
              onClick={onRequestDelete}
              className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${
                isDark
                  ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-red-400 hover:border-red-500/30"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 shadow-sm"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              DELETE
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}


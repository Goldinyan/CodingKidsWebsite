"use client";

import { Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { toJsDate } from "@/BackEnd/utils";
import type { AnnouncementData } from "@/BackEnd/type";

export function AnnouncementCard(props: {
  announcement: AnnouncementData;
  authorName: string;
  userIsAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { announcement, authorName, userIsAdmin, onEdit, onDelete } = props;
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-6 border transition-all duration-300 ${theme === "dark"
        ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
        : "bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100"
      }`}
    >
      <div className="mb-4">
        <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          {announcement.title}
        </h3>
        <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
          {authorName} •{" "}
          {toJsDate(announcement.date).toLocaleDateString("de-DE", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p className={`text-sm mb-3 whitespace-pre-wrap ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
          {announcement.content}
        </p>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={`inline-block text-xs px-3 py-1 border transition-all duration-300 ${theme === "dark"
            ? "bg-blue-600/20 text-blue-300 border-blue-600/30"
            : "bg-blue-100 text-blue-700 border-blue-300"
          }`}
        >
          {announcement.tag}
        </motion.span>
      </div>

      {userIsAdmin && (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
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
            onClick={onDelete}
            className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${theme === "dark"
              ? "bg-red-600/20 text-red-300 border-red-600/30 hover:bg-red-600/30 hover:border-red-600/50"
              : "bg-red-600 text-white border-red-600 hover:bg-red-700"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Löschen
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}


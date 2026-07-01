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
  const { theme, isRounded } = useTheme();

  const isDark = theme === "dark";
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

  // Strikte Farbtrennung basierend auf der Zielgruppe (Tag)
  const isUserTag = announcement.tag === "User";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`p-6 border flex flex-col justify-between h-full transition-colors duration-200 ${radiusClass} ${isDark
          ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80"
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm"
        }`}
    >
      <div className="mb-5">
        {/* METADATEN-ZEILE */}
        <div
          className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase mb-2 flex items-center justify-between ${isDark ? "text-zinc-500" : "text-slate-400"
            }`}
        >
          <span>BY: {authorName || "UNKNOWN_AUTH"}</span>
          <span>
            {toJsDate(announcement.date).toLocaleDateString("de-DE", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* TITEL */}
        <h3
          className={`text-xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase mb-3 ${isDark ? "text-white" : "text-slate-900"
            }`}
        >
          {announcement.title}
        </h3>

        {/* INHALT */}
        <p
          className={`text-xs font-['JetBrains_Mono'] leading-relaxed mb-4 whitespace-pre-wrap ${isDark ? "text-zinc-300" : "text-slate-600"
            }`}
        >
          {announcement.content}
        </p>

        <span
          className={`inline-block font-['JetBrains_Mono'] text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 border ${radiusClass} ${isUserTag
              ? isDark
                ? "bg-blue-950/40 text-blue-400 border-blue-900/50"
                : "bg-blue-50 text-blue-700 border-blue-200"
              : isDark
                ? "bg-purple-950/40 text-purple-400 border-purple-900/50"
                : "bg-purple-50 text-purple-700 border-purple-200"
            }`}
        >
          SCOPE::{announcement.tag}
        </span>
      </div>

      {userIsAdmin && (
        <div className="flex gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900/40 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase">
          <button
            onClick={onEdit}
            className={`flex-1 px-3 py-2 border font-bold flex items-center justify-center gap-1.5 transition-colors ${radiusClass} ${isDark
                ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-amber-950/30 hover:border-amber-900/50"
                : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/70"
              }`}
          >
            <Edit2 className="w-3 h-3 stroke-[2.5]" />
            BEARBEITEN
          </button>
          <button
            onClick={onDelete}
            className={`flex-1 px-3 py-2 border font-bold flex items-center justify-center gap-1.5 transition-colors ${radiusClass} ${isDark
                ? "bg-zinc-900 border-zinc-800 text-red-400 hover:bg-red-950/30 hover:border-red-900/50"
                : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100/70"
              }`}
          >
            <Trash2 className="w-3 h-3 stroke-[2.5]" />
            LÖSCHEN
          </button>
        </div>
      )}
    </motion.div>
  );
}

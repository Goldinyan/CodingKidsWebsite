"use client";

import { Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import type { UserData, UserRole } from "@/BackEnd/type";
import { toJsDate } from "@/BackEnd/utils";

export function UserCard(props: {
  user: UserData;
  roleLabel: UserRole;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  const { user, roleLabel, onEdit, onDelete } = props;
  const { theme, isRounded } = useTheme();

  const radiusClass = isRounded ? "rounded-[16px]" : "rounded-none";

  const getRoleConfig = (role: string) => {
    const r = role.toLowerCase();
    if (r === "admin") {
      return {
        label: "ADMIN",
        classes:
          theme === "dark"
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            : "bg-amber-50 text-amber-700 border border-amber-200",
      };
    }
    if (r === "mentor") {
      return {
        label: "MENTOR",
        classes:
          theme === "dark"
            ? "bg-green-500/10 text-[#4ADE80] border border-green-500/20"
            : "bg-green-50 text-green-700 border border-green-200",
      };
    }
    if (r === "member") {
      return {
        label: "MITGLIED",
        classes:
          theme === "dark"
            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
            : "bg-purple-50 text-purple-700 border border-purple-200",
      };
    }
    return {
      label: "NUTZER",
      classes:
        theme === "dark"
          ? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
          : "bg-slate-100 text-slate-600 border border-slate-200",
    };
  };

  const roleConfig = getRoleConfig(roleLabel);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 w-full bg-transparent"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span
            className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full ${roleConfig.classes}`}
          >
            {roleConfig.label}
          </span>
          <h3
            className={`text-xl font-black font-['Familjen_Grotesk'] tracking-tight leading-none uppercase pt-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            {user.name}
          </h3>
        </div>
      </div>

      <div
        className={`space-y-2 font-['JetBrains_Mono'] text-[11px] tracking-wider uppercase mb-6 ${theme === "dark" ? "text-zinc-400" : "text-slate-500"
          }`}
      >
        <p className="flex items-center gap-2">
          <span
            className={theme === "dark" ? "text-zinc-600" : "text-slate-400"}
          >
            NUTZER_EMAIL:
          </span>
          <span
            className={`normal-case tracking-normal font-['DM_Sans'] text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-slate-700"}`}
          >
            {user.email}
          </span>
        </p>

        {user.birthdate && (
          <p className="flex items-center gap-2">
            <span
              className={theme === "dark" ? "text-zinc-600" : "text-slate-400"}
            >
              GEB_DATUM:
            </span>
            <span
              className={`font-['JetBrains_Mono'] ${theme === "dark" ? "text-zinc-300" : "text-slate-700"}`}
            >
              {new Date(toJsDate(user.birthdate)).toLocaleDateString("de-DE")}
            </span>
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${radiusClass} ${theme === "dark"
              ? "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-zinc-300 hover:text-[#4ADE80] hover:border-[#4ADE80]"
              : "bg-white border border-slate-200 text-slate-600 hover:text-green-600 hover:border-green-600 shadow-sm"
            }`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          BEARBEITEN
        </button>

        {onDelete && (
          <button
            onClick={onDelete}
            className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${radiusClass} ${theme === "dark"
                ? "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-zinc-400 hover:text-red-400 hover:border-red-500/40"
                : "bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-600 shadow-sm"
              }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            LOESCHEN
          </button>
        )}
      </div>
    </motion.div>
  );
}

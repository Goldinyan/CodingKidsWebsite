"use client";

import { Theme, useTheme } from "@/context/ThemeContext";
import { UserData } from "@/BackEnd/type";
import { Mail, Calendar, Code2, Layers } from "lucide-react";
import { toJsDate } from "@/BackEnd/utils";
import { Timestamp } from "firebase/firestore";

function getMemberDays(t: Timestamp | null): number {
  return t ? Math.floor((Date.now() - toJsDate(t).getTime()) / 86400000) : -1;
}

export default function AccountDetails({ userData }: { userData: UserData }) {
  const { theme, isRounded } = useTheme();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  return (
    <div
      className={`w-full p-6 border transition-all duration-150 flex flex-col gap-5 ${roundedClass} ${theme === "dark"
          ? "bg-[rgba(255,255,255,0.02)] border-zinc-800"
          : "bg-slate-50 border-slate-300"
        }`}
    >
      <span
        className={`block font-mono text-[10px] font-bold tracking-widest uppercase ${theme === "dark" ? "text-green-500" : "text-green-400"
          }`}
      >
        Account Details
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          className={`p-4 border transition-colors duration-150 flex flex-col gap-2 ${innerRoundedClass} ${theme === "dark"
              ? "bg-zinc-950/40 border-zinc-900"
              : "bg-white border-slate-200"
            }`}
        >
          <div className="flex items-center gap-2">
            <Mail
              className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
            />
            <span
              className={`text-[10px] font-monmonoo uppercase font-bold tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              E-Mail Adresse
            </span>
          </div>
          <p
            className={`text-xs font-sans ${theme === "dark" ? "text-zinc-200" : "text-slate-800"
              }`}
          >
            {userData.email}
          </p>
        </div>

        <div
          className={`p-4 border transition-colors duration-150 flex flex-col gap-2 ${innerRoundedClass} ${theme === "dark"
              ? "bg-zinc-950/40 border-zinc-900"
              : "bg-white border-slate-200"
            }`}
        >
          <div className="flex items-center gap-2">
            <Calendar
              className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
            />
            <span
              className={`text-[10px] font-mono uppercase font-bold tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Mitglied seit
            </span>
          </div>
          <p
            className={`text-xs font-sans ${theme === "dark" ? "text-zinc-200" : "text-slate-800"
              }`}
          >
            {getMemberDays(userData.createdAt) >= 0
              ? `${getMemberDays(userData.createdAt)} Tagen`
              : "Unbekannt"}
          </p>
        </div>

        <div
          className={`p-4 border transition-colors duration-150 flex flex-col gap-2 ${innerRoundedClass} ${theme === "dark"
              ? "bg-zinc-950/40 border-zinc-900"
              : "bg-white border-slate-200"
            }`}
        >
          <div className="flex items-center gap-2">
            <Code2
              className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
            />
            <span
              className={`text-[10px] font-mono uppercase font-bold tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Aktive Kurse
            </span>
          </div>
          <p
            className={`text-xs font-sans ${theme === "dark" ? "text-zinc-200" : "text-slate-800"
              }`}
          >
            {userData.courses?.length || 0} Kurse belegt
          </p>
        </div>

        <div
          className={`p-4 border transition-colors duration-150 flex flex-col gap-2 ${innerRoundedClass} ${theme === "dark"
              ? "bg-zinc-950/40 border-zinc-900"
              : "bg-white border-slate-200"
            }`}
        >
          <div className="flex items-center gap-2">
            <Layers
              className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
            />
            <span
              className={`text-[10px] font-mono uppercase font-bold tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Eigene Projekte
            </span>
          </div>
          <p
            className={`text-xs font-sans ${theme === "dark" ? "text-zinc-200" : "text-slate-800"
              }`}
          >
            {userData.projects?.length || 0} Projekte gestartet
          </p>
        </div>
      </div>
    </div>
  );
}

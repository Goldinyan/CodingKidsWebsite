"use client";

import type { UserData } from "@/BackEnd/type";
import { Cake, BookOpen, Shield, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { getRoleBadgeColor, calculateAge } from "../utils";

export default function ProfileHeader({ userData }: { userData: UserData }) {
  const { theme, isRounded } = useTheme();
  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  return (
    <div
      className={`w-full p-6 border transition-all duration-150 flex flex-col sm:flex-row items-center justify-between gap-6 ${roundedClass} ${theme === "dark"
          ? "bg-[rgba(255,255,255,0.02)] border-zinc-800"
          : "bg-slate-50 border-slate-300"
        }`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        <div className="text-center sm:text-left flex-grow">
          <span
            className={`block font-['JetBrains_Mono'] text-[11px] font-bold tracking-widest uppercase mb-1 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
              }`}
          >
            CodingKids // User
          </span>

          <h2
            className={`text-2xl font-black font-['Familjen_Grotesk'] tracking-wide uppercase mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            {userData.name}
          </h2>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 font-['JetBrains_Mono'] text-[11px] font-bold uppercase border ${innerRoundedClass} ${getRoleBadgeColor(
                userData.role,
                theme,
              )}`}
            >
              {userData.role.toLowerCase() === "admin" && (
                <Shield className="w-3.5 h-3.5" />
              )}
              {userData.role.toLowerCase() === "mentor" && (
                <BookOpen className="w-3.5 h-3.5" />
              )}
              {userData.role.toLowerCase() !== "admin" &&
                userData.role.toLowerCase() !== "mentor" && (
                  <User className="w-3.5 h-3.5" />
                )}
              {userData.role}
            </span>

            {userData.birthdate && (
              <span
                className={`px-2.5 py-0.5 font-['JetBrains_Mono'] text-[11px] font-bold border flex items-center gap-1.5 uppercase ${innerRoundedClass} ${theme === "dark"
                    ? "bg-zinc-950 border-zinc-800 text-zinc-400"
                    : "bg-white border-slate-300 text-slate-600"
                  }`}
              >
                <Cake className="w-3.5 h-3.5" />
                {calculateAge(userData.birthdate)} Jahre
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Theme, useTheme } from "@/context/ThemeContext";
import { UserData } from "@/BackEnd/type";
import { FolderGit2, Plus } from "lucide-react";
import { useAuth } from "@/BackEnd/AuthContext";

export default function ProjectOverview() {
  const { theme, isRounded } = useTheme();
  const { userData } = useAuth();

  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  const projects = userData?.projects || [];

  return (
    <div
      className={`flex-1 p-6 border min-h-[300px] flex flex-col transition-all duration-300 ${roundedClass} ${theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-slate-100 border-slate-200"
        }`}
    >
      <h3
        className={`text-sm font-mono tracking-widest uppercase mb-6 ${theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
      >
        Eigene Projekte
      </h3>

      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 font-mono">
          <div
            className={`p-4 border mb-4 transition-colors duration-300 ${innerRoundedClass} ${theme === "dark"
                ? "bg-black/20 border-white/5 text-gray-500"
                : "bg-white border-slate-200 text-slate-400"
              }`}
          >
            <FolderGit2 className="w-8 h-8 opacity-80" />
          </div>

          <p
            className={`text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}
          >
            Momentan noch keine Projekte
          </p>
          <p
            className={`text-xs max-w-xs ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`}
          >
            Starte dein erstes Programmierabenteuer und erstelle ein neues
            Projekt!
          </p>

          <button
            className={`mt-5 px-4 py-2 border cursor-not-allowed flex items-center gap-2 text-xs font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${innerRoundedClass} ${theme === "dark"
                ? "bg-white text-black border-white hover:bg-gray-100"
                : "bg-red-600 text-white border-red-600 hover:bg-red-700"
              }`}
          >
            Bald Verfügbar
            {/*
            <Plus className="w-4 h-4" /> Projekt erstellen*/}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {projects.map((project: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 border transition-colors duration-300 ${innerRoundedClass} ${theme === "dark"
                  ? "bg-black/30 border-white/5 text-white"
                  : "bg-white border-slate-200 text-slate-900"
                }`}
            >
              <p className="font-bold">
                {project.name || `Projekt #${idx + 1}`}
              </p>
              <p className="opacity-50 text-[10px]">Zuletzt bearbeitet</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

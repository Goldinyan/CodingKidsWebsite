"use client";

import { useTheme } from "@/context/ThemeContext";
import { FolderGit2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProjectOverview() {
  const { theme, isRounded } = useTheme();
  const { userData } = useAuth();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  const projects = userData?.projects || [];

  return (
    <div
      className={`flex-1 p-6 border min-h-[300px] flex flex-col gap-5 transition-all duration-150 ${roundedClass} ${theme === "dark"
          ? "bg-[rgba(255,255,255,0.02)] border-zinc-800"
          : "bg-slate-50 border-slate-300"
        }`}
    >
      <span
        className={`block font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest uppercase ${theme === "dark" ? "text-green-500" : "text-green-400"
          }`}
      >
        Storage
      </span>

      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div
            className={`p-3 border mb-3 transition-colors duration-150 ${innerRoundedClass} ${theme === "dark"
                ? "bg-zinc-950/40 border-zinc-900 text-zinc-600"
                : "bg-white border-slate-200 text-slate-400"
              }`}
          >
            <FolderGit2 className="w-6 h-6" />
          </div>

          <p
            className={`text-sm font-medium mb-1 font-sans ${theme === "dark" ? "text-zinc-300" : "text-slate-800"
              }`}
          >
            Momentan noch keine Projekte
          </p>
          <p
            className={`text-xs max-w-xs font-sans mb-5 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
              }`}
          >
            Starte dein erstes Programmierabenteuer und erstelle ein neues
            Projekt!
          </p>

          <button
            disabled
            className={`px-4 py-2 border cursor-not-allowed font-['JetBrains_Mono'] text-[11px] font-bold tracking-wider uppercase transition-colors ${innerRoundedClass} ${theme === "dark"
                ? "bg-zinc-950 text-zinc-500 border-zinc-900"
                : "bg-white text-slate-400 border-slate-200"
              }`}
          >
            Bald Verfügbar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 border transition-colors duration-150 flex flex-col gap-2 ${innerRoundedClass} ${theme === "dark"
                  ? "bg-zinc-950/40 border-zinc-900"
                  : "bg-white border-slate-200"
                }`}
            >
              <div className="flex items-center gap-2">
                <FolderGit2
                  className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
                />
                <span
                  className={`text-[10px] font-['JetBrains_Mono'] uppercase font-bold tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                    }`}
                >
                  {project.name || `Projekt #${idx + 1}`}
                </span>
              </div>
              <p
                className={`text-xs font-sans ${theme === "dark" ? "text-zinc-400" : "text-slate-500"
                  }`}
              >
                Zuletzt bearbeitet: Gerade eben
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

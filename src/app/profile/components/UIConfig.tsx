"use client";

import { useTheme } from "@/context/ThemeContext";

export default function UIConfig({ className = "" }: { className?: string }) {
  const { theme, isRounded, toggleTheme, toggleRounded } = useTheme();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  return (
    <div
      className={`w-full p-6 border transition-all duration-150 flex flex-col gap-5 ${roundedClass} ${className} ${theme === "dark"
          ? "bg-[rgba(255,255,255,0.02)] border-zinc-800"
          : "bg-slate-50 border-slate-300"
        }`}
    >
      <div className="flex flex-col gap-1">
        <span
          className={`block font-mono text-[10px] font-bold tracking-widest uppercase ${theme === "dark" ? "text-green-500" : "text-green-400"
            }`}
        >
          System 
        </span>
        <p
          className={`text-xxs font-sans ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
            }`}
        >
          Passe das visuelle Erscheinungsbild der Website an deine Vorlieben
          an.
        </p>
      </div>

      <div className="flex flex-col gap-3 font-mono text-xs">
        <div
          className={`flex items-center justify-between py-2 border-b ${theme === "dark" ? "border-zinc-800/60" : "border-slate-200"
            }`}
        >
          <span
            className={theme === "dark" ? "text-zinc-400" : "text-slate-600"}
          >
            Theme:
          </span>

          <div
            className={`flex items-center border p-0.5 select-none ${innerRoundedClass} ${theme === "dark"
                ? "bg-zinc-950/60 border-zinc-900"
                : "bg-white border-slate-200"
              }`}
          >
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase transition-all duration-150 ${innerRoundedClass} ${theme !== "dark"
                  ? "bg-slate-100 text-slate-900"
                  : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
              Light
            </button>
            <span
              className={`text-[10px] mx-1 select-none ${theme === "dark" ? "text-zinc-800" : "text-slate-200"
                }`}
            >
              /
            </span>
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase transition-all duration-150 ${innerRoundedClass} ${theme === "dark"
                  ? "bg-zinc-800 text-white"
                  : "text-slate-400 hover:text-slate-800"
                }`}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <span
            className={theme === "dark" ? "text-zinc-400" : "text-slate-600"}
          >
            Borders:
          </span>

          <div
            className={`flex items-center border p-0.5 select-none ${innerRoundedClass} ${theme === "dark"
                ? "bg-zinc-950/60 border-zinc-900"
                : "bg-white border-slate-200"
              }`}
          >
            <button
              onClick={() => isRounded && toggleRounded()}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase transition-all duration-150 ${innerRoundedClass} ${!isRounded
                  ? theme === "dark"
                    ? "bg-zinc-800 text-white"
                    : "bg-slate-100 text-slate-900"
                  : theme === "dark"
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-slate-400 hover:text-slate-800"
                }`}
            >
              Sharp
            </button>
            <span
              className={`text-[10px] mx-1 select-none ${theme === "dark" ? "text-zinc-800" : "text-slate-200"
                }`}
            >
              /
            </span>
            <button
              onClick={() => !isRounded && toggleRounded()}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase transition-all duration-150 ${innerRoundedClass} ${isRounded
                  ? theme === "dark"
                    ? "bg-zinc-800 text-white"
                    : "bg-slate-100 text-slate-900"
                  : theme === "dark"
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-slate-400 hover:text-slate-800"
                }`}
            >
              Smooth
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

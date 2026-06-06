"use client";

import { useTheme } from "@/context/ThemeContext";

export default function KontaktView() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
        } border-b p-4 sm:p-6 backdrop-blur-sm transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <h1
            className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            In Kontakt treten
          </h1>
        </div>
      </div>
    </div>
  );
}

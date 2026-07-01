"use client";

import { Theme } from "@/context/ThemeContext";
import { Lock } from "lucide-react";

interface SecurityButtonProps {
  theme: Theme;
  isRounded: boolean;
  onClick: () => void;
  className?: string;
}

export default function SecurityButton({
  theme,
  isRounded,
  onClick,
  className
}: SecurityButtonProps) {
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 border transition-all duration-300 backdrop-blur-xl hover:scale-105 ${roundedClass} ${className} ${
        theme === "dark"
          ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-green-500/30"
          : "bg-slate-100 border-slate-200 hover:bg-slate-200 hover:border-green-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <Lock
          className={`w-5 h-5 ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        />
        <div className="text-left">
          <p
            className={`text-sm font-mono tracking-widest uppercase ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}
          >
            Sicherheit
          </p>
          <p
            className={`text-xs mt-1 ${
              theme === "dark" ? "text-gray-400" : "text-slate-600"
            }`}
          >
            E-Mail und Passwort ändern
          </p>
        </div>
      </div>
    </button>
  );
}

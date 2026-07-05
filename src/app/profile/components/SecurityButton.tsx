"use client";

import { Theme, useTheme } from "@/context/ThemeContext";
import { Lock } from "lucide-react";

interface SecurityButtonProps {
  onClick: () => void;
  className?: string;
}

export default function SecurityButton({
  onClick,
  className = "",
}: SecurityButtonProps) {
  const { theme, isRounded } = useTheme();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";

  return (
    <button
      onClick={onClick}
      className={`w-full p-5 border text-left flex flex-col gap-2 transition-all duration-150 ${roundedClass} ${className} ${theme === "dark"
          ? "bg-[rgba(255,255,255,0.02)] border-zinc-800 hover:bg-zinc-900/50 hover:border-zinc-700"
          : "bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400"
        }`}
    >
      <span
        className={`block font-mono text-[10px] font-bold tracking-widest uppercase ${theme === "dark" ? "text-green-500" : "text-green-400"
          }`}
      >
        Security
      </span>

      <div className="flex items-center gap-2">
        <Lock
          className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-400" : "text-slate-500"
            }`}
        />
        <p
          className={`text-sm font-medium font-sans ${theme === "dark" ? "text-zinc-200" : "text-slate-800"
            }`}
        >
          Sicherheit & Zugang
        </p>
      </div>

      <p
        className={`text-xxs font-sans ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
          }`}
      >
        Ändere deine E-Mail-Adresse oder aktualisiere dein Passwort.
      </p>
    </button>
  );
}

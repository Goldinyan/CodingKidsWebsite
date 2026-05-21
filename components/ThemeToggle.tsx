"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Theme wechseln"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-md border border-border/50 group-hover:border-border/70 transition-all duration-300" />

      <div className="relative flex items-center justify-center h-14 w-14 rounded-full">
        <Sun
          size={24}
          className={`absolute transition-all duration-500 transform ${theme === "light"
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 rotate-90"
            } text-amber-500`}
        />

        <Moon
          size={24}
          className={`absolute transition-all duration-500 transform ${theme === "dark"
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 -rotate-90"
            } text-slate-300`}
        />
      </div>

      <div className="absolute inset-0 rounded-full bg-accent/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </button>
  );
}

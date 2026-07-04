"use client";

import { useTheme } from "@/context/ThemeContext";

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function FilterPill({
  active,
  onClick,
  children,
}: FilterPillProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xxs border transition-all font-medium ${
        active
          ? "bg-green-500/10 border-green-500/30 text-green-500"
          : theme === "dark"
          ? "bg-white/[0.03] border-white/[0.08] text-gray-500 hover:bg-white/[0.06] hover:border-white/[0.12]"
          : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

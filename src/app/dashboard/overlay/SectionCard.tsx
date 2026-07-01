"use client";

import { LucideIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SectionCard({
  id,
  label,
  Icon,
  isActive,
  setOpen,
  scrollToSection,
}: {
  id: string;
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
  setOpen: (y: boolean) => void;
  scrollToSection: (section: string, setOpen: (y: boolean) => void) => void;
}) {
  const { theme, isRounded } = useTheme();

  // Dynamische Radien basierend auf isRounded
  const cardRadius = isRounded ? "rounded-lg" : "rounded-none";
  const iconRadius = isRounded ? "rounded-md" : "rounded-none";

  // Styles für den Button (Hintergrund & Rahmen)
  const buttonStyles = isActive
    ? theme === "dark"
      ? "bg-zinc-900/50 border-zinc-800"
      : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
    : theme === "dark"
      ? "hover:bg-zinc-900/30 border-transparent"
      : "hover:bg-gray-50 border-transparent";

  // Styles für den Icon-Container
  const iconContainerStyles = isActive
    ? theme === "dark"
      ? "bg-blue-950 text-blue-400"
      : "bg-blue-600 text-white"
    : theme === "dark"
      ? "bg-zinc-900 group-hover:bg-zinc-800 text-zinc-400 group-hover:text-zinc-200"
      : "bg-gray-100 group-hover:bg-gray-200 text-gray-600";

  const textStyles = isActive
    ? theme === "dark"
      ? "text-white font-semibold"
      : "text-blue-900"
    : theme === "dark"
      ? "text-zinc-400 group-hover:text-zinc-200"
      : "text-gray-600 group-hover:text-gray-900";

  return (
    <button
      onClick={() => scrollToSection(id, setOpen)}
      className={`group relative w-full px-4 py-3 border transition-all duration-300 flex items-center gap-3 ${cardRadius} ${buttonStyles}`}
    >
      <div
        className={`flex-shrink-0 p-2 transition-all duration-300 ${iconRadius} ${iconContainerStyles}`}
      >
        <Icon className="w-4 h-4 text-current" />
      </div>

      <div className="flex-1 text-left">
        <p className={`text-sm font-medium transition-colors font-gro ${textStyles}`}>
          {label}
        </p>
      </div>
    </button>
  );
}

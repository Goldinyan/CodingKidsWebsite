"use client";

import { useTheme } from "@/context/ThemeContext";
import RessourcesView from "./RessourcesView";

export default function RessourcesPage() {
  const { theme } = useTheme();

  return (
    <div className={`w-full min-h-screen relative main-view-container transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <div className="relative w-full flex flex-col z-10 pt-8">
        <RessourcesView />
      </div>
    </div>
  );
}

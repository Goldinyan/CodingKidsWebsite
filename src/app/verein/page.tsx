"use client";

import ClubViews from "./ClubView";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className={`w-full min-h-screen relative main-view-container transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <div className="relative w-full flex flex-col z-10 pt-8">
        <ClubViews />
      </div>
    </div>
  );
}

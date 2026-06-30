"use client";

import WerWirSind from "./WerWirSind";
import Support from "./Support";
import Partners from "./Partners";
import { useTheme } from "@/context/ThemeContext";

export default function ClubViews() {
  const { theme } = useTheme();

  return (
    <div className="max-w-6xl mx-auto px-6">
      <section id="wir" className={`py-10 border-b transition-colors duration-300 ${theme === "dark" ? "border-white/10" : "border-slate-200"}`}>
        <WerWirSind />
      </section>
      <section className={`py-10 border-b transition-colors duration-300 ${theme === "dark" ? "border-white/10" : "border-slate-200"}`}>
        <Partners />
      </section>
      <section id="mitglied" className={`py-10 transition-colors duration-300`}>
        <Support />
      </section>
    </div>
  );
}

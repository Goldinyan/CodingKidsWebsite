"use client";

import { useAuth } from "@/BackEnd/AuthContext";
import NoUserKontakt from "./NoUserKontakt";
import AnnouncementView from "./AnnouncementView";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { user, loading, userData } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <div
          className={`transition-colors duration-300 ${
            theme === "dark" ? "text-gray-400" : "text-slate-600"
          }`}
        >
          Lädt...
        </div>
      </div>
    );
  }

  if (!user) return <NoUserKontakt />;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`${
          theme === "dark"
            ? "bg-white/5 border-white/10"
            : "bg-slate-50 border-slate-200"
        } border-b  pt-5 backdrop-blur-sm transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <h1
            className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Kontakt & Ankündigungen
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userData && <AnnouncementView data={userData} />}
      </div>
    </div>
  );
}

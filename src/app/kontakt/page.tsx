"use client";

import { useAuth } from "@/context/AuthContext";
import NoUserKontakt from "./NoUserKontakt";
import KontaktAdmin from "./KontaktAdmin";
import AdminView from "./AdminView";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { user, loading, userData } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-white"
          }`}
      >
        <div
          className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
            }`}
        >
          Lädt...
        </div>
      </div>
    );
  }

  if (!user) return <NoUserKontakt />;

  // Show admin view for admins and mentors
  if (userData?.role === "admin" || userData?.role === "mentor") {
    return <AdminView />;
  }

  // Show user view for regular users, members
  return <KontaktAdmin />;
}

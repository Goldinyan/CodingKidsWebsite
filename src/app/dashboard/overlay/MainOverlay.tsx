// src/app/dashboard/overlay/MainOverlay.tsx

import UserDashboard from "../UserDashboard";
import EventDashboard from "../EventDashboard";
import MentorDashboard from "../MentorDashboard";
import AnnouncementDashboard from "../AnnouncementDashboard";
import CourseDashboard from "../CourseDashboard";
import AnalyticsDashboard from "../AnalyticsDashboard";
import { useTheme } from "@/context/ThemeContext";

export default function MainOverlay() {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full min-h-screen relative main-view-container ${theme === "dark" ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <div className="relative w-full flex flex-col z-10">
        <div className="flex flex-col w-full gap-0 max-w-7xl mx-auto">
          {/*<section id="analytics" className={`py-10 px-6 border-b ${theme === "dark" ? "border-white/10" : "border-slate-300"}`}>
            <AnalyticsDashboard />
          </section>*/}
          <section
            id="user"
            className={`py-10 px-6 border-b ${theme === "dark" ? "border-white/10" : "border-slate-300"}`}
          >
            <UserDashboard />
          </section>
          <section
            id="events"
            className={`py-10 px-6 border-b ${theme === "dark" ? "border-white/10" : "border-slate-300"}`}
          >
            <EventDashboard />
          </section>
          <section
            id="courses"
            className={`py-10 px-6 border-b ${theme === "dark" ? "border-white/10" : "border-slate-300"}`}
          >
            <CourseDashboard />
          </section>
          <section
            id="mentor"
            className={`py-10 px-6 border-b ${theme === "dark" ? "border-white/10" : "border-slate-300"}`}
          >
            <MentorDashboard />
          </section>
          <section id="announce" className={`py-10 px-6`}>
            <AnnouncementDashboard />
          </section>
        </div>
      </div>
    </div>
  );
}

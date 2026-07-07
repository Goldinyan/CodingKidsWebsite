"use client";

import { useMemo } from "react";
import type { UserData, AnnouncementData } from "@/BackEnd/type";
import { markAnnouncementAsRead } from "@/lib/db";
import {
  Bell,
  User,
  Zap,
  Shield,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/DataContext";
import { useNotificationToast } from "@/hooks/useNotificationToast";

export default function AnnouncementView({ data }: { data: UserData }) {
  const { user, userRole } = useAuth();
  const { theme, isRounded } = useTheme();
  const { getAnnouncements, refreshData, loadingStates } = useAppData();
  const { showErrorToast } = useNotificationToast();

  const radiusClass = isRounded ? "rounded-lg" : "rounded-none";
  const badgeRadiusClass = isRounded ? "rounded-md" : "rounded-none";

  const rawAnnouncements = getAnnouncements();

  const hasAccess = (role: string) => {
    switch (data.role) {
      case "admin":
        return true;
      case "mentor":
        return ["user", "member", "mentor"].includes(role);
      case "user":
        return ["user", "member"].includes(role);
      case "member":
        return role === "member";
      default:
        return false;
    }
  };

  const accessibleAnnouncements = useMemo(() => {
    return rawAnnouncements
      .filter((an) => hasAccess(an.tag))
      .sort((a, b) => {
        const timeA = a.date?.toDate?.().getTime() || 0;
        const timeB = b.date?.toDate?.().getTime() || 0;
        return timeB - timeA;
      });
  }, [rawAnnouncements, data.role]);

  const handleMarkAsRead = async (announcementUid: string) => {
    if (!user?.uid) return;

    try {
      await markAnnouncementAsRead(announcementUid, user.uid, userRole);

      // refreshed only announcement cache
      await refreshData("announcements");
    } catch (error) {
      showErrorToast(error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3.5 h-3.5" />;
      case "mentor":
        return <Zap className="w-3.5 h-3.5" />;
      case "member":
        return <User className="w-3.5 h-3.5" />;
      default:
        return <Bell className="w-3.5 h-3.5" />;
    }
  };

  const getRoleTagColor = (role: string) => {
    if (theme === "dark") {
      switch (role) {
        case "admin":
          return "bg-red-950/40 text-red-400 border border-red-900/50";
        case "mentor":
          return "bg-amber-950/40 text-amber-400 border border-amber-900/50";
        case "member":
          return "bg-green-950/40 text-green-400 border border-green-900/50";
        default:
          return "bg-blue-950/40 text-blue-400 border border-blue-900/50";
      }
    } else {
      switch (role) {
        case "admin":
          return "bg-red-50 text-red-700 border border-red-200";
        case "mentor":
          return "bg-amber-50 text-amber-700 border border-amber-200";
        case "member":
          return "bg-green-50 text-green-700 border border-green-200";
        default:
          return "bg-blue-50 text-blue-700 border border-blue-200";
      }
    }
  };

  // Initiales Laden anzeigen, solange noch gar keine Daten im Cache sind
  if (loadingStates.announcements && rawAnnouncements.length === 0) {
    return (
      <div className="w-full mt-10 p-5 text-center font-mono text-xs uppercase text-zinc-500 animate-pulse">
        Lade Ankündigungsmatrizen...
      </div>
    );
  }

  return (
    <div className="w-full mt-10 font-['DM_Sans']">
      <div className="mb-8 text-left flex items-center justify-between border-b pb-4 border-dashed border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Bell
            className={`w-5 h-5 ${theme === "dark" ? "text-[#4ADE80]" : "text-green-600"}`}
          />
          <h2
            className={`text-2xl font-black font-['Familjen_Grotesk'] tracking-wide uppercase ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Ankündigungen
          </h2>
        </div>
        <span
          className={`font-['JetBrains_Mono'] text-xs font-bold px-3 py-1 border ${badgeRadiusClass} ${theme === "dark" ? "bg-zinc-950 text-zinc-400 border-zinc-800" : "bg-slate-50 text-slate-600 border-slate-200"}`}
        >
          COUNT // {accessibleAnnouncements.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {accessibleAnnouncements.length > 0 ? (
          accessibleAnnouncements.map((an) => {
            const isReadByCurrentUser = user?.uid
              ? an.readBy?.includes(user.uid)
              : false;

            return (
              <div
                key={an.uid}
                className={`p-5 border transition-all duration-150 ${radiusClass} ${theme === "dark" ? "bg-[rgba(255,255,255,0.015)] border-zinc-900 hover:border-zinc-800" : "bg-white border-slate-200 hover:border-slate-300"}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <h3
                      className={`text-lg font-black font-['Familjen_Grotesk'] tracking-wide uppercase mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                    >
                      {an.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-['JetBrains_Mono'] text-[10px] font-bold uppercase ${badgeRadiusClass} ${getRoleTagColor(an.tag)}`}
                      >
                        {getRoleIcon(an.tag)}
                        {an.tag}
                      </span>
                      <span
                        className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
                      >
                        von{" "}
                        <span
                          className={`font-bold ${theme === "dark" ? "text-zinc-300" : "text-slate-700"}`}
                        >
                          {an.authorName}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] whitespace-nowrap ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {an.date?.toDate?.().toLocaleDateString("de-DE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div
                  className={`text-sm leading-relaxed mb-4 whitespace-pre-wrap break-words ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
                >
                  {an.content}
                </div>

                <div
                  className={`pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${theme === "dark" ? "border-zinc-900" : "border-slate-100"}`}
                >
                  <div
                    className={`flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] uppercase ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
                  >
                    {an.readBy && an.readBy.length > 0 ? (
                      <>
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${theme === "dark" ? "text-[#4ADE80]" : "text-green-600"}`}
                        />
                        <span>
                          {an.readBy.length} von{" "}
                          {Math.max(an.readBy.length + 1, 1)} gelesen
                        </span>
                      </>
                    ) : (
                      <span>Ungelesen</span>
                    )}
                  </div>

                  {!isReadByCurrentUser && (
                    <button
                      onClick={() => handleMarkAsRead(an.uid)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 font-['JetBrains_Mono'] text-xxs font-bold uppercase border transition-colors ${badgeRadiusClass} ${theme === "dark" ? "bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Als gelesen markieren
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div
            className={`border p-12 text-center ${radiusClass} ${theme === "dark" ? "bg-[rgba(255,255,255,0.015)] border-zinc-900" : "bg-white border-slate-200"}`}
          >
            <Bell
              className={`w-8 h-8 mx-auto mb-3 opacity-30 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            />
            <p
              className={`text-sm font-bold font-['JetBrains_Mono'] uppercase mb-1 ${theme === "dark" ? "text-zinc-400" : "text-slate-700"}`}
            >
              Keine Einträge
            </p>
            <p
              className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
            >
              Neue Systemmeldungen für deine Berechtigungsstufe werden hier
              ausgegeben.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

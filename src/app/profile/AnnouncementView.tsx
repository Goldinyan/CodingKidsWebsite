"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData, AnnouncementData, PresetRoles } from "@/BackEnd/type";
import { getAllAnnouncements } from "@/lib/db";
import { Bell, User, Zap, Shield, CheckCircle2, Clock } from "lucide-react";

const roles: PresetRoles[] = ["Admin", "All", "Member", "Mentor", "User"];

export default function AnnouncementView({ data }: { data: UserData }) {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [filAn, setFilAn] = useState<Record<string, AnnouncementData[]>>({});

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length > 0) {
      const filtered: Record<string, AnnouncementData[]> = {};
      roles.forEach((role) => {
        filtered[role] = announcements.filter((an) => an.tag === role);
      });
      setFilAn(filtered);
    }
  }, [announcements]);

  const hasAccess = (role: string) => {
    switch (data.role) {
      case "Admin":
        return true;
      case "Mentor":
        if (role === "User" || role === "Member" || role === "Mentor") {
          return true;
        } else {
          return false;
        }
      case "User":
        if (role === "User" || role === "Member") {
          return true;
        } else {
          return false;
        }
      case "Member":
        if (role === "Member") {
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  };

  const getAccessibleAnnouncements = () => {
    return Object.entries(filAn)
      .flatMap(([role, anns]) =>
        anns.filter((an) => hasAccess(an.tag)).map((an) => ({ ...an, role })),
      )
      .sort(
        (a, b) => b.date?.toDate?.().getTime() - a.date?.toDate?.().getTime(),
      );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="w-4 h-4" />;
      case "Mentor":
        return <Zap className="w-4 h-4" />;
      case "Member":
        return <User className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getRoleTagColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-900 text-red-200";
      case "Mentor":
        return "bg-yellow-900 text-yellow-200";
      case "Member":
        return "bg-green-900 text-green-200";
      default:
        return "bg-blue-900 text-blue-200";
    }
  };

  const accessibleAnnouncements = getAccessibleAnnouncements();

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ankündigungen
          </h2>
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {accessibleAnnouncements.length}
          </span>
        </div>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 gap-4">
        {accessibleAnnouncements.length > 0 ? (
          accessibleAnnouncements.map((an) => (
            <div
              key={an.uid}
              className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-5 sm:p-6 hover:border-slate-500 transition-all duration-200 hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {an.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${getRoleTagColor(an.tag)}`}
                    >
                      {getRoleIcon(an.tag)}
                      {an.tag}
                    </span>
                    <span className="text-slate-400 text-sm">
                      von{" "}
                      <span className="text-slate-200 font-medium">
                        {an.author}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Date Badge */}
                <div className="flex items-center gap-2 text-slate-400 text-sm whitespace-nowrap">
                  <Clock className="w-4 h-4" />
                  <span>
                    {an.date?.toDate?.().toLocaleDateString("de-DE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="text-slate-300 leading-relaxed text-sm sm:text-base mb-4 whitespace-pre-wrap break-words">
                {an.content}
              </div>

              {/* Footer - Read status */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {an.readBy && an.readBy.length > 0 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>
                        {an.readBy.length} von{" "}
                        {Math.max(an.readBy.length + 1, 1)} gelesen
                      </span>
                    </>
                  ) : (
                    <span>Noch nicht gelesen</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-12 text-center">
            <Bell className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 text-lg font-medium">
              Keine Ankündigungen verfügbar
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Du wirst hier benachrichtigt, wenn neue Ankündigungen für deine
              Rolle verfügbar sind.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

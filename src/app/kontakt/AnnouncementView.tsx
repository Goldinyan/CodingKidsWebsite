"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData, AnnouncementData} from "@/BackEnd/type";
import { getAllAnnouncements, getAllUsers } from "@/lib/db";
import { Bell, User, Zap, Shield, CheckCircle2, Clock } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { UserRole } from "@/BackEnd/type";

export default function AnnouncementView({ data }: { data: UserData }) {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [filAn, setFilAn] = useState<Record<string, AnnouncementData[]>>({});
  const { user, userRole } = useAuth();
  const { theme } = useTheme();

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const currentKey = `${user.uid}-${userRole}`;
    if (hasFetched.current === currentKey) return;

    const fetchAnnouncements = async () => {
      hasFetched.current = currentKey;
      const data = await getAllAnnouncements(
        user?.uid || "anonymous",
        userRole,
      );
      setAnnouncements(data);
    };
    fetchAnnouncements();
  }, [user?.uid, userRole]);

  const getAuthor = async (id: string): Promise<UserData> => {
    const allUsers = await getAllUsers(user?.uid || "anonymous", userRole);
    allUsers.filter((u) => u.uid == id);
    return allUsers[0];
  };

  const roles: UserRole[] = ["admin", "mentor", "member", "user"];
  
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
      case "admin":
        return true;
      case "mentor":
        if (role === "user" || role === "member" || role === "mentor") {
          return true;
        } else {
          return false;
        }
      case "user":
        if (role === "user" || role === "member") {
          return true;
        } else {
          return false;
        }
      case "member":
        if (role === "member") {
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
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "mentor":
        return <Zap className="w-4 h-4" />;
      case "member":
        return <User className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getRoleTagColor = (role: string) => {
    if (theme === "dark") {
      switch (role) {
        case "admin":
          return "bg-red-900/30 text-red-400 border border-red-700/50";
        case "mentor":
          return "bg-yellow-900/30 text-yellow-400 border border-yellow-700/50";
        case "member":
          return "bg-green-900/30 text-green-400 border border-green-700/50";
        default:
          return "bg-blue-900/30 text-blue-400 border border-blue-700/50";
      }
    } else {
      switch (role) {
        case "admin":
          return "bg-red-100 text-red-800";
        case "mentor":
          return "bg-yellow-100 text-yellow-800";
        case "member":
          return "bg-green-100 text-green-800";
        default:
          return "bg-blue-100 text-blue-800";
      }
    }
  };

  const accessibleAnnouncements = getAccessibleAnnouncements();

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell
            className={`w-6 h-6 transition-colors duration-300 ${theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
          />
          <h2
            className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Ankündigungen
          </h2>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full transition-colors duration-300 ${theme === "dark"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-green-100 text-green-800"
              }`}
          >
            {accessibleAnnouncements.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {accessibleAnnouncements.length > 0 ? (
          accessibleAnnouncements.map((an) => {
            let author;
            const fetchAuthor = async () => {
              author = (await getAuthor(an.author)) as UserData;
            };

            fetchAuthor();
            return (
              <div
                key={an.uid}
                className={`p-5 border rounded-lg transition-all duration-200 hover:shadow-md ${theme === "dark"
                    ? "bg-white/5 border-green-500/30 hover:border-green-500/60 hover:bg-white/10"
                    : "bg-slate-50 border-green-300 hover:border-green-500 hover:bg-green-50"
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                  <div className="flex-grow">
                    <h3
                      className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"
                        }`}
                    >
                      {an.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors duration-300 ${getRoleTagColor(
                          an.tag,
                        )}`}
                      >
                        {getRoleIcon(an.tag)}
                        {an.tag}
                      </span>
                      <span
                        className={`text-sm transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                          }`}
                      >
                        von{" "}
                        <span
                          className={`font-medium transition-colors duration-300 ${theme === "dark"
                              ? "text-gray-300"
                              : "text-slate-900"
                            }`}
                        >
                          {an.author}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-sm whitespace-nowrap transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                      }`}
                  >
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

                <div
                  className={`leading-relaxed text-sm sm:text-base mb-4 whitespace-pre-wrap break-words transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-slate-700"
                    }`}
                >
                  {an.content}
                </div>

                <div
                  className={`flex items-center justify-between pt-3 border-t transition-colors duration-300 ${theme === "dark"
                      ? "border-green-500/30"
                      : "border-green-300"
                    }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                      }`}
                  >
                    {an.readBy && an.readBy.length > 0 ? (
                      <>
                        <CheckCircle2
                          className={`w-4 h-4 transition-colors duration-300 ${theme === "dark"
                              ? "text-green-400"
                              : "text-green-600"
                            }`}
                        />
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
            );
          })
        ) : (
          <div
            className={`border rounded-lg p-12 text-center transition-colors duration-300 ${theme === "dark"
                ? "bg-white/5 border-white/10"
                : "bg-white border-slate-200"
              }`}
          >
            <Bell
              className={`w-12 h-12 mx-auto mb-4 opacity-50 transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-slate-400"
                }`}
            />
            <p
              className={`text-lg font-medium transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                }`}
            >
              Keine Ankündigungen verfügbar
            </p>
            <p
              className={`text-sm mt-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                }`}
            >
              Du wirst hier benachrichtigt, wenn neue Ankündigungen für deine
              Rolle verfügbar sind.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData } from "@/BackEnd/type";
import { deleteUser, getUserData } from "@/lib/db";
import AccountDetails from "./components/AccountDetails";
import { toJsDate } from "@/BackEnd/utils";
import { Timestamp } from "firebase/firestore";
import { Theme, useTheme } from "@/context/ThemeContext";
import UIConfig from "./components/UIConfig";
import AccountDeletion from "./components/AccountDeletion";
import ProfileHeader from "./components/ProfileHeader";
import { notFound } from "next/navigation";

export default function ProfileView() {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  const { user, userRole } = useAuth();
  const { theme, isRounded } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const data = await getUserData(user.uid);
      if (data) {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${theme === "dark" ? " text-gray-400" : " text-slate-600"
          }`}
      >
        <div className="font-mono text-xs tracking-widest uppercase animate-pulse">
          Lädt...
        </div>
      </div>
    );
  }

  if (!userData) return notFound;

  return (
    <div
      className={`min-h-screen py-12 px-4 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-slate-600"
        }`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileHeader
          theme={theme}
          isRounded={isRounded}
          userData={userData}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AccountDetails
            theme={theme}
            isRounded={isRounded}
            userData={userData}
          />
          <div className="flex flex-col gap-6">
            <UIConfig theme={theme} isRounded={isRounded} userData={userData} />
            <AccountDeletion
              theme={theme}
              isRounded={isRounded}
              user={user}
              userRole={userRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

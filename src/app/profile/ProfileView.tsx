"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData } from "@/BackEnd/type";
import { getUserData } from "@/lib/db";
import AccountDetails from "./components/AccountDetails";
import { useTheme } from "@/context/ThemeContext";
import UIConfig from "./components/UIConfig";
import AccountDeletion from "./components/AccountDeletion";
import ProfileHeader from "./components/ProfileHeader";
import { notFound } from "next/navigation";
import AvatarView from "./components/AvatarView";

export default function ProfileView() {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(true);
  const [showAvatarView, setShowAvatarView] = useState<boolean>(false);

  const { user, userRole } = useAuth();
  const { theme, isRounded, toggleTheme, toggleRounded } = useTheme();

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
      <div className="max-w-5xl mx-auto space-y-6">
        <ProfileHeader
          theme={theme}
          isRounded={isRounded}
          userData={userData}
          showAvatarView={showAvatarView}
          setShowAvatarView={setShowAvatarView}
        />
        {showAvatarView ? (
          <AvatarView
            theme={theme}
            isRounded={isRounded}
            userData={userData}
            showAvatarView={showAvatarView}
            setShowAvatarView={setShowAvatarView}
          />
        ) : (
          ""
        )}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
          <div className="md:col-span-5">
            <AccountDetails
              theme={theme}
              isRounded={isRounded}
              userData={userData}
            />
          </div>
          <div className="md:col-span-3 flex flex-col gap-6 ">
            <UIConfig
              theme={theme}
              toggleTheme={toggleTheme}
              isRounded={isRounded}
              toggleRounded={toggleRounded}
              userData={userData}
            />
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

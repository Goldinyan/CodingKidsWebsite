"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AccountDetails from "./components/AccountDetails";
import { useTheme } from "@/context/ThemeContext";
import UIConfig from "./components/UIConfig";
import NotificationSettings from "./components/NotificationSettings";
import ProfileHeader from "./components/ProfileHeader";
import { notFound } from "next/navigation";
import SecurityButton from "./components/SecurityButton";
import SecurityDialog from "./components/SecurityDialog";
import ProjectOverview from "./components/ProjectOverview";
import AccountActions from "./components/AccountActions";

export default function ProfileView() {
  const [showSecurityDialog, setShowSecurityDialog] = useState<boolean>(false);

  const { user, userData, userRole, updateProfile, loading } = useAuth();
  const { theme, isRounded } = useTheme();

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

  if (!userData) return notFound();

  return (
    <div
      className={`min-h-screen py-12 px-4 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-slate-600"
        }`}
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
            <div className="flex flex-row md:col-span-5">
              <ProfileHeader userData={userData} />
            </div>
            <div className="flex flex-col gap-4 md:col-span-3">
              <AccountActions user={user} userRole={userRole} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-7 flex flex-col gap-6">
              <AccountDetails userData={userData} />

              <ProjectOverview />
            </div>

            <div className="md:col-span-5 flex flex-col gap-6">
              <SecurityButton onClick={() => setShowSecurityDialog(true)} />

              <UIConfig />

              <NotificationSettings
                userData={userData}
                updateProfile={updateProfile}
              />
            </div>
          </div>
        </section>
      </div>

      <SecurityDialog
        theme={theme}
        isRounded={isRounded}
        userData={userData}
        user={user}
        open={showSecurityDialog}
        onOpenChange={setShowSecurityDialog}
      />
    </div>
  );
}

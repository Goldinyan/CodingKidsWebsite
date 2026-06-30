"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import AccountDetails from "./components/AccountDetails";
import { useTheme } from "@/context/ThemeContext";
import UIConfig from "./components/UIConfig";
import AccountDeletion from "./components/AccountDeletion";
import ProfileHeader from "./components/ProfileHeader";
import { notFound } from "next/navigation";
import AvatarView from "./components/AvatarView";
import LogOut from "./components/LogOut";
import SecurityButton from "./components/SecurityButton";
import SecurityDialog from "./components/SecurityDialog";

export default function ProfileView() {
  const [showAvatarView, setShowAvatarView] = useState<boolean>(false);
  const [showSecurityDialog, setShowSecurityDialog] = useState<boolean>(false);

  const { user, userData, userRole, updateProfile, loading } = useAuth();
  const { theme, isRounded, toggleTheme, toggleRounded } = useTheme();

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
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="space-y-4">
          <h1
            className={`text-4xl font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Profil
          </h1>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Verwalten Sie Ihr Profil und Ihre Einstellungen
          </p>
        </div>

        {/* Profile Section */}
        <section className="space-y-4">
          <h2
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white/80" : "text-slate-700"
            }`}
          >
            Profinformationen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
            <div className="flex flex-row md:col-span-5">
              <ProfileHeader
                theme={theme}
                isRounded={isRounded}
                userData={userData}
                showAvatarView={showAvatarView}
                setShowAvatarView={setShowAvatarView}
              />
            </div>
            <div className="flex flex-col gap-4 md:col-span-3">
              <LogOut
                theme={theme}
                isRounded={isRounded}
              />
              <AccountDeletion
                theme={theme}
                isRounded={isRounded}
                user={user}
                userRole={userRole}
              />
            </div>

            {showAvatarView ? (
              <AvatarView
                theme={theme}
                isRounded={isRounded}
                userData={userData}
                updateProfile={updateProfile}
                setShowAvatarView={setShowAvatarView}
              />
            ) : (
              ""
            )}
          </div>
        </section>

        {/* Account Details Section */}
        <section className="space-y-4">
          <h2
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white/80" : "text-slate-700"
            }`}
          >
            Kontodetails
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
            <div className="md:col-span-5">
              <AccountDetails
                theme={theme}
                isRounded={isRounded}
                userData={userData}
              />
            </div>
            <div className="md:col-span-3 flex flex-col gap-6">
              <SecurityButton
                theme={theme}
                isRounded={isRounded}
                onClick={() => setShowSecurityDialog(true)}
              />
            </div>
          </div>
        </section>

        {/* Settings Section */}
        <section className="space-y-4">
          <h2
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white/80" : "text-slate-700"
            }`}
          >
            Einstellungen
          </h2>
          <UIConfig
            theme={theme}
            toggleTheme={toggleTheme}
            isRounded={isRounded}
            toggleRounded={toggleRounded}
          />
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

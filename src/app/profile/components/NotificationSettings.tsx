"use client";

import { useState } from "react";
import { Theme } from "@/context/ThemeContext";
import { AdminSettings, StaffSettings, UserSettings } from "@/BackEnd/type";
import { UserData, UserRole } from "@/BackEnd/type"; 

import {
  Bell,
  AlertCircle,
  Users,
  AlertTriangle,
  BookOpen,
  LucideIcon,
} from "lucide-react";

type NotificationKey =
  | "newEvent"
  | "kicked"
  | "queueToUser"
  | "understaffedWarning"
  | "logs"
  | "systemAlerts";

interface NotificationSettingsProps {
  theme: Theme;
  isRounded: boolean;
  userData: UserData;
  updateProfile: (updates: Partial<UserData>) => Promise<void>;
  className?: string;
}

interface SettingItem {
  key: NotificationKey;
  label: string;
  icon: LucideIcon;
  colorDark: string;
  colorLight: string;
  roles: string[];
}

const SETTINGS_CONFIG: SettingItem[] = [
  {
    key: "newEvent",
    label: "Neue Events",
    icon: Bell,
    colorDark: "text-blue-400",
    colorLight: "text-blue-600",
    roles: ["user", "member", "mentor", "admin"],
  },
  {
    key: "kicked",
    label: "Aus Event entfernt",
    icon: AlertCircle,
    colorDark: "text-red-400",
    colorLight: "text-red-600",
    roles: ["user", "member"],
  },
  {
    key: "queueToUser",
    label: "Warteschlange aktualisiert",
    icon: Users,
    colorDark: "text-purple-400",
    colorLight: "text-purple-600",
    roles: ["user", "member"],
  },
  {
    key: "understaffedWarning",
    label: "Personalbestand niedrig",
    icon: AlertTriangle,
    colorDark: "text-yellow-400",
    colorLight: "text-yellow-600",
    roles: ["mentor", "admin"],
  },
  {
    key: "logs",
    label: "System-Logs",
    icon: BookOpen,
    colorDark: "text-cyan-400",
    colorLight: "text-cyan-600",
    roles: ["admin"],
  },
  {
    key: "systemAlerts",
    label: "System-Warnungen",
    icon: AlertTriangle,
    colorDark: "text-orange-400",
    colorLight: "text-orange-600",
    roles: ["admin"],
  },
];

export default function NotificationSettings({
  theme,
  isRounded,
  userData,
  updateProfile,
  className,
}: NotificationSettingsProps) {
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  const [loading, setLoading] = useState(false);
  const [localSettings, setLocalSettings] = useState(userData.settings);

  const notificationSettings = localSettings.notifications as Record<
    string,
    boolean
  >;

  const handleToggle = async (settingKey: NotificationKey) => {
    setLoading(true);
    try {
      const currentVal = !!notificationSettings[settingKey];
      const newSettings = {
        ...localSettings,
        notifications: {
          ...notificationSettings,
          [settingKey]: !currentVal,
        },
      };

      setLocalSettings(newSettings as typeof localSettings);

      await updateProfile({
        settings: newSettings as any
      });
    } catch (error) {
      console.error("Error updating notifications:", error);
      setLocalSettings(userData.settings);
    } finally {
      setLoading(false);
    }
  };

  const toggleClass = (isEnabled: boolean) => `
    relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEnabled
      ? theme === "dark"
        ? "bg-green-500/30 border-green-500/50"
        : "bg-green-100 border-green-300"
      : theme === "dark"
        ? "bg-gray-700/50 border-gray-600/50"
        : "bg-gray-200 border-gray-300"
    } border ${innerRoundedClass}
  `;

  const toggleThumbClass = (isEnabled: boolean) => `
    inline-block h-4 w-4 transform rounded-full transition-transform ${isEnabled
      ? `translate-x-6 ${theme === "dark" ? "bg-green-400" : "bg-green-600"}`
      : `translate-x-1 ${theme === "dark" ? "bg-gray-500" : "bg-gray-400"}`
    }
  `;

  const visibleSettings = SETTINGS_CONFIG.filter((item) =>
    item.roles.includes(userData.role),
  );

  return (
    <div
      className={`backdrop-blur-xl p-6 border transition-all duration-300 space-y-4 flex-1 ${roundedClass} ${className} ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}
    >
      <h3
        className={`text-sm font-mono tracking-widest uppercase ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
      >
        Benachrichtigungen
      </h3>
      <div className="space-y-4 font-mono text-xs">
        {visibleSettings.map((item) => {
          const IconComponent = item.icon;
          const isEnabled = !!notificationSettings[item.key];

          return (
            <div
              key={item.key}
              className={`flex items-center justify-between p-3 border rounded-lg ${theme === "dark" ? "bg-black/20 border-white/5" : "bg-white/50 border-slate-200"}`}
            >
              <div className="flex items-center gap-2">
                <IconComponent
                  className={`w-4 h-4 ${theme === "dark" ? item.colorDark : item.colorLight}`}
                />
                <span
                  className={
                    theme === "dark" ? "text-gray-300" : "text-slate-700"
                  }
                >
                  {item.label}
                </span>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                disabled={loading}
                className={toggleClass(isEnabled)}
              >
                <span className={toggleThumbClass(isEnabled)} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

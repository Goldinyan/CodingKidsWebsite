"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { UserData } from "@/BackEnd/type";
import { useNotificationToast } from "@/hooks/useNotificationToast";

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
  userData: UserData;
  updateProfile: (updates: Partial<UserData>) => Promise<void>;
  className?: string;
}

interface SettingItem {
  key: NotificationKey;
  systemLabel: string; // Deutsche Anzeige für Kinder, außer für Admin-Keys
  label: string;
  icon: LucideIcon;
  roles: string[];
}

const SETTINGS_CONFIG: SettingItem[] = [
  {
    key: "newEvent",
    systemLabel: "Neues_Event",
    label: "Neue Events",
    icon: Bell,
    roles: ["user", "member", "mentor", "admin"],
  },
  {
    key: "kicked",
    systemLabel: "Event_Verlassen",
    label: "Aus Event entfernt",
    icon: AlertCircle,
    roles: ["user", "member"],
  },
  {
    key: "queueToUser",
    systemLabel: "Warteschlange_Update",
    label: "Warteschlange aktualisiert",
    icon: Users,
    roles: ["user", "member"],
  },
  {
    key: "understaffedWarning",
    systemLabel: "understaffedWarning", // Bleibt englisch für Mentoren/Admins
    label: "Personalbestand niedrig",
    icon: AlertTriangle,
    roles: ["mentor", "admin"],
  },
  {
    key: "logs",
    systemLabel: "logs", // Bleibt englisch für Admins
    label: "System-Logs",
    icon: BookOpen,
    roles: ["admin"],
  },
  {
    key: "systemAlerts",
    systemLabel: "systemAlerts", // Bleibt englisch für Admins
    label: "System-Warnungen",
    icon: AlertTriangle,
    roles: ["admin"],
  },
];

export default function NotificationSettings({
  userData,
  updateProfile,
  className = "",
}: NotificationSettingsProps) {
  const { theme, isRounded } = useTheme();
  const { showErrorToast } = useNotificationToast();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";
  const switchRoundedClass = isRounded ? "rounded-full" : "rounded-none";

  const [loading, setLoading] = useState(false);
  const [localSettings, setLocalSettings] = useState(userData.settings);

  const notificationSettings = localSettings.notifications as Record<
    string,
    boolean
  >;

  const handleToggle = async (settingKey: NotificationKey) => {
    if (loading) return;
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
        settings: newSettings as any,
      });
    } catch (error) {
      showErrorToast(error);
      setLocalSettings(userData.settings);
    } finally {
      setLoading(false);
    }
  };

  const toggleClass = (isEnabled: boolean) => `
    relative inline-flex h-5 w-9 items-center transition-all duration-150 cursor-pointer ${switchRoundedClass} ${isEnabled
      ? theme === "dark"
        ? "bg-zinc-100 border-zinc-100"
        : "bg-zinc-900 border-zinc-900"
      : theme === "dark"
        ? "bg-zinc-950/60 border-zinc-900"
        : "bg-slate-200 border-slate-300"
    } border
  `;

  const toggleThumbClass = (isEnabled: boolean) => `
    inline-block h-3 w-3 transform transition-transform duration-150 ${switchRoundedClass} ${isEnabled
      ? `translate-x-5 ${theme === "dark" ? "bg-zinc-950" : "bg-white"}`
      : `translate-x-1 ${theme === "dark" ? "bg-zinc-700" : "bg-slate-400"}`
    }
  `;

  const visibleSettings = SETTINGS_CONFIG.filter((item) =>
    item.roles.includes(userData.role),
  );

  return (
    <div
      className={`w-full p-6 border transition-all duration-150 flex flex-col gap-5 ${roundedClass} ${className} ${theme === "dark"
          ? "bg-[rgba(255,255,255,0.02)] border-zinc-800"
          : "bg-slate-50 border-slate-300"
        }`}
    >
      <div className="flex flex-col gap-1">
        <span
          className={`block font-mono text-[10px] font-bold tracking-widest uppercase ${theme === "dark" ? "text-green-500" : "text-green-400"
            }`}
        >
          Benachrichtigungen
        </span>
        <p
          className={`text-xxs font-sans ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
            }`}
        >
          Wähle aus, bei welchen Ereignissen du System-Benachrichtigungen
          erhalten möchtest.
        </p>
      </div>

      <div className="flex flex-col gap-2 font-mono text-xs">
        {visibleSettings.map((item) => {
          const IconComponent = item.icon;
          const isEnabled = !!notificationSettings[item.key];

          return (
            <div
              key={item.key}
              className={`flex items-center justify-between p-4 border transition-colors duration-150 ${innerRoundedClass} ${theme === "dark"
                  ? "bg-zinc-950/40 border-zinc-900"
                  : "bg-white border-slate-200"
                }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <IconComponent
                    className={`w-3.5 h-3.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                      }`}
                  />
                  <span
                    className={`text-[10px] uppercase font-sans tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                      }`}
                  >
                    {item.systemLabel}
                  </span>
                </div>
                <p
                  className={`text-xs font-sans font-medium ${theme === "dark" ? "text-zinc-300" : "text-slate-800"
                    }`}
                >
                  {item.label}
                </p>
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

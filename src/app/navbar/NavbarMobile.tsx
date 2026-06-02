"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/BackEnd/AuthContext";
import {
  ArrowRight,
  Home,
  GraduationCap,
  Users,
  HeartHandshakeIcon,
  User,
  LayoutDashboard,
  MessageCircle,
  LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { getAllAnnouncements, getUserData } from "@/lib/db";
import { UserData } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";

interface NavbarMobileProps {
  setOpen: (open: boolean) => void;
}

export default function NavbarMobile({ setOpen }: NavbarMobileProps) {
  useViewportHeight();
  const router = useRouter();
  const { user, userRole } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const data = await getUserData(user.uid);

      if (data) {
        setUserData(data);
      }
      const announcements = await getAllAnnouncements(user.uid, userRole);
      const unread = announcements.filter(
        (announcement) =>
          !announcement.readBy || !announcement.readBy.includes(user.uid),
      ).length;
      setUnreadMessages(unread);
      console.log("Unread messages:", unread);
    };

    fetchData();
  }, [user, userRole]);

  return (
    <div
      className={`mt-5 w-full h-full overflow-hidden border-t transition-colors duration-300 ${theme === "dark"
        ? "bg-black border-white/10"
        : "bg-base-white border-slate-200"
      }`}
      style={{ height: "calc(var(--vh) * 100)" }}
    >
      <div className="w-full h-full shadow-md z-40">
        <div
          className={`w-full transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div
            className="flex flex-col w-full gap-6"
            style={{ height: "calc(var(--vh) * 100)" }}
          >
            <div className="flex flex-col gap-4 px-4 pt-3 w-full">
              {(() => {
                const items: {
                  label: string;
                  href: string;
                  Icon: LucideIcon;
                }[] = [
                    { label: "Startseite", href: "/", Icon: Home },
                    { label: "Kurse", href: "/termine", Icon: GraduationCap },
                    { label: "Über uns", href: "/verein", Icon: Users },
                    {
                      label: "Spenden",
                      href: "/spenden",
                      Icon: HeartHandshakeIcon,
                    },
                    { label: "Kontakt", href: "/kontakt", Icon: MessageCircle },
                  ];

                if (user)
                  items.push({
                    label: "Profile",
                    href: "/profile",
                    Icon: User,
                  });
                if (userData?.role === "admin")
                  items.push({
                    label: "Dashboard",
                    href: "/dashboard",
                    Icon: LayoutDashboard,
                  });

                return items.map((it) => {
                  return (
                    <motion.div
                      key={it.href}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`flex w-full items-center px-3 py-3 border transition-all duration-200 cursor-pointer group ${theme === "dark"
                        ? "border-white/10 hover:bg-white/5 hover:border-white/20"
                        : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                      onClick={() => {
                        router.push(it.href);
                        setOpen(false);
                      }}
                    >
                      <div className="relative mr-4">
                        <it.Icon
                          className={`h-5 w-5 transition-colors ${theme === "dark"
                            ? "text-gray-400 group-hover:text-white"
                            : "text-slate-500 group-hover:text-slate-900"
                          }`}
                        />
                        {it.label === "Kontakt" && unreadMessages > 0 && (
                          <span className={`absolute rounded-full -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 scale-70 ${theme === "dark"
                            ? "bg-base-white text-black"
                            : "bg-green-600 text-white"
                          }`}>
                            {unreadMessages > 99 ? "99+" : unreadMessages}
                          </span>
                        )}
                      </div>

                      <p
                        className={`font-medium transition-colors ${theme === "dark"
                          ? "text-white group-hover:text-gray-300"
                          : "text-slate-900 group-hover:text-slate-700"
                        }`}
                      >
                        {it.label}
                      </p>

                      <ArrowRight
                        className={`ml-auto h-5 w-5 transition-all group-hover:translate-x-1 ${theme === "dark"
                          ? "text-gray-600 group-hover:text-gray-400"
                          : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                    </motion.div>
                  );
                });
              })()}
            </div>
            <span
              className={`w-full h-px transition-colors ${theme === "dark" ? "bg-white/10" : "bg-slate-200"
              }`}
              style={{ marginTop: "calc(var(--vh) * 6)" }}
            ></span>

            <div className="flex flex-row justify-around px-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className={`text-xs transition-colors ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}>Ort</p>
                <p className={`text-xs transition-colors ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}>Blog</p>
                <p className={`text-xs transition-colors ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}>DSGVO</p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <p className={`text-xs transition-colors ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}>Cookie Settings</p>
                <p className={`text-xs transition-colors ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}>Impressum</p>
                <p className={`text-xs transition-colors ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}>AGB/Widerruf</p>
              </div>
            </div>

            {!user && (
              <div className="flex flex-col px-5 pt-6 gap-4">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={() => {
                    router.push("/login");
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-3 font-medium border transition-all duration-200 flex items-center justify-center gap-2 group ${theme === "dark"
                    ? "bg-base-white text-black border-base-white hover:bg-gray-100"
                    : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={() => {
                    router.push("/login");
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-3 font-medium border transition-all duration-200 ${theme === "dark"
                    ? "bg-transparent text-white border-gray-400 hover:border-white hover:bg-white/10"
                    : "bg-transparent text-slate-900 border-slate-400 hover:border-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Log in
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

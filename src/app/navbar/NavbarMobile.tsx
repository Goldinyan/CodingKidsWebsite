"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import { getAllAnnouncements } from "@/lib/db";
import { useTheme } from "@/context/ThemeContext";

interface NavbarMobileProps {
  setOpen: (open: boolean) => void;
}

export default function NavbarMobile({ setOpen }: NavbarMobileProps) {
  useViewportHeight();
  const router = useRouter();
  const { user, userData, userRole } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { theme } = useTheme();

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const currentKey = `${user.uid}-${userRole}`;
    if (hasFetched.current === currentKey) return;

    const fetchData = async () => {
      hasFetched.current = currentKey;
      try {
        const announcements = await getAllAnnouncements(user.uid, userRole);
        const unread = announcements.filter(
          (announcement) =>
            !announcement.readBy || !announcement.readBy.includes(user.uid),
        ).length;
        setUnreadMessages(unread);
      } catch (error) {
        console.error("Fehler beim Laden der Benachrichtigungen:", error);
      }
    };

    fetchData();
  }, [user?.uid, userRole]);

  const navItems = useMemo(() => {
    const items: { label: string; href: string; Icon: LucideIcon }[] = [
      { label: "Startseite", href: "/", Icon: Home },
      { label: "Kurse", href: "/termine", Icon: GraduationCap },
      { label: "Über uns", href: "/verein", Icon: Users },
      { label: "Spenden", href: "/spenden", Icon: HeartHandshakeIcon },
      { label: "Kontakt", href: "/kontakt", Icon: MessageCircle },
    ];

    if (user) {
      items.push({ label: "Profil", href: "/profile", Icon: User });
    }
    if (userData?.role === "admin") {
      items.push({
        label: "Dashboard",
        href: "/dashboard",
        Icon: LayoutDashboard,
      });
    }

    return items;
  }, [user, userData?.role]);

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <div
      className={`w-full flex flex-col justify-between overflow-y-auto border-t transition-colors duration-300 ${theme === "dark"
          ? "bg-black border-white/10"
          : "bg-white border-slate-200"
        }`}
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <div className="flex flex-col w-full gap-6 px-4 pt-5 pb-4">
        <div className="flex flex-col gap-3 w-full">
          {navItems.map((it) => (
            <motion.div
              key={it.href}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`flex w-full items-center px-4 py-3.5 border rounded-xl transition-all duration-200 cursor-pointer group ${theme === "dark"
                  ? "border-white/05 bg-white/[0.02] hover:bg-white/5 hover:border-white/15"
                  : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                }`}
              onClick={() => handleNavigation(it.href)}
            >
              <div className="relative mr-4 flex items-center justify-center">
                <it.Icon
                  className={`h-5 w-5 transition-colors ${theme === "dark"
                      ? "text-zinc-400 group-hover:text-white"
                      : "text-slate-500 group-hover:text-slate-900"
                    }`}
                />
                {it.label === "Kontakt" && unreadMessages > 0 && (
                  <span
                    className={`absolute rounded-full -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center ${theme === "dark"
                        ? "bg-white text-black"
                        : "bg-emerald-600 text-white"
                      }`}
                  >
                    {unreadMessages > 99 ? "99+" : unreadMessages}
                  </span>
                )}
              </div>

              <span
                className={`font-semibold text-sm transition-colors ${theme === "dark"
                    ? "text-zinc-200 group-hover:text-white"
                    : "text-slate-800 group-hover:text-slate-950"
                  }`}
              >
                {it.label}
              </span>

              <ArrowRight
                className={`ml-auto h-4 w-4 transition-all group-hover:translate-x-1 ${theme === "dark"
                    ? "text-zinc-600 group-hover:text-zinc-400"
                    : "text-slate-300 group-hover:text-slate-500"
                  }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div
        className={`mb-10 flex flex-col gap-6 px-4 pb-8 pt-4 border-t ${theme === "dark"
            ? "border-white/05 bg-zinc-950/30"
            : "border-slate-100 bg-slate-50/30"
          }`}
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-center max-w-sm mx-auto w-full">
          {["Datenschutz", "Impressum"].map((text) => (
            <button
              key={text}
              type="button"
              onClick={() =>
                handleNavigation(
                  `/${text.toLowerCase().replace(/[^a-z0-h]/g, "")}`,
                )
              }
              className={`text-xs py-1 transition-colors hover:underline ${theme === "dark"
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {text}
            </button>
          ))}
        </div>

        {!user && (
          <div className="flex flex-col gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation("/login")}
              className={`w-full px-4 py-3 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group ${theme === "dark"
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation("/login")}
              className={`w-full px-4 py-3 font-bold text-sm rounded-xl border transition-all duration-200 ${theme === "dark"
                  ? "bg-transparent text-white border-zinc-700 hover:border-white hover:bg-white/05"
                  : "bg-transparent text-slate-900 border-slate-300 hover:border-slate-900 hover:bg-slate-50"
                }`}
            >
              Log in
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

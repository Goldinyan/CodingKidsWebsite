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
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { getAllAnnouncements, getUserData } from "@/lib/db";
import { UserData } from "@/BackEnd/type";

interface NavbarMobileProps {
  setOpen: (open: boolean) => void;
}

export default function NavbarMobile({ setOpen }: NavbarMobileProps) {
  useViewportHeight();
  const router = useRouter();
  const { user, userRole } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

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
      className="w-full h-full overflow-hidden bg-black border-t border-white/10"
      style={{ height: "calc(var(--vh) * 100)" }}
    >
      <div className="w-full h-full shadow-md z-40">
        <div className="bg-black w-full">
          <div
            className="flex flex-col w-full gap-6"
            style={{ height: "calc(var(--vh) * 100)" }}
          >
            <div className="flex flex-col gap-6 px-4 pt-5 w-full">
              {(() => {
                const items: { label: string; href: string; Icon: LucideIcon }[] = [
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
                    <div
                      key={it.href}
                      className="flex w-full items-center px-3 py-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer group"
                      onClick={() => {
                        router.push(it.href);
                        setOpen(false);
                      }}
                    >
                      <div className="relative mr-4">
                        <it.Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                        {it.label === "Kontakt" && unreadMessages > 0 && (
                          <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 scale-70 rounded-full">
                            {unreadMessages > 99 ? "99+" : unreadMessages}
                          </span>
                        )}
                      </div>

                      <p className="font-medium text-white group-hover:text-gray-300 transition-colors">
                        {it.label}
                      </p>

                      <ArrowRight className="ml-auto h-5 w-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                  );
                });
              })()}
            </div>
            <span
              className="w-full h-px bg-white/10"
              style={{ marginTop: "calc(var(--vh) * 6)" }}
            ></span>

            <div className="flex flex-row justify-around px-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-gray-500 text-xs">Ort</p>
                <p className="text-gray-500 text-xs">Blog</p>
                <p className="text-gray-500 text-xs">DSGVO</p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-gray-500 text-xs">Cookie Settings</p>
                <p className="text-gray-500 text-xs">Impressum</p>
                <p className="text-gray-500 text-xs">AGB/Widerruf</p>
              </div>
            </div>

            {!user ? (
              <div className="flex flex-col px-5 pt-6 gap-4">
                <button
                  onClick={() => {
                    router.push("/login");
                    setOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    router.push("/login");
                    setOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-transparent text-white font-medium border border-gray-400 hover:border-white hover:bg-white/10 transition-all duration-200"
                >
                  Log in
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { useAuth } from "@/BackEnd/AuthContext";
import { User, LogIn, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Menu, X, LayoutDashboard, HeartHandshakeIcon } from "lucide-react";
import NavbarMobile from "./NavbarMobile";
import { getAllAnnouncements, getUserData } from "@/lib/db";
import { UserData } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, userRole } = useAuth();
  const [userData, setUserData] = useState<null | UserData>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const router = useRouter();
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isMobile = useIsMobile();

  return (
    <div
      className={`w-full  ${theme == "dark" ? "bg-black" : "bg-base-white"} backdrop-blur-sm border-b-2 border-white/10`}
    >
      <div className="w-full h-16 pt-5 md:pt-0">
        <div className="w-full flex items-center pr-5 pl-5">
          <div className="flex-row items-center gap-3 hidden md:flex">
            <img
              src="Logo_aussen_Transparent.png"
              className="w-14 h-14 p-1 mt-1"
            />
            <p
              onClick={() => router.push("/")}
              className={`${theme == "dark" ? "text-white" : "text-black"} font-bold hidden cursor-pointer lg:flex -white text-sm transition-colors`}
            >
              Coding Kids Niederrhein
            </p>
          </div>

          <div className="flex-row items-center gap-3 ml-auto hidden md:flex">
            {/* they normally have a  borderg-gray-400 */}
            <button
              onClick={() => router.push("/spenden")}
              className={`${theme == "dark"
                  ? "text-white hover:bg-base-white/10 border-gray-400 hover:border-white"
                  : "text-black border-gray-400 hover:border-black hover:bg-black/10"
                } 
px-4 py-2 font-medium transition-all duration-200 active:scale-100 flex items-center gap-2`}
            >
              {isMobile ? (
                <HeartHandshakeIcon className="w-5 h-5" />
              ) : (
                <p>Spenden</p>
              )}
            </button>
            {user && (
              <div className="relative">
                <button
                  onClick={() => router.push("/kontakt")}
                  className={` ${theme == "dark"
                      ? "text-gray-300 hover:text-white hover:bg-white/10 hover:border-white border-gray-400"
                      : "text-gray-900 hover:text-black hover:bg-black/10 hover:border-black border-gray-800"
                    } 

                  p-2 border transition-all duration-200`}
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                {unreadMessages > 0 && (
                  <span
                    className={`${theme == "dark" ? " bg-white text-black" : " bg-black text-white"} absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 scale-75 rounded-full`}
                  >
                    {unreadMessages}
                  </span>
                )}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => router.push(user ? "/profile" : "/login")}
                className={` ${theme == "dark"
                    ? "text-gray-300 hover:text-white hover:bg-white/10 hover:border-white border-gray-400"
                    : "text-gray-900 hover:text-black hover:bg-black/10 hover:border-black border-gray-800"
                  } 

                  p-2 border transition-all duration-200`}
              >
                {!user ? (
                  <LogIn className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
            </div>

            {userData?.role === "admin" && (
              <button
                onClick={() => router.push("/dashboard")}
                className={` ${theme == "dark"
                    ? "text-gray-300 hover:text-white hover:bg-white/10 hover:border-white border-gray-400"
                    : "text-gray-900 hover:text-black hover:bg-black/10 hover:border-black border-gray-800"
                  } 

                  p-2 border transition-all duration-200`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="hidden md:flex gap-6">
              <p
                className={`${theme == "dark"
                    ? "text-white hover:text-white hover:bg-base-white/10 border-gray-400 hover:border-white"
                    : "text-black hover:text-black border-gray-400 hover:border-black hover:bg-black/10"
                  } 
px-4 py-2 font-medium transition-all duration-200 active:scale-100 flex items-center gap-2`}
                onClick={() => router.push("/")}
              >
                Startseite
              </p>
              <p
                className={`${theme == "dark"
                    ? "text-white hover:text-white hover:bg-base-white/10 border-gray-400 hover:border-white"
                    : "text-black hover:text-black border-gray-400 hover:border-black hover:bg-black/10"
                  } 
px-4 py-2 font-medium transition-all duration-200 active:scale-100 flex items-center gap-2`}
                onClick={() => router.push("/termine")}
              >
                Kurse
              </p>
              <p
                className={`${theme == "dark"
                    ? "text-white hover:text-white hover:bg-base-white/10 border-gray-400 hover:border-white"
                    : "text-black hover:text-black border-gray-400 hover:border-black hover:bg-black/10"
                  } 
px-4 py-2 font-medium transition-all duration-200 active:scale-100 flex items-center gap-2`}
                onClick={() => router.push("/verein")}
              >
                Über uns
              </p>
              {!user && (
                <p
                  className="font-bold text-white hover:text-gray-300 transition-colors cursor-pointer"
                  onClick={() => router.push("/kontakt")}
                >
                  Kontakt
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full h-full md:hidden">
          <div className="flex flex-row justify-between items-center w-full">
            <p className="text-white font-bold pl-6">Coding Kids Niederrhein</p>
            <button
              onClick={() => setOpen(!open)}
              className="focus:outline-none transition-all pr-6 text-white"
            >
              {!open ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </button>
          </div>
          <div className="transition-all duration-300">
            {open && <NavbarMobile setOpen={setOpen} />}
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, userRole } = useAuth();
  const [userData, setUserData] = useState<null | UserData>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const router = useRouter();

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
    <div className="w-full bg-black backdrop-blur-sm border-b-2 border-white/10">
      <div className="w-full h-16 pt-5 md:pt-0">
        <div className="w-full flex items-center pr-5 pl-5">
          <div className="flex-row items-center gap-3 hidden md:flex">
            <img
              src="Logo_aussen_Transparent.png"
              className="w-14 h-14 p-1 mt-1"
            />
            <p
              onClick={() => router.push("/")}
              className="font-bold hidden cursor-pointer lg:flex text-white text-sm hover:text-gray-300 transition-colors"
            >
              Coding Kids Niederrhein
            </p>
          </div>

          <div className="flex-row items-center gap-3 ml-auto hidden md:flex">
            {/* they normally have a  borderg-gray-400 */}
            <button
              onClick={() => router.push("/spenden")}
              className="px-4 py-2 text-white font-medium border-gray-400 hover:border-white hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-100 flex items-center gap-2"
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
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 border border-gray-400 hover:border-white transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold px-1.5 py-0.5 scale-75 rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => router.push(user ? "/profile" : "/login")}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 border border-gray-400 hover:border-white transition-all duration-200"
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
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 border border-gray-400 hover:border-white transition-all duration-200"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex gap-6">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      className="font-bold text-white hover:text-gray-300 transition-colors"
                      href="/"
                    >
                      Startseite
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <p
                      className="font-bold text-white hover:text-gray-300 transition-colors cursor-pointer"
                      onClick={() => router.push("/termine")}
                    >
                      Kurse
                    </p>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <p
                      className="font-bold text-white hover:text-gray-300 transition-colors cursor-pointer"
                      onClick={() => router.push("/verein")}
                    >
                      Über uns
                    </p>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    {!user && (
                      <p
                        className="font-bold text-white hover:text-gray-300 transition-colors cursor-pointer"
                        onClick={() => router.push("/kontakt")}
                      >
                        Kontakt
                      </p>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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

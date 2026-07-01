"use client";
import Image from "next/image";
import logoTransparent from "@/public/Logo_aussen_Transparent.png";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAuth } from "@/BackEnd/AuthContext";
import { User, LogIn, MessageCircle, Contact, Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Menu, X, LayoutDashboard, HeartHandshakeIcon } from "lucide-react";
import NavbarMobile from "./NavbarMobile";
import { getAllAnnouncements } from "@/lib/db";
import { useTheme, Theme } from "@/context/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, userRole, userData, loading } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const router = useRouter();
  const { theme, isRounded } = useTheme();

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.uid || loading) return;

    const currentKey = `${user.uid}-${userRole}`;
    if (hasFetched.current === currentKey) return;

    const fetchData = async () => {
      hasFetched.current = currentKey;
      const announcements = await getAllAnnouncements(user.uid, userRole);
      const unread = announcements.filter(
        (announcement) =>
          (!announcement.readBy || !announcement.readBy.includes(user.uid)) &&
          announcement.author !== user.uid,
      ).length;
      setUnreadMessages(unread);
    };

    fetchData();
  }, [user?.uid, userRole, loading]);

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
      className={`w-full fixed top-0 left-0 z-50 border-b transition-all duration-300 backdrop-blur-xl ${theme === "dark"
          ? "bg-black/20 border-white/10"
          : "bg-white/40 border-slate-200/80"
        }`}
    >
      {" "}
      <div className="max-w-7xl mx-auto flex  justify-center items-center h-12 pt-5 md:pt-0">
        <div className="w-full flex items-center pr-5 pl-5">
          <div className="flex-row items-center gap-1 hidden md:flex">
            <Image src={logoTransparent} alt="Logo" className="w-10 h-10 p-1" />
            <div className="flex flex-col ">
              <p
                onClick={() => router.push("/")}
                className={`${theme == "dark" ? "text-white" : "text-black"} font-bold hidden cursor-pointer lg:flex -white text-[12px] transition-colors`}
              >
                Coding Kids
              </p>
              <p
                style={{ color: "#9da2ab" }}
                className={`font-thin hidden cursor-pointer lg:flex  text-[12px] transition-colors`}
              >
                Niederrhein
              </p>
            </div>
          </div>

          <div className="flex-row items-center gap-3 ml-auto hidden md:flex">
            {/*
            <button
              onClick={() => router.push("/spenden")}
              className={` ${theme == "dark"
                  ? "text-gray-300 hover:text-white hover:bg-white/10 hover:border-white border-gray-400"
                  : "text-gray-900 hover:text-black hover:bg-black/10 hover:border-black border-gray-800"
                } 

                  p-2 border transition-all duration-200`}
            >
              <HeartHandshakeIcon className="w-5 h-5" />
            </button>*/}
            {user && (
              <div className="relative">
                <button
                  onClick={() => router.push("/kontakt")}
                  className={` ${isRounded ? "rounded-md" : "rounded-none"} ${theme == "dark"
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-900 hover:text-black hover:bg-black/10"
                    } 

                  p-2 transition-all duration-200`}
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

            {!user && (
              <p
                className={`font-medium text-[12px] transition-colors cursor-pointer ${theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-black hover:text-slate-600"
                  }`}
                onClick={() => router.push("/kontakt")}
              >
                <Mail className="w-4 h-4 mr-1" />
              </p>
            )}

            <div className="relative">
              <button
                onClick={() => router.push(user ? "/profile" : "/login")}
                className={`ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-bold no-underline transition-all shrink-0 ${user
                    ? `${isRounded ? "rounded-md" : "rounded-none"} ${theme == "dark"
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-900 hover:text-black hover:bg-black/10"
                    } p-2`
                    : "bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5"
                  }`}
              >
                {!user ? <p>Anmelden</p> : <User className="w-5 h-5" />}
              </button>
            </div>

            {userData?.role === "admin" && (
              <button
                onClick={() => router.push("/dashboard")}
                className={`${isRounded ? "rounded-md" : "rounded-none"} ${theme == "dark"
                    ? "text-gray-300 hover:text-white hover:bg-white/10"
                    : "text-gray-900 hover:text-black hover:bg-black/10"
                  } 

                  p-2 transition-all duration-200`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
            )}
          </div>
          <MainHeader theme={theme} router={router} isRounded={isRounded} />
        </div>

        <div className="flex flex-col w-full h-full md:hidden">
          <div className="flex flex-row justify-between items-center w-full">
            <p
              className={`${theme == "dark" ? "text-white" : "text-black"} font-bold pl-6`}
            >
              Coding Kids Niederrhein
            </p>
            <button
              onClick={() => setOpen(!open)}
              className={`${theme == "dark" ? "text-white" : "text-dark"} focus:outline-none transition-all pr-6`}
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
function MainHeader({
  theme,
  router,
  isRounded,
}: {
  theme: Theme;
  router: AppRouterInstance;
  isRounded: boolean;
}) {
  const headers: { title: string; domain: string }[] = [
    {
      title: "Startseite",
      domain: "/",
    },
    {
      title: "Kurse",
      domain: "/termine",
    },
    {
      title: "Über uns",
      domain: "/verein",
    },
  ];

  const pathname = usePathname();

  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <div className="hidden md:flex gap-6 items-center">
        {headers.map((h) => {
          return (
            <p
              key={h.domain}
              className={`px-4 py-2 font-medium transition-all duration-200 active:scale-100 flex items-center gap-2 cursor-pointer text-[14px] font-normal ${isRounded ? "rounded-md" : "rounded-none"
                } ${theme === "dark"
                  ? `text-gray-400 hover:text-white hover:bg-base-white/10`
                  : `text-black hover:bg-black/10 `
                }`}
              onClick={() => router.push(h.domain)}
            >
              {h.title}
            </p>
          );
        })}
      </div>
    </div>
  );
}

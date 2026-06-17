"use client";

import type { UserData } from "@/BackEnd/type";
import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { getUserData } from "@/lib/db";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Users,
  CalendarCheck,
  UserCheck,
  Megaphone,
  User,
  LogOut,
  Home,
  ArrowRight,
  StepBack,
} from "lucide-react";
import UserDashboard from "./UserDashboard";
import EventDashboard from "./EventDashboard";
import MentorDashboard from "./MentorDashboard";
import AnnouncementDashboard from "./AnnouncementDashboard";
import BasicOwnProfileDashboard from "./BasicOwnProfileDashboard";
import CourseDashboard from "./CourseDashboard";
import { useTheme } from "@/context/ThemeContext";

export function MainOverlayAdminDashboard() {
  const [open, setOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();
  const [activeSection, setActiveSection] = useState<string>("");
  const { theme } = useTheme();

  const isInSection = (id: string): boolean => {
    const el = document.getElementById(id);
    if (!el) return false;

    const rect = el.getBoundingClientRect();

    // sichtbar wenn in view port
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    return inView;
  };

  useEffect(() => {
    const handleScroll = () => {
      for (const s of sections) {
        if (isInSection(s.id)) {
          setActiveSection(s.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // direkt beim Laden checken

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const { user, loading } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sections = [
    { id: "user", label: "Nutzerverwaltung", icon: Users },
    { id: "events", label: "Eventverwaltung", icon: CalendarCheck },
    { id: "mentor", label: "Mentoren", icon: UserCheck },
    { id: "announce", label: "Ankündigungen", icon: Megaphone },
  ];

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const data = await getUserData(user.uid);

      if (data) {
        setUserData(data);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div
      className={`flex flex-col ${theme == "dark" ? "bg-dark" : "bg-otherbg"} min-h-screen pb-20`}
    >
      {userData?.role === "admin" ? (
        <div>
          <div
            className={`fixed ${theme == "dark" ? "bg-black text-white border-b border-base-white/15" : "bg-white text-black"} top-0 left-0 right-0 h-16 z-50 flex items-center justify-between shadow px-4`}
          >
            <p
              className={`text-2xl pl-2 font-bold ${theme == "dark" ? "text-white" : "text-black"}`}
            >
              Coding Kids
            </p>
            <div className="md:hidden ">
              {!open ? (
                <Menu
                  onClick={() => setOpen(!open)}
                  className={`w-6 h-6 ${theme == "dark" ? "text-white" : "text-black"}`}
                />
              ) : (
                <X
                  onClick={() => setOpen(!open)}
                  className={`w-6 h-6 ${theme == "dark" ? "text-white" : "text-black"}`}
                />
              )}
            </div>
          </div>

          <div className="flex pt-12">
            <div className="w-64 bg-white hidden md:flex flex-col fixed h-screen border-r border-gray-200">
              <div className="p-6 flex flex-col h-[50%]">
                <div className="my-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Navigation
                  </p>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                  {sections.map((s) => {
                    const Icon = s.icon;
                    const isActive = activeSection === s.id;

                    return (
                      <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className={`group relative w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${isActive
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${isActive
                              ? "bg-blue-600"
                              : "bg-gray-100 group-hover:bg-gray-200"
                            }`}
                        >
                          <Icon
                            className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-gray-600"
                              }`}
                          />
                        </div>

                        <div className="flex-1 text-left">
                          <p
                            className={`text-sm font-medium transition-colors ${isActive
                                ? "text-blue-900"
                                : "text-gray-700 group-hover:text-gray-900"
                              }`}
                          >
                            {s.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-6 flex flex-col gap-5 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Konto
                  </p>
                  <button
                    onClick={() => {
                      router.push("/profile");
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center gap-3 group"
                  >
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      Profil
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      router.push("/");
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center gap-3 group"
                  >
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <Home className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      Zur Hauptseite
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div
              className={` ${theme == "dark" ? "" : ""} flex-1 pt-10 w-full px-6 md:ml-64 ${open ? "hidden" : "flex"
                }`}
            >
              <div className="flex flex-col w-full gap-10 max-w-7xl mx-auto">
                <section id="user">
                  <UserDashboard />
                </section>
                <section id="events">
                  <EventDashboard />
                </section>
                <section id="courses">
                  <CourseDashboard />
                </section>
                <section id="mentor">
                  <MentorDashboard />
                </section>
                <section id="announce">
                  <AnnouncementDashboard />
                </section>
              </div>
            </div>

            {open && (
              <div className="flex flex-col md:hidden items-start pl-4 pt-20 w-full  ">
                <p className="text-md pl-2 pb-4 pt-4">Hauptmenü</p>
                <div className="bg-white border-lightborder  border-2 rounded-2xl w-70 2:w-85 3:w-100  sm:w-120 flex flex-col gap-4 pt-4 divide-y divide-gray-200">
                  <div
                    onClick={() => {
                      document
                        .getElementById("user")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setOpen(!open);
                    }}
                    className={`flex items-center gap-5  pb-4 px-4 `}
                  >
                    <div className="bg-lightPinkBg p-1.5 rounded-md">
                      <Users className="text-primaryOwn h-5 w-5" />
                    </div>

                    <p className="text-black  text-lg">Nutzerverwaltung</p>
                    <ArrowRight className="h-5 ml-auto text-graytext" />
                  </div>

                  <div
                    onClick={() => {
                      document
                        .getElementById("events")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setOpen(!open);
                    }}
                    className={`flex items-center gap-5  pb-4 px-4`}
                  >
                    <div className="bg-lightPinkBg p-1.5 rounded-md">
                      <CalendarCheck className="text-primaryOwn h-5 w-5" />
                    </div>

                    <p className="text-black  text-lg">Eventverwaltung</p>
                    <ArrowRight className="h-5 ml-auto text-graytext" />
                  </div>

                  <div
                    onClick={() => {
                      document
                        .getElementById("mentor")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setOpen(!open);
                    }}
                    className={`flex items-center gap-5  pb-4 px-4 `}
                  >
                    <div className="bg-lightGreenBg p-1.5 rounded-md">
                      <UserCheck className="text-green h-5 w-5" />
                    </div>

                    <p className="text-black  text-lg">Mentoren</p>
                    <ArrowRight className="h-5 ml-auto text-graytext" />
                  </div>

                  <div
                    onClick={() => {
                      document
                        .getElementById("announce")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setOpen(!open);
                    }}
                    className={`flex items-center gap-5  pb-4 px-4`}
                  >
                    <div className="bg-lightGreenBg p-1.5 rounded-md">
                      <Megaphone className="text-green h-5 w-5" />
                    </div>

                    <p className="text-black  text-lg">Ankündigungen</p>
                    <ArrowRight className="h-5 ml-auto text-graytext" />
                  </div>
                </div>

                <p className="text-md pl-2 mt-5">Profil</p>

                <div className="bg-white border-lightborder border-2 rounded-2xl w-70 2:w-85 3:w-100 sm:w-120  flex flex-col gap-4 mt-5 pt-4 divide-y divide-gray-200">
                  <div className={`flex items-center gap-5  pb-4 px-4`}>
                    <div className="bg-gray-200 p-1.5 rounded-md">
                      <User className="text-black h-5 w-5" />
                    </div>

                    <p className="text-black  text-lg">Profile</p>
                    <ArrowRight className="h-5 ml-auto text-graytext" />
                  </div>

                  <div className={`flex items-center gap-5  pb-4 px-4`}>
                    <div className="bg-blue-100 p-1.5 rounded-md">
                      <StepBack className="text-blue-700 h-5 w-5" />
                    </div>

                    <p className="text-black  text-lg">Zur Übersicht</p>
                    <ArrowRight className="h-5 ml-auto text-graytext" />
                  </div>

                  <div className={`flex items-center gap-5  pb-4 px-4`}>
                    <div className="bg-lightRedBg p-1.5 rounded-md">
                      <LogOut className="text-red-500 h-5 w-5" />
                    </div>

                    <p className="text-black  text-lg">Log Out</p>
                    <ArrowRight className="h-5 ml-auto text-graytext" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <BasicOwnProfileDashboard />
      )}
    </div>
  );
}

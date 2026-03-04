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
  ArrowRight,
  StepBack,
} from "lucide-react";
import UserDashboard from "./UserDashboard";
import EventDashboard from "./EventDashboard";
import MentorDashboard from "./MentorDashboard";
import AnnouncementDashboard from "./AnnouncementDashboard";
import BasicOwnProfileDashboard from "./BasicOwnProfileDashboard";

export function MainOverlayAdminDashboard() {
  const [open, setOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();

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

  const router = useRouter();

  console.log("MainOverlayAdminDashboard");

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
    <div className="flex flex-col  bg-otherbg min-h-screen pb-20">
      {userData?.role === "Admin" ? (
        <div>
          <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 flex items-center justify-between shadow px-4">
            <p className="text-2xl pl-2 text-black font-bold ">Coding Kids</p>
            <div className="md:hidden ">
              {!open ? (
                <Menu
                  onClick={() => setOpen(!open)}
                  className="w-6 h-6 text-black"
                />
              ) : (
                <X
                  onClick={() => setOpen(!open)}
                  className="w-6 h-6 text-black"
                />
              )}
            </div>
          </div>

          <div className="flex ">
            <div className="w-64 bg-white border-l p-6 flex-col hidden md:flex">
              <p className="text-lg font-semibold mb-2">Sidebar</p>
              <ul className="space-y-2">
                <li>
                  <a className="text-secondaryOwn hover:underline">
                    Einstellung 1
                  </a>
                </li>
                <li>
                  <a className="text-secondaryOwn hover:underline">
                    Einstellung 2
                  </a>
                </li>
              </ul>
            </div>

            <div
              className={`grid grid-cols-1 xl:grid-cols-2 pt-20 w-full gap-10 ${open ? "hidden" : "flex"
                }`}
            >
              <section id="user">
                <UserDashboard />
              </section>
              <section id="events">
                <EventDashboard />
              </section>
              <section className="xl:col-span-2" id="mentor">
                <MentorDashboard />
              </section>
              <section id="announce">
                <AnnouncementDashboard />
              </section>
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

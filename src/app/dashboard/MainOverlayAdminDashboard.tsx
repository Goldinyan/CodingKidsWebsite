"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Users,
  CalendarCheck,
  UserCheck,
  Megaphone,
  User,
  Home,
  ArrowRight,
  StepBack,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import SectionCard from "./overlay/SectionCard";
import MainOverlay from "./overlay/MainOverlay";
import { isInSection, scrollToSection } from "./overlay/utils";
import { useScrollSpy } from "./overlay/hooks";

const SECTIONS = [
  //{ id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "user", label: "Nutzerverwaltung", icon: Users },
  { id: "events", label: "Eventverwaltung", icon: CalendarCheck },
  { id: "mentor", label: "Mentoren", icon: UserCheck },
  { id: "announce", label: "Ankündigungen", icon: Megaphone },
];

export function MainOverlayAdminDashboard() {
  const [open, setOpen] = useState<boolean>(false);
  const { theme, isRounded } = useTheme();
  const activeSection = useScrollSpy(SECTIONS, isInSection);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Verhindert das Scrollen des Hintergrunds, wenn das mobile Menü offen ist
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const ACCOUNT_LINKS = [
    {
      label: "Profil",
      mobileLabel: "Profil bearbeiten",
      icon: User,
      onClick: () => router.push("/profile"),
      colorStyles: {
        dark: "bg-zinc-900 text-zinc-100",
        light: "bg-slate-100 text-slate-600",
      },
    },
    {
      label: "Hauptseite",
      mobileLabel: "Zur Übersicht",
      icon: theme === "dark" ? StepBack : Home,
      onClick: () => router.push("/"),
      colorStyles: {
        dark: "bg-cyan-950/60 text-cyan-400",
        light: "bg-cyan-50 text-cyan-600",
      },
    },
  ];

  const containerRadius = isRounded ? "rounded-2xl" : "rounded-none";
  const buttonRadius = isRounded ? "rounded-lg" : "rounded-none";
  const iconRadius = isRounded ? "rounded-md" : "rounded-none";

  const getSectionIconStyles = (id: string) => {
    const colorMap: Record<string, { dark: string; light: string }> = {
      analytics: { dark: "bg-blue-950/60 text-blue-400", light: "bg-blue-50 text-blue-600" },
      user: { dark: "bg-purple-950/60 text-purple-400", light: "bg-purple-50 text-purple-600" },
      events: { dark: "bg-indigo-950/60 text-indigo-400", light: "bg-indigo-50 text-indigo-600" },
      mentor: { dark: "bg-emerald-950/60 text-emerald-400", light: "bg-emerald-50 text-emerald-600" },
      announce: { dark: "bg-amber-950/60 text-amber-400", light: "bg-amber-50 text-amber-600" },
    };
    return colorMap[id] || { dark: "bg-zinc-900 text-white", light: "bg-slate-100 text-slate-600" };
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-slate-50 text-slate-600"
      }`}
    >
      <div
        className={`w-full fixed top-0 left-0 h-12 z-50 border-b transition-all duration-300 backdrop-blur-xl ${
          theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/40 border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-5">
          <div className="flex items-center gap-1">
            <div className="flex flex-col">
              <p
                onClick={() => router.push("/")}
                className={`${
                  theme == "dark" ? "text-white" : "text-black"
                } font-bold cursor-pointer text-[12px] transition-colors`}
              >
                Coding Kids
              </p>
              <p style={{ color: "#9da2ab" }} className="font-thin cursor-pointer text-[12px] transition-colors">
                Niederrhein
              </p>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="p-1 focus:outline-none">
              {open ? <X className="w-6 h-6 text-current" /> : <Menu className="w-6 h-6 text-current" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex pt-12 flex-1">
        <div
          className={`w-64 hidden md:flex flex-col fixed h-[calc(100vh-3rem)] border-r transition-all duration-300 ${
            theme === "dark" ? "bg-black border-zinc-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="p-6 flex flex-col h-full pt-10">
            <div className="my-4">
              <p className={`text-[10px] font-mono tracking-widest uppercase ${theme === "dark" ? "text-zinc-500" : "text-gray-900"}`}>
                Navigation
              </p>
            </div>

            <nav className="flex flex-col gap-1 flex-1 mb-3">
              {SECTIONS.map((s) => (
                <SectionCard
                  key={s.id}
                  id={s.id}
                  Icon={s.icon}
                  label={s.label}
                  isActive={activeSection === s.id}
                  setOpen={setOpen}
                  scrollToSection={scrollToSection}
                />
              ))}
            </nav>

            <div className={`pt-6 flex flex-col gap-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-slate-200"}`}>
              <p className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${theme === "dark" ? "text-zinc-500" : "text-gray-900"}`}>
                Konto & Profil
              </p>

              {ACCOUNT_LINKS.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <button
                    key={idx}
                    onClick={link.onClick}
                    className={`w-full px-4 py-2.5 border transition-all duration-300 flex items-center gap-3 group text-xs font-gro tracking-wider ${buttonRadius} ${
                      theme === "dark"
                        ? "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 p-1.5 transition-colors ${iconRadius} ${
                        theme === "dark"
                          ? "bg-zinc-900 group-hover:bg-zinc-800 text-white"
                          : "bg-slate-100 group-hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`flex-1 -mt-40 w-full md:ml-64 ${open ? "hidden" : "flex"}`}>
          <MainOverlay />
        </div>

        {open && (
          <div className="flex flex-col md:hidden items-start px-4 pt-6 w-full overflow-y-auto max-h-[calc(100vh-3rem)] animate-fade-in pb-10">
            <p className={`text-xs font-mono tracking-widest uppercase pb-3 pt-4 pl-2 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}>
              Hauptmenü
            </p>

            <div
              className={`border w-full max-w-md flex flex-col pt-2 divide-y transition-all duration-300 ${containerRadius} ${
                theme === "dark" ? "bg-black border-zinc-800 divide-zinc-900" : "bg-white border-slate-200 divide-slate-100 shadow-lg"
              }`}
            >
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const iconStyles = getSectionIconStyles(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      document?.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                      setOpen(false);
                    }}
                    className="flex items-center gap-5 py-4 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-900"
                  >
                    <div className={`p-2 transition-colors ${iconRadius} ${theme === "dark" ? iconStyles.dark : iconStyles.light}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className={`text-base font-medium ${theme === "dark" ? "text-zinc-100" : "text-slate-900"}`}>{s.label}</p>
                    <ArrowRight className="h-4 ml-auto opacity-40 text-current" />
                  </div>
                );
              })}
            </div>

            <p className={`text-xs font-mono tracking-widest uppercase pb-3 mt-6 pl-2 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}>
              Profil & Account
            </p>

            <div
              className={`border w-full max-w-md flex flex-col pt-2 divide-y mb-8 transition-all duration-300 ${containerRadius} ${
                theme === "dark" ? "bg-black border-zinc-800 divide-zinc-900" : "bg-white border-slate-200 divide-slate-100 shadow-lg"
              }`}
            >
              {ACCOUNT_LINKS.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      link.onClick();
                      setOpen(false);
                    }}
                    className="flex items-center gap-5 py-4 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-900"
                  >
                    <div className={`p-2 transition-colors ${iconRadius} ${theme === "dark" ? link.colorStyles.dark : link.colorStyles.light}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p
                      className={`text-base font-medium ${
                        link.label === "Log Out"
                          ? theme === "dark" ? "text-rose-400" : "text-rose-600"
                          : theme === "dark" ? "text-zinc-100" : "text-slate-900"
                      }`}
                    >
                      {link.mobileLabel}
                    </p>
                    <ArrowRight className="h-4 ml-auto opacity-40 text-current" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

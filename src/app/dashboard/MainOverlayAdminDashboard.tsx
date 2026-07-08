"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Users,
  CalendarCheck,
  UserCheck,
  Megaphone,
  User,
  Home,
  StepBack,
  Folder,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import SectionCard from "./overlay/SectionCard";
import MainOverlay from "./overlay/MainOverlay";
import { isInSection, scrollToSection } from "./overlay/utils";
import { useScrollSpy } from "./overlay/hooks";

const SECTIONS = [
  { id: "user", label: "Nutzer", icon: Users },
  { id: "events", label: "Event", icon: CalendarCheck },
  { id: "courses", label: "Kurse", icon: Folder},
  { id: "mentor", label: "Mentoren", icon: UserCheck },
  { id: "announce", label: "Ankündigungen", icon: Megaphone },
];

export function MainOverlayAdminDashboard() {
  const [open, setOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const { theme, isRounded } = useTheme();
  const activeSection = useScrollSpy(SECTIONS, isInSection);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 960;
      setIsDesktop(isLarge);
      if (isLarge) setOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  const ACCOUNT_LINKS = [
    {
      label: "Profil",
      icon: User,
      onClick: () => { router.push("/profile"); setOpen(false); },
    },
    {
      label: "Hauptseite",
      icon: theme === "dark" ? StepBack : Home,
      onClick: () => { router.push("/"); setOpen(false); },
    },
  ];

  const isDark = theme === "dark";
  const buttonRadius = isRounded ? "rounded-[8px]" : "rounded-none";
  const iconRadius = isRounded ? "rounded-[6px]" : "rounded-none";

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-200 ${isDark ? "bg-zinc-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      
      <div className={`w-full fixed top-0 left-0 h-12 z-50 border-b backdrop-blur-xl transition-colors duration-200 ${isDark ? "bg-zinc-950/80 border-zinc-900" : "bg-white/80 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-5">
          <div className="flex flex-col select-none cursor-pointer" onClick={() => router.push("/")}>
            <p className={`font-black tracking-tight text-xs uppercase ${isDark ? "text-white" : "text-slate-900"}`}>CODING KIDS</p>
            <p className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">NIEDERRHEIN</p>
          </div>
          {!isDesktop && (
            <button onClick={() => setOpen(!open)} className="p-1 focus:outline-none">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {!isDesktop && open && (
        <div className={`fixed inset-0 top-12 z-40 p-4 ${isDark ? "bg-zinc-950" : "bg-slate-50"}`}>
          <div className="flex flex-col h-full font-['JetBrains_Mono'] max-w-md mx-auto">
            <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-4 mt-4">NAVIGATION</p>
            <div className="flex flex-col gap-1">
              {SECTIONS.map((s) => (
                <SectionCard key={s.id} id={s.id} Icon={s.icon} label={s.label.toUpperCase()} isActive={activeSection === s.id} setOpen={setOpen} scrollToSection={scrollToSection} />
              ))}
            </div>
            
            <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mt-8 mb-4">AUTH</p>
            <div className="flex flex-col gap-2">
              {ACCOUNT_LINKS.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <button key={idx} onClick={link.onClick} className={`w-full px-4 py-3 border flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider ${buttonRadius} ${isDark ? "border-zinc-900 hover:bg-zinc-900 text-zinc-400" : "border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
                    <div className={`p-1.5 ${iconRadius} ${isDark ? "bg-zinc-900" : "bg-slate-200"}`}><Icon className="w-3.5 h-3.5" /></div>
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex pt-12 flex-1 w-full">
        {isDesktop && (
          <div className={`w-50 flex flex-col fixed h-[calc(100vh-3rem)] border-r ${isDark ? "bg-zinc-950 border-zinc-900" : "bg-white border-slate-200"}`}>
            <div className="p-3 flex flex-col h-full pt-8 font-['JetBrains_Mono']">
              <p className={`text-[10px] font-bold tracking-widest uppercase mb-3 pl-1 ${isDark ? "text-zinc-600" : "text-slate-400"}`}>NAVIGATION</p>
              <nav className="flex flex-col gap-1 flex-1">
                {SECTIONS.map((s) => (
                  <SectionCard key={s.id} id={s.id} Icon={s.icon} label={s.label.toUpperCase()} isActive={activeSection === s.id} setOpen={setOpen} scrollToSection={scrollToSection} />
                ))}
              </nav>
              <div className={`pt-6 mb-10 border-t ${isDark ? "border-zinc-900" : "border-slate-200"}`}>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-3 pl-1 ${isDark ? "text-zinc-600" : "text-slate-400"}`}>AUTH</p>
                {ACCOUNT_LINKS.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <button key={idx} onClick={link.onClick} className={`w-full px-4 py-2 border flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider mb-2 ${buttonRadius} ${isDark ? "border-zinc-900 text-zinc-400 hover:bg-zinc-900" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
                      <div className={`p-1.5 ${iconRadius} ${isDark ? "bg-zinc-900" : "bg-slate-100"}`}><Icon className="w-3.5 h-3.5" /></div>
                      {link.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div className={`flex-1 w-full -mt-30 ${isDesktop ? "ml-50" : "ml-0"}`}>
          <MainOverlay />
        </div>
      </div>
    </div>
  );
}

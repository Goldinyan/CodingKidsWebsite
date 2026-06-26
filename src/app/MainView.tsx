"use client";

import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";
import {
  TopView,
  MiddleView,
  FeaturedEventsView,
  FeaturedCoursesView,
  MentorsView,
  CTAView,
} from "./homepage";

export default function MainView() {
  const { user, loading, userData } = useAuth();
  const { theme, isRounded } = useTheme();

  return (
    <div className={`w-full min-h-screen relative main-view-container`}>
      {/*
      <div className="absolute inset-0 bg-grid-pattern   z-0" />*/}
      <div className="fixed inset-0 bg-grid-pattern bg-fixed z-0 pointer-events-none" />

      <div className="relative max-w-7xl flex flex-col mx-auto z-10">
        <TopView data={userData} loading={loading} />
        {/*<MiddleView isRounded={isRounded} />*/}
        <FeaturedEventsView />
        <FeaturedCoursesView isRounded={isRounded} />
        <MentorsView isRounded={isRounded} />
        <CTAView isRounded={isRounded} />
      </div>
    </div>
  );
}

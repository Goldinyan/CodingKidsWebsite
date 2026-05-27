"use client";

import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData } from "@/BackEnd/type";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/db";
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
  const [userData, setUserData] = useState<UserData>();

  const { user, loading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const data = await getUserData(user.uid);

      if (data) {
        setUserData(data);
      }
    };

    fetchData();
  }, [user, loading]);

  return (
    <div className={`w-full min-h-screen relative main-view-container`}>
      <div className="absolute inset-0 bg-grid-pattern   z-0" />
      <div className="relative w-full flex flex-col z-10">
        <TopView data={userData} loading={loading} />
        <MiddleView />
        <FeaturedEventsView />
        <FeaturedCoursesView />
        <MentorsView />
        <CTAView />
      </div>
    </div>
  );
}

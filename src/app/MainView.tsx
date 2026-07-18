"use client";

import {
  TopView,
  MiddleView,
  FeaturedEventsView,
  FeaturedCoursesView,
  MentorsView,
  GlobalAnnouncementsView,
} from "./homepage";

export default function MainView() {
  return (
    <div className={`w-full min-h-screen relative main-view-container `}>
      {/*
      <div className="absolute inset-0 bg-grid-pattern   z-0" />

      <div className="fixed inset-0 bg-grid-pattern bg-fixed z-0 pointer-events-none" />
      */}

      <div className="relative max-w-7xl flex flex-col mx-auto z-10">
        <TopView />
        <MiddleView />
        <FeaturedEventsView />
        <FeaturedCoursesView />
        <GlobalAnnouncementsView />
        <MentorsView />
        {/*<CTAView />*/}
      </div>
    </div>
  );
}

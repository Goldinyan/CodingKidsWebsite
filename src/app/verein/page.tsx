"use client";

import ClubViews from "./ClubView";

export default function Home() {
  return (
    <div className={`w-full min-h-screen relative main-view-container`}>
      {/*<div className="absolute inset-0 bg-grid-pattern   z-0" />*/}
      <div className="relative w-full flex flex-col z-10">
        <ClubViews />
      </div>
    </div>
  );
}

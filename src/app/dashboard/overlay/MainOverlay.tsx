// src/app/dashboard/overlay/MainOverlay.tsx

import UserDashboard from "../UserDashboard";
import EventDashboard from "../EventDashboard";
import MentorDashboard from "../MentorDashboard";
import AnnouncementDashboard from "../AnnouncementDashboard";
import CourseDashboard from "../CourseDashboard";

export default function MainOverlay() {
  return (
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
  );
}

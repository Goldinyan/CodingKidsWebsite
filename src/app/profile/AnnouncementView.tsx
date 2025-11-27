"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData, AnnouncementData, PresetRoles } from "@/BackEnd/type";
import { getAllAnnouncements } from "@/lib/db";
import { TrendingUpDownIcon } from "lucide-react";

const roles: PresetRoles[] = ["Admin", "All", "Member", "Mentor", "User"];

export default function AnnouncementView({ data }: { data: UserData }) {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [filAn, setFilAn] = useState<Record<string, AnnouncementData[]>>({});

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length > 0) {
      const filtered: Record<string, AnnouncementData[]> = {};
      roles.forEach((role) => {
        filtered[role] = announcements.filter((an) => an.tag === role);
      });
      setFilAn(filtered);
    }
  }, [announcements]);

  const hasAccess = (role: string) => {
    switch(data.role){
        case "Admin":
            return true
        case "Mentor":
            if(role === "User" || role === "Member" || role === "Mentor"){
                return true;
            } else {
                return false;
            }
        case "User":
            if(role === "User" || role === "Member"){
                return true;
            } else {
                return false;
            }
        case "Member":
            if(role === "Member" ){
                return true;
            } else {
                return false;
            }
        default: 
            return false;
    }
  }

  return (
    <div>
      <div>
        {Object.entries(filAn).map(([role, anns]) =>
        anns
        .filter((an) => hasAccess(an.tag))
          .map((an) => <div key={an.uid}>{an.title}</div>)
      )}
      </div>
    </div>
  );
}

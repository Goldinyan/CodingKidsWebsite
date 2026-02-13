"use client";

import { useAuth } from "@/BackEnd/AuthContext";
import { useEffect } from "react";
import { getUserData } from "@/lib/db";
import { useState } from "react";
import NoUserKontakt from "./NoUserKontakt";
import AnnouncementView from "./AnnouncementView";
import type { UserData } from "@/BackEnd/type";

export default function Home() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData>();

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-otherbg"><div className="text-graytext">Lädt...</div></div>;
  }

  if (!user) return <NoUserKontakt />;

  return (
    <div className="min-h-screen bg-otherbg">
      <div className="bg-white border-b border-lightborder p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-primaryOwn">Kontakt & Ankündigungen</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userData && <AnnouncementView data={userData} />}
      </div>
    </div>
  );
}

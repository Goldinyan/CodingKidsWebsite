"use client";
import { useState, useEffect } from "react";
import { getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import EventView from "./EventView";

import { UserData } from "@/BackEnd/type";

export default function Home() {
  const [userData, setUserData] = useState<UserData>();
  const { user, loading } = useAuth();
  const [addEventVisible, setAddEventVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const data = await getUserData(user.uid);
        if (!data) return;
        setUserData(data);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <p>Lade...</p>;
  //if (!user) return <p>Kein Benutzer angemeldet</p>;
  //if (!userData) return <p>Benutzerdaten werden geladen...</p>;

  return (
    <div className="flex flex-col ">
      <EventView />
    </div>
  );
}

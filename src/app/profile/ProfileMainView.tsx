"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "./DashBoards";
import { MainOverlayAdminDashboard } from "./AdminDashboard"
import { getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import MentorChangeView from "./MentorChangeView";

export default function ProfileMainView() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);

useEffect(() => {
  const fetchUserData = async () => {
    if (user?.uid) {
      const data = await getUserData(user.uid);
      setUserData(data);
    } else {
      setUserData(null);
    }
  };

  fetchUserData();
}, [user?.uid]);



  if (loading) return <p>Lade...</p>;
  if (!user) return <p>NO USER</p>;
  if (!userData) return <p>Benutzerdaten werden geladen...</p>;

  if (userData.role === "admin") {
    return (
    <div>
      {/* <AdminDashboard /> */}
      <MainOverlayAdminDashboard />
    </div>
    
    );

  }

  return <Dashboard />;
}


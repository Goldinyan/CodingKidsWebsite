"use client";

import { useState, useEffect } from "react";
import { Dashboard, AdminDashboard } from "./DashBoards";
import { getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";

export default function ProfileMainView() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {

      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
        console.log("User Data in ProfileMainView:", data);
      } else {
        setUserData(null);
        console.log("No user logged in");
      }

    };

    fetchUserData();
  }, []);

  if (loading) return <p>Lade...</p>;
  if (!user) return <p>NO USER</p>;
  if (!userData) return <p>Benutzerdaten werden geladen...</p>;

  if (userData.role === "admin") {
    return <AdminDashboard />;
  }

  return <Dashboard />;
}


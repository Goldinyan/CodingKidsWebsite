"use client";

import { useState, useEffect } from "react";
import { Dashboard, AdminDashboard } from "./DashBoards";
import { user } from "@/lib/firebase";
import { getUserData } from "@/lib/db";

export default function ProfileMainView() {
  const [userData, setUserData] = useState<any>(null);



  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    console.log("no user");
    return <p>NO USER</p>;
  }

  if(userData.role === "admin"){
    return (
        <div>
            <AdminDashboard userData={userData} />
        </div>
    )   
  }
  return (
    <div>
        <Dashboard userData={userData} />
    </div>
  )
}

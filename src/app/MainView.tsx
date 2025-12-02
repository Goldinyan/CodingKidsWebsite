"use client";
import { useAuth } from "@/BackEnd/AuthContext";
import TopView from "./TopView";
import type { UserData } from "@/BackEnd/type";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/db";

export default function MainView() {
  const [userData, setUserData] = useState<UserData>();

  const { user, loading } = useAuth();

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
    <div className="w-full">
      <div className="pt-20 w-full flex flex-col"> 
        <TopView data={userData}/>
      </div>
    </div>
  );
}

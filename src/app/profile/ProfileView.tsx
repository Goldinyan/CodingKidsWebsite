"use client"

import { useState, useEffect, use } from "react";
import { useAuth } from "@/BackEnd/AuthContext"
import type { UserData } from "@/BackEnd/type";
import { getUserData } from "@/lib/db";
import AnnouncementView from "./AnnouncementView";

export default function ProfileView(){
    const [userData, setUserData] = useState<UserData>();

    const { user, loading} = useAuth();

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

    if(!userData){
        return (
            <div>
                
            </div>
        )
    }
    return (
        <div>
            <AnnouncementView data={userData}/>
        </div>
    )
}
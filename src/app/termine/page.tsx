"use client"
import { user } from "@/lib/firebase"
import { useState, useEffect } from "react"
import { getUserData } from "@/lib/db"
import EventViewHandlerAdmin from "./EventViewHandlerAdmin"

export default function Home(){


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
  
  if(userData !== null){
  if(userData.role === "admin"){
    return <EventViewHandlerAdmin />
  }
}
  
  return (
        <div>
            <p>SAS</p>
        </div>
    )
}
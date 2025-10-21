"use client"
import { useState, useEffect } from "react"
import { getUserData } from "@/lib/db"
import { useAuth } from "@/BackEnd/AuthContext"
import EventView from "./EventView"
import EventAdd from "./EventAdd"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import EventNavbar from "./EventNavbar"

export default function Home(){


const [userData, setUserData] = useState<any>(null);
const { user, loading } = useAuth();
const [addEventVisible, setAddEventVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      }
    };

    fetchUserData();
  }, [user]);    
  

  if (loading) return <p>Lade...</p>;
if (!user) return <p>Kein Benutzer angemeldet</p>;
if (!userData) return <p>Benutzerdaten werden geladen...</p>;



return (
  <div className="flex flex-col ">
   
   <EventView />
  </div>
);

}




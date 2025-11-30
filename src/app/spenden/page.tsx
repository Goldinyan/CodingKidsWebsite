"use client"
import { useState, useEffect } from "react"
import { getUserData } from "@/lib/db"
import { useAuth } from "@/BackEnd/AuthContext"
import GiftingMainView from "./GiftingMainView"

export default function Home(){


const [userData, setUserData] = useState<any>(null);
const { user, loading } = useAuth();

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
//if (!user) return <p>Kein Benutzer angemeldet</p>;
//if (!userData) return <p>Benutzerdaten werden geladen...</p>;



return (
  <div className="w-full h-full bg-otherbg ">
    <GiftingMainView />
  </div>
);

}




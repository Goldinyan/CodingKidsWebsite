"use client"
import { useState, useEffect } from "react"
import { getUserData } from "@/lib/db"
import { useAuth } from "@/BackEnd/AuthContext"
import EventViewHandlerAdmin from "./EventViewHandlerAdmin"

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
  }, []);    
  

  if (loading) return <p>Lade...</p>;
if (!user) return <p>Kein Benutzer angemeldet</p>;
if (!userData) return <p>Benutzerdaten werden geladen...2</p>;

if (userData.role === "admin") {
  return <EventViewHandlerAdmin />;
}

return (
  <div>
    <p>Rolle: {userData.role ?? "Unbekannt"}</p>
    <p>SAS</p>
  </div>
);

}
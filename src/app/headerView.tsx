"use client"
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/db";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Dashboard, AdminDashboard} from "./DashBoards";
import LoginView from "./login";
  
 export default function HeaderView(){
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 // auth.setPersistence(browserLocalPersistence); // bleibt über Tabs hinweg
 // auth.setPersistence(browserSessionPersistence); // nur für aktuelle Sitzung
 

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const data = await getUserData(user.uid);
      setUserData(data);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

    if (loading) return <p>Lade...</p>;
    if (!userData) return <LoginView />;
    if (userData.role == "admin") return <AdminDashboard userData={userData} />;
    return <Dashboard userData={userData} />


 }

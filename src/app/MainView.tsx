"use client";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/db";
import { auth, user } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Dashboard, AdminDashboard } from "./DashBoards";
import LoginView from "./login";
import MainWebsiteView from "./MainWebsiteView";
import EventViewHandlerAdmin from "./EventViewHandlerAdmin";
import ClubViews from "./ClubView";

type Views = "main" | "events" | "club" | "login" | "profile";

export default function MainView() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState<Views>("main");

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

  return (
    <div className="">
      <div className="flex flex-row items-center justify-around w-[40vw] ml-[30vw] text-2xl ">
        <p className="" onClick={() => setViews("main")}>Home</p>
        <p onClick={() => setViews("events")}>Termine</p>
        <p onClick={() => setViews("club")}>Verein</p>
        {!user ? (
          <p onClick={() => setViews("login")}>Login</p>
        ) : (
          <p onClick={() => setViews("profile")}>Profil</p>
        )}
      </div>
      <div className="flex items-center justify-center h-[50vh]">
      {views === "main" ? (
        <MainWebsiteView />
      ) : views === "login" ? (
        <LoginView />
      ) : views === "events" && userData.role === "admin" ? (
        <EventViewHandlerAdmin />
      ) : views === "events" ? (
        <p></p>
      ) : views === "profile" ? (
        <p></p>
      ) : (
        <ClubViews />
      )}
      </div>
    </div>
  );








}

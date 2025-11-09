"use client";


import type { UserData } from "@/BackEnd/type";
import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { getUserData } from "@/lib/db";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";


export default function BasicOwnProfileDashboard() {
  const [open, setOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();

  const { user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const data = await getUserData(user.uid);

      if (data) {
        setUserData(data);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex flex-col mt-20  bg-otherbg pb-20">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 flex items-center justify-between shadow px-4">
        <p className="text-2xl pl-2 text-black font-bold ">Coding Kids</p>
        {!open ? (
          <Menu
            onClick={() => setOpen(!open)}
            className="w-6 h-6 text-black"
          />
        ) : (
          <X
            onClick={() => setOpen(!open)}
            className="w-6 h-6 text-black"
          />
        )}
      </div>

      <div className="flex flex-1 pt-15">
        <div className="w-64 bg-white border-l p-6 flex-col hidden md:flex">
        </div>
      </div>
    </div>
  );
}   
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/BackEnd/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { getUserData } from "@/lib/db";

export default function NavbarMobile() {
  useViewportHeight();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const data = await getUserData(user.uid);

      if (data) {
        setUserData(data);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div
      className="w-full h-full  overflow-hidden"
      style={{ height: "calc(var(--vh) * 100)" }}
    >
      <div className="absolute top-full left-0 w-full h-full bg-white shadow-md z-40">
        <div className="bg-white w-full shadow-md">
          <div
            className="flex flex-col  w-full gap-6 "
            style={{ height: "calc(var(--vh) * 100)" }}
          >
            <div className="flex flex-col gap-6 px-6 pt-5">
              <p
                className="font-extrabold text-graytext"
                onClick={() => router.push("/")}
              >
                Startseite
              </p>
              <p
                className="font-extrabold  text-graytext"
                onClick={() => router.push("/termine")}
              >
                Kurse
              </p>
              <p
                className="font-extrabold text-graytext"
                onClick={() => router.push("/verein")}
              >
                Über uns
              </p>
              <p
                className="font-extrabold text-graytext"
                onClick={() => router.push("/kontakt")}
              >
                Kontakt
              </p>
              <p
                className="font-extrabold text-graytext"
                onClick={() => router.push("/spende")}
              >
                Spenden
              </p>
              {user ? (
                <p
                  className="font-bold text-graytext"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </p>
              ) : (
                ""
              )}
              {userData?.role === "admin" ? (
                <p
                  className="font-bold text-graytext"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </p>
              ) : (
                ""
              )}
            </div>
            <span
              className="w-full h-[3px]  bg-white shadow"
              style={{ marginTop: "calc(var(--vh) * 6)" }}
            ></span>

            <div className="flex flex-row pl-6 ">
              <div className="flex-col flex gap-5">
                {" "}
                <p className="text-graytext font-bold">Ort</p>
                <p className="text-graytext font-bold">Blog</p>{" "}
                <p className="text-graytext font-bold">DSGVO</p>
              </div>
              <div className="flex-col flex pl-20 gap-5 1:pl-30 ">
                <p className="text-graytext font-bold">Cookie Settings</p>{" "}
                <p className="text-graytext font-bold">Impressum</p>
                <p className="text-graytext font-bold">AGB/Widerruf</p>
              </div>
            </div>

            {!user ? (
              <div className="flex flex-col px-5 pt-6 gap-4">
                <Button
                  onClick={() => router.push("/signup")}
                  variant="outline"
                  className="bg-black"
                >
                  <p className="text-white">Get Started</p>
                  <ArrowRight className="text-gray-600" />
                </Button>
                <Button onClick={() => router.push("/login")} variant="outline">
                  <p>Log in</p>
                </Button>
              </div>
            ) : (
              <div></div>
            )}
            <p></p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}

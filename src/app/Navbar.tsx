"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { useAuth } from "@/BackEnd/AuthContext";
import { User, LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Menu, X, LayoutDashboard } from "lucide-react";
import NavbarMobile from "./NavbarMobile";
import { getUserData } from "@/lib/db";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isMobile = useIsMobile();

  return (
    <div className="w-full  ">
      <div className="w-full h-16 pt-5 md:pt-0  ">
        <div className="w-full flex items-center pr-15 pl-4">
          <div className=" flex-row items-center gap-3 hidden md:flex">
            <img src="Logo_aussen_Transparent.png" className="w-15 h-15 p-1" />
            <p className="font-bold hidden lg:flex">Coding Kids Niederrhein</p>
          </div>

          <div className=" flex-row items-center gap-3 ml-auto hidden md:flex">
            <Button
              className="bg-secondaryOwn"
              onClick={() => router.push("/spenden")}
            >
              <p className="font-bold">Spenden</p>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(user ? "/profile" : "/login")}
            >
              {isMobile ? (
                !user ? (
                  <User className="w-5 h-5" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )
              ) : (
                <span className="font-bold">{user ? "Profile" : "Login"}</span>
              )}
            </Button>
            {userData?.role === "admin" && (
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex gap-6">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link className="font-bold" href="/">
                      Startseite
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <p
                      className="font-bold"
                      onClick={() => router.push("/termine")}
                    >
                      Kurse
                    </p>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <p
                      className="font-bold"
                      onClick={() => router.push("/verein")}
                    >
                      Über uns
                    </p>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    <p
                      className="font-bold"
                      onClick={() => router.push("/kontakt")}
                    >
                      Kontakt
                    </p>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex flex-col  w-full h-full  md:hidden">
          <div className="flex flex-row  justify-between  items-center w-full ">
            <p className="text-black font-bold pl-6">Coding Kids Niederrhein</p>
            <button
              onClick={() => setOpen(!open)}
              className="focus:outline-none transition-all pr-6"
            >
              {!open ? (
                <Menu className="w-6 h-6 text-graytext" />
              ) : (
                <X className="w-6 h-6 text-graytext" />
              )}
            </button>
           </div>
           <div className="transition-all duration-300 ">
             
            {open && <NavbarMobile setOpen={setOpen} />}
           </div>
         </div>
       </div>
    </div>
  );
}

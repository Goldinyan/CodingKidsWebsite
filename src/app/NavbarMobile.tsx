"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/BackEnd/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Home,
  GraduationCap,
  Users,
  Mail,
  HeartHandshakeIcon,
  User,
  LayoutDashboard,
  MessageCircle,
} from "lucide-react";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { getAllAnnouncements, getUserData } from "@/lib/db";

interface NavbarMobileProps {
  setOpen: (open: boolean) => void;
}

export default function NavbarMobile({ setOpen }: NavbarMobileProps) {
  useViewportHeight();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const data = await getUserData(user.uid);

      if (data) {
        setUserData(data);
      }
      const announcements = await getAllAnnouncements();
      const unread = announcements.filter(
        (announcement) =>
          !announcement.readBy || !announcement.readBy.includes(user.uid)
      ).length;
      setUnreadMessages(unread);
      console.log("Unread messages:", unread);
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
            <div className="flex flex-col gap-6 px-4 pt-5 w-full ">
              {(() => {
                const items: { label: string; href: string; Icon: any }[] = [
                  { label: "Startseite", href: "/", Icon: Home },
                  { label: "Kurse", href: "/termine", Icon: GraduationCap },
                  { label: "Über uns", href: "/verein", Icon: Users },
                  {
                    label: "Spenden",
                    href: "/spende",
                    Icon: HeartHandshakeIcon,
                  },
                  { label: "Kontakt", href: "/kontakt", Icon: MessageCircle },
                ];

                if (user)
                  items.push({
                    label: "Profile",
                    href: "/profile",
                    Icon: User,
                  });
                if (userData?.role === "Admin")
                  items.push({
                    label: "Dashboard",
                    href: "/dashboard",
                    Icon: LayoutDashboard,
                  });

                return items.map((it, idx) => {
                  const bgClass =
                    idx % 2 === 0 ? "text-primaryOwn" : "text-secondaryOwn";
                  return (
                    <div
                      key={it.href}
                      className={`flex w-full items-center shadow-sm px-3 py-3 rounded-lg`}
                      onClick={() => {
                        router.push(it.href);
                        setOpen(false);
                      }}
                    >
                      <div className="relative mr-4">
                        <it.Icon className={`h-5 ${bgClass}`} />
                        {it.label === "Kontakt" && unreadMessages > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 scale-70 rounded-full">
                            {unreadMessages > 99 ? "99+" : unreadMessages}
                          </span>
                        )}
                      </div>

                      <p className="font-medium">{it.label}</p>

                      <ArrowRight className="ml-auto" />
                    </div>
                  );
                });
              })()}
            </div>
            <span
              className="w-full h-[3px]  bg-white shadow"
              style={{ marginTop: "calc(var(--vh) * 6)" }}
            ></span>

            <div className="flex flex-row  justify-around  ">
              <div className="flex-col items-center flex gap-5">
                {" "}
                <p className="text-graytext ">Ort</p>
                <p className="text-graytext ">Blog</p>{" "}
                <p className="text-graytext ">DSGVO</p>
              </div>
              <div className="flex-col items-center flex  gap-5 ">
                <p className="text-graytext ">Cookie Settings</p>{" "}
                <p className="text-graytext   ">Impressum</p>
                <p className="text-graytext ">AGB/Widerruf</p>
              </div>
            </div>

            {!user ? (
              <div className="flex flex-col px-5 pt-6 gap-4">
                <Button
                  onClick={() => {
                    router.push("/signup"), setOpen(false);
                  }}
                  variant="outline"
                  className="bg-black"
                >
                  <p className="text-white">Get Started</p>
                  <ArrowRight className="text-gray-600" />
                </Button>
                <Button
                  onClick={() => {
                    router.push("/login"), setOpen(false);
                  }}
                >
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

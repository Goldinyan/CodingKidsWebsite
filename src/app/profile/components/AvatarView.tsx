// src/app/profile/components/AvatarView.tsx

import type { UserData } from "@/BackEnd/type";
import { Theme } from "@/context/ThemeContext";
import { getAvatarNames } from "../actions"; 
import { useEffect, useState } from "react";
import { getAvatar } from "../utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

export default function AvatarView({
  theme,
  isRounded,
  userData,
  showAvatarView,
  setShowAvatarView,
}: {
  theme: Theme;
  isRounded: boolean;
  userData: UserData;
  showAvatarView: boolean;
  setShowAvatarView: (y: boolean) => void;
}) {
  const [avatars, setAvatars] = useState<string[]>([]);

  useEffect(() => {
    getAvatarNames().then((names) => setAvatars(names));
    console.log(avatars)
  }, []);

  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  return (
    <div
      className={`backdrop-blur-xl p-6 border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between flex-wrap gap-6 ${roundedClass} ${theme === "dark"
          ? "bg-white/5 border-white/10 "
          : "bg-slate-100 border-slate-200 "
        }`}
    >
      {avatars.map((name) => (
        <div
          key={name}
          className={`w-24 h-24 group relative flex items-center justify-center  p-1 border overflow-hidden transition-all duration-300 ${isRounded ? "rounded-full" : "rounded-none"
            } ${theme === "dark"
              ? "border-white/10 bg-black/40"
              : "border-slate-300 bg-white"
            }`}
        >
          <Avatar className="w-full h-full">
            <AvatarImage
              src={getAvatar(name)}
              className={`object-cover w-full h-full ${isRounded ? "rounded-full" : "rounded-none"}`}
            />
          </Avatar>
        </div>
      ))}
    </div>
  );
}

import type { UserData } from "@/BackEnd/type";
import { Theme } from "@/context/ThemeContext";
import { getAvatarNames } from "../actions";
import { useEffect, useState } from "react";
import { getAvatar } from "../utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ArrowLeft, ArrowRight, Check, Dot, X } from "lucide-react";

export default function AvatarView({
  theme,
  isRounded,
  userData,
  updateProfile,
  setShowAvatarView,
}: {
  theme: Theme;
  isRounded: boolean;
  userData: UserData;
  updateProfile: (updates: Partial<UserData>) => Promise<void>;
  setShowAvatarView: (y: boolean) => void;
}) {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    getAvatarNames().then((names) => {
      setAvatars(names);
      let index = avatars.indexOf(userData.avatar);
      if (index == -1) index = 0;
      setCurrentIndex(index);
    });
  }, []);

  const inacitveArrowClass = "opacity-0 w-6 h-6";
  const arrowClass =
    theme == "dark" ? "text-white w-6 h-6" : "text-black w-6 h-6";
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";

  return (
    <div
      className={`backdrop-blur-xl flex items-center justify-center flex-col gap-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 absolute z-10 border transition-all duration-300 ${roundedClass} ${theme === "dark"
          ? "bg-white/5 border-white/10 "
          : "bg-slate-100 border-slate-200 "
        }`}
    >
      <X
        onClick={() => setShowAvatarView(false)}
        className="absolute top-4 left-4 w-8 h-8 p-1.5 text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl cursor-pointer hover:bg-red-500/20 transition-colors"
      />
      <Check
        onClick={() => updateProfile({ avatar: avatars[currentIndex] })}
        className="absolute top-4 right-4 w-8 h-8 p-1.5 text-green-500 bg-green-500/10 border border-green-500/30 rounded-xl cursor-pointer hover:bg-green-500/20 transition-colors"
      />

      <div
        className={`w-40 h-40 group relative flex items-center justify-center p-1 border overflow-hidden transition-all duration-300 ${isRounded ? "rounded-full" : "rounded-none"
          } ${theme === "dark"
            ? "border-white/10 bg-black/40"
            : "border-slate-300 bg-white"
          }`}
      >
        {avatars.length > 0 && (
          <Avatar className="w-full h-full">
            <AvatarImage
              src={getAvatar(avatars[currentIndex])}
              className={`object-cover w-full h-full ${isRounded ? "rounded-full" : "rounded-none"}`}
            />
          </Avatar>
        )}{" "}
      </div>
      <div className="flex flex-row justify-between">
        <ArrowLeft
          onClick={() => {
            if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
          }}
          className={`${arrowClass}`}
        />
        <div className="flex flex-row justify-center items-center">
          {avatars[currentIndex - 2] ? (
            <Dot className={`${arrowClass}`} />
          ) : (
            <Dot className={`${inacitveArrowClass}`} />
          )}
          {avatars[currentIndex - 1] ? (
            <Dot className={`${arrowClass}`} />
          ) : (
            <Dot className={`${inacitveArrowClass}`} />
          )}
          {avatars[currentIndex] ? (
            <Dot className={`w-6 h-6 text-green-500`} />
          ) : (
            <Dot className={`${inacitveArrowClass}`} />
          )}
          {avatars[currentIndex + 1] ? (
            <Dot className={`${arrowClass}`} />
          ) : (
            <Dot className={`${inacitveArrowClass}`} />
          )}
          {avatars[currentIndex + 2] ? (
            <Dot className={`${arrowClass}`} />
          ) : (
            <Dot className={`${inacitveArrowClass}`} />
          )}
        </div>
        <ArrowRight
          onClick={() => {
            if (currentIndex < avatars.length - 1)
              setCurrentIndex(currentIndex + 1);
          }}
          className={`${arrowClass} `}
        />
      </div>
    </div>
  );
}

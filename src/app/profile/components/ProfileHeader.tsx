import type { UserData } from "@/BackEnd/type";
import { logOutUser } from "@/lib/auth";
import { LogOut, Cake, BookOpen, Shield, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Theme } from "@/context/ThemeContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { getAvatar, getRoleBadgeColor, calculateAge } from "../utils";

export default function ProfileHeader({
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
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  const router = useRouter();

  return (
    <div
      className={`backdrop-blur-xl p-6 border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-6 ${roundedClass} ${theme === "dark"
          ? "bg-white/5 border-white/10 "
          : "bg-slate-100 border-slate-200 "
        }`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div
          onClick={() => setShowAvatarView(!showAvatarView)}
          className={`w-24 h-24 group relative flex items-center justify-center p-1 border overflow-hidden transition-all duration-300 ${isRounded ? "rounded-full" : "rounded-none"
            } ${theme === "dark"
              ? "border-white/10 bg-black/40"
              : "border-slate-300 bg-white"
            }`}
        >
          <Avatar className="w-full h-full">
            <AvatarImage
              src={getAvatar(userData.avatar)}
              className={`object-cover w-full h-full ${isRounded ? "rounded-full" : "rounded-none"}`}
            />
          </Avatar>

          <div
            className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isRounded ? "rounded-full" : "rounded-none"
              }`}
          />

          <Pencil
            className={`absolute w-8 h-8 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none ${theme === "dark" ? "text-white" : "text-black"
              }`}
          />
        </div>
        <div className="text-center sm:text-left space-y-2">
          <span
            className={`text-xs font-mono tracking-widest uppercase ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}
          >
            CodingKids Profil
          </span>
          <h2
            className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {userData.name}
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            <span
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider border transition-colors duration-300 ${innerRoundedClass} ${getRoleBadgeColor(userData.role, theme)}`}
            >
              <span className="flex items-center gap-1.5">
                {userData.role.toLowerCase() === "admin" && (
                  <Shield className="w-3.5 h-3.5" />
                )}
                {userData.role.toLowerCase() === "mentor" && (
                  <BookOpen className="w-3.5 h-3.5" />
                )}
                {userData.role}
              </span>
            </span>

            {userData.birthdate && (
              <span
                className={`px-3 py-1 text-xs font-mono border transition-colors duration-300 flex items-center gap-1.5 ${innerRoundedClass} ${theme === "dark"
                    ? "bg-white/5 border-white/10 text-gray-400"
                    : "bg-white border-slate-200 text-slate-500"
                  }`}
              >
                <Cake className="w-3.5 h-3.5" />{" "}
                {calculateAge(userData.birthdate)} Jahre alt
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        <Button
          onClick={() => {
            logOutUser();
            router.push("/");
          }}
          variant="outline"
          className={`w-full sm:w-auto font-mono text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${innerRoundedClass} ${theme === "dark"
              ? "bg-white text-black hover:bg-gray-200 border-transparent"
              : "bg-slate-900 text-white hover:bg-slate-800 border-transparent"
            }`}
        >
          <LogOut
            className={`${theme == "dark" ? "text-white" : "text-black"}`}
          />
          <p className={`${theme == "dark" ? "text-white" : "text-black"}`}>
            Log Out
          </p>
        </Button>
      </div>
    </div>
  );
}

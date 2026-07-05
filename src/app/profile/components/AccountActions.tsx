"use client";

import { useTheme } from "@/context/ThemeContext";
import { LogOutIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { logOutUser } from "@/lib/auth";
import { UserRole } from "@/BackEnd/type";
import { deleteUser } from "lib/db/users";
import { User } from "firebase/auth";

export default function AccountActions({
  user,
  userRole,
}: {
  user: User | null;
  userRole: UserRole;
}) {
  const { theme, isRounded } = useTheme();
  const router = useRouter();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  const handleDelete = () => {
    if (
      confirm(
        "Möchtest du wirklich deinen Account löschen? Das kann nicht rückgängig gemacht werden.",
      )
    ) {
      deleteUser(user!, user!.uid, userRole);
    }
  };

  return (
    <div
      className={`w-full p-5 border transition-all duration-150 flex flex-col gap-5 ${roundedClass} ${theme === "dark"
          ? "bg-[rgba(255,255,255,0.02)] border-zinc-800"
          : "bg-slate-50 border-slate-300"
        }`}
    >
      <div className="flex flex-col gap-2">
        {/*<span
          className={`block font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest uppercase ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
            }`}
        >
          System // Session_Control
        </span>*/}
        <button
          onClick={() => {
            logOutUser();
            router.push("/");
          }}
          className={`w-full py-2 font-['JetBrains_Mono'] text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 border ${innerRoundedClass} ${theme === "dark"
              ? "bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
          <LogOutIcon className="w-3.5 h-3.5" />
          Ausloggen
        </button>
      </div>

      <div
        className={`h-[1px] w-full ${theme === "dark" ? "bg-zinc-800/60" : "bg-slate-200"}`}
      />

      <div className="flex flex-col gap-2">
        {/*<span
          className={`block font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest uppercase text-red-500/80`}
        >
          Warning // Danger_Zone
        </span>*/}
        <button
          onClick={handleDelete}
          className={`w-full py-2 font-['JetBrains_Mono'] text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 border ${innerRoundedClass} ${theme === "dark"
              ? "bg-zinc-950/40 text-red-400 border-red-950/40 hover:bg-red-950/20 hover:border-red-900/40"
              : "bg-red-50/50 text-red-600 border-red-200/60 hover:bg-red-50 hover:border-red-300"
            }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Account löschen
        </button>
      </div>
    </div>
  );
}

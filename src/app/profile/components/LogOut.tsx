"use client";

import { Theme, useTheme } from "@/context/ThemeContext";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { logOutUser } from "@/lib/auth";

export default function LogOut() {
  const { theme, isRounded } = useTheme();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  const router = useRouter();

  return (
    <div
      className={`w-full p-6 border transition-all duration-150 ${roundedClass} ${theme === "dark"
          ? "bg-[rgba(255,255,255,0.02)] border-zinc-800"
          : "bg-slate-50 border-slate-300"
        }`}
    >
      <button
        onClick={() => {
          logOutUser();
          router.push("/");
        }}
        className={`w-full py-2.5 font-['JetBrains_Mono'] text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${innerRoundedClass} ${theme === "dark"
            ? "bg-zinc-950 text-red-400 border border-zinc-900 hover:bg-red-950/20 hover:border-red-900/50"
            : "bg-white text-red-600 border border-slate-300 hover:bg-red-50 hover:border-red-200"
          }`}
      >
        <LogOutIcon className="w-3.5 h-3.5" />
        Ausloggen
      </button>
    </div>
  );
}

"use client";

import { Theme } from "@/context/ThemeContext";
import { Trash2, AlertTriangle } from "lucide-react";
import { UserRole } from "@/BackEnd/type";
import { deleteUser } from "lib/db/users";
import { User } from "firebase/auth";

export default function AccountDeletion({
  theme,
  isRounded,
  user,
  userRole,
}: {
  theme: Theme;
  isRounded: boolean;
  user: User | null;
  userRole: UserRole;
}) {
  const roundedClass = isRounded ? "rounded-[12px]" : "rounded-none";
  const isDark = theme === "dark";

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
      className={`p-6 border transition-all duration-200 ${roundedClass} ${isDark
          ? "bg-zinc-950 border-red-900/40 text-white"
          : "bg-red-50/50 border-red-200 text-slate-900 shadow-sm"
        }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0 stroke-[2]" />
        <div>
          <h4 className="text-sm font-black font-['Familjen_Grotesk'] tracking-tight uppercase text-red-500">
            GEFAHRENZONE_ACCOUNT_LÖSCHEN
          </h4>
          <p
            className={`font-['JetBrains_Mono'] text-[11px] tracking-wide uppercase leading-relaxed mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"
              }`}
          >
            Das Entfernen des Accounts löscht alle verknüpften Profildaten,
            Zertifikate und Kursfortschritte permanent aus der System-Matrix.
          </p>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className={`w-full px-4 py-3 font-['JetBrains_Mono'] text-[11px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${roundedClass} ${isDark
            ? "bg-red-600 hover:bg-red-700"
            : "bg-red-600 hover:bg-red-700 shadow-sm"
          }`}
      >
        <Trash2 className="w-3.5 h-3.5" />
        ACCOUNT_LÖSCHEN
      </button>
    </div>
  );
}

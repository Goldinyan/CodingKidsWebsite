"use client";

import { Theme } from "@/context/ThemeContext";
import { Trash2 } from "lucide-react";
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
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";
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
      className={`backdrop-blur-xl p-4 border transition-all duration-300 ${roundedClass} ${isDark
          ? "bg-red-950/20 border-red-500/20"
          : "bg-red-50 border-red-200"
        }`}
    >
      <button
        onClick={handleDelete}
        className={`py-2.5 w-full font-mono text-xs tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2 ${innerRoundedClass} bg-red-700 hover:bg-red-800 text-white`}
      >
        <Trash2 className="w-4 h-4" />
        Account löschen
      </button>
    </div>
  );
}

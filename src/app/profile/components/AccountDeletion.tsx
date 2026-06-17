import { func } from "joi";
import AccountDetails from "./AccountDetails";
import { Theme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UserData, UserRole } from "@/BackEnd/type";
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

  return (
    <div
      className={`backdrop-blur-xl p-4 border transition-all duration-300 ${roundedClass} ${theme === "dark"
          ? "bg-red-950/20 border-red-500/20"
          : "bg-red-50 border-red-200"
        }`}
    >
      <Button
        onClick={() => {
          if (
            confirm(
              "Möchtest du wirklich deinen Account löschen? Das kann nicht rückgängig gemacht werden.",
            )
          ) {
            deleteUser(user!, user!.uid, userRole);
          }
        }}
        variant="destructive"
        className={`w-full font-mono text-xs tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2 ${innerRoundedClass} bg-red-600 hover:bg-red-700 text-white`}
      >
        <Trash2 className="w-4 h-4" /> Account löschen
      </Button>
    </div>
  );
}

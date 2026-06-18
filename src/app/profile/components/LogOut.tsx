import { Theme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { LogOutIcon, Trash2 } from "lucide-react";
import { UserRole } from "@/BackEnd/type";
import { deleteUser } from "lib/db/users";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { logOutUser } from "@/lib/auth";

export default function LogOut({
  theme,
  isRounded,
}: {
  theme: Theme;
  isRounded: boolean;
}) {
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  const router = useRouter();
  return (
    <div
      className={`backdrop-blur-xl p-4 border transition-all duration-300 ${roundedClass} ${theme === "dark"
          ? "bg-purple-950/20 border-purple-500/20"
          : "bg-purple-50 border-purple-200"
        }`}
    >
      <p
        onClick={() => {
          logOutUser();
          router.push("/");
        }}
        className={`py-2.5 w-full font-mono text-xs tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2 ${innerRoundedClass} bg-purple-700 hover:bg-purple-700 text-white`}
      >
        <LogOutIcon className="w-4 h-4" /> Ausloggen
      </p>
    </div>
  );
}

import { Timestamp } from "firebase/firestore";
import { toJsDate } from "@/BackEnd/utils";
import { UserRole } from "@/BackEnd/type";
import { Theme } from "@/context/ThemeContext";

export function getAvatar(avatar: string) {
  return "avatars/" + avatar;
}

export function calculateAge(birthdate: Timestamp) {
  const birth = toJsDate(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function getRoleBadgeColor(role: UserRole, theme: Theme) {
  switch (role.toLowerCase()) {
    case "admin":
      return theme === "dark"
        ? "bg-red-500/10 text-red-400 border-red-500/20"
        : "bg-red-50 text-red-700 border-red-200";
    case "mentor":
      return theme === "dark"
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
        : "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return theme === "dark"
        ? "bg-green-500/10 text-green-400 border-green-500/20"
        : "bg-green-50 text-green-700 border-green-200";
  }
}


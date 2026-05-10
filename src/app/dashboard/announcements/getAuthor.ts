import type { UserData } from "@/BackEnd/type";

export function getAuthorName(admins: UserData[], authorId: string) {
  for (const admin of admins) {
    if (admin?.uid?.trim?.() === authorId?.trim?.()) {
      return admin.name ?? admin.email ?? "Unbekannt";
    }
  }
  return "Unbekannt";
}


import { useEffect, useState } from "react";
import type { UserData } from "@/BackEnd/type";
import { getAllAdmins } from "@/lib/db/admins";

export function useAdmins(userId: string | undefined, userRole: unknown) {
  const [admins, setAdmins] = useState<UserData[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getAllAdmins(userId, userRole as any);
        setAdmins(data || []);
      } catch (e) {
        console.error("Error loading admins:", e);
        setAdmins([]);
      }
    };
    run();
  }, [userId, userRole]);

  return admins;
}


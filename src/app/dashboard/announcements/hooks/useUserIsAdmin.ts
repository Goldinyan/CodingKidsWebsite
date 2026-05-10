import { useEffect, useState } from "react";
import { getUserData } from "@/lib/db/users";

export function useUserIsAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const run = async () => {
      if (!userId) {
        setIsAdmin(false);
        return;
      }
      try {
        const data = await getUserData(userId);
        setIsAdmin(data?.role === "admin");
      } catch (e) {
        console.error("Error loading user role:", e);
        setIsAdmin(false);
      }
    };
    run();
  }, [userId]);

  return isAdmin;
}


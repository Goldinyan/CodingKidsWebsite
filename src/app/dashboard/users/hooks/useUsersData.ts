import { useCallback, useEffect, useState } from "react";
import type { UserData } from "@/BackEnd/type";
import { getAllUsers } from "@/lib/db";

export function useUsersData(userId: string | undefined, userRole: unknown) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUsers(userId || "anonymous", userRole as any);
      setUsers((data || []) as UserData[]);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { users, setUsers, refresh, isLoading, error };
}


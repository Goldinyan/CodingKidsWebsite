import { useCallback, useEffect, useState } from "react";
import type { Mentor, UserData } from "@/BackEnd/type";
import { getAllMentorUsers } from "@/lib/db/users";
import { useAuth } from "@/BackEnd/AuthContext";

export function useMentorsData() {
  const [mentors, setMentors] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const { user, userRole } = useAuth();

  const refresh = useCallback(async () => {
    if (!user || !userRole) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const mentorUsers = await getAllMentorUsers(user.uid, userRole);

      setMentors(mentorUsers);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { mentors, setMentors, refresh, isLoading, error };
}

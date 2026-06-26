import { useAuth } from "@/BackEnd/AuthContext";

export function useUserIsAdmin(userId: string | undefined) {
  const { userData, loading } = useAuth();

  if (loading || !userData) {
    return false;
  }

  return userData.role === "admin";
}

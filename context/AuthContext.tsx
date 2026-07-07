"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { AuthContextType } from "@/BackEnd/type";
import { getUserData, updateUser } from "@/lib/db/users";
import { UserData, UserRole } from "@/BackEnd/type";
import { logOutUser } from "@/lib/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("anonymous");
  const [loading, setLoading] = useState(true);

  const updateProfile = async (updates: Partial<UserData>) => {
    if (!user) return;
    try {
      await updateUser(user.uid, updates, user.uid, userRole);
      setUserData((prev) =>
        prev ? ({ ...prev, ...updates } as UserData) : null,
      );

      if (updates.role) {
        setUserRole(updates.role);
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Userdaten:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      try {
        if (firebaseUser) {
          const data = await getUserData(firebaseUser.uid);
          if (data) {
            setUserData(data);
            setUserRole(data.role);
          }
        } else {
          setUserData(null);
          setUserRole("anonymous");
          setLoading(false); // wenn kein User, dann direkt auf false
        }
      } catch (error) {
        console.error("Fehler beim Laden der DB-Userdaten:", error);
      } finally {
        setLoading(false); // erst wenn sicher alles fertig ist
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, userRole, userData, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

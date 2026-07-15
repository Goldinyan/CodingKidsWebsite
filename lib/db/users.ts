import { db } from "../firebase";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import type { UserData, UserRole } from "@/BackEnd/type";
import { RateLimitExceededError } from "../rate_limiting/rateLimiter";
import { enforceRateLimit } from "./db";

export async function getUserData(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<UserData | null> {
  enforceRateLimit("getUserData", userId, userRole);

  try {
    const snapshot = await getDoc(doc(db, "users", userId));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    const role = data.role ?? "user";

    const baseUserData = {
      uid: userId,
      name: data.name ?? "",
      email: data.email ?? "",
      birthdate: data.birthdate ?? "",
      createdAt: data.createdAt ?? new Date(),
      avatar: data.avatar ?? "",
      courses: data.courses ?? [],
      projects: data.projects ?? [],
    };

    const baseSettings = {
      theme: (data.settings?.theme ?? "light") as "light" | "dark",
      isRounded: data.settings?.isRounded ?? true,
    };

    if (role === "admin") {
      return {
        ...baseUserData,
        role,
        children: data.children ?? [],
        settings: {
          ...baseSettings,
          notifications: {
            newEvent: data.settings?.notifications?.newEvent ?? true,
            kicked: data.settings?.notifications?.kicked ?? true,
            queueToUser: data.settings?.notifications?.queueToUser ?? true,
            understaffedWarning:
              data.settings?.notifications?.understaffedWarning ?? true,
            logs: data.settings?.notifications?.logs ?? false,
            systemAlerts: data.settings?.notifications?.systemAlerts ?? false,
          },
        },
      };
    } else if (role === "mentor") {
      return {
        ...baseUserData,
        role,
        children: data.children ?? [],
        settings: {
          ...baseSettings,
          notifications: {
            newEvent: data.settings?.notifications?.newEvent ?? true,
            understaffedWarning:
              data.settings?.notifications?.understaffedWarning ?? true,
          },
        },
      };
    } else {
      return {
        ...baseUserData,
        role: role as "anonymous" | "user" | "member",
        settings: {
          ...baseSettings,
          notifications: {
            newEvent: data.settings?.notifications?.newEvent ?? true,
            kicked: data.settings?.notifications?.kicked ?? true,
            queueToUser: data.settings?.notifications?.queueToUser ?? true,
          },
        },
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function getAllUsers(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<UserData[]> {
  enforceRateLimit("getAllUsers", userId, userRole);

  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserData[];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function getAllMentorUsers(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<UserData[]> {
  enforceRateLimit("getAllUsers", userId, userRole);

  try {
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserData[];
    return data.filter(
      (user) => user.role === "mentor" || user.role === "admin",
    );
  } catch (error) {
    console.error("Error fetching mentor users:", error);
    throw error;
  }
}

export async function updateUser(
  uid: string,
  updates: Partial<UserData> & { [key: string]: any }, // Allows FieldValue utilities like arrayUnion,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("updateUser", userId, userRole);

  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    throw error;
  }
}

export async function deleteUserData(
  uid: string,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  // Users should only be able to delete themselves
  if (userRole === "user" && userId !== uid) {
    throw new RateLimitExceededError("deleteUserData", userRole);
  }

  try {
    const ref = doc(db, "users", uid);
    const userSnapshot = await getDoc(ref);

    if (!userSnapshot.exists()) {
      console.log("No user to delete");
      return;
    }

    await deleteDoc(ref);
    console.log("User deleted");
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUser(
  user: User,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  try {
    if (!user) {
      console.log("No user found");
      return;
    }

    console.log(user.displayName + " got deleted");
    await deleteUserData(user.uid, userId, userRole);
    await user.delete();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

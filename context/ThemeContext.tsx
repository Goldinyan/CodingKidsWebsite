"use client";

import { useAuth } from "@/BackEnd/AuthContext";
import { getUserData, updateUser } from "@/lib/db";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isRounded: boolean;
  toggleRounded: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isRounded, setIsRoundedState] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const { user, userRole } = useAuth();

  useEffect(() => {
    setMounted(true);

    let userThemePreference = null;
    const userRoundedPreference = null;

    const checkUserPreference = async () => {
      if (!user) return;

      const data = await getUserData(user.uid, userRole);

      if (data?.theme) {
        userThemePreference = data.theme as Theme;
      }
    };

    checkUserPreference();

    // Prüfe localStorage und System-Präferenz
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (userThemePreference == null) {
      const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    } else {
      setThemeState(userThemePreference);
      applyTheme(userThemePreference);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);

    if (!user) {
      return;
    }

    const updateUserTheme = async () => {
      await updateUser(user.uid, { theme: newTheme }, user.uid, userRole);
    };

    //updateUserTheme();
  };

  const toggleRounded = () => {
    const newRounded = !isRounded;

    setIsRoundedState(newRounded);
    localStorage.setItem("isRounded", isRounded ? "true" : "false");

    if (!user) {
      return;
    }

    const updateUserRounded = async () => {
      await updateUser(user.uid, { roundedCorners: newRounded}, user.uid, userRole);
    };

    //updateUserRounded();
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isRounded, toggleRounded }}
    >
      {/* 
        Der Provider ist IMMER da. useTheme() stürzt niemals ab.
        Wenn die App noch nicht im Browser 'mounted' ist, verstecken wir die UI 
        kurz (opacity-0), um das typische Light/Dark-Wechsel-Flackern zu verhindern.
      */}
      <div
        className={
          mounted ? "opacity-100 transition-opacity duration-150" : "opacity-0"
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useTheme muss innerhalb von ThemeProvider verwendet werden",
    );
  }
  return context;
}

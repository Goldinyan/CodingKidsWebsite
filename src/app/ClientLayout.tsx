"use client";

import { ReactNode } from "react";
import NavbarWrapper from "./NavbarWrapper";
import { Toaster } from "@/components/ui/toaster";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <NavbarWrapper />
      {children}
      <ThemeToggle />
      <Toaster />
    </ThemeProvider>
  );
}

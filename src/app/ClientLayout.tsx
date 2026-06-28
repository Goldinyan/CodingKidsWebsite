"use client";

import { ReactNode } from "react";
import NavbarWrapper from "./navbar/NavbarWrapper";
import { Toaster } from "@/components/ui/toaster";
import FooterWrapper from "./FooterWrapper";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <NavbarWrapper />
        <main className="flex-1 w-full">{children}</main>
        <FooterWrapper />
      </div>

      <ThemeToggle />
      <Toaster />
    </ThemeProvider>
  );
  {
    /*
    <ThemeProvider>
      <NavbarWrapper />
      <FooterWrapper />
      {children}
      <ThemeToggle />
      <Toaster />
    </ThemeProvider> */
  }
}

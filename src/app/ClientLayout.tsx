"use client";

import { ReactNode } from "react";
import NavbarWrapper from "./NavbarWrapper";
import { Toaster } from "@/components/ui/toaster";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarWrapper />
      {children}
      <Toaster />
    </>
  );
}

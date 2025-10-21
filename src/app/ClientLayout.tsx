"use client";

import { ReactNode } from "react";
import NavbarWrapper from "./NavbarWrapper";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarWrapper />
      {children}
    </>
  );
}


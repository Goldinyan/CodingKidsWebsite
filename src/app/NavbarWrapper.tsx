"use client";

import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/login") || pathname.startsWith("/dashboard");

  return !hideNavbar ? (
  <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
    <Navbar />
  </div>
) : null;

}

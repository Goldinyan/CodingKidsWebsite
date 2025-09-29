"use client"

import './globals.css'; 
import { ReactNode } from 'react';
import Navbar from './Navbar';
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
   const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/login");

  return (
    <html lang="de">
      <body>
        {!hideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}


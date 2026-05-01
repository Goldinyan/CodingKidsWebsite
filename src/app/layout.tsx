import { ReactNode } from "react";
import { AuthProvider } from "@/BackEnd/AuthContext";
import NavbarWrapper from "./NavbarWrapper";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="overflow-x-hidden w-full">
        {/*<AnimatedBackground />*/}
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

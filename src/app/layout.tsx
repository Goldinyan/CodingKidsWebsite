import { ReactNode } from "react";
import { AuthProvider } from "@/BackEnd/AuthContext";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="overflow-x-hidden w-full">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

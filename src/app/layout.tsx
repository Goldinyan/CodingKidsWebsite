import { ReactNode } from "react";
import { AuthProvider } from "@/BackEnd/AuthContext";
import NavbarWrapper from "./NavbarWrapper";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
 

  // return (
  //   <html lang="de">
  //     <body>
  //       <AuthProvider>
  //       <NavbarWrapper />
  //         {children}
  //       </AuthProvider>
  //     </body>
  //   </html>
  // );

  return (
    <html lang="de">
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

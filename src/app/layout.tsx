import { ReactNode } from "react";
import { AuthProvider } from "@/BackEnd/AuthContext";
import ClientLayout from "./ClientLayout";
import { JetBrains_Mono, Familjen_Grotesk } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen-grotesk", // CSS-Variable für das Theme
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      className={`${jetbrainsMono.variable} ${familjenGrotesk.variable}`}
    >
      <body className="overflow-x-hidden w-full">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

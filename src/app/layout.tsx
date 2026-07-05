import { ReactNode } from "react";
import { AuthProvider } from "@/BackEnd/AuthContext";
import ClientLayout from "./ClientLayout";
import { JetBrains_Mono, Familjen_Grotesk } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen-grotesk", // CSS-Variable für das Theme
  display: "swap",
  preload: false,
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
        <Analytics />
      </body>
    </html>
  );
}

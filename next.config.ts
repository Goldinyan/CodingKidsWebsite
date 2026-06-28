import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  },
  reactStrictMode: false, // Schaltet das doppelte Rendern im Dev-Modus ab

  allowedDevOrigins: ["192.168.178.113"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options", // verbietet das Einbetten der Seite in iframes
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options", // verbietet optimizations von browser, damit keine malicious scripts ausgeführt werden, die als andere dateitypen getarnt sind
            value: "nosniff",
          },
          
          {
            key: "Content-Security-Policy", // Skripte und Bilder und so nur von meiner domain laden, sonst blocken, und firebase
            value:
              "default-src 'self'; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

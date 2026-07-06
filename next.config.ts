import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  },
  reactStrictMode: false, // Schaltet das doppelte Rendern im Dev-Modus ab

  allowedDevOrigins: ["192.168.178.113:3000", "192.168.178.113"], // Port optional mit aufnehmen, falls HMR meckert

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options", // Verbietet das Einbetten der Seite in iFrames (Schutz vor Clickjacking)
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options", // Verhindert MIME-Type Sniffing
            value: "nosniff",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              // connect-src: Erlaubt API-Requests zu deiner Domain, Firebase (DB/Auth) und Vercel Analytics Datentransfer
              "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://va.vercel-scripts.com;",
              // script-src: Erlaubt eigene Skripte, Dev-Inline-Scripts und die Vercel-Analytics-Skripte
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;",
              // style-src: Erlaubt Next.js Styles und Tailwind CSS Injections
              "style-src 'self' 'unsafe-inline';",
              // img-src: Erlaubt lokale Bilder und Data-URLs (z.B. base64-Platzhalter)
              "img-src 'self' data:;",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

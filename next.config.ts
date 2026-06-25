import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  },
  reactStrictMode: false, // Schaltet das doppelte Rendern im Dev-Modus ab

  allowedDevOrigins: ["192.168.178.113"],
};

export default nextConfig;

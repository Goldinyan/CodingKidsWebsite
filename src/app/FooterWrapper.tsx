"use client";

import Image from "next/image";
import logoTransparent from "@/public/Logo_aussen_Transparent.png";
import { useRouter } from "next/navigation";

// FooterWrapper.tsx
export default function FooterWrapper() {
  const router = useRouter();

  return (
    <footer
      className="border-t py-8"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center">
            <Image
              src={logoTransparent}
              alt="CoderDojo Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <span
              className="font-black text-sm text-white "
              style={{ fontFamily: "'Familjen Grotesk', sans-serif" }}
            >
              CodingKids
            </span>
            <span
              className="text-[10px] ml-1.5"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#374151",
              }}
            >
              Niederrhein e.V. · © 2026
            </span>
          </div>
        </button>
        <div
          className="flex items-center gap-5 text-xs"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#4b5563",
          }}
        >
          {[
            { label: "Impressum", href: "/impressum" },
            { label: "Datenschutz", href: "/datenschutz" },
            {
              label: "Kontakt",
              href: "mailto:vorstand@codingkids-niederrhein.de",
            },
          ].map(({ label, href }) => (
            <button
              key={label}
              onClick={() => {
                router.push(href);
              }}
              className="no-underline transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

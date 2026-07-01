"use client";

import Image from "next/image";
import logoTransparent from "@/public/Logo_aussen_Transparent.png";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function FooterWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  
  const isDark = theme === "dark";
  const hideFooter = pathname.startsWith("/dashboard");

  if (hideFooter) return null;

  return (
    <footer
      className={`border-t py-8 transition-colors duration-200 ${
        isDark ? "bg-zinc-950 border-zinc-900" : "bg-white border-slate-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center">
            <Image
              src={logoTransparent}
              alt="CodingKids Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <span className={`font-gro font-black text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
              CodingKids
            </span>
            <span
              className={`text-[10px] font-mono ml-1.5 ${isDark ? "text-zinc-600" : "text-slate-500"}`}
            >
              Niederrhein e.V. · © 2026
            </span>
          </div>
        </button>

        <div className="flex items-center font-mono gap-5 text-xs">
          {[
            { label: "Impressum", href: "/impressum" },
            { label: "Datenschutz", href: "/datenschutz" },
            {
              label: "Kontakt",
              href: "mailto:vorstand@codingkids-niederrhein.de",
            },
          ].map(({ label, href }) => {
            const isExternal = href.startsWith("mailto:");
            return isExternal ? (
              <a
                key={label}
                href={href}
                className={`transition-colors ${isDark ? "text-zinc-600 hover:text-zinc-400" : "text-slate-500 hover:text-slate-700"}`}
              >
                {label}
              </a>
            ) : (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`transition-colors ${isDark ? "text-zinc-600 hover:text-zinc-400" : "text-slate-500 hover:text-slate-700"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

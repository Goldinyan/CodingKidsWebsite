"use client";

import { Mail, ExternalLink } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const partners = [
  { name: "CUBES Wesel", role: "Veranstaltungsort" },
  { name: "Goldkind Fotografie", role: "Medienpartner" },
  { name: "Niederrheinische Sparkasse RheinLippe", role: "Förderer" },
  { name: "Kons-Pusnik", role: "Partner" },
] as const;

export default function Partners() {
  const { theme, isRounded } = useTheme();

  const radiusClass = isRounded ? "rounded-lg" : "rounded-none";

  return (
    <section
      id="verein"
      className="w-full max-w-6xl mx-auto py-20 px-6 "
    >
      <div className="mb-14 text-left">
        <span
          className={`font-['JetBrains_Mono'] text-[10px] tracking-[0.22em] uppercase block mb-2 ${theme === "dark" ? "text-[#4ADE80]" : "text-green-600"
            }`}
        >
          Der Verein
        </span>
        <h2
          className={`text-3xl md:text-4xl font-black font-['Familjen_Grotesk'] tracking-tight leading-none uppercase ${theme === "dark" ? "text-white" : "text-slate-900"
            }`}
        >
          CodingKids Programmierclub Niederrhein e.V.
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          className={`xl:col-span-2 p-6 border transition-all duration-200 ${radiusClass} ${theme === "dark"
              ? "bg-[rgba(255,255,255,0.015)] border-zinc-900 text-zinc-400"
              : "bg-white border-slate-200 text-slate-600"
            }`}
        >
          <p className="text-xs md:text-sm leading-relaxed mb-4">
            Wir verfolgen das Ziel, Kinder und Jugendliche zwischen 8 und 17
            Jahren näher an die IT zu bringen und Fähigkeiten im Umgang mit dem
            Computer zu vermitteln, sowie eigenständige Soft- und
            Hardwareprogrammierung zu lehren.
          </p>
          <p className="text-sm leading-relaxed">
            Dafür nutzen wir Inhalte der weltweit organisierten Gruppierung{" "}
            <a
              href="https://coderdojo.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-bold underline decoration-2 transition-colors duration-150 ${theme === "dark"
                  ? "text-[#4ADE80] hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
                }`}
            >
              CoderDojo
            </a>
            , die dasselbe Ziel verfolgt. Die Kinder lernen zunächst spielerisch
            und in Gruppenarbeit zu programmieren.
          </p>

          <div
            className={`mt-8 pt-6 border-t ${theme === "dark" ? "border-zinc-900" : "border-slate-100"}`}
          >
            <div
              className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-4 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Unsere Partner
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partners.map((p) => (
                <div
                  key={p.name}
                  className={`p-4 border group transition-colors duration-150 ${radiusClass} ${theme === "dark"
                      ? "bg-zinc-950/40 border-zinc-900 hover:border-[#4ADE80]"
                      : "bg-slate-50 border-slate-200 hover:border-green-600"
                    }`}
                >
                  <div
                    className={`text-xs md:text-sm font-black font-['Familjen_Grotesk'] tracking-wide uppercase ${theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                  >
                    {p.name}
                  </div>
                  <div
                    className={`text-[10px] font-['JetBrains_Mono'] mt-1 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                      }`}
                  >
                    {p.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div
            className={`p-6 border transition-all duration-200 ${radiusClass} ${theme === "dark"
                ? "bg-[rgba(255,255,255,0.015)] border-zinc-900"
                : "bg-white border-slate-200"
              }`}
          >
            <div
              className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-3 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Support
            </div>
            <h4
              className={`text-lg font-black font-['Familjen_Grotesk'] tracking-wide uppercase mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Partner werden
            </h4>
            <p
              className={`text-xs leading-relaxed mb-5 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}
            >
              Nur durch unsere Partner können wir die kostenlosen CoderDojos
              finanzieren.
            </p>
            <a
              href="mailto:vorstand@codingkids-niederrhein.de"
              className={`inline-flex items-center gap-2 font-['JetBrains_Mono'] text-xs font-bold uppercase transition-colors duration-150 ${theme === "dark"
                  ? "text-[#4ADE80] hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
                }`}
            >
              <Mail className="w-3.5 h-3.5" />
              E-Mail schreiben
            </a>
          </div>

          <div
            className={`p-6 border transition-all duration-200 ${radiusClass} ${theme === "dark"
                ? "bg-[rgba(255,255,255,0.015)] border-zinc-900"
                : "bg-white border-slate-200"
              }`}
          >
            <div
              className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-3 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Netzwerk
            </div>
            <h4
              className={`text-md md:text-lg font-black font-['Familjen_Grotesk'] tracking-wide uppercase mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Mitglied bei CoderDojo
            </h4>
            <p
              className={`text-xs leading-relaxed mb-5 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}
            >
              Teil einer weltweiten Bewegung, die Kindern das Programmieren
              beibringt.
            </p>
            <a
              href="https://coderdojo.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs font-bold uppercase transition-colors duration-150 ${theme === "dark"
                  ? "text-[#4ADE80] hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
                }`}
            >
              coderdojo.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

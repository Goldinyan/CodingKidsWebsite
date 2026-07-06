"use client";

import { motion, Variants } from "framer-motion";
import {
  Users,
  Gift,
  UserPlus,
  ScrollText,
  Coins,
  Check,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function Support() {
  const { theme, isRounded } = useTheme();
  const router = useRouter();

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "tween", ease: "easeOut", duration: 0.3 },
    },
  };

  const radiusClass = isRounded ? "rounded-lg" : "rounded-none";
  const btnRadiusClass = isRounded ? "rounded-md" : "rounded-none";

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-6 ">
      <motion.div
        variants={itemVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full text-left mb-16"
      >
        <span
          className={`font-['JetBrains_Mono'] text-[10px] tracking-[0.22em] uppercase block mb-2 ${theme === "dark" ? "text-[#4ADE80]" : "text-green-600"
            }`}
        >
          Gemeinsam Zukunft gestalten
        </span>

        <h2
          className={`text-3xl md:text-4xl font-black font-['Familjen_Grotesk'] tracking-tight leading-none uppercase max-w-3xl ${theme === "dark" ? "text-white" : "text-slate-900"
            }`}
        >
          Werden Sie Teil unserer Mission
        </h2>
        <p
          className={`md:text-md text-sm leading-relaxed mt-4 max-w-2xl ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
            }`}
        >
          Ihre Unterstützung als Mitglied oder Förderer ermöglicht es uns,
          kostenlose CoderDojos anzubieten und die digitale Bildung der Region
          voranzutreiben.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-16">
        <motion.div
          variants={itemVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`p-6 border flex flex-col justify-between transition-colors duration-200 ${radiusClass} ${theme === "dark"
              ? "bg-[rgba(255,255,255,0.015)] border-zinc-900"
              : "bg-white border-slate-200"
            }`}
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-10 h-10 flex items-center justify-center flex-shrink-0 border ${radiusClass} ${theme === "dark"
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className={`text-xl font-black font-['Familjen_Grotesk'] tracking-wide uppercase ${theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                >
                  Mitglied werden
                </h3>
                <p
                  className={`text-[11px] font-['JetBrains_Mono'] ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
                >
                  Gestalten Sie aktiv mit!
                </p>
              </div>
            </div>

            <p
              className={`text-xs leading-relaxed mb-8 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
            >
              Als Mitglied im Coding Kids Niederrhein e.V. sind Sie Teil einer
              wachsenden Gemeinschaft, die sich für die Förderung von Kindern
              und Jugendlichen einsetzt. Ihr Beitrag hilft uns, unsere
              CoderDojos zu finanzieren, neue Technologien anzuschaffen und
              unsere Reichweite zu vergrößern. Eine Mitgliedschaft ist nicht
              nötig um teilnehmen zu können.
            </p>
          </div>

          {/* DOWNLOAD LINKS */}
          <div className="space-y-2.5">
            <a
              href="/files/Mitgliedsantrag.pdf"
              download
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase border transition-all duration-150 shadow-sm ${theme === "dark"
                  ? "bg-[#4ADE80] text-zinc-950 border-[#4ADE80] hover:bg-green-400"
                  : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                } ${btnRadiusClass}`}
            >
              <UserPlus size={14} />
              Mitgliedsantrag
            </a>

            <a
              href="/files/Vereinssatzung.pdf"
              download
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase border transition-all duration-150 ${theme === "dark"
                  ? "bg-zinc-950/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                } ${btnRadiusClass}`}
            >
              <ScrollText size={14} />
              Satzung des Vereins
            </a>

            <a
              href="/files/Beitragsordnung.pdf"
              download
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase border transition-all duration-150 ${theme === "dark"
                  ? "bg-zinc-950/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                } ${btnRadiusClass}`}
            >
              <Coins size={14} />
              Beitragsordnung
            </a>
          </div>
        </motion.div>

        {/* CARD 2: FÖRDERER WERDEN */}
        <motion.div
          variants={itemVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`p-6 border flex flex-col justify-between transition-colors duration-200 ${radiusClass} ${theme === "dark"
              ? "bg-[rgba(255,255,255,0.015)] border-zinc-900"
              : "bg-white border-slate-200"
            }`}
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-10 h-10 flex items-center justify-center flex-shrink-0 border ${radiusClass} ${theme === "dark"
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
              >
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className={`text-xl font-black font-['Familjen_Grotesk'] tracking-wide uppercase ${theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                >
                  Förderer werden
                </h3>
                <p
                  className={`text-[11px] font-['JetBrains_Mono'] ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
                >
                  Bewegen Sie viel mit Ihrer Spende!
                </p>
              </div>
            </div>

            <p
              className={`text-xs leading-relaxed mb-6 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
            >
              Ihre Spende macht einen direkten Unterschied. Sie ermöglicht uns,
              Laptops für Kinder ohne eigene Geräte bereitzustellen, spezielle
              Workshops mit Experten zu organisieren und Lehrmaterial zu
              entwickeln.
            </p>

            {/* CHECKLIST */}
            <div className="space-y-3 mb-8">
              {[
                {
                  title: "Hardware anschaffen:",
                  desc: "Laptops & Robotik-Kits für unsere Dojos.",
                },
                {
                  title: "Workshops ermöglichen:",
                  desc: "Raummieten und Materialkosten decken.",
                },
                {
                  title: "Reichweite vergrößern:",
                  desc: "Neue Standorte am Niederrhein erschließen.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 mt-0.5 rounded-sm ${theme === "dark"
                        ? "bg-zinc-950 border-zinc-800 text-[#4ADE80]"
                        : "bg-slate-50 border-slate-200 text-green-600"
                      }`}
                  >
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <p
                    className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
                  >
                    <span
                      className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                    >
                      {item.title}
                    </span>{" "}
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push("/spenden")}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase border transition-all duration-150 group/btn shadow-sm ${theme === "dark"
                ? "bg-[#4ADE80] text-zinc-950 border-[#4ADE80] hover:bg-green-400"
                : "bg-green-600 text-white border-green-600 hover:bg-green-700"
              } ${btnRadiusClass}`}
          >
            Vorstand kontaktieren
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* FOOTER CALLOUT (FAQ / QUESTIONS) */}
      <motion.div
        variants={itemVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`w-full p-8 md:p-10 border text-left flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${radiusClass} ${theme === "dark"
            ? "bg-[rgba(255,255,255,0.015)] border-zinc-900"
            : "bg-white border-slate-200"
          }`}
      >
        <div className="max-w-2xl">
          <span
            className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase block mb-1 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
              }`}
          >
            Unterstützung & Klärung
          </span>
          <h4
            className={`text-xl font-black font-['Familjen_Grotesk'] tracking-wide uppercase mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Haben Sie noch Fragen?
          </h4>
          <p
            className={`text-xs leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-slate-500"}`}
          >
            Wir beantworten gerne Ihre Fragen zur Mitgliedschaft, zu Spenden
            oder anderen Anliegen. Zögern Sie nicht, uns zu kontaktieren.
          </p>
        </div>

        <button
          onClick={() => router.push("/kontakt")}
          className={`px-6 py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase transition-all duration-150 self-start md:self-center whitespace-nowrap border ${theme === "dark"
              ? "bg-white text-zinc-950 border-white hover:bg-zinc-200"
              : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
            } ${btnRadiusClass}`}
        >
          Kontakt aufnehmen
        </button>
      </motion.div>
    </div>
  );
}

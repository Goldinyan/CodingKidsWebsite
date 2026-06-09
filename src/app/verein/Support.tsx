"use client";

import { motion } from "framer-motion";
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
import { Theme, useTheme } from "@/context/ThemeContext";

export default function Support() {
  const { theme, isRounded } = useTheme();
  const router = useRouter();

  const itemVariants = {
    hidden: {
      scale: 0.95,
      y: 30,
    },
    visible: {
      scale: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.25,
      },
    },
  };

  const cardBorderClass =
    theme === "dark" ? "border-zinc-800" : "border-zinc-200";
  const cardBgClass =
    theme === "dark"
      ? "bg-white/5 hover:bg-white/10"
      : "bg-zinc-50 hover:bg-zinc-100/70";
  const textTitleClass = theme === "dark" ? "text-white" : "text-black";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const btnPrimaryClass =
    theme === "dark"
      ? "bg-white text-black hover:bg-zinc-200"
      : "bg-black text-white hover:bg-zinc-800";

  const btnSecondaryClass =
    theme === "dark"
      ? "bg-transparent text-white border-zinc-700 hover:border-white hover:bg-white/5"
      : "bg-transparent text-black border-zinc-300 hover:border-black hover:bg-black/5";

  return (
    <div className="w-full">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: false }}
        className="w-full flex items-center justify-center py-20 px-8"
      >
        <div className="max-w-3xl text-center">
          <span
            className={`text-xs font-mono tracking-widest uppercase block mb-3 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}
          >
            Gemeinsam Zukunft gestalten
          </span>
          <h2
            className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${textTitleClass}`}
          >
            Werden Sie Teil unserer Mission
          </h2>
          <p className={`text-xl font-light leading-relaxed ${textMutedClass}`}>
            Ihre Unterstützung als Mitglied oder Förderer ermöglicht es uns,
            kostenlose CoderDojos anzubieten und die digitale Bildung der Region
            voranzutreiben.
          </p>
        </div>
      </motion.div>

      <div className="w-full px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false }}
            className={`group p-8 border backdrop-blur-sm duration-300 flex flex-col justify-between ${cardBorderClass} ${cardBgClass} ${isRounded ? "rounded-2xl" : "rounded-none"
              }`}
          >
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-12 h-12 flex items-center justify-center flex-shrink-0 transition-colors ${theme === "dark"
                      ? "bg-white/10 group-hover:bg-white/20"
                      : "bg-black/5 group-hover:bg-black/10"
                    } ${isRounded ? "rounded-lg" : "rounded-none"}`}
                >
                  <Users
                    className={`w-6 h-6 transition-colors ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-zinc-700 group-hover:text-black"}`}
                  />
                </div>
                <div>
                  <h3 className={`text-2xl font-semibold ${textTitleClass}`}>
                    Mitglied werden
                  </h3>
                  <p className={textMutedClass}>Gestalten Sie aktiv mit!</p>
                </div>
              </div>

              <p className={`text-sm leading-relaxed mb-8 ${textMutedClass}`}>
                Als Mitglied im Coding Kids Niederrhein e.V. sind Sie Teil einer
                wachsenden Gemeinschaft, die sich für die Förderung von Kindern
                und Jugendlichen einsetzt. Ihr Beitrag hilft uns, unsere
                CoderDojos zu finanzieren, neue Technologien anzuschaffen und
                unsere Reichweite zu vergrößern. Eine Mitgliedschaft ist nicht
                nötig um teilnehmen zu können.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/files/Mitgliedsantrag.pdf"
                download
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-100 text-sm shadow-sm ${btnPrimaryClass} ${isRounded ? "rounded-md" : "rounded-none"
                  }`}
              >
                <UserPlus size={16} />
                Mitgliedsantrag
              </a>

              <a
                href="/files/Vereinssatzung.pdf"
                download
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-medium border transition-all duration-200 hover:scale-[1.02] active:scale-100 text-sm ${btnSecondaryClass} ${isRounded ? "rounded-md" : "rounded-none"
                  }`}
              >
                <ScrollText size={16} />
                Satzung des Vereins
              </a>

              <a
                href="/files/Beitragsordnung.pdf"
                download
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-medium border transition-all duration-200 hover:scale-[1.02] active:scale-100 text-sm ${btnSecondaryClass} ${isRounded ? "rounded-md" : "rounded-none"
                  }`}
              >
                <Coins size={16} />
                Beitragsordnung
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false }}
            className={`group p-8 border backdrop-blur-sm duration-300 flex flex-col justify-between ${cardBorderClass} ${cardBgClass} ${isRounded ? "rounded-2xl" : "rounded-none"
              }`}
          >
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-12 h-12 flex items-center justify-center flex-shrink-0 transition-colors ${theme === "dark"
                      ? "bg-white/10 group-hover:bg-white/20"
                      : "bg-black/5 group-hover:bg-black/10"
                    } ${isRounded ? "rounded-lg" : "rounded-none"}`}
                >
                  <Gift
                    className={`w-6 h-6 transition-colors ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-zinc-700 group-hover:text-black"}`}
                  />
                </div>
                <div>
                  <h3 className={`text-2xl font-semibold ${textTitleClass}`}>
                    Förderer werden
                  </h3>
                  <p className={textMutedClass}>
                    Bewegen Sie viel mit Ihrer Spende!
                  </p>
                </div>
              </div>

              <p className={`text-sm leading-relaxed mb-8 ${textMutedClass}`}>
                Ihre Spende macht einen direkten Unterschied. Sie ermöglicht
                uns, Laptops für Kinder ohne eigene Geräte bereitzustellen,
                spezielle Workshops mit Experten zu organisieren und
                Lehrmaterial zu entwickeln.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === "dark"
                        ? "bg-white/5 border-white/10"
                        : "bg-black/5 border-black/10"
                      } ${isRounded ? "rounded" : "rounded-none"}`}
                  >
                    <Check
                      className={`w-3 h-3 ${theme === "dark" ? "text-white" : "text-black"}`}
                    />
                  </div>
                  <p className={`${textMutedClass} text-sm`}>
                    <span className={`font-semibold ${textTitleClass}`}>
                      Hardware anschaffen:
                    </span>{" "}
                    Laptops & Robotik-Kits für unsere Dojos.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === "dark"
                        ? "bg-white/5 border-white/10"
                        : "bg-black/5 border-black/10"
                      } ${isRounded ? "rounded" : "rounded-none"}`}
                  >
                    <Check
                      className={`w-3 h-3 ${theme === "dark" ? "text-white" : "text-black"}`}
                    />
                  </div>
                  <p className={`${textMutedClass} text-sm`}>
                    <span className={`font-semibold ${textTitleClass}`}>
                      Workshops ermöglichen:
                    </span>{" "}
                    Raummieten und Materialkosten decken.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === "dark"
                        ? "bg-white/5 border-white/10"
                        : "bg-black/5 border-black/10"
                      } ${isRounded ? "rounded" : "rounded-none"}`}
                  >
                    <Check
                      className={`w-3 h-3 ${theme === "dark" ? "text-white" : "text-black"}`}
                    />
                  </div>
                  <p className={`${textMutedClass} text-sm`}>
                    <span className={`font-semibold ${textTitleClass}`}>
                      Reichweite vergrößern:
                    </span>{" "}
                    Neue Standorte am Niederrhein erschließen.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/spenden")}
              className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-100 text-sm group/btn shadow-sm ${btnPrimaryClass} ${isRounded ? "rounded-md" : "rounded-none"
                }`}
            >
              Vorstand kontaktieren
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: false }}
        className="w-full px-8 py-16"
      >
        <div
          className={`max-w-4xl mx-auto p-12 border backdrop-blur-sm duration-300 text-center flex flex-col items-center ${cardBorderClass} ${theme === "dark" ? "bg-white/5" : "bg-zinc-50"
            } ${isRounded ? "rounded-2xl" : "rounded-none"}`}
        >
          <span
            className={`text-xs font-mono tracking-widest uppercase block mb-3 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}
          >
            Unterstützung & Klärung
          </span>
          <h2 className={`text-3xl font-bold mb-4 ${textTitleClass}`}>
            Haben Sie noch Fragen?
          </h2>
          <p
            className={`text-lg mb-8 leading-relaxed font-light max-w-2xl ${textMutedClass}`}
          >
            Wir beantworten gerne Ihre Fragen zur Mitgliedschaft, zu Spenden
            oder anderen Anliegen. Zögern Sie nicht, uns zu kontaktieren.
          </p>

          <button
            onClick={() => router.push("/kontakt")}
            className={`px-8 py-3 font-medium transition-all duration-200 hover:scale-105 active:scale-100 shadow-sm ${btnPrimaryClass} ${isRounded ? "rounded-md" : "rounded-none"
              }`}
          >
            Kontakt aufnehmen
          </button>
        </div>
      </motion.div>
    </div>
  );
}

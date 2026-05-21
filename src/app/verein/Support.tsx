"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Gift,
  UserPlus,
  ScrollText,
  Coins,
  Check,
  Hammer,
  BookOpenCheck,
  MapPinned,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Support() {
  const router = useRouter();

  return (
    <div className="w-full bg-black">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full flex items-center justify-center py-20 px-8"
      >
        <div className="max-w-3xl text-center">
          <p className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">
            Gemeinsam Zukunft gestalten
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Werden Sie Teil unserer Mission
          </h2>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            Ihre Unterstützung als Mitglied oder Förderer ermöglicht es uns,
            kostenlose CoderDojos anzubieten und die digitale Bildung der Region
            voranzutreiben.
          </p>
        </div>
      </motion.div>

      {/* Cards Section */}
      <div className="w-full px-8 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Membership Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group p-8 bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/8 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                <Users className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Mitglied werden
                </h3>
                <p className="text-gray-400 mt-1">Gestalten Sie aktiv mit!</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Als Mitglied im Coding Kids Niederrhein e.V. sind Sie Teil einer
              wachsenden Gemeinschaft, die sich für die Förderung von Kindern und
              Jugendlichen einsetzt. Ihr Beitrag hilft uns, unsere CoderDojos zu
              finanzieren, neue Technologien anzuschaffen und unsere Reichweite
              zu vergrößern. Eine Mitgliedschaft ist nicht nötig um teilnehmen
              zu können.
            </p>

            <div className="space-y-3">
              <a
                href="/files/Mitgliedsantrag.pdf"
                download
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-100 text-sm"
              >
                <UserPlus size={16} />
                Mitgliedsantrag
              </a>

              <a
                href="/files/Vereinssatzung.pdf"
                download
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent text-white font-medium border border-gray-400 hover:border-white hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-100 text-sm"
              >
                <ScrollText size={16} />
                Satzung des Vereins
              </a>

              <a
                href="/files/Beitragsordnung.pdf"
                download
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent text-white font-medium border border-gray-400 hover:border-white hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-100 text-sm"
              >
                <Coins size={16} />
                Beitragsordnung
              </a>
            </div>
          </motion.div>

          {/* Donation Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group p-8 bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/8 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                <Gift className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Förderer werden
                </h3>
                <p className="text-gray-400 mt-1">
                  Bewegen Sie viel mit Ihrer Spende!
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Ihre Spende macht einen direkten Unterschied. Sie ermöglicht uns,
              Laptops für Kinder ohne eigene Geräte bereitzustellen, spezielle
              Workshops mit Experten zu organisieren und Lehrmaterial zu
              entwickeln.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white/10 border border-white/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-white">Hardware anschaffen:</span>{" "}
                  Laptops & Robotik-Kits für unsere Dojos.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white/10 border border-white/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-white">Workshops ermöglichen:</span>{" "}
                  Raummieten und Materialkosten decken.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white/10 border border-white/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-white">Reichweite vergrößern:</span> Neue
                  Standorte am Niederrhein erschließen.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/spenden")}
              className="w-full px-4 py-3 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-100 flex items-center justify-center gap-2 group/btn"
            >
              Vorstand kontaktieren
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full px-8 py-20"
      >
        <div className="max-w-2xl mx-auto p-12 bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
          <h2 className="text-3xl font-bold text-white mb-4">
            Haben Sie noch Fragen?
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light">
            Wir beantworten gerne Ihre Fragen zur Mitgliedschaft, zu Spenden oder
            anderen Anliegen. Zögern Sie nicht, uns zu kontaktieren.
          </p>

          <button
            onClick={() => router.push("/kontakt")}
            className="px-8 py-3 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-100"
          >
            Kontakt aufnehmen
          </button>
        </div>
      </motion.div>
    </div>
  );
}

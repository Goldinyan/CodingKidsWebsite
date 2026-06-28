const partners = [
  { name: "CUBES Wesel", role: "Veranstaltungsort" },
  { name: "Goldkind Fotografie", role: "Medienpartner" },
  { name: "Niederrheinische Sparkasse RheinLippe", role: "Förderer" },
  { name: "Kons-Pusnik", role: "Partner" },
];

import { Mail, ExternalLink } from "lucide-react";
import SectionLabel from "../homepage/components/SectionLabel";
import SectionHeading from "../homepage/components/SectionHeading";
import GlassCard from "../homepage/components/GlassCard";

export default function Partners() {
  return (
    <section id="verein" className="py-14 px-4">
      <div className="mb-8">
        <SectionLabel>Der Verein</SectionLabel>
        <SectionHeading>
          CodingKids Programmierclub Niederrhein e.V.
        </SectionHeading>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-6">
          <p
            className="text-[14px] leading-relaxed mb-4"
            style={{ color: "#9ca3af" }}
          >
            Wir verfolgen das Ziel, Kinder und Jugendliche zwischen 8 und 17
            Jahren näher an die IT zu bringen und Fähigkeiten im Umgang mit dem
            Computer zu vermitteln — sowie eigenständige Soft- und
            Hardwareprogrammierung zu lehren.
          </p>
          <p className="text-[14px] leading-relaxed" style={{ color: "#9ca3af" }}>
            Dafür nutzen wir Inhalte der weltweit organisierten Gruppierung{" "}
            <a
              href="https://coderdojo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline transition-colors"
              style={{ color: "#4ade80" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#86efac")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4ade80")}
            >
              CoderDojo
            </a>
            , die dasselbe Ziel verfolgt. Die Kinder lernen zunächst spielerisch
            und in Gruppenarbeit zu programmieren.
          </p>
          <div
            className="mt-5 pt-5 border-t"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="text-[10px] font-mono uppercase tracking-widest mb-3"
              style={{
                color: "#6b7280",
              }}
            >
              Unsere Partner
            </div>
            <div className="flex flex-wrap gap-2">
              {partners.map((p) => (
                <div
                  key={p.name}
                  className="px-3 py-1.5 rounded-lg border"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="text-[14px] font-gro font-semibold text-white"
                  >
                    {p.name}
                  </div>
                  <div
                    className="text-[10px] font-mono"
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    {p.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="flex flex-col gap-4">
          <GlassCard className="p-5">
            <div
              className="text-[10px] uppercase font-mono tracking-widest mb-3"
              style={{
                color: "#6b7280",
              }}
            >
              Partner werden
            </div>
            <p className="text-[14px] mb-4" style={{ color: "#9ca3af" }}>
              Nur durch unsere Partner können wir die kostenlosen CoderDojos
              finanzieren.
            </p>
            <a
              href="mailto:vorstand@codingkids-niederrhein.de"
              className="flex items-center gap-2 text-[14px] no-underline transition-colors"
              style={{ color: "#4ade80" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#86efac")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4ade80")}
            >
              <Mail className="w-4 h-4" />
              vorstand@codingkids-niederrhein.de
            </a>
          </GlassCard>

          <GlassCard className="p-5">
            <div
              className="text-[10px] uppercase font-mono tracking-widest mb-3"
              style={{
                color: "#6b7280",
              }}
            >
              Mitglied bei CoderDojo
            </div>
            <p className="text-[14px] mb-4" style={{ color: "#9ca3af" }}>
              Teil einer weltweiten Bewegung, die Kindern das Programmieren
              beibringt.
            </p>
            <a
              href="https://coderdojo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[14px] no-underline transition-colors"
              style={{ color: "#4ade80" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#86efac")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4ade80")}
            >
              coderdojo.com <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

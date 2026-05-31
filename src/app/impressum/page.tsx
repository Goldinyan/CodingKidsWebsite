"use client";

import { useTheme } from "@/context/ThemeContext";

export default function Impressum() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen w-full relative main-view-container px-4 py-22 ${theme === "dark" ? "bg-black" : "bg-slate-50"
        }`}
    >
      <div className="absolute inset-0 bg-grid-pattern z-0" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div
          className={`${theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200"
            } border rounded-lg backdrop-blur-sm p-8 mb-8`}
        >
          <h1
            className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Impressum
          </h1>
          <p
            className={`${theme === "dark" ? "text-gray-400" : "text-slate-600"
              } text-lg`}
          >
            CodingKids Programmierclub Niederrhein e.V.
          </p>
        </div>

        <div
          className={`${theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200"
            } border rounded-lg backdrop-blur-sm p-8 space-y-8`}
        >
          <section>
            <h2
              className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Kontaktdaten
            </h2>
            <div
              className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                } space-y-2`}
            >
              <p>CodingKids Programmierclub Niederrhein e.V.</p>
              <p>Alte Raesfelder Str. 9a</p>
              <p>46514 Schermbeck</p>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:info@codingkids-niederrhein.de"
                  className={`${theme === "dark"
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-700"
                    } transition-colors`}
                >
                  info@codingkids-niederrhein.de
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Vorstand i. S. d. § 26 BGB
            </h2>
            <div
              className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                } space-y-4`}
            >
              <div>
                <p className="font-semibold">Michael Janßen</p>
                <p
                  className={
                    theme === "dark" ? "text-gray-400" : "text-slate-600"
                  }
                >
                  1. Vorsitzender
                </p>
              </div>
              <div>
                <p className="font-semibold">Daniel Janßen</p>
                <p
                  className={
                    theme === "dark" ? "text-gray-400" : "text-slate-600"
                  }
                >
                  2. Vorsitzender
                </p>
              </div>
              <div>
                <p className="font-semibold">Nicky Winkler-Janßen</p>
                <p
                  className={
                    theme === "dark" ? "text-gray-400" : "text-slate-600"
                  }
                >
                  Schatzmeisterin
                </p>
              </div>
              <p className="pt-4">
                E-Mail:{" "}
                <a
                  href="mailto:vorstand@codingkids-niederrhein.de"
                  className={`${theme === "dark"
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-700"
                    } transition-colors`}
                >
                  vorstand@codingkids-niederrhein.de
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Registergericht
            </h2>
            <div
              className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                } space-y-2`}
            >
              <p>Amtsgericht Duisburg</p>
              <p>Register-Nr. VR 6314</p>
            </div>
          </section>

          <section>
            <h2
              className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Inhaltlich Verantwortlicher gemäß Paragraph 6 MDStV
            </h2>
            <div
              className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                } space-y-2`}
            >
              <p>Michael Janßen</p>
              <p>Alte Raesfelder Str. 9a</p>
              <p>46514 Schermbeck</p>
            </div>
          </section>

          <section
            className={
              theme === "dark"
                ? "border-t border-white/10 pt-8"
                : "border-t border-slate-200 pt-8"
            }
          >
            <p
              className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                } text-sm mb-2`}
            >
              Copyright © 2022
            </p>
            <p
              className={`${theme === "dark" ? "text-gray-400" : "text-slate-600"
                } text-sm`}
            >
              Diese Seite wurde erstellt und wird betreut durch Michael Janßen -{" "}
              <a
                href="mailto:m.janssen@codingkids-niederrhein.de"
                className={`${theme === "dark"
                    ? "text-green-400 hover:text-green-300"
                    : "text-green-600 hover:text-green-700"
                  } transition-colors`}
              >
                m.janssen@codingkids-niederrhein.de
              </a>
              . Alle Rechte vorbehalten.
            </p>
          </section>

          <section
            className={
              theme === "dark"
                ? "border-t border-white/10 pt-8"
                : "border-t border-slate-200 pt-8"
            }
          >
            <h2
              className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"
                }`}
            >
              Haftungsausschluss
            </h2>

            <div className="mb-6">
              <h3
                className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-gray-200" : "text-slate-800"
                  }`}
              >
                Inhalt des Onlineangebotes
              </h3>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed mb-3`}
              >
                Der Autor übernimmt keinerlei Gewähr für die Aktualität,
                Korrektheit, Vollständigkeit oder Qualität der bereitgestellten
                Informationen. Haftungsansprüche gegen den Autor, welche sich
                auf Schäden materieller oder ideeller Art beziehen, die durch
                die Nutzung oder Nichtnutzung der dargebotenen Informationen
                bzw. durch die Nutzung fehlerhafter und unvollständiger
                Informationen verursacht wurden, sind grundsätzlich
                ausgeschlossen, sofern seitens des Autors kein nachweislich
                vorsätzliches oder grob fahrlässiges Verschulden vorliegt.
              </p>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed mb-3`}
              >
                Alle Angebote sind freibleibend und unverbindlich. Der Autor
                behält es sich ausdrücklich vor, Teile der Seiten oder das
                gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu
                ergänzen, zu löschen oder die Veröffentlichung zeitweise oder
                endgültig einzustellen.
              </p>
            </div>

            <div className="mb-6">
              <h3
                className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-gray-200" : "text-slate-800"
                  }`}
              >
                Verweise und Links
              </h3>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed mb-3`}
              >
                Bei direkten oder indirekten Verweisen auf fremde Webseiten
                (&qoutHyperlinks&qout), die außerhalb des
                Verantwortungsbereiches des Autors liegen, würde eine
                Haftungsverpflichtung ausschließlich in dem Fall in Kraft
                treten, in dem der Autor von den Inhalten Kenntnis hat und es
                ihm technisch möglich und zumutbar wäre, die Nutzung im Falle
                rechtswidriger Inhalte zu verhindern.
              </p>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed mb-3`}
              >
                Der Autor erklärt hiermit ausdrücklich, dass zum Zeitpunkt der
                Linksetzung keine illegalen Inhalte auf den zu verlinkenden
                Seiten erkennbar waren. Auf die aktuelle und zukünftige
                Gestaltung, die Inhalte oder die Urheberschaft der
                verlinkten/verknüpften Seiten hat der Autor keinerlei Einfluss.
                Deshalb distanziert er sich hiermit ausdrücklich von allen
                Inhalten aller verlinkten /verknüpften Seiten, die nach der
                Linksetzung verändert wurden. Diese Feststellung gilt für alle
                innerhalb des eigenen Internetangebotes gesetzten Links und
                Verweise sowie für Fremdeinträge in vom Autor eingerichteten
                Gästebüchern, Diskussionsforen, Linkverzeichnissen,
                Mailinglisten und in allen anderen Formen von Datenbanken, auf
                deren Inhalt externe Schreibzugriffe möglich sind. Für illegale,
                fehlerhafte oder unvollständige Inhalte und insbesondere für
                Schäden, die aus der Nutzung oder Nichtnutzung solcherart
                dargebotener Informationen entstehen, haftet allein der Anbieter
                der Seite, auf welche verwiesen wurde, nicht derjenige, der über
                Links auf die jeweilige Veröffentlichung lediglich verweist.
              </p>
            </div>

            <div className="mb-6">
              <h3
                className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-gray-200" : "text-slate-800"
                  }`}
              >
                Urheber- und Kennzeichenrecht
              </h3>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed mb-3`}
              >
                Der Autor ist bestrebt, in allen Publikationen die Urheberrechte
                der verwendeten Bilder, Grafiken, Tondokumente, Videosequenzen
                und Texte zu beachten, von ihm selbst erstellte Bilder,
                Grafiken, Tondokumente, Videosequenzen und Texte zu nutzen oder
                auf lizenzfreie Grafiken, Tondokumente, Videosequenzen und Texte
                zurückzugreifen.
              </p>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed mb-3`}
              >
                Alle innerhalb des Internetangebotes genannten und ggf. durch
                Dritte geschützten Marken- und Warenzeichen unterliegen
                uneingeschränkt den Bestimmungen des jeweils gültigen
                Kennzeichenrechts und den Besitzrechten der jeweiligen
                eingetragenen Eigentümer. Allein aufgrund der bloßen Nennung ist
                nicht der Schluss zu ziehen, dass Markenzeichen nicht durch
                Rechte Dritter geschützt sind!
              </p>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed`}
              >
                Das Copyright für veröffentlichte, vom Autor selbst erstellte
                Objekte bleibt allein beim Autor der Seiten. Eine
                Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente,
                Videosequenzen und Texte in anderen elektronischen oder
                gedruckten Publikationen ist ohne ausdrückliche Zustimmung des
                Autors nicht gestattet.
              </p>
            </div>

            <div className="mb-6">
              <h3
                className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-gray-200" : "text-slate-800"
                  }`}
              >
                Datenschutz
              </h3>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed`}
              >
                Alle Informationen zum Datenschutz finden Sie in unserer
                Datenschutzerklärung.
              </p>
            </div>

            <div>
              <h3
                className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-gray-200" : "text-slate-800"
                  }`}
              >
                Rechtswirksamkeit dieses Haftungsausschlusses
              </h3>
              <p
                className={`${theme === "dark" ? "text-gray-300" : "text-slate-700"
                  } leading-relaxed`}
              >
                Dieser Haftungsausschluss ist als Teil des Internetangebotes zu
                betrachten, von dem aus auf diese Seite verwiesen wurde. Sofern
                Teile oder einzelne Formulierungen dieses Textes der geltenden
                Rechtslage nicht, nicht mehr oder nicht vollständig entsprechen
                sollten, bleiben die übrigen Teile des Dokumentes in ihrem
                Inhalt und ihrer Gültigkeit davon unberührt.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

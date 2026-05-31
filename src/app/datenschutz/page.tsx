"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sub } from "@radix-ui/react-navigation-menu";
import { ArrowUp } from "lucide-react";

interface TableOfContentsItem {
  id: string;
  label: string;
  level: number;
}

const Datenschutz = () => {
  const { theme } = useTheme();

  const tableOfContents: TableOfContentsItem[] = [
    { id: "overview", label: "Datenschutz auf einen Blick", level: 1 },
    { id: "hosting", label: "Hosting", level: 1 },
    {
      id: "general",
      label: "Allgemeine Hinweise und Pflichtinformationen",
      level: 1,
    },
    {
      id: "data-collection",
      label: "Datenerfassung auf dieser Website",
      level: 1,
    },
    { id: "social-media", label: "Soziale Medien", level: 1 },
    { id: "newsletter", label: "Newsletter", level: 1 },
    { id: "plugins", label: "Plugins und Tools", level: 1 },
  ];

  /*
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }; */

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // timeout für trennung vom dom damit animation smooth ist sonst id zu langsam
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    }
  };

  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <div
      id={id}
      className={`${theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-white border-slate-200"
        } border rounded-none scroll-mt-[90px] backdrop-blur-sm p-8 mb-6`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"
          }`}
      >
        {title}
      </h2>
      <div
        className={`${theme === "dark" ? "text-gray-200" : "text-slate-700"
          } space-y-4 leading-relaxed`}
      >
        {children}
      </div>
    </div>
  );

  const SubSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mt-6">
      <h3
        className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-gray-200" : "text-slate-800"
          }`}
      >
        {title}
      </h3>
      <div className="space-y-3 text-gray-400">{children}</div>
    </div>
  );

  return (
    <div
      id="top"
      className={`min-h-screen w-full relative main-view-container transition-all duration-300 px-4 py-22 ${theme === "dark" ? "bg-black" : "bg-slate-50"
        }`}
    >
      <div className={`absolute inset-0 bg-grid-pattern z-0`} />

      <div
        onClick={() => scrollToSection("top")}
        className={`fixed w-14 h-14 bottom-25 border border-border/50 group-hover:border-border/70 transition-all duration-400 right-6   -full  z-20 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-md flex items-center justify-center ${theme == "dark" ? " text-slate-300 " : " text-amber-500"}`}
      >
        <ArrowUp />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div
          className={`${theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200"
            } border  -lg backdrop-blur-sm p-8 mb-8`}
        >
          <h1
            className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Datenschutzerklärung
          </h1>
          <p
            className={`${theme === "dark" ? "text-gray-500" : "text-slate-600"
              } text-md`}
          >
            CodingKids Programmierclub Niederrhein e.V.
          </p>
        </div>

        <div
          className={`${theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200"
            } border  -lg backdrop-blur-sm p-8 mb-8`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Inhaltsverzeichnis
          </h2>
          <div className="w-full flex items-center gap-4 justify-center flex-row flex-wrap">
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block text-left px-4 py-2   transition-colors ${theme === "dark"
                    ? "text-white hover:text-green-300 hover:bg-white/10 hover:border-green-400  -lg border border-white/10"
                    : "text-slate-900 hover:text-green-700 hover:bg-slate-100 hover:border-green-600 border border-slate-200"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Section id="overview" title="1. Datenschutz auf einen Blick">
            <SubSection title="Allgemeine Hinweise">
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber,
                was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
                Website besuchen. Personenbezogene Daten sind alle Daten, mit
                denen Sie persönlich identifiziert werden können. Ausführliche
                Informationen zum Thema Datenschutz entnehmen Sie unserer unter
                diesem Text aufgeführten Datenschutzerklärung.
              </p>
            </SubSection>

            <SubSection title="Wer ist verantwortlich für die Datenerfassung auf dieser Website?">
              <p>
                Die Datenverarbeitung auf dieser Website erfolgt durch den
                Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt
                „Hinweis zur Verantwortlichen Stelle" in dieser
                Datenschutzerklärung entnehmen.
              </p>
            </SubSection>
            <SubSection title="Wie erfassen wir Ihre Daten?">
              <p>
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
                mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie
                in ein Kontaktformular eingeben.
              </p>
              <p>
                Andere Daten werden automatisch oder nach Ihrer Einwilligung
                beim Besuch der Website durch unsere IT- Systeme erfasst. Das
                sind vor allem technische Daten (z. B. Internetbrowser,
                Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung
                dieser Daten erfolgt automatisch, sobald Sie diese Website
                betreten.
              </p>
            </SubSection>
            <SubSection title="Wofür nutzen wir Ihre Daten?">
              <p>
                Ein Teil der Daten wird erhoben, um eine fehlerfreie
                Bereitstellung der Website zu gewährleisten. Andere Daten können
                zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>
            </SubSection>
            <SubSection title="Welche Rechte haben Sie bezüglich Ihrer Daten?">
              <p>
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über
                Herkunft, Empfänger und Zweck Ihrer gespeicherten
                personenbezogenen Daten zu erhalten. Sie haben außerdem ein
                Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
                Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
                können Sie diese Einwilligung jederzeit für die Zukunft
                widerrufen. Außerdem haben Sie das Recht, unter bestimmten
                Umständen die Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten zu verlangen.
              </p>
              <p>
                Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen
                Aufsichtsbehörde zu. Hierzu sowie zu weiteren Fragen zum Thema
                Datenschutz können Sie sich jederzeit an uns wenden.
              </p>
            </SubSection>

            <SubSection title="Analyse-Tools und Tools von Drittanbietern">
              <p>
                Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch
                ausgewertet werden. Das geschieht vor allem mit sogenannten
                Analyseprogrammen. Detaillierte Informationen zu diesen
                Analyseprogrammen finden Sie in der folgenden
                Datenschutzerklärung.
              </p>
            </SubSection>
          </Section>

          <Section id="hosting" title="2. Hosting">
            <SubSection title="">
              <p>
                Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
              </p>
              <p
                className={`font-semibold ${theme == "dark" ? "text-gray-200" : "text-black"}`}
              >
                Strato
              </p>
              <p>
                Anbieter ist die Strato AG, Otto-Ostrowski-Straße 7, 10249
                Berlin (nachfolgend &quot;Strato&quot;). Wenn Sie unsere Website
                besuchen, erfasst Strato verschiedene Logfiles inklusive Ihrer
                IP-Adressen.
              </p>
              <p>
                Weitere Informationen entnehmen Sie der Datenschutzerklärung von
                Strato:{" "}
                <a
                  href="https://www.strato.de/datenschutz"
                  className={`${theme === "dark"
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-700"
                    } transition-colors`}
                >
                  https://www.strato.de/datenschutz
                </a>
              </p>
              <p>
                Die Verwendung von Strato erfolgt auf Grundlage von Art. 6 Abs.
                1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer
                möglichst zuverlässigen Darstellung unserer Website.
              </p>
            </SubSection>
          </Section>

          <Section
            id="general"
            title="3. Allgemeine Hinweise und Pflichtinformationen"
          >
            <SubSection title="Datenschutz">
              <p>
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
                Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
                vertraulich und entsprechend den gesetzlichen
                Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
              <p>
                Wenn Sie diese Website benutzen, werden verschiedene
                personenbezogene Daten erhoben. Personenbezogene Daten sind
                Daten, mit denen Sie persönlich identifiziert werden können. Die
                vorliegende Datenschutzerklärung erläutert, welche Daten wir
                erheben und wofür wir sie nutzen.
              </p>
              <p>
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z.
                B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen
                kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch
                Dritte ist nicht möglich.
              </p>
            </SubSection>

            <SubSection title="Hinweis zur verantwortlichen Stelle">
              <p>
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser
                Website ist:
              </p>
              <p className="font-semibold">
                CodingKids Programmierclub Niederrhein e.V.
                <br />
                Alte Raesfelder Str. 9a
                <br />
                46514 Schermbeck
                <br />
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
            </SubSection>

            <SubSection title="Speicherdauer">
              <p>
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere
                Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen
                Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
                Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine
                Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten
                gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe
                für die Speicherung Ihrer personenbezogenen Daten haben.
              </p>
            </SubSection>

            <SubSection title="SSL- bzw. TLS-Verschlüsselung">
              <p>
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
                Übertragung vertraulicher Inhalte eine SSL- bzw.
                TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
                daran, dass die Adresszeile des Browsers von „http://" auf
                „https://" wechselt und an dem Schloss-Symbol in Ihrer
                Browserzeile.
              </p>
              <p>
                Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die
                Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen
                werden.
              </p>
            </SubSection>

            <SubSection title="Widerspruch gegen Werbe-E-Mails">
              <p>
                Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
                Kontaktdaten zur Übersendung von nicht ausdrücklich
                angeforderter Werbung und Informationsmaterialien wird hiermit
                widersprochen.
              </p>
            </SubSection>
          </Section>

          <Section
            id="data-collection"
            title="4. Datenerfassung auf dieser Website"
          >
            <SubSection title="Registrierung auf dieser Website">
              <p>
                Zur Nutzung bestimmter Funktionen können Sie sich auf unserer
                Website registrieren. Die übermittelten Daten dienen
                ausschließlich zum Zwecke der Nutzung des jeweiligen Angebotes
                oder Dienstes.
              </p>
              <p>
                Die Verarbeitung der bei der Registrierung eingegebenen Daten
                erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a
                DSGVO). Ein Widerruf Ihrer bereits erteilten Einwilligung ist
                jederzeit möglich.
              </p>
            </SubSection>

            <SubSection title="Cookies">
              <p>
                Unsere Internetseiten verwenden so genannte „Cookies". Cookies
                sind kleine Datenpakete und richten auf Ihrem Endgerät keinen
                Schaden an. Sie werden entweder vorübergehend für die Dauer
                einer Sitzung (Session-Cookies) oder dauerhaft (permanente
                Cookies) auf Ihrem Endgerät gespeichert.
              </p>
              <p>
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen
                von Cookies informiert werden und Cookies nur im Einzelfall
                erlauben, die Annahme von Cookies für bestimmte Fälle oder
                generell ausschließen.
              </p>
            </SubSection>

            <SubSection title="Server-Log-Dateien">
              <p>
                Der Provider der Seiten erhebt und speichert automatisch
                Informationen in so genannten Server-Log-Dateien, die Ihr
                Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p className="mt-4">
                Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs.
                1 lit. f DSGVO.
              </p>
            </SubSection>

            <SubSection title="Kontaktformular">
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen,
                werden Ihre Angaben aus dem Anfrageformular inklusive der von
                Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
                Anfrage bei uns gespeichert. Diese Daten geben wir nicht ohne
                Ihre Einwilligung weiter.
              </p>
            </SubSection>

            <SubSection title="Anfrage per E-Mail, Telefon oder Telefax">
              <p>
                Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird
                Ihre Anfrage inklusive aller daraus hervorgehenden
                personenbezogenen Daten zum Zwecke der Bearbeitung Ihres
                Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben
                wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </SubSection>

            <SubSection title="Kommentarfunktion auf dieser Website">
              <p>
                Für die Kommentarfunktion auf dieser Seite werden neben Ihrem
                Kommentar auch Angaben zum Zeitpunkt der Erstellung des
                Kommentars, Ihre E-Mail-Adresse und der von Ihnen gewählte
                Nutzername gespeichert. Unsere Kommentarfunktion speichert die
                IP-Adressen der Nutzer, die Kommentare verfassen.
              </p>
              <p>
                Die Speicherung der Kommentare erfolgt auf Grundlage Ihrer
                Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
              </p>
            </SubSection>
          </Section>

          <Section id="social-media" title="5. Soziale Medien">
            <SubSection title="Twitter">
              <p>
                Auf dieser Website sind Funktionen des Dienstes Twitter
                eingebunden. Diese Funktionen werden angeboten durch die Twitter
                International Company, One Cumberland Place, Fenian Street,
                Dublin 2, D02 AX07, Irland.
              </p>
              <p>
                Wenn das Social-Media-Element aktiv ist, wird eine direkte
                Verbindung zwischen Ihrem Endgerät und dem Twitter-Server
                hergestellt. Weitere Informationen finden Sie in der
                Datenschutzerklärung von Twitter:{" "}
                <a
                  href="https://twitter.com/de/privacy"
                  className={`${theme === "dark"
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-700"
                    } transition-colors`}
                >
                  https://twitter.com/de/privacy
                </a>
              </p>
            </SubSection>

            <SubSection title="Instagram">
              <p>
                Auf dieser Website sind Funktionen des Dienstes Instagram
                eingebunden. Diese Funktionen werden angeboten durch die Meta
                Platforms Ireland Limited, 4 Grand Canal Square, Grand Canal
                Harbour, Dublin 2, Irland.
              </p>
              <p>
                Wenn das Social-Media-Element aktiv ist, wird eine direkte
                Verbindung zwischen Ihrem Endgerät und dem Instagram-Server
                hergestellt. Weitere Informationen finden Sie in der
                Datenschutzerklärung von Instagram:{" "}
                <a
                  href="https://instagram.com/about/legal/privacy/"
                  className={`${theme === "dark"
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-700"
                    } transition-colors`}
                >
                  https://instagram.com/about/legal/privacy/
                </a>
              </p>
            </SubSection>
          </Section>
          <Section id="newsletter" title="6. Newsletter">
            <SubSection title="">
              <p>
                Wenn Sie den auf der Website angebotenen Newsletter beziehen
                möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie
                Informationen, welche uns die Überprüfung gestatten, dass Sie
                der Inhaber der angegebenen E-Mail-Adresse sind und mit dem
                Empfang des Newsletters einverstanden sind.
              </p>
              <p>
                Die Verarbeitung der in das Newsletteranmeldeformular
                eingegebenen Daten erfolgt ausschließlich auf Grundlage Ihrer
                Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die erteilte
                Einwilligung können Sie jederzeit widerrufen, etwa über den
                „Austragen"-Link im Newsletter.
              </p>
              <p>
                Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns
                hinterlegten Daten werden von uns bis zu Ihrer Austragung aus
                dem Newsletter bei uns gespeichert und nach der Abbestellung des
                Newsletters gelöscht.
              </p>
            </SubSection>
          </Section>

          <Section id="plugins" title="7. Plugins und Tools">
            <SubSection title="YouTube">
              <p>
                Diese Website bindet Videos der Website YouTube ein. Betreiber
                der Website ist die Google Ireland Limited („Google"), Gordon
                House, Barrow Street, Dublin 4, Irland.
              </p>
              <p>
                Wenn Sie eine unserer Webseiten besuchen, auf denen YouTube
                eingebunden ist, wird eine Verbindung zu den Servern von YouTube
                hergestellt.
              </p>
              <p>
                Des Weiteren kann YouTube verschiedene Cookies auf Ihrem
                Endgerät speichern oder vergleichbare Technologien zur
                Wiedererkennung verwenden. Auf diese Weise kann YouTube
                Informationen über Besucher dieser Website erhalten.
              </p>
              <p>
                Weitere Informationen zum Umgang mit Nutzerdaten finden Sie in
                der Datenschutzerklärung von YouTube:{" "}
                <a
                  href="https://policies.google.com/privacy?hl=de"
                  className={`${theme === "dark"
                      ? "text-green-400 hover:text-green-300"
                      : "text-green-600 hover:text-green-700"
                    } transition-colors`}
                >
                  https://policies.google.com/privacy?hl=de
                </a>
              </p>
            </SubSection>
          </Section>

          <div
            className={`${theme === "dark"
                ? "bg-white/5 border-white/10"
                : "bg-white border-slate-200"
              } border backdrop-blur-sm p-8 text-center`}
          >
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                }`}
            >
              Quelle: https://www.e-recht24.de
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Datenschutz;

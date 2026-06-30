"use client";

import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { addEvent } from "@/lib/db";
import type { EventData } from "@/BackEnd/type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const defaultEvent: EventData = {
  name: "",
  uid: "",
  course: "",
  date: Timestamp.fromDate(new Date()),
  length: 0,
  memberCount: 0,
  place: ["", "", ""],
  users: [],
  queue: [],
  leftUsers: [],
  typeOfEvent: "",
  tag: "",
  difficulty: "",
  requirements: "",
  description: "",
};

function getNextWednesday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7;
  const nextWednesday = new Date(today);
  nextWednesday.setDate(today.getDate() + daysUntilWednesday);
  nextWednesday.setHours(18, 0, 0, 0);
  return nextWednesday;
}

export default function EventCreationDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}) {
  const { user, userRole } = useAuth();
  const { open, onOpenChange, onCreated } = props;
  const { theme, isRounded } = useTheme();

  const [currentStep, setCurrentStep] = useState(0);
  const [EventInfo, setEventInfo] = useState<EventData>(defaultEvent);
  const [error, setError] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";

  const steps = [
    {
      title: "Grundinformationen",
      description: "Name, Datum und Dauer des Events",
    },
    {
      title: "Standort",
      description: "Ort und Adresse des Events",
    },
    {
      title: "Event-Details",
      description: "Typ, Tag und Schwierigkeitsgrad",
    },
    {
      title: "Beschreibung",
      description: "Zusätzliche Informationen und Details",
    },
  ];

  const validateStep = (): boolean => {
    setError("");

    switch (currentStep) {
      case 0:
        if (!EventInfo.name.trim()) {
          setError("Event-Name ist erforderlich");
          return false;
        }
        if (EventInfo.length <= 0) {
          setError("Dauer muss größer als 0 sein");
          return false;
        }
        if (EventInfo.memberCount <= 0) {
          setError("Teilnehmerzahl muss größer als 0 sein");
          return false;
        }
        return true;

      case 1:
        if (
          !EventInfo.place[0].trim() ||
          !EventInfo.place[1].trim() ||
          !EventInfo.place[2].trim()
        ) {
          setError("Alle Standortangaben sind erforderlich");
          return false;
        }
        return true;

      case 2:
        if (!EventInfo.typeOfEvent.trim()) {
          setError("Event-Typ ist erforderlich");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    setError("");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEventCreate = async () => {
    if (!user) return;

    if (!EventInfo.name.trim()) {
      setError("Event-Name ist erforderlich");
      return;
    }

    setIsCreating(true);
    try {
      await addEvent(EventInfo, user.uid, userRole);
      console.log("Event erfolgreich hinzugefügt");
      setEventInfo(defaultEvent);
      setCurrentStep(0);
      setError("");
      onCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Events:", error);
      setError("Fehler beim Erstellen des Events. Bitte versuchen Sie es erneut.");
    } finally {
      setIsCreating(false);
    }
  };

  const presetEvent1 = () => {
    setEventInfo({
      name: "Scratch Workshop",
      uid: "",
      course: "",
      date: Timestamp.fromDate(getNextWednesday()),
      length: 90,
      memberCount: 18,
      place: [
        "CUBES Wesel - Konferenzraum EG links",
        "Rudolf-Diesel-Str. 115",
        "46485 Wesel",
      ],
      users: [],
      queue: [],
      leftUsers: [],
      typeOfEvent: "CoderDojo",
      tag: "Scratch",
      difficulty: "Einsteigerfreundlich",
      requirements:
        "Keine Vorkenntnisse erforderlich. Ideal für Kinder ab 8 Jahren",
      description:
        "In diesem Workshop lernen Kinder spielerisch die Grundlagen des Programmierens mit Scratch. Gemeinsam entwickeln wir kleine interaktive Geschichten und Spiele.",
    });
  };

  const presetEvent2 = () => {
    setEventInfo({
      name: "Mitgliederversammlung",
      uid: "",
      date: Timestamp.fromDate(getNextWednesday()),
      course: "DA",
      length: 180,
      memberCount: 50,
      place: [
        "CUBES Wesel – Hauptraum",
        "Rudolf-Diesel-Str. 115",
        "46485 Wesel",
      ],
      users: [],
      queue: [],
      leftUsers: [],
      typeOfEvent: "MemberOnly",
      tag: "Verein",
      difficulty: "Keine",
      requirements: "Nur für registrierte Mitglieder. Anmeldung erforderlich",
      description:
        "Jährliche Versammlung aller Vereinsmitglieder zur Abstimmung über aktuelle Themen, Finanzen und zukünftige Projekte. Es wird um pünktliches Erscheinen gebeten.",
    });
  };

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === "dark" ? "bg-black/50" : "bg-white/50"
    } backdrop-blur-sm`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl ${roundedClass} transition-colors duration-300 overflow-hidden ${
          theme === "dark" ? "bg-black border border-white/10" : "bg-white border border-slate-200"
        }`}
      >
        {/* Header */}
        <div
          className={`px-8 py-8 border-b transition-colors duration-300 ${
            theme === "dark"
              ? "border-white/10 bg-black/50"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p
                className={`text-xs tracking-[0.22em] uppercase font-mono mb-2 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              >
                Schritt {currentStep + 1} von {steps.length}
              </p>
              <h2
                className={`text-3xl font-black tracking-tight ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                {steps[currentStep].title}
              </h2>
              <p
                className={`text-sm mt-2 ${
                  theme === "dark" ? "text-gray-400" : "text-slate-600"
                }`}
              >
                {steps[currentStep].description}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className={`text-2xl font-light p-1 ${
                theme === "dark" ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ×
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`h-1 flex-1 origin-left transition-colors duration-300 ${roundedClass} ${
                  index === currentStep
                    ? theme === "dark"
                      ? "bg-purple-500"
                      : "bg-purple-600"
                    : index < currentStep
                      ? theme === "dark"
                        ? "bg-purple-500/40"
                        : "bg-purple-300/60"
                      : theme === "dark"
                        ? "bg-white/10"
                        : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          className={`px-8 py-8 min-h-72 max-h-96 overflow-y-auto transition-colors duration-300 ${
            theme === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Event-Name *
                  </Label>
                  <Input
                    className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                    } border focus:outline-none`}
                    placeholder="z.B. Scratch Workshop"
                    value={EventInfo.name}
                    onChange={(e) =>
                      setEventInfo({ ...EventInfo, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Datum *
                  </Label>
                  <Input
                    className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
                    } border focus:outline-none`}
                    type="date"
                    value={EventInfo.date.toDate().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const selectedDate = Timestamp.fromDate(
                        new Date(e.target.value + "T18:00:00"),
                      );
                      setEventInfo({ ...EventInfo, date: selectedDate });
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label
                      className={`text-xs font-semibold tracking-wide uppercase ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Dauer (Min.) *
                    </Label>
                    <Input
                      className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                          : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                      } border focus:outline-none`}
                      type="number"
                      placeholder="90"
                      value={EventInfo.length || ""}
                      onChange={(e) =>
                        setEventInfo({
                          ...EventInfo,
                          length: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      className={`text-xs font-semibold tracking-wide uppercase ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Teilnehmerzahl *
                    </Label>
                    <Input
                      className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                          : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                      } border focus:outline-none`}
                      type="number"
                      placeholder="18"
                      value={EventInfo.memberCount || ""}
                      onChange={(e) =>
                        setEventInfo({
                          ...EventInfo,
                          memberCount: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Veranstaltungsort *
                  </Label>
                  <Input
                    className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                    } border focus:outline-none`}
                    placeholder="z.B. CUBES Wesel"
                    value={EventInfo.place[0]}
                    onChange={(e) => {
                      const updated = [...EventInfo.place];
                      updated[0] = e.target.value;
                      setEventInfo({ ...EventInfo, place: updated });
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Straße *
                  </Label>
                  <Input
                    className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                    } border focus:outline-none`}
                    placeholder="z.B. Rudolf-Diesel-Str. 115"
                    value={EventInfo.place[1]}
                    onChange={(e) => {
                      const updated = [...EventInfo.place];
                      updated[1] = e.target.value;
                      setEventInfo({ ...EventInfo, place: updated });
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Stadt *
                  </Label>
                  <Input
                    className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                    } border focus:outline-none`}
                    placeholder="z.B. 46485 Wesel"
                    value={EventInfo.place[2]}
                    onChange={(e) => {
                      const updated = [...EventInfo.place];
                      updated[2] = e.target.value;
                      setEventInfo({ ...EventInfo, place: updated });
                    }}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Event-Typ *
                  </Label>
                  <Input
                    className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                    } border focus:outline-none`}
                    placeholder="z.B. CoderDojo, Workshop"
                    value={EventInfo.typeOfEvent}
                    onChange={(e) =>
                      setEventInfo({ ...EventInfo, typeOfEvent: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Tag / Thema
                  </Label>
                  <Input
                    className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                    } border focus:outline-none`}
                    placeholder="z.B. Scratch, Python"
                    value={EventInfo.tag}
                    onChange={(e) =>
                      setEventInfo({ ...EventInfo, tag: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Schwierigkeitsgrad
                  </Label>
                  <Input
                    className={`${roundedClass} px-4 py-2.5 text-sm transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                    } border focus:outline-none`}
                    placeholder="z.B. Anfänger, Fortgeschritten"
                    value={EventInfo.difficulty}
                    onChange={(e) =>
                      setEventInfo({ ...EventInfo, difficulty: e.target.value })
                    }
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="grid gap-2">
                  <Label
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Beschreibung
                  </Label>
                  <textarea
                    className={`${roundedClass} px-4 py-2.5 text-sm resize-none min-h-[140px] transition-colors duration-300 focus:outline-none ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-purple-500/50"
                        : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
                    } border`}
                    placeholder="Geben Sie eine detaillierte Beschreibung des Events ein..."
                    value={EventInfo.description}
                    onChange={(e) =>
                      setEventInfo({ ...EventInfo, description: e.target.value })
                    }
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 flex items-center gap-2 p-3 ${roundedClass} text-sm ${
                theme === "dark"
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-8 py-6 border-t transition-colors duration-300 ${
            theme === "dark"
              ? "border-white/10 bg-black/50"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          {currentStep === steps.length - 1 && (
            <div className="flex gap-2 mb-4">
              <Button
                onClick={presetEvent1}
                variant="outline"
                className={`flex-1 text-xs ${roundedClass}`}
              >
                Preset: Scratch
              </Button>
              <Button
                onClick={presetEvent2}
                variant="outline"
                className={`flex-1 text-xs ${roundedClass}`}
              >
                Preset: Versammlung
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className={`flex-1 ${roundedClass}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className={`flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 ${roundedClass}`}
              >
                Weiter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleEventCreate}
                disabled={isCreating}
                className={`flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 ${roundedClass} disabled:opacity-50`}
              >
                {isCreating ? (
                  <>
                    <span className="animate-spin mr-2">⌛</span>
                    Erstelle...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Erstellen
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

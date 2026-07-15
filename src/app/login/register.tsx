"use client";

import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import { useState } from "react";
import { Mail, Lock, User, Calendar, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "").substring(0, 255);
};

type RegistrationStep = "userinfo" | "birthdate" | "password" | "confirm";

export default function RegisterView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secpassword, setSecpassword] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("userinfo");

  const router = useRouter();
  const { theme, isRounded } = useTheme();

  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  const handleRegister = async () => {
    setErrorMsg("");

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedSecPassword = sanitizeInput(secpassword);

    if (!sanitizedEmail || !sanitizedPassword || !sanitizedSecPassword || !sanitizedName || !birthdate) {
      setErrorMsg("Bitte fülle alle Felder aus.");
      return;
    }

    if (sanitizedPassword !== sanitizedSecPassword) {
      setErrorMsg("Passwörter stimmen nicht überein.");
      return;
    }

    if (sanitizedPassword.length < 8) {
      setErrorMsg("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (sanitizedName.length < 2) {
      setErrorMsg("Der Name muss mindestens 2 Zeichen lang sein.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMsg("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(sanitizedEmail, sanitizedPassword, {
        name: sanitizedName,
        birthdate,
      });
      router.push("/");
    } catch (err) {
      setErrorMsg("Registrierung fehlgeschlagen. Versuche es später erneut.");
      console.error(err);
    } finally {
      setIsLoading(false);
      
    }
  };

  const validateStep = (step: RegistrationStep): boolean => {
    setErrorMsg("");
    
    switch (step) {
      case "userinfo":
        if (!sanitizeInput(name)) {
          setErrorMsg("Bitte gib deinen Namen ein.");
          return false;
        }
        if (sanitizeInput(name).length < 2) {
          setErrorMsg("Der Name muss mindestens 2 Zeichen lang sein.");
          return false;
        }
        if (!sanitizeInput(email)) {
          setErrorMsg("Bitte gib deine E-Mail ein.");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizeInput(email))) {
          setErrorMsg("Bitte gib eine gültige E-Mail-Adresse ein.");
          return false;
        }
        return true;
      
      case "birthdate":
        if (!birthdate) {
          setErrorMsg("Bitte wähle dein Geburtsdatum aus.");
          return false;
        }
        return true;
      
      case "password":
        if (!sanitizeInput(password)) {
          setErrorMsg("Bitte gib ein Passwort ein.");
          return false;
        }
        if (sanitizeInput(password).length < 8) {
          setErrorMsg("Das Passwort muss mindestens 8 Zeichen lang sein.");
          return false;
        }
        if (!sanitizeInput(secpassword)) {
          setErrorMsg("Bitte wiederhole dein Passwort.");
          return false;
        }
        if (sanitizeInput(password) !== sanitizeInput(secpassword)) {
          setErrorMsg("Passwörter stimmen nicht überein.");
          return false;
        }
        return true;
      
      case "confirm":
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    
    const steps: RegistrationStep[] = ["userinfo", "birthdate", "password", "confirm"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: RegistrationStep[] = ["userinfo", "birthdate", "password", "confirm"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setErrorMsg("");
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const getProgressPercentage = () => {
    const steps: RegistrationStep[] = ["userinfo", "birthdate", "password", "confirm"];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "userinfo":
        return (
          <div className="flex flex-col gap-4 font-['JetBrains_Mono'] text-xs">
            <div className="flex flex-col gap-1">
              <h3 className={`text-sm font-sans font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Schritt 1: Wer bist du?
              </h3>
              <p className={`text-xs font-sans ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
                Gib deinen Namen und deine E-Mail-Adresse ein.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>Vollständiger Name</label>
              <div className="relative flex items-center">
                <User className={`absolute left-3 w-4 h-4 pointer-events-none ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  maxLength={255}
                  className={`w-full pl-9 pr-4 py-2 border transition-all duration-150 text-sm font-sans outline-none ${innerRoundedClass} ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-zinc-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300 focus:border-slate-400"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>E-Mail-Adresse</label>
              <div className="relative flex items-center">
                <Mail className={`absolute left-3 w-4 h-4 pointer-events-none ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  maxLength={255}
                  className={`w-full pl-9 pr-4 py-2 border transition-all duration-150 text-sm font-sans outline-none ${innerRoundedClass} ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-zinc-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300 focus:border-slate-400"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case "birthdate":
        return (
          <div className="flex flex-col gap-4 font-['JetBrains_Mono'] text-xs">
            <div className="flex flex-col gap-1">
              <h3 className={`text-sm font-sans font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Schritt 2: Geburtsdatum
              </h3>
              <p className={`text-xs font-sans ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
                Wann hast du Geburtstag?
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>Geburtsdatum</label>
              <div className="relative flex items-center">
                <Calendar className={`absolute left-3 w-4 h-4 pointer-events-none ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`} />
                <input
                  type="date"
                  value={birthdate?.toISOString().split("T")[0] ?? ""}
                  onChange={(e) => setBirthdate(e.target.value ? new Date(e.target.value) : null)}
                  className={`w-full pl-9 pr-8 py-2 border transition-all duration-150 text-sm font-sans outline-none ${innerRoundedClass} ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-800 text-white focus:border-zinc-500 color-scheme-dark"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case "password":
        return (
          <div className="flex flex-col gap-4 font-['JetBrains_Mono'] text-xs">
            <div className="flex flex-col gap-1">
              <h3 className={`text-sm font-sans font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Schritt 3: Sicherheit
              </h3>
              <p className={`text-xs font-sans ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
                Wähle ein geheimes Passwort (mindestens 8 Zeichen).
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>Passwort</label>
              <div className="relative flex items-center">
                <Lock className={`absolute left-3 w-4 h-4 pointer-events-none ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  maxLength={255}
                  className={`w-full pl-9 pr-4 py-2 border transition-all duration-150 text-sm font-sans outline-none ${innerRoundedClass} ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-zinc-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300 focus:border-slate-400"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>Passwort wiederholen</label>
              <div className="relative flex items-center">
                <Lock className={`absolute left-3 w-4 h-4 pointer-events-none ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`} />
                <input
                  type="password"
                  value={secpassword}
                  onChange={(e) => setSecpassword(e.target.value)}
                  placeholder="••••••••"
                  maxLength={255}
                  className={`w-full pl-9 pr-4 py-2 border transition-all duration-150 text-sm font-sans outline-none ${innerRoundedClass} ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-zinc-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300 focus:border-slate-400"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case "confirm":
        return (
          <div className="flex flex-col gap-4 font-['JetBrains_Mono'] text-xs">
            <div className="flex flex-col gap-1">
              <h3 className={`text-sm font-sans font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Fast fertig!
              </h3>
              <p className={`text-xs font-sans ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
                Prüfe deine Eingaben ein letztes Mal.
              </p>
            </div>

            <div className={`p-4 border text-xs font-sans flex flex-col gap-3 ${innerRoundedClass} ${
              theme === "dark" ? "bg-zinc-900/30 border-zinc-900" : "bg-slate-50 border-slate-200"
            }`}>
              <div>
                <p className={`text-[10px] font-mono uppercase tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>Name</p>
                <p className={`font-semibold text-sm ${theme === "dark" ? "text-zinc-200" : "text-slate-800"}`}>{name}</p>
              </div>
              <div className="border-t border-dashed border-zinc-800 dark:border-zinc-800/60 my-0.5" />
              <div>
                <p className={`text-[10px] font-mono uppercase tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>E-Mail</p>
                <p className={`font-semibold text-sm ${theme === "dark" ? "text-zinc-200" : "text-slate-800"}`}>{email}</p>
              </div>
              <div className="border-t border-dashed border-zinc-800 dark:border-zinc-800/60 my-0.5" />
              <div>
                <p className={`text-[10px] font-mono uppercase tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>Geburtsdatum</p>
                <p className={`font-semibold text-sm ${theme === "dark" ? "text-zinc-200" : "text-slate-800"}`}>{birthdate?.toLocaleDateString("de-DE")}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className={`block font-mono text-[10px] font-bold tracking-widest uppercase ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
          Registrierung 
        </span>
        <h2 className={`text-2xl font-sans font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          Konto erstellen
        </h2>
      </div>

      <div className={`w-full h-1 overflow-hidden ${theme === "dark" ? "bg-zinc-900" : "bg-slate-100"} ${innerRoundedClass}`}>
        <div
          className={`h-full transition-all duration-300 ${theme === "dark" ? "bg-zinc-200" : "bg-zinc-900"}`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Active Step Box Container */}
      <div className="min-h-[220px] flex flex-col justify-start">
        {renderStepContent()}
      </div>

      {/* Error Output handling */}
      {errorMsg && (
        <div className={`flex items-start gap-2.5 p-3 text-xs border animate-shake ${innerRoundedClass} ${
          theme === "dark" ? "bg-rose-950/20 border-rose-900/60 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="font-sans font-medium leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* Form Bottom Control Buttons Actions */}
      <div className="flex gap-3 mt-1">
        <button
          onClick={prevStep}
          disabled={currentStep === "userinfo" || isLoading}
          className={`flex items-center justify-center gap-1.5 px-4 py-2 font-sans font-bold text-xs transition-all duration-150 border uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] ${innerRoundedClass} ${
            theme === "dark"
              ? "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück
        </button>

        {currentStep === "confirm" ? (
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center py-2 px-4 font-sans font-bold text-xs transition-all duration-150 border uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${innerRoundedClass} ${
              theme === "dark"
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-950 border-zinc-100"
                : "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900"
            }`}
          >
            {isLoading ? "Wird registriert..." : "Registrieren"}
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-4 font-sans font-bold text-xs transition-all duration-150 border uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${innerRoundedClass} ${
              theme === "dark"
                ? "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-800"
                : "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900"
            }`}
          >
            Weiter
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .color-scheme-dark {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}

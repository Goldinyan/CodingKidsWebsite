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
  const { theme } = useTheme();

  const handleRegister = async () => {
    setErrorMsg("");

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedSecPassword = sanitizeInput(secpassword);

    if (
      !sanitizedEmail ||
      !sanitizedPassword ||
      !sanitizedSecPassword ||
      !sanitizedName ||
      !birthdate
    ) {
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSecPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecpassword(e.target.value);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "userinfo":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Schritt 1: Grundinformationen
              </h3>
              <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                Gib deinen Namen und deine E-Mail ein.
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                Vollständiger Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`} />
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Max Mustermann"
                  maxLength={255}
                  className={`w-[98%] ml-[2px] pl-10 pr-4 py-3 border rounded-lg backdrop-blur-sm focus:outline-none transition ${theme === "dark"
                    ? "border-white/10 bg-white/5 text-white placeholder-gray-600 focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    : "border-black/10 bg-black/5 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-black/20 focus:border-transparent"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                E-Mail
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`} />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="deine@email.com"
                  maxLength={255}
                  className={`w-[98%] ml-[2px] pl-10 pr-4 py-3 border rounded-lg backdrop-blur-sm focus:outline-none transition ${theme === "dark"
                    ? "border-white/10 bg-white/5 text-white placeholder-gray-600 focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    : "border-black/10 bg-black/5 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-black/20 focus:border-transparent"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case "birthdate":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Schritt 2: Geburtsdatum
              </h3>
              <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                Wann bist du geboren?
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                Geburtsdatum
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`} />
                <input
                  type="date"
                  value={birthdate?.toISOString().split("T")[0] ?? ""}
                  onChange={(e) => setBirthdate(new Date(e.target.value))}
                  className={`w-[98%] ml-[2px] pl-10 pr-4 py-3 border rounded-lg backdrop-blur-sm focus:outline-none transition ${theme === "dark"
                    ? "border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    : "border-black/10 bg-black/5 text-slate-900 focus:ring-2 focus:ring-black/20 focus:border-transparent"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case "password":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Schritt 3: Passwort
              </h3>
              <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                Wähle ein sicheres Passwort (mindestens 8 Zeichen).
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                Passwort
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`} />
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  maxLength={255}
                  className={`w-[98%] ml-[2px] pl-10 pr-4 py-3 border rounded-lg backdrop-blur-sm focus:outline-none transition ${theme === "dark"
                    ? "border-white/10 bg-white/5 text-white placeholder-gray-600 focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    : "border-black/10 bg-black/5 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-black/20 focus:border-transparent"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                Passwort wiederholen
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`} />
                <input
                  type="password"
                  value={secpassword}
                  onChange={handleSecPasswordChange}
                  placeholder="••••••••"
                  maxLength={255}
                  className={`w-[98%] ml-[2px] pl-10 pr-4 py-3 border rounded-lg backdrop-blur-sm focus:outline-none transition ${theme === "dark"
                    ? "border-white/10 bg-white/5 text-white placeholder-gray-600 focus:ring-2 focus:ring-white/30 focus:border-transparent"
                    : "border-black/10 bg-black/5 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-black/20 focus:border-transparent"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case "confirm":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Fertig!
              </h3>
              <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                Überprüfe deine Angaben und bestätige die Registrierung.
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${theme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-slate-50 border-slate-200"
            }`}>
              <div className="space-y-3">
                <div>
                  <p className={`text-xs font-medium mb-1 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>Name</p>
                  <p className={`font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{name}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>E-Mail</p>
                  <p className={`font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{email}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>Geburtsdatum</p>
                  <p className={`font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{birthdate?.toLocaleDateString("de-DE")}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Registrieren</h2>
        <p className={`font-light ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
          Erstelle dein Konto und starte deine Programmier-Reise!
        </p>
      </div>

      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${theme === "dark" ? "bg-green-500" : "bg-green-600"}`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <div className="min-h-[300px]">
        {renderStepContent()}
      </div>

      {errorMsg && (
        <div className={`flex items-center gap-3 p-4 border rounded-lg animate-shake ${theme === "dark"
          ? "bg-red-950/50 border-red-900/50"
          : "bg-red-100/50 border-red-200"
        }`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
          <p className={`text-sm ${theme === "dark" ? "text-red-300" : "text-red-700"}`}>{errorMsg}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={prevStep}
          disabled={currentStep === "userinfo" || isLoading}
          className={`flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${theme === "dark"
            ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
            : "bg-slate-200 border border-slate-300 text-slate-900 hover:bg-slate-300"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Zurück
        </button>

        {currentStep === "confirm" ? (
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className={`flex-1 py-3 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${theme === "dark"
              ? "bg-white text-black hover:bg-gray-100"
              : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isLoading ? "Wird registriert..." : "Registrieren"}
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${theme === "dark"
              ? "bg-white text-black hover:bg-gray-100"
              : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Weiter
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

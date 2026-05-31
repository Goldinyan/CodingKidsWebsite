"use client";

import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import { useState } from "react";
import { Mail, Lock, User, Calendar, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "").substring(0, 255);
};

export default function RegisterView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secpassword, setSecpassword] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Registrieren</h2>
        <p className={`font-light ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
          Erstelle dein Konto und starte deine Programmier-Reise!
        </p>
      </div>

      <div className="space-y-4">
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

      {errorMsg && (
        <div className={`flex items-center gap-3 p-4 border rounded-lg animate-shake ${theme === "dark"
          ? "bg-red-950/50 border-red-900/50"
          : "bg-red-100/50 border-red-200"
        }`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
          <p className={`text-sm ${theme === "dark" ? "text-red-300" : "text-red-700"}`}>{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handleRegister}
        disabled={
          isLoading ||
          !email ||
          !password ||
          !secpassword ||
          !name ||
          !birthdate
        }
        className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${theme === "dark"
          ? "bg-white text-black hover:bg-gray-100"
          : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isLoading ? "Wird registriert..." : "Registrieren"}
      </button>

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

"use client";

import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import { useState } from "react";
import { Mail, Lock, User, Calendar, AlertCircle } from "lucide-react";

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .substring(0, 255);
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
        <h2 className="text-3xl font-bold text-white mb-2">Registrieren</h2>
        <p className="text-gray-400 font-light">Erstelle dein Konto und starte deine Programmier-Reise!</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Vollständiger Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Max Mustermann"
              maxLength={255}
              className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            E-Mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="deine@email.com"
              maxLength={255}
              className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Geburtsdatum
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={birthdate?.toISOString().split("T")[0] ?? ""}
              onChange={(e) => setBirthdate(new Date(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Passwort
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              maxLength={255}
              className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Passwort wiederholen
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              value={secpassword}
              onChange={handleSecPasswordChange}
              placeholder="••••••••"
              maxLength={255}
              className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-950/50 border border-red-900/50 rounded-lg animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handleRegister}
        disabled={isLoading || !email || !password || !secpassword || !name || !birthdate}
        className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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

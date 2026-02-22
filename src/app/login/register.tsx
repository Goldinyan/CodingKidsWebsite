"use client";

import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import { useState } from "react";
import { Mail, Lock, User, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

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

    if (!email || !password || !secpassword || !name || !birthdate) {
      setErrorMsg("Bitte fülle alle Felder aus.");
      return;
    }

    if (password !== secpassword) {
      setErrorMsg("Passwörter stimmen nicht überein.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(email, password, {
        name,
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

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primaryOwn mb-2">Registrieren</h2>
        <p className="text-graytext">Erstelle dein Konto und starte deine Programmier-Reise!</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Vollständiger Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primaryOwn opacity-50" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Max Mustermann"
              className="w-full pl-10 pr-4 py-3 border border-lightborder rounded-lg bg-white text-foreground placeholder-gray2text focus:outline-none focus:ring-2 focus:ring-primaryOwn focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            E-Mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primaryOwn opacity-50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.com"
              className="w-full pl-10 pr-4 py-3 border border-lightborder rounded-lg bg-white text-foreground placeholder-gray2text focus:outline-none focus:ring-2 focus:ring-primaryOwn focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Geburtsdatum
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primaryOwn opacity-50" />
            <input
              type="date"
              value={birthdate?.toISOString().split("T")[0] ?? ""}
              onChange={(e) => setBirthdate(new Date(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-lightborder rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primaryOwn focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Passwort
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primaryOwn opacity-50" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 border border-lightborder rounded-lg bg-white text-foreground placeholder-gray2text focus:outline-none focus:ring-2 focus:ring-primaryOwn focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Passwort wiederholen
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primaryOwn opacity-50" />
            <input
              type="password"
              value={secpassword}
              onChange={(e) => setSecpassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 border border-lightborder rounded-lg bg-white text-foreground placeholder-gray2text focus:outline-none focus:ring-2 focus:ring-primaryOwn focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-lightRedBg border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handleRegister}
        disabled={isLoading}
        className="w-full py-3 bg-secondaryOwn hover:bg-thirdOwn text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Wird registriert..." : "Registrieren"}
      </button>
    </div>
  );
}

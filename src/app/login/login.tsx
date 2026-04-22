"use client";

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { useState } from "react";
import { loginSchema } from "../../../BackEnd/Joi";
import { Mail, Lock, AlertCircle } from "lucide-react";

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "").substring(0, 255);
};

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setErrorMsg("");

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    const formData = { email: sanitizedEmail, password: sanitizedPassword };
    const { error, value } = loginSchema.validate(formData);

    if (error) {
      setErrorMsg(error.details[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(value.email, value.password);
      router.push("/");
    } catch (err) {
      setErrorMsg("Anmeldung fehlgeschlagen. Überprüfe deine Anmeldedaten.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primaryOwn mb-2">Anmelden</h2>
        <p className="text-graytext">Willkommen zurück! Bitte melde dich an.</p>
      </div>

      <div className="space-y-4">
        <div className="">
          <label className="block text-sm font-medium text-foreground mb-2">
            E-Mail
          </label>
          <div className="mx-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primaryOwn opacity-50" />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="deine@email.com"
              maxLength={255}
              className="w-full pl-10 pr-4 py-3 border border-lightborder rounded-lg bg-red text-foreground placeholder-gray2text focus:outline-none focus:ring-2 focus:ring-primaryOwn focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Passwort
          </label>
          <div className="mx-1 relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primaryOwn opacity-50" />
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              maxLength={255}
              className="w-full pl-10 pr-4 py-3 border border-lightborder rounded-lg bg-white text-foreground placeholder-gray2text focus:outline-none focus:ring-2 focus:ring-primaryOwn focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-lightRedBg border border-red-200 rounded-lg animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading || !email || !password}
        className="w-full py-3 bg-primaryOwn hover:bg-fifthOwn text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {isLoading ? "Wird angemeldet..." : "Anmelden"}
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

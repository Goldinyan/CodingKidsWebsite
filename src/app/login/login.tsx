"use client";

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { useState } from "react";
import { loginSchema } from "../../../BackEnd/Joi";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setErrorMsg("");
    const formData = { email, password };
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

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primaryOwn mb-2">Anmelden</h2>
        <p className="text-graytext">Willkommen zurück! Bitte melde dich an.</p>
      </div>

      <div className="space-y-4">
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
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-lightRedBg border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full py-3 bg-primaryOwn hover:bg-fifthOwn text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Wird angemeldet..." : "Anmelden"}
      </button>
    </div>
  );
}

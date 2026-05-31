"use client";

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { useState } from "react";
import { loginSchema } from "../../../BackEnd/Joi";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "").substring(0, 255);
  //  damit wird alle "< und >" entfernt damit sowas nicht möglich ist als input <script>...</script>
};

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { theme } = useTheme();

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
        <h2 className={`text-3xl font-bold ml-[2px] mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          Anmelden
        </h2>
        <p className={`ml-[2px] font-light ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
          Willkommen zurück! Bitte melde dich an.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`block text-sm ml-[2px] font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
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
        onClick={handleLogin}
        disabled={isLoading || !email || !password}
        className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${theme === "dark"
          ? "bg-white text-black hover:bg-gray-100"
          : "bg-green-600 text-white hover:bg-green-700"
        }`}
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

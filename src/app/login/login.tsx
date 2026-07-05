"use client";

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { useState } from "react";
import { loginSchema } from "../../../BackEnd/Joi";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "").substring(0, 255);
};

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { theme, isRounded } = useTheme();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";
  const checkboxRoundedClass = isRounded ? "rounded" : "rounded-none";

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading || !email || !password) return;
    
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
      await loginUser(value.email, value.password, rememberMe);
      router.push("/");
    } catch (err) {
      setErrorMsg("Anmeldung fehlgeschlagen. Überprüfe deine E-Mail und dein Passwort.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span
          className={`block font-mono text-[10px] font-bold tracking-widest uppercase ${
            theme === "dark" ? "text-zinc-500" : "text-slate-400"
          }`}
        >
          Anmeldung 
        </span>
        <h2
          className={`text-2xl font-sans font-bold tracking-tight ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}
        >
          Willkommen zurück!
        </h2>
        <p
          className={`text-xs font-sans ${
            theme === "dark" ? "text-zinc-500" : "text-slate-400"
          }`}
        >
          Bitte melde dich an, um auf deine Lernumgebung zuzugreifen.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 font-['JetBrains_Mono'] text-xs">
        <div className="flex flex-col gap-1.5">
          <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>
            Deine E-Mail-Adresse
          </label>
          <div className="relative flex items-center">
            <Mail
              className={`absolute left-3 w-4 h-4 pointer-events-none ${
                theme === "dark" ? "text-zinc-600" : "text-slate-400"
              }`}
            />
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

        <div className="flex flex-col gap-1.5">
          <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>
            Dein Passwort
          </label>
          <div className="relative flex items-center">
            <Lock
              className={`absolute left-3 w-4 h-4 pointer-events-none ${
                theme === "dark" ? "text-zinc-600" : "text-slate-400"
              }`}
            />
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

        <div className="flex items-center py-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={`w-4 h-4 border appearance-none transition-all duration-150 checked:bg-zinc-900 dark:checked:bg-zinc-100 focus:outline-none cursor-pointer relative ${checkboxRoundedClass} ${
                theme === "dark"
                  ? "border-zinc-800 bg-zinc-950 focus:border-zinc-500"
                  : "border-slate-300 bg-slate-50 focus:border-slate-400"
              } before:content-['✓'] before:absolute before:text-[10px] before:font-bold before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-0 checked:before:opacity-100 ${
                theme === "dark" ? "checked:before:text-zinc-950" : "checked:before:text-white"
              }`}
            />
            <span
              className={`text-xs font-sans font-medium ${
                theme === "dark" ? "text-zinc-400" : "text-slate-600"
              }`}
            >
              Angemeldet bleiben
            </span>
          </label>
        </div>

        {errorMsg && (
          <div
            className={`flex items-start gap-2.5 p-3 text-xs border animate-shake ${innerRoundedClass} ${
              theme === "dark"
                ? "bg-rose-950/20 border-rose-900/60 text-rose-400"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="font-sans font-medium leading-relaxed">{errorMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className={`w-full py-2 px-4 font-sans font-bold text-xs transition-all duration-150 border uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] mt-2 ${innerRoundedClass} ${
            theme === "dark"
              ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-950 border-zinc-100"
              : "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900"
          }`}
        >
          {isLoading ? "Wird angemeldet..." : "Anmelden"}
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

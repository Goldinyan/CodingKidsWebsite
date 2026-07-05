"use client";

import LoginView from "./login";
import RegisterView from "./register";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [view, setView] = useState<"Login" | "SignUp">("Login");
  const { theme, isRounded } = useTheme();
  const router = useRouter();

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 relative z-10 select-none">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div
          className={`w-full border backdrop-blur-sm p-8 shadow-2xl transition-all duration-300 ${roundedClass} ${theme === "dark"
              ? "bg-zinc-950 border-zinc-900 text-zinc-200"
              : "bg-white border-slate-200 text-slate-900"
            }`}
        >
          <div
            className={`flex gap-1 p-0.5 border mb-6 ${innerRoundedClass} ${theme === "dark"
                ? "bg-zinc-900/40 border-zinc-900"
                : "bg-slate-100 border-slate-200"
              }`}
          >
            <button
              onClick={() => setView("Login")}
              className={`flex-1 py-2 text-xs font-semibold transition-all duration-150 ${innerRoundedClass} ${view === "Login"
                  ? theme === "dark"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "bg-white text-slate-900 shadow-sm border border-slate-200/40"
                  : theme === "dark"
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-slate-400 hover:text-slate-700"
                }`}
            >
              Anmelden
            </button>
            <button
              onClick={() => setView("SignUp")}
              className={`flex-1 py-2 text-xs font-semibold transition-all duration-150 ${innerRoundedClass} ${view === "SignUp"
                  ? theme === "dark"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "bg-white text-slate-900 shadow-sm border border-slate-200/40"
                  : theme === "dark"
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-slate-400 hover:text-slate-700"
                }`}
            >
              Registrieren
            </button>
          </div>

          <div className="relative overflow-hidden transition-all duration-300">
            <div className="flex w-full min-h-[380px] relative">
              <div
                className={`w-full transition-all duration-300 ease-in-out transform flex-shrink-0 ${view === "Login"
                    ? "opacity-100 translate-x-0 static"
                    : "opacity-0 -translate-x-full absolute pointer-events-none"
                  }`}
              >
                <LoginView />
              </div>

              {/* Register View */}
              <div
                className={`w-full transition-all duration-300 ease-in-out transform flex-shrink-0 ${view === "SignUp"
                    ? "opacity-100 translate-x-0 static"
                    : "opacity-0 translate-x-full absolute pointer-events-none"
                  }`}
              >
                <RegisterView />
              </div>
            </div>
          </div>

          <div
            className={`mt-6 pt-5 border-t text-center text-xs transition-colors duration-300 ${theme === "dark"
                ? "border-zinc-900 text-zinc-500"
                : "border-slate-100 text-slate-400"
              }`}
          >
            {view === "Login" ? (
              <p>
                Noch kein Konto?{" "}
                <button
                  onClick={() => setView("SignUp")}
                  className={`font-semibold underline underline-offset-4 transition-colors ${theme === "dark"
                      ? "text-zinc-300 hover:text-white"
                      : "text-slate-900 hover:text-slate-700"
                    }`}
                >
                  Jetzt registrieren
                </button>
              </p>
            ) : (
              <p>
                Bereits registriert?{" "}
                <button
                  onClick={() => setView("Login")}
                  className={`font-semibold underline underline-offset-4 transition-colors ${theme === "dark"
                      ? "text-zinc-300 hover:text-white"
                      : "text-slate-900 hover:text-slate-700"
                    }`}
                >
                  Hier anmelden
                </button>
              </p>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col items-center gap-2 text-center text-[11px] font-sans transition-colors ${theme === "dark" ? "text-zinc-600" : "text-slate-400"
            }`}
        >
          <p className="max-w-[320px] leading-normal">
            Mit deiner Anmeldung akzeptierst du unsere Datenschutzbestimmungen.
          </p>
        </div>
      </div>
    </div>
  );
}

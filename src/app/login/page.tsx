"use client";

import LoginView from "./login";
import RegisterView from "./register";
import { useState } from "react";

export default function Home() {
  const [view, setView] = useState<"Login" | "SignUp">("Login");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black w-full flex items-center justify-center px-4 relative">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-30" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 w-full border border-white/10 backdrop-blur-sm p-8">
          <div className="flex gap-2 mb-8 w-full border-b border-white/10">
            <button
              onClick={() => setView("Login")}
              className={`flex-1 pb-4 font-semibold transition-all duration-300 ${
                view === "Login"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              Anmelden
            </button>
            <button
              onClick={() => setView("SignUp")}
              className={`flex-1 pb-4 font-semibold transition-all duration-300 ${
                view === "SignUp"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              Registrieren
            </button>
          </div>

          <div className="relative overflow-hidden min-h-[400px]">
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                view === "Login"
                  ? "opacity-100 translate-x-0"
                  : "absolute opacity-0 translate-x-full pointer-events-none"
              }`}
            >
              <LoginView />
            </div>
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                view === "SignUp"
                  ? "opacity-100 translate-x-0"
                  : "absolute opacity-0 -translate-x-full pointer-events-none"
              }`}
            >
              <RegisterView />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400 animate-fade-in">
            {view === "Login" ? (
              <p>
                Noch kein Konto?{" "}
                <button
                  onClick={() => setView("SignUp")}
                  className="text-white font-semibold hover:text-gray-300 transition-colors"
                >
                  Jetzt registrieren
                </button>
              </p>
            ) : (
              <p>
                Bereits registriert?{" "}
                <button
                  onClick={() => setView("Login")}
                  className="text-white font-semibold hover:text-gray-300 transition-colors"
                >
                  Hier anmelden
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Mit deiner Anmeldung akzeptierst du unsere Datenschutzbestimmungen
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

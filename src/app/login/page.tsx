"use client";

import LoginView from "./login";
import RegisterView from "./register";
import { useState } from "react";

export default function Home() {
  const [view, setView] = useState<"Login" | "SignUp">("Login");

  return (
    <div className="min-h-screen bg-otherbg w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white w-full rounded-xl shadow-md border border-lightborder p-8">
          <div className="flex gap-2 mb-8 w-full border-b border-lightborder">
            <button
              onClick={() => setView("Login")}
              className={`flex-1 pb-4 font-semibold transition-all duration-300 ${view === "Login"
                  ? "text-primaryOwn border-b-2 border-primaryOwn"
                  : "text-graytext hover:text-foreground"
                }`}
            >
              Anmelden
            </button>
            <button
              onClick={() => setView("SignUp")}
              className={`flex-1 pb-4 font-semibold transition-all duration-300 ${view === "SignUp"
                  ? "text-primaryOwn border-b-2 border-primaryOwn"
                  : "text-graytext hover:text-foreground"
                }`}
            >
              Registrieren
            </button>
          </div>

          <div className="relative overflow-hidden min-h-[400px]">
            <div
              className={`transition-all duration-500 ease-in-out transform ${view === "Login"
                  ? "opacity-100 translate-x-0"
                  : "absolute opacity-0 translate-x-full pointer-events-none"
                }`}
            >
              <LoginView />
            </div>
            <div
              className={`transition-all duration-500 ease-in-out transform ${view === "SignUp"
                  ? "opacity-100 translate-x-0"
                  : "absolute opacity-0 -translate-x-full pointer-events-none"
                }`}
            >
              <RegisterView />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-lightborder text-center text-sm text-graytext animate-fade-in">
            {view === "Login" ? (
              <p>
                Noch kein Konto?{" "}
                <button
                  onClick={() => setView("SignUp")}
                  className="text-primaryOwn font-semibold hover:underline transition-colors"
                >
                  Jetzt registrieren
                </button>
              </p>
            ) : (
              <p>
                Bereits registriert?{" "}
                <button
                  onClick={() => setView("Login")}
                  className="text-primaryOwn font-semibold hover:underline transition-colors"
                >
                  Hier anmelden
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-graytext">
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

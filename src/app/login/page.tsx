"use client";

import LoginView from "./login";
import RegisterView from "./register";
import { useState } from "react";

export default function Home() {
  const [view, setView] = useState<"Login" | "SignUp">("Login");

  return (
    <div className="min-h-screen bg-otherbg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md border border-lightborder p-8">
          <div className="flex gap-2 mb-8 border-b border-lightborder">
            <button
              onClick={() => setView("Login")}
              className={`flex-1 pb-4 font-semibold transition-colors ${
                view === "Login"
                  ? "text-primaryOwn border-b-2 border-primaryOwn"
                  : "text-graytext hover:text-foreground"
              }`}
            >
              Anmelden
            </button>
            <button
              onClick={() => setView("SignUp")}
              className={`flex-1 pb-4 font-semibold transition-colors ${
                view === "SignUp"
                  ? "text-primaryOwn border-b-2 border-primaryOwn"
                  : "text-graytext hover:text-foreground"
              }`}
            >
              Registrieren
            </button>
          </div>

          {view === "Login" && <LoginView />}
          {view === "SignUp" && <RegisterView />}

          <div className="mt-8 pt-6 border-t border-lightborder text-center text-sm text-graytext">
            {view === "Login" ? (
              <p>
                Noch kein Konto?{" "}
                <button
                  onClick={() => setView("SignUp")}
                  className="text-primaryOwn font-semibold hover:underline"
                >
                  Jetzt registrieren
                </button>
              </p>
            ) : (
              <p>
                Bereits registriert?{" "}
                <button
                  onClick={() => setView("Login")}
                  className="text-primaryOwn font-semibold hover:underline"
                >
                  Hier anmelden
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-graytext">
          <p>Mit deiner Anmeldung akzeptierst du unsere Datenschutzbestimmungen</p>
        </div>
      </div>
    </div>
  );
}
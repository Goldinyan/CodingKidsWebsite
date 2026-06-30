"use client";

import LoginView from "./login";
import RegisterView from "./register";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [view, setView] = useState<"Login" | "SignUp">("Login");
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div
      className={`
     ${view == "Login" ? "min-h-220" : "min-h-270"}  
     w-full flex items-center justify-center relative main-view-container px-4`}
    >
      <div className="w-full max-w-md relative z-10">
        <div
          className={` ${theme == "dark" ? "bg-base-white/5 border-base-white/10" : "bg-black/5 border-black/10 "}
w-full border backdrop-blur-sm p-8`}
        >
          <div
            className={`flex gap-2 mb-8 w-full border-b ${theme == "dark" ? "border-white/10" : "border-black/10"}`}
          >
            <button
              onClick={() => setView("Login")}
              className={`flex-1 pb-4 font-semibold transition-all duration-300 ${view === "Login"
                  ? theme === "dark"
                    ? "text-white border-b-2 border-white"
                    : "text-slate-900 border-b-2 border-slate-900"
                  : theme === "dark"
                    ? "text-gray-500 hover:text-gray-400"
                    : "text-slate-600 hover:text-slate-700"
                }`}
            >
              Anmelden
            </button>
            <button
              onClick={() => setView("SignUp")}
              className={`flex-1 pb-4 font-semibold transition-all duration-300 ${view === "SignUp"
                  ? theme === "dark"
                    ? "text-white border-b-2 border-white"
                    : "text-slate-900 border-b-2 border-slate-900"
                  : theme === "dark"
                    ? "text-gray-500 hover:text-gray-400"
                    : "text-slate-600 hover:text-slate-700"
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

          <div
            className={`mt-8 pt-6 border-t ${theme == "dark" ? "border-white/10 text-gray-400" : "border-black/10 text-slate-600"} text-center text-sm animate-fade-in`}
          >
            {view === "Login" ? (
              <p>
                Noch kein Konto?{" "}
                <button
                  onClick={() => setView("SignUp")}
                  className={`font-semibold transition-colors ${theme == "dark" ? "text-white hover:text-gray-300" : "text-slate-900 hover:text-slate-700"}`}
                >
                  Jetzt registrieren
                </button>
              </p>
            ) : (
              <p>
                Bereits registriert?{" "}
                <button
                  onClick={() => setView("Login")}
                  className={`font-semibold transition-colors ${theme == "dark" ? "text-white hover:text-gray-300" : "text-slate-900 hover:text-slate-700"}`}
                >
                  Hier anmelden
                </button>
              </p>
            )}
          </div>
        </div>

        <div
          className={`mt-8 text-center text-sm ${theme == "dark" ? "text-gray-500" : "text-slate-600"}`}
        >
          <p>
            Mit deiner Anmeldung akzeptierst du unsere Datenschutzbestimmungen
          </p>
          <div>
            <p onClick={() => router.push("http://localhost:3000/impressum")}>
              Imressum
            </p>
          </div>
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

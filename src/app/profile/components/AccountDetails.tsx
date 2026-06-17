import { Theme } from "@/context/ThemeContext";
import { UserData } from "@/BackEnd/type";
import {
  Mail,
  Calendar,
  Code2,
  Layers,
} from "lucide-react";
import { toJsDate } from "@/BackEnd/utils";
import { Timestamp } from "firebase/firestore";

const getMemberDays = (t: Timestamp | null) =>
  t ? Math.floor((Date.now() - toJsDate(t).getTime()) / 86400000) : -1;


export default function AccountDetails({
  theme,
  isRounded,
  userData,
}: {
  theme: Theme;
  isRounded: boolean;
  userData: UserData;
}) {
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  return (
    <div
      className={`md:col-span-2 backdrop-blur-xl p-6 border transition-all duration-300 space-y-6 ${roundedClass} ${theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-slate-100 border-slate-200"
        }`}
    >
      <h3
        className={`text-sm font-mono tracking-widest uppercase ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
      >
        Account Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={`p-4 border transition-colors duration-300 flex items-start gap-3 ${innerRoundedClass} ${theme === "dark"
              ? "bg-black/30 border-white/5"
              : "bg-white border-slate-200"
            }`}
        >
          <Mail
            className={`w-5 h-5 mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
          />
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
              E-Mail Adresse
            </p>
            <p
              className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              {userData.email}
            </p>
          </div>
        </div>

        <div
          className={`p-4 border transition-colors duration-300 flex items-start gap-3 ${innerRoundedClass} ${theme === "dark"
              ? "bg-black/30 border-white/5"
              : "bg-white border-slate-200"
            }`}
        >
          <Calendar
            className={`w-5 h-5 mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
          />
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
              Mitglied seit
            </p>
            <p
              className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              {getMemberDays(userData.createdAt) >= 0
                ? `${getMemberDays(userData.createdAt)} Tagen`
                : "Unbekannt"}
            </p>
          </div>
        </div>

        <div
          className={`p-4 border transition-colors duration-300 flex items-start gap-3 ${innerRoundedClass} ${theme === "dark"
              ? "bg-black/30 border-white/5"
              : "bg-white border-slate-200"
            }`}
        >
          <Code2
            className={`w-5 h-5 mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
          />
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
              Aktive Kurse
            </p>
            <p
              className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              {userData.courses?.length || 0} Kurse belegt
            </p>
          </div>
        </div>

        <div
          className={`p-4 border transition-colors duration-300 flex items-start gap-3 ${innerRoundedClass} ${theme === "dark"
              ? "bg-black/30 border-white/5"
              : "bg-white border-slate-200"
            }`}
        >
          <Layers
            className={`w-5 h-5 mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
          />
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
              Eigene Projekte
            </p>
            <p
              className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              {userData.projects?.length || 0} Projekte gestartet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

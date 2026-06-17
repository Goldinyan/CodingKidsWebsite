import { UserData } from "@/BackEnd/type";
import { Theme } from "@/context/ThemeContext";

export default function UIConfig({
  theme,
  isRounded,
  userData,
}: {
  theme: Theme;
  isRounded: boolean;
  userData: UserData;
}) {
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";

  return (
    <div
      className={`backdrop-blur-xl p-6 border transition-all duration-300 space-y-4 flex-1 ${roundedClass} ${theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-slate-100 border-slate-200"
        }`}
    >
      <h3
        className={`text-sm font-mono tracking-widest uppercase ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
      >
        UI Config
      </h3>
      <div className="space-y-3 font-mono text-xs">
        <div className="flex justify-between py-1.5 border-b border-white/5">
          <span className="text-gray-500">Theme:</span>
          <span
            className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {theme.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-white/5">
          <span className="text-gray-500">Borders:</span>
          <span
            className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {isRounded ? "Rounded" : "Sharp"}
          </span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-gray-500">Children:</span>
          <span
            className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {userData.children?.length || 0} verknüpft
          </span>
        </div>
      </div>
    </div>
  );
}

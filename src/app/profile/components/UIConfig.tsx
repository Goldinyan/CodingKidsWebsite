import { UserData } from "@/BackEnd/type";
import { Theme } from "@/context/ThemeContext";

export default function UIConfig({
  theme,
  toggleTheme,
  isRounded,
  toggleRounded,
}: {
  theme: Theme;
  toggleTheme: () => void;
  isRounded: boolean;
  toggleRounded: () => void;
}) {
  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  return (
    <div
      className={`backdrop-blur-xl  p-6 border transition-all duration-300 space-y-4 flex-1 ${roundedClass} ${theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-slate-100 border-slate-200"
        }`}
    >
      <h3
        className={`text-sm font-mono tracking-widest uppercase ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
      >
        UI Config
      </h3>
      <p
        className={`text-xs font-mono tracking-normal ${theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}
      >
        Konfiguration der optischen Parameter für das Interface.
      </p>
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <span className="text-gray-500 font-mono text-xs">Theme:</span>

          <div
            className={`flex items-center border font-mono text-xs select-none p-0.5 ${innerRoundedClass} ${theme === "dark"
                ? "bg-black/30 border-white/5"
                : "bg-white border-slate-200"
              }`}
          >
            <button
              onClick={() => {
                if (!(theme == "dark")) return;
                toggleTheme();
              }}
              className={`px-2.5 py-1 tracking-wider uppercase transition-all duration-300 ${innerRoundedClass} ${theme !== "dark"
                  ? "bg-black/5 text-slate-900 font-bold"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              Light
            </button>

            <span
              className={`text-xs mr-1 transition-colors duration-300 ${theme === "dark" ? "text-white/10" : "text-slate-300"
                }`}
            >
              |
            </span>

            <button
              onClick={() => {
                if (!(theme == "light")) return;
                toggleTheme();
              }}
              className={`px-2.5 py-1 tracking-wider uppercase transition-all duration-300 ${innerRoundedClass} 
                } ${theme === "dark"
                  ? "bg-white/10 text-white font-bold"
                  : "bg-none text-slate-900 font-bold"
                }`}
            >
              Dark
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between py-2 ">
          <span className="text-gray-500 font-mono text-xs">Borders:</span>

          <div
            className={`flex items-center border font-mono text-xs select-none p-0.5 ${innerRoundedClass} ${theme === "dark"
                ? "bg-black/30 border-white/5"
                : "bg-white border-slate-200"
              }`}
          >
            <button
              onClick={() => {
                if (!isRounded) return;
                toggleRounded();
              }}
              className={`px-2.5 py-1 tracking-wider uppercase transition-all duration-300 ${innerRoundedClass} ${!isRounded
                  ? theme === "dark"
                    ? "bg-white/10 text-white font-bold"
                    : "bg-black/5 text-slate-900 font-bold"
                  : theme === "dark"
                    ? "text-gray-500 hover:text-gray-300 bg-transparent"
                    : "text-slate-400 hover:text-slate-900 bg-transparent"
                }`}
            >
              Sharp
            </button>

            <span
              className={`text-xs mx-1 transition-colors duration-300 ${theme === "dark" ? "text-white/10" : "text-slate-300"
                }`}
            >
              |
            </span>

            <button
              onClick={() => {
                if (isRounded) return;
                toggleRounded();
              }}
              className={`px-2.5 py-1 tracking-wider uppercase transition-all duration-300 ${innerRoundedClass} ${isRounded
                  ? theme === "dark"
                    ? "bg-white/10 text-white font-bold"
                    : "bg-black/5 text-slate-900 font-bold"
                  : theme === "dark"
                    ? "text-gray-500 hover:text-gray-300 bg-transparent"
                    : "text-slate-400 hover:text-slate-900 bg-transparent"
                }`}
            >
              Smooth
            </button>
          </div>
        </div>
        {/*
        <div className="flex justify-between py-1.5">
          <span className="text-gray-500">Children:</span>
          <span
            className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {userData.children?.length || 0} verknüpft
          </span>
        </div> */}
      </div>
    </div>
  );
}

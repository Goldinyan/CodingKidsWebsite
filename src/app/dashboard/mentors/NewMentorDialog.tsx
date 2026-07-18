import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "@/context/ThemeContext";
import { X, Plus } from "lucide-react";
import type { Mentor } from "@/BackEnd/type";

export function NewMentorDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newMentor: Partial<Mentor>;
  onNewMentorChange: (next: Partial<Mentor>) => void;
  onCreate: () => void;
}) {
  const {
    open,
    onOpenChange,
    newMentor,
    onNewMentorChange,
    onCreate,
  } = props;

  const { theme, isRounded } = useTheme();
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";
  const isDark = theme === "dark";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-lg border p-6 transition-colors duration-200 focus:outline-none ${radiusClass} ${
          isDark
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        }`}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase">
            Neuer_Mentor
          </DialogTitle>
          <DialogDescription
            className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase pt-1 ${
              isDark ? "text-zinc-500" : "text-slate-400"
            }`}
          >
            Initialisierung eines neuen administrativen Accounts im Core-System
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 font-['JetBrains_Mono']">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-[10px] tracking-wider uppercase mb-1.5 ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                NAME *
              </label>
              <input
                type="text"
                placeholder="Z.B. ANSGAR SEIFERT"
                value={newMentor.name || ""}
                onChange={(e) =>
                  onNewMentorChange({ ...newMentor, name: e.target.value })
                }
                className={`w-full px-3 py-2.5 text-xs uppercase tracking-wide border focus:outline-none focus:border-purple-600 transition-colors ${radiusClass} ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-[10px] tracking-wider uppercase mb-1.5 ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                ROLLE / POSITION
              </label>
              <input
                type="text"
                placeholder="Z.B. SYSTEM ARCHITECT"
                value={newMentor.role || ""}
                onChange={(e) =>
                  onNewMentorChange({ ...newMentor, role: e.target.value })
                }
                className={`w-full px-3 py-2.5 text-xs uppercase tracking-wide border focus:outline-none focus:border-purple-600 transition-colors ${radiusClass} ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-[10px] tracking-wider uppercase mb-1.5 ${
                isDark ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              BILD-URL (AVATAR)
            </label>
            <input
              type="text"
              placeholder="HTTPS://..."
              value={newMentor.pic || ""}
              onChange={(e) =>
                onNewMentorChange({ ...newMentor, pic: e.target.value })
              }
              className={`w-full px-3 py-2.5 text-xs border focus:outline-none focus:border-purple-600 transition-colors ${radiusClass} ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-[10px] tracking-wider uppercase mb-1.5 ${
                isDark ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              BESCHREIBUNG
            </label>
            <textarea
              placeholder="PROFIL-SPEZIFIKATION HINTERLEGEN..."
              value={newMentor.des || ""}
              onChange={(e) =>
                onNewMentorChange({ ...newMentor, des: e.target.value })
              }
              className={`w-full px-3 py-2.5 text-xs uppercase tracking-wide border focus:outline-none focus:border-purple-600 resize-none transition-colors ${radiusClass} ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
              }`}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                className={`block text-[9px] tracking-wider uppercase mb-1 ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                INSTAGRAM
              </label>
              <input
                type="text"
                placeholder="LINK"
                value={newMentor.insta || ""}
                onChange={(e) =>
                  onNewMentorChange({ ...newMentor, insta: e.target.value })
                }
                className={`w-full px-2 py-1.5 text-xs border focus:outline-none focus:border-purple-600 ${radiusClass} ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label
                className={`block text-[9px] tracking-wider uppercase mb-1 ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                GITHUB
              </label>
              <input
                type="text"
                placeholder="LINK"
                value={newMentor.github || ""}
                onChange={(e) =>
                  onNewMentorChange({ ...newMentor, github: e.target.value })
                }
                className={`w-full px-2 py-1.5 text-xs border focus:outline-none focus:border-purple-600 ${radiusClass} ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label
                className={`block text-[9px] tracking-wider uppercase mb-1 ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                LINKEDIN
              </label>
              <input
                type="text"
                placeholder="LINK"
                value={newMentor.linkedin || ""}
                onChange={(e) =>
                  onNewMentorChange({ ...newMentor, linkedin: e.target.value })
                }
                className={`w-full px-2 py-1.5 text-xs border focus:outline-none focus:border-purple-600 ${radiusClass} ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-2 pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-900/60 justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${
              isDark
                ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            }`}
          >
            <X className="w-3.5 h-3.5" />
            ABBRECHEN
          </button>
          <button
            onClick={onCreate}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} ${
              isDark
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-600 hover:bg-purple-700 shadow-sm"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            ERSTELLEN
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

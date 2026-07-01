"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function DeleteEventDialog(props: {
  open: boolean;
  eventName: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const { open, eventName, onOpenChange, onConfirm } = props;
  const { theme, isRounded } = useTheme();

  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";
  const isDark = theme === "dark";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-md border p-6 transition-colors duration-200 focus:outline-none ${radiusClass} ${
          isDark
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        }`}
      >
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <AlertTriangle className="w-5 h-5 stroke-[2]" />
            <DialogTitle
              className="text-2xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase"
            >
              EVENT_LÖSCHEN?
            </DialogTitle>
          </div>
          <DialogDescription
            className={`font-['JetBrains_Mono'] text-[11px] tracking-wide uppercase leading-relaxed ${
              isDark ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            Soll die Veranstaltung <span className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>&quot;{eventName}&quot;</span> permanent aus der System-Matrix entfernt werden?
          </DialogDescription>
        </DialogHeader>

        <div
          className={`p-3 border border-dashed font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase mb-4 ${radiusClass} ${
            isDark
              ? "bg-red-950/20 border-red-900/50 text-red-400"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          WARNUNG: Diese Operation überschreibt Datenstrukturen irreversibel. Registrierte Teilnehmer verlieren ihren Slot.
        </div>

        <DialogFooter className="flex flex-row gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 justify-end">
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
            onClick={onConfirm}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} ${
              isDark
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-600 hover:bg-red-700 shadow-sm"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            LÖSCHEN
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

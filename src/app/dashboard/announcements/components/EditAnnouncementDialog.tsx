"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function EditAnnouncementDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; content: string };
  onChange: (next: { title: string; content: string }) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { open, onOpenChange, value, onChange, onSave, onCancel } = props;
  const { theme, isRounded } = useTheme();

  const isDark = theme === "dark";
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) onCancel();
      }}
    >
      <DialogContent
        className={`max-w-lg border p-6 transition-colors duration-200 focus:outline-none ${radiusClass} ${isDark
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
          }`}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase">
            ANKÜNDIGUNG_BEARBEITEN
          </DialogTitle>
          <DialogDescription
            className={`font-['JetBrains_Mono'] text-[11px] tracking-wide uppercase mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"
              }`}
          >
            Modifikation bestehender Datensätze innerhalb der globalen
            Feed-Struktur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 font-['JetBrains_Mono']">
          {/* TITEL INPUT */}
          <div>
            <label
              className={`block text-[10px] tracking-wider uppercase mb-1.5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}
            >
              TITEL
            </label>
            <input
              type="text"
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              className={`w-full px-3 py-2 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
            />
          </div>

          {/* INHALT TEXTAREA */}
          <div>
            <label
              className={`block text-[10px] tracking-wider uppercase mb-1.5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}
            >
              INHALT
            </label>
            <textarea
              value={value.content}
              onChange={(e) => onChange({ ...value, content: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 resize-none transition-colors ${radiusClass} ${isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
            />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <DialogFooter className="flex flex-row gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 justify-end mt-4">
          <button
            onClick={onCancel}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${isDark
                ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            <X className="w-3.5 h-3.5" />
            ABBRECHEN
          </button>
          <button
            onClick={onSave}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} bg-green-600 hover:bg-green-700 shadow-sm`}
          >
            <Check className="w-3.5 h-3.5" />
            SPEICHERN
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

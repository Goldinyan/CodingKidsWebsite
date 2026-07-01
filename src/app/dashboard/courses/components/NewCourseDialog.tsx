"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { CourseData } from "@/BackEnd/type";

export function NewCourseDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCourse: Partial<CourseData>;
  tagInput: string;
  onNewCourseChange: (next: Partial<CourseData>) => void;
  onTagInputChange: (value: string) => void;
  onCreate: () => void;
}) {
  const {
    open,
    onOpenChange,
    newCourse,
    tagInput,
    onNewCourseChange,
    onTagInputChange,
    onCreate,
  } = props;

  const { theme, isRounded } = useTheme();
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";
  const isDark = theme === "dark";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-lg border p-6 transition-colors duration-200 focus:outline-none ${radiusClass} ${isDark
            ? "bg-zinc-950 border-zinc-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
          }`}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase">
            Neuer_Kurs
          </DialogTitle>
          <DialogDescription
            className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase pt-1 ${isDark ? "text-zinc-500" : "text-slate-400"
              }`}
          >
            Initialisierung eines neuen Lehr-Moduls im Core-System
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 font-['JetBrains_Mono']">
          <div>
            <label
              className={`block text-[10px] tracking-wider uppercase mb-1.5 ${isDark ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              KURS_NAME *
            </label>
            <input
              type="text"
              placeholder="Z.B. PYTHON_GRUNDLAGEN"
              value={newCourse.name || ""}
              onChange={(e) =>
                onNewCourseChange({ ...newCourse, name: e.target.value })
              }
              className={`w-full px-3 py-2.5 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
            />
          </div>

          <div>
            <label
              className={`block text-[10px] tracking-wider uppercase mb-1.5 ${isDark ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              BESCHREIBUNG
            </label>
            <textarea
              placeholder="MODUL_SPEZIFIKATION HINTERLEGEN..."
              value={newCourse.des || ""}
              onChange={(e) =>
                onNewCourseChange({ ...newCourse, des: e.target.value })
              }
              className={`w-full px-3 py-2.5 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 resize-none transition-colors ${radiusClass} ${isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
              rows={4}
            />
          </div>

          <div>
            <label
              className={`block text-[10px] tracking-wider uppercase mb-1.5 ${isDark ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              TAGS (KOMMA_GETRENNT)
            </label>
            <input
              type="text"
              placeholder="Z.B. NEXTJS, PRO_CODER, FRONTEND"
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              className={`w-full px-3 py-2.5 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-2 pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-900/60 justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${isDark
                ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
              }`}
          >
            <X className="w-3.5 h-3.5" />
            ABBRECHEN
          </button>
          <button
            onClick={onCreate}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} ${isDark
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-600 hover:bg-green-700 shadow-sm"
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

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
import type { Mentor, UserData } from "@/BackEnd/type";

export function AssignMentorsDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string | null;
  availableMentors: UserData[];
  selectedMentorIds: string[];
  onSelectedMentorsChange: (mentorIds: string[]) => void;
  onSave: () => void;
  isLoading?: boolean;
}) {
  const {
    open,
    onOpenChange,
    courseName,
    availableMentors,
    selectedMentorIds,
    onSelectedMentorsChange,
    onSave,
    isLoading = false,
  } = props;

  const { theme, isRounded } = useTheme();
  const isDark = theme === "dark";
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

  const toggleMentor = (mentorId: string) => {
    if (selectedMentorIds.includes(mentorId)) {
      onSelectedMentorsChange(
        selectedMentorIds.filter((id) => id !== mentorId),
      );
    } else {
      onSelectedMentorsChange([...selectedMentorIds, mentorId]);
    }
  };

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
            MENTOR_ZUORDNUNG
          </DialogTitle>
          <DialogDescription
            className={`font-['JetBrains_Mono'] text-[11px] tracking-wide uppercase mt-2 ${
              isDark ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            Verfügbare Mentoren für: {courseName || "Kurs"}
          </DialogDescription>
        </DialogHeader>

        <div
          className={`space-y-2 max-h-96 overflow-y-auto ${
            isDark ? "bg-zinc-900/40" : "bg-slate-50"
          } p-4 rounded`}
        >
          {availableMentors.length === 0 ? (
            <div
              className={`text-center py-8 font-['JetBrains_Mono'] text-xs tracking-wider uppercase ${
                isDark ? "text-zinc-600" : "text-slate-400"
              }`}
            >
              Keine Mentoren verfügbar
            </div>
          ) : (
            availableMentors.map((mentor) => (
              <label
                key={mentor.uid}
                className={`flex items-center gap-3 p-3 cursor-pointer border transition-colors rounded-lg ${radiusClass} ${
                  selectedMentorIds.includes(mentor.uid)
                    ? isDark
                      ? "bg-green-950/40 border-green-700/50"
                      : "bg-green-50 border-green-200"
                    : isDark
                      ? "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedMentorIds.includes(mentor.uid)}
                  onChange={() => toggleMentor(mentor.uid)}
                  disabled={isLoading}
                  className="w-5 h-5 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-['JetBrains_Mono'] text-sm font-bold tracking-wider uppercase truncate ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {mentor.name}
                  </div>
                  <div
                    className={`font-['JetBrains_Mono'] text-[10px] tracking-wide opacity-70 ${
                      isDark ? "text-zinc-400" : "text-slate-500"
                    }`}
                  >
                    {mentor.role}
                  </div>
                </div>
              </label>
            ))
          )}
        </div>

        <DialogFooter className="flex flex-row gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 justify-end mt-4">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} disabled:opacity-50 ${
              isDark
                ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <X className="w-3.5 h-3.5" />
            ABBRECHEN
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} disabled:opacity-50 bg-green-600 hover:bg-green-700 shadow-sm`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2]" />
            SPEICHERN
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

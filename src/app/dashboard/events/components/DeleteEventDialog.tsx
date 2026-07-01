"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`border transition-all duration-200 ${radiusClass} ${
          theme === "dark"
            ? "bg-zinc-950 border-zinc-800 text-[#f4f4f5]"
            : "bg-white border-slate-200 text-slate-700 shadow-lg"
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-black font-['Familjen_Grotesk'] tracking-tight ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Event löschen?
          </DialogTitle>
          <DialogDescription
            className={`text-xs font-medium leading-relaxed mt-2 ${
              theme === "dark" ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            Möchtest du &quot;
            <span className={theme === "dark" ? "text-zinc-200" : "text-slate-800"}>
              {eventName}
            </span>
            &quot; wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`py-2 px-4 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 ${radiusClass} ${
              theme === "dark"
                ? "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Abbrechen
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            className={`py-2 px-4 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 ${radiusClass} ${
              theme === "dark"
                ? "bg-red-950/40 text-red-400 border border-red-900/60 hover:bg-red-900/40"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            Löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

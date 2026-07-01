"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Timestamp } from "firebase/firestore";
import type { UserData, UserRole } from "@/BackEnd/type";
import { USER_ROLES_ARRAY } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";
import { toJsDate } from "@/BackEnd/utils";

export function EditUserDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editValues: Partial<UserData>;
  onEditValuesChange: (next: Partial<UserData>) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const {
    open,
    onOpenChange,
    editValues,
    onEditValuesChange,
    onCancel,
    onSave,
  } = props;

  const { theme, isRounded } = useTheme();
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
        className={`max-w-xl border font-['DM_Sans'] p-8 transition-colors duration-200 ${radiusClass} ${theme === "dark"
            ? "bg-zinc-950 border-zinc-800 text-[#f4f4f5]"
            : "bg-white border-slate-200 text-slate-700 shadow-2xl"
          }`}
      >
        <DialogHeader className="mb-4">
          <DialogTitle
            className={`text-3xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Nutzer Bearbeiten
          </DialogTitle>
          <DialogDescription
            className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
              }`}
          >
            Änderung des Datensatzes in der lokalen Datenbank
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
          <div className="md:col-span-1">
            <label
              className={`block font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-2 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Name
            </label>
            <input
              type="text"
              value={editValues.name || ""}
              onChange={(e) =>
                onEditValuesChange({ ...editValues, name: e.target.value })
              }
              className={`w-full px-4 py-3 text-xs font-medium transition-all duration-200 focus:outline-none ${radiusClass} ${theme === "dark"
                  ? "bg-zinc-900 border border-zinc-800 text-white focus:border-[#4ADE80]"
                  : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-green-600 focus:bg-white"
                }`}
            />
          </div>

          <div className="md:col-span-1">
            <label
              className={`block font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-2 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              E-Mail Adresse
            </label>
            <input
              type="email"
              value={editValues.email || ""}
              onChange={(e) =>
                onEditValuesChange({ ...editValues, email: e.target.value })
              }
              className={`w-full px-4 py-3 text-xs font-medium transition-all duration-200 focus:outline-none ${radiusClass} ${theme === "dark"
                  ? "bg-zinc-900 border border-zinc-800 text-white focus:border-[#4ADE80]"
                  : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-green-600 focus:bg-white"
                }`}
            />
          </div>

          <div className="md:col-span-1">
            <label
              className={`block font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-2 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Geburtsdatum
            </label>
            <input
              type="date"
              value={
                editValues.birthdate
                  ? new Date(toJsDate(editValues.birthdate))
                    .toISOString()
                    .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                onEditValuesChange({
                  ...editValues,
                  birthdate: e.target.value
                    ? Timestamp.fromDate(new Date(e.target.value))
                    : undefined,
                })
              }
              className={`w-full px-4 py-3 font-['JetBrains_Mono'] text-xs transition-all duration-200 focus:outline-none ${radiusClass} ${theme === "dark"
                  ? "bg-zinc-900 border border-zinc-800 text-white focus:border-[#4ADE80] color-scheme-dark"
                  : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-green-600 focus:bg-white"
                }`}
            />
          </div>

          <div className="md:col-span-1">
            <label
              className={`block font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-2 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              System Rolle
            </label>
            <select
              value={editValues.role || ""}
              onChange={(e) =>
                onEditValuesChange({
                  ...editValues,
                  role: e.target.value as UserRole,
                } as Partial<UserData>)
              }
              className={`w-full px-4 py-3 font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-all duration-200 focus:outline-none appearance-none ${radiusClass} ${theme === "dark"
                  ? "bg-zinc-900 border border-zinc-800 text-zinc-300 focus:border-[#4ADE80] [&>option]:bg-zinc-900 [&>option]:text-white"
                  : "bg-slate-50 border border-slate-200 text-slate-700 focus:border-green-600 focus:bg-white"
                }`}
            >
              {USER_ROLES_ARRAY.map((role) => {
                if (role === "anonymous" || role === "admin") return null;
                return (
                  <option
                    key={role}
                    value={role}
                    className="uppercase tracking-widest"
                  >
                    {role.toUpperCase()}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <DialogFooter className="mt-8 gap-3 sm:gap-0">
          <button
            onClick={onCancel}
            className={`px-6 py-3 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 border ${radiusClass} ${theme === "dark"
                ? "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
          >
            CANCEL REQ
          </button>
          <button
            onClick={onSave}
            className={`px-6 py-3 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 text-white border border-transparent ${radiusClass} ${theme === "dark"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-600 hover:bg-green-700 shadow-sm"
              }`}
          >
            COMMIT CHANGES
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import type { PresetRoles, UserData } from "@/BackEnd/type";
import type { Theme } from "@/context/ThemeContext";
import { toJsDate } from "@/BackEnd/utils";

export function EditUserDialog(props: {
  open: boolean;
  theme: Theme;
  onOpenChange: (open: boolean) => void;
  editValues: Partial<UserData>;
  onEditValuesChange: (next: Partial<UserData>) => void;
  presetRoles: string[];
  presetRoleLabels: Record<string, string>;
  onCancel: () => void;
  onSave: () => void;
}) {
  const {
    open,
    theme,
    onOpenChange,
    editValues,
    onEditValuesChange,
    presetRoles,
    presetRoleLabels,
    onCancel,
    onSave,
  } = props;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) onCancel();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nutzer bearbeiten</DialogTitle>
          <DialogDescription>
            Aktualisieren Sie die Benutzerinformationen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${theme == "dark" ? "text-gray-700" : "text-gray-700"}`}
            >
              Name
            </label>
            <input
              type="text"
              value={editValues.name || ""}
              onChange={(e) =>
                onEditValuesChange({ ...editValues, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editValues.email || ""}
              onChange={(e) =>
                onEditValuesChange({ ...editValues, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  birthdate: new Date(e.target.value).toISOString(),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rolle
            </label>
            <select
              value={editValues.role || ""}
              onChange={(e) =>
                onEditValuesChange({
                  ...editValues,
                  role: e.target.value as PresetRoles,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {presetRoles.map((role) => (
                <option key={role} value={role}>
                  {presetRoleLabels[role]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onCancel} variant="outline">
            Abbrechen
          </Button>
          <Button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

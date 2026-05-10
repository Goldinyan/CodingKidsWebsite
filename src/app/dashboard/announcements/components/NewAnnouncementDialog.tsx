"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function NewAnnouncementDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; content: string; tag: "User" | "Member" };
  onChange: (next: { title: string; content: string; tag: "User" | "Member" }) => void;
  onCreate: () => void;
}) {
  const { open, onOpenChange, value, onChange, onCreate } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Neue Ankündigung</DialogTitle>
          <DialogDescription>
            Erstellen Sie eine neue Ankündigung für Benutzer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titel *
            </label>
            <input
              type="text"
              placeholder="z.B. Wichtige Mitteilung"
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zielgruppe
            </label>
            <select
              value={value.tag}
              onChange={(e) => onChange({ ...value, tag: e.target.value as "User" | "Member" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="User">User</option>
              <option value="Member">Member</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inhalt
            </label>
            <textarea
              placeholder="Geben Sie den Inhalt der Ankündigung ein..."
              value={value.content}
              onChange={(e) => onChange({ ...value, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Abbrechen
          </Button>
          <Button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
            Erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


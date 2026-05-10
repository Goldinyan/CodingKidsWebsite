"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function EditAnnouncementDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; content: string };
  onChange: (next: { title: string; content: string }) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { open, onOpenChange, value, onChange, onSave, onCancel } = props;

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
          <DialogTitle>Ankündigung bearbeiten</DialogTitle>
          <DialogDescription>
            Aktualisieren Sie die Ankündigungsinformationen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titel
            </label>
            <input
              type="text"
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inhalt
            </label>
            <textarea
              value={value.content}
              onChange={(e) => onChange({ ...value, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onCancel} variant="outline">
            Abbrechen
          </Button>
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white">
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteAnnouncementDialog(props: {
  open: boolean;
  title: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const { open, title, onOpenChange, onConfirm } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ankündigung löschen?</DialogTitle>
          <DialogDescription>
            Sind Sie sicher, dass Sie die Ankündigung &quot;{title}&quot; löschen möchten?
            Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Abbrechen
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


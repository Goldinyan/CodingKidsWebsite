"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteCourseDialog(props: {
  open: boolean;
  courseName: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const { open, courseName, onOpenChange, onConfirm } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kurs löschen?</DialogTitle>
          <DialogDescription>
            Sind Sie sicher, dass Sie den Kurs &quot;{courseName}&quot; löschen möchten?
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


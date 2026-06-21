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
import { deleteUser } from "@/lib/db";

export function DeleteUserDialog(props: {
  open: boolean;
  userId: string;
  userName: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { open, userName, userId, onOpenChange } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nutzer löschen?</DialogTitle>
          <DialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden.
            {userName ? ` (${userName})` : ""}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Abbrechen
          </Button>
          {/*
          <Button onClick={() => deleteUser(, userId, "admin")} variant="destructive" >
            Löschen
          </Button>
          */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

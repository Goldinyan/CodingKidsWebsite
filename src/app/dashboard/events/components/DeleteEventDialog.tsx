import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteEventDialog(props: {
  open: boolean;
  eventName: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const { open, eventName, onOpenChange, onConfirm } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event löschen?</DialogTitle>
          <DialogDescription>
            Möchtest du &quot;{eventName}&quot; wirklich löschen? Diese Aktion
            kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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


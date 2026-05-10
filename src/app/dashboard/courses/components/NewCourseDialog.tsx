"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CourseData } from "@/BackEnd/type";

export function NewCourseDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCourse: Partial<CourseData>;
  tagInput: string;
  onNewCourseChange: (next: Partial<CourseData>) => void;
  onTagInputChange: (value: string) => void;
  onCreate: () => void;
}) {
  const {
    open,
    onOpenChange,
    newCourse,
    tagInput,
    onNewCourseChange,
    onTagInputChange,
    onCreate,
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Neuer Kurs</DialogTitle>
          <DialogDescription>
            Erstellen Sie einen neuen Kurs für Ihre Veranstaltungen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kursname *
            </label>
            <input
              type="text"
              placeholder="z.B. Python Grundlagen"
              value={newCourse.name || ""}
              onChange={(e) => onNewCourseChange({ ...newCourse, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung
            </label>
            <textarea
              placeholder="Kursbeschreibung eingeben..."
              value={newCourse.des || ""}
              onChange={(e) => onNewCourseChange({ ...newCourse, des: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (komma-getrennt)
            </label>
            <input
              type="text"
              placeholder="z.B. Python, Anfänger, Programmierung"
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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


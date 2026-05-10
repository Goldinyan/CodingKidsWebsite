"use client";

import { Edit2, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CourseData } from "@/BackEnd/type";

export function CourseCard(props: {
  course: CourseData;
  isEditing: boolean;
  editValues: Partial<CourseData>;
  onEditValuesChange: (next: Partial<CourseData>) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onRequestDelete: () => void;
}) {
  const {
    course,
    isEditing,
    editValues,
    onEditValuesChange,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onRequestDelete,
  } = props;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kursname
            </label>
            <input
              type="text"
              value={editValues.name || ""}
              onChange={(e) => onEditValuesChange({ ...editValues, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung
            </label>
            <textarea
              value={editValues.des || ""}
              onChange={(e) => onEditValuesChange({ ...editValues, des: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (komma-getrennt)
            </label>
            <input
              type="text"
              value={editValues.tags?.join(", ") || ""}
              onChange={(e) =>
                onEditValuesChange({
                  ...editValues,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onSaveEdit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Speichern
            </Button>
            <Button onClick={onCancelEdit} variant="outline" className="flex-1">
              <X className="w-4 h-4" />
              Abbrechen
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{course.des}</p>

            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-500 mb-2">
              <strong>ID:</strong> {course.uid}
            </div>

            {course.dates && course.dates.length > 0 && (
              <div className="text-xs text-gray-500">
                <strong>Veranstaltungen:</strong> {course.dates.length}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onStartEdit}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Bearbeiten
            </Button>
            <Button
              onClick={onRequestDelete}
              variant="destructive"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Löschen
            </Button>
          </div>
        </>
      )}
    </div>
  );
}


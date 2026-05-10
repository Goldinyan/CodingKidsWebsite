"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toJsDate } from "@/BackEnd/utils";
import type { AnnouncementData } from "@/BackEnd/type";

export function AnnouncementCard(props: {
  announcement: AnnouncementData;
  authorName: string;
  userIsAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { announcement, authorName, userIsAdmin, onEdit, onDelete } = props;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {announcement.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {authorName} •{" "}
          {toJsDate(announcement.date).toLocaleDateString("de-DE", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">
          {announcement.content}
        </p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
          {announcement.tag}
        </span>
      </div>

      {userIsAdmin && (
        <div className="flex gap-2">
          <Button
            onClick={onEdit}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Bearbeiten
          </Button>
          <Button
            onClick={onDelete}
            variant="destructive"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Löschen
          </Button>
        </div>
      )}
    </div>
  );
}


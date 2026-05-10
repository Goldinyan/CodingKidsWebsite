"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserData } from "@/BackEnd/type";

export function UserCard(props: {
  user: UserData;
  roleLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { user, roleLabel, onEdit, onDelete } = props;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rolle:</strong> {roleLabel}
          </p>
          {user.birthdate && (
            <p>
              <strong>Geburtsdatum:</strong>{" "}
              {new Date(user.birthdate).toLocaleDateString("de-DE")}
            </p>
          )}
        </div>
      </div>

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
    </div>
  );
}


import { Calendar, ChevronDown, ChevronUp, Edit2, Save, Trash2, X } from "lucide-react";
import { toJsDate } from "@/BackEnd/utils";
import type { EventData, UserData } from "@/BackEnd/type";
import { EVENT_FIELDS, EVENT_FIELD_LABELS } from "../constants";
import { formatValue } from "../formatValue";
import { Button } from "@/components/ui/button";

export function EventCard(props: {
  event: EventData;
  expanded: boolean;
  onToggleExpanded: () => void;
  users: UserData[];
  queueUsers: UserData[];
  onRemoveUser: (user: UserData) => void;
  isEditing: boolean;
  editValue: Partial<EventData> | undefined;
  onToggleEdit: () => void;
  onEditValueChange: (next: Partial<EventData>) => void;
  onSaveChanges: () => void;
  onRequestDelete: () => void;
}) {
  const {
    event,
    expanded,
    onToggleExpanded,
    users,
    queueUsers,
    onRemoveUser,
    isEditing,
    editValue,
    onToggleEdit,
    onEditValueChange,
    onSaveChanges,
    onRequestDelete,
  } = props;

  const full = event.users.length >= event.memberCount;
  const date = toJsDate(event.date);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex flex-row justify-between">
        <p className="font-bold">
          {event.name === "Coding Kids Workshop" ? "Scratch Workshop" : event.name}
        </p>
        <p
          className={`px-2 py-1 rounded-lg text-[12px] ${
            !full ? "text-green-700 bg-lightGreenBg" : "text-blue-600 bg-blue-200"
          }`}
        >
          {full ? "Full" : "Published"}
        </p>
      </div>

      <div className="flex flex-row justify-start items-center">
        <Calendar className="text-graytext h-4 " />
        <p className="text-graytext text-sm ">
          {date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" })} @{" "}
          {date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p
          onClick={onToggleExpanded}
          className="cursor-pointer flex items-center gap-1 text-sm text-primaryOwn ml-auto "
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </p>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {EVENT_FIELDS.map((key, idx) => (
            <div
              key={key}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <p className="text-sm font-bold text-primaryOwn uppercase tracking-wide mb-3">
                {EVENT_FIELD_LABELS[idx] === "User"
                  ? "Teilnehmer (" + event.users.length + ")"
                  : EVENT_FIELD_LABELS[idx] === "Warteschlange"
                    ? "Warteschlange (" + event.queue.length + ")"
                    : EVENT_FIELD_LABELS[idx]}
              </p>

              {key !== "users" && key !== "queue" && (
                <p className="text-gray-700 text-sm py-2 whitespace-pre-wrap">
                  {formatValue(event[key]) || "—"}
                </p>
              )}

              {key === "users" && (
                <div>
                  {event.users.length > 0 ? (
                    <div className="flex flex-col divide-y border border-gray-300 rounded-lg divide-gray-200 bg-white">
                      {users.map((u) => (
                        <div
                          key={u.uid}
                          className="py-3 flex flex-row justify-between items-center px-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col items-start flex-1">
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            <p className="text-sm text-graytext">{u.role}</p>
                          </div>
                          <Trash2
                            className="cursor-pointer h-5 w-5 text-red-500 hover:text-red-700 hover:scale-110 transition-all ml-3"
                            onClick={() => onRemoveUser(u)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">Keine Teilnehmer</p>
                  )}
                </div>
              )}

              {key === "queue" && event.queue.length > 0 && (
                <div>
                  <ul className="space-y-2">
                    {queueUsers.map((u) => (
                      <li
                        key={u.uid}
                        className="text-gray-700 text-sm py-1 px-2 bg-white border-l-4 border-primaryOwn"
                      >
                        {u.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {key === "queue" && event.queue.length === 0 && (
                <p className="text-gray-500 text-sm italic">Keine Warteschlange</p>
              )}
            </div>
          ))}

          <div className="flex flex-row gap-3 items-center pt-2">
            <Button
              onClick={onToggleEdit}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              {isEditing ? "Abbrechen" : "Bearbeiten"}
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

          {isEditing && (
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <p className="text-sm font-bold text-blue-900 mb-4">
                Bearbeite Event-Eigenschaften:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Event-Name
                  </label>
                  <input
                    type="text"
                    value={editValue?.name || event.name}
                    onChange={(e) =>
                      onEditValueChange({
                        ...(editValue || {}),
                        name: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Teilnehmerzahl
                  </label>
                  <input
                    type="number"
                    value={editValue?.memberCount ?? event.memberCount}
                    onChange={(e) =>
                      onEditValueChange({
                        ...(editValue || {}),
                        memberCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Dauer (Minuten)
                  </label>
                  <input
                    type="number"
                    value={editValue?.length ?? event.length}
                    onChange={(e) =>
                      onEditValueChange({
                        ...(editValue || {}),
                        length: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Event-Typ
                  </label>
                  <input
                    type="text"
                    value={editValue?.typeOfEvent ?? event.typeOfEvent}
                    onChange={(e) =>
                      onEditValueChange({
                        ...(editValue || {}),
                        typeOfEvent: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Beschreibung
                  </label>
                  <textarea
                    value={editValue?.description ?? event.description}
                    onChange={(e) =>
                      onEditValueChange({
                        ...(editValue || {}),
                        description: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <Button
                onClick={onSaveChanges}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Speichern
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


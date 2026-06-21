import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { toJsDate } from "@/BackEnd/utils";
import type { EventData, UserData } from "@/BackEnd/type";
import { EVENT_FIELDS, EVENT_FIELD_LABELS } from "../constants";
import { formatValue } from "../formatValue";

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

  const { theme, isRounded } = useTheme();

  const full = event.users.length >= event.memberCount;
  const date = toJsDate(event.date);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-6 border backdrop-blur-2xl  transition-all duration-300 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
          ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
          : "bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100"
        }`}
    >
      <div className="flex flex-row justify-between">
        <p
          className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
        >
          {event.name === "Coding Kids Workshop"
            ? "Scratch Workshop"
            : event.name}
        </p>
        <motion.p
          whileHover={{ scale: 1.05 }}
          className={`px-2 py-1 mb-2 text-[12px] font-medium border transition-all duration-300 ${isRounded ? "rounded-xl" : "rounded-none"} ${!full
              ? theme === "dark"
                ? "bg-green-600/20 text-green-300 border-green-600/30"
                : "bg-green-100 text-green-700 border-green-300"
              : theme === "dark"
                ? "bg-blue-600/20 text-blue-300 border-blue-600/30"
                : "bg-blue-100 text-blue-700 border-blue-300"
            }`}
        >
          {full ? "Full" : "Published"}
        </motion.p>
      </div>

      <div className="flex flex-row justify-start items-center">
        <Calendar
          className={`h-4 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
        />
        <p
          className={`text-sm ml-2 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}
        >
          {toJsDate(event.date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "short",
          })}{" "}
          @{" "}
          {toJsDate(event.date).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <motion.button
          onClick={onToggleExpanded}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`cursor-pointer flex items-center gap-1 text-sm ml-auto transition-colors ${theme === "dark"
              ? "text-green-400 hover:text-green-300"
              : "text-green-600 hover:text-green-700"
            }`}
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`mt-4 space-y-4 border-t pt-4 ${theme === "dark" ? "border-white/10" : "border-slate-300"}`}
        >
          {EVENT_FIELDS.map((key, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 border transition-colors duration-300 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white border-slate-300 hover:bg-slate-50"
                }`}
            >
              <p
                className={`text-sm font-bold uppercase tracking-wide mb-3 ${theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
              >
                {key === "users"
                  ? "Teilnehmer (" + event.users.length + ")"
                  : key === "queue"
                    ? "Warteschlange (" + event.queue.length + ")"
                    : EVENT_FIELD_LABELS[idx]}
              </p>

              {key !== "users" && key !== "queue" && (
                <p
                  className={`text-sm py-2 whitespace-pre-wrap ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}
                >
                  {formatValue(event[key]) || "—"}
                </p>
              )}

              {key === "users" && (
                <div>
                  {event.users.length > 0 ? (
                    <div
                      className={`flex flex-col divide-y border transition-colors duration-300 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                          ? "border-white/10 divide-white/10 bg-white/5"
                          : "border-slate-300 divide-slate-200 bg-white"
                        }`}
                    >
                      {users.map((u) => (
                        <motion.div
                          key={u.uid}
                          whileHover={{ x: 4 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          className={`py-3 flex flex-row justify-between items-center px-4 transition-colors ${theme === "dark"
                              ? "hover:bg-white/10"
                              : "hover:bg-slate-50"
                            }`}
                        >
                          <div className="flex flex-col items-start flex-1">
                            <p
                              className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                            >
                              {u.name}
                            </p>
                            <p
                              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}
                            >
                              {u.role}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onRemoveUser(u)}
                            className={`h-5 w-5 ml-3 transition-colors cursor-pointer ${theme === "dark"
                                ? "text-red-400 hover:text-red-300 hover:scale-110"
                                : "text-red-500 hover:text-red-700 hover:scale-110"
                              }`}
                          >
                            <Trash2 className="w-full h-full" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className={`text-sm italic ${theme === "dark" ? "text-gray-500" : "text-slate-500"}`}
                    >
                      Keine Teilnehmer
                    </p>
                  )}
                </div>
              )}

              {key === "queue" && event.queue.length > 0 && (
                <div>
                  <ul className="space-y-2">
                    {queueUsers.map((u) => (
                      <motion.li
                        key={u.uid}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-sm py-1 px-2 border-l-4 transition-colors ${theme === "dark"
                            ? "border-green-500 text-gray-300"
                            : "border-green-600 text-slate-700"
                          }`}
                      >
                        {u.name}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {key === "queue" && event.queue.length === 0 && (
                <p
                  className={`text-sm italic ${theme === "dark" ? "text-gray-500" : "text-slate-500"}`}
                >
                  Keine Warteschlange
                </p>
              )}
            </motion.div>
          ))}

          <div className="flex flex-row gap-3 items-center pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleEdit}
              className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                  ? "bg-amber-600/20 text-amber-300 border-amber-600/30 hover:bg-amber-600/30 hover:border-amber-600/50"
                  : "bg-amber-600 text-white border-amber-600 hover:bg-amber-700"
                }`}
            >
              {isEditing ? (
                <X className="w-4 h-4" />
              ) : (
                <Edit2 className="w-4 h-4" />
              )}
              {isEditing ? "Abbrechen" : "Bearbeiten"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onRequestDelete();
              }}
              className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                  ? "bg-red-600/20 text-red-300 border-red-600/30 hover:bg-red-600/30 hover:border-red-600/50"
                  : "bg-red-600 text-white border-red-600 hover:bg-red-700"
                }`}
            >
              <Trash2 className="w-4 h-4" />
              Löschen
            </motion.button>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`mt-4 p-4 border-2 transition-colors ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                  ? "bg-purple-600/20 border-purple-500/30"
                  : "bg-purple-50 border-purple-300"
                }`}
            >
              <p
                className={`text-sm font-bold mb-4 ${theme === "dark" ? "text-purple-300" : "text-purple-900"
                  }`}
              >
                Bearbeite Event-Eigenschaften:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`text-sm font-semibold transition-colors ${theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                  >
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
                    className={`w-full mt-1 px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-semibold transition-colors ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                  >
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
                    className={`w-full mt-1 px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-semibold transition-colors ${theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                  >
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
                    className={`w-full mt-1 px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-semibold transition-colors ${theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                  >
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
                    className={`w-full mt-1 px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`text-sm font-semibold transition-colors ${theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                  >
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
                    className={`w-full mt-1 px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] resize-none transition-colors ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSaveChanges}
                className={`w-full mt-4 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                    : "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                  }`}
              >
                <Save className="w-4 h-4" />
                Speichern
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

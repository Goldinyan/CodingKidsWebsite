"use client";

import { useState, useEffect, use } from "react";
import { Search, Plus, Calendar, Minus, Table, TrashIcon } from "lucide-react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { removedFromEventByAdmin } from "@/BackEnd/email";
import {
  getAllEvents,
  addEvent,
  updateEvent,
  updateUser,
  deleteEvent,
  getUserData,
  getAllUsers,
  removeUserFromEvent,
} from "@/lib/db";
import type { EventData, UserData } from "@/BackEnd/type";
import EventAdd from "./EventAdd";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toJsDate } from "@/BackEnd/utils";

export default function EventDashboard() {
  const { toast } = useToast();
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    eventId: string | null;
    eventName: string | null;
  }>({
    isOpen: false,
    eventId: null,
    eventName: null,
  });

  const formatValue = (v: any) => {
    if (v === undefined || v === null) return "";
    if (Array.isArray(v)) return v.join(", ");
    if (typeof v === "object") {
      try {
        return Object.entries(v)
          .map(([k, val]) => `${k}: ${String(val)}`)
          .join(", ");
      } catch (e) {
        console.error("Fehler beim Formatieren Objekts:", e);
        return String(v);
      }
    }
    return String(v);
  };

  const [time, setTime] = useState<"Upcoming" | "Past">("Upcoming");
  const [searchBar, setSearchBar] = useState<string>("");
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [filEvents, setFilEvents] = useState<EventData[]>([]);
  const [addEventView, setAddEventView] = useState<boolean>(false);
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({});
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<
    Record<string, Partial<EventData>>
  >({});
  const [userMap, setUserMap] = useState<Record<string, UserData[]>>({});
  const [queueUserMap, setQueueUserMap] = useState<Record<string, UserData[]>>(
    {},
  );

  const toggleExpandedTabs = (uid: string) => {
    setExpandedTabs((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  const toggleEdit = (uid: string, event?: EventData) => {
    setEditStates((prev) => ({ ...prev, [uid]: !prev[uid] }));

    if (event) {
      setEditValues((prev) => ({
        ...prev,
        [uid]: {
          name: event.name,
          date: event.date,
          length: event.length,
          memberCount: event.memberCount,
          place: event.place,
          typeOfEvent: event.typeOfEvent,
        },
      }));
    }
  };

  useEffect(() => {
    const loadUsersForEvents = async () => {
      const map: Record<string, UserData[]> = {};

      for (const event of eventsData) {
        const users = await returnUserForEvent(event.users);
        map[event.uid] = users;
      }
      setUserMap(map);
    };

    if (eventsData.length > 0) {
      loadUsersForEvents();
    }
  }, [eventsData]);

  useEffect(() => {
    const loadQueueUsersForEvents = async () => {
      const map: Record<string, UserData[]> = {};

      for (const event of eventsData) {
        const users = await returnUserForEvent(event.queue);
        map[event.uid] = users;
      }
      setQueueUserMap(map);
    };

    if (eventsData.length > 0) {
      loadQueueUsersForEvents();
    }
  }, [eventsData]);

  useEffect(() => {
    const fetchData = async () => {
      const events: EventData[] = (await getAllEvents()) as EventData[];
      setEventsData(events);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let events = eventsData;

    if (time === "Upcoming") {
      const now = new Date();
      const upcomingEvents = events.filter(
        (event) => toJsDate(event.date) >= now,
      );

      events = upcomingEvents;
    } else {
      const now = new Date();
      const pastEvents = events.filter((event) => toJsDate(event.date) <= now);
      events = pastEvents;
    }

    if (searchBar.trim() !== "") {
      const search = searchBar.toLowerCase();
      events = events.filter((event) =>
        event.name.toLowerCase().includes(search),
      );
    }

    events = events.slice(0, 10);
    setFilEvents(events);
  }, [eventsData.length, time, searchBar, eventsData]);

  const saveUserChanges = async (uid: string) => {
    const updated = editValues[uid];
    if (!updated) return;

    await updateUser(uid, updated);

    setEditStates((prev) => ({ ...prev, [uid]: false }));
  };

  const openDeleteConfirm = (eventId: string, eventName: string) => {
    setDeleteConfirmModal({
      isOpen: true,
      eventId,
      eventName,
    });
  };

  const handleDeleteEvent = async () => {
    const { eventId, eventName } = deleteConfirmModal;
    if (!eventId) return;

    try {
      await deleteEvent(eventId);
      setDeleteConfirmModal({ isOpen: false, eventId: null, eventName: null });

      toast({
        title: "Event gelöscht",
        description: `"${eventName}" wurde erfolgreich gelöscht.`,
        variant: "success",
      });

      const events: EventData[] = (await getAllEvents()) as EventData[];
      setEventsData(events);
    } catch (error) {
      console.error("Fehler beim Löschen des Events:", error);
      toast({
        title: "Fehler",
        description: "Das Event konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEventChanges = async (uid: string) => {
    const updated = editValues[uid];
    if (!updated) return;

    try {
      await updateEvent(uid, updated);
      setEditStates((prev) => ({ ...prev, [uid]: false }));

      toast({
        title: "✓ Event aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
        variant: "success",
      });

      const events: EventData[] = (await getAllEvents()) as EventData[];
      setEventsData(events);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Events:", error);
      toast({
        title: "Fehler",
        description: "Das Event konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const returnUserForEvent = async (
    usersArray: string[],
  ): Promise<UserData[]> => {
    //console.log("User Array: ", usersArray);
    const uids = usersArray;
    //console.log("User UIDs: ", uids);
    const users = await getAllUsers();
    const filteredUsers = users?.filter((user) => uids.includes(user.uid));
    //console.log("Filtered Users: ", filteredUsers);
    return filteredUsers || [];
  };

  type EventFields = Omit<EventData, "uid" | "name" | "date">;
  const fields: (keyof EventFields)[] = [
    "tag",
    "difficulty",
    "requirements",
    "length",
    "memberCount",
    "place",
    "typeOfEvent",
    "description",
    "users",
    "queue",
  ];

  const names: string[] = [
    "Tags",
    "Schwierigkeit",
    "Erforderungen",
    "Länge",
    "Teilnehmer Anzahl",
    "Ort",
    "Typ",
    "Beschreibung",
    "User",
    "Warteschlange",
  ];

  return (
    <>
      <div className="w-[80%] mx-auto pt-10">
        <div className="flex flex-col pb-2">
          <p className="text-2xl pl-1 font-extrabold">Event-Verwaltung</p>
        </div>
        <div className="flex flex-col">
          <div className="relative flex w-full border border-lightborder rounded-lg h-8 items-center overflow-hidden bg-white">
            <p
              onClick={() => setTime("Upcoming")}
              className={`w-1/2 py-8 text-sm text-center transition-colors duration-300 z-10 ${time === "Upcoming" ? "text-white" : "text-black"
                }`}
            >
              Upcoming
            </p>
            <p
              onClick={() => setTime("Past")}
              className={`w-1/2 py-8  text-sm text-center transition-colors duration-300 z-10 ${time === "Past" ? "text-white" : "text-black"
                }`}
            >
              Past
            </p>

            <span
              className={`absolute top-0 left-0 w-1/2 h-full bg-primaryOwn rounded-lg transition-transform duration-300 z-0 ${time === "Past" ? "translate-x-full" : "translate-x-0"
                }`}
            />
          </div>

          <div className="flex h-10 items-center  bg-white rounded-lg border border-lightborder mt-2 w-full">
            <Search className="h-6 pl-2" />
            <input
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
              placeholder="Finde Spezifische Events"
              className="outline-none flex-1 pl-2"
            />
            {!addEventView ? (
              <Plus
                className="h-6 p-1 w-6 mx-2 text-white bg-primaryOwn rounded-full"
                onClick={() => setAddEventView(!addEventView)}
              />
            ) : (
              <Minus
                className="h-6 p-1 w-6 mx-2 text-white bg-primaryOwn rounded-full"
                onClick={() => {
                  setAddEventView(!addEventView);
                  const getEvents = async () => {
                    const events: EventData[] =
                      (await getAllEvents()) as EventData[];
                    setEventsData(events);
                  };
                  getEvents();
                }}
              />
            )}
          </div>
          <div className={`w-full ${addEventView ? "py-10" : ""}`}>
            {addEventView && <EventAdd />}
          </div>
          <div className="flex flex-col gap-4  mt-5">
            {filEvents.map((event, index) => {
              const full = event.users.length >= event.memberCount;
              const date = toJsDate(event.date);

              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-2 bg-white border border-lightborder rounded-lg"
                >
                  <div className="flex flex-row justify-between">
                    <p className="font-bold">
                      {event.name === "Coding Kids Workshop"
                        ? "Scratch Workshop"
                        : event.name}
                    </p>
                    <p
                      className={`px-2 py-1 rounded-lg text-[12px] ${!full
                          ? "text-green-700 bg-lightGreenBg"
                          : "text-blue-600 bg-blue-200"
                        }`}
                    >
                      {full ? "Full" : "Published"}
                    </p>
                  </div>
                  <div className="flex flex-row justify-start items-center">
                    <Calendar className="text-graytext h-4 " />
                    <p className="text-graytext text-sm ">
                      {date.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      @{" "}
                      {date.toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p
                      onClick={() => toggleExpandedTabs(event.uid)}
                      className="cursor-pointer flex items-center gap-1 text-sm text-primaryOwn ml-auto "
                    >
                      {expandedTabs[event.uid] ? (
                        <>
                          <ChevronUp className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-5 h-5" />
                        </>
                      )}
                    </p>
                  </div>
                  <div></div>
                  {expandedTabs[event.uid] && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      {fields.map((key, index) => (
                        <div
                          key={key}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <p className="text-sm font-bold text-primaryOwn uppercase tracking-wide mb-3">
                            {names[index] === "User"
                              ? "Teilnehmer (" + event.users.length + ")"
                              : names[index] === "Warteschlange"
                                ? "Warteschlange (" + event.queue.length + ")"
                                : names[index]}
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
                                  {(userMap[event.uid] || []).map(
                                    (user, idx) => (
                                      <div
                                        key={user.uid}
                                        className="py-3 flex flex-row justify-between items-center px-4 hover:bg-gray-100 transition-colors"
                                      >
                                        <div className="flex flex-col items-start flex-1">
                                          <p className="font-semibold text-gray-900">
                                            {user.name}
                                          </p>
                                          <p className="text-sm text-graytext">
                                            {user.role}
                                          </p>
                                        </div>
                                        <Trash2
                                          className="cursor-pointer h-5 w-5 text-red-500 hover:text-red-700 hover:scale-110 transition-all ml-3"
                                          onClick={() => (
                                            removeUserFromEvent(
                                              event.uid,
                                              user.uid,
                                            ),
                                            removedFromEventByAdmin(
                                              user.email,
                                              event.name,
                                            )
                                          )}
                                        />
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm italic">
                                  Keine Teilnehmer
                                </p>
                              )}
                            </div>
                          )}

                          {key === "queue" && event.queue.length > 0 && (
                            <div>
                              <ul className="space-y-2">
                                {(queueUserMap[event.uid] || []).map((user) => (
                                  <li
                                    key={user.uid}
                                    className="text-gray-700 text-sm py-1 px-2 bg-white border-l-4 border-primaryOwn"
                                  >
                                    {user.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {key === "queue" && event.queue.length === 0 && (
                            <p className="text-gray-500 text-sm italic">
                              Keine Warteschlange
                            </p>
                          )}
                        </div>
                      ))}

                      <div className="flex flex-row gap-3 items-center pt-2">
                        <button
                          onClick={() => toggleEdit(event.uid, event)}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 text-center rounded-lg text-blue-600 font-semibold py-2 transition-colors"
                        >
                          {editStates[event.uid] ? "Abbrechen" : "Bearbeiten"}
                        </button>
                        <button
                          onClick={() =>
                            openDeleteConfirm(event.uid, event.name)
                          }
                          className="flex-1 bg-red-100 hover:bg-red-200 text-center rounded-lg text-red-600 font-semibold py-2 transition-colors"
                        >
                          Löschen
                        </button>
                      </div>

                      {editStates[event.uid] && (
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
                                value={
                                  editValues[event.uid]?.name || event.name
                                }
                                onChange={(e) => {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [event.uid]: {
                                      ...prev[event.uid],
                                      name: e.target.value,
                                    },
                                  }));
                                }}
                                className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primaryOwn focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-gray-700">
                                Teilnehmerzahl
                              </label>
                              <input
                                type="number"
                                value={
                                  editValues[event.uid]?.memberCount ||
                                  event.memberCount
                                }
                                onChange={(e) => {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [event.uid]: {
                                      ...prev[event.uid],
                                      memberCount:
                                        parseInt(e.target.value) || 0,
                                    },
                                  }));
                                }}
                                className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primaryOwn focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-gray-700">
                                Dauer (Minuten)
                              </label>
                              <input
                                type="number"
                                value={
                                  editValues[event.uid]?.length || event.length
                                }
                                onChange={(e) => {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [event.uid]: {
                                      ...prev[event.uid],
                                      length: parseInt(e.target.value) || 0,
                                    },
                                  }));
                                }}
                                className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primaryOwn focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-gray-700">
                                Event-Typ
                              </label>
                              <input
                                type="text"
                                value={
                                  editValues[event.uid]?.typeOfEvent ||
                                  event.typeOfEvent
                                }
                                onChange={(e) => {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [event.uid]: {
                                      ...prev[event.uid],
                                      typeOfEvent: e.target.value,
                                    },
                                  }));
                                }}
                                className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primaryOwn focus:outline-none"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="text-sm font-semibold text-gray-700">
                                Beschreibung
                              </label>
                              <textarea
                                value={
                                  editValues[event.uid]?.description ||
                                  event.description
                                }
                                onChange={(e) => {
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [event.uid]: {
                                      ...prev[event.uid],
                                      description: e.target.value,
                                    },
                                  }));
                                }}
                                className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primaryOwn focus:outline-none min-h-[100px] resize-none"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleSaveEventChanges(event.uid)}
                            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
                          >
                            Änderungen speichern
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog
        open={deleteConfirmModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmModal({
              isOpen: false,
              eventId: null,
              eventName: null,
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event löschen?</DialogTitle>
            <DialogDescription>
              Möchtest du &quot;{deleteConfirmModal.eventName}&quot; wirklich
              löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmModal({
                  isOpen: false,
                  eventId: null,
                  eventName: null,
                })
              }
              className="border-primaryOwn text-primaryOwn"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleDeleteEvent}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

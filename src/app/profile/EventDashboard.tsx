"use client";

import { useState, useEffect, use } from "react";
import { Search, Plus, Calendar, Minus, Table, TrashIcon } from "lucide-react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

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

export default function EventDashboard() {
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
    {}
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
        (event) => new Date(event.date) >= now
      );

      events = upcomingEvents;
    } else {
      const now = new Date();
      const pastEvents = events.filter((event) => new Date(event.date) <= now);
      events = pastEvents;
    }

    if (searchBar.trim() !== "") {
      const search = searchBar.toLowerCase();
      events = events.filter((event) =>
        event.name.toLowerCase().includes(search)
      );
    }

    events = events.slice(0, 10);
    setFilEvents(events);
  }, [eventsData.length, time, searchBar]);

  const saveUserChanges = async (uid: string) => {
    const updated = editValues[uid];
    if (!updated) return;

    await updateUser(uid, updated); // z. B. Firestore oder API

    setEditStates((prev) => ({ ...prev, [uid]: false }));
  };

  const returnUserForEvent = async (
    usersArray: string[]
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
      <div className="w-full pt-10">
        <div className="flex flex-col pb-2">
          <p className="text-2xl pl-1 font-extrabold">Event-Verwaltung</p>
        </div>
        <div className="flex flex-col">
          <div className="relative flex w-full border border-lightborder rounded-lg h-6 items-center overflow-hidden bg-white">
            <p
              onClick={() => setTime("Upcoming")}
              className={`w-1/2 py-2 text-sm text-center transition-colors duration-300 z-10 ${
                time === "Upcoming" ? "text-white" : "text-black"
              }`}
            >
              Upcoming
            </p>
            <p
              onClick={() => setTime("Past")}
              className={`w-1/2 py-2  text-sm text-center transition-colors duration-300 z-10 ${
                time === "Past" ? "text-white" : "text-black"
              }`}
            >
              Past
            </p>

            <span
              className={`absolute top-0 left-0 w-1/2 h-full bg-primaryOwn rounded-lg transition-transform duration-300 z-0 ${
                time === "Past" ? "translate-x-full" : "translate-x-0"
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
                onClick={() => setAddEventView(!addEventView)}
              />
            )}
          </div>
          <div className="w-70">{addEventView && <EventAdd />}</div>
          <div className="flex flex-col gap-4  mt-5">
            {filEvents.map((event, index) => {
              const full = event.users.length >= event.memberCount;
              const date = new Date(event.date);
              console.log(
                "User Map for Event ",
                event.uid,
                ": ",
                userMap[event.uid]
              );

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
                      className={`px-2 py-1 rounded-lg text-[12px] ${
                        !full
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
                    <div>
                      {fields.map((key, index) => (
                        <div key={key} className="mb-2 flex flex-col">
                          <p className="text-lg font-bold">
                            {names[index] === "User"
                              ? "Teilnehmer (" + event.users.length + ")"
                              : names[index] === "Warteschlange"
                              ? "Warteschlange (" + event.queue.length + ")"
                              : names[index]}
                          </p>
                          <p>
                            {key !== "users"
                              ? JSON.stringify(event[key])
                              : null}
                          </p>
                          {key === "users" && (
                            <div>
                              <div className="flex flex-col divide-y border border-lightborder rounded-lg divide-lightborder">
                                {(userMap[event.uid] || []).map((user) => (
                                  <div key={user.uid} className="py-2 flex flex-row justify-between items-center px-2">
                                    <div className="flex flex-col items-center">
                                    <p className="font-bold">{user.name}</p>
                                    <p className="text-graytext pr-2">{user.role}</p>
                                    </div>
                                    <Trash2 className="cursor-pointer h-6 w-6" onClick={() => removeUserFromEvent(event.uid, user.uid)} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {key === "queue" && (
                            <div>
                              <ul>
                                {(queueUserMap[event.uid] || []).map((user) => (
                                  <li key={user.uid}>{user.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex flex-row justify-around w-full gap-3 items-center">
                        <p
                          onClick={() => toggleEdit(event.uid)}
                          className="bg-blue-200 text-center rounded-lg text-blue-600 w-1/2 py-1"
                        >
                          Edit
                        </p>
                        <p
                          onClick={() => deleteEvent(event.uid)}
                          className="bg-red-200 text-center rounded-lg text-red-600 w-1/2 py-1"
                        >
                          Delete
                        </p>
                      </div>
                      {editStates[event.uid] && <p>Edit Open</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useCallback, useState } from "react";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/BackEnd/AuthContext";
import { removedFromEventByAdmin } from "@/BackEnd/email";
import { deleteEvent, removeUserFromEvent, updateEvent } from "@/lib/db";
import type { EventData, UserData } from "@/BackEnd/type";
import EventAdd from "./EventAdd";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EventTimeFilter } from "./events/constants";
import { DeleteEventDialog, EventCard } from "./events/components";
import {
  useEventUsersMap,
  useEventsData,
  useFilteredEvents,
} from "./events/hooks";

export default function EventDashboard() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const { theme, isRounded } = useTheme();
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    eventId: string | null;
    eventName: string | null;
  }>({
    isOpen: false,
    eventId: null,
    eventName: null,
  });

  const [time, setTime] = useState<EventTimeFilter>("Upcoming");
  const [searchBar, setSearchBar] = useState<string>("");
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({});
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<
    Record<string, Partial<EventData>>
  >({});

  const { events: eventsData, refresh } = useEventsData(user?.uid, userRole);
  const filEvents = useFilteredEvents(eventsData, time, searchBar, 10);
  const userMap = useEventUsersMap(
    eventsData,
    user?.uid,
    userRole,
    useCallback((e) => e.users, []),
  );
  const queueUserMap = useEventUsersMap(
    eventsData,
    user?.uid,
    userRole,
    useCallback((e) => e.queue, []),
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
      await deleteEvent(eventId, user?.uid || "anonymous", userRole);
      setDeleteConfirmModal({ isOpen: false, eventId: null, eventName: null });

      toast({
        title: "Event gelöscht",
        description: `"${eventName}" wurde erfolgreich gelöscht.`,
        variant: "success",
      });

      await refresh();
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
      await updateEvent(uid, updated, user?.uid || "anonymous", userRole);
      setEditStates((prev) => ({ ...prev, [uid]: false }));

      toast({
        title: "Event aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
        variant: "success",
      });

      await refresh();
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Events:", error);
      toast({
        title: "Fehler",
        description: "Das Event konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUser = async (event: EventData, u: UserData) => {
    try {
      await removeUserFromEvent(event.uid, u.uid);
      await removedFromEventByAdmin(u.email, event.name);
      await refresh();
    } catch (e) {
      console.error("Fehler beim Entfernen des Users:", e);
      toast({
        title: "Fehler",
        description: "Der User konnte nicht entfernt werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div
        className={`w-full p-6 min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-slate-50"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1
              className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              Event-Verwaltung
            </h1>
            <p
              className={theme === "dark" ? "text-gray-400" : "text-slate-600"}
            >
              Verwalten Sie Veranstaltungen und Teilnehmer
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`relative flex w-56 border h-10 items-center overflow-hidden transition-colors duration-300 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-slate-300"
                  }`}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setTime("Upcoming")}
                  className={`w-1/2 h-full text-sm font-medium transition-colors duration-200 z-10 ${isRounded ? "rounded-xl" : "rounded-none"} ${time === "Upcoming"
                      ? theme === "dark"
                        ? "text-black"
                        : "text-white"
                      : theme === "dark"
                        ? "text-white"
                        : "text-slate-700"
                    }`}
                >
                  Upcoming
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setTime("Past")}
                  className={`w-1/2 h-full text-sm font-medium transition-colors duration-200 z-10 ${isRounded ? "rounded-xl" : "rounded-none"} ${time === "Past"
                      ? theme === "dark"
                        ? "text-black"
                        : "text-white"
                      : theme === "dark"
                        ? "text-white"
                        : "text-slate-700"
                    }`}
                >
                  Past
                </motion.button>
                <motion.span
                  layoutId="tab-bg"
                  className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-200 z-0 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark" ? "bg-green-600" : "bg-green-600"
                    } ${time === "Past" ? "translate-x-full" : "translate-x-0"}`}
                />
              </div>
            </div>

            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-3 w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`}
              />
              <input
                type="text"
                placeholder="Events durchsuchen..."
                value={searchBar}
                onChange={(e) => setSearchBar(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-500 hover:bg-white/10 hover:border-white/20"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 hover:border-slate-400"
                  }`}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingEvent(true)}
              className={`px-6 py-2 font-medium border transition-all duration-300 flex items-center gap-2 ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                  ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                  : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                }`}
            >
              <Plus className="w-5 h-5" />
              Neues Event
            </motion.button>
          </div>

          <motion.div
            variants={{
              hidden: {},
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-5"
          >
            {filEvents.map((event) => (
              <motion.div
                key={event.uid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <EventCard
                  event={event}
                  expanded={!!expandedTabs[event.uid]}
                  onToggleExpanded={() => toggleExpandedTabs(event.uid)}
                  users={userMap[event.uid] || []}
                  queueUsers={queueUserMap[event.uid] || []}
                  onRemoveUser={(u) => handleRemoveUser(event, u)}
                  isEditing={!!editStates[event.uid]}
                  editValue={editValues[event.uid]}
                  onToggleEdit={() => toggleEdit(event.uid, event)}
                  onEditValueChange={(next) =>
                    setEditValues((prev) => ({ ...prev, [event.uid]: next }))
                  }
                  onSaveChanges={() => handleSaveEventChanges(event.uid)}
                  onRequestDelete={() =>
                    openDeleteConfirm(event.uid, event.name)
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Neues Event</DialogTitle>
            <DialogDescription>
              Erstellen Sie ein neues Event. Sie können auch ein Preset
              verwenden.
            </DialogDescription>
          </DialogHeader>

          <EventAdd
            mode="dialog"
            onCreated={() => refresh()}
            onClose={() => setIsAddingEvent(false)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
              Abbrechen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteEventDialog
        open={deleteConfirmModal.isOpen}
        eventName={deleteConfirmModal.eventName}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmModal({
              isOpen: false,
              eventId: null,
              eventName: null,
            });
          }
        }}
        onConfirm={handleDeleteEvent}
      />
    </>
  );
}

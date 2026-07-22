"use client";

import { useCallback, useState } from "react";
import { Plus, Search, CalendarX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { removedFromEventByAdmin } from "@/BackEnd/email";
import {
	deleteEvent,
	removeUserFromEvent,
	updateEvent,
} from "@/lib/db";
import { type EventData, type UserData } from "@/BackEnd/type";
import EventCreationDialog from "./components/EventCreationDialog";
import type { EventTimeFilter } from "./events/constants";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { DeleteEventDialog, EventCard } from "./events/components";
import {
	useEventUsersMap,
	useEventsData,
	useFilteredEvents,
} from "./events/hooks";
import { useAppData } from "@/context/DataContext";

export default function EventDashboard() {
	const { user, userRole } = useAuth();
	const { showErrorToast, showDeleteSuccess, showUpdateSuccess } =
		useNotificationToast();
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

	const { getCourses, getEventPresets } = useAppData();

	const courses = getCourses();
	const eventPresets = getEventPresets();

	const { events: eventsData, refresh } = useEventsData();

	const filEvents = useFilteredEvents(eventsData, time, searchBar, 10);

	const userMap = useEventUsersMap(
		eventsData,
		useCallback((e) => e.users, []),
	);

	const queueUserMap = useEventUsersMap(
		eventsData,
		useCallback((e) => e.queue, []),
	);
	const mentorMap = useEventUsersMap(
		eventsData,
		useCallback((e) => e.mentors || [], []),
	);

	const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

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

			showDeleteSuccess({
				title: "Event erfolgreich gelöscht",
				description: `Das Event "${eventName}" wurde erfolgreich gelöscht.`,
			});
			await refresh();
		} catch (error) {
			showErrorToast(error);
		}
	};

	const handleSaveEventChanges = async (uid: string) => {
		const updated = editValues[uid];
		if (!updated) return;

		try {
			await updateEvent(uid, updated, user?.uid || "anonymous", userRole);
			setEditStates((prev) => ({ ...prev, [uid]: false }));

			showUpdateSuccess({
				title: "Event erfolgreich aktualisiert",
				description: `Die Änderungen am Event "${updated.name}" wurden erfolgreich gespeichert.`,
			});
			await refresh();
		} catch (error) {
			showErrorToast(error);
		}
	};

	const handleRemoveUser = async (event: EventData, u: UserData) => {
		try {
			await removeUserFromEvent(event.uid, u.uid, u, user?.uid, userRole, "NO REASON");
			await removedFromEventByAdmin(u.email, event.name);
			await refresh();
		} catch (e) {
			showErrorToast(e, "DELETE_ERROR", {
				title: "Fehler beim Entfernen",
				description: "Der User konnte nicht entfernt werden.",
			});
		}
	};

	return (
		<>
			<div className="w-full p-6 transition-colors duration-200">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8">
						<h1
							className={`md:text-4xl text-3xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase mb-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"
								}`}
						>
							EventVerwaltung
						</h1>
						<p
							className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase ${theme === "dark" ? "text-zinc-500" : "text-slate-400"
								}`}
						>
							Administration der System-Veranstaltungen und Teilnehmer-Matrizen
						</p>
					</div>

					<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center">
							<div
								className={`relative flex w-60 h-11 border items-center overflow-hidden transition-colors duration-200 ${radiusClass} ${theme === "dark"
									? "bg-zinc-950 border-zinc-800"
									: "bg-slate-50 border-slate-200"
									}`}
							>
								<button
									type="button"
									onClick={() => setTime("Upcoming")}
									className={`w-1/2 h-full font-['JetBrains_Mono'] text-xs tracking-widest uppercase transition-colors duration-200 z-10 ${time === "Upcoming"
										? "text-white font-bold"
										: theme === "dark"
											? "text-zinc-500 hover:text-zinc-300"
											: "text-slate-400 hover:text-slate-600"
										}`}
								>
									UPCOMING
								</button>
								<button
									type="button"
									onClick={() => setTime("Past")}
									className={`w-1/2 h-full font-['JetBrains_Mono'] text-xs tracking-widest uppercase transition-colors duration-200 z-10 ${time === "Past"
										? "text-white font-bold"
										: theme === "dark"
											? "text-zinc-500 hover:text-zinc-300"
											: "text-slate-400 hover:text-slate-600"
										}`}
								>
									PAST
								</button>
								<motion.span
									layoutId="activeTabIndicator"
									transition={{ type: "spring", stiffness: 380, damping: 30 }}
									className={`absolute top-0 left-0 w-1/2 h-full z-0 bg-green-600 ${radiusClass} ${time === "Past" ? "translate-x-full" : "translate-x-0"
										}`}
								/>
							</div>
						</div>

						<div className="flex-1 relative">
							<Search
								className={`absolute left-4 top-3.5 w-4 h-4 ${theme === "dark" ? "text-zinc-600" : "text-slate-400"
									}`}
							/>
							<input
								type="text"
								placeholder="EVENTS_DURCHSUCHEN..."
								value={searchBar}
								onChange={(e) => setSearchBar(e.target.value)}
								className={`w-full pl-11 pr-4 py-3 font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-all duration-200 focus:outline-none ${radiusClass} ${theme === "dark"
									? "bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 focus:border-green-600"
									: "bg-white border border-slate-200 text-slate-900 placeholder-slate-300 focus:border-green-600 shadow-sm"
									}`}
							/>
						</div>

						<button
							onClick={() => setIsAddingEvent(true)}
							className={`px-6 py-3 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} ${theme === "dark"
								? "bg-green-600 hover:bg-green-700"
								: "bg-green-600 hover:bg-green-700 shadow-sm"
								}`}
						>
							<Plus className="w-4 h-4" />
							ADD_EVENT
						</button>
					</div>

					<AnimatePresence mode="wait">
						{filEvents.length === 0 ? (
							<motion.div
								key="empty-state"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className={`w-full min-h-[400px] flex flex-col items-center justify-center border p-8 text-center transition-all duration-200 ${radiusClass} ${theme === "dark"
									? "bg-zinc-950/40 border-zinc-900"
									: "bg-white border-slate-100 shadow-sm"
									}`}
							>
								<div
									className={`p-4 mb-4 border ${radiusClass} ${theme === "dark"
										? "bg-zinc-900/50 border-zinc-800 text-zinc-500"
										: "bg-slate-50 border-slate-200 text-slate-400"
										}`}
								>
									<CalendarX className="w-8 h-8 stroke-[1.5]" />
								</div>
								<h3
									className={`font-['Familjen_Grotesk'] text-lg font-bold uppercase tracking-tight mb-1 ${theme === "dark" ? "text-zinc-200" : "text-slate-800"
										}`}
								>
									Keine Events gefunden
								</h3>
								<p
									className={`font-['JetBrains_Mono'] text-[11px] uppercase tracking-wide max-w-sm ${theme === "dark" ? "text-zinc-600" : "text-slate-400"
										}`}
								>
									{searchBar
										? `Der Filter lieferte keine Matrix-Einträge für "${searchBar}"`
										: `Es sind aktuell keine ${time.toLowerCase()} Veranstaltungen im System hinterlegt.`}
								</p>
							</motion.div>
						) : (
							<motion.div
								key="events-grid"
								layout="position"
								className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-2"
							>
								{filEvents.map((event) => (
									<motion.div
										key={event.uid}
										layout="position"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<EventCard
											event={event}
											expanded={expandedTabs[event.uid]}
											onToggleExpanded={() => toggleExpandedTabs(event.uid)}
											courses={courses}
											users={userMap[event.uid] || []}
											queueUsers={queueUserMap[event.uid] || []}
											mentors={mentorMap[event.uid] || []}
											onRemoveUser={(u) => handleRemoveUser(event, u)}
											onRemoveMentor={(m) => handleRemoveUser(event, m)}
											isEditing={!!editStates[event.uid]}
											editValue={editValues[event.uid]}
											onToggleEdit={() => toggleEdit(event.uid, event)}
											onEditValueChange={(next) =>
												setEditValues((prev) => ({
													...prev,
													[event.uid]: next,
												}))
											}
											onSaveChanges={() => handleSaveEventChanges(event.uid)}
											onRequestDelete={() =>
												openDeleteConfirm(event.uid, event.name)
											}
										/>
									</motion.div>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<EventCreationDialog
				open={isAddingEvent}
				onOpenChange={setIsAddingEvent}
				onCreated={() => refresh()}
				courses={courses}
				eventPresets={eventPresets}
				events={eventsData}
			/>

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

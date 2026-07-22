"use client";

import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addEvent } from "@/lib/db";
import { Difficulties, EventDataPreset, type CourseData, type EventData } from "@/BackEnd/type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	AlertCircle,
	Sparkles,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { useAppData } from "@/context/DataContext";
import { addEventPreset } from "@/lib/db/eventPresets";

const defaultEvent: EventData = {
	name: "",
	uid: "",
	course: "Scratch",
	date: Timestamp.fromDate(new Date()),
	length: 0,
	memberCount: 0,
	place: ["", "", ""],
	users: [],
	queue: [],
	mentors: [],
	leftUsers: [],
	tags: "",
	difficulty: Difficulties.Einsteiger,
	requirements: "",
	description: "",
};





function getNextWednesday(): Date {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7;
	const nextWednesday = new Date(today);
	nextWednesday.setDate(today.getDate() + daysUntilWednesday);
	nextWednesday.setHours(18, 0, 0, 0);
	return nextWednesday;
}

export default function EventCreationDialog(props: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated?: () => void;
	events?: EventData[];
	courses?: CourseData[];
	eventPresets?: EventDataPreset[];
}) {
	const { user, userRole, userData } = useAuth();
	const { open, onOpenChange, onCreated, courses, events, eventPresets } = props;
	const { theme, isRounded } = useTheme();
	const { showErrorToast } = useNotificationToast();

	const [currentStep, setCurrentStep] = useState(0);
	const [EventInfo, setEventInfo] = useState<EventData>(defaultEvent);
	const [error, setError] = useState<string>("");
	const [isCreating, setIsCreating] = useState(false);

	const { refreshData, getUsers } = useAppData();
	const users = getUsers();

	const roundedClass = isRounded ? "rounded-xl" : "rounded-none";

	const steps = [
		{
			title: "Grundinformationen",
			description: "Name, Kursbelegung, Datum und Dauer des Events",
		},
		{
			title: "Standort",
			description: "Ort und Adresse des Events",
		},
		{
			title: "Event-Details",
			description: "Typ, Tag und Schwierigkeitsgrad",
		},
		{
			title: "Beschreibung",
			description: "Zusätzliche Informationen und Details",
		},
	];

	const validateStep = (): boolean => {
		setError("");

		switch (currentStep) {
			case 0:
				if (!EventInfo.name.trim()) {
					setError("Event-Name ist erforderlich");
					return false;
				}
				if (EventInfo.length <= 0) {
					setError("Dauer muss größer als 0 sein");
					return false;
				}
				if (EventInfo.memberCount <= 0) {
					setError("Teilnehmerzahl muss größer als 0 sein");
					return false;
				}
				return true;

			case 1:
				if (
					!EventInfo.place[0].trim() ||
					!EventInfo.place[1].trim() ||
					!EventInfo.place[2].trim()
				) {
					setError("Alle Standortangaben sind erforderlich");
					return false;
				}
				return true;

			case 2:
				return true;

			default:
				return true;
		}
	};

	const handleNext = () => {
		if (validateStep()) {
			if (currentStep < steps.length - 1) {
				setCurrentStep(currentStep + 1);
			}
		}
	};

	const handlePrev = () => {
		setError("");
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};


	const saveCurrentEventAsPreset = async (event: EventData) => {
		const presetName = prompt("Geben Sie einen Namen für das Preset ein:");
		if (!presetName) return;

		const preset: EventDataPreset = {
			presetName,
			name: event.name,
			course: event.course,
			date: event.date,
			length: event.length,
			memberCount: event.memberCount,
			place: event.place,
			tags: event.tags,
			difficulty: event.difficulty,
			requirements: event.requirements,
			description: event.description,
		};

		try {
			await addEventPreset(preset, user?.uid, userRole);
		} catch (error) {
			showErrorToast(error);
		}

	}

	const handleEventCreate = async () => {
		if (!user) return;

		if (!EventInfo.name.trim()) {
			setError("Event-Name ist erforderlich");
			return;
		}

		if (
			!EventInfo.place[0].trim() ||
			!EventInfo.place[1].trim() ||
			!EventInfo.place[2].trim()
		) {
			setError("Alle Standortangaben sind erforderlich");
			return;
		}

		if (
			events?.some(
				(event) =>
					event.date === EventInfo.date && event.name === EventInfo.name,
			)
		) {
			setError("Ein Event an diesem Tag mit diesem Namen existiert bereits.");
			return;
		}

		const usersToNotify = users.filter(
			(u) => u.settings?.notifications?.newEvent,
		);

		setIsCreating(true);
		try {
			await addEvent(EventInfo, user.uid, userRole, userData!.name, usersToNotify);
			await refreshData("events");
			setEventInfo(defaultEvent);
			setCurrentStep(0);
			setError("");
			onCreated?.();
			onOpenChange(false);
		} catch (error) {
			showErrorToast(error);
			setError(
				"Fehler beim Erstellen des Events. Bitte versuchen Sie es erneut.",
			);
		} finally {
			setIsCreating(false);
		}
	};


	const applyPreset = (preset: EventDataPreset) => {
		setEventInfo({
			name: preset.name,
			uid: "",
			course: preset.course,
			date: preset.date,
			length: preset.length,
			memberCount: preset.memberCount,
			place: preset.place,
			users: [],
			queue: [],
			mentors: [],
			leftUsers: [],
			tags: preset.tags,
			difficulty: preset.difficulty,
			requirements: preset.requirements,
			description: preset.description,
		});
		setError("");
	}

	if (!open) return null;

	return (
		<div
			className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-colors duration-300 ${theme === "dark" ? "bg-black/60" : "bg-slate-900/40"
				} backdrop-blur-sm`}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className={`w-full max-w-2xl ${roundedClass} transition-colors duration-300 overflow-hidden ${theme === "dark"
					? "bg-black border border-zinc-800"
					: "bg-white border border-slate-200 shadow-xl"
					}`}
			>
				<div
					className={`px-8 py-6 border-b transition-colors duration-300 ${theme === "dark"
						? "border-zinc-800 bg-zinc-950/50"
						: "border-slate-200 bg-slate-50"
						}`}
				>
					<div className="flex items-start justify-between mb-4">
						<div>
							<p
								className={`text-xs tracking-[0.22em] uppercase font-['JetBrains_Mono'] mb-1.5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"
									}`}
							>
								Schritt {currentStep + 1} von {steps.length}
							</p>
							<h2
								className={`text-2xl font-black tracking-tight font-['Familjen_Grotesk'] ${theme === "dark" ? "text-white" : "text-slate-900"
									}`}
							>
								{steps[currentStep].title}
							</h2>
							<p
								className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
									}`}
							>
								{steps[currentStep].description}
							</p>
						</div>
						<button
							onClick={() => onOpenChange(false)}
							className={`text-2xl font-light p-1 transition-colors ${theme === "dark"
								? "text-zinc-400 hover:text-white"
								: "text-slate-500 hover:text-slate-900"
								}`}
						>
							×
						</button>
					</div>

					{(currentStep === 0 && (eventPresets?.length ?? 0) > 0) && (
						<div className="mb-4 flex items-center gap-2 p-2 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5">
							<Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
							<span className="text-[11px] font-medium font-['JetBrains_Mono'] text-purple-300 mr-2 uppercase">
								Vorausfüllen:
							</span>
							<div className="flex gap-2 flex-1">
								{eventPresets?.map((preset) => (
									<button
										key={preset.presetName}
										type="button"
										onClick={() => applyPreset(preset)}
										className="text-[11px] font-['JetBrains_Mono'] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-purple-500 transition-all"
									>
										{preset.presetName}
									</button>
								))}
							</div>
						</div>
					)}

					<div className="flex gap-2">
						{steps.map((_, index) => (
							<div
								key={index}
								className={`h-1 flex-1 transition-colors duration-300 ${roundedClass} ${index === currentStep
									? theme === "dark"
										? "bg-purple-500"
										: "bg-purple-600"
									: index < currentStep
										? theme === "dark"
											? "bg-purple-500/40"
											: "bg-purple-300/60"
										: theme === "dark"
											? "bg-zinc-800"
											: "bg-slate-200"
									}`}
							/>
						))}
					</div>
				</div>

				<div
					className={`px-8 py-6 min-h-72 max-h-[400px] overflow-y-auto transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-white"
						}`}
				>
					<AnimatePresence mode="wait">
						{currentStep === 0 && (
							<motion.div
								key="step-0"
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className="space-y-4"
							>
								<div className="grid gap-1.5">
									<Label
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Event-Name *
									</Label>
									<Input
										className={`${roundedClass} px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
											? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500/50"
											: "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
											} border focus:outline-none`}
										placeholder="z.B. Scratch Workshop"
										value={EventInfo.name}
										onChange={(e) =>
											setEventInfo({ ...EventInfo, name: e.target.value })
										}
									/>
								</div>

								<div className="grid gap-1.5">
									<Label
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Zugehöriger Kurs
									</Label>
									<select
										value={EventInfo.course}
										onChange={(e) =>
											setEventInfo({ ...EventInfo, course: e.target.value })
										}
										className={`${roundedClass} w-full px-4 py-2 text-sm transition-colors duration-300 border focus:outline-none ${theme === "dark"
											? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50"
											: "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
											}`}
									>
										{courses?.map((course) => (
											<option key={course.uid} value={course.uid}>
												{course.name}
											</option>
										))}
									</select>
								</div>

								<div className="grid gap-1.5">
									<Label
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Datum & Uhrzeit *
									</Label>
									<Input
										className={`${roundedClass} px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
											? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50"
											: "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
											} border focus:outline-none`}
										type="datetime-local"
										// Konvertiert das Firebase-Date sicher in das lokale Format "YYYY-MM-DDTHH:mm"
										value={(() => {
											const d = EventInfo.date.toDate();
											const tzOffset = d.getTimezoneOffset() * 60000; // Offset in Millisekunden
											return new Date(d.getTime() - tzOffset)
												.toISOString()
												.slice(0, 16);
										})()}
										onChange={(e) => {
											if (!e.target.value) return;

											// Wir splitten den Wert auf, um Zeitzonen-Fehler beim Parsen zu verhindern
											const [datePart, timePart] = e.target.value.split("T");
											const [year, month, day] = datePart
												.split("-")
												.map(Number);
											const [hours, minutes] = timePart.split(":").map(Number);

											// Erstellt ein neues Date-Objekt mit der lokalen Zeit des Users
											const localDate = new Date(
												year,
												month - 1,
												day,
												hours,
												minutes,
											);

											setEventInfo({
												...EventInfo,
												date: Timestamp.fromDate(localDate),
											});
										}}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-1.5">
										<Label
											className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
												}`}
										>
											Dauer (Min.) *
										</Label>
										<Input
											className={`${roundedClass} px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
												? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500/50"
												: "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
												} border focus:outline-none`}
											type="number"
											placeholder="90"
											value={EventInfo.length || ""}
											onChange={(e) =>
												setEventInfo({
													...EventInfo,
													length: parseInt(e.target.value) || 0,
												})
											}
										/>
									</div>

									<div className="grid gap-1.5">
										<Label
											className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
												}`}
										>
											Teilnehmerzahl *
										</Label>
										<Input
											className={`${roundedClass} px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
												? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500/50"
												: "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
												} border focus:outline-none`}
											type="number"
											placeholder="18"
											value={EventInfo.memberCount || ""}
											onChange={(e) =>
												setEventInfo({
													...EventInfo,
													memberCount: parseInt(e.target.value) || 0,
												})
											}
										/>
									</div>
								</div>
							</motion.div>
						)}

						{currentStep === 1 && (
							<motion.div
								key="step-1"
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className="space-y-4"
							>
								<div className="grid gap-1.5">
									<Label
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Veranstaltungsort *
									</Label>
									<Input
										className={`${roundedClass} px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
											? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500/50"
											: "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
											} border focus:outline-none`}
										placeholder="z.B. CUBES Wesel"
										value={EventInfo.place[0]}
										onChange={(e) => {
											const updated = [...EventInfo.place];
											updated[0] = e.target.value;
											setEventInfo({ ...EventInfo, place: updated });
										}}
									/>
								</div>

								<div className="grid gap-1.5">
									<Label
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Straße *
									</Label>
									<Input
										className={`${roundedClass} px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
											? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500/50"
											: "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
											} border focus:outline-none`}
										placeholder="z.B. Rudolf-Diesel-Str. 115"
										value={EventInfo.place[1]}
										onChange={(e) => {
											const updated = [...EventInfo.place];
											updated[1] = e.target.value;
											setEventInfo({ ...EventInfo, place: updated });
										}}
									/>
								</div>

								<div className="grid gap-1.5">
									<Label
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Stadt *
									</Label>
									<Input
										className={`${roundedClass} px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
											? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500/50"
											: "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
											} border focus:outline-none`}
										placeholder="z.B. 46485 Wesel"
										value={EventInfo.place[2]}
										onChange={(e) => {
											const updated = [...EventInfo.place];
											updated[2] = e.target.value;
											setEventInfo({ ...EventInfo, place: updated });
										}}
									/>
								</div>
							</motion.div>
						)}

						{currentStep === 2 && (
							<motion.div
								key="step-2"
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className="space-y-4"
							>
								<div className="grid gap-1.5">
									<Label
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Tags (kommagetrennt)
									</Label>
									<Input
										className={`${roundedClass} px-4 py-2 text-sm transition-colors duration-300 ${theme === "dark"
											? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500/50"
											: "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
											} border focus:outline-none`}
										placeholder="z.B. Scratch, Python"
										value={EventInfo.tags}
										onChange={(e) =>
											setEventInfo({ ...EventInfo, tags: e.target.value })
										}
									/>
								</div>

								<div className="grid gap-1.5">
									<Label
										htmlFor="difficulty"
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Schwierigkeitsgrad
									</Label>
									<select
										id="difficulty"
										className={`${roundedClass} w-full px-4 py-2 text-sm transition-colors duration-300 border focus:outline-none appearance-none cursor-pointer
          ${theme === "dark"
												? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50"
												: "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-400"
											}`}
										value={EventInfo.difficulty}
										onChange={(e) =>
											setEventInfo({
												...EventInfo,
												difficulty: e.target.value as Difficulties,
											})
										}
									>
										{Object.values(Difficulties).map((value) => (
											<option
												key={value}
												value={value}
												className={
													theme === "dark"
														? "bg-zinc-950 text-white"
														: "bg-white text-slate-900"
												}
											>
												{value}
											</option>
										))}
									</select>
								</div>
							</motion.div>
						)}
						{currentStep === 3 && (
							<motion.div
								key="step-3"
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className="space-y-4"
							>
								<div className="grid gap-1.5">
									<Label
										className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
											}`}
									>
										Beschreibung
									</Label>
									<textarea
										className={`${roundedClass} px-4 py-2 text-sm resize-none min-h-[140px] transition-colors duration-300 focus:outline-none ${theme === "dark"
											? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-purple-500/50"
											: "bg-slate-50 border-slate-200 placeholder-slate-400 focus:bg-white focus:border-purple-400"
											} border`}
										placeholder="Geben Sie eine detaillierte Beschreibung des Events ein..."
										value={EventInfo.description}
										onChange={(e) =>
											setEventInfo({
												...EventInfo,
												description: e.target.value,
											})
										}
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{error && (
						<motion.div
							initial={{ opacity: 0, y: -5 }}
							animate={{ opacity: 1, y: 0 }}
							className={`mt-4 flex items-center gap-2 p-3 ${roundedClass} text-xs font-['JetBrains_Mono'] ${theme === "dark"
								? "bg-red-500/10 border border-red-500/20 text-red-400"
								: "bg-red-50 border border-red-200 text-red-600"
								}`}
						>
							<AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
							{error}
						</motion.div>
					)}
				</div>

				<div
					className={`px-8 py-4 border-t transition-colors duration-300 ${theme === "dark"
						? "border-zinc-800 bg-zinc-950/50"
						: "border-slate-200 bg-slate-50"
						}`}
				>
					<div className="flex gap-3">
						<Button
							onClick={handlePrev}
							disabled={currentStep === 0}
							variant="outline"
							className={`flex-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider ${roundedClass}`}
						>
							<ArrowLeft className="w-3.5 h-3.5 mr-2" />
							Zurück
						</Button>

						{currentStep < steps.length - 1 ? (
							<Button
								onClick={handleNext}
								className={`flex-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 ${roundedClass}`}
							>
								Weiter
								<ArrowRight className="w-3.5 h-3.5 ml-2" />
							</Button>
						) : (
							<div className="flex gap-5">
								<Button
									onClick={() => saveCurrentEventAsPreset(EventInfo)}
									className={`flex-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider bg-green-600 hover:bg-green-700 text-white transition-colors duration-300 ${roundedClass} disabled:opacity-50`}
								>
									Als Preset speichern
								</Button>
								<Button
									onClick={handleEventCreate}
									disabled={isCreating}
									className={`flex-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 ${roundedClass} disabled:opacity-50`}
								>
									{isCreating ? (
										<>Erstelle...</>
									) : (
										<>
											<Check className="w-3.5 h-3.5 mr-2" />
											Erstellen
										</>
									)}
								</Button>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

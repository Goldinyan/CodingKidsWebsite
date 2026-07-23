"use client";

import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toJsDate } from "@/BackEnd/utils";
import { addEvent } from "@/lib/db";
import { Difficulties, EventDataPreset, type CourseData, type EventData } from "@/BackEnd/type";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { useAppData } from "@/context/DataContext";
import { addEventPreset, deleteEventPreset } from "@/lib/db/eventPresets";

import { PresetDropdown } from "./PresetDropdown";
import { SavePresetModal } from "./SavePresetModal";
import { EventFormSteps } from "./EventFormSteps";

const defaultEvent: EventData = {
	name: "",
	uid: "",
	course: "CoderDojo",
	date: Timestamp.fromDate(new Date(new Date().setHours(18, 0, 0, 0))),
	length: 0,
	memberCount: 0,
	place: ["", "", ""],
	users: [],
	queue: [],
	mentors: [],
	leftUsers: [],
	tags: "",
	difficulty: Difficulties.Alle,
	requirements: "",
	description: "",
};

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
	const { showErrorToast, showSuccessToast } = useNotificationToast();

	const [currentStep, setCurrentStep] = useState(0);
	const [eventInfo, setEventInfo] = useState<EventData>(defaultEvent);
	const [error, setError] = useState<string>("");
	const [isCreating, setIsCreating] = useState(false);

	// Preset-Logik-States
	const [activePreset, setActivePreset] = useState<string>("");
	const [hasBeenModified, setHasBeenModified] = useState(false);
	const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
	const [presetNameInput, setPresetNameInput] = useState("");
	const [isSavingPreset, setIsSavingPreset] = useState(false);

	const { refreshData, getUsers } = useAppData();
	const users = getUsers();

	const roundedClass = isRounded ? "rounded-xl" : "rounded-none";

	const steps = [
		{ title: "Grundinformationen", description: "Name, Kursbelegung, Datum und Dauer des Events" },
		{ title: "Standort", description: "Ort und Adresse des Events" },
		{ title: "Event-Details", description: "Typ, Tag und Schwierigkeitsgrad" },
		{ title: "Beschreibung", description: "Zusätzliche Informationen und Details" },
	];

	const resetFields = () => {
		setEventInfo(defaultEvent);
		setActivePreset("");
		setHasBeenModified(false);
		setError("");
	}

	const handleFieldChange = () => {
		setActivePreset("");
		setHasBeenModified(true);
	};

	const applyPreset = (preset: EventDataPreset) => {
		const newDate = toJsDate(preset.date);
		while (newDate < new Date()) {
			newDate.setDate(newDate.getDate() + 7);
		}

		setEventInfo({
			name: preset.name,
			uid: "",
			course: preset.course,
			date: Timestamp.fromDate(newDate),
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
		setActivePreset(preset.presetName);
		setHasBeenModified(false);
	};

	const handleDeletePreset = async (presetName: string) => {
		if (!user) return;
		try {
			await deleteEventPreset(presetName, user.uid, userRole);
			await refreshData("eventPresets");
			if (activePreset === presetName) {
				setActivePreset("");
			}
			showSuccessToast("SAVE_SUCCESS");
		} catch (err) {
			showErrorToast(err);
		}
	};

	const openPresetModal = () => {
		if (!eventInfo.name.trim()) {
			setError("Bitte gib mindestens einen Event-Namen ein, bevor du ein Preset erstellst.");
			return;
		}
		setPresetNameInput(eventInfo.name);
		setIsPresetModalOpen(true);
	};

	const handleConfirmSavePreset = async () => {
		if (!presetNameInput.trim()) return;

		setIsSavingPreset(true);
		const preset: EventDataPreset = {
			presetName: presetNameInput.trim(),
			name: eventInfo.name,
			course: eventInfo.course,
			date: eventInfo.date,
			length: eventInfo.length,
			memberCount: eventInfo.memberCount,
			place: eventInfo.place,
			tags: eventInfo.tags,
			difficulty: eventInfo.difficulty,
			requirements: eventInfo.requirements,
			description: eventInfo.description,
		};

		try {
			await addEventPreset(preset, user?.uid, userRole);
			await refreshData("eventPresets");
			showSuccessToast("SAVE_SUCCESS");
			setIsPresetModalOpen(false);
			setActivePreset(preset.presetName);
			setHasBeenModified(false);
		} catch (err) {
			showErrorToast(err);
		} finally {
			setIsSavingPreset(false);
		}
	};

	const validateStep = (): boolean => {
		setError("");
		switch (currentStep) {
			case 0:
				if (!eventInfo.name.trim()) {
					setError("Event-Name ist erforderlich");
					return false;
				}
				if (eventInfo.length <= 0) {
					setError("Dauer muss größer als 0 sein");
					return false;
				}
				if (eventInfo.memberCount <= 0) {
					setError("Teilnehmerzahl muss größer als 0 sein");
					return false;
				}
				return true;

			case 1:
				if (!eventInfo.place[0].trim() || !eventInfo.place[1].trim() || !eventInfo.place[2].trim()) {
					setError("Alle Standortangaben sind erforderlich");
					return false;
				}
				return true;

			default:
				return true;
		}
	};

	const handleNext = () => {
		if (validateStep() && currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrev = () => {
		setError("");
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleEventCreate = async () => {
		if (!user) return;

		if (!eventInfo.name.trim()) {
			setError("Event-Name ist erforderlich");
			return;
		}

		if (!eventInfo.place[0].trim() || !eventInfo.place[1].trim() || !eventInfo.place[2].trim()) {
			setError("Alle Standortangaben sind erforderlich");
			return;
		}

		if (events?.some((e) => e.date === eventInfo.date && e.name === eventInfo.name)) {
			setError("Ein Event an diesem Tag mit diesem Namen existiert bereits.");
			return;
		}

		const usersToNotify = users.filter((u) => u.settings?.notifications?.newEvent);

		setIsCreating(true);
		try {
			await addEvent(eventInfo, user.uid, userRole, userData!.name, usersToNotify);
			await refreshData("events");
			setEventInfo(defaultEvent);
			setCurrentStep(0);
			setError("");
			onCreated?.();
			onOpenChange(false);
		} catch (err) {
			showErrorToast(err);
			setError("Fehler beim Erstellen des Events. Bitte versuchen Sie es erneut.");
		} finally {
			setIsCreating(false);
		}
	};

	if (!open) return null;

	return (
		<div className={`fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-sm ${theme === "dark" ? "bg-black/60" : "bg-slate-900/40"}`}>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className={`w-full max-w-2xl ${roundedClass} overflow-hidden relative border shadow-xl ${theme === "dark" ? "bg-black border-zinc-800" : "bg-white border-slate-200"
					}`}
			>
				<AnimatePresence>
					<SavePresetModal
						isOpen={isPresetModalOpen}
						presetName={presetNameInput}
						setPresetName={setPresetNameInput}
						isSaving={isSavingPreset}
						theme={theme}
						roundedClass={roundedClass}
						onClose={() => setIsPresetModalOpen(false)}
						onConfirm={handleConfirmSavePreset}
					/>
				</AnimatePresence>

				<div className={`px-8 py-6 border-b ${theme === "dark" ? "border-zinc-800 bg-zinc-950/50" : "border-slate-200 bg-slate-50"}`}>
					<div className="flex items-start justify-between mb-4">
						<div>
							<p className={`text-xs tracking-[0.22em] uppercase font-['JetBrains_Mono'] mb-1.5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>
								Schritt {currentStep + 1} von {steps.length}
							</p>
							<h2 className={`text-2xl font-black tracking-tight font-['Familjen_Grotesk'] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
								{steps[currentStep].title}
							</h2>
							<p className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
								{steps[currentStep].description}
							</p>
						</div>
						<button onClick={() => onOpenChange(false)} className={`text-2xl font-light p-1 ${theme === "dark" ? "text-zinc-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>
							×
						</button>
					</div>

					{currentStep === 0 && (
						<PresetDropdown
							presets={eventPresets || []}
							onApply={applyPreset}
							onDelete={handleDeletePreset}
							onReset={resetFields}
							showSavePresetBtn={activePreset === "" && hasBeenModified}
							onOpenSavePresetModal={openPresetModal}
						/>
					)}

					<div className="flex gap-2">
						{steps.map((_, index) => (
							<div
								key={index}
								className={`h-1 flex-1 ${roundedClass} ${index === currentStep
									? theme === "dark" ? "bg-purple-500" : "bg-purple-600"
									: index < currentStep
										? theme === "dark" ? "bg-purple-500/40" : "bg-purple-300/60"
										: theme === "dark" ? "bg-zinc-800" : "bg-slate-200"
									}`}
							/>
						))}
					</div>
				</div>

				<div className={`px-8 py-6 min-h-72  overflow-y-auto ${theme === "dark" ? "bg-black" : "bg-white"}`}>
					<AnimatePresence mode="wait">
						<EventFormSteps
							currentStep={currentStep}
							eventInfo={eventInfo}
							setEventInfo={setEventInfo}
							courses={courses}
							theme={theme}
							roundedClass={roundedClass}
							onFieldChange={handleFieldChange}
							showSavePresetBtn={activePreset === "" && hasBeenModified}
							onOpenSavePresetModal={openPresetModal}
						/>
					</AnimatePresence>

					{error && (
						<motion.div
							initial={{ opacity: 0, y: -5 }}
							animate={{ opacity: 1, y: 0 }}
							className={`mt-4 flex items-center gap-2 p-3 ${roundedClass} text-xs font-['JetBrains_Mono'] ${theme === "dark" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-50 border border-red-200 text-red-600"
								}`}
						>
							<AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
							{error}
						</motion.div>
					)}
				</div>

				<div className={`px-8 py-4 border-t ${theme === "dark" ? "border-zinc-800 bg-zinc-950/50" : "border-slate-200 bg-slate-50"}`}>
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
								className={`flex-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white ${roundedClass}`}
							>
								Weiter
								<ArrowRight className="w-3.5 h-3.5 ml-2" />
							</Button>
						) : (
							<Button
								type="button"
								onClick={handleEventCreate}
								disabled={isCreating}
								className={`flex-1 font-['JetBrains_Mono'] text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white ${roundedClass} disabled:opacity-50`}
							>
								{isCreating ? "Erstelle..." : (
									<>
										<Check className="w-3.5 h-3.5 mr-2" />
										Erstellen
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

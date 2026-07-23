"use client";

import { motion } from "framer-motion";
import { Timestamp } from "firebase/firestore";
import { Bookmark } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Difficulties, type CourseData, type EventData } from "@/BackEnd/type";
import { toJsDate } from "@/BackEnd/utils";

interface EventFormStepsProps {
	currentStep: number;
	eventInfo: EventData;
	setEventInfo: (data: EventData) => void;
	courses?: CourseData[];
	theme: string;
	roundedClass: string;
	onFieldChange: () => void;
	showSavePresetBtn: boolean;
	onOpenSavePresetModal: () => void;
}

export function EventFormSteps({
	currentStep,
	eventInfo,
	setEventInfo,
	courses,
	theme,
	roundedClass,
	onFieldChange,
	showSavePresetBtn,
	onOpenSavePresetModal,
}: EventFormStepsProps) {
	const handleUpdate = (updated: Partial<EventData>) => {
		setEventInfo({ ...eventInfo, ...updated });
		onFieldChange();
	};

	return (
		<div className="w-full h-auto overflow-visible">
			{/*showSavePresetBtn && (
				<div className="flex justify-end mb-4">
					<Button
						type="button"
						onClick={onOpenSavePresetModal}
						className={`font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider bg-green-600/90 hover:bg-green-600 text-white ${roundedClass} h-8 px-3 flex items-center gap-1.5`}
					>
						<Bookmark className="w-3.5 h-3.5" />
						Preset Speichern
					</Button>
				</div>
			)*/}

			{currentStep === 0 && (
				<motion.div
					key="step-0"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -10 }}
					transition={{ duration: 0.2 }}
					className="space-y-4 h-auto"
				>
					<div className="grid gap-1.5">
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Event-Name *
						</Label>
						<Input
							className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
								}`}
							placeholder="z.B. Scratch Workshop"
							value={eventInfo.name}
							onChange={(e) => handleUpdate({ name: e.target.value })}
						/>
					</div>

					<div className="grid gap-1.5">
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Zugehöriger Kurs
						</Label>
						<select
							value={eventInfo.course}
							onChange={(e) => handleUpdate({ course: e.target.value })}
							className={`${roundedClass} w-full px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
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
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Datum & Uhrzeit *
						</Label>
						<Input
							type="datetime-local"
							className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
								}`}
							value={(() => {
								const d = toJsDate(eventInfo.date);
								const tzOffset = d.getTimezoneOffset() * 60000;
								return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
							})()}
							onChange={(e) => {
								if (!e.target.value) return;
								const [datePart, timePart] = e.target.value.split("T");
								const [year, month, day] = datePart.split("-").map(Number);
								const [hours, minutes] = timePart.split(":").map(Number);
								const localDate = new Date(year, month - 1, day, hours, minutes);
								handleUpdate({ date: Timestamp.fromDate(localDate) });
							}}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-1.5">
							<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
								Dauer (Min.) *
							</Label>
							<Input
								type="number"
								placeholder="90"
								className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
									}`}
								value={eventInfo.length || ""}
								onChange={(e) => handleUpdate({ length: parseInt(e.target.value) || 0 })}
							/>
						</div>

						<div className="grid gap-1.5">
							<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
								Teilnehmerzahl *
							</Label>
							<Input
								type="number"
								placeholder="18"
								className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
									}`}
								value={eventInfo.memberCount || ""}
								onChange={(e) => handleUpdate({ memberCount: parseInt(e.target.value) || 0 })}
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
					transition={{ duration: 0.2 }}
					className="space-y-4 h-auto"
				>
					<div className="grid gap-1.5">
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Veranstaltungsort *
						</Label>
						<Input
							placeholder="z.B. CUBES Wesel"
							className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
								}`}
							value={eventInfo.place[0]}
							onChange={(e) => {
								const updated = [...eventInfo.place];
								updated[0] = e.target.value;
								handleUpdate({ place: updated });
							}}
						/>
					</div>

					<div className="grid gap-1.5">
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Straße *
						</Label>
						<Input
							placeholder="z.B. Rudolf-Diesel-Str. 115"
							className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
								}`}
							value={eventInfo.place[1]}
							onChange={(e) => {
								const updated = [...eventInfo.place];
								updated[1] = e.target.value;
								handleUpdate({ place: updated });
							}}
						/>
					</div>

					<div className="grid gap-1.5">
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Stadt *
						</Label>
						<Input
							placeholder="z.B. 46485 Wesel"
							className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
								}`}
							value={eventInfo.place[2]}
							onChange={(e) => {
								const updated = [...eventInfo.place];
								updated[2] = e.target.value;
								handleUpdate({ place: updated });
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
					transition={{ duration: 0.2 }}
					className="space-y-4 h-auto"
				>
					<div className="grid gap-1.5">
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Tags (kommagetrennt)
						</Label>
						<Input
							placeholder="z.B. Scratch, Python"
							className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
								}`}
							value={eventInfo.tags}
							onChange={(e) => handleUpdate({ tags: e.target.value })}
						/>
					</div>

					<div className="grid gap-1.5">
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Schwierigkeitsgrad
						</Label>
						<select
							className={`${roundedClass} w-full px-4 py-2 text-sm border focus:outline-none appearance-none cursor-pointer ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-400"
								}`}
							value={eventInfo.difficulty}
							onChange={(e) => handleUpdate({ difficulty: e.target.value as Difficulties })}
						>
							{Object.values(Difficulties).map((value) => (
								<option key={value} value={value}>
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
					transition={{ duration: 0.2 }}
					className="space-y-4 h-auto"
				>
					<div className="grid gap-1.5">
						<Label className={`text-[11px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
							Beschreibung
						</Label>
						<textarea
							className={`${roundedClass} px-4 py-2 text-sm resize-none min-h-[120px] border focus:outline-none ${theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white focus:border-purple-500/50" : "bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-400"
								}`}
							placeholder="Geben Sie eine detaillierte Beschreibung des Events ein..."
							value={eventInfo.description}
							onChange={(e) => handleUpdate({ description: e.target.value })}
						/>
					</div>
				</motion.div>
			)}
		</div>
	);
}

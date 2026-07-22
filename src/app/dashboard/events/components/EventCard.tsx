"use client";

import {
	Calendar,
	ChevronDown,
	ChevronUp,
	Edit2,
	Save,
	Trash2,
	X,
	Clock,
	ShieldCheck,
	Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { toJsDate } from "@/BackEnd/utils";
import type { CourseData, EventData, EventDataPreset, UserData } from "@/BackEnd/type";
import { EVENT_FIELDS, EVENT_FIELD_LABELS } from "../constants";
import { formatValue } from "../formatValue";
import { formatLogMessage, formatLogDate } from "../formatLog";



export function EventCard(props: {
	event: EventData;
	expanded: boolean;
	onToggleExpanded: () => void;
	users: UserData[];
	queueUsers: UserData[];
	mentors?: UserData[];
	courses?: CourseData[];
	onRemoveUser: (user: UserData) => void;
	onRemoveMentor?: (mentor: UserData) => void;
	isEditing: boolean;
	editValue: Partial<EventData & { tags?: string }> | undefined;
	onToggleEdit: () => void;
	onEditValueChange: (next: Partial<EventData & { tags?: string }>) => void;
	onSaveChanges: () => void;
	onRequestDelete: () => void;
}) {
	const {
		event,
		expanded,
		onToggleExpanded,
		users,
		queueUsers,
		mentors = [],
		courses = [], // Fallback auf leeres Array
		onRemoveUser,
		onRemoveMentor,
		isEditing,
		editValue,
		onToggleEdit,
		onEditValueChange,
		onSaveChanges,
		onRequestDelete,
	} = props;

	const { theme, isRounded } = useTheme();
	const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

	const full = event.users.length >= event.memberCount;

	return (
		<div
			className={`p-6 border transition-all duration-200 ${radiusClass} ${theme === "dark"
				? "bg-zinc-950 border-zinc-800 text-[#f4f4f5]"
				: "bg-white border-slate-200 text-slate-700 shadow-sm"
				}`}
		>
			<div className="flex flex-row justify-between items-start mb-3">
				<p
					className={`text-lg font-black font-['Familjen_Grotesk'] tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
				>
					{event.name}
				</p>
				<span
					className={`px-2.5 py-0.5 font-['JetBrains_Mono'] text-[10px] font-bold tracking-wider uppercase border ${radiusClass} ${!full ? (theme === "dark" ? "bg-green-950/40 text-green-400 border-green-800/60" : "bg-green-50 text-green-700 border-green-200") : theme === "dark" ? "bg-blue-950/40 text-blue-400 border-blue-800/60" : "bg-blue-50 text-blue-700 border-blue-200"}`}
				>
					{full ? "Ausgebucht" : "Veröffentlicht"}
				</span>
			</div>

			<div className="flex flex-row justify-start items-center gap-2">
				<Calendar
					className={`h-3.5 w-3.5 ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`}
				/>
				<p
					className={`font-['JetBrains_Mono'] text-[11px] tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-slate-500"}`}
				>
					{toJsDate(event.date).toLocaleDateString("de-DE", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					})}
					{" // "}
					{toJsDate(event.date).toLocaleTimeString("de-DE", {
						hour: "2-digit",
						minute: "2-digit",
					})}
					{" Uhr"}
				</p>

				{event.tags && event.tags.length > 0 && (
					<div className="hidden sm:flex flex-row gap-1 ml-3 items-center">
						<Tag className="w-3 h-3 text-zinc-400" />
						{event.tags.split(",").map((tag, i) => (
							<span
								key={i}
								className="text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				<button
					onClick={onToggleExpanded}
					type="button"
					className={`ml-auto p-1 transition-colors ${theme === "dark" ? "text-zinc-500 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}
				>
					{expanded ? (
						<ChevronUp className="w-4 h-4" />
					) : (
						<ChevronDown className="w-4 h-4" />
					)}
				</button>
			</div>

			<AnimatePresence initial={false}>
				{expanded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div
							className={`mt-5 space-y-4 border-t pt-5 ${theme === "dark" ? "border-zinc-900" : "border-slate-100"}`}
						>
							{EVENT_FIELDS.map((key, idx) => (
								<div
									key={key}
									className={`p-4 border ${radiusClass} ${theme === "dark" ? "bg-zinc-900/40 border-zinc-900" : "bg-slate-50 border-slate-100"}`}
								>
									<p
										className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-2 font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
									>
										{key === "users"
											? `Teilnehmer (${event.users.length})`
											: key === "queue"
												? `Warteschlange (${event.queue.length})`
												: `${EVENT_FIELD_LABELS[idx]}`}
									</p>
									{key !== "users" && key !== "queue" && (
										<p
											className={`text-xs whitespace-pre-wrap font-medium leading-relaxed ${theme === "dark" ? "text-zinc-300" : "text-slate-700"}`}
										>
											{formatValue(event[key]) || "—"}
										</p>
									)}
									{key === "users" && (
										<div className="mt-1">
											{event.users.length > 0 ? (
												<div
													className={`flex flex-col divide-y border ${radiusClass} ${theme === "dark" ? "border-zinc-800 divide-zinc-800 bg-zinc-950" : "border-slate-200 divide-slate-100 bg-white"}`}
												>
													{users.map((u) => (
														<div
															key={u.uid}
															className="py-2.5 flex flex-row justify-between items-center px-4"
														>
															<div className="flex flex-col items-start min-w-0 flex-1">
																<p
																	className={`text-xs font-bold truncate w-full ${theme === "dark" ? "text-white" : "text-slate-900"}`}
																>
																	{u.name}
																</p>
																<p className="font-['JetBrains_Mono'] text-[9px] tracking-wider uppercase text-zinc-500 mt-0.5">
																	{u.role || "Teilnehmer"}
																</p>
															</div>
															<button
																type="button"
																onClick={() => onRemoveUser(u)}
																className={`p-1.5 transition-colors ${theme === "dark" ? "text-zinc-600 hover:text-red-400" : "text-slate-400 hover:text-red-600"}`}
															>
																<Trash2 className="w-3.5 h-3.5" />
															</button>
														</div>
													))}
												</div>
											) : (
												<p className="font-['JetBrains_Mono'] text-[10px] italic text-zinc-500">
													Keine Teilnehmer registriert
												</p>
											)}
										</div>
									)}
									{key === "queue" && (
										<div className="mt-1">
											{event.queue.length > 0 ? (
												<ul
													className={`divide-y border ${radiusClass} ${theme === "dark" ? "border-zinc-800 divide-zinc-800 bg-zinc-950" : "border-slate-200 divide-slate-100 bg-white"}`}
												>
													{queueUsers.map((u) => (
														<li
															key={u.uid}
															className="py-2 px-4 text-xs font-medium flex items-center gap-2"
														>
															<span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
															<span
																className={
																	theme === "dark"
																		? "text-zinc-300"
																		: "text-slate-700"
																}
															>
																{u.name}
															</span>
														</li>
													))}
												</ul>
											) : (
												<p className="font-['JetBrains_Mono'] text-[10px] italic text-zinc-500">
													Warteschlange ist leer
												</p>
											)}
										</div>
									)}
								</div>
							))}

							<div
								className={`p-4 border ${radiusClass} ${theme === "dark" ? "bg-zinc-900/40 border-zinc-900" : "bg-slate-50 border-slate-100"}`}
							>
								<p
									className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-2 font-bold flex items-center gap-1.5 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
								>
									<ShieldCheck className="w-3.5 h-3.5" /> Mentoren & Betreuer (
									{mentors.length})
								</p>
								<div className="mt-1">
									{mentors.length > 0 ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
											{mentors.map((m) => (
												<div
													key={m.uid}
													className={`p-3 flex flex-row justify-between items-center border ${radiusClass} ${theme === "dark" ? "border-indigo-950/40 bg-indigo-950/10 hover:bg-indigo-950/20 text-white" : "border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 text-slate-900"}`}
												>
													<div className="min-w-0 flex-1">
														<p className="text-xs font-bold truncate">
															{m.name}
														</p>
														<p className="font-['JetBrains_Mono'] text-[9px] text-indigo-500 dark:text-indigo-400 tracking-wider uppercase mt-0.5">
															{m.role || "Mentor"}
														</p>
													</div>
													{onRemoveMentor && (
														<button
															type="button"
															onClick={() => onRemoveMentor(m)}
															className="p-1 text-zinc-400 hover:text-red-500 transition-colors ml-2"
														>
															<X className="w-3.5 h-3.5" />
														</button>
													)}
												</div>
											))}
										</div>
									) : (
										<p className="font-['JetBrains_Mono'] text-[10px] italic text-zinc-500">
											Noch keine Mentoren zugewiesen
										</p>
									)}
								</div>
							</div>

							{/* System Logs */}
							{event.logs && event.logs.length > 0 && (
								<div
									className={`p-4 border ${radiusClass} ${theme === "dark" ? "bg-zinc-900/40 border-zinc-900" : "bg-slate-50 border-slate-100"}`}
								>
									<p
										className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-3 font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
									>
										Aktivitäts-Log ({event.logs.length})
									</p>
									<div
										className={`flex flex-col divide-y border ${radiusClass} ${theme === "dark" ? "border-zinc-800 divide-zinc-800 bg-zinc-950" : "border-slate-200 divide-slate-100 bg-white"}`}
									>
										{event.logs.map((log, idx) => {
											const { title, details } = formatLogMessage(log);
											return (
												<div
													key={idx}
													className="py-3 px-4 flex items-start gap-3"
												>
													<Clock
														className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`}
													/>
													<div className="flex-1 min-w-0">
														<p
															className={`text-xs font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
														>
															{title}
														</p>
														{details && (
															<p
																className={`text-[11px] mt-0.5 leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
															>
																{details}
															</p>
														)}
														<p className="font-['JetBrains_Mono'] text-[9px] text-zinc-500 mt-1 uppercase tracking-wider">
															{formatLogDate(log)}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="flex flex-row gap-3 items-center mt-5">
				<button
					onClick={onToggleEdit}
					type="button"
					className={`flex-1 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${isEditing ? (theme === "dark" ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-100 border-slate-300 text-slate-900") : theme === "dark" ? "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
				>
					{isEditing ? (
						<X className="w-3.5 h-3.5" />
					) : (
						<Edit2 className="w-3.5 h-3.5" />
					)}
					{isEditing ? "Abbrechen" : "Bearbeiten"}
				</button>
				<button
					onClick={onRequestDelete}
					type="button"
					className={`flex-1 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${theme === "dark" ? "bg-transparent border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-950" : "bg-transparent border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200"}`}
				>
					<Trash2 className="w-3.5 h-3.5" /> Löschen
				</button>
			</div>

			<AnimatePresence>
				{isEditing && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{ duration: 0.2 }}
						className={`mt-4 p-5 border ${radiusClass} ${theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"}`}
					>
						<p
							className={`font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase mb-4 font-bold ${theme === "dark" ? "text-zinc-400" : "text-slate-800"}`}
						>
							Event-Parameter bearbeiten:
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Event-Name */}
							<div>
								<label className="block font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase mb-1.5 text-zinc-500">
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
									className={`w-full px-3 py-2 text-xs font-medium focus:outline-none transition-all duration-200 ${radiusClass} ${theme === "dark" ? "bg-zinc-900 border border-zinc-800 text-white focus:border-green-600" : "bg-white border border-slate-200 text-slate-900 focus:border-green-600"}`}
								/>
							</div>

							{/* Max. Teilnehmer */}
							<div>
								<label className="block font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase mb-1.5 text-zinc-500">
									Max. Teilnehmer
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
									className={`w-full px-3 py-2 font-['JetBrains_Mono'] text-xs focus:outline-none transition-all duration-200 ${radiusClass} ${theme === "dark" ? "bg-zinc-900 border border-zinc-800 text-white focus:border-green-600" : "bg-white border border-slate-200 text-slate-900 focus:border-green-600"}`}
								/>
							</div>

							{/* Dauer */}
							<div>
								<label className="block font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase mb-1.5 text-zinc-500">
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
									className={`w-full px-3 py-2 font-['JetBrains_Mono'] text-xs focus:outline-none transition-all duration-200 ${radiusClass} ${theme === "dark" ? "bg-zinc-900 border border-zinc-800 text-white focus:border-green-600" : "bg-white border border-slate-200 text-slate-900 focus:border-green-600"}`}
								/>
							</div>

							{/* DYNAMISCHES COURSE SELECT FIELD */}
							<div>
								<label className="block font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase mb-1.5 text-zinc-500">
									Course
								</label>
								<div className="relative">
									<select
										value={editValue?.course ?? event.course ?? ""}
										onChange={(e) =>
											onEditValueChange({
												...(editValue || {}),
												course: e.target.value,
											})
										}
										className={`w-full px-3 py-2 text-xs font-medium focus:outline-none transition-all duration-200 appearance-none pr-8 ${radiusClass} ${theme === "dark"
											? "bg-zinc-900 border border-zinc-800 text-white focus:border-green-600"
											: "bg-white border border-slate-200 text-slate-900 focus:border-green-600"
											}`}
									>
										<option value="" disabled>
											-- Kurs auswählen --
										</option>
										{courses.map((c, i) => {
											const courseName = typeof c === "string" ? c : c.name;
											const courseVal = typeof c === "string" ? c : c.name;
											return (
												<option
													key={i}
													value={courseVal}
													className={
														theme === "dark" ? "bg-zinc-900" : "bg-white"
													}
												>
													{courseName}
												</option>
											);
										})}
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-500">
										<ChevronDown className="w-3.5 h-3.5" />
									</div>
								</div>
							</div>

							{/* Tags */}
							<div className="md:col-span-2">
								<label className="block font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase mb-1.5 text-zinc-500">
									Tags (mit Komma trennen)
								</label>
								<input
									type="text"
									value={editValue?.tags ?? event.tags ?? ""}
									onChange={(e) =>
										onEditValueChange({
											...(editValue || {}),
											tags: e.target.value,
										})
									}
									placeholder="z.B. Scratch, Einsteiger, Logik"
									className={`w-full px-3 py-2 text-xs font-medium focus:outline-none transition-all duration-200 ${radiusClass} ${theme === "dark" ? "bg-zinc-900 border border-zinc-800 text-white focus:border-green-600" : "bg-white border border-slate-200 text-slate-900 focus:border-green-600"}`}
								/>
							</div>

							{/* Beschreibung */}
							<div className="md:col-span-2">
								<label className="block font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase mb-1.5 text-zinc-500">
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
									className={`w-full px-3 py-2 text-xs font-medium focus:outline-none min-h-[80px] resize-none transition-all duration-200 ${radiusClass} ${theme === "dark" ? "bg-zinc-900 border border-zinc-800 text-white focus:border-green-600" : "bg-white border border-slate-200 text-slate-900 focus:border-green-600"}`}
								/>
							</div>
						</div>

						<button
							onClick={onSaveChanges}
							type="button"
							className={`w-full mt-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} bg-green-600 hover:bg-green-700`}
						>
							<Save className="w-3.5 h-3.5" /> Änderungen Speichern
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

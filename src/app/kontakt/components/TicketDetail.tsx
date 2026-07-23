"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { addMessageToTicket, addInternalNoteToTicket, updateTicket } from "@/lib/db/tickets";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import {
	X,
	Send,
	Lock,
	MessageCircle,
	UserCheck,
	Loader2,
	ChevronDown,
	ChevronUp,
	Info,
	MessageSquarePlus,
	FileLock2
} from "lucide-react";
import type { TicketData } from "@/BackEnd/type";
import StatusBadge from "./StatusBadge";

interface TicketDetailProps {
	ticket: TicketData;
	onClose: () => void;
	onUpdate?: () => void;
	isAdmin?: boolean;
}

const CATEGORY_MAP: Record<string, string> = {
	general: "Allgemein",
	technical: "Technisch",
	billing: "Rechnung",
	other: "Sonstiges",
};

const PRIORITY_MAP: Record<string, string> = {
	low: "Niedrig",
	medium: "Mittel",
	high: "Hoch",
	urgent: "Dringend",
};

export default function TicketDetail({
	ticket,
	onClose,
	onUpdate,
	isAdmin = false,
}: TicketDetailProps) {
	const { theme, isRounded } = useTheme();
	const { user, userData } = useAuth();
	const { showSuccessToast, showErrorToast } = useNotificationToast();

	const [message, setMessage] = useState("");
	const [internalNote, setInternalNote] = useState("");
	const [loadingMessage, setLoadingMessage] = useState(false);
	const [loadingNote, setLoadingNote] = useState(false);
	const [loadingAssign, setLoadingAssign] = useState(false);

	// Accordion States für jede einzelne Sektion
	const [isMetaOpen, setIsMetaOpen] = useState(false);
	const [isNotesOpen, setIsNotesOpen] = useState(false);
	const [isMessagesOpen, setIsMessagesOpen] = useState(true);
	const [isReplyOpen, setIsReplyOpen] = useState(true);
	const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isMessagesOpen) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [ticket.messages, isMessagesOpen]);

	const radiusClass = isRounded ? "rounded-md" : "rounded-none";
	const borderThemeClass = theme === "dark" ? "border-zinc-900" : "border-slate-200";
	const inputBgClass = theme === "dark"
		? "bg-zinc-950/50 border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700"
		: "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300";

	const assign = async () => {
		if (!user || !userData) return;

		setLoadingAssign(true);
		try {
			await updateTicket(ticket.uid, { assignedToUid: user.uid, assignedToName: userData.name });
			showSuccessToast("UPDATE_SUCCESS");
			onUpdate?.();
		} catch (error) {
			showErrorToast(error);
		} finally {
			setLoadingAssign(false);
		}
	};

	const handleSendMessage = async () => {
		if (!message.trim() || !user || !userData) return;

		setLoadingMessage(true);
		try {
			await addMessageToTicket(
				ticket.uid,
				message.trim(),
				{
					uid: user.uid,
					name: userData.name,
					role: isAdmin ? "staff" : "customer",
				},
				user.uid,
				userData.role
			);
			setMessage("");
			showSuccessToast("GENERIC_SUCCESS");
			onUpdate?.();
		} catch (error) {
			showErrorToast(error, "GENERIC_ERROR");
			console.error(error);
		} finally {
			setLoadingMessage(false);
		}
	};

	const handleAddNote = async () => {
		if (!internalNote.trim() || !user || !userData) return;

		setLoadingNote(true);
		try {
			await addInternalNoteToTicket(
				ticket.uid,
				internalNote.trim(),
				{ uid: user.uid, name: userData.name },
				user.uid,
				userData.role
			);
			setInternalNote("");
			setIsAddNoteOpen(false);
			showSuccessToast("GENERIC_SUCCESS");
			onUpdate?.();
		} catch (error) {
			showErrorToast(error, "GENERIC_ERROR");
			console.error(error);
		} finally {
			setLoadingNote(false);
		}
	};

	const formatDate = (dateVal: any) => {
		if (!dateVal) return "";
		const date = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
		return date.toLocaleDateString("de-DE", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
			<div
				className={`w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col border shadow-2xl overflow-hidden ${theme === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-white text-slate-900"
					} ${borderThemeClass} ${isRounded ? "rounded-xl" : "rounded-none"}`}
			>
				{/* Fixed Header */}
				<div
					className={`p-4 sm:p-5 border-b ${borderThemeClass} flex items-start justify-between sticky top-0 z-10 ${theme === "dark" ? "bg-zinc-950" : "bg-white"
						}`}
				>
					<div className="flex-1 pr-3">
						<div className="flex items-center gap-2 sm:gap-3 mb-1.5 flex-wrap">
							<span
								className={`font-['JetBrains_Mono'] font-bold text-xs sm:text-sm tracking-wide ${theme === "dark" ? "text-blue-400" : "text-blue-600"
									}`}
							>
								#{ticket.ticketNumber}
							</span>
							<StatusBadge status={ticket.status} />
						</div>
						<h2 className="text-lg sm:text-xl font-black font-['Familjen_Grotesk'] tracking-wide line-clamp-2">
							{ticket.subject}
						</h2>
					</div>
					<button
						onClick={onClose}
						className={`p-2 transition-colors ${radiusClass} ${theme === "dark"
							? "hover:bg-zinc-900 text-zinc-400 hover:text-white"
							: "hover:bg-slate-100 text-slate-400 hover:text-slate-900"
							}`}
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Scrollbarer Container mit Accordion-Gruppen */}
				<div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">

					{/* 1. Details & Beschreibung */}
					<div>
						<button
							onClick={() => setIsMetaOpen(!isMetaOpen)}
							className={`w-full p-4 flex items-center justify-between text-left transition-colors ${theme === "dark" ? "hover:bg-zinc-900/40" : "hover:bg-slate-50"
								}`}
						>
							<div className="flex items-center gap-2">
								<Info className="w-4 h-4 text-blue-500" />
								<span className={`text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide ${theme === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
									Details & Beschreibung
								</span>
							</div>
							{isMetaOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
						</button>

						{isMetaOpen && (
							<div className="p-4 sm:p-5 pt-0 space-y-4">
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
									<div>
										<p className={`text-[10px] sm:text-xs font-['JetBrains_Mono'] font-bold uppercase mb-0.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
											Von
										</p>
										<p className="font-bold truncate">{ticket.userName}</p>
									</div>
									<div>
										<p className={`text-[10px] sm:text-xs font-['JetBrains_Mono'] font-bold uppercase mb-0.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
											Kategorie
										</p>
										<p className="font-bold">{CATEGORY_MAP[ticket.category] || ticket.category}</p>
									</div>
									<div>
										<p className={`text-[10px] sm:text-xs font-['JetBrains_Mono'] font-bold uppercase mb-0.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
											Priorität
										</p>
										<p className="font-bold">{PRIORITY_MAP[ticket.priority] || ticket.priority}</p>
									</div>
									{isAdmin && (
										<div>
											<p className={`text-[10px] sm:text-xs font-['JetBrains_Mono'] font-bold uppercase mb-0.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
												Zugewiesen
											</p>
											{ticket.assignedToName ? (
												<p className="font-bold truncate">{ticket.assignedToName}</p>
											) : (
												<button
													onClick={assign}
													disabled={loadingAssign}
													className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs font-['JetBrains_Mono'] font-bold uppercase transition-all ${radiusClass} ${loadingAssign ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-95"
														} ${theme === "dark"
															? "bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30"
															: "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
														}`}
												>
													{loadingAssign ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
													Zuweisen
												</button>
											)}
										</div>
									)}
								</div>

								<div className="pt-2 border-t border-zinc-800/30">
									<p className={`text-[10px] sm:text-xs font-['JetBrains_Mono'] font-bold uppercase mb-1 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
										Beschreibung
									</p>
									<div className="max-h-40 overflow-y-auto pr-1">
										<p className={`leading-relaxed whitespace-pre-wrap break-words text-xs sm:text-sm ${theme === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
											{ticket.description}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* 2. Vorhandene Interne Notizen (Nur Staff) */}
					{isAdmin && ticket.internalNotes && ticket.internalNotes.length > 0 && (
						<div className={`${theme === "dark" ? "bg-amber-950/10" : "bg-amber-50/40"}`}>
							<button
								onClick={() => setIsNotesOpen(!isNotesOpen)}
								className="w-full p-4 flex items-center justify-between text-left transition-colors"
							>
								<div className="flex items-center gap-2 text-amber-500">
									<Lock className="w-4 h-4" />
									<span className="text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide">
										Interne Notizen ({ticket.internalNotes.length})
									</span>
								</div>
								{isNotesOpen ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-amber-500" />}
							</button>

							{isNotesOpen && (
								<div className="p-4 sm:p-5 pt-0 space-y-2 max-h-48 overflow-y-auto pr-1">
									{ticket.internalNotes.map((note, idx) => (
										<div
											key={idx}
											className={`p-3 border text-xs ${radiusClass} ${theme === "dark"
												? "bg-amber-950/20 border-amber-900/40 text-amber-200"
												: "bg-amber-100/50 border-amber-200 text-amber-900"
												}`}
										>
											<div className="flex justify-between items-center mb-1 font-bold">
												<span>{note.senderName}</span>
												<span className="opacity-60 text-[10px]">{formatDate(note.createdAt)}</span>
											</div>
											<p className="whitespace-pre-wrap leading-relaxed">{note.message}</p>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* 3. Nachrichten-Verlauf */}
					<div>
						<button
							onClick={() => setIsMessagesOpen(!isMessagesOpen)}
							className={`w-full p-4 flex items-center justify-between text-left transition-colors ${theme === "dark" ? "hover:bg-zinc-900/40" : "hover:bg-slate-50"
								}`}
						>
							<div className="flex items-center gap-2">
								<MessageCircle className="w-4 h-4 text-indigo-500" />
								<span className={`text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide ${theme === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
									Nachrichten ({ticket.messages?.length || 0})
								</span>
							</div>
							{isMessagesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
						</button>

						{isMessagesOpen && (
							<div className="p-4 sm:p-5 pt-0">
								<div className="space-y-3 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
									{ticket.messages?.length ? (
										ticket.messages.map((msg) => (
											<div
												key={msg.uid}
												className={`p-3 sm:p-3.5 border ${radiusClass} ${theme === "dark"
													? "bg-zinc-900/50 border-zinc-800"
													: "bg-slate-50 border-slate-200"
													}`}
											>
												<div className="flex items-center justify-between mb-2">
													<div className="flex items-center gap-2">
														<span className="font-bold text-xs sm:text-sm">{msg.senderName}</span>
														<span
															className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-['JetBrains_Mono'] font-bold uppercase border ${radiusClass} ${msg.senderRole === "staff"
																? theme === "dark"
																	? "bg-blue-950/40 text-blue-400 border-blue-900/50"
																	: "bg-blue-50 text-blue-700 border-blue-200"
																: theme === "dark"
																	? "bg-zinc-800 text-zinc-400 border-zinc-700"
																	: "bg-slate-200 text-slate-600 border-slate-300"
																}`}
														>
															{msg.senderRole === "staff" ? "Staff" : "Kunde"}
														</span>
													</div>
													<span className={`text-[10px] sm:text-[11px] font-['JetBrains_Mono'] ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
														{formatDate(msg.createdAt)}
													</span>
												</div>
												<p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${theme === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
													{msg.message}
												</p>
											</div>
										))
									) : (
										<p className={`text-xs text-center py-4 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
											Noch keine Nachrichten vorhanden.
										</p>
									)}
									<div ref={messagesEndRef} />
								</div>
							</div>
						)}
					</div>

					{/* 4. Antwort schreiben */}
					<div>
						<button
							onClick={() => setIsReplyOpen(!isReplyOpen)}
							className={`w-full p-4 flex items-center justify-between text-left transition-colors ${theme === "dark" ? "hover:bg-zinc-900/40" : "hover:bg-slate-50"
								}`}
						>
							<div className="flex items-center gap-2">
								<MessageSquarePlus className="w-4 h-4 text-emerald-500" />
								<span className={`text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide ${theme === "dark" ? "text-zinc-300" : "text-slate-600"}`}>
									Antwort schreiben
								</span>
							</div>
							{isReplyOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
						</button>

						{isReplyOpen && (
							<div className="p-4 sm:p-5 pt-0 space-y-3">
								<textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder="Schreiben Sie Ihre Nachricht..."
									rows={2}
									className={`w-full border px-3 py-2 text-xs sm:text-sm resize-none max-h-32 ${radiusClass} ${inputBgClass} focus:outline-none transition-colors`}
								/>
								<button
									onClick={handleSendMessage}
									disabled={loadingMessage || !message.trim()}
									className={`w-full px-3.5 py-2 sm:py-2.5 font-['JetBrains_Mono'] text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${radiusClass} ${loadingMessage || !message.trim()
										? "opacity-50 cursor-not-allowed"
										: "hover:opacity-90 active:opacity-95"
										} ${theme === "dark"
											? "bg-green-600/90 text-white border border-green-500/30 hover:bg-green-600"
											: "bg-green-600 text-white border border-green-500/50 hover:bg-green-700"
										}`}
								>
									{loadingMessage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
									Nachricht senden
								</button>
							</div>
						)}
					</div>

					{/* 5. Interne Notiz schreiben (Eigenes Accordion, Nur Staff) */}
					{isAdmin && (
						<div>
							<button
								onClick={() => setIsAddNoteOpen(!isAddNoteOpen)}
								className={`w-full p-4 flex items-center justify-between text-left transition-colors ${theme === "dark" ? "hover:bg-zinc-900/40" : "hover:bg-slate-50"
									}`}
							>
								<div className="flex items-center gap-2 text-amber-500">
									<FileLock2 className="w-4 h-4" />
									<span className="text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide">
										Interne Notiz hinzufügen
									</span>
								</div>
								{isAddNoteOpen ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-amber-500" />}
							</button>

							{isAddNoteOpen && (
								<div className="p-4 sm:p-5 pt-0 space-y-3">
									<textarea
										value={internalNote}
										onChange={(e) => setInternalNote(e.target.value)}
										placeholder="Nur für Staff sichtbar..."
										rows={2}
										className={`w-full border px-3 py-2 text-xs sm:text-sm resize-none max-h-28 ${radiusClass} ${inputBgClass} focus:outline-none transition-colors`}
									/>
									<button
										onClick={handleAddNote}
										disabled={loadingNote || !internalNote.trim()}
										className={`w-full px-3.5 py-2 font-['JetBrains_Mono'] text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${radiusClass} ${loadingNote || !internalNote.trim()
											? "opacity-50 cursor-not-allowed"
											: "hover:opacity-90 active:opacity-95"
											} ${theme === "dark"
												? "bg-amber-600/90 text-white border border-amber-500/30 hover:bg-amber-600"
												: "bg-amber-600 text-white border border-amber-500/50 hover:bg-amber-700"
											}`}
									>
										{loadingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
										Notiz Speichern
									</button>
								</div>
							)}
						</div>
					)}

				</div>
			</div>
		</div>
	);
}

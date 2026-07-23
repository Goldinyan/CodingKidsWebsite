"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { addTicket } from "@/lib/db/tickets";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { Send, Zap, AlertCircle } from "lucide-react";

export default function TicketForm({ onSubmit }: { onSubmit?: () => void }) {
	const { theme, isRounded } = useTheme();
	const { user, userData } = useAuth();
	const { showSuccessToast, showErrorToast } = useNotificationToast();

	const [form, setForm] = useState({
		subject: "",
		description: "",
		category: "general" as const,
		priority: "medium" as const,
	});

	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const categories = [
		{ value: "general", label: "Allgemein", icon: "◆" },
		{ value: "technical", label: "Technisch", icon: "⚙" },
		{ value: "billing", label: "Rechnung", icon: "💳" },
		{ value: "other", label: "Sonstiges", icon: "✦" },
	];

	const priorities = [
		{ value: "low", label: "Niedrig", color: "text-green-600 dark:text-green-400" },
		{ value: "medium", label: "Mittel", color: "text-amber-600 dark:text-amber-400" },
		{ value: "high", label: "Hoch", color: "text-orange-600 dark:text-orange-400" },
		{ value: "urgent", label: "Dringend", color: "text-red-600 dark:text-red-400" },
	];

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!form.subject.trim())
			newErrors.subject = "Betreff erforderlich";
		if (!form.description.trim())
			newErrors.description = "Beschreibung erforderlich";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate() || !user || !userData) return;

		setLoading(true);
		try {
			const ticketNumber = `TIC-${Math.random()
				.toString(36)
				.substr(2, 5)
				.toUpperCase()}`;

			await addTicket(
				{
					ticketNumber,
					userUid: user.uid,
					userName: userData.name,
					userEmail: userData.email,
					subject: form.subject,
					description: form.description,
					category: form.category,
					priority: form.priority,
					status: "new",
				},
				user.uid,
				userData.role
			);

			showSuccessToast("CREATE_SUCCESS");
			setForm({
				subject: "",
				description: "",
				category: "general",
				priority: "medium",
			});
			onSubmit?.();
		} catch (error) {
			showErrorToast(error, "GENERIC_ERROR");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`border p-6 transition-all ${isRounded ? "rounded-lg" : "rounded-none"} space-y-5 ${theme === "dark" ? "bg-[rgba(255,255,255,0.015)] border-zinc-900 hover:border-zinc-800" : "bg-white border-slate-200 hover:border-slate-300"}`}
		>
			<div className="flex items-center gap-3">
				<Zap
					className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
				/>
				<h3
					className={`text-lg font-black font-['Familjen_Grotesk'] tracking-wide uppercase ${theme === "dark" ? "text-white" : "text-slate-900"}`}
				>
					Neues Ticket
				</h3>
			</div>

			<div>
				<label
					className={`block text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide mb-1 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
				>
					Betreff *
				</label>
				<input
					type="text"
					value={form.subject}
					onChange={(e) =>
						setForm({ ...form, subject: e.target.value })
					}
					className={`w-full pl-2 border px-3.5 py-2.5 text-sm transition-colors ${isRounded ? "rounded-md" : "rounded-none"} ${errors.subject ? (theme === "dark" ? "border-red-900 bg-red-950/20" : "border-red-200 bg-red-50") : theme === "dark" ? "bg-zinc-950/50 border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300"} focus:outline-none`}
					placeholder="Kurze Zusammenfassung..."
				/>
				{errors.subject && (
					<p
						className={`text-xs mt-1.5 flex items-center gap-1.5 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
					>
						<AlertCircle className="w-3 h-3" />
						{errors.subject}
					</p>
				)}
			</div>

			<div>
				<label
					className={`block text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide mb-1 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
				>
					Beschreibung *
				</label>
				<textarea
					value={form.description}
					onChange={(e) =>
						setForm({ ...form, description: e.target.value })
					}
					rows={4}
					className={`w-full border pl-2 px-3.5 py-2.5 text-sm transition-colors resize-none ${isRounded ? "rounded-md" : "rounded-none"} ${errors.description ? (theme === "dark" ? "border-red-900 bg-red-950/20" : "border-red-200 bg-red-50") : theme === "dark" ? "bg-zinc-950/50 border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300"} focus:outline-none`}
					placeholder="Beschreiben Sie Ihr Anliegen..."
				/>
				{errors.description && (
					<p
						className={`text-xs mt-1.5 flex items-center gap-1.5 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
					>
						<AlertCircle className="w-3 h-3" />
						{errors.description}
					</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label
						className={`block text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide mb-1 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
					>
						Kategorie
					</label>
					<select
						value={form.category}
						onChange={(e) =>
							setForm({ ...form, category: e.target.value as any })
						}
						className={`w-full border pl-2 px-3.5 py-2.5 text-sm transition-colors ${isRounded ? "rounded-md" : "rounded-none"} ${theme === "dark" ? "bg-zinc-950/50 border-zinc-800 text-white focus:border-zinc-700" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-300"} focus:outline-none`}
					>
						{categories.map((cat) => (
							<option key={cat.value} value={cat.value}>
								{cat.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						className={`block text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wide mb-1 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
					>
						Priorität
					</label>
					<select
						value={form.priority}
						onChange={(e) =>
							setForm({ ...form, priority: e.target.value as any })
						}
						className={`w-full border pl-2 px-3.5 py-2.5 text-sm transition-colors ${isRounded ? "rounded-md" : "rounded-none"} ${theme === "dark" ? "bg-zinc-950/50 border-zinc-800 text-white focus:border-zinc-700" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-300"} focus:outline-none`}
					>
						{priorities.map((pri) => (
							<option key={pri.value} value={pri.value}>
								{pri.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<button
				type="submit"
				disabled={loading}
				className={`w-full px-4 py-2.5 font-['JetBrains_Mono'] text-sm font-bold uppercase flex items-center justify-center gap-2.5 transition-all ${isRounded ? "rounded-md" : "rounded-none"} ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:opacity-95"} ${theme === "dark" ? "bg-green-600/90 text-white border border-green-500/30 hover:bg-green-600" : "bg-green-600 text-white border border-green-500/50 hover:bg-green-700"}`}
			>
				<Send className="w-4 h-4" />
				{loading ? "Wird erstellt..." : "Ticket erstellen"}
			</button>
		</form>
	);
}

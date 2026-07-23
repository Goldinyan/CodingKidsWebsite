"use client";

import type { TicketData } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";
import StatusBadge from "./StatusBadge";
import {
	MessageSquare,
	User,
	Calendar,
	AlertCircle,
	Flame,
	Ticket,
} from "lucide-react";
import { useState } from "react";
import { toJsDate } from "@/BackEnd/utils";

interface TicketListProps {
	tickets: TicketData[];
	onTicketClick: (ticket: TicketData) => void;
	isAdmin?: boolean;
	loading?: boolean;
}

const priorityConfig = {
	low: { label: "Niedrig", color: "text-green-600 dark:text-green-400" },
	medium: { label: "Mittel", color: "text-amber-600 dark:text-amber-400" },
	high: { label: "Hoch", color: "text-orange-600 dark:text-orange-400" },
	urgent: { label: "Dringend", color: "text-red-600 dark:text-red-400" },
};

export default function TicketList({
	tickets,
	onTicketClick,
	isAdmin = false,
	loading = false,
}: TicketListProps) {
	const { theme, isRounded } = useTheme();
	const [expandedId, setExpandedId] = useState<string | null>(null);

	if (loading) {
		return (
			<div className="space-y-3">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className={`border p-4 ${isRounded ? "rounded-lg" : "rounded-none"} animate-pulse ${theme === "dark" ? "bg-zinc-900/20 border-zinc-900" : "bg-slate-50 border-slate-200"}`}
					>
						<div
							className={`h-4 ${isRounded ? "rounded" : "rounded-none"} w-1/2 ${theme === "dark" ? "bg-zinc-800" : "bg-slate-300"}`}
						></div>
					</div>
				))}
			</div>
		);
	}

	if (!tickets.length) {
		return (
			<div
				className={`border p-8 text-center ${isRounded ? "rounded-lg" : "rounded-none"} transition-all ${theme === "dark" ? "bg-[rgba(255,255,255,0.015)] border-zinc-900" : "bg-white border-slate-200"}`}
			>
				<Ticket
					className={`mx-auto mb-3 opacity-30 ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`}
					size={32}
				/>
				<p
					className={`font-['JetBrains_Mono'] text-xs font-bold uppercase mb-1 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
				>
					{isAdmin ? "Keine Tickets vorhanden" : "Keine Tickets erstellt"}
				</p>
				<p
					className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
				>
					{isAdmin
						? "Es wurden noch keine Support-Anfragen eingereicht."
						: "Du kannst ein neues Ticket über das Formular erstellen."}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{tickets.map((ticket) => {
				const expanded = expandedId === ticket.uid;
				const messageCount = ticket.messages?.length || 0;

				return (
					<div
						key={ticket.uid}
						className={`border transition-all overflow-hidden ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark" ? "bg-[rgba(255,255,255,0.015)] border-zinc-900 hover:border-zinc-800" : "bg-white border-slate-200 hover:border-slate-300"}`}
					>
						<div
							onClick={() => {
								setExpandedId(expanded ? null : ticket.uid);
								onTicketClick(ticket);
							}}
							className={`p-5 cursor-pointer transition-colors ${theme === "dark" ? "hover:bg-zinc-900/30" : "hover:bg-slate-50/50"}`}
						>
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-3 mb-2.5 flex-wrap">
										<span
											className={`font-['JetBrains_Mono'] font-bold text-xs uppercase tracking-wide ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
										>
											{ticket.ticketNumber}
										</span>
										<StatusBadge status={ticket.status} />
									</div>
									<h3
										className={`text-base font-black font-['Familjen_Grotesk'] tracking-wide line-clamp-1 mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
									>
										{ticket.subject}
									</h3>
									<p
										className={`text-sm line-clamp-2 leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}
									>
										{ticket.description}
									</p>
								</div>

								{messageCount > 0 && (
									<div
										className={`flex items-center gap-1.5 px-2.5 py-1 font-['JetBrains_Mono'] text-xs font-bold uppercase whitespace-nowrap ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark" ? "bg-zinc-900/50 text-zinc-300 border border-zinc-800" : "bg-slate-100 text-slate-600 border border-slate-200"}`}
									>
										<MessageSquare className="w-3.5 h-3.5" />
										{messageCount}
									</div>
								)}
							</div>

							<div
								className={`flex flex-wrap items-center gap-3 text-xs font-['JetBrains_Mono'] ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}
							>
								{isAdmin && ticket.assignedToName && (
									<div className="flex items-center gap-1.5">
										<User className="w-3.5 h-3.5" />
										<span className="font-bold">
											{ticket.assignedToName}
										</span>
									</div>
								)}
								<div className="flex items-center gap-1.5">
									<Calendar className="w-3.5 h-3.5" />
									{toJsDate(ticket.createdAt).toLocaleDateString(
										"de-DE",
										{
											month: "short",
											day: "numeric",
										}
									)}
								</div>
								{isAdmin && (
									<div
										className={`flex items-center gap-1.5 px-2 py-0.5 font-bold uppercase rounded-sm ${ticket.priority === "urgent" ? "bg-red-950/40 text-red-400 border border-red-900/50" : ticket.priority === "high" ? "bg-orange-950/40 text-orange-400 border border-orange-900/50" : ticket.priority === "medium" ? "bg-amber-950/40 text-amber-400 border border-amber-900/50" : "bg-green-950/40 text-green-400 border border-green-900/50"} ${theme === "dark" ? "" : "dark"}`}
									>
										<Flame className="w-3 h-3" />
										{priorityConfig[ticket.priority as keyof typeof priorityConfig]?.label ||
											ticket.priority}
									</div>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

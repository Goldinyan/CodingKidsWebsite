"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import type { TicketData } from "@/BackEnd/type";
import TicketList from "./components/TicketList";
import TicketDetail from "./components/TicketDetail";
import AdminControls from "./components/AdminControls";
import {
	Loader,
	Ticket,
	Search,
	RotateCcw,
	SlidersHorizontal,
	Activity,
	Terminal
} from "lucide-react";
import { useAppData } from "@/context/DataContext";

export default function AdminView() {
	const { theme, isRounded } = useTheme();
	const { loading } = useAuth();
	const { getTickets, refreshData } = useAppData();

	const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);

	const [filters, setFilters] = useState({
		status: "" as TicketData["status"] | "",
		priority: "" as TicketData["priority"] | "",
		search: "",
	});

	const statuses: TicketData["status"][] = ["new", "pending_staff", "pending_customer", "closed"];
	const priorities: TicketData["priority"][] = ["low", "medium", "high", "urgent"];

	const tickets = getTickets();
	const hasActiveFilters = Boolean(filters.search || filters.status || filters.priority);

	const filteredTickets = tickets.filter((ticket) => {
		if (filters.status && ticket.status !== filters.status) return false;
		if (filters.priority && ticket.priority !== filters.priority) return false;
		if (filters.search) {
			const search = filters.search.toLowerCase();
			return (
				ticket.ticketNumber.toLowerCase().includes(search) ||
				ticket.subject.toLowerCase().includes(search) ||
				ticket.userName.toLowerCase().includes(search) ||
				ticket.userEmail.toLowerCase().includes(search)
			);
		}
		return true;
	});

	const radiusClass = isRounded ? "rounded-lg" : "rounded-none";
	const containerClass = theme === "dark" ? "bg-black text-zinc-100" : "bg-slate-50 text-slate-900";
	const inputClass = theme === "dark"
		? "bg-zinc-900/50 border-zinc-800 focus:border-[#4ADE80] text-zinc-200 placeholder:text-zinc-600"
		: "bg-slate-50 border-slate-300 focus:border-emerald-500 text-slate-800 placeholder:text-slate-400";

	return (
		<div className={`min-h-screen  transition-colors duration-300 ${containerClass}`}>

			<div className="max-w-7xl mx-auto mb-6 flex items-center justify-between border-b border-zinc-800/60 pb-4">
				<div className="flex items-center gap-3">
					<div className={``}>
						<Ticket className={`w-5 h-5 ${theme === "dark" ? "text-[#4ADE80]" : "text-emerald-600"}`} />
					</div>
					<div>
						<h2 className="text-xl md:text-2xl font-black font-['Familjen_Grotesk'] tracking-wider uppercase">
							Support Ticket Verwaltung
						</h2>
					</div>
				</div>

				{loading && (
					<div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-zinc-400">
						<Loader size={14} className="animate-spin text-[#4ADE80]" />
						<span>SYNCING...</span>
					</div>
				)}
			</div>

			<div className={`w-full max-w-7xl mx-auto mb-6 ${theme === "dark" ? "bg-[rgba(255,255,255,0.015)] border-zinc-900" : "bg-white border-slate-200"}`}>
				<div className={`p-4 border transition-colors ${radiusClass} ${theme === "dark" ? " border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
					}`}>
					<div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-800/80">
						<div className="flex items-center gap-2 mb-4">
							<SlidersHorizontal className={`w-4 h-4 ${theme === "dark" ? "text-[#4ADE80]" : "text-emerald-600"}`} />
							<h3 className={`text-xs font-black font-['Familjen_Grotesk'] uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-slate-900"
								}`}>
								Filter
							</h3>
						</div>

						<div className={`font-['JetBrains_Mono'] mb-4 text-[10px] font-bold uppercase px-2 py-0.5 border ${radiusClass} ${theme === "dark" ? "bg-zinc-900 text-zinc-400 border-zinc-800" : "bg-slate-100 text-slate-600 border-slate-200"
							}`}>
							MATCHES // <span className={theme === "dark" ? "text-[#4ADE80]" : "text-emerald-600"}>{filteredTickets.length}</span> / {tickets.length}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
						<div className="space-y-1.5">
							<label className={`block font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
								}`}>
								SEARCH_QUERY
							</label>
							<div className="relative flex items-center">
								<Search className="w-3.5 h-3.5 absolute left-3 text-zinc-500 pointer-events-none" />
								<input
									type="text"
									value={filters.search}
									onChange={(e) => setFilters({ ...filters, search: e.target.value })}
									placeholder="ID, Betreff, User..."
									className={`w-full border pl-10 pr-3 py-1.5 text-xs font-['JetBrains_Mono'] transition-all focus:outline-none ${inputClass} ${radiusClass}`}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className={`block font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
								}`}>
								STATUS_FLAG
							</label>
							<select
								value={filters.status}
								onChange={(e) => setFilters({ ...filters, status: e.target.value as TicketData["status"] | "" })}
								className={`w-full border px-3 py-1.5 text-xs font-['JetBrains_Mono'] transition-all focus:outline-none cursor-pointer ${inputClass} ${radiusClass}`}
							>
								<option value="" className={theme === "dark" ? "bg-zinc-950 text-zinc-400" : "bg-white text-slate-600"}>
									ALL_STATUSES
								</option>
								{statuses.map((status) => (
									<option key={status} value={status} className={theme === "dark" ? "bg-zinc-900 text-zinc-200" : "bg-white text-slate-800"}>
										{status.toUpperCase()}
									</option>
								))}
							</select>
						</div>

						<div className="space-y-1.5">
							<label className={`block font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-slate-600"
								}`}>
								PRIORITY_LEVEL
							</label>
							<select
								value={filters.priority}
								onChange={(e) => setFilters({ ...filters, priority: e.target.value as "" | "low" | "medium" | "high" | "urgent" })}
								className={`w-full border pl-2 py-1.5 text-xs font-['JetBrains_Mono'] transition-all focus:outline-none cursor-pointer ${inputClass} ${radiusClass}`}
							>
								<option value="" className={theme === "dark" ? "bg-zinc-950 text-zinc-400" : "bg-white text-slate-600"}>
									ALL_PRIORITIES
								</option>
								{priorities.map((priority) => (
									<option key={priority} value={priority} className={theme === "dark" ? "bg-zinc-900 text-zinc-200" : "bg-white text-slate-800"}>
										{priority.toUpperCase()}
									</option>
								))}
							</select>
						</div>

						<div className="flex items-end">
							<button
								onClick={() => setFilters({ status: "", priority: "", search: "" })}
								disabled={!hasActiveFilters}
								className={`w-full py-1.5 px-3 font-['JetBrains_Mono'] text-xs font-bold uppercase border flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${radiusClass} ${hasActiveFilters
									? theme === "dark"
										? "bg-red-950/30 text-red-400 border-red-900/60 hover:bg-red-900/40 hover:border-red-500/80"
										: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
									: theme === "dark"
										? "bg-zinc-900/30 text-zinc-600 border-zinc-800/60 cursor-not-allowed opacity-50"
										: "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50"
									}`}
							>
								<RotateCcw className={`w-3.5 h-3.5 ${hasActiveFilters ? "animate-spin-once" : ""}`} />
								RESET_FILTERS
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

				<div className="lg:col-span-2">
					<div className={`p-5 border transition-colors ${radiusClass} ${theme === "dark" ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
						}`}>
						<div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800/60">
							<div className="flex items-center gap-2">
								<Terminal className={`w-4 h-4 ${theme === "dark" ? "text-[#4ADE80]" : "text-emerald-600"}`} />
								<h3 className={`text-xs font-black font-['Familjen_Grotesk'] uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-slate-900"
									}`}>
									QUEUED_TICKETS
								</h3>
							</div>
							<span className="font-['JetBrains_Mono'] text-[10px] text-zinc-500">
								COUNT: {filteredTickets.length}
							</span>
						</div>

						<TicketList
							tickets={filteredTickets}
							onTicketClick={(ticket) => {
								setSelectedTicket(ticket);
								setShowDetailModal(true);
							}}
							isAdmin={true}
							loading={loading}
						/>
					</div>
				</div>

				<div className="space-y-4">

					<div className={`p-4 border transition-colors ${radiusClass} ${theme === "dark" ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
						}`}>
						<div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-600/60">
							<Activity className={`w-4 h-4 ${theme === "dark" ? "text-[#4ADE80]" : "text-emerald-600"}`} />
							<h3 className={`text-xs font-black font-['Familjen_Grotesk'] uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-slate-900"
								}`}>
								SYS_METRICS
							</h3>
						</div>

						<div className="space-y-2 font-['JetBrains_Mono'] text-xs">
							<div className={`flex justify-between items-center py-1 border-b ${theme == "dark" ? "border-zinc-800" : "border-zinc-100"}`}>
								<span className={`${theme === "dark" ? "text-zinc-400" : "text-slate-600"} `}>TOTAL_ENTRIES:</span>
								<span className={`font-bold`}> {tickets.length}</span>
							</div>
							<div className={`flex justify-between items-center py-1 border-b  ${theme == "dark" ? "border-zinc-800" : "border-zinc-100"}`}>
								<span className={theme === "dark" ? "text-zinc-400" : "text-slate-600"}>STATUS_NEW:</span>
								<span className={`font-bold ${theme === "dark" ? "text-[#4ADE80]" : "text-emerald-600"}`}>
									{tickets.filter((t) => t.status === "new").length}
								</span>
							</div>
							<div className="flex justify-between items-center py-1">
								<span className={theme === "dark" ? "text-zinc-400" : "text-slate-600"}>FLAG_URGENT:</span>
								<span className="font-bold text-red-400">
									{tickets.filter((t) => t.priority === "urgent").length}
								</span>
							</div>
						</div>
					</div>


				</div >

			</div >

			{
				selectedTicket && showDetailModal && (
					<TicketDetail
						ticket={selectedTicket}
						onClose={() => {
							setShowDetailModal(false);
							setSelectedTicket(null);
						}}
						onUpdate={() => refreshData("tickets")}
						isAdmin={true}
					/>
				)
			}

		</div >
	);
}

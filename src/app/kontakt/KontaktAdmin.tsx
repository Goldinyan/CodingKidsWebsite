"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import type { TicketData } from "@/BackEnd/type";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import TicketDetail from "./components/TicketDetail";
import { Loader, Ticket } from "lucide-react";
import { useAppData } from "@/context/DataContext";

export default function KontaktAdmin() {
	const { theme, isRounded } = useTheme();
	const { getTickets, refreshData } = useAppData();
	const { loading } = useAuth();

	const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

	const tickets = getTickets();

	const radiusClass = isRounded ? "rounded-lg" : "rounded-none";
	const containerClass = theme === "dark" ? "bg-black" : "bg-white";

	useEffect(() => {
		if (selectedTicket) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [selectedTicket]);

	return (
		<>
			<div className={`min-h-screen transition-colors duration-300 ${containerClass}`}>
				<div className="border-b transition-colors duration-300">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-center mb-4 gap-3">
							<Ticket
								className={`w-5 h-5 ${theme === "dark" ? "text-[#4ADE80]" : "text-green-600"
									}`}
							/>
							<h2 className="text-2xl font-black font-gro tracking-wide uppercase">
								Meine Tickets
							</h2>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-1">
						<TicketForm onSubmit={() => refreshData("tickets")} />
					</div>

					<div className="lg:col-span-2">
						<div
							className={`border ${theme === "dark" ? "border-slate-700" : "border-slate-200"
								} p-6 ${radiusClass}`}
						>
							<div className="flex items-center justify-between mb-4">
								<h2
									className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"
										}`}
								>
									Deine Tickets
								</h2>
								{loading && <Loader size={20} className="animate-spin" />}
							</div>

							<TicketList
								tickets={tickets}
								onTicketClick={setSelectedTicket}
								loading={loading}
							/>
						</div>
					</div>
				</div>
			</div>

			{selectedTicket && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
					<TicketDetail
						ticket={selectedTicket}
						onClose={() => setSelectedTicket(null)}
						onUpdate={() => refreshData("tickets")}
					/>
				</div>
			)}
		</>
	);
}

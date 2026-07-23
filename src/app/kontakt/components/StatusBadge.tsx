"use client";

import type { TicketData } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";
import {
	CheckCircle2,
	AlertCircle,
	Clock,
	MessageCircle,
	Lock,
} from "lucide-react";

type TicketStatus = TicketData["status"];

const statusConfig: Record<
	string,
	{
		label: string;
		icon: React.ReactNode;
		lightBg: string;
		lightText: string;
		darkBg: string;
		darkText: string;
	}
> = {
	new: {
		label: "Neu",
		icon: <AlertCircle className="w-3.5 h-3.5" />,
		lightBg: "bg-blue-50",
		lightText: "text-blue-700",
		darkBg: "bg-blue-950/40",
		darkText: "text-blue-400",
	},
	open: {
		label: "Offen",
		icon: <Clock className="w-3.5 h-3.5" />,
		lightBg: "bg-amber-50",
		lightText: "text-amber-700",
		darkBg: "bg-amber-950/40",
		darkText: "text-amber-400",
	},
	pending_staff: {
		label: "Warte auf Staff",
		icon: <MessageCircle className="w-3.5 h-3.5" />,
		lightBg: "bg-orange-50",
		lightText: "text-orange-700",
		darkBg: "bg-orange-950/40",
		darkText: "text-orange-400",
	},
	pending_customer: {
		label: "Warte auf Kunde",
		icon: <MessageCircle className="w-3.5 h-3.5" />,
		lightBg: "bg-purple-50",
		lightText: "text-purple-700",
		darkBg: "bg-purple-950/40",
		darkText: "text-purple-400",
	},
	closed: {
		label: "Geschlossen",
		icon: <CheckCircle2 className="w-3.5 h-3.5" />,
		lightBg: "bg-green-50",
		lightText: "text-green-700",
		darkBg: "bg-green-950/40",
		darkText: "text-green-400",
	},
};

const fallbackConfig = {
	label: "Unbekannt",
	icon: <Lock className="w-3.5 h-3.5" />,
	lightBg: "bg-slate-50",
	lightText: "text-slate-700",
	darkBg: "bg-slate-950/40",
	darkText: "text-slate-400",
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
	const { theme, isRounded } = useTheme();

	const config = (status && statusConfig[status]) || fallbackConfig;
	const bgClass =
		theme === "dark" ? config.darkBg : config.lightBg;
	const textClass =
		theme === "dark" ? config.darkText : config.lightText;

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2 py-1 font-['JetBrains_Mono'] text-[10px] font-bold uppercase border ${isRounded ? "rounded-md" : "rounded-none"} transition-colors ${bgClass} ${textClass} ${theme === "dark" ? "border-white/10" : "border-slate-200"}`}
		>
			{config.icon}
			{config.label}
		</span>
	);
}

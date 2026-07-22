"use client";

import { motion } from "framer-motion";
import { Copy, Wifi, BookOpen, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import GlassCard from "../homepage/components/GlassCard";
import SectionHeading from "../homepage/components/SectionHeading";
import SectionLabel from "../homepage/components/SectionLabel";
import { useState } from "react";
import Link from "next/link";

const WLAN_DATA = {
	ssid: "Cubes-All",
	password: "wHX-c8mPh+72bz",
	location: "CUBES Wesel - Konferenzraum links im EG",
};

const GUIDES = [
	{
		id: "scratch-basics",
		icon: BookOpen,
		title: "Scratch Basics",
		description: "Lerne die Grundlagen von Scratch und erstelle dein erstes Programm.",
		color: "#4ade80",
		status: "available",
		href: "/ressources/guides/scratch-basics",
	},
	{
		id: "scratch-projects",
		icon: Zap,
		title: "Scratch Projekte",
		description: "Coole Projekt-Ideen: Spiele, Animationen und interaktive Geschichten.",
		color: "#a78bfa",
		status: "available",
		href: "/ressources/guides/scratch-projects",
	},
	{
		id: "html-css",
		icon: BookOpen,
		title: "HTML & CSS",
		description: "Baue deine erste Website von Grund auf mit HTML und CSS.",
		color: "#38bdf8",
		status: "available",
		href: "/ressources/guides/html-css",
	},
	{
		id: "python",
		icon: Zap,
		title: "Python Intro",
		description: "Einstieg in Python mit praktischen Beispielen und kleinen Spielen.",
		color: "#fb923c",
		status: "available",
		href: "/ressources/guides/python",
	},
];

export default function RessourcesView() {
	const { theme, isRounded } = useTheme();
	const isDark = theme === "dark";
	const [copiedPassword, setCopiedPassword] = useState(false);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopiedPassword(true);
		setTimeout(() => setCopiedPassword(false), 2000);
	};

	return (
		<div className="max-w-6xl px-4 md:px-6">
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="mb-16"
			>
				<h1
					className={`text-4xl md:text-5xl font-black font-gro tracking-medium leading-none mb-5 ${isDark ? "text-white" : "text-slate-900"
						}`}
				>
					Ressourcen.
					<br />
				</h1>
				<p
					className={`text-[20px] font-thin leading-relaxed max-w-md ${isDark ? "text-gray-400" : "text-slate-500"
						}`}
				>
					Alle wichtigen Informationen, Guides und Ressourcen für deine CoderDojo
					Reise an einem Ort.
				</p>
			</motion.div>

			<section className="mb-20">
				<SectionLabel>NETZWERK</SectionLabel>
				<SectionHeading>WLAN Verbindung</SectionHeading>

				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<GlassCard className="p-8 mt-4 max-w-3xl w-full border-green-400/20 hover:!border-green-400/40">
						<div className="flex flex-col gap-6">
							<div>
								<div className="flex items-center gap-3 mb-3">
									<div
										className={`w-10 h-10 flex items-center justify-center ${isRounded ? "rounded-xl" : "rounded-none"
											}`}
										style={{
											background: "rgba(74, 222, 128, 0.15)",
											border: "1px solid rgba(74, 222, 128, 0.30)",
										}}
									>
										<Wifi className="w-5 h-5 text-green-500" />
									</div>
									<div>
										<p
											className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-green-400" : "text-green-600"
												}`}
										>
											Netzwerkname
										</p>
										<p
											className={`text-2xl font-black font-gro ${isDark ? "text-white" : "text-slate-900"
												}`}
										>
											{WLAN_DATA.ssid}
										</p>
									</div>
								</div>
							</div>

							<div className="h-px w-full bg-white/10" />

							<div>
								<p
									className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-slate-400"
										}`}
								>
									Passwort
								</p>
								<div className="flex items-center gap-3">
									<code
										className={`flex-1 px-4 py-3 ${isRounded ? "rounded-lg" : "rounded-none"} font-mono text-sm font-bold break-all ${isDark
											? "bg-black/30 text-green-400 border border-white/10"
											: "bg-slate-100 text-green-700 border border-slate-200"
											}`}
									>
										{WLAN_DATA.password}
									</code>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => copyToClipboard(WLAN_DATA.password)}
										className={`px-4 py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider border transition-all ${isRounded ? "rounded-lg" : "rounded-none"
											} ${copiedPassword
												? isDark
													? "bg-green-500/20 text-green-400 border-green-500/50"
													: "bg-green-100 text-green-700 border-green-300"
												: isDark
													? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
													: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
											}`}
									>
										<Copy className="w-4 h-4" />
										{copiedPassword ? "Kopiert!" : "Kopieren"}
									</motion.button>
								</div>
							</div>

						</div>
					</GlassCard>
				</motion.div>
			</section>
			{/*
			<section className="mb-20">
				<div className="mb-10">
					<SectionLabel>LERNMATERIAL</SectionLabel>
					<SectionHeading>Guides & Tutorials</SectionHeading>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{GUIDES.map(({ id, icon: Icon, title, description, color, status, href }, i) => (
						<Link key={id} href={href || "#"}>
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.08, duration: 0.4 }}
							>
								<GlassCard
									className={`p-6 cursor-pointer h-full transition-all group ${isDark ? "hover:!border-[var(--hover-border)]" : "hover:!border-[var(--hover-border)]"
										}`}
									style={{
										"--hover-border": `${color}40`,
										"--hover-bg": `${color}06`,
									}}
								>
									<div className="flex flex-col gap-4 h-full">
										<div
											className={`w-10 h-10 flex items-center justify-center transition-colors ${isRounded ? "rounded-xl" : "rounded-none"
												}`}
											style={{
												background: `${color}15`,
												border: `1px solid ${color}30`,
											}}
										>
											<Icon className="w-5 h-5" style={{ color }} />
										</div>

										<div className="flex-1">
											<div
												className={`font-bold mb-1.5 font-gro ${isDark ? "text-white" : "text-slate-900"
													}`}
											>
												{title}
											</div>
											<p
												className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"
													}`}
											>
												{description}
											</p>
										</div>

										<div className="pt-2 flex justify-between items-center">
											{status === "available" && (
												<span
													className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 ${isRounded ? "rounded-full" : "rounded-none"
														}`}
													style={{
														background: `${color}15`,
														border: `1px solid ${color}30`,
														color: color,
													}}
												>
													Verfügbar
												</span>
											)}
										</div>
									</div>
								</GlassCard>
							</motion.div>
						</Link>
					))}
				</div>
			</section>

			<section className="mb-20">
				<GlassCard className={`p-8 border-purple-400/20 hover:!border-purple-400/40`}>
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
						<div>
							<p
								className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${isDark ? "text-purple-400" : "text-purple-600"
									}`}
							>
								💡 Tipp
							</p>
							<p
								className={`text-base font-medium ${isDark ? "text-gray-400" : "text-slate-700"
									}`}
							>
								Alle Guides sind kostenlos und für Anfänger geeignet. Arbeite in deinem
								eigenen Tempo und teile deine Projekte mit der Community!
							</p>
						</div>
						<div
							className={`px-4 py-3 ${isRounded ? "rounded-lg" : "rounded-none"} shrink-0 text-2xl`}
							style={{
								background: "rgba(168, 85, 247, 0.1)",
								border: "1px solid rgba(168, 85, 247, 0.2)",
							}}
						>
							🚀
						</div>
					</div>
				</GlassCard>

			</section>
			*/}
		</div>
	);
}

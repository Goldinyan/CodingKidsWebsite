"use client";

import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import GlassCard from "@/src/app/homepage/components/GlassCard";
import SectionLabel from "@/src/app/homepage/components/SectionLabel";
import { useRouter } from "next/navigation";

const PROJECTS = [
	{
		title: "Pong - Das klassische Spiel",
		description: "Ein einfaches Tennis-ähnliches Spiel",
		difficulty: "Anfänger",
		color: "#4ade80",
	},
	{
		title: "Flappy Bird Clone",
		description: "Ein Bird-Flying Spiel mit Hindernissen",
		difficulty: "Fortgeschrittene",
		color: "#a78bfa",
	},
	{
		title: "Quiz-Spiel",
		description: "Erstelle ein interaktives Quiz",
		difficulty: "Anfänger",
		color: "#38bdf8",
	},
	{
		title: "Tanzende Figuren",
		description: "Animiere Figuren mit Sound",
		difficulty: "Anfänger",
		color: "#fb923c",
	},
];

export default function ScratchProjectsGuide() {
	const { theme, isRounded } = useTheme();
	const isDark = theme === "dark";
	const router = useRouter();

	return (
		<div className={`w-full min-h-screen relative main-view-container transition-colors ${isDark ? "bg-black" : "bg-white"}`}>
			<div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
				{/* HEADER */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-16"
				>
					<SectionLabel>TUTORIAL</SectionLabel>
					<h1
						className={`text-4xl md:text-5xl font-black font-gro tracking-medium leading-none mb-4 ${isDark ? "text-white" : "text-slate-900"
							}`}
					>
						Scratch Projekte
					</h1>
					<p
						className={`text-lg font-thin leading-relaxed max-w-2xl ${isDark ? "text-gray-400" : "text-slate-600"
							}`}
					>
						Coole Projekt-Ideen für alle Levels. Von einfachen Anfänger-Projekten bis zu
						fortgeschrittenen Spielen.
					</p>
				</motion.div>

				{/* PROJECTS GRID */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
					{PROJECTS.map((project, idx) => (
						<motion.div
							key={project.title}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.08, duration: 0.4 }}
						>
							<GlassCard className="p-6 h-full cursor-pointer hover:scale-105 transition-transform">
								<div className="flex flex-col gap-4 h-full">
									{/* ICON */}
									<div
										className={`w-10 h-10 flex items-center justify-center ${isRounded ? "rounded-xl" : "rounded-none"
											}`}
										style={{
											background: `${project.color}15`,
											border: `1px solid ${project.color}30`,
										}}
									>
										<Gamepad2 className="w-5 h-5" style={{ color: project.color }} />
									</div>

									{/* CONTENT */}
									<div className="flex-1">
										<h3
											className={`font-bold font-gro mb-1 ${isDark ? "text-white" : "text-slate-900"
												}`}
										>
											{project.title}
										</h3>
										<p
											className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-slate-600"}`}
										>
											{project.description}
										</p>
									</div>

									{/* DIFFICULTY BADGE */}
									<div
										className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 w-fit ${isRounded ? "rounded-full" : "rounded-none"
											}`}
										style={{
											background: `${project.color}15`,
											border: `1px solid ${project.color}30`,
											color: project.color,
										}}
									>
										{project.difficulty}
									</div>
								</div>
							</GlassCard>
						</motion.div>
					))}
				</div>

				{/* INFO */}
				<GlassCard className="p-8 border-blue-400/20 mb-12">
					<p
						className={`text-base ${isDark ? "text-gray-400" : "text-slate-600"}`}
					>
						💡 <strong>Tipp:</strong> Beginne mit einfachen Projekten und steigere dich
						langsam. Fehler sind wichtig - sie helfen dir zu lernen!
					</p>
				</GlassCard>

				{/* BACK BUTTON */}
				<motion.div className="text-center">
					<button
						onClick={() => router.back()}
						className={`px-4 py-2 text-sm font-mono uppercase tracking-widest ${isDark
							? "text-gray-500 hover:text-gray-400"
							: "text-slate-500 hover:text-slate-600"
							}`}
					>
						← Zurück
					</button>
				</motion.div>
			</div>
		</div>
	);
}

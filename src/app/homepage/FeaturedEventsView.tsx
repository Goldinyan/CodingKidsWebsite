"use client";

import { useMemo } from "react";
import { EventData, CourseData } from "@/BackEnd/type";
import { ArrowRight, CalendarX2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toJsDate } from "@/BackEnd/utils";
import { useTheme } from "@/context/ThemeContext";
import SectionLabel from "./components/SectionLabel";
import SectionHeading from "./components/SectionHeading";
import GlassCard from "./components/GlassCard";
import { useAppData } from "@/context/DataContext";

const fmtMonth = (date: any) => {
	return toJsDate(date)
		.toLocaleDateString("de-DE", { month: "short" })
		.toUpperCase();
};

const fmtDay = (date: any) => {
	return toJsDate(date).toLocaleDateString("de-DE", { day: "2-digit" });
};

const fmtDate = (date: any) => {
	return toJsDate(date).toLocaleDateString("de-DE", {
		weekday: "short",
		day: "2-digit",
		month: "short",
	});
};

const spotsLeft = (event: EventData) => {
	const taken = (event.users?.length || 0) + (event.queue?.length || 0);
	return Math.max(0, event.memberCount - taken);
};

export default function FeaturedEventsView() {
	const { theme, isRounded } = useTheme();
	const isDark = theme === "dark";

	const { getEvents, getCourses, loadingStates } = useAppData();
	const router = useRouter();
	const rawEvents = getEvents();
	const rawCourses = getCourses();

	const courseMap = useMemo(() => {
		const map: Record<string, CourseData> = {};
		rawCourses.forEach((course) => {
			map[course.uid] = course;
		});
		return map;
	}, [rawCourses]);

	const validEvents = useMemo(() => {
		const now = Date.now();
		return [...rawEvents]
			.filter((ev) => toJsDate(ev.date).getTime() > now)
			.sort((a, b) => toJsDate(a.date).getTime() - toJsDate(b.date).getTime())
			.slice(0, 3);
	}, [rawEvents]);

	if (
		(loadingStates.events || loadingStates.courses) &&
		rawEvents.length === 0
	) {
		return (
			<section className="py-14 mx-4">
				<p className="text-2xl font-bold mb-8 font-mono animate-pulse uppercase text-xs">
					Synchronisiere Termine...
				</p>
			</section>
		);
	}

	return (
		<section className="py-14 ">
			<div className="flex items-end justify-between mb-8">
				<div>
					<SectionLabel>Nächste Termine</SectionLabel>
					<SectionHeading>Kommende CoderDojos</SectionHeading>
				</div>
				{/*{validEvents.length > 0 && (
          <button
            onClick={() => router.push("/termine")}
            className="hidden md:flex items-center gap-1 text-sm no-underline transition-colors text-purple-400 hover:text-purple-300 bg-transparent border-0 cursor-pointer font-medium"
          >
            Alle Termine <ArrowRight className="w-4 h-4" />
          </button>
        )}*/}
			</div>

			<div className="flex flex-col gap-3 mb-6">
				{validEvents.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						<div
							className={`flex flex-col items-center justify-center p-8 text-center border border-dashed ${isRounded ? "rounded-2xl" : "rounded-none"} ${isDark ? "border-white/10 bg-white/[0.01]" : "border-slate-200 bg-slate-50"}`}
						>
							<div
								className={`w-12 h-12 flex items-center justify-center ${isRounded ? "rounded-xl" : "rounded-none"} bg-purple-500/10 border border-purple-500/20 mb-4`}
							>
								<CalendarX2 className="w-6 h-6 text-purple-400" />
							</div>
							<h3
								className={`font-bold text-base font-grotesk mb-1 ${isDark ? "text-white" : "text-slate-900"}`}
							>
								Keine Termine geplant
							</h3>
							<p className="text-sm text-gray-500 max-w-sm leading-relaxed">
								Aktuell sind keine neuen CoderDojos in der Pipeline. Schau
								einfach bald wieder vorbei oder kontaktiere uns!
							</p>
						</div>
					</motion.div>
				)}

				{validEvents.slice(0, 5).map((ev, i) => {
					const left = spotsLeft(ev);
					const full = left <= 0;
					const course = courseMap[ev.course];
					return (
						<motion.div
							key={ev.uid}
							initial={{ opacity: 0, x: -12 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.06, duration: 0.4 }}
						>
							<GlassCard
								className={`flex items-center gap-4 p-5 hover:!border-purple-400/30 transition-colors ${full ? "opacity-60" : "opacity-100"}`}
							>
								{/* Date */}
								<div
									className={`shrink-0 border p-2.5 text-center w-14 ${isRounded ? "rounded-xl" : "rounded-none"} ${full
										? "bg-white/[0.02] border-white/[0.06]"
										: "bg-purple-500/[0.06] border-purple-500/20"
										}`}
								>
									<div className="text-[9px] tracking-widest font-mono text-gray-500">
										{fmtMonth(ev.date)}
									</div>
									<div
										className={`text-xl font-black leading-tight font-grotesk ${isDark ? "text-white" : "text-slate-900"}`}
									>
										{fmtDay(ev.date)}
									</div>
								</div>

								<div className="w-px h-9 shrink-0 bg-white/[0.07]" />

								<div className="flex-1 min-w-0">
									<div
										className={`font-semibold text-sm truncate font-grotesk ${isDark ? "text-white" : "text-slate-900"}`}
									>
										{ev.name}
									</div>
									<div className="text-[11px] mt-0.5 font-mono text-gray-500">
										{course?.name} · {fmtDate(ev.date)} · 18:00 Uhr
									</div>
								</div>

								<div className="shrink-0 flex items-center gap-3">
									{full ? (
										<span className="text-[10px] px-2 py-1 rounded-md hidden sm:inline font-mono bg-red-500/10 text-red-400">
											Ausgebucht
										</span>
									) : (
										<span className="text-[10px] hidden sm:inline font-mono text-gray-500">
											{left} Plätze frei
										</span>
									)}
									<button
										onClick={() => router.push("/termine")}
										className={`px-3 py-1.5 border text-xs font-medium bg-transparent transition-all font-mono ${isRounded ? "rounded-lg" : "rounded-none"} ${full
											? "bg-white/[0.03] border-white/[0.06] text-gray-500 cursor-not-allowed"
											: "bg-purple-500/[0.08] border-purple-500/25 text-purple-400 hover:bg-purple-500/15 cursor-pointer"
											}`}
									>
										Details
									</button>
								</div>
							</GlassCard>
						</motion.div>
					);
				})}
			</div>

			{validEvents.length > 0 && (
				<button
					onClick={() => router.push("/termine")}
					className={`w-full flex items-center justify-center gap-2 px-6 py-3 border font-medium text-xs no-underline transition-all bg-purple-500/[0.06] border-purple-500/20 text-purple-400 hover:bg-purple-500/12 cursor-pointer ${isRounded ? "rounded-xl" : "rounded-none"}`}
				>
					Alle Termine &amp; Anmeldung <ArrowRight className="w-4 h-4" />
				</button>
			)}
		</section>
	);
}

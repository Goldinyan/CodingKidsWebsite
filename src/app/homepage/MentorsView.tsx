"use client";

import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { SimpleMentorCard } from "../verein/mentor/SimpleMentorCard";
import SectionLabel from "./components/SectionLabel";
import SectionHeading from "./components/SectionHeading";
import { useAppData } from "@/context/DataContext";

export default function MentorsView() {
	const [expandedIndex, setExpandedIndex] = useState<number>(0);

	const { theme, isRounded } = useTheme();
	const isDark = theme === "dark";

	const { getMentors, loadingStates } = useAppData();
	const rawMentors = getMentors();

	const sortedMentors = useMemo(() => {
		return [...rawMentors].sort((a, b) => a.id - b.id);
	}, [rawMentors]);

	const orderedMentors = useMemo(() => {
		if (sortedMentors.length === 0) return [];

		const active = sortedMentors[expandedIndex] || sortedMentors[0];
		const rest = sortedMentors.filter((_, idx) => idx !== expandedIndex);

		return [active, ...rest];
	}, [sortedMentors, expandedIndex]);

	const expandMentor = (originalId: number): void => {
		setExpandedIndex(originalId);
	};

	if (loadingStates.mentors && (!rawMentors || rawMentors.length === 0)) {
		return (
			<div className="w-full px-8 py-16 transition-colors duration-300">
				<p
					className={`text-2xl font-bold mb-8 ${isDark ? "text-white" : "text-slate-900"}`}
				>
					Unsere Mentoren
				</p>
				<p className={isDark ? "text-gray-500" : "text-slate-500"}>Lädt...</p>
			</div>
		);
	}
	const containerVariants = {
		hidden: {},
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.06, //zwischen den children
				delayChildren: 0.05, // vor dem ersten
			},
		},
	};

	const itemVariants = {
		hidden: {
			scale: 0.95,
			y: 30, // Startet tiefer im Bildschirm
		},
		visible: {
			scale: 1,
			y: 0,
			transition: {
				type: "tween",
				ease: "easeOut", // Schnell starten, abrupt stoppen
				duration: 0.25, // Schön knackig kurz
			},
		},
	};
	return (
		<div className={`w-full py-20 transition-colors duration-300 `}>
			<div className="flex items-end justify-between mb-10">
				<div>
					<SectionLabel>Das Team</SectionLabel>
					<SectionHeading>Unser Vorstand</SectionHeading>
				</div>
			</div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				exit="hidden"
				viewport={{ once: false, margin: "0px 0px -50px 0px" }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
			>
				{sortedMentors.slice(0, 3).map((mentor) => (
					<motion.div
						key={mentor.uid}
						variants={itemVariants as Variants}
						layout="position"
					>
						<SimpleMentorCard
							props={{
								uid: "0",
								id: 0,
								name: mentor.name,
								role: mentor.role,
								des: mentor.des,
								insta: mentor.insta,
								github: mentor.github,
								linkedin: mentor.linkedin,
								pic: mentor.pic,
							}}
						/>
					</motion.div>
				))}
			</motion.div>
		</div>
	);
}

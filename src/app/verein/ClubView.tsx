"use client";

import WerWirSind from "./WerWirSind";
import Partners from "./Partners";
import Support from "./Support";
import { useTheme } from "@/context/ThemeContext";

export default function ClubViews() {
	const { theme } = useTheme();

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
		>
			<div className="max-w-7xl mx-auto px-4  pt-2 pb-20 relative">
				<section id="wir" className={`border-b transition-colors  duration-300 ${theme === "dark" ? "border-white/10" : "border-slate-200"}`}>
					<WerWirSind />
				</section>
				<section className={` border-b transition-colors duration-300 ${theme === "dark" ? "border-white/10" : "border-slate-200"}`}>
					<Partners
					/>
				</section>
				<section id="mitglied" className={` transition-colors duration-300`}>
					<Support />
				</section>
			</div>
		</div>
	);
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const { theme, toggleTheme, isRounded, toggleRounded } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [expanded, setExpanded] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const handleClick = (e: React.MouseEvent) => {
		// Falls es ein Rechtsklick oder das ContextMenu-Event ist
		if (e.type === "contextmenu" || e.button === 2) {
			e.preventDefault(); // verindert das Browser-Kontextmenü

			setExpanded(!expanded);
			return;
		}

		// wenn links
		toggleTheme();
	};

	return (
		<button className="fixed bottom-6 right-6 z-100 group">
			<div className="absolute inset-0 rounded-full bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-md border border-border/90 group-hover:border-border/99 transition-all duration-300" />

			<div
				onClick={(e) => {
					e.stopPropagation(); // Verhindert, dass der Klick das Theme toggelt
					toggleRounded();
					/*setExpanded(false);*/
				}}
				className={` rounded-full transition-all flex items-center justify-center duration-300 ease-in-out ${expanded
					? "w-14 h-14 -mb-2 opacity-100 scale-100 border border-border/90"
					: "w-0 h-0 opacity-0 scale-75"
					}`}
			>
				{expanded && (
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="4"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={`transition-all duration-300 cursor-pointer ${theme == "dark" ? "text-white" : "text-gray-800"}`}
					>
						<path
							d={
								isRounded
									? "M 2,2 L 14,2 A 8,8 0 0 1 22,10 L 22,22" // Maximierte runde Kurve
									: "M 2,2 L 22,2 L 22,22" // Maximierte harte Ecke
							}
							className="transition-all duration-300"
						/>
					</svg>
				)}
			</div>
			<div
				onClick={handleClick} // Fängt Linksklick ab
				onContextMenu={handleClick} // fängt Rechtsklick ab
				className="relative flex items-center justify-center h-14 w-14 rounded-full"
			>
				<Sun
					size={24}
					className={`absolute transition-all duration-500 transform ${theme === "light"
						? "opacity-100 scale-100 rotate-0"
						: "opacity-0 scale-0 rotate-90"
						} text-amber-500`}
				/>

				<Moon
					size={24}
					className={`absolute transition-all duration-500 transform ${theme === "dark"
						? "opacity-100 scale-100 rotate-0"
						: "opacity-0 scale-0 -rotate-90"
						} text-slate-300`}
				/>
			</div>

			<div className="absolute inset-0 rounded-full bg-accent/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
		</button>
	);
}

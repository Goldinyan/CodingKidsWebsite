"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { USER_ROLES_ARRAY, UserRole } from "@/BackEnd/type";

export function NewAnnouncementDialog(props: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	value: { title: string; content: string; tag: UserRole };
	onChange: (next: { title: string; content: string; tag: UserRole }) => void;
	onCreate: () => void;
}) {
	const { open, onOpenChange, value, onChange, onCreate } = props;
	const { theme, isRounded } = useTheme();

	const isDark = theme === "dark";
	const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={`max-w-lg border p-6 transition-colors duration-200 focus:outline-none ${radiusClass} ${isDark
					? "bg-zinc-950 border-zinc-800 text-white"
					: "bg-white border-slate-200 text-slate-900 shadow-xl"
					}`}
			>
				<DialogHeader className="mb-4">
					<DialogTitle className="text-2xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase">
						NEUE_ANKÜNDIGUNG_ERSTELLEN
					</DialogTitle>
					<DialogDescription
						className={`font-['JetBrains_Mono'] text-[11px] tracking-wide uppercase mt-1 ${isDark ? "text-zinc-400" : "text-slate-500"
							}`}
					>
						Eintrag konfigurieren, um globale System-Mitteilungen in den Feed einzufügen.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 font-['JetBrains_Mono']">
					<div>
						<label
							className={`block text-[10px] tracking-wider uppercase mb-1.5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}
						>
							TITEL *
						</label>
						<input
							type="text"
							placeholder="Z.B. SYSTEM_WARTUNG_UPDATE"
							value={value.title}
							onChange={(e) => onChange({ ...value, title: e.target.value })}
							className={`w-full px-3 py-2 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${isDark
								? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
								: "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
								}`}
						/>
					</div>

					<div>
						<label
							className={`block text-[10px] tracking-wider uppercase mb-1.5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}
						>
							ZIELGRUPPE
						</label>
						<select
							value={value.tag}
							onChange={(e) =>
								onChange({ ...value, tag: e.target.value as UserRole })
							}
							className={`w-full px-3 py-2 text-xs border focus:outline-none focus:border-green-600 transition-colors cursor-pointer ${radiusClass} ${isDark
								? "bg-zinc-900 border-zinc-800 text-white"
								: "bg-slate-50 border-slate-200 text-slate-900"
								}`}
						>
							{USER_ROLES_ARRAY.map((role) => (
								<option
									key={role}
									value={role}
									className={
										isDark
											? "bg-zinc-950 text-white"
											: "bg-white text-slate-900"
									}
								>
									{role.toUpperCase()}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							className={`block text-[10px] tracking-wider uppercase mb-1.5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}
						>
							INHALT
						</label>
						<textarea
							placeholder="SYSTEM_MITTEILUNG HIER EINGEBEN..."
							value={value.content}
							onChange={(e) => onChange({ ...value, content: e.target.value })}
							rows={4}
							className={`w-full px-3 py-2 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 resize-none transition-colors ${radiusClass} ${isDark
								? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
								: "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
								}`}
						/>
					</div>
				</div>

				<DialogFooter className="flex flex-row gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 justify-end mt-4">
					<button
						onClick={() => onOpenChange(false)}
						className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${isDark
							? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
							: "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
							}`}
					>
						<X className="w-3.5 h-3.5" />
						ABBRECHEN
					</button>
					<button
						onClick={onCreate}
						className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} bg-green-600 hover:bg-green-700 shadow-sm`}
					>
						<Plus className="w-3.5 h-3.5 stroke-[2]" />
						ERSTELLEN
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Trash2, Play, MoreVertical, RotateCcw, Bookmark } from "lucide-react";
import type { EventDataPreset } from "@/BackEnd/type";

interface PresetDropdownProps {
	presets: EventDataPreset[];
	onApply: (preset: EventDataPreset) => void;
	onDelete: (presetName: string) => void;
	onReset: () => void;
	showSavePresetBtn?: boolean;
	onOpenSavePresetModal?: () => void;
}

export function PresetDropdown({
	presets,
	onApply,
	onDelete,
	onReset,
	showSavePresetBtn,
	onOpenSavePresetModal,
}: PresetDropdownProps) {
	const [openPreset, setOpenPreset] = useState<string | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setOpenPreset(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			className="mb-4 flex items-center gap-2 p-2 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5 relative"
			ref={dropdownRef}
		>
			<Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
			<span className="text-[11px] font-medium font-['JetBrains_Mono'] text-purple-600 dark:text-purple-300 mr-1 uppercase shrink-0">
				Presets:
			</span>

			<div className="flex gap-2 flex-1 overflow-x-auto pb-0.5">
				{presets.map((preset) => {
					const isOpen = openPreset === preset.presetName;

					return (
						<div key={preset.presetName} className="relative inline-block shrink-0">
							<button
								type="button"
								onClick={() => setOpenPreset(isOpen ? null : preset.presetName)}
								className="text-[11px] font-['JetBrains_Mono'] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-white hover:border-purple-400 dark:hover:border-purple-500 transition-all flex items-center gap-1.5"
							>
								{preset.presetName}
								<MoreVertical className="w-3 h-3 opacity-60" />
							</button>

							{isOpen && (
								<div className="absolute left-0 mt-1.5 w-32 rounded-md bg-white border border-slate-200 shadow-lg dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-xl z-50 overflow-hidden py-1">
									<button
										type="button"
										onClick={() => {
											onApply(preset);
											setOpenPreset(null);
										}}
										className="w-full text-left px-3 py-1.5 text-xs font-['JetBrains_Mono'] text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 flex items-center gap-2"
									>
										<Play className="w-3 h-3 text-green-600 dark:text-green-400" />
										Benutzen
									</button>
									<button
										type="button"
										onClick={() => {
											onDelete(preset.presetName);
											setOpenPreset(null);
										}}
										className="w-full text-left px-3 py-1.5 text-xs font-['JetBrains_Mono'] text-red-600 hover:text-red-700 hover:bg-red-500/10 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2"
									>
										<Trash2 className="w-3 h-3" />
										Löschen
									</button>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Rechte Seite: Speichern & Reset */}
			<div className="flex items-center gap-1.5 ml-auto shrink-0">
				{showSavePresetBtn && (
					<button
						type="button"
						onClick={onOpenSavePresetModal}
						className="text-[11px] font-['JetBrains_Mono'] px-2 py-1 rounded bg-green-600 hover:bg-green-500 text-white transition-all flex items-center gap-1 uppercase tracking-wider"
					>
						<Bookmark className="w-3 h-3" />
						Speichern
					</button>
				)}

				<button
					type="button"
					onClick={onReset}
					title="Formular zurücksetzen"
					className="text-[11px] font-['JetBrains_Mono'] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:border-zinc-700 transition-all flex items-center gap-1"
				>
					<RotateCcw className="w-3 h-3 text-purple-600 dark:text-purple-400" />
					Reset
				</button>
			</div>
		</div>
	);
}

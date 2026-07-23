"use client";

import { motion } from "framer-motion";
import { Bookmark, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SavePresetModalProps {
	isOpen: boolean;
	presetName: string;
	setPresetName: (val: string) => void;
	isSaving: boolean;
	theme: string;
	roundedClass: string;
	onClose: () => void;
	onConfirm: () => void;
}

export function SavePresetModal({
	isOpen,
	presetName,
	setPresetName,
	isSaving,
	theme,
	roundedClass,
	onClose,
	onConfirm,
}: SavePresetModalProps) {
	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			className={`absolute inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md ${theme === "dark" ? "bg-black/90" : "bg-white/90"
				}`}
		>
			<div
				className={`w-full max-w-md p-6 border ${roundedClass} ${theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200 shadow-2xl"
					}`}
			>
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-2">
						<Bookmark className="w-4 h-4 text-green-500" />
						<h3 className={`text-lg font-bold font-['Familjen_Grotesk'] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
							Als Preset speichern
						</h3>
					</div>
					<button
						onClick={onClose}
						className={`p-1 transition-colors ${theme === "dark" ? "text-zinc-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				<p className={`text-xs mb-4 ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
					Vergib einen Namen für dieses Preset, um es später im Formular schnell wiederzuverwenden.
				</p>

				<div className="grid gap-1.5 mb-6">
					<Label className={`text-[10px] font-bold tracking-wider font-['JetBrains_Mono'] uppercase ${theme === "dark" ? "text-zinc-400" : "text-slate-600"}`}>
						Preset-Name *
					</Label>
					<Input
						autoFocus
						className={`${roundedClass} px-4 py-2 text-sm border focus:outline-none ${theme === "dark" ? "bg-black border-zinc-800 text-white focus:border-green-500/50" : "bg-white border-slate-200 text-slate-900 focus:border-green-500"
							}`}
						placeholder="z.B. Standard Scratch Workshop"
						value={presetName}
						onChange={(e) => setPresetName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") onConfirm();
						}}
					/>
				</div>

				<div className="flex gap-3">
					<Button type="button" variant="outline" onClick={onClose} className={`flex-1 font-['JetBrains_Mono'] text-xs uppercase ${roundedClass}`}>
						Abbrechen
					</Button>
					<Button
						type="button"
						disabled={!presetName.trim() || isSaving}
						onClick={onConfirm}
						className={`flex-1 font-['JetBrains_Mono'] text-xs uppercase bg-green-600 hover:bg-green-700 text-white ${roundedClass}`}
					>
						{isSaving ? "Speichert..." : "Speichern"}
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

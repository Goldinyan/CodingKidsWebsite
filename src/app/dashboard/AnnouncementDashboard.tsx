"use client";

import {
	addAnnouncement,
	deleteAnnouncement,
	updateAnnouncement,
} from "@/lib/db/announcements";
import type { AnnouncementData, UserRole } from "@/BackEnd/type";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Timestamp } from "firebase/firestore";
import {
	useAnnouncementsData,
	useFilteredAnnouncements,
	useUserIsAdmin,
} from "./announcements/hooks";
import {
	AnnouncementCard,
	DeleteAnnouncementDialog,
	EditAnnouncementDialog,
	NewAnnouncementDialog,
} from "./announcements/components";
import { useAppData } from "@/context/DataContext";

export default function AnnouncementDashboard() {
	const [isAddingAnnouncement, setIsAddingAnnouncement] =
		useState<boolean>(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [searchBar, setSearchBar] = useState<string>("");
	const { user, userRole } = useAuth();
	const { theme, isRounded } = useTheme();
	const userIsAdmin = useUserIsAdmin(user?.uid);

	const { refreshData } = useAppData();

	const { announcements } = useAnnouncementsData();
	const filteredAnnouncements = useFilteredAnnouncements(
		announcements,
		searchBar,
	);

	const [editValues, setEditValues] = useState<{
		title: string;
		content: string;
	}>({ title: "", content: "" });
	const [newAnnouncement, setNewAnnouncement] = useState<{
		title: string;
		content: string;
		tag: UserRole;
	}>({
		title: "",
		content: "",
		tag: "user",
	});
	const [deleteConfirm, setDeleteConfirm] = useState<{
		isOpen: boolean;
		announcementId: string | null;
		announcementTitle: string | null;
	}>({
		isOpen: false,
		announcementId: null,
		announcementTitle: null,
	});

	const isDark = theme === "dark";
	const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

	const handleAddAnnouncement = async () => {
		if (!user || !newAnnouncement.title.trim()) return;

		setIsAddingAnnouncement(false);

		const announcementToAdd: AnnouncementData = {
			uid: "", // Wird von Firestore beim Adden generiert
			title: newAnnouncement.title,
			content: newAnnouncement.content,
			tag: newAnnouncement.tag,
			authorUid: user.uid,
			authorName: user.displayName || "Unknown",
			date: Timestamp.fromDate(new Date()),
		};

		await addAnnouncement(announcementToAdd, user.uid, userRole);

		await refreshData("announcements");

		setIsAddingAnnouncement(false);
		setNewAnnouncement({ title: "", content: "", tag: "user" });
	};

	const handleEditStart = (announcement: AnnouncementData) => {
		setEditingId(announcement.uid);
		setEditValues({
			title: announcement.title,
			content: announcement.content,
		});
	};

	const handleSaveEdit = async (uid: string) => {
		await updateAnnouncement(
			uid,
			{ title: editValues.title, content: editValues.content },
			user?.uid || "anonymous",
			userRole,
		);

		await refreshData("announcements");

		setEditingId(null);
		setEditValues({ title: "", content: "" });
	};

	const handleDelete = async (uid: string) => {
		await deleteAnnouncement(uid, user?.uid || "anonymous", userRole);

		await refreshData("announcements");

		setDeleteConfirm({
			isOpen: false,
			announcementId: null,
			announcementTitle: null,
		});
	};

	return (
		<div
			className={`w-full p-6 min-h-screen transition-colors duration-200 ${isDark ? "text-white" : "text-slate-900"
				}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
					<div>
						<h1
							className={`md:text-4xl text-3xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase ${isDark ? "text-white" : "text-slate-900"}`}
						>
							ANKÜNDIGUNGEN
						</h1>
						<p
							className={`font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase mt-1 ${isDark ? "text-zinc-500" : "text-slate-400"}`}
						>
							System-Mitteilungen und globale Feeds für registrierte Benutzer
							verwalten
						</p>
					</div>

					<div
						className={`px-3 py-1.5 border border-dashed font-['JetBrains_Mono'] text-[10px] tracking-wider uppercase ${radiusClass} ${isDark
							? "bg-zinc-900 border-zinc-800 text-zinc-400"
							: "bg-white border-slate-200 text-slate-500 shadow-sm"
							}`}
					>
						EINTRÄGE: {String(filteredAnnouncements.length).padStart(2, "0")}
					</div>
				</div>

				{/* SEARCH AND CONTROL BAR */}
				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex-1 relative font-['JetBrains_Mono']">
						<Search
							className={`absolute left-3 top-3.5 w-4 h-4 ${isDark ? "text-zinc-600" : "text-slate-400"}`}
						/>
						<input
							type="text"
							placeholder="ANKÜNDIGUNGEN DURCHSUCHEN..."
							value={searchBar}
							onChange={(e) => setSearchBar(e.target.value)}
							className={`w-full pl-10 pr-4 py-2.5 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${isDark
								? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
								: "bg-white border-slate-200 text-slate-900 placeholder-slate-300 shadow-sm"
								}`}
						/>
					</div>

					{userIsAdmin && (
						<button
							onClick={() => setIsAddingAnnouncement(true)}
							className={`px-5 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} bg-green-600 hover:bg-green-700 shadow-sm`}
						>
							<Plus className="w-4 h-4 stroke-[2]" />
							NEUE ANKÜNDIGUNG
						</button>
					)}
				</div>

				<motion.div
					variants={{
						hidden: {},
						visible: { transition: { staggerChildren: 0.04 } },
					}}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid gap-4 md:grid-cols-1 lg:grid-cols-2"
				>
					{filteredAnnouncements.length === 0 ? (
						<div
							className={`col-span-full text-center py-16 border border-dashed ${radiusClass} ${isDark ? "border-zinc-800 bg-zinc-900/20" : "border-slate-200 bg-white shadow-sm"}`}
						>
							<p
								className={`font-['JetBrains_Mono'] text-xs tracking-wider uppercase ${isDark ? "text-zinc-500" : "text-slate-400"}`}
							>
								{searchBar
									? "ERR_NO_MATCH: KEINE ANKÜNDIGUNGEN GEFUNDEN"
									: "EMPTY_MATRIX: KEINE ANKÜNDIGUNGEN VORHANDEN"}
							</p>
						</div>
					) : (
						filteredAnnouncements.map((announcement, idx) => (
							<motion.div
								key={announcement.uid}
								variants={{
									hidden: { y: 15, opacity: 0 },
									visible: { y: 0, opacity: 1 },
								}}
								transition={{ type: "spring", stiffness: 350, damping: 30 }}
							>
								<AnnouncementCard
									announcement={announcement}
									userIsAdmin={userIsAdmin}
									onEdit={() => handleEditStart(announcement)}
									onDelete={() =>
										setDeleteConfirm({
											isOpen: true,
											announcementId: announcement.uid,
											announcementTitle: announcement.title,
										})
									}
								/>
							</motion.div>
						))
					)}
				</motion.div>
			</div>

			<NewAnnouncementDialog
				open={isAddingAnnouncement}
				onOpenChange={setIsAddingAnnouncement}
				value={newAnnouncement}
				onChange={setNewAnnouncement}
				onCreate={handleAddAnnouncement}
			/>

			<EditAnnouncementDialog
				open={editingId !== null}
				onOpenChange={(open) => {
					if (!open) setEditingId(null);
				}}
				value={editValues}
				onChange={setEditValues}
				onCancel={() => {
					setEditingId(null);
					setEditValues({ title: "", content: "" });
				}}
				onSave={() => {
					if (editingId) handleSaveEdit(editingId);
				}}
			/>

			<DeleteAnnouncementDialog
				open={deleteConfirm.isOpen}
				title={deleteConfirm.announcementTitle}
				onOpenChange={(open) =>
					setDeleteConfirm({
						isOpen: open,
						announcementId: open ? deleteConfirm.announcementId : null,
						announcementTitle: open ? deleteConfirm.announcementTitle : null,
					})
				}
				onConfirm={() => {
					if (deleteConfirm.announcementId)
						handleDelete(deleteConfirm.announcementId);
				}}
			/>
		</div>
	);
}

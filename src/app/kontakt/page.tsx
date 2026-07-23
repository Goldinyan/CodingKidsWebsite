"use client";

import { useAuth } from "@/context/AuthContext";
import NoUserKontakt from "./NoUserKontakt";
import KontaktAdmin from "./KontaktAdmin";
import AdminView from "./AdminView";
import { useTheme } from "@/context/ThemeContext";
import AnnouncementView from "./AnnouncementView";

export default function Home() {
	const { user, loading, userRole } = useAuth();
	const { theme } = useTheme();

	if (loading) {
		return (
			<div
				className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-white"
					}`}
			>
				<div
					className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
						}`}
				>
					Lädt...
				</div>
			</div>
		);
	}

	if (!user) return <NoUserKontakt />;


	// Show user view for regular users, members
	return (
		<div className={`pt-20 ${theme === "dark" ? "bg-black" : "bg-white"} transition-colors duration-300`}>
			<div className={`flex flex-col gap-12 max-w-7xl mx-auto px-4`}>
				<AnnouncementView />
				{userRole === "admin" ?
					<AdminView />
					:
					<KontaktAdmin />
				}
			</div>
		</div>
	)
}


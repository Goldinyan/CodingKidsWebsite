"use client";

import Image from "next/image";
import logoTransparent from "@/public/Logo_aussen_Transparent.png";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAuth } from "@/context/AuthContext";
import {
	User,
	MessageCircle,
	Mail,
	Menu,
	X,
	LayoutDashboard,
	BookOpen,
} from "lucide-react";
import NavbarMobile from "./NavbarMobile";
import { useTheme, Theme } from "@/context/ThemeContext";
import { useAppData } from "@/context/DataContext";
import { AnnouncementData, UserRole } from "@/BackEnd/type";

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const { user, userRole } = useAuth();
	const router = useRouter();
	const { theme, isRounded } = useTheme();

	const { getAnnouncements } = useAppData();

	const rawAnnouncements = getAnnouncements();

	const availableForUser = (announcement: AnnouncementData, userRole: UserRole) => {
		switch (announcement.tag) {
			case "anonymous":
				return true;
			case "user":
				return userRole === "user" || userRole === "member" || userRole === "mentor" || userRole === "admin";
			case "member":
				return userRole === "member" || userRole === "mentor" || userRole === "admin";
			case "mentor":
				return userRole === "mentor" || userRole === "admin";
			case "admin":
				return userRole === "admin";
			default:
				return false;
		}
	}


	const unreadMessagesCount = useMemo(() => {
		if (!user) return 0;
		return rawAnnouncements.filter(
			(announcement) =>
				(!announcement.readBy || !announcement.readBy.includes(user.uid)) && availableForUser(announcement, userRole)
		).length;
	}, [rawAnnouncements, user]);

	// Scrollen im Hintergrund bei offener mobiler Navbar verhindern
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<>
			<div
				className={`w-full fixed top-0 left-0 z-50 border-b transition-all duration-300 backdrop-blur-xl h-14 flex items-center ${theme === "dark"
					? "bg-black/20 border-white/10"
					: "bg-white/40 border-slate-200/80"
					}`}
			>
				<div className="w-full max-w-7xl px-4 mx-auto flex items-center justify-between  relative">
					<div
						className="flex items-center gap-2 cursor-pointer select-none"
						onClick={() => {
							router.push("/");
							setOpen(false);
						}}
					>
						<Image
							src={logoTransparent}
							alt="Logo"
							className="w-9 h-9 object-contain"
						/>
						<div className="flex flex-col justify-center">
							<span
								className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-black"}`}
							>
								Coding Kids
							</span>
							<span className="text-[11px] text-zinc-400 font-light -mt-0.5 hidden sm:inline">
								Niederrhein
							</span>
						</div>
					</div>

					<MainHeader theme={theme} router={router} isRounded={isRounded} />

					<div className="hidden md:flex items-center gap-2">
						{user && (
							<div className="relative">
								<button
									onClick={() => router.push("/kontakt")}
									className={`p-2 transition-all duration-200 ${isRounded ? "rounded-md" : "rounded-none"
										} ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-900 hover:text-black hover:bg-black/10"}`}
								>
									<MessageCircle className="w-5 h-5" />
								</button>
								{unreadMessagesCount > 0 && (
									<span
										className={`absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 rounded-full scale-75 ${theme === "dark"
											? "bg-white text-black"
											: "bg-black text-white"
											}`}
									>
										{unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
									</span>
								)}
							</div>
						)}

						{!user && (
							<button
								onClick={() => router.push("/kontakt")}
								className={`p-2 transition-all duration-200 ${isRounded ? "rounded-md" : "rounded-none"
									} ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-900 hover:text-black hover:bg-black/10"}`}
							>
								<Mail className="w-5 h-5" />
							</button>
						)}

						<button
							onClick={() => router.push("/ressources")}
							className={`p-2 transition-all duration-200 ${isRounded ? "rounded-md" : "rounded-none"
								} ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-900 hover:text-black hover:bg-black/10"}`}
						>
							<BookOpen className="w-5 h-5" />
						</button>

						<button
							onClick={() => router.push(user ? "/profile" : "/login")}
							className={`flex items-center justify-center font-bold text-sm transition-all duration-200 ${user
								? `p-2 ${isRounded ? "rounded-md" : "rounded-none"} ${theme === "dark"
									? "text-gray-300 hover:text-white hover:bg-white/10"
									: "text-gray-900 hover:text-black hover:bg-black/10"
								}`
								: `bg-purple-700 hover:bg-purple-600 text-white px-4 py-1.5 ${isRounded ? "rounded-md" : "rounded-none"}`
								}`}
						>
							{!user ? "Anmelden" : <User className="w-5 h-5" />}
						</button>

						{userRole === "admin" && (
							<button
								onClick={() => router.push("/dashboard")}
								className={`p-2 transition-all duration-200 ${isRounded ? "rounded-md" : "rounded-none"
									} ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-900 hover:text-black hover:bg-black/10"}`}
							>
								<LayoutDashboard className="w-5 h-5" />
							</button>
						)}
					</div>

					<div className="flex md:hidden items-center">
						<button
							onClick={() => setOpen(!open)}
							className={`focus:outline-none transition-all p-1 ${theme === "dark" ? "text-white" : "text-black"}`}
						>
							{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>
					</div>
				</div>
			</div>

			{open && (
				<div
					className={`fixed inset-0 z-40 md:hidden pt-14 transition-all duration-300 ${theme === "dark" ? "bg-black" : "bg-white"
						}`}
				>
					<NavbarMobile setOpen={setOpen} />
				</div>
			)}
		</>
	);
}

function MainHeader({
	theme,
	router,
	isRounded,
}: {
	theme: Theme;
	router: AppRouterInstance;
	isRounded: boolean;
}) {
	const headers = [
		{ title: "Startseite", domain: "/" },
		{ title: "Kurse", domain: "/termine" },
		{ title: "Über uns", domain: "/verein" },
	];

	const pathname = usePathname();

	return (
		<div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
			<div className="flex gap-2 items-center">
				{headers.map((h) => {
					const isActive = pathname === h.domain;
					return (
						<button
							key={h.domain}
							onClick={() => router.push(h.domain)}
							className={`px-4 py-2 font-medium transition-all duration-200 text-sm ${isRounded ? "rounded-md" : "rounded-none"
								} ${theme === "dark"
									? `${isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`
									: `${isActive ? "text-black bg-black/5" : "text-slate-700 hover:text-black hover:bg-black/5"}`
								}`}
						>
							{h.title}
						</button>
					);
				})}
			</div>
		</div>
	);
}

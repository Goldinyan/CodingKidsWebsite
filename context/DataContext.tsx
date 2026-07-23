"use client";

import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
} from "react";
import {
	getAllMentors,
	getAllEvents,
	getAllCourses,
	getAllAnnouncements,
	getAllUsers,
} from "@/lib/db";
import { useAuth } from "./AuthContext";
import {
	AnnouncementData,
	EventData,
	Mentor,
	CourseData,
	UserData,
	EventDataPreset,
	TicketData
} from "@/BackEnd/type";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { getAllEventPresets } from "@/lib/db/eventPresets";
import { getAllTickets } from "@/lib/db/tickets";

interface DataContextType {
	loadingStates: {
		mentors: boolean;
		events: boolean;
		courses: boolean;
		announcements: boolean;
		users: boolean;
		eventPresets: boolean;
		tickets: boolean;
	};
	getMentors: () => Mentor[];
	getEvents: () => EventData[];
	getCourses: () => CourseData[];
	getAnnouncements: () => AnnouncementData[];
	getUsers: () => UserData[];
	getEventPresets: () => EventDataPreset[];
	getTickets: () => TicketData[];
	refreshData: (
		type: "mentors" | "events" | "courses" | "announcements" | "users" | "eventPresets" | "tickets",
	) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const debug = true;

export function DataProvider({ children }: { children: React.ReactNode }) {
	const { user, userRole, loading: authLoading } = useAuth();

	const [mentors, setMentors] = useState<Mentor[]>([]);
	const [events, setEvents] = useState<EventData[]>([]);
	const [courses, setCourses] = useState<CourseData[]>([]);
	const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
	const [users, setUsers] = useState<UserData[]>([]);
	const [eventPresets, setEventPresets] = useState<EventDataPreset[]>([]);
	const [tickets, setTickets] = useState<TicketData[]>([]);

	const { showErrorToast } = useNotificationToast();

	const [loadingStates, setLoadingStates] = useState({
		mentors: false,
		events: false,
		courses: false,
		announcements: false,
		users: false,
		eventPresets: false,
		tickets: false
	});

	const fetchedKeys = useRef<Record<string, string>>({
		mentors: "",
		events: "",
		courses: "",
		announcements: "",
		users: "",
		eventPresets: "",
		tickets: ""
	});

	const isFetching = useRef<Record<string, boolean>>({
		mentors: false,
		events: false,
		courses: false,
		announcements: false,
		users: false,
		eventPresets: false,
		tickets: false
	});

	const isInitialized = useRef(false);

	useEffect(() => {
		if (authLoading) return;

		if (!isInitialized.current) {

			if (debug) {
				console.log(`%c[${new Date().toLocaleTimeString("de-DE")}] %c[DATA CONTEXT] %cINITIAL LOAD %c| %cRole: ${userRole || "guest"} %c  %c %c`, "color: #6b7280;", "color: #eab308; font-weight: bold;", "color: #3b82f6; font-weight: bold;", "color: #4b5563;", "color: #8b5cf6; font-weight: bold;", "color: #4b5563;", "color: #10b981; font-weight: bold;", "color: #6b7280;");
			}

			isInitialized.current = true;

			// changing from "user && userRole" to "userRole" mal gucken
			if (userRole) {
				fetchSingleTarget("mentors");
				fetchSingleTarget("events");
				fetchSingleTarget("courses");
				fetchSingleTarget("announcements");
				if (userRole !== "anonymous") {
					fetchSingleTarget("tickets");
				}
				if (userRole === "admin") {
					fetchSingleTarget("users");
					fetchSingleTarget("eventPresets")
				}
			}
			return;
		}

		if (debug) {
			console.log(`%c[${new Date().toLocaleTimeString("de-DE")}] %c[DATA CONTEXT] %cROLE CHANGE %c| %cNew Role: ${userRole || "guest"} %c| %cClearing Cache... %c`, "color: #6b7280;", "color: #f97316; font-weight: bold;", "color: #3b82f6; font-weight: bold;", "color: #4b5563;", "color: #8b5cf6; font-weight: bold;", "color: #4b5563;", "color: #ef4444; font-weight: bold;", "color: #6b7280;");
		}

		fetchedKeys.current = {
			mentors: "",
			events: "",
			courses: "",
			announcements: "",
			users: "",
			eventPresets: "",
			tickets: ""
		};
		isFetching.current = {
			mentors: false,
			events: false,
			courses: false,
			announcements: false,
			users: false,
			eventPresets: false,
			tickets: false
		};

		setMentors([]);
		setEvents([]);
		setCourses([]);
		setUsers([]);
		setAnnouncements([]);
		setEventPresets([]);
		setTickets([]);

		// Nach Rollenwechsel neu laden
		fetchSingleTarget("mentors");
		fetchSingleTarget("events");
		fetchSingleTarget("courses");
		fetchSingleTarget("announcements");
		fetchSingleTarget("tickets");
		if (userRole === "admin") {
			fetchSingleTarget("users");
			fetchSingleTarget("eventPresets")
		}
	}, [userRole, authLoading, user?.uid, user]);

	const fetchSingleTarget = async (
		target: "mentors" | "events" | "courses" | "announcements" | "users" | "eventPresets" | "tickets",
		force = false,
	) => {
		if (authLoading || (user && !userRole)) return;

		const currentKey = user ? `${user.uid}-${userRole}` : "guest";

		// wenn key überstimtm oder bereits fetching läuft, dann return
		if (
			!force &&
			(fetchedKeys.current[target] === currentKey || isFetching.current[target])
		)
			return;

		// Synchron direkt blockieren, bevor irgendetwas asynchrones passiert
		fetchedKeys.current[target] = currentKey;
		isFetching.current[target] = true;

		if (debug) {
			logDataFetch(target, userRole || "anonymous", user?.uid);
		}

		setTimeout(async () => {
			setLoadingStates((prev) => ({ ...prev, [target]: true }));

			try {
				if (target === "mentors") {
					const res = await getAllMentors(user?.uid, userRole);
					setMentors(res.sort((a: Mentor, b: Mentor) => a.id - b.id));
				} else if (target === "events") {
					const res = (await getAllEvents(user?.uid, userRole)) as EventData[];
					setEvents(res);
				} else if (target === "courses") {
					const res = await getAllCourses(user?.uid, userRole);
					setCourses(res);
				} else if (target === "announcements") {
					const res = await getAllAnnouncements(user?.uid, userRole);
					setAnnouncements(res);
				} else if (target === "users") {
					const res = await getAllUsers(user?.uid, userRole);
					setUsers(res);
				} else if (target === "eventPresets") {
					const res = await getAllEventPresets(user?.uid, userRole);
					setEventPresets(res);
				} else if (target === "tickets") {
					const res = await getAllTickets(user?.uid, userRole);
					setTickets(res);
				}
			} catch (error) {
				showErrorToast(`Fehler beim Laden von ${target}: ${error}`);
				// Nur bei echtem Fehler zurücksetzen
				fetchedKeys.current[target] = "";
			} finally {
				setLoadingStates((prev) => ({ ...prev, [target]: false }));
				isFetching.current[target] = false;
			}
		}, 0);
	};

	const getMentors = () => {
		return mentors;
	};
	const getEvents = () => {
		return events;
	};
	const getCourses = () => {
		return courses;
	};
	const getAnnouncements = () => {
		return announcements;
	};
	const getUsers = () => {
		return users;
	};
	const getEventPresets = () => {
		return eventPresets;
	}
	const getTickets = () => {
		return tickets;
	}

	const refreshData = async (
		target: "mentors" | "events" | "courses" | "announcements" | "users" | "eventPresets" | "tickets",
	) => {
		await fetchSingleTarget(target, true);
	};

	return (
		<DataContext.Provider
			value={{
				loadingStates,
				getMentors,
				getEvents,
				getCourses,
				getAnnouncements,
				getUsers,
				getEventPresets,
				getTickets,
				refreshData,
			}}
		>
			{children}
		</DataContext.Provider>
	);
}

export function useAppData() {
	const context = useContext(DataContext);
	if (!context)
		throw new Error(
			"useAppData muss innerhalb eines DataProviders verwendet werden",
		);
	return context;
}



export function logDataFetch(
	target: string,
	userRole: string,
	userId?: string,
) {
	const time = new Date().toLocaleTimeString("de-DE", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	//	`%c[${time}] %c[DATA FETCH] %c${target.toUpperCase()} %c| %cRole: ${userRole} %c| %cUser: ${userId || "guest"} %c`

	console.log(
		`%c[${time}] %c[DATA FETCH] %c${target.toUpperCase()} %c| %cRole: ${userRole} %c %c %c`,
		"color: #6b7280; font-weight: normal;",  // Zeitstempel (Grau)
		"color: #06b6d4; font-weight: bold;",    // [DATA FETCH] (Cyan)
		"color: #3b82f6; font-weight: bold;",    // Target (Blau)
		"color: #4b5563;",                       // Trennstrich | (Dunkelgrau)
		"color: #8b5cf6; font-weight: bold;",    // Role (Violett)
		"color: #4b5563;",                       // Trennstrich | (Dunkelgrau)
		"color: #10b981; font-weight: bold;",    // User ID (Grün)
		"color: #6b7280; font-weight: bold;",    // Ende
	);
}

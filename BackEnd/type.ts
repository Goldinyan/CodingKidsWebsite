import { Theme } from "@/context/ThemeContext";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export enum EventStatus {
  User = "user",
  Queue = "queue",
  Loading = "loading",
  Error = "error",
  NotRegistered = "notRegistered",
}

export const USER_ROLES_ARRAY = [
  "anonymous",
  "user",
  "member",
  "admin",
  "mentor",
] as const;

export type UserRole = (typeof USER_ROLES_ARRAY)[number];

export type Preset = "false" | "ascending" | "descending";

export const LOG_TYPES = [
  "userLeftQueue",
  "userJoinedQueue",
  "userJoined",
  "userLeft",
  "userKicked",
  "mentorJoined",
  "mentorLeft",
  "eventDeleted",
  "eventChanged",
] as const;

export type LogType = (typeof LOG_TYPES)[number];

export type BaseLog = {
  date: Timestamp;
};

type ChangeValue = string | number | boolean | null | undefined | object;

export type Log =
  | (BaseLog & { type: "userLeftQueue"; userName: string; reason: string })
  | (BaseLog & { type: "userJoinedQueue"; userName: string })
  | (BaseLog & { type: "userJoined"; userName: string })
  | (BaseLog & { type: "userLeft"; userName: string; reason?: string })
  | (BaseLog & {
    type: "userKicked";
    userName: string;
    reason?: string;
    mentorName: string;
  })
  | (BaseLog & { type: "mentorJoined"; mentorName: string })
  | (BaseLog & { type: "mentorLeft"; mentorName: string })
  | (BaseLog & { type: "eventDeleted"; userName: string })
  | (BaseLog & {
    type: "eventChanged";
    mentorName: string;
    reason?: string;
    changes: Record<string, { from: ChangeValue; to: ChangeValue}>;
  });

export type EventData = {
  uid: string;
  name: string;
  course: string;
  date: Timestamp;
  tags: string;
  difficulty: string;
  requirements: string;
  length: number;
  memberCount: number;
  place: string[];
  typeOfEvent: string;
  description: string;
  users: string[];
  queue: string[];
  mentors: string[];
  leftUsers: string[];
  logs?: Log[];
};

export type AnnouncementData = {
  uid: string;
  tag: UserRole;
  title: string;
  content: string;
  author: string;
  date: Timestamp;
  readBy?: string[];
};

// ------------------------------
// USER
// ------------------------------

type BaseSettings = {
  theme: Theme;
  isRounded: boolean;
};

export type NotificationSettings = {
  newEvent: boolean;
  kicked: boolean;
  queueToUser: boolean;
  understaffedWarning: boolean;
  logs?: boolean;
  systemAlerts?: boolean;
};

export type UserSettings = BaseSettings & {
  notifications: Pick<
    NotificationSettings,
    "newEvent" | "kicked" | "queueToUser"
  >;
};

export type AdminSettings = BaseSettings & {
  notifications: Omit<NotificationSettings, "kicked" | "queueToUser">;
};

export type StaffSettings = BaseSettings & {
  notifications: Pick<NotificationSettings, "newEvent" | "understaffedWarning">;
};

type BaseUserData = {
  uid: string;
  name: string;
  email: string;
  birthdate: Timestamp;
  createdAt: Timestamp;
  avatar: string;
  courses?: string[];
  projects: string[];
};

// UNION

export type UserData =
  | (BaseUserData & {
    role: "admin";
    children: string[];
    settings: AdminSettings;
  })
  | (BaseUserData & {
    role: "mentor";
    children: string[];
    settings: StaffSettings;
  })
  | (BaseUserData & {
    role: "anonymous" | "user" | "member";
    children?: never;
    settings: UserSettings;
  });

// --------------------------------------

export type Mentor = {
  uid: string;
  id: number; // for filtering and importance
  role: string;
  name: string;
  des: string;
  pic: string;
  insta?: string;
  linkedin?: string;
  github?: string;
};

export type AuthContextType = {
  user: User | null;
  userRole: UserRole;
  userData: UserData | null;
  updateProfile: (updates: Partial<UserData>) => Promise<void>;
  loading: boolean;
};

export type Filter = {
  name: Preset;
  birthYear: Preset;
  role: UserRole | "All";
};

export type CourseData = {
  uid: string;
  dates: string[];
  name: string;
  des: string;
  tags: string[];
  mentors: Mentor[];
};

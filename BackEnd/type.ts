import { Theme } from "@/context/ThemeContext";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { BaseSyntheticEvent } from "react";

export enum EventStatus {
  User = "user",
  Queue = "queue",
  Loading = "loading",
  Error = "error",
  NotRegistered = "notRegistered",
}

export type UserRole = "anonymous" | "user" | "member" | "admin" | "mentor";

export type PresetRoles = UserRole;

export type Preset = "false" | "ascending" | "descending";

export const LOG_TYPES = [
  "userLeftQueue",
  "userJoinedQueue",
  "userJoined",
  "userLeft",
  "userKicked",
  "eventDeleted",
  "eventChanged",
] as const;

export type LogType = (typeof LOG_TYPES)[number];

export type BaseLog = {
  date: Timestamp;
};

export type Log =
  | (BaseLog & { type: "userLeftQueue"; user: string; reason: string })
  | (BaseLog & { type: "userJoinedQueue"; user: string })
  | (BaseLog & { type: "userJoined"; user: string })
  | (BaseLog & { type: "userLeft"; user: string; reason?: string })
  | (BaseLog & {
    type: "userKicked";
    user: string;
    reason?: string;
    mentor: string;
  })
  | (BaseLog & { type: "eventDeleted"; user: string })
  | (BaseLog & {
    type: "eventChanged";
    mentor: string;
    reason?: string;
    updates: Partial<EventData>;
  });

export type EventData = {
  uid: string;
  name: string;
  course: string;
  date: Timestamp;
  tag: string;
  difficulty: string;
  requirements: string;
  length: number;
  memberCount: number;
  place: string[];
  typeOfEvent: string;
  description: string;
  users: string[];
  queue: string[];
  leftUsers: string[];
  log?: LogType;
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
  darkMode: boolean;
  notifications: {
    newEvent: boolean;
  };
};

type StaffSettings = BaseSettings & {
  notifications: {
    newEvent: boolean;
    logs: boolean;
  };
};

type BaseUserData = {
  uid: string;
  name: string;
  email: string;
  birthdate: Timestamp;
  createdAt: Timestamp;
  avatar: string;
  theme: Theme;
  roundedCorners: boolean;
  courses?: string[];
  projects: string[];
  settings: {
    darkMode: boolean;
    notifications: {
      newEvent: boolean;
      logs: boolean;
    };
  };
};

// UNION

export type UserData =
  | (BaseUserData & {
    role: "admin" | "mentor";
    children: string[];
    settings: StaffSettings;
  })
  | (BaseUserData & {
    role: "anonymous" | "user" | "member";
    children?: never;
    settings: BaseSettings;
  });

// --------------------------------------

export type Mentor = {
  uid: string;
  id: number; // for filtering and importance
  role: string;
  name: string;
  des1: string;
  des2: string;
  pic: string;
  insta?: string;
  linkedin?: string;
  github?: string;
};

export type AuthContextType = {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
};

export type Filter = {
  name: Preset;
  birthYear: Preset;
  role: UserRole;
};

export type CourseData = {
  uid: string;
  dates: string[];
  name: string;
  des: string;
  tags: string[];
  mentors: Mentor[];
};

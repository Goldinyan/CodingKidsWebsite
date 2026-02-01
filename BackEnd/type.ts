import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export type Preset = "false" | "ascending" | "descending";

export type PresetRoles = "All" | "Member" | "User" | "Admin" | "Mentor";

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
  tag: PresetRoles;
  title: string;
  content: string;
  author: string;
  date: Timestamp;
  readBy?: string[];
};

export type UserData = {
  uid: string;
  name: string;
  email: string;
  birthdate: string;
  createdAt: Timestamp;
  role: string;
  courses?: string[];
};

export type Mentor = {
  uid: string;
  name: string;
  des1: string;
  des2: string;
  pic: string;
  id: number;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export type Filter = {
  name: Preset;
  birthYear: Preset;
  role: PresetRoles;
};

export type CourseData = {
  uid: string;
  dates: string[];
  name: string;
  des: string;
  tags: string[];
  mentors: Mentor[];
};

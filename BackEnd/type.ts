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
  "mentor",
  "admin",
] as const;

export enum Difficulties {
  Alle = "Alle",
  Einsteiger = "Einsteiger",
  Mittel = "Mittel",
  Fortgeschritten = "Fortgeschritten",
}

export type UserRole = (typeof USER_ROLES_ARRAY)[number];

export type Preset = "false" | "ascending" | "descending";

export type EmailTrigger =
  | "newEvent"
  | "kicked"
  | "queueToUser"
  | "understaffedWarning"
  | "announcement"
  | "accountCreated"
  | "accountDeleted"
  | "newTicket";

export type EmailTemplate = {
  triggerId: EmailTrigger;
  subject: string;
  htmlContent: string;
  roles: UserRole[];
  requiredFields: string[];
};

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
      changes: Record<string, { from: ChangeValue; to: ChangeValue }>;
    });

export type EventData = {
  uid: string;
  name: string;
  course: string;
  date: Timestamp;
  tags: string;
  difficulty: Difficulties;
  requirements: string;
  length: number;
  memberCount: number;
  place: string[];
  description: string;
  users: string[];
  queue: string[];
  mentors: string[];
  leftUsers: string[];
  logs?: Log[];
};

export type EventDataPreset = Omit<
  EventData,
  "uid" | "users" | "queue" | "mentors" | "leftUsers" | "logs"
> & {
  presetName: string;
};

export type AnnouncementData = {
  uid: string;
  tag: UserRole;
  title: string;
  content: string;
  authorUid: string;
  authorName: string;
  date: Timestamp;
  readBy?: string[];
};

export type TicketData = {
  uid: string;
  ticketNumber: string; // z.b. "TIC-1024", besser als lange uid

  // KUNDE
  userUid: string;
  userName: string;
  userEmail: string;

  //INAHALT
  subject: string;
  description: string;
  category: "general" | "technical" | "billing" | "other";

  // ORGANISATION
  priority: "low" | "medium" | "high" | "urgent";
  status: "closed" | "new" | "pending_customer" | "pending_staff";

  // STAFF
  assignedToUid?: string;
  assignedToName?: string;

  // TIME
  createdAt: Timestamp;
  updatedAt: Timestamp;
  closedAt?: Timestamp;

  // MESSAGES
  messages?: TicketMessage[];

  internalNotes?: TicketMessage[]; // Only visible to staff
};

export type TicketMessage = {
  uid: string;

  // SENDER
  senderUid: string;
  senderName: string;
  senderRole: "customer" | "staff";

  // INAHLT
  message: string;

  createdAt: Timestamp;
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
  courses?: string[];
  projects: ScratchProject[];
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
  mentors: UserData[];
};

export type ScratchProject = {
  name: string;
  downloadUrl: string;
  createdAt: Timestamp;
  size?: number;
};

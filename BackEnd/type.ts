import { User } from "firebase/auth"


export type Preset = "false" | "ascending" | "descending";

export type PresetRoles =
  | "All"
  | "Member"
  | "User"
  | "Admin"
  | "Mentor";

export type EventData = {
  uid: string;
  name: string;
  date: Date;
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
};

export type AnnouncementData = {
  uid: string;
  tag: PresetRoles;
  title: string;
  content: string;
  author: string;
  date: Date;
  readBy?: string[];
};

export type UserData = {
  uid: string;
  name: string;
  email: string;
  birthdate: string; 
  createdAt: Date;
  role: string;
};

export type Mentor = {
  uid: string, 
  name: string,
  des1: string,
  des2: string,
  pic: string,
  id: number
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
};


export type Filter = {
    name: Preset;
    birthYear: Preset;
    role: PresetRoles;
}



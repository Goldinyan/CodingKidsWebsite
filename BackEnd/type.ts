import { User } from "firebase/auth"


export type Preset = "false" | "ascending" | "descending";

export type PresetRoles =
  | "all"
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
  users: UserData[];
  queue: UserData[];
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



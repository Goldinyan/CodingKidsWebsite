import { User } from "firebase/auth"


export type Preset = "false" | "ascending" | "descending";

export type PresetRoles =
  | "false"
  | "N/A"
  | "Member"
  | "NotMember"
  | "Admin"
  | "Mentor";

export type EventData = {
  name: string;
  date: Date;
  length: number;
  memberCount: number;
  place:  string[];
  typeOfEvent:  string;
};

export type UserData = {
  uid: string;
  name: string;
  email: string;
  birthday: string; 
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
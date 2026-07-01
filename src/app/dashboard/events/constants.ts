import type { EventData } from "@/BackEnd/type";

export type EventTimeFilter = "Upcoming" | "Past";

export const EVENT_FIELDS = [
  "tags",
  "difficulty",
  "requirements",
  "length",
  "memberCount",
  "place",
  "course",
  "description",
  "users",
  "queue",
] as const satisfies ReadonlyArray<
  keyof Omit<EventData, "uid" | "name" | "date">
>;

export const EVENT_FIELD_LABELS = [
  "Tags",
  "Schwierigkeit",
  "Erforderungen",
  "Länge",
  "Teilnehmer Anzahl",
  "Ort",
  "Course",
  "Beschreibung",
  "User",
  "Warteschlange",
] as const;


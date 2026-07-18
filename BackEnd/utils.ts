import { Timestamp } from "firebase/firestore";

export function toJsDate(value: string | Date | Timestamp | number): Date {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value == "number") return new Date(value);
  return new Date(value); // string
}

import { Timestamp } from "firebase/firestore";

export function toJsDate(value: string | Date | Timestamp): Date {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  return new Date(value); // string
}

import type { Log } from "@/BackEnd/type";
import { toJsDate } from "@/BackEnd/utils";

export function formatLogMessage(log: Log): { title: string; details?: string } {
  switch (log.type) {
    case "userJoined":
      return {
        title: "Benutzer angemeldet",
        details: `Benutzer ${log.user} hat sich angemeldet`,
      };

    case "userJoinedQueue":
      return {
        title: "Benutzer in Warteschlange",
        details: `Benutzer ${log.user} wurde in Warteschlange aufgenommen`,
      };

    case "userLeft":
      return {
        title: "Benutzer abgemeldet",
        details: `Benutzer ${log.user} abgemeldet${log.reason ? ` (${log.reason})` : ""}`,
      };

    case "userLeftQueue":
      return {
        title: "Von Warteschlange entfernt",
        details: `Benutzer ${log.user} von Warteschlange entfernt${log.reason ? ` (${log.reason})` : ""}`,
      };

    case "userKicked":
      return {
        title: "Benutzer entfernt",
        details: `Benutzer ${log.user} wurde von ${log.mentor} entfernt${log.reason ? ` (${log.reason})` : ""}`,
      };

    case "eventDeleted":
      return {
        title: "Event gelöscht",
        details: `Event wurde von ${log.user} gelöscht`,
      };

    case "eventChanged":
      const changes = log.updates ? Object.keys(log.updates).join(", ") : "unbekannt";
      return {
        title: "Event aktualisiert",
        details: `${log.mentor} hat ${changes} aktualisiert${log.reason ? ` (${log.reason})` : ""}`,
      };

    default:
      return {
        title: "Unbekannte Aktion",
        details: "Unbekannte Log-Aktion",
      };
  }
}

export function formatLogDate(log: Log): string {
  try {
    const date = log.date.toDate ? log.date.toDate() : new Date(log.date as any);
    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "Ungültige Datum";
  }
}

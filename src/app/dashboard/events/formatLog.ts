import type { Log } from "@/BackEnd/type";

export function formatLogMessage(log: Log): {
  title: string;
  details?: string;
} {
  switch (log.type) {
    case "userJoined":
      return {
        title: "Benutzer angemeldet",
        details: `${log.userName} hat sich angemeldet`,
      };

    case "userJoinedQueue":
      return {
        title: "Benutzer in Warteschlange",
        details: `${log.userName} wurde in Warteschlange aufgenommen`,
      };

    case "userLeft":
      return {
        title: "Benutzer abgemeldet",
        details: `${log.userName} abgemeldet${log.reason ? ` (${log.reason})` : ""}`,
      };

    case "userLeftQueue":
      return {
        title: "Von Warteschlange entfernt",
        details: `${log.userName} von Warteschlange entfernt${log.reason ? ` (${log.reason})` : ""}`,
      };

    case "userKicked":
      return {
        title: "Benutzer entfernt",
        details: `${log.userName} wurde von ${log.mentorName} entfernt${log.reason ? ` (${log.reason})` : ""}`,
      };

    case "mentorJoined":
      return {
        title: "Mentor angemeldet",
        details: `${log.mentorName} (Mentor) hat sich angemeldet`,
      };

    case "mentorLeft":
      return {
        title: "Mentor abgemeldet",
        details: `${log.mentorName} (Mentor) wurde entfernt`,
      };

    case "eventDeleted":
      return {
        title: "Event gelöscht",
        details: `Event wurde von ${log.userName} gelöscht`,
      };

    case "eventChanged":
      const changedFields = Object.entries(log.changes)
        .map(([key, change]) => {
          const fromVal = formatValue(change.from);
          const toVal = formatValue(change.to);
          return `${formatFieldName(key)}: "${fromVal}" → "${toVal}"`;
        })
        .join(", ");

      return {
        title: "Event aktualisiert",
        details: `${log.mentorName} hat ${changedFields} aktualisiert${log.reason ? ` (${log.reason})` : ""}`,
      };

    default:
      return {
        title: "Unbekannte Aktion",
        details: "Unbekannte Log-Aktion",
      };
  }
}

function formatFieldName(key: string): string {
  const fieldNames: Record<string, string> = {
    name: "Name",
    date: "Datum",
    length: "Dauer",
    memberCount: "Teilnehmerzahl",
    place: "Ort",
    description: "Beschreibung",
    tag: "Tag",
    difficulty: "Schwierigkeitsgrad",
    requirements: "Voraussetzungen",
    course: "Kurs",
  };
  return fieldNames[key] || key;
}

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return "—";
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.join(", ") || "—";
    }
    return JSON.stringify(value);
  }
  return String(value).substring(0, 50);
}

export function formatLogDate(log: Log): string {
  try {
    const date = log.date.toDate
      ? log.date.toDate()
      : new Date(log.date as any);
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

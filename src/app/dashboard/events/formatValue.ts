export function formatValue(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") {
    try {
      return Object.entries(v as Record<string, unknown>)
        .map(([k, val]) => `${k}: ${String(val)}`)
        .join(", ");
    } catch (e) {
      console.error("Fehler beim Formatieren Objekts:", e);
      return String(v);
    }
  }
  return String(v);
}

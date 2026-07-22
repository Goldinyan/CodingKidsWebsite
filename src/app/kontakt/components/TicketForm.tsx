"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { addTicket } from "@/lib/db/tickets";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { Send, AlertCircle } from "lucide-react";
import type { TicketData } from "@/BackEnd/type";

export default function TicketForm({ onSubmit }: { onSubmit?: () => void }) {
  const { theme, isRounded } = useTheme();
  const { user, userData } = useAuth();
  const { showSuccessToast, showErrorToast } = useNotificationToast();

  const [form, setForm] = useState({
    subject: "",
    description: "",
    category: "general" as const,
    priority: "medium" as const,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: "general", label: "Allgemein" },
    { value: "technical", label: "Technisch" },
    { value: "billing", label: "Rechnung" },
    { value: "other", label: "Sonstiges" },
  ];

  const priorities = [
    { value: "low", label: "Niedrig" },
    { value: "medium", label: "Mittel" },
    { value: "high", label: "Hoch" },
    { value: "urgent", label: "Dringend" },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.subject.trim()) newErrors.subject = "Betreff erforderlich";
    if (!form.description.trim()) newErrors.description = "Beschreibung erforderlich";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !user || !userData) return;

    setLoading(true);
    try {
      const ticketNumber = `TIC-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      await addTicket(
        {
          ticketNumber,
          userUid: user.uid,
          userName: userData.name,
          userEmail: userData.email,
          subject: form.subject,
          description: form.description,
          category: form.category,
          priority: form.priority,
          status: "new",
        },
        user.uid,
        userData.role
      );

      showSuccessToast("CREATE_SUCCESS");
      setForm({ subject: "", description: "", category: "general", priority: "medium" });
      onSubmit?.();
    } catch (error) {
      showErrorToast(error, "GENERIC_ERROR");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const containerClass = theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200";
  const inputClass = theme === "dark" ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900";
  const labelClass = theme === "dark" ? "text-slate-300" : "text-slate-700";

  return (
    <form onSubmit={handleSubmit} className={`border p-6 ${containerClass} ${isRounded ? "rounded-lg" : "rounded-none"} space-y-4`}>
      <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
        Neues Ticket erstellen
      </h3>

      <div>
        <label className={`block text-sm font-medium mb-2 ${labelClass}`}>Betreff</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className={`w-full border px-3 py-2 ${inputClass} ${isRounded ? "rounded-md" : "rounded-none"}`}
          placeholder="Kurze Zusammenfassung..."
        />
        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${labelClass}`}>Beschreibung</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className={`w-full border px-3 py-2 ${inputClass} resize-none ${isRounded ? "rounded-md" : "rounded-none"}`}
          placeholder="Beschreiben Sie Ihr Anliegen..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>Kategorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as any })}
            className={`w-full border px-3 py-2 ${inputClass} ${isRounded ? "rounded-md" : "rounded-none"}`}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>Priorität</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
            className={`w-full border px-3 py-2 ${inputClass} ${isRounded ? "rounded-md" : "rounded-none"}`}
          >
            {priorities.map((pri) => (
              <option key={pri.value} value={pri.value}>
                {pri.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 font-medium flex items-center justify-center gap-2 ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90"
        } ${
          theme === "dark"
            ? "bg-blue-600 text-white"
            : "bg-blue-500 text-white"
        } ${isRounded ? "rounded-md" : "rounded-none"} transition-opacity`}
      >
        <Send size={18} />
        {loading ? "Wird erstellt..." : "Ticket erstellen"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { addMessageToTicket, addInternalNoteToTicket } from "@/lib/db/tickets";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { X, Send, Lock } from "lucide-react";
import type { TicketData } from "@/BackEnd/type";
import StatusBadge from "./StatusBadge";

interface TicketDetailProps {
  ticket: TicketData;
  onClose: () => void;
  onUpdate?: () => void;
  isAdmin?: boolean;
}

export default function TicketDetail({ ticket, onClose, onUpdate, isAdmin = false }: TicketDetailProps) {
  const { theme, isRounded } = useTheme();
  const { user, userData } = useAuth();
  const { showSuccessToast, showErrorToast } = useNotificationToast();

  const [message, setMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !userData) return;

    setLoadingMessage(true);
    try {
      await addMessageToTicket(
        ticket.uid,
        message,
        {
          uid: user.uid,
          name: userData.name,
          role: isAdmin ? "staff" : "customer",
        },
        user.uid,
        userData.role
      );
      setMessage("");
      showSuccessToast("GENERIC_SUCCESS");
      onUpdate?.();
    } catch (error) {
      showErrorToast(error, "GENERIC_ERROR");
      console.error(error);
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleAddNote = async () => {
    if (!internalNote.trim() || !user || !userData) return;

    setLoadingNote(true);
    try {
      await addInternalNoteToTicket(
        ticket.uid,
        internalNote,
        { uid: user.uid, name: userData.name },
        user.uid,
        userData.role
      );
      setInternalNote("");
      setShowNoteInput(false);
      showSuccessToast("GENERIC_SUCCESS");
      onUpdate?.();
    } catch (error) {
      showErrorToast(error, "GENERIC_ERROR");
      console.error(error);
    } finally {
      setLoadingNote(false);
    }
  };

  const containerClass = theme === "dark" ? "bg-slate-900" : "bg-white";
  const borderClass = theme === "dark" ? "border-slate-700" : "border-slate-200";
  const textClass = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const inputClass = theme === "dark" ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900";

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50`}>
      <div className={`${containerClass} border ${borderClass} w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isRounded ? "rounded-lg" : "rounded-none"}`}>
        {/* Header */}
        <div className={`border-b ${borderClass} p-4 flex items-start justify-between sticky top-0 ${containerClass}`}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`font-mono font-bold text-lg ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                {ticket.ticketNumber}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {ticket.subject}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 dark:hover:bg-slate-700 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Info */}
        <div className={`border-b ${borderClass} p-4 grid grid-cols-2 gap-4 text-sm`}>
          <div>
            <p className={textClass}>Erstellt von</p>
            <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{ticket.userName}</p>
          </div>
          <div>
            <p className={textClass}>Kategorie</p>
            <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{ticket.category}</p>
          </div>
          <div>
            <p className={textClass}>Priorität</p>
            <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{ticket.priority}</p>
          </div>
          {isAdmin && ticket.assignedToName && (
            <div>
              <p className={textClass}>Zugewiesen an</p>
              <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{ticket.assignedToName}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className={`border-b ${borderClass} p-4`}>
          <p className={`text-sm font-semibold mb-2 ${textClass}`}>Beschreibung</p>
          <p className={theme === "dark" ? "text-white" : "text-slate-900"}>{ticket.description}</p>
        </div>

        {/* Messages */}
        <div className={`border-b ${borderClass} p-4`}>
          <p className={`text-sm font-semibold mb-4 ${textClass}`}>Nachrichten ({ticket.messages?.length || 0})</p>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {ticket.messages?.map((msg) => (
              <div key={msg.uid} className={`p-3 ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"} ${isRounded ? "rounded-md" : "rounded-none"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{msg.senderName}</span>
                  <span className={`text-xs px-2 py-0.5 ${msg.senderRole === "staff" ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100" : "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100"} ${isRounded ? "rounded-md" : "rounded-none"}`}>
                    {msg.senderRole === "staff" ? "Staff" : "Kunde"}
                  </span>
                </div>
                <p className={`text-sm ${textClass}`}>{msg.message}</p>
                <p className={`text-xs ${textClass} mt-1`}>
                  {new Date(msg.createdAt.toDate?.() || msg.createdAt).toLocaleDateString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className={`border-b ${borderClass} p-4`}>
          <div className="flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ihre Nachricht..."
              className={`flex-1 border px-3 py-2 text-sm ${inputClass} resize-none ${isRounded ? "rounded-md" : "rounded-none"}`}
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={loadingMessage || !message.trim()}
              className={`px-4 py-2 font-medium flex items-center gap-2 ${
                loadingMessage || !message.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              } ${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"} ${isRounded ? "rounded-md" : "rounded-none"}`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Internal Notes (Admin only) */}
        {isAdmin && (
          <div className={`border-b ${borderClass} p-4`}>
            {!showNoteInput ? (
              <button
                onClick={() => setShowNoteInput(true)}
                className={`text-sm px-3 py-2 flex items-center gap-2 ${theme === "dark" ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"} ${isRounded ? "rounded-md" : "rounded-none"}`}
              >
                <Lock size={14} />
                Interne Notiz hinzufügen
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Interne Notiz (nur für Staff sichtbar)..."
                  className={`w-full border px-3 py-2 text-sm ${inputClass} resize-none ${isRounded ? "rounded-md" : "rounded-none"}`}
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddNote}
                    disabled={loadingNote || !internalNote.trim()}
                    className={`flex-1 px-3 py-2 font-medium ${
                      loadingNote || !internalNote.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                    } ${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"} ${isRounded ? "rounded-md" : "rounded-none"}`}
                  >
                    Speichern
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteInput(false);
                      setInternalNote("");
                    }}
                    className={`flex-1 px-3 py-2 font-medium ${theme === "dark" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"} ${isRounded ? "rounded-md" : "rounded-none"}`}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { updateTicket } from "@/lib/db/tickets";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { useAppData } from "@/context/DataContext";
import type { TicketData, UserData } from "@/BackEnd/type";

interface AdminControlsProps {
  ticket: TicketData;
  onUpdate?: () => void;
}

export default function AdminControls({ ticket, onUpdate }: AdminControlsProps) {
  const { theme, isRounded } = useTheme();
  const { user, userData } = useAuth();
  const { showSuccessToast, showErrorToast } = useNotificationToast();
  const [staffMembers, setStaffMembers] = useState<UserData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TicketData["status"]>(ticket.status);
  const [selectedAssignee, setSelectedAssignee] = useState<string>(ticket.assignedToUid || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch staff members from context or data
    // This is a placeholder - you might need to adjust based on your data structure
  }, []);

  const statuses: Array<{ value: TicketData["status"]; label: string }> = [
    { value: "new", label: "Neu" },
    { value: "open", label: "Offen" },
    { value: "pending_staff", label: "Warte auf Staff" },
    { value: "pending_customer", label: "Warte auf Kunde" },
    { value: "closed", label: "Geschlossen" },
  ];

  const handleStatusChange = async (newStatus: TicketData["status"]) => {
    if (!user || !userData) return;

    setLoading(true);
    try {
      await updateTicket(
        ticket.uid,
        { status: newStatus },
        user.uid,
        userData.role
      );
      setSelectedStatus(newStatus);
      showSuccessToast("UPDATE_SUCCESS");
      onUpdate?.();
    } catch (error) {
      showErrorToast(error, "UPDATE_ERROR");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!user || !userData) return;

    setLoading(true);
    try {
      await updateTicket(
        ticket.uid,
        {
          assignedToUid: user.uid,
          assignedToName: userData.name,
        },
        user.uid,
        userData.role
      );
      setSelectedAssignee(user.uid);
      showSuccessToast("UPDATE_SUCCESS");
      onUpdate?.();
    } catch (error) {
      showErrorToast(error, "UPDATE_ERROR");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async () => {
    if (!user || !userData) return;

    setLoading(true);
    try {
      await updateTicket(
        ticket.uid,
        {
          assignedToUid: undefined,
          assignedToName: undefined,
        },
        user.uid,
        userData.role
      );
      setSelectedAssignee("");
      showSuccessToast("UPDATE_SUCCESS");
      onUpdate?.();
    } catch (error) {
      showErrorToast(error, "UPDATE_ERROR");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const containerClass = theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200";
  const inputClass = theme === "dark" ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900";

  return (
    <div className={`border p-4 ${containerClass} space-y-4 ${isRounded ? "rounded-lg" : "rounded-none"}`}>
      <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
        Admin-Kontrollen
      </h3>

      {/* Status */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
          Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value as TicketData["status"])}
          disabled={loading}
          className={`w-full border px-3 py-2 text-sm ${inputClass} ${isRounded ? "rounded-md" : "rounded-none"} ${loading ? "opacity-50" : ""}`}
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Assignment */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
          Zuweisung
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleAssignToMe}
            disabled={loading || selectedAssignee === user?.uid}
            className={`flex-1 px-3 py-2 text-sm font-medium ${
              loading || selectedAssignee === user?.uid ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            } ${
              selectedAssignee === user?.uid
                ? theme === "dark"
                  ? "bg-green-900 text-green-100"
                  : "bg-green-100 text-green-900"
                : theme === "dark"
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
            } ${isRounded ? "rounded-md" : "rounded-none"}`}
          >
            Mir zuweisen
          </button>
          {selectedAssignee && (
            <button
              onClick={handleUnassign}
              disabled={loading}
              className={`px-3 py-2 text-sm font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              } ${
                theme === "dark"
                  ? "bg-red-600 text-white"
                  : "bg-red-500 text-white"
              } ${isRounded ? "rounded-md" : "rounded-none"}`}
            >
              Entfernen
            </button>
          )}
        </div>
        {ticket.assignedToName && (
          <p className={`text-sm mt-2 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
            Aktuell zugewiesen: <span className="font-medium">{ticket.assignedToName}</span>
          </p>
        )}
      </div>
    </div>
  );
}

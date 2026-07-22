"use client";

import type { TicketData } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";

type TicketStatus = TicketData["status"];

const statusConfig: Record<TicketStatus, { label: string; bg: string; text: string }> = {
  new: { label: "Neu", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-900 dark:text-blue-100" },
  open: { label: "Offen", bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-900 dark:text-yellow-100" },
  pending_staff: { label: "Warte auf Staff", bg: "bg-orange-100 dark:bg-orange-900", text: "text-orange-900 dark:text-orange-100" },
  pending_customer: { label: "Warte auf Kunde", bg: "bg-purple-100 dark:bg-purple-900", text: "text-purple-900 dark:text-purple-100" },
  closed: { label: "Geschlossen", bg: "bg-green-100 dark:bg-green-900", text: "text-green-900 dark:text-green-100" },
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const { isRounded } = useTheme();
  const config = statusConfig[status];
  
  return (
    <span className={`px-3 py-1 text-sm font-medium ${config.bg} ${config.text} ${isRounded ? "rounded-full" : "rounded"}`}>
      {config.label}
    </span>
  );
}

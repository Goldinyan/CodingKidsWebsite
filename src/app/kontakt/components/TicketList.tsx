"use client";

import type { TicketData } from "@/BackEnd/type";
import { useTheme } from "@/context/ThemeContext";
import StatusBadge from "./StatusBadge";
import { MessageSquare, User, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";

interface TicketListProps {
  tickets: TicketData[];
  onTicketClick: (ticket: TicketData) => void;
  isAdmin?: boolean;
  loading?: boolean;
}

export default function TicketList({ tickets, onTicketClick, isAdmin = false, loading = false }: TicketListProps) {
  const { theme, isRounded } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const containerClass = theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200";
  const textClass = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const hoverClass = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50";

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`border p-4 ${containerClass} ${isRounded ? "rounded-lg" : "rounded-none"} animate-pulse`}>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className={`border p-8 text-center ${containerClass} ${isRounded ? "rounded-lg" : "rounded-none"}`}>
        <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
        <p className={textClass}>{isAdmin ? "Keine Tickets vorhanden" : "Keine Tickets erstellt"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const expanded = expandedId === ticket.uid;
        const messageCount = ticket.messages?.length || 0;

        return (
          <div
            key={ticket.uid}
            className={`border ${containerClass} ${isRounded ? "rounded-lg" : "rounded-none"} overflow-hidden transition-all`}
          >
            <div
              onClick={() => {
                setExpandedId(expanded ? null : ticket.uid);
                onTicketClick(ticket);
              }}
              className={`p-4 cursor-pointer ${hoverClass} transition-colors`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-mono font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                      {ticket.ticketNumber}
                    </span>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <h3 className={`font-semibold line-clamp-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    {ticket.subject}
                  </h3>
                  <p className={`text-sm line-clamp-2 mt-1 ${textClass}`}>
                    {ticket.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {messageCount > 0 && (
                    <div className={`flex items-center gap-1 px-2 py-1 ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"} ${isRounded ? "rounded-md" : "rounded-none"}`}>
                      <MessageSquare size={14} />
                      {messageCount}
                    </div>
                  )}
                </div>
              </div>

              <div className={`flex items-center gap-4 mt-3 text-xs ${textClass}`}>
                {isAdmin && ticket.assignedToName && (
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {ticket.assignedToName}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(ticket.createdAt.toDate?.() || ticket.createdAt).toLocaleDateString("de-DE")}
                </div>
                {isAdmin && (
                  <span className={`px-2 py-1 font-medium ${
                    ticket.priority === "urgent" ? "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100" :
                    ticket.priority === "high" ? "bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100" :
                    ticket.priority === "medium" ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100" :
                    "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                  } ${isRounded ? "rounded-md" : "rounded-none"}`}>
                    {ticket.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

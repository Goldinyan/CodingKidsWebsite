"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { getAllTickets } from "@/lib/db/tickets";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import type { TicketData } from "@/BackEnd/type";
import TicketList from "./components/TicketList";
import TicketDetail from "./components/TicketDetail";
import AdminControls from "./components/AdminControls";
import { Loader, Filter, X } from "lucide-react";

export default function AdminView() {
  const { theme, isRounded } = useTheme();
  const { user, userData } = useAuth();
  const { showErrorToast } = useNotificationToast();

  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [filters, setFilters] = useState({
    status: "" as TicketData["status"] | "",
    priority: "" as TicketData["priority"] | "",
    search: "",
  });

  const statuses: TicketData["status"][] = ["new", "open", "pending_staff", "pending_customer", "closed"];
  const priorities: TicketData["priority"][] = ["low", "medium", "high", "urgent"];

  const fetchTickets = async () => {
    if (!user || !userData) return;

    setLoading(true);
    try {
      const data = await getAllTickets(user.uid, userData.role);
      setTickets(data);
    } catch (error) {
      showErrorToast("Fehler beim Laden der Tickets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user, userData]);

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        ticket.ticketNumber.toLowerCase().includes(search) ||
        ticket.subject.toLowerCase().includes(search) ||
        ticket.userName.toLowerCase().includes(search) ||
        ticket.userEmail.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const radiusClass = isRounded ? "rounded-lg" : "rounded-none";
  const containerClass = theme === "dark" ? "bg-black" : "bg-white";
  const headerBg = theme === "dark" ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200";
  const inputClass = theme === "dark" ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${containerClass}`}>
      {/* Header */}
      <div className={`${headerBg} border-b p-4 sm:p-6 backdrop-blur-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>
            Support Ticket Verwaltung
          </h1>
          <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            Verwalte alle eingehenden Tickets von Benutzern
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Filters */}
        <div className={`border ${theme === "dark" ? "border-slate-700" : "border-slate-200"} p-4 mb-6 ${radiusClass}`}>
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} />
            <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Filter
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                Suche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Ticket #, Betreff, Name..."
                className={`w-full border px-3 py-2 text-sm ${inputClass} ${radiusClass}`}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className={`w-full border px-3 py-2 text-sm ${inputClass} ${radiusClass}`}
              >
                <option value="">Alle</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                Priorität
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                className={`w-full border px-3 py-2 text-sm ${inputClass} ${radiusClass}`}
              >
                <option value="">Alle</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: "", priority: "", search: "" })}
                className={`w-full px-4 py-2 font-medium flex items-center justify-center gap-2 ${
                  theme === "dark"
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                } ${radiusClass} transition-colors`}
              >
                <X size={16} />
                Zurücksetzen
              </button>
            </div>
          </div>

          {/* Filter Info */}
          <div className={`mt-4 text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            {filteredTickets.length} von {tickets.length} Tickets
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2">
            <div className={`border ${theme === "dark" ? "border-slate-700" : "border-slate-200"} p-6 ${radiusClass}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Tickets
                </h2>
                {loading && <Loader size={20} className="animate-spin" />}
              </div>

              <TicketList
                tickets={filteredTickets}
                onTicketClick={(ticket) => {
                  setSelectedTicket(ticket);
                  setShowDetailModal(true);
                }}
                isAdmin={true}
                loading={loading}
              />
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            {/* Stats */}
            <div className={`border ${theme === "dark" ? "border-slate-700" : "border-slate-200"} p-4 ${radiusClass}`}>
              <h3 className={`font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Übersicht
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Insgesamt:</span>
                  <span className="font-semibold">{tickets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Neu:</span>
                  <span className="font-semibold">{tickets.filter((t) => t.status === "new").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Offen:</span>
                  <span className="font-semibold">{tickets.filter((t) => t.status === "open").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Dringend:</span>
                  <span className="font-semibold">{tickets.filter((t) => t.priority === "urgent").length}</span>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            {selectedTicket && showDetailModal && (
              <AdminControls ticket={selectedTicket} onUpdate={fetchTickets} />
            )}
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && showDetailModal && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTicket(null);
          }}
          onUpdate={fetchTickets}
          isAdmin={true}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { getAllTickets } from "@/lib/db/tickets";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import type { TicketData } from "@/BackEnd/type";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import TicketDetail from "./components/TicketDetail";
import { Loader } from "lucide-react";

export default function KontaktAdmin() {
  const { theme, isRounded } = useTheme();
  const { user, userData } = useAuth();
  const { showErrorToast } = useNotificationToast();

  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

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

  const radiusClass = isRounded ? "rounded-lg" : "rounded-none";
  const containerClass = theme === "dark" ? "bg-black" : "bg-white";
  const headerBg = theme === "dark" ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${containerClass}`}>
      {/* Header */}
      <div className={`${headerBg} border-b p-4 sm:p-6 backdrop-blur-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>
            Meine Support-Tickets
          </h1>
          <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            Erstelle neue Tickets und verwalte deine bestehenden Anfragen
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <TicketForm onSubmit={fetchTickets} />
        </div>

        {/* Tickets List */}
        <div className="lg:col-span-2">
          <div className={`border ${theme === "dark" ? "border-slate-700" : "border-slate-200"} p-6 ${radiusClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                Deine Tickets
              </h2>
              {loading && <Loader size={20} className="animate-spin" />}
            </div>

            <TicketList
              tickets={tickets}
              onTicketClick={setSelectedTicket}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={fetchTickets}
        />
      )}
    </div>
  );
}

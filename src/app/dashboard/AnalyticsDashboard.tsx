"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { TrendingUp, Users, Calendar, BookOpen } from "lucide-react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  totalCourses: number;
  userGrowthTrend: { date: string; count: number }[];
  eventAttendanceTrend: { date: string; count: number }[];
  courseEnrollmentTrend: { date: string; count: number }[];
}

export default function AnalyticsDashboard() {
  const { theme, isRounded } = useTheme();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalEvents: 0,
    totalCourses: 0,
    userGrowthTrend: [],
    eventAttendanceTrend: [],
    courseEnrollmentTrend: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const coursesSnapshot = await getDocs(collection(db, "courses"));

        const totalUsers = usersSnapshot.size;
        const totalEvents = eventsSnapshot.size;
        const totalCourses = coursesSnapshot.size;

        const usersByDate: Record<string, number> = {};
        const eventsByDate: Record<string, number> = {};
        const coursesByDate: Record<string, number> = {};

        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt) {
            const dateStr =
              data.createdAt instanceof Date
                ? data.createdAt.toISOString().split("T")[0]
                : new Date(data.createdAt).toISOString().split("T")[0];
            usersByDate[dateStr] = (usersByDate[dateStr] || 0) + 1;
          }
        });

        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.date?.toDate) {
            const dateStr = data.date.toDate().toISOString().split("T")[0];
            eventsByDate[dateStr] = (eventsByDate[dateStr] || 0) + 1;
          }
        });

        coursesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt?.toDate) {
            const dateStr = data.createdAt.toDate().toISOString().split("T")[0];
            coursesByDate[dateStr] = (coursesByDate[dateStr] || 0) + 1;
          }
        });

        const userGrowthTrend = Object.entries(usersByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-7)
          .map(([date, count]) => ({ date, count }));

        const eventAttendanceTrend = Object.entries(eventsByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-7)
          .map(([date, count]) => ({ date, count }));

        const courseEnrollmentTrend = Object.entries(coursesByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-7)
          .map(([date, count]) => ({ date, count }));

        setAnalytics({
          totalUsers,
          totalEvents,
          totalCourses,
          userGrowthTrend,
          eventAttendanceTrend,
          courseEnrollmentTrend,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
  }: {
    icon: React.ComponentType<any>;
    label: string;
    value: number;
    trend?: number;
  }) => (
    <div
      className={`p-6 border transition-all duration-300 ${innerRoundedClass} ${
        theme === "dark"
          ? "bg-white/5 border-white/10 hover:bg-white/10"
          : "bg-white border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon
          className={`w-6 h-6 ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        />
        {trend !== undefined && (
          <span
            className={`text-xs font-mono ${
              trend > 0
                ? theme === "dark"
                  ? "text-emerald-400"
                  : "text-emerald-600"
                : theme === "dark"
                ? "text-gray-500"
                : "text-slate-500"
            }`}
          >
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p
        className={`text-xs font-mono tracking-widest uppercase mb-1 ${
          theme === "dark" ? "text-gray-500" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          theme === "dark" ? "text-white" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );

  const MiniChart = ({
    title,
    data,
  }: {
    title: string;
    data: { date: string; count: number }[];
  }) => {
    const maxValue = Math.max(...data.map((d) => d.count), 1);
    return (
      <div className={`p-6 border transition-all duration-300 ${innerRoundedClass} ${
        theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-white border-slate-300"
      }`}
      >
        <h4
          className={`text-sm font-semibold mb-4 ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h4>
        <div className="flex items-end justify-between gap-1 h-32">
          {data.length === 0 ? (
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-500" : "text-slate-500"
              }`}
            >
              Keine Daten
            </p>
          ) : (
            data.map((point, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center"
                title={`${point.date}: ${point.count}`}
              >
                <div
                  className={`w-full transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-t from-green-500 to-green-400 hover:from-green-400 hover:to-green-300"
                      : "bg-gradient-to-t from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                  } ${isRounded ? "rounded-t" : ""}`}
                  style={{
                    height: `${(point.count / maxValue) * 100}%`,
                    minHeight: point.count > 0 ? "4px" : "0px",
                  }}
                />
                <p
                  className={`text-[10px] mt-2 ${
                    theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  {new Date(point.date).getDate()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className={`p-6 border transition-all duration-300 ${roundedClass} ${
          theme === "dark"
            ? "bg-white/5 border-white/10"
            : "bg-white border-slate-300"
        }`}
      >
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-slate-600"
          }`}
        >
          Lädt Analytics...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 border transition-all duration-300 space-y-6 ${roundedClass} ${
        theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-white border-slate-300"
      }`}
    >
      <div>
        <h3
          className={`text-sm font-mono tracking-widest uppercase mb-6 ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        >
          Analytics Dashboard
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Gesamtnutzer"
            value={analytics.totalUsers}
          />
          <StatCard
            icon={Calendar}
            label="Veranstaltungen"
            value={analytics.totalEvents}
          />
          <StatCard
            icon={BookOpen}
            label="Kurse"
            value={analytics.totalCourses}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MiniChart
            title="Nutzer (7 Tage)"
            data={analytics.userGrowthTrend}
          />
          <MiniChart
            title="Veranstaltungen (7 Tage)"
            data={analytics.eventAttendanceTrend}
          />
          <MiniChart
            title="Kurse (7 Tage)"
            data={analytics.courseEnrollmentTrend}
          />
        </div>
      </div>
    </div>
  );
}

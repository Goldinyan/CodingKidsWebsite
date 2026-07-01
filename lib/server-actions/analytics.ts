"use server";

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { MetricServiceClient } from "@google-cloud/monitoring";

interface VisitorStatsData {
  date: string;
  activeUsers: number;
  pageViews: number;
}

interface FirestoreMetricsData {
  date: string;
  reads: number;
  writes: number;
}

interface CombinedAnalytics {
  date: string;
  activeUsers: number;
  pageViews: number;
  reads: number;
  writes: number;
}

export async function getVisitorStats(): Promise<VisitorStatsData[]> {
  try {
    const analyticsDataClient = new BetaAnalyticsDataClient();

    const propertyId = process.env.NEXT_PUBLIC_GA_PROPERTY_ID;
    if (!propertyId) {
      console.warn("NEXT_PUBLIC_GA_PROPERTY_ID not set, returning mock data");
      return getMockVisitorData();
    }

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}${month}${day}`;
    };

    const request = {
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
          desc: false,
        },
      ],
    };

    const response = await analyticsDataClient.runReport(request);
    const analyticsResponse = Array.isArray(response) ? response[0] : response;

    const visitorStats: VisitorStatsData[] = [];

    if (analyticsResponse.rows) {
      analyticsResponse.rows.forEach((row) => {
        const dateStr = row.dimensionValues?.[0]?.value || "";
        const formattedDate = dateStr.replace(
          /(\d{4})(\d{2})(\d{2})/,
          "$1-$2-$3",
        );

        const activeUsers = parseInt(row.metricValues?.[0]?.value || "0", 10);
        const pageViews = parseInt(row.metricValues?.[1]?.value || "0", 10);

        visitorStats.push({
          date: formattedDate,
          activeUsers,
          pageViews,
        });
      });
    }

    return visitorStats;
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return getMockVisitorData();
  }
}

export async function getFirestoreMetrics(): Promise<FirestoreMetricsData[]> {
  try {
    // FIX 2: Korrekte Instanziierung des Clients
    const monitoringClient = new MetricServiceClient();

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.warn(
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID not set, returning mock data",
      );
      return getMockFirestoreData();
    }

    const projectName = monitoringClient.projectPath(projectId);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const endTime = {
      seconds: Math.floor(now.getTime() / 1000),
      nanos: (now.getTime() % 1000) * 1000000,
    };

    const startTime = {
      seconds: Math.floor(sevenDaysAgo.getTime() / 1000),
      nanos: (sevenDaysAgo.getTime() % 1000) * 1000000,
    };

    const interval = {
      endTime,
      startTime,
    };

    const metricsMap: { [key: string]: FirestoreMetricsData } = {};

    const metricTypes = [
      "firestore.googleapis.com/document/read_count",
      "firestore.googleapis.com/document/write_count",
    ];

    for (const metricType of metricTypes) {
      const request = {
        name: projectName,
        filter: `metric.type="${metricType}" AND resource.type="firestore_instance"`,
        interval,
        aggregation: {
          alignmentPeriod: {
            seconds: 86400, // Daten pro Tag aggregieren
          },
          perSeriesAligner: 2, // 2 entspricht ALIGN_SUM
        },
      };

      const [timeSeries] = await monitoringClient.listTimeSeries(request);

      if (timeSeries && Array.isArray(timeSeries)) {
        timeSeries.forEach((series: any) => {
          if (series.points && Array.isArray(series.points)) {
            series.points.forEach((point: any) => {
              const timestamp = point.interval?.endTime;
              if (timestamp?.seconds) {
                const date = new Date(timestamp.seconds * 1000);
                const dateStr = date.toISOString().split("T")[0];

                if (!metricsMap[dateStr]) {
                  metricsMap[dateStr] = {
                    date: dateStr,
                    reads: 0,
                    writes: 0,
                  };
                }

                // FIX 1: int64Value statt doubleValue nutzen
                const value = parseInt(
                  point.value?.int64Value?.toString() || "0",
                  10,
                );

                if (metricType.includes("read_count")) {
                  metricsMap[dateStr].reads += value;
                } else if (metricType.includes("write_count")) {
                  metricsMap[dateStr].writes += value;
                }
              }
            });
          }
        });
      }
    }

    const metrics = Object.values(metricsMap).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    return metrics;
  } catch (error) {
    console.error("Error fetching Firestore metrics:", error);
    return getMockFirestoreData();
  }
}

export async function getCombinedAnalytics(): Promise<CombinedAnalytics[]> {
  try {
    const [visitorStats, firestoreMetrics] = await Promise.all([
      getVisitorStats(),
      getFirestoreMetrics(),
    ]);

    const allDates = new Set([
      ...visitorStats.map((v) => v.date),
      ...firestoreMetrics.map((f) => f.date),
    ]);

    const combined = Array.from(allDates)
      .sort()
      .map((date) => {
        const visitor = visitorStats.find((v) => v.date === date);
        const firestore = firestoreMetrics.find((f) => f.date === date);

        return {
          date,
          activeUsers: visitor?.activeUsers || 0,
          pageViews: visitor?.pageViews || 0,
          reads: firestore?.reads || 0,
          writes: firestore?.writes || 0,
        };
      });

    return combined;
  } catch (error) {
    console.error("Error fetching combined analytics:", error);
    return getMockCombinedData();
  }
}

function getMockVisitorData(): VisitorStatsData[] {
  const data: VisitorStatsData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      activeUsers: Math.floor(Math.random() * 100) + 20,
      pageViews: Math.floor(Math.random() * 500) + 100,
    });
  }
  return data;
}

function getMockFirestoreData(): FirestoreMetricsData[] {
  const data: FirestoreMetricsData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      reads: Math.floor(Math.random() * 1000) + 200,
      writes: Math.floor(Math.random() * 500) + 100,
    });
  }
  return data;
}

function getMockCombinedData(): CombinedAnalytics[] {
  const data: CombinedAnalytics[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      activeUsers: Math.floor(Math.random() * 100) + 20,
      pageViews: Math.floor(Math.random() * 500) + 100,
      reads: Math.floor(Math.random() * 1000) + 200,
      writes: Math.floor(Math.random() * 500) + 100,
    });
  }
  return data;
}

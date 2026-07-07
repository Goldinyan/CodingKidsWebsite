"use client";


import { useAuth } from "@/context/AuthContext";
import { MainOverlayAdminDashboard } from "./MainOverlayAdminDashboard";
import { notFound } from "next/navigation";

export default function Home() {
  const { user, loading, userData } = useAuth();

  if (loading) return <p>Lade...</p>;
  if (!user) notFound();
  if (!userData) notFound();
  if (userData.role !== "admin") notFound();

  return <MainOverlayAdminDashboard  />;
}

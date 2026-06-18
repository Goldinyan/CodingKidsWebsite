"use client";


import { useAuth } from "@/BackEnd/AuthContext";
import { MainOverlayAdminDashboard } from "./MainOverlayAdminDashboard";
import { notFound } from "next/navigation";

export default function Home() {
  const { user, loading, userData } = useAuth();

  if (loading) return <p>Lade...</p>;
  if (!user) return notFound;
  if (!userData) return notFound;
  if (userData.role !== "admin") return notFound;

  return <MainOverlayAdminDashboard userData={userData} />;
}

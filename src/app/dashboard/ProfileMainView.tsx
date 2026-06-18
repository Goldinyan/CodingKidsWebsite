"use client";

import { useState, useEffect } from "react";
import { getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import { UserData } from "@/BackEnd/type";
import { MainOverlayAdminDashboard } from "./MainOverlayAdminDashboard";
import { notFound } from "next/navigation";

export default function ProfileMainView() {
  const { user, loading, userData } = useAuth();

  if (loading) return <p>Lade...</p>;
  if (!user) return notFound;
  if (!userData) return notFound;
  if (userData.role !== "admin") return notFound;

  return <MainOverlayAdminDashboard />;
}

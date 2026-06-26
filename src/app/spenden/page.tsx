"use client";
import { useAuth } from "@/BackEnd/AuthContext";
import GiftingMainView from "./GiftingMainView";
import { notFound } from "next/navigation";

export default function Home() {
  const { user, loading, userData } = useAuth();

  if (loading) return <p>Lade...</p>;

  notFound();
  return;

  return (
    <div className="w-full h-full bg-otherbg ">
      <GiftingMainView />
    </div>
  );
}

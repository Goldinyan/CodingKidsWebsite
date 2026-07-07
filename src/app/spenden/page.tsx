"use client";
import GiftingMainView from "./GiftingMainView";
import { notFound } from "next/navigation";

export default function Home() {
  notFound();
  return;

  return (
    <div className="w-full h-full bg-otherbg ">
      <GiftingMainView />
    </div>
  );
}

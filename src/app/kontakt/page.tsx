"use client";

import { useAuth } from "@/BackEnd/AuthContext";
import { useEffect } from "react";
import NoUserKontakt from "./NoUserKontakt";

export default function Home() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
    }
  }, [user, loading]);

  if (!user) return <NoUserKontakt />;

  return <div></div>;
}

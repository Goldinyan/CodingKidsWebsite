"use client";
import { useAuth } from "@/BackEnd/AuthContext";
import MailForm from "./Mailform";

export default function MainView() {
  const { user, loading } = useAuth();

  return (
    <div className="w-full">
      <div className="pt-20">
        {" "}
        <p className="text-black text-5xl">
          {user ? user?.displayName : "Guest"}
        </p>
        <MailForm />
      </div>
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation"; // für App Router (Next.js 13+)
import { registerUser } from "@/lib/auth";
import { useState } from "react";

export default function RegisterView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secpassword, setSecpassword] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  const router = useRouter();

  const handleRegister = async () => {
    if (password !== secpassword) {
      alert("Passwörter stimmen nicht überein");
      return;
    }
    if (!birthdate) {
      alert("Bitte gib dein Geburtsdatum an");
      return;
    }

    try {
      await registerUser(email, password, {
        name,
        birthdate,
      });

      
      router.push("/"); 
    } catch (err) {
      console.error("Fehler:", err);
      alert("Registrierung fehlgeschlagen");
    }
  };

  return (
    <div className="flex flex-col w-[30vw]">
      <input
        className="p-[2vh] m-[2vh]  bg-gray-500"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        className="p-[2vh] m-[2vh]  bg-gray-500"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <input
        className="p-[2vh] m-[2vh]  bg-gray-500"
        type="password"
        value={secpassword}
        onChange={(e) => setSecpassword(e.target.value)}
        placeholder="sec Password"
      />
      <input
        className="p-[2vh] m-[2vh]  bg-gray-500"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
      />
      <input
        className="p-[2vh] m-[2vh]  bg-gray-500"
        type="date"
        value={birthdate?.toISOString().split("T")[0] ?? ""}
        onChange={(e) => setBirthdate(new Date(e.target.value))}
      />

      <p
        className="w-[10vw] h-[5vh] bg-blue-200"
        onClick={() => {
          handleRegister();
          console.log("handle Register");
        }}
      >
        Registrieren
      </p>
    </div>
  );
}

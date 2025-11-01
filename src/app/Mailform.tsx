"use client";

import { useState } from "react";

export default function MailForm() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setStatus("⏳ Sende E-Mail...");


  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });

    // Prüfe, ob die Antwort überhaupt JSON ist
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    console.log("Status:", res.status);
console.log("Text:", text);

    if (res.ok && data.success) {
      setStatus("✅ E-Mail erfolgreich gesendet!");
    } else {
      setStatus("❌ Fehler: " + (data.error || "Unbekannter Fehler"));
    }
  } catch (err) {
    setStatus("❌ Netzwerkfehler oder ungültige Antwort");
    console.error("Fehler beim Senden:", err);
  }
}


  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input type="email" placeholder="Empfänger" value={to} onChange={(e) => setTo(e.target.value)} required />
      <input type="text" placeholder="Betreff" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      <textarea placeholder="HTML-Inhalt" value={html} onChange={(e) => setHtml(e.target.value)} required />
      <button type="submit">E-Mail senden</button>
      <p>{status}</p>
    </form>
  );
}

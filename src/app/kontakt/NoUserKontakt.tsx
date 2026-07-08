"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { sendEmailToSupport } from "@/BackEnd/email";
import { useState } from "react";
import { Theme, useTheme } from "@/context/ThemeContext";
import { useNotificationToast } from "@/hooks/useNotificationToast";

type EmailProps = {
  name: string;
  email: string;
  phone: string;
  subject: Betreff;
  body: string;
};

const Betreffe = [
  "Technischer Support",
  "Allgemeine Anfrage",
  "Feedback",
  "Rechnung",
  "Sonstiges",
] as const;

type Betreff = (typeof Betreffe)[number];

export default function NoUserKontakt() {
  const [emailProps, setEmailProps] = useState<EmailProps>({
    name: "",
    email: "",
    phone: "",
    subject: "Allgemeine Anfrage",
    body: "",
  });

  const { theme, isRounded } = useTheme();
  const { showErrorToast } = useNotificationToast();

  const [errors, setErrors] = useState<{
    name?: boolean;
    email?: boolean;
    body?: boolean;
  }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const stuff: { text: string; Icon: any }[] = [
    { text: "info@coding.com", Icon: Mail },
    { text: "0163 6711609", Icon: Phone },
    { text: "Rudolf-Diesel-Straße 115, 46485 Wesel", Icon: MapPin },
  ];

  const handleEmailSending = async () => {
    setErrors({});
    setErrorMessage("");

    const newErrors: { name?: boolean; email?: boolean; body?: boolean } = {};
    let errorMsg = "";

    if (!emailProps.name || emailProps.name.trim() === "") {
      newErrors.name = true;
      errorMsg = "Bitte geben Sie Ihren Namen ein.";
    }

    if (!emailProps.email || emailProps.email.trim() === "") {
      newErrors.email = true;
      if (!errorMsg) errorMsg = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailProps.email)) {
      newErrors.email = true;
      if (!errorMsg)
        errorMsg = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }

    if (!emailProps.body || emailProps.body.trim() === "") {
      newErrors.body = true;
      if (!errorMsg) errorMsg = "Bitte geben Sie eine Nachricht ein.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage(errorMsg);
      return;
    }

    try {
      await sendEmailToSupport(
        emailProps.email,
        emailProps.subject,
        emailProps.body,
        emailProps.email,
        emailProps.phone,
        emailProps.name,
      );

      setEmailProps({
        name: "",
        email: "",
        phone: "",
        subject: "Allgemeine Anfrage",
        body: "",
      });
      setErrorMessage("");
    } catch (error) {
      showErrorToast(error);
      setErrorMessage(
        "Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.",
      );
    }
  };

  const borderClass = theme === "dark" ? "border-zinc-800" : "border-zinc-200";
  const bgCardClass = theme === "dark" ? "bg-white/5" : "bg-zinc-50";
  const textTitleClass = theme === "dark" ? "text-white" : "text-black";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-500";

  const inputBgClass = theme === "dark" ? "bg-white/5" : "bg-white";
  const inputBorderClass =
    theme === "dark" ? "border-zinc-800" : "border-zinc-300";
  const inputFocusClass =
    theme === "dark" ? "focus:border-zinc-400" : "focus:border-zinc-900";

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="pt-32 pb-12 flex flex-col items-start px-6"
      >
        <span
          className={`text-xs font-mono tracking-widest uppercase mb-3 ${theme === "dark" ? "text-green-500" : "text-green-500"}`}
        >
          Kontakt aufnehmen
        </span>
        <h2
          className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${textTitleClass}`}
        >
          In Kontakt treten
        </h2>
        <p className={`text-md w-[80%] font-gro font-light ${textMutedClass}`}>
          Füllen Sie das Formular aus oder melden Sie sich direkt bei uns. Wir
          freuen uns auf den Austausch.
        </p>
      </motion.div>

      <div className="pb-24 pt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 items-stretch">
        <div
          className={`border p-6 md:p-8 backdrop-blur-2xl flex flex-col justify-between ${borderClass} ${bgCardClass} ${isRounded ? "rounded-2xl" : "rounded-none"
            }`}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="flex flex-col">
                <label
                  className={`text-xs font-mono uppercase tracking-wider mb-2 ${theme === "dark" ? "text-gray-400" : "text-zinc-700"}`}
                >
                  Dein Name
                </label>
                <input
                  type="text"
                  value={emailProps.name}
                  onChange={(e) => {
                    setEmailProps((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: false }));
                  }}
                  className={`border p-3 outline-none transition-all duration-200 text-sm ${inputBgClass} ${inputFocusClass} ${errors.name
                      ? "border-red-500 focus:border-red-500"
                      : inputBorderClass
                    } ${isRounded ? "rounded-lg" : "rounded-none"}`}
                  placeholder="Vollständiger Name"
                />
              </div>

              <div className="flex flex-col">
                <label
                  className={`text-xs font-mono uppercase tracking-wider mb-2 ${theme === "dark" ? "text-gray-400" : "text-zinc-700"}`}
                >
                  E-Mail Adresse
                </label>
                <input
                  type="email"
                  value={emailProps.email}
                  onChange={(e) => {
                    setEmailProps((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: false }));
                  }}
                  className={`border p-3 outline-none transition-all duration-200 text-sm ${inputBgClass} ${inputFocusClass} ${errors.email
                      ? "border-red-500 focus:border-red-500"
                      : inputBorderClass
                    } ${isRounded ? "rounded-lg" : "rounded-none"}`}
                  placeholder="name@beispiel.de"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="flex flex-col">
                <label
                  className={`text-xs font-mono uppercase tracking-wider mb-2 ${theme === "dark" ? "text-gray-400" : "text-zinc-700"}`}
                >
                  Telefonnummer <span className="opacity-50">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={emailProps.phone}
                  onChange={(e) =>
                    setEmailProps((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className={`border p-3 outline-none transition-all duration-200 text-sm ${inputBgClass} ${inputFocusClass} ${inputBorderClass} ${isRounded ? "rounded-lg" : "rounded-none"
                    }`}
                  placeholder="Handy- oder Festnetz"
                />
              </div>

              <div className="flex flex-col">
                <label
                  className={`text-xs font-mono uppercase tracking-wider mb-2 ${theme === "dark" ? "text-gray-400" : "text-zinc-700"}`}
                >
                  Betreff
                </label>
                <select
                  value={emailProps.subject}
                  onChange={(e) =>
                    setEmailProps((prev) => ({
                      ...prev,
                      subject: e.target.value as Betreff,
                    }))
                  }
                  className={`border p-3 outline-none transition-all duration-200 text-sm appearance-none cursor-pointer ${inputBgClass} ${inputFocusClass} ${inputBorderClass} ${isRounded ? "rounded-lg" : "rounded-none"
                    }`}
                >
                  {Betreffe.map((b) => (
                    <option
                      key={b}
                      value={b}
                      className={theme === "dark" ? "bg-zinc-900" : "bg-white"}
                    >
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label
                className={`text-xs font-mono uppercase tracking-wider mb-2 ${theme === "dark" ? "text-gray-400" : "text-zinc-700"}`}
              >
                Deine Nachricht
              </label>
              <textarea
                value={emailProps.body}
                onChange={(e) => {
                  setEmailProps((prev) => ({ ...prev, body: e.target.value }));
                  if (errors.body)
                    setErrors((prev) => ({ ...prev, body: false }));
                }}
                rows={5}
                className={`border p-3 outline-none transition-all duration-200 text-sm resize-none ${inputBgClass} ${inputFocusClass} ${errors.body
                    ? "border-red-500 focus:border-red-500"
                    : inputBorderClass
                  } ${isRounded ? "rounded-lg" : "rounded-none"}`}
                placeholder="Wie können wir Ihnen weiterhelfen?"
              />
            </div>
          </div>

          <div className="pt-6">
            {errorMessage && (
              <p className="text-red-500 text-xs mb-3 text-center font-medium">
                {errorMessage}
              </p>
            )}
            <button
              onClick={handleEmailSending}
              className={`w-full py-4 text-sm font-medium tracking-wide transition-all duration-200 hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-2 group/btn ${theme === "dark"
                  ? "bg-white text-black hover:bg-zinc-200 shadow-sm"
                  : "bg-black text-white hover:bg-zinc-800 shadow-sm"
                } ${isRounded ? "rounded-lg" : "rounded-none"}`}
            >
              <span>Nachricht senden</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-10">
          <div>
            <h3
              className={`font-bold text-2xl tracking-tight mb-6 ${textTitleClass}`}
            >
              Direkte Erreichbarkeit
            </h3>
            <div className="flex flex-col gap-6">
              {stuff.map((s, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div
                    className={`w-10 h-10 border flex items-center justify-center flex-shrink-0 ${borderClass} ${theme === "dark" ? "bg-white/5" : "bg-zinc-50"
                      } ${isRounded ? "rounded-lg" : "rounded-none"}`}
                  >
                    <s.Icon
                      className={`w-4 h-4 ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}
                    />
                  </div>
                  <p
                    className={`text-sm tracking-wide font-light ${theme === "dark" ? "text-gray-300" : "text-zinc-800"}`}
                  >
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col flex-grow pt-4">
            <h3
              className={`font-bold text-2xl tracking-tight mb-4 ${textTitleClass}`}
            >
              Standort
            </h3>
            <div
              className={`w-full flex-grow border overflow-hidden relative min-h-[220px] ${borderClass} ${isRounded ? "rounded-2xl" : "rounded-none"
                }`}
            >
              <iframe
                src="https://maps.google.com/maps?q=Rudolf-Diesel-Stra%C3%9Fe%20115,%2046485%20Wesel&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: "0",
                  filter:
                    theme === "dark"
                      ? "grayscale(1) invert(0.9) contrast(1.2)"
                      : "none",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

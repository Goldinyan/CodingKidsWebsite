"use client";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { sendEmailToSupport } from "@/BackEnd/email";
import { useState } from "react";

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

// Type automatisch aus dem Array abgeleitet
type Betreff = (typeof Betreffe)[number];

export default function NoUserKontakt() {
  const [emailProps, setEmailProps] = useState<EmailProps>({
    name: "",
    email: "",
    phone: "",
    subject: "Allgemeine Anfrage",
    body: "",
  });

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

  const handleEmailSending = async() => {
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
      if (!errorMsg) errorMsg = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
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
        emailProps.name
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
      setErrorMessage("Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.");
    }
  }
  return (
    <div className="w-full h-full bg-otherbg min-h-screen">
       <div className="pt-25 flex flex-col gap-2">
          <p className="text-3xl font-bold text-center">In Kontakt treten</p>
          <p className="text-graytext text-center">
            Füllen Sie das Formular aus oder melden Sie sich direkt. Wir freuen
            uns auf Sie.
          </p>
          </div>
      <div className="pb-20 pt-15 md:grid-cols-2 grid gap-10 grid-cols-1 mx-[5%]">
        
        <div className="border bg-white border-secondaryOwn rounded-2xl">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 p-5">
            <div className="flex flex-col">
              <label className="font-semibold">Dein Name</label>
              <input
                value={emailProps?.name || ""}
                onChange={(e) => {
                  setEmailProps((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: false }));
                  }
                }}
                className={`bg-white border p-2 rounded-lg mt-2 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Vollständiger Namen"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Email Adresse</label>
              <input
                value={emailProps?.email || ""}
                onChange={(e) => {
                  setEmailProps((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: false }));
                  }
                }}
                className={`bg-white border p-2 rounded-lg mt-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="du@gmail.com"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">
                {"Telofonnummer (optional)"}
              </label>
              <input
                value={emailProps?.phone || ""}
                onChange={(e) =>
                  setEmailProps((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="border-gray-300 bg-white border p-2 rounded-lg mt-2"
                placeholder="Handynummer"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Betreff</label>
              <select
                value={emailProps?.subject || ""}
                onChange={(e) =>
                  setEmailProps((prev) => ({
                    ...prev,
                    subject: e.target.value as Betreff,
                  }))
                }
                className="border-gray-300 bg-white border p-2 rounded-lg mt-2"
              >
                {Betreffe.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col p-5">
            <label className="font-semibold">Deine Nachricht</label>
            <textarea
              value={emailProps?.body || ""}
              onChange={(e) => {
                setEmailProps((prev) => ({ ...prev, body: e.target.value }));
                if (errors.body) {
                  setErrors((prev) => ({ ...prev, body: false }));
                }
              }}
              className={`h-20 bg-white border p-2 rounded-lg mt-2 ${
                errors.body ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Sage uns wie wir dir helfen können"
            />
          </div>
          <div className="p-5">
            {errorMessage && (
              <p className="text-red-500 text-sm mb-3 text-center">
                {errorMessage}
              </p>
            )}
            <div onClick={() => handleEmailSending()}>
              <Button className="py-6 w-full group bg-fourthOwn hover:bg-white border hover:border-fourthOwn transition-all duration-200 ">
                <p className="group-hover:text-black">Nachricht senden</p>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col ">
          <p className="font-bold text-2xl">Andere Wege uns zu erreichen:</p>
          <div className="flex flex-col gap-5 pt-4">
            {stuff.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-start gap-2 flex-row"
              >
                <s.Icon className="w-5 h-5 text-fourthOwn" />
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <p className="pt-5 font-bold text-2xl pb-5">Finde uns hier</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.59027887105!2d6.663062212202145!3d51.667337571732794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b88fe13e2b821d%3A0x1698a4fadd47ca72!2sRudolf-Diesel-Stra%C3%9Fe%20115%2C%2046485%20Wesel!5e0!3m2!1sde!2sde!4v1764428777335!5m2!1sde!2sde"
            width="w-full"
            height="200"
            style={{ border: "0" }}
            allowFullScreen
            className="rounded-2xl"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Mail, Phone, MapPin } from "lucide-react";


export default function NoUserKontakt() {
  const stuff: { text: string; Icon: any }[] = [
    { text: "info@coding.com", Icon: Mail },
    { text: "0163 6711609", Icon: Phone },
    { text: "Rudolf-Diesel-Straße 115, 46485 Wesel", Icon: MapPin },
  ];

  return (
    <div>
      <div className="pt-20 md:grid-cols-2 grid gap-5 grid-cols-1 mx-[5%]">
        <div className="border border-secondaryOwn">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col"><label>Dein Name</label></div>
            <div className="flex flex-col"><label>Email Adresse</label></div>
            <div><label>{"Telofonnummer (optional)"}</label></div>
            <div><label>Betreff</label></div>
          </div>
          <div>
            <label>Deine Nachricht</label>
          </div>
        </div>
        <div className="border border-primaryOwn flex flex-col">
          <p>Andere Wege uns zu erreichen</p>
          {stuff.map((s, idx) => (
            <div key={idx} className="flex flex-row">
              <s.Icon className="w-5 h-5" />
              <p>{s.text}</p>
            </div>
          ))}
          <p>Finde uns hier</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.59027887105!2d6.663062212202145!3d51.667337571732794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b88fe13e2b821d%3A0x1698a4fadd47ca72!2sRudolf-Diesel-Stra%C3%9Fe%20115%2C%2046485%20Wesel!5e0!3m2!1sde!2sde!4v1764428777335!5m2!1sde!2sde"
            width="w-full"
            height="200"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}


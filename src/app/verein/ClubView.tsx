"use client";

import { useState, useEffect } from "react";
import WerWirSind from "./WerWirSind";
import Support from "./Support";

export default function ClubViews() {
  return (
    <div className="max-w-7xl mx-auto">
      <section id="wir">
        <WerWirSind />
      </section>
      <section id="mitglied">
        <Support />
      </section>
      <section id="kontakt"></section>
    </div>
  );
}

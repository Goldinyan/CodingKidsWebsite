"use client";

import WerWirSind from "./WerWirSind";
import Support from "./Support";
import Partners from "./Partners";

export default function ClubViews() {
  return (
    <div className="max-w-7xl mx-auto">
      <section id="wir">
        <WerWirSind />
      </section>
      <Partners />
      <section id="mitglied">
        <Support />
      </section>
      <section id="kontakt"></section>
    </div>
  );
}

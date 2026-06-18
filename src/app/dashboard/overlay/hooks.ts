// src/app/dashboard/overlay/hooks.ts

import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Section = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export function useScrollSpy(
  sections: Section[],
  isInSection: (id: string) => boolean,
) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      for (const s of sections) {
        if (isInSection(s.id)) {
          setActiveSection(s.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return activeSection;
}

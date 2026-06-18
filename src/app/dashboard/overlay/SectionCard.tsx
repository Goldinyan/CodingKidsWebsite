// src/app/dashboard/overlay/SectionCard.tsx

import { LucideIcon } from "lucide-react";

export default function SectionCard({
  id,
  label,
  Icon,
  isActive,
  setOpen,
  scrollToSection,
}: {
  id: string;
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
  setOpen: (y: boolean) => void;
  scrollToSection: (section: string, setOpen: (y: boolean) => void) => void;
}) {
  return (
    <button
      onClick={() => scrollToSection(id, setOpen)}
      className={`group relative w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${isActive
          ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
          : "hover:bg-gray-50 border border-transparent"
        }`}
    >
      <div
        className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${isActive ? "bg-blue-600" : "bg-gray-100 group-hover:bg-gray-200"
          }`}
      >
        <Icon
          className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-gray-600"
            }`}
        />
      </div>

      <div className="flex-1 text-left">
        <p
          className={`text-sm font-medium transition-colors ${isActive
              ? "text-blue-900"
              : "text-gray-700 group-hover:text-gray-900"
            }`}
        >
          {label}
        </p>
      </div>
    </button>
  );
}

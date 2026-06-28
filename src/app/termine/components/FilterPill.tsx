"use client";

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function FilterPill({
  active,
  onClick,
  children,
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs border transition-all font-medium ${
        active
          ? "bg-green-500/10 border-green-500/30 text-green-500"
          : "bg-white/[0.03] border-white/[0.08] text-gray-500 hover:bg-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      {children}
    </button>
  );
}

"use client";

import { useTheme } from "@/context/ThemeContext";

export default function GlassCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { theme, isRounded } = useTheme();
  const isDark = theme === "dark";

  const borderRadius = isRounded ? "rounded-2xl" : "rounded-none";
  const borderColor = isDark
    ? "border-white/[0.07] hover:border-green-400/40"
    : "border-slate-200 hover:border-green-500/50";

  const background = isDark
    ? "rgba(255,255,255,0.025)"
    : "rgba(248, 250, 252, 0.7)";

  return (
    <div
      className={`border transition-all duration-300 ${borderRadius} ${borderColor} ${className}`}
      style={{
        background: background,
        backdropFilter: "blur(12px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

import { useTheme } from "@/context/ThemeContext";


export default function SectionLabel({ children }: { children: string }) {
  const { theme } = useTheme();
  return (
    <p
      className="text-[10px] tracking-[0.22em] uppercase mb-2"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: theme === "dark" ? "#4ade80" : "#16a34a",
      }}
    >
      {children}
    </p>
  );
}


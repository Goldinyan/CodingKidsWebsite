import { useTheme } from "@/context/ThemeContext";

export default function Chip({ children }: { children: string }) {
  const { theme } = useTheme();

  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${theme === "dark" ? "bg-[#0B160F] border-green-900 text-green-400" : "bg-green-200 text-green-600 border-green-400"}`}>
      {children}
    </span>
  );
}

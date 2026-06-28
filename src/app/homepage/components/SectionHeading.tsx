import { useTheme } from "@/context/ThemeContext";

export default function SectionHeading({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <h2
      className={`text-2xl font-black tracking-tight transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-slate-900"
        }`}
      style={{ fontFamily: "'Familjen Grotesk', sans-serif" }}
    >
      {children}
    </h2>
  );
}

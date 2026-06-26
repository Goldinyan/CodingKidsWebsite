export default function GlassCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.07] hover:border-green-400/40 transition-all duration-300 ${className}`}
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(12px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function Chip({
  children,
  color = "#4ade80",
}: {
  children: string;
  color?: string;
}) {
  return (
    <span
      className="text-[10px] font-mono px-2 py-0.5 rounded-md border"
      style={{
        color,
        background: `${color}14`,
        borderColor: `${color}30`,
      }}
    >
      {children}
    </span>
  );
}

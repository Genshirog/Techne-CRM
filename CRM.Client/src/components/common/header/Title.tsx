import type { LucideIcon } from "lucide-react";

interface TitleProps {
  label: string;
  icon: LucideIcon;
  iconSize?: number;
  iconColor?: string;
  iconBg?: string;
}

export default function TitleComponent({
  label,
  icon: Icon,
  iconSize = 16,
  iconColor = "#818cf8",
  iconBg = "rgba(99,102,241,0.15)",
}: TitleProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={iconSize} color={iconColor} />
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
        {label}
      </h1>
    </div>
  );
}
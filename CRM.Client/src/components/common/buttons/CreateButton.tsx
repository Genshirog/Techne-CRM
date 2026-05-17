import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateButtonProps {
  to: string;
  label: string;
  iconSize?: number;
}

export default function CreateButton({ to, label, iconSize = 15 }: CreateButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        background: "#6366f1",
        border: "none",
        borderRadius: 8,
        padding: "9px 18px",
        color: "#fff",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
    >
      <Plus size={iconSize} />
      {label}
    </button>
  );
}
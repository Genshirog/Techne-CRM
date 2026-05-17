// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";
import { colors } from "../styles/variables";

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${colors.bg} 0%, #0d1f15 50%, #0a1a10 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center", // ← must be center
      padding: "2rem 1rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 860, // ← wider for register two-column
      }}>
        <Outlet />
      </div>
    </div>
  );
}
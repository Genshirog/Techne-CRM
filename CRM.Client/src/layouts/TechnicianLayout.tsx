import { Outlet } from "react-router-dom";
import Sidebar from "../components/technician/Sidebar";

export default function TechnicianLayout() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "row", overflow: "hidden" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet /> {/* ← pages render here */}
      </main>
    </div>
  );
}
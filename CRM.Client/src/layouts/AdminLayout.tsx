import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "row", overflow: "hidden" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet /> {/* ← pages render here */}
      </main>
    </div>
  );
}
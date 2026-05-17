import { Outlet } from "react-router-dom"
import Sidebar from "../components/customer/Sidebar"

export default function CustomerLayout() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "row", overflow: "hidden" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  )
}
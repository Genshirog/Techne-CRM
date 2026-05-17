import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, MessageSquare, Stethoscope, FileText,
  ClipboardList, ScrollText, Ticket, Wrench, HardHat,
  Users, BarChart2, LogOut, Settings, CircleDollarSign
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const navLinks = [
  { label: "Dashboard",          href: "/admin/dashboard",          icon: LayoutDashboard },
  { label: "Inquiries",          href: "/admin/inquiries",          icon: MessageSquare   },
  { label: "Diagnosis",          href: "/admin/diagnosis",          icon: Stethoscope     },
  { label: "Quotations",         href: "/admin/quotations",         icon: FileText        },
  { label: "Job Orders",         href: "/admin/job-orders",         icon: ClipboardList   },
  { label: "Service Agreements", href: "/admin/service-agreements", icon: ScrollText      },
  { label: "Invoices",           href: "/admin/invoices",           icon: CircleDollarSign},
  { label: "Tickets",            href: "/admin/tickets",            icon: Ticket          },
  { label: "Services",           href: "/admin/services",           icon: Wrench          },
  { label: "Devices",            href: "/admin/devices",            icon: Wrench          },
  { label: "Campaign",           href: "/admin/campaigns",          icon: Wrench          },
  { label: "Technicians",        href: "/admin/technicians",        icon: HardHat         },
  { label: "Customers",          href: "/admin/customers",          icon: Users           },
  { label: "Reports",            href: "/admin/reports",            icon: BarChart2       },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const collapsed = !open

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav
      onClick={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        width: collapsed ? 64 : 240,
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        transition: "width 260ms cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        cursor: collapsed ? "pointer" : "default",
      }}
    >
      {/* Logo / Header */}
      <div style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: collapsed ? "0 16px" : "0 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        gap: 10, flexShrink: 0, overflow: "hidden", whiteSpace: "nowrap",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontWeight: 700, fontSize: 14, color: "#fff", letterSpacing: "-0.5px",
        }}>A</div>
        <span style={{
          color: "#f1f5f9", fontWeight: 600, fontSize: 15, letterSpacing: "-0.3px",
          opacity: collapsed ? 0 : 1, transition: "opacity 200ms ease", whiteSpace: "nowrap",
        }}>Admin Panel</span>
      </div>

      {/* Nav Items */}
      <div style={{
        flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        {navLinks.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            title={collapsed ? label : undefined}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: collapsed ? "9px 16px" : "9px 12px",
              borderRadius: 8, textDecoration: "none",
              color: isActive ? "#f1f5f9" : "#94a3b8",
              background: isActive ? "rgba(99,102,241,0.18)" : "transparent",
              transition: "background 150ms ease, color 150ms ease",
              whiteSpace: "nowrap", overflow: "hidden", cursor: "pointer",
              borderLeft: isActive ? "2px solid #6366f1" : "2px solid transparent",
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              if (!el.style.background.includes("99,102,241")) {
                el.style.background = "rgba(255,255,255,0.05)"
                el.style.color = "#e2e8f0"
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              if (!el.style.background.includes("99,102,241")) {
                el.style.background = "transparent"
                el.style.color = "#94a3b8"
              }
            }}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ flexShrink: 0, color: isActive ? "#818cf8" : "inherit" }} />
                <span style={{
                  fontSize: 13.5, fontWeight: isActive ? 500 : 400,
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                  transition: "opacity 200ms ease, width 200ms ease",
                  overflow: "hidden",
                }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Section */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "8px 8px", display: "flex", flexDirection: "column",
        gap: 2, flexShrink: 0,
      }}>
        {/* Settings */}
        <NavLink
          to="/admin/settings"
          title={collapsed ? "Settings" : undefined}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "9px 16px" : "9px 12px",
            borderRadius: 8, textDecoration: "none", color: "#94a3b8",
            transition: "background 150ms ease, color 150ms ease",
            whiteSpace: "nowrap", overflow: "hidden", cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)"
            e.currentTarget.style.color = "#e2e8f0"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = "#94a3b8"
          }}
        >
          <Settings size={18} style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: 13.5, opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : "auto",
            transition: "opacity 200ms ease, width 200ms ease",
            overflow: "hidden",
          }}>Settings</span>
        </NavLink>

        {/* Logout — button not NavLink */}
        <button
          onClick={handleLogout}
          title={collapsed ? "Log out" : undefined}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "9px 16px" : "9px 12px",
            borderRadius: 8, background: "transparent", border: "none",
            color: "#94a3b8", cursor: "pointer", whiteSpace: "nowrap",
            overflow: "hidden", width: "100%",
            transition: "background 150ms ease, color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.1)"
            e.currentTarget.style.color = "#f87171"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = "#94a3b8"
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: 13.5, opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : "auto",
            transition: "opacity 200ms ease, width 200ms ease",
            overflow: "hidden",
          }}>Log out</span>
        </button>
      </div>
    </nav>
  )
}
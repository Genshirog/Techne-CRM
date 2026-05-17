import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Wrench, Search, ChevronRight, CalendarDays,
  Inbox, Plus, DropletIcon, Zap, Wind, Hammer,
  Bell, CheckCircle2, AlertCircle, Clock, ArrowRight,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "Pending" | "Assigned" | "In Progress" | "Quoted" | "Closed"

interface CustomerInquiry {
  id: string
  service: string
  serviceIcon: "plumbing" | "electrical" | "hvac" | "general"
  address: string
  preferredDate: string
  submittedAt: string
  status: Status
  techName?: string
  lastUpdate?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MY_INQUIRIES: CustomerInquiry[] = [
  {
    id: "INQ-1040",
    service: "Plumbing Leak",
    serviceIcon: "plumbing",
    address: "42 Mahogany St., Davao City",
    preferredDate: "May 8, 2026",
    submittedAt: "May 6, 2026",
    status: "In Progress",
    techName: "Paulo Mendez",
    lastUpdate: "Tech is on-site diagnosing the issue.",
  },
  {
    id: "INQ-1035",
    service: "Pipe Replacement",
    serviceIcon: "plumbing",
    address: "42 Mahogany St., Davao City",
    preferredDate: "May 9, 2026",
    submittedAt: "May 4, 2026",
    status: "Assigned",
    techName: "Carlos Reyes",
    lastUpdate: "Technician assigned and will arrive soon.",
  },
  {
    id: "INQ-1029",
    service: "HVAC Repair",
    serviceIcon: "hvac",
    address: "42 Mahogany St., Davao City",
    preferredDate: "May 6, 2026",
    submittedAt: "Apr 30, 2026",
    status: "Quoted",
    techName: "Mia Santos",
    lastUpdate: "Quote ready for your review — ₱3,200.",
  },
  {
    id: "INQ-1031",
    service: "Electrical Wiring",
    serviceIcon: "electrical",
    address: "42 Mahogany St., Davao City",
    preferredDate: "May 7, 2026",
    submittedAt: "May 2, 2026",
    status: "Pending",
    lastUpdate: "We're matching you with a technician.",
  },
  {
    id: "INQ-1027",
    service: "AC Installation",
    serviceIcon: "hvac",
    address: "42 Mahogany St., Davao City",
    preferredDate: "May 3, 2026",
    submittedAt: "Apr 28, 2026",
    status: "Closed",
    techName: "Rey Dela Cruz",
    lastUpdate: "Job completed successfully.",
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: Status | "All" }[] = [
  { label: "All",         value: "All" },
  { label: "Pending",     value: "Pending" },
  { label: "Assigned",    value: "Assigned" },
  { label: "In Progress", value: "In Progress" },
  { label: "Quoted",      value: "Quoted" },
  { label: "Closed",      value: "Closed" },
]

const STATUS_STYLE: Record<Status, { bg: string; color: string; dot: string }> = {
  "Pending":     { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", dot: "#fbbf24" },
  "Assigned":    { bg: "rgba(129,140,248,0.12)", color: "#818cf8", dot: "#818cf8" },
  "In Progress": { bg: "rgba(52,211,153,0.12)",  color: "#34d399", dot: "#34d399" },
  "Quoted":      { bg: "rgba(167,139,250,0.12)", color: "#a78bfa", dot: "#a78bfa" },
  "Closed":      { bg: "rgba(100,116,139,0.12)", color: "#64748b", dot: "#64748b" },
}

const SERVICE_ICONS: Record<CustomerInquiry["serviceIcon"], React.ReactNode> = {
  plumbing:   <DropletIcon size={15} />,
  electrical: <Zap size={15} />,
  hvac:       <Wind size={15} />,
  general:    <Hammer size={15} />,
}

const SERVICE_COLORS: Record<CustomerInquiry["serviceIcon"], { bg: string; color: string }> = {
  plumbing:   { bg: "rgba(56,189,248,0.15)",  color: "#38bdf8" },
  electrical: { bg: "rgba(251,191,36,0.15)",  color: "#fbbf24" },
  hvac:       { bg: "rgba(52,211,153,0.15)",  color: "#34d399" },
  general:    { bg: "rgba(167,139,250,0.15)", color: "#a78bfa" },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerInquiriesPage() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState("")
  const [activeTab, setActiveTab] = useState<Status | "All">("All")

  const customerName = "Aisha Okonkwo"
  const initials     = "AO"

  const filtered = MY_INQUIRIES.filter(inq => {
    const matchTab    = activeTab === "All" || inq.status === activeTab
    const matchSearch = search === "" ||
      inq.service.toLowerCase().includes(search.toLowerCase()) ||
      inq.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const activeCount  = MY_INQUIRIES.filter(i => i.status === "Assigned" || i.status === "In Progress").length
  const quotedCount  = MY_INQUIRIES.filter(i => i.status === "Quoted").length
  const closedCount  = MY_INQUIRIES.filter(i => i.status === "Closed").length

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#f1f5f9",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>My Service Requests</h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>
            {activeCount > 0
              ? `${activeCount} active job${activeCount !== 1 ? "s" : ""} in progress`
              : "No active jobs right now"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button style={{
            position: "relative", background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8, color: "#64748b", cursor: "pointer",
            padding: "7px 10px", display: "flex", alignItems: "center",
          }}>
            <Bell size={16} />
            <span style={{
              position: "absolute", top: 6, right: 6,
              width: 7, height: 7, borderRadius: "50%",
              background: "#f87171", border: "2px solid #0f172a",
            }} />
          </button>
          <button
            onClick={() => navigate("/customer/inquiries/new")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#6366f1", border: "none", borderRadius: 8,
              padding: "8px 16px", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
            onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
          >
            <Plus size={14} /> New Request
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
          }}>
            {initials}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          {
            label: "Active Jobs",
            value: activeCount,
            icon: Clock,
            color: "#fbbf24",
            bg: "rgba(251,191,36,0.15)",
            badge: activeCount > 0 ? "In Progress" : undefined,
            badgeColor: "#fbbf24",
            badgeBg: "rgba(251,191,36,0.12)",
          },
          {
            label: "Quote Pending",
            value: quotedCount,
            icon: AlertCircle,
            color: "#a78bfa",
            bg: "rgba(167,139,250,0.15)",
            badge: quotedCount > 0 ? "Needs Review" : undefined,
            badgeColor: "#a78bfa",
            badgeBg: "rgba(167,139,250,0.12)",
          },
          {
            label: "Completed",
            value: closedCount,
            icon: CheckCircle2,
            color: "#34d399",
            bg: "rgba(52,211,153,0.15)",
          },
          {
            label: "Total Requests",
            value: MY_INQUIRIES.length,
            icon: Wrench,
            color: "#60a5fa",
            bg: "rgba(96,165,250,0.15)",
          },
        ].map(({ label, value, icon: Icon, color, bg, badge, badgeColor, badgeBg }) => (
          <div key={label} style={{
            background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={color} />
              </div>
              {badge && (
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: badgeBg, color: badgeColor, fontWeight: 500 }}>
                  {badge}
                </span>
              )}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div style={{
        background: "#1e293b",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, overflow: "hidden",
      }}>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap", gap: 12,
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 3 }}>
            {STATUS_TABS.map(tab => {
              const isActive = activeTab === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    padding: "6px 14px", borderRadius: 6,
                    fontSize: 12.5, fontWeight: isActive ? 500 : 400,
                    border: isActive ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                    background: isActive ? "#1e293b" : "transparent",
                    color: isActive ? "#e2e8f0" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8, padding: "7px 12px",
            }}>
              <Search size={13} color="#475569" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search service or ID…"
                style={{
                  border: "none", background: "transparent",
                  fontSize: 12.5, color: "#e2e8f0", outline: "none", width: 160,
                }}
              />
            </div>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#818cf8", textDecoration: "none" }}>
              View all <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "52px 28px", gap: 10,
          }}>
            <Inbox size={28} color="#334155" />
            <p style={{ fontSize: 13.5, color: "#475569", margin: 0 }}>No requests found.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["ID", "Service", "Last Update", "Preferred Date", "Tech", "Status", ""].map(h => (
                  <th key={h} style={{
                    padding: "10px 22px", textAlign: "left",
                    fontSize: 11, fontWeight: 500, color: "#475569",
                    letterSpacing: "0.5px", textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq, idx) => {
                const ss = STATUS_STYLE[inq.status]
                const sc = SERVICE_COLORS[inq.serviceIcon]
                const icon = SERVICE_ICONS[inq.serviceIcon]
                const isClosed = inq.status === "Closed"
                return (
                  <InquiryRow
                    key={inq.id}
                    inq={inq}
                    isLast={idx === filtered.length - 1}
                    ss={ss}
                    sc={sc}
                    icon={icon}
                    isClosed={isClosed}
                    onView={() => navigate(`/customer/inquiries/${inq.id}`)}
                  />
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function InquiryRow({
  inq, isLast, ss, sc, icon, isClosed, onView,
}: {
  inq: CustomerInquiry
  isLast: boolean
  ss: { bg: string; color: string; dot: string }
  sc: { bg: string; color: string }
  icon: React.ReactNode
  isClosed: boolean
  onView: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onClick={onView}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
        background: hovered ? "rgba(255,255,255,0.025)" : "transparent",
        cursor: "pointer", transition: "background 120ms",
        opacity: isClosed ? 0.55 : 1,
      }}
    >
      {/* ID */}
      <td style={{ padding: "14px 22px", fontSize: 12.5, color: "#64748b", fontFamily: "monospace", whiteSpace: "nowrap" }}>
        {inq.id}
      </td>

      {/* Service */}
      <td style={{ padding: "14px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: sc.bg, color: sc.color,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {icon}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", whiteSpace: "nowrap" }}>{inq.service}</span>
        </div>
      </td>

      {/* Last Update */}
      <td style={{ padding: "14px 22px", fontSize: 12.5, color: "#64748b", maxWidth: 220 }}>
        {inq.lastUpdate}
      </td>

      {/* Preferred Date */}
      <td style={{ padding: "14px 22px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CalendarDays size={12} color="#475569" />
          <span style={{ fontSize: 12.5, color: "#94a3b8" }}>{inq.preferredDate}</span>
        </div>
      </td>

      {/* Tech */}
      <td style={{ padding: "14px 22px" }}>
        {inq.techName ? (
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: "rgba(99,102,241,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: "#818cf8",
            }}>
              {inq.techName.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <span style={{ fontSize: 12.5, color: "#94a3b8", whiteSpace: "nowrap" }}>{inq.techName}</span>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: "#334155" }}>—</span>
        )}
      </td>

      {/* Status */}
      <td style={{ padding: "14px 22px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 20,
          fontSize: 11.5, fontWeight: 500,
          background: ss.bg, color: ss.color,
          whiteSpace: "nowrap",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: ss.dot, flexShrink: 0,
            boxShadow: isClosed ? "none" : `0 0 0 2px ${ss.dot}33`,
          }} />
          {inq.status}
        </span>
      </td>

      {/* Arrow */}
      <td style={{ padding: "14px 22px" }}>
        <ChevronRight size={14} color="#334155" />
      </td>
    </tr>
  )
}
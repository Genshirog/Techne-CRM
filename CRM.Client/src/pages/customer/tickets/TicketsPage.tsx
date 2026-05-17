import { useMemo, useState } from "react"
import {
  Plus,
  Search,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  HelpCircle,
  XCircle,
  ChevronRight,
  Wrench,
  ArrowUpRight,
  InboxIcon,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type TicketStatus =
  | "Open"
  | "WaitingForCustomer"
  | "InProgress"
  | "Resolved"
  | "Closed"

interface TicketItem {
  id: string
  subject: string
  status: TicketStatus
  service: string
  technician: string | null
  createdAt: string
  updatedAt: string
  inquiryId: string
  quotationId: string | null
}

type FilterTab = "All" | TicketStatus

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_TICKETS: TicketItem[] = [
  {
    id: "TKT-2304",
    subject: "Aircon leaking water after cleaning",
    status: "InProgress",
    service: "Air Conditioner Cleaning & Repair",
    technician: "Paulo Mendez",
    createdAt: "May 15, 2026",
    updatedAt: "2 hours ago",
    inquiryId: "INQ-1094",
    quotationId: "QT-4102",
  },
  {
    id: "TKT-2298",
    subject: "Circuit breaker keeps tripping in the kitchen",
    status: "WaitingForCustomer",
    service: "Electrical Wiring Maintenance",
    technician: "Renz Aquino",
    createdAt: "May 13, 2026",
    updatedAt: "1 day ago",
    inquiryId: "INQ-1089",
    quotationId: "QT-4097",
  },
  {
    id: "TKT-2285",
    subject: "Office partition installation for new floor",
    status: "Resolved",
    service: "Office Renovation Service",
    technician: "Marco Reyes",
    createdAt: "May 8, 2026",
    updatedAt: "3 days ago",
    inquiryId: "INQ-1074",
    quotationId: "QT-4083",
  },
  {
    id: "TKT-2271",
    subject: "Solar panel inverter not showing output",
    status: "Open",
    service: "Solar Panel Installation",
    technician: null,
    createdAt: "May 5, 2026",
    updatedAt: "5 days ago",
    inquiryId: "INQ-1060",
    quotationId: null,
  },
  {
    id: "TKT-2244",
    subject: "Post-renovation paint smell and touch-ups",
    status: "Closed",
    service: "Interior Painting",
    technician: "Diego Santos",
    createdAt: "Apr 28, 2026",
    updatedAt: "May 3, 2026",
    inquiryId: "INQ-1041",
    quotationId: "QT-4052",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; bg: string; color: string; icon: React.ReactNode }
> = {
  Open: {
    label: "Open",
    bg: "rgba(59,130,246,0.12)",
    color: "#60a5fa",
    icon: <CircleDot size={12} />,
  },
  WaitingForCustomer: {
    label: "Waiting For You",
    bg: "rgba(245,158,11,0.12)",
    color: "#fbbf24",
    icon: <HelpCircle size={12} />,
  },
  InProgress: {
    label: "In Progress",
    bg: "rgba(99,102,241,0.12)",
    color: "#818cf8",
    icon: <Clock size={12} />,
  },
  Resolved: {
    label: "Resolved",
    bg: "rgba(16,185,129,0.12)",
    color: "#34d399",
    icon: <CheckCircle2 size={12} />,
  },
  Closed: {
    label: "Closed",
    bg: "rgba(100,116,139,0.12)",
    color: "#64748b",
    icon: <XCircle size={12} />,
  },
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Open", label: "Open" },
  { key: "WaitingForCustomer", label: "Waiting For You" },
  { key: "InProgress", label: "In Progress" },
  { key: "Resolved", label: "Resolved" },
  { key: "Closed", label: "Closed" },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomerTicketListPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<FilterTab>("All")

  // ─── Derived Counts ────────────────────────────────
  const counts = useMemo(() => {
    const base = {
      Open: 0,
      WaitingForCustomer: 0,
      InProgress: 0,
      Resolved: 0,
      Closed: 0,
    }
    MOCK_TICKETS.forEach((t) => {
      base[t.status]++
    })
    return base
  }, [])

  const needsAction = counts.WaitingForCustomer

  // ─── Filtered List ─────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_TICKETS.filter((t) => {
      const matchSearch =
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.service.toLowerCase().includes(search.toLowerCase())
      const matchTab = activeTab === "All" || t.status === activeTab
      return matchSearch && matchTab
    })
  }, [search, activeTab])

  // ─── Render ────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 32px",
          position: "sticky",
          top: 0,
          background: "#0f172a",
          zIndex: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <Ticket size={18} color="#818cf8" />
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              My Tickets
            </h1>
            {needsAction > 0 && (
              <span
                style={{
                  background: "rgba(245,158,11,0.15)",
                  color: "#fbbf24",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 999,
                }}
              >
                {needsAction} need{needsAction === 1 ? "s" : ""} your action
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
            Track and manage all your service requests.
          </p>
        </div>

        {/* Create Ticket Button */}
        <a
          href="/tickets/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#6366f1",
            border: "none",
            color: "#fff",
            padding: "11px 18px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            textDecoration: "none",
            boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
          }}
        >
          <Plus size={15} />
          New Ticket
        </a>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          padding: "24px 32px 0",
        }}
      >
        {(
          [
            "Open",
            "WaitingForCustomer",
            "InProgress",
            "Resolved",
          ] as TicketStatus[]
        ).map((s) => {
          const cfg = STATUS_CONFIG[s]
          return (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              style={{
                background: activeTab === s ? cfg.bg : "#1e293b",
                border: activeTab === s
                  ? `1px solid ${cfg.color}30`
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "16px 18px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: activeTab === s ? cfg.color : "#f8fafc",
                  marginBottom: 4,
                }}
              >
                {counts[s]}
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {cfg.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div style={{ padding: "20px 32px 0" }}>
        {/* Search */}
        <div style={{ position: "relative", maxWidth: 400, marginBottom: 18 }}>
          <Search
            size={14}
            color="#475569"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID or subject..."
            style={{
              width: "100%",
              height: 40,
              paddingLeft: 36,
              paddingRight: 14,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingBottom: 0,
            overflowX: "auto",
          }}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const count =
              tab.key === "All"
                ? MOCK_TICKETS.length
                : counts[tab.key as TicketStatus]

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "10px 16px",
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid #818cf8"
                    : "2px solid transparent",
                  color: isActive ? "#818cf8" : "#64748b",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
                <span
                  style={{
                    background: isActive
                      ? "rgba(129,140,248,0.15)"
                      : "rgba(255,255,255,0.05)",
                    color: isActive ? "#818cf8" : "#475569",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "1px 7px",
                    borderRadius: 999,
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Ticket List */}
      <div style={{ padding: "16px 32px 64px" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 80,
              color: "#334155",
            }}
          >
            <InboxIcon size={40} />
            <p style={{ marginTop: 14, fontSize: 14, color: "#475569" }}>
              No tickets found.
            </p>
            <a
              href="/tickets/new"
              style={{
                marginTop: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(99,102,241,0.12)",
                color: "#818cf8",
                padding: "9px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Plus size={14} />
              Create your first ticket
            </a>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 4,
            }}
          >
            {filtered.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Ticket Row
// ─────────────────────────────────────────────────────────────────────────────

function TicketRow({ ticket }: { ticket: TicketItem }) {
  const cfg = STATUS_CONFIG[ticket.status]
  const isActionable = ticket.status === "WaitingForCustomer"

  return (
    <a
      href={`/tickets/${ticket.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "#1e293b",
        border: isActionable
          ? "1px solid rgba(245,158,11,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: "18px 20px",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.15s, background 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#243044"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#1e293b"
      }}
    >
      {/* Status dot */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: cfg.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: cfg.color,
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 5,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: "#f8fafc" }}>
            {ticket.subject}
          </span>
          {isActionable && (
            <span
              style={{
                background: "rgba(245,158,11,0.12)",
                color: "#fbbf24",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 999,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              Action Required
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Meta label={ticket.id} />
          <MetaDot />
          <Meta icon={<Wrench size={11} />} label={ticket.service} />
          {ticket.technician && (
            <>
              <MetaDot />
              <Meta label={`Assigned to ${ticket.technician}`} />
            </>
          )}
          {!ticket.technician && (
            <>
              <MetaDot />
              <span style={{ fontSize: 12, color: "#f59e0b" }}>
                Awaiting assignment
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Status badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: cfg.bg,
            color: cfg.color,
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 999,
          }}
        >
          {cfg.icon}
          {cfg.label}
        </span>

        {/* Timestamps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <span style={{ fontSize: 11, color: "#64748b" }}>
            Updated {ticket.updatedAt}
          </span>
          <span style={{ fontSize: 11, color: "#334155" }}>
            Created {ticket.createdAt}
          </span>
        </div>
      </div>

      <ChevronRight size={16} color="#334155" style={{ flexShrink: 0 }} />
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Micro helpers
// ─────────────────────────────────────────────────────────────────────────────

function Meta({
  label,
  icon,
}: {
  label: string
  icon?: React.ReactNode
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        color: "#64748b",
      }}
    >
      {icon}
      {label}
    </span>
  )
}

function MetaDot() {
  return (
    <span
      style={{
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: "#334155",
        display: "inline-block",
      }}
    />
  )
}
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Stethoscope, Search, Clock, ChevronRight,
  Wrench, AlertTriangle, CheckCircle2, Inbox,
  CalendarDays, MapPin, User,
} from "lucide-react"
import api from "../../../api/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

type InquiryStatus = "Pending" | "Acknowledged" | "InProgress" | "Completed" | "Cancelled"
type TechStatus    = "Assigned" | "In Diagnosis" | "Quoted" | "Closed"
type Urgency       = "High" | "Medium" | "Low"

interface RawInquiry {
  id:        number
  urgency:   string
  status:    InquiryStatus
  createdAt: string
  customer:  { id: number; name: string; email: string } | null
  guestId:   number | null
  companyId: number | null
  inquiryItems: {
    serviceCategory: { name: string } | null
    inquiryTechnicalDetails: {
      technician: {
        id: number
        user: { name: string; email: string }
      } | null
    }[]
  }[]
}

interface TechInquiry {
  id:            string
  rawId:         number
  customer:      string
  address:       string
  service:       string
  urgency:       Urgency
  preferredDate: string
  assignedAt:    string
  status:        TechStatus
  hasNote:       boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Map backend InquiryStatus → TechStatus label.
 * Adjust this mapping to match your actual status flow.
 */
function mapStatus(raw: InquiryStatus): TechStatus {
  switch (raw) {
    case "Pending":      return "Assigned"
    case "Acknowledged": return "Assigned"
    case "InProgress":   return "In Diagnosis"
    case "Completed":    return "Quoted"
    case "Cancelled":    return "Closed"
    default:             return "Assigned"
  }
}

function normalizeUrgency(raw: string): Urgency {
  const u = raw?.toLowerCase()
  if (u === "high")   return "High"
  if (u === "low")    return "Low"
  return "Medium"
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })
}

function transformInquiry(inq: RawInquiry): TechInquiry {
  const firstItem  = inq.inquiryItems?.[0]

  const customerName = inq.customer?.name
    ?? (inq.guestId   ? `Guest #${inq.guestId}`   : null)
    ?? (inq.companyId ? `Company #${inq.companyId}` : "Unknown")

  return {
    id:             `INQ-${inq.id}`,
    rawId:          inq.id,
    customer:       customerName,
    address:        "—",                                   // add address field if your API returns it
    service:        firstItem?.serviceCategory?.name ?? "—",
    urgency:        normalizeUrgency(inq.urgency),
    preferredDate:  formatDate(inq.createdAt),             // replace with actual preferred date field if available
    assignedAt:     formatDate(inq.createdAt),
    status:         mapStatus(inq.status),
    hasNote:        false,                                 // set to true if your API returns notes
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: TechStatus | "All" }[] = [
  { label: "All",          value: "All" },
  { label: "Assigned",     value: "Assigned" },
  { label: "In Diagnosis", value: "In Diagnosis" },
  { label: "Quoted",       value: "Quoted" },
  { label: "Closed",       value: "Closed" },
]

const STATUS_STYLE: Record<TechStatus, { bg: string; color: string; dot: string }> = {
  "Assigned":     { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24", dot: "#fbbf24" },
  "In Diagnosis": { bg: "rgba(59,130,246,0.12)",  color: "#60a5fa", dot: "#60a5fa" },
  "Quoted":       { bg: "rgba(16,185,129,0.12)",  color: "#34d399", dot: "#34d399" },
  "Closed":       { bg: "rgba(100,116,139,0.12)", color: "#64748b", dot: "#64748b" },
}

const URGENCY_STYLE: Record<Urgency, { color: string; bg: string }> = {
  "High":   { color: "#f87171", bg: "rgba(248,113,113,0.1)"  },
  "Medium": { color: "#fbbf24", bg: "rgba(245,158,11,0.1)"   },
  "Low":    { color: "#34d399", bg: "rgba(16,185,129,0.1)"   },
}

const PRIORITY_ORDER: Record<Urgency, number>   = { High: 0, Medium: 1, Low: 2 }
const STATUS_ORDER:   Record<TechStatus, number> = {
  "In Diagnosis": 0, "Assigned": 1, "Quoted": 2, "Closed": 3,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TechnicianInquiriesPage() {
  const navigate = useNavigate()

  const [inquiries,  setInquiries]  = useState<TechInquiry[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [search,     setSearch]     = useState("")
  const [activeTab,  setActiveTab]  = useState<TechStatus | "All">("All")

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    api.get("/inquiries")
      .then(res => {
        const raw: RawInquiry[] = res.data
        setInquiries(raw.map(transformInquiry))
      })
      .catch(() => setError("Failed to load inquiries."))
      .finally(() => setLoading(false))
  }, [])

  // ── Derived stats ──────────────────────────────────────────────────────────
  const activeCount = inquiries.filter(i =>
    i.status === "Assigned" || i.status === "In Diagnosis"
  ).length

  // ── Filter & Sort ──────────────────────────────────────────────────────────
  const filtered = inquiries
    .filter(inq => {
      const matchTab    = activeTab === "All" || inq.status === activeTab
      const matchSearch = search === "" ||
        inq.customer.toLowerCase().includes(search.toLowerCase()) ||
        inq.id.toLowerCase().includes(search.toLowerCase()) ||
        inq.service.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })
    .sort((a, b) => {
      const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (statusDiff !== 0) return statusDiff
      return PRIORITY_ORDER[a.urgency] - PRIORITY_ORDER[b.urgency]
    })

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(245,158,11,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, color: "#fbbf24", flexShrink: 0,
          }}>
            <Wrench size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
              My Inquiries
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: "3px 0 0" }}>
              {loading
                ? "Loading…"
                : `${activeCount} active assignment${activeCount !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Stats row */}
        {!loading && (
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "In Diagnosis", count: inquiries.filter(i => i.status === "In Diagnosis").length, color: "#60a5fa" },
              { label: "Assigned",     count: inquiries.filter(i => i.status === "Assigned").length,     color: "#fbbf24" },
              { label: "Quoted",       count: inquiries.filter(i => i.status === "Quoted").length,       color: "#34d399" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: "10px 16px", textAlign: "center", minWidth: 80,
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.count}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          marginBottom: 16, padding: "12px 18px", borderRadius: 10,
          background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)",
          color: "#f87171", fontSize: 13,
        }}>{error}</div>
      )}

      {/* ── Card ── */}
      <div style={{
        background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, overflow: "hidden",
      }}>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
            <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search inquiries…"
              style={{
                width: "100%", background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "8px 12px 8px 32px",
                color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginLeft: "auto", fontSize: 12.5, color: "#334155" }}>
            {loading ? "…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 22px" }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)} style={{
              background: "transparent", border: "none",
              borderBottom: activeTab === tab.value ? "2px solid #6366f1" : "2px solid transparent",
              padding: "11px 14px", fontSize: 13, marginBottom: -1,
              color: activeTab === tab.value ? "#818cf8" : "#64748b",
              cursor: "pointer", fontWeight: activeTab === tab.value ? 500 : 400,
              transition: "color 150ms",
            }}>
              {tab.label}
              {tab.value !== "All" && !loading && (
                <span style={{
                  marginLeft: 6, fontSize: 11, padding: "1px 6px", borderRadius: 10,
                  background: activeTab === tab.value ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                  color: activeTab === tab.value ? "#818cf8" : "#475569",
                }}>
                  {inquiries.filter(i => i.status === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── List ── */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 28px", gap: 10 }}>
            <div style={{ fontSize: 13.5, color: "#475569" }}>Loading inquiries…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 28px", gap: 10 }}>
            <Inbox size={28} color="#334155" />
            <p style={{ fontSize: 13.5, color: "#475569", margin: 0 }}>No inquiries found.</p>
          </div>
        ) : (
          <div>
            {filtered.map((inq, idx) => (
              <InquiryRow
                key={inq.id}
                inq={inq}
                isLast={idx === filtered.length - 1}
                onView={()     => navigate(`/technician/inquiries/${inq.rawId}`)}
                onDiagnose={() => navigate(`/technician/diagnosis/${inq.rawId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Row Component ────────────────────────────────────────────────────────────

function InquiryRow({
  inq, isLast, onView, onDiagnose,
}: {
  inq:        TechInquiry
  isLast:     boolean
  onView:     () => void
  onDiagnose: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const statusStyle  = STATUS_STYLE[inq.status]
  const urgencyStyle = URGENCY_STYLE[inq.urgency]
  const isClosed     = inq.status === "Closed"

  return (
    <div
      onClick={onView}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
        background: hovered ? "rgba(255,255,255,0.025)" : "transparent",
        cursor: "pointer", transition: "background 120ms",
        opacity: isClosed ? 0.55 : 1,
      }}
    >
      {/* Urgency accent bar */}
      <div style={{
        width: 3, alignSelf: "stretch", flexShrink: 0,
        background: isClosed ? "transparent" : urgencyStyle.color, opacity: 0.7,
      }} />

      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 16, padding: "16px 22px" }}>

        {/* ID + Customer */}
        <div style={{ minWidth: 180, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11.5, color: "#475569", fontFamily: "monospace" }}>{inq.id}</span>
            {inq.hasNote && (
              <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                note
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: "rgba(99,102,241,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: "#818cf8",
            }}>
              {inq.customer.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: "#e2e8f0" }}>{inq.customer}</span>
          </div>
        </div>

        {/* Service + Address */}
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Wrench size={12} color="#475569" />
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{inq.service}</span>
          </div>
          {inq.address !== "—" && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
              <MapPin size={12} color="#334155" />
              <span style={{ fontSize: 11.5, color: "#475569" }}>{inq.address}</span>
            </div>
          )}
        </div>

        {/* Preferred date */}
        <div style={{ minWidth: 120, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <CalendarDays size={12} color="#475569" />
            <span style={{ fontSize: 12, color: "#64748b" }}>Created</span>
          </div>
          <span style={{ fontSize: 12.5, color: "#94a3b8" }}>{inq.preferredDate}</span>
        </div>

        {/* Urgency */}
        <div style={{ minWidth: 80, flexShrink: 0 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
            background: urgencyStyle.bg, color: urgencyStyle.color,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: urgencyStyle.color, flexShrink: 0,
              boxShadow: isClosed ? "none" : `0 0 0 2px ${urgencyStyle.color}33`,
            }} />
            {inq.urgency}
          </span>
        </div>

        {/* Status */}
        <div style={{ minWidth: 110, flexShrink: 0 }}>
          <span style={{
            display: "inline-block", padding: "3px 10px", borderRadius: 20,
            fontSize: 11.5, fontWeight: 500,
            background: statusStyle.bg, color: statusStyle.color,
          }}>
            {inq.status}
          </span>
        </div>

        {/* Assigned at */}
        <div style={{ minWidth: 120, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
            <Clock size={11} color="#334155" />
            <span style={{ fontSize: 11, color: "#334155" }}>Assigned</span>
          </div>
          <span style={{ fontSize: 12, color: "#475569" }}>{inq.assignedAt}</span>
        </div>

        {/* CTA */}
        <div style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {inq.status === "In Diagnosis" ? (
            <button
              onClick={onDiagnose}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 8, padding: "7px 14px",
                color: "#60a5fa", fontSize: 12.5, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.22)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(59,130,246,0.12)")}
            >
              <Stethoscope size={13} /> Continue
            </button>
          ) : inq.status === "Assigned" ? (
            <button
              onClick={onDiagnose}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#6366f1", border: "none",
                borderRadius: 8, padding: "7px 14px",
                color: "#fff", fontSize: 12.5, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
              onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
            >
              <Stethoscope size={13} /> Start
            </button>
          ) : (
            <button
              onClick={onView}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "7px 12px",
                color: "#475569", fontSize: 12.5, cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
              onMouseLeave={e => { e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)" }}
            >
              View <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
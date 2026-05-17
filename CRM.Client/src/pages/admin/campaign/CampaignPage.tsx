import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, Filter, ChevronLeft, ChevronRight,
  Megaphone, Mail, Edit2, Trash2, RotateCcw, Plus,
  CalendarClock, Users, CheckCircle2, Tag,
} from "lucide-react"
import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"

// ─── Types ────────────────────────────────────────────────────────────────────

type CampaignChannel = "Email" | "SMS" | "InApp"
type CampaignStatus  = "Draft" | "Scheduled" | "Sent"

interface Campaign {
  id:             number
  title:          string
  message:        string
  channel:        CampaignChannel
  status:         CampaignStatus
  scheduledAt:    string | null
  targetsCount:   number
  sentCount:      number
  promoCodesCount:number
  createdBy:      string
  createdAt:      string
  deletedAt:      string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: Campaign[] = [
  {
    id: 1, title: "Summer Service Promo",
    message: "Get 20% off your next repair booking this summer. Limited slots only!",
    channel: "Email", status: "Sent",
    scheduledAt: "May 1, 2026 — 9:00 AM", targetsCount: 48, sentCount: 48, promoCodesCount: 2,
    createdBy: "James Alcantara", createdAt: "Apr 28, 2026", deletedAt: null,
  },
  {
    id: 2, title: "Loyalty Reward — Q2 2026",
    message: "Dear valued customer, as a thank-you for your continued trust, we have a special offer just for you.",
    channel: "Email", status: "Scheduled",
    scheduledAt: "May 22, 2026 — 10:00 AM", targetsCount: 32, sentCount: 0, promoCodesCount: 1,
    createdBy: "James Alcantara", createdAt: "May 5, 2026", deletedAt: null,
  },
  {
    id: 3, title: "Re-engagement Drive",
    message: "We noticed it's been a while! Come back and enjoy priority service scheduling.",
    channel: "Email", status: "Draft",
    scheduledAt: null, targetsCount: 14, sentCount: 0, promoCodesCount: 0,
    createdBy: "Rica Santos", createdAt: "May 8, 2026", deletedAt: null,
  },
  {
    id: 4, title: "Warranty Expiry Reminder",
    message: "Your warranty is expiring soon. Book a maintenance check before it lapses.",
    channel: "Email", status: "Sent",
    scheduledAt: "Apr 15, 2026 — 8:00 AM", targetsCount: 20, sentCount: 20, promoCodesCount: 0,
    createdBy: "James Alcantara", createdAt: "Apr 12, 2026", deletedAt: null,
  },
  {
    id: 5, title: "New Year Special Offer",
    message: "Start the new year right with a full device checkup at a special rate.",
    channel: "Email", status: "Sent",
    scheduledAt: "Jan 2, 2026 — 9:00 AM", targetsCount: 65, sentCount: 65, promoCodesCount: 3,
    createdBy: "Rica Santos", createdAt: "Dec 28, 2025", deletedAt: "May 10, 2026",
  },
  {
    id: 6, title: "Post-Service Follow Up",
    message: "Thank you for choosing Techne Fixer. We'd love to hear your feedback!",
    channel: "Email", status: "Draft",
    scheduledAt: null, targetsCount: 0, sentCount: 0, promoCodesCount: 0,
    createdBy: "James Alcantara", createdAt: "May 10, 2026", deletedAt: null,
  },
  {
    id: 7, title: "Mid-Year Maintenance Reminder",
    message: "It's been 6 months — time for a device health check. Book now and save.",
    channel: "Email", status: "Scheduled",
    scheduledAt: "Jun 1, 2026 — 8:00 AM", targetsCount: 40, sentCount: 0, promoCodesCount: 1,
    createdBy: "James Alcantara", createdAt: "May 12, 2026", deletedAt: null,
  },
  {
    id: 8, title: "Referral Program Launch",
    message: "Refer a friend and both of you get a discount on your next service.",
    channel: "Email", status: "Draft",
    scheduledAt: null, targetsCount: 0, sentCount: 0, promoCodesCount: 2,
    createdBy: "Rica Santos", createdAt: "May 14, 2026", deletedAt: null,
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<CampaignStatus, { bg: string; color: string }> = {
  Draft:     { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  Scheduled: { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  Sent:      { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
}

const CHANNEL_STYLE: Record<CampaignChannel, { bg: string; color: string; icon: React.ReactNode }> = {
  Email: { bg: "rgba(99,102,241,0.15)",  color: "#818cf8", icon: <Mail         size={11} /> },
  SMS:   { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24", icon: <Megaphone    size={11} /> },
  InApp: { bg: "rgba(16,185,129,0.15)",  color: "#34d399", icon: <CheckCircle2 size={11} /> },
}

const ALL_STATUSES: CampaignStatus[] = ["Draft", "Scheduled", "Sent"]
const ALL_CHANNELS: (CampaignChannel | "All")[] = ["All", "Email", "SMS", "InApp"]
const PAGE_SIZE = 6

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ActionBtn({
  icon, title, color, onClick,
}: {
  icon: React.ReactNode; title: string; color: string; onClick: () => void
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 30, height: 30, borderRadius: 7,
        background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
        color, cursor: "pointer",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = `${color}18`)}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
    </button>
  )
}

function PaginationBtn({
  icon, disabled, onClick,
}: {
  icon: React.ReactNode; disabled: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 30, height: 30, borderRadius: 7,
        background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
        color: disabled ? "#334155" : "#94a3b8", cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {icon}
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminCampaignPage() {
  const navigate = useNavigate()

  const [data,          setData]          = useState<Campaign[]>(MOCK_DATA)
  const [search,        setSearch]        = useState("")
  const [statusFilter,  setStatusFilter]  = useState<CampaignStatus | "All">("All")
  const [channelFilter, setChannelFilter] = useState<CampaignChannel | "All">("All")
  const [showDeleted,   setShowDeleted]   = useState(false)
  const [page,          setPage]          = useState(1)
  const [deletingId,    setDeletingId]    = useState<number | null>(null)

  const softDelete = (id: number) => {
    setData(prev => prev.map(c => c.id === id ? { ...c, deletedAt: "Just now" } : c))
    setDeletingId(null)
  }

  const restore = (id: number) => {
    setData(prev => prev.map(c => c.id === id ? { ...c, deletedAt: null } : c))
  }

  const filtered = useMemo(() => {
    return data.filter(c => {
      const matchSearch  = c.title.toLowerCase().includes(search.toLowerCase()) ||
                           c.createdBy.toLowerCase().includes(search.toLowerCase()) ||
                           String(c.id).includes(search)
      const matchStatus  = statusFilter  === "All" || c.status  === statusFilter
      const matchChannel = channelFilter === "All" || c.channel === channelFilter
      const matchDeleted = showDeleted ? true : c.deletedAt === null
      return matchSearch && matchStatus && matchChannel && matchDeleted
    })
  }, [data, search, statusFilter, channelFilter, showDeleted])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeCount = data.filter(c => c.deletedAt === null).length

  // KPI counts (active only)
  const kpiCounts = {
    Draft:     data.filter(c => c.status === "Draft"     && !c.deletedAt).length,
    Scheduled: data.filter(c => c.status === "Scheduled" && !c.deletedAt).length,
    Sent:      data.filter(c => c.status === "Sent"      && !c.deletedAt).length,
  }

  const columns: ColumnDef<Campaign>[] = [
    {
      label: "#", width: "60px",
      render: (row) => (
        <span style={{ fontSize: 12, color: "#475569", fontVariantNumeric: "tabular-nums" }}>
          CAMP-{String(row.id).padStart(3, "0")}
        </span>
      ),
    },
    {
      label: "Title",
      render: (row) => (
        <div>
          <div style={{
            fontSize: 13, fontWeight: 600, color: "#e2e8f0",
            opacity: row.deletedAt ? 0.5 : 1,
            textDecoration: row.deletedAt ? "line-through" : "none",
            textDecorationColor: "#475569",
          }}>
            {row.title}
          </div>
          <div style={{
            fontSize: 11, color: "#475569", marginTop: 3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260,
          }}>
            {row.message}
          </div>
        </div>
      ),
    },
    {
      label: "Channel",
      render: (row) => {
        const cs = CHANNEL_STYLE[row.channel]
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20,
            background: cs.bg, color: cs.color,
            fontSize: 11.5, fontWeight: 500,
          }}>
            {cs.icon} {row.channel}
          </span>
        )
      },
    },
    {
      label: "Status",
      render: (row) => {
        const ss = STATUS_STYLE[row.status]
        return (
          <span style={{
            display: "inline-block", padding: "3px 10px", borderRadius: 20,
            fontSize: 11.5, fontWeight: 500, background: ss.bg, color: ss.color,
          }}>
            {row.status}
          </span>
        )
      },
    },
    {
      label: "Scheduled At",
      render: (row) => (
        <span style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>
          {row.scheduledAt ?? "—"}
        </span>
      ),
    },
    {
      label: "Targets",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Users size={12} color="#475569" />
          <span style={{ fontSize: 12.5, color: "#94a3b8" }}>{row.targetsCount}</span>
          {row.status === "Sent" && (
            <span style={{ fontSize: 11, color: "#34d399", marginLeft: 2 }}>
              ({row.sentCount} sent)
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Promos",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Tag size={12} color="#475569" />
          <span style={{ fontSize: 12.5, color: row.promoCodesCount > 0 ? "#818cf8" : "#334155" }}>
            {row.promoCodesCount}
          </span>
        </div>
      ),
    },
    {
      label: "Created By",
      render: (row) => (
        <span style={{ fontSize: 12.5, color: "#94a3b8" }}>{row.createdBy}</span>
      ),
    },
    {
      label: "", width: "110px",
      render: (row) => {
        const isDeleted    = row.deletedAt !== null
        const isConfirming = deletingId === row.id
        return isConfirming ? (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#f87171", whiteSpace: "nowrap" }}>Archive?</span>
            <button
              onClick={() => softDelete(row.id)}
              style={{
                background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: 6, padding: "3px 8px", color: "#f87171", fontSize: 12, cursor: "pointer",
              }}
            >Yes</button>
            <button
              onClick={() => setDeletingId(null)}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, padding: "3px 8px", color: "#64748b", fontSize: 12, cursor: "pointer",
              }}
            >No</button>
          </div>
        ) : (
          <div
            style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}
            onClick={e => e.stopPropagation()}
          >
            {isDeleted ? (
              <ActionBtn icon={<RotateCcw size={13} />} title="Restore"  color="#34d399" onClick={() => restore(row.id)} />
            ) : (
              <>
                <ActionBtn icon={<Edit2   size={13} />} title="Edit"    color="#818cf8" onClick={() => navigate(`/admin/campaigns/${row.id}`)} />
                <ActionBtn icon={<Trash2  size={13} />} title="Archive" color="#f87171" onClick={() => setDeletingId(row.id)} />
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <TitleComponent label="Campaigns" icon={Megaphone} />
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            {activeCount} active campaign{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/campaigns/new")}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "#6366f1", border: "none", borderRadius: 8,
            padding: "9px 16px", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
          onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
        >
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {/* ── Status Strips ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
        {ALL_STATUSES.map(s => {
          const ss = STATUS_STYLE[s]
          const count = kpiCounts[s]
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(prev => prev === s ? "All" : s); setPage(1) }}
              style={{
                background: statusFilter === s ? ss.bg : "#1e293b",
                border: `1px solid ${statusFilter === s ? ss.color + "55" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 10, padding: "14px 18px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 12, color: "#64748b" }}>{s}</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: ss.color }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
          <Search size={14} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by title, creator…"
            style={{
              width: "100%", paddingLeft: 36, paddingRight: 14, height: 36,
              background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, color: "#e2e8f0", fontSize: 13, outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Channel Filter */}
        <div style={{ display: "flex", gap: 6 }}>
          {ALL_CHANNELS.map(ch => (
            <button
              key={ch}
              onClick={() => { setChannelFilter(ch as CampaignChannel | "All"); setPage(1) }}
              style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                background: channelFilter === ch ? "rgba(99,102,241,0.15)" : "#1e293b",
                border: `1px solid ${channelFilter === ch ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: channelFilter === ch ? "#818cf8" : "#64748b",
              }}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Show Archived */}
        <button
          onClick={() => { setShowDeleted(v => !v); setPage(1) }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: showDeleted ? "rgba(99,102,241,0.15)" : "#1e293b",
            border: `1px solid ${showDeleted ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 8, padding: "7px 13px",
            color: showDeleted ? "#818cf8" : "#64748b",
            fontSize: 13, cursor: "pointer",
          }}
        >
          <Filter size={13} />
          {showDeleted ? "Showing Archived" : "Show Archived"}
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, overflow: "hidden",
      }}>
        <DataTable
          columns={columns}
          data={paged}
          keyExtractor={row => row.id}
          onRowClick={row => navigate(`/admin/campaigns/${row.id}`)}
          rowProps={{
            style: row => ({
              background: row.deletedAt !== null ? "rgba(248,113,113,0.03)" : "transparent",
              opacity: row.deletedAt !== null ? 0.7 : 1,
            }),
            onMouseEnter: (row, _, e) => {
              if (row.deletedAt === null)
                e.currentTarget.style.background = "rgba(255,255,255,0.02)"
            },
            onMouseLeave: (row, _, e) => {
              e.currentTarget.style.background =
                row.deletedAt !== null ? "rgba(248,113,113,0.03)" : "transparent"
            },
          }}
          emptyMessage="No campaigns found."
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{ fontSize: 12.5, color: "#475569" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} · Page {page} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <PaginationBtn icon={<ChevronLeft  size={14} />} disabled={page === 1}          onClick={() => setPage(p => p - 1)} />
              <PaginationBtn icon={<ChevronRight size={14} />} disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
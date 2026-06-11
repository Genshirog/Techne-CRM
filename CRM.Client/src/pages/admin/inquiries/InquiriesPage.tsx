import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft, ChevronRight, Eye, Trash2, MessageSquare,
} from "lucide-react"
import api from "../../../api/axios"
import CreateButton from "../../../components/common/buttons/CreateButton"
import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"
import TableToolbar from "../../../components/common/table/TableToolbar"
import { StatusTabs } from "../../../components/common/stats/StatusTab"

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "Pending" | "Acknowledged" | "InProgress" | "Completed" | "Cancelled"

interface Inquiry {
  id:           number
  customerId:   number | null
  guestId:      number | null
  companyId:    number | null
  urgency:      string
  assignedTechnician:  { id: number; name: string } | null
  status:       Status
  createdAt:    string
  customer:     { id: number; name: string; email: string } | null
  guest:        { id: number; name: string; email: string; phoneNumber: string} | null
  inquiryItems: {
    serviceCategory: {
      name: string
    } | null

    inquiryTechnicalDetails: {
      technician: {
        id: number
        user: {
          name: string
          email: string
        }
      } | null
    }[]
  }[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: Status | "All" }[] = [
  { label: "All",          value: "All"          },
  { label: "Pending",      value: "Pending"      },
  { label: "Acknowledged", value: "Acknowledged" },
  { label: "In Progress",  value: "InProgress"   },
  { label: "Completed",    value: "Completed"    },
  { label: "Cancelled",    value: "Cancelled"    },
]

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  "Pending":      { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  "Acknowledged": { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  "InProgress":   { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  "Completed":    { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  "Cancelled":    { bg: "rgba(100,116,139,0.15)", color: "#64748b" },
}

const STATUS_LABEL: Record<Status, string> = {
  "Pending":      "Pending",
  "Acknowledged": "Acknowledged",
  "InProgress":   "In Progress",
  "Completed":    "Completed",
  "Cancelled":    "Cancelled",
}

const PAGE_SIZE = 8

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminInquiriesPage() {
  const navigate = useNavigate()

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [search,    setSearch]    = useState("")
  const [activeTab, setActiveTab] = useState<Status | "All">("All")
  const [page,      setPage]      = useState(1)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    api.get("/inquiries")
      .then(res => setInquiries(res.data))
      .catch(() => setError("Failed to load inquiries."))
      .finally(() => setLoading(false))
  }, [])

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Delete this inquiry?")) return
    try {
      await api.delete(`/inquiries/${id}`)
      setInquiries(prev => prev.filter(i => i.id !== id))
    } catch {
      alert("Failed to delete inquiry.")
    }
  }

  // ── Client label helper ────────────────────────────────────────────────────
  const getClientName = (inq: Inquiry) => {
    if (inq.customer?.name) return inq.customer.name
    if (inq.guest?.name)        return inq.guest.name
    if (inq.companyId)      return `Company #${inq.companyId}`
    return "—"
  }

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<Inquiry>[] = [
    {
      label: "ID", width: "8%",
      render: (inq) => (
        <span style={{ fontSize: 13, color: "#64748b", fontFamily: "monospace" }}>
          INQ-{inq.id}
        </span>
      ),
    },
    {
      label: "Client", width: "20%",
      render: (inq) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>
            {getClientName(inq)}
          </div>
          <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
            {inq.customer?.email ?? inq.guest?.email ?? ""}
          </div>
        </div>
      ),
    },
    {
      label: "Service Category", width: "18%",
      render: (inq) => (
        <span style={{ fontSize: 13, color: "#94a3b8" }}>
          {inq.inquiryItems?.[0]?.serviceCategory?.name ?? "—"}
        </span>
      ),
    },
    {
      label: "Technician",
      width: "18%",
      render: (inq) => {
        const technician =
          inq.inquiryItems?.[0]
            ?.inquiryTechnicalDetails?.[0]
            ?.technician

        if (!technician) {
          return (
            <span
              style={{
                fontSize: 12,
                color: "#334155",
                fontStyle: "italic",
              }}
            >
              Unassigned
            </span>
          )
        }

        const name = technician.user.name

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(245,158,11,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "#fbbf24",
                flexShrink: 0,
              }}
            >
              {name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </div>

            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {name}
            </span>
          </div>
        )
      },
    },
    {
      label: "Date", width: "13%",
      render: (inq) => (
        <span style={{ fontSize: 13, color: "#64748b" }}>
          {new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      label: "Status", width: "13%",
      render: (inq) => (
        <span style={{
          display: "inline-block", padding: "3px 10px", borderRadius: 20,
          fontSize: 11.5, fontWeight: 500,
          background: STATUS_STYLE[inq.status]?.bg ?? "rgba(255,255,255,0.06)",
          color:      STATUS_STYLE[inq.status]?.color ?? "#94a3b8",
        }}>
          {STATUS_LABEL[inq.status] ?? inq.status}
        </span>
      ),
    },
    {
      width: "9%",
      render: (inq) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/admin/inquiries/${inq.id}`)}
            title="View"
            style={{ background: "transparent", border: "none", color: "#475569", cursor: "pointer", padding: 5, borderRadius: 6, display: "flex" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569" }}
          >
            <Eye size={15} />
          </button>
          <button
            onClick={e => handleDelete(inq.id, e)}
            title="Delete"
            style={{ background: "transparent", border: "none", color: "#475569", cursor: "pointer", padding: 5, borderRadius: 6, display: "flex" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.color = "#f87171" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569" }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  // ── Filter & Paginate ──────────────────────────────────────────────────────
  const filtered = inquiries.filter(inq => {
    const matchTab    = activeTab === "All" || inq.status === activeTab
    const matchSearch = search === "" ||
      String(inq.id).includes(search) ||
      (inq.customer?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (inq.customer?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (inq.guest?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (inq.guest?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (
        inq.inquiryItems?.[0]
          ?.inquiryTechnicalDetails?.[0]
          ?.technician?.user?.name ?? ""
      ).toLowerCase().includes(search.toLowerCase()) ||
      (inq.inquiryItems?.[0]?.serviceCategory?.name ?? "").toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleTabChange = (tab: Status | "All") => { setActiveTab(tab); setPage(1) }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <TitleComponent label="Inquiry" icon={MessageSquare} />
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>
            {loading ? "Loading…" : `${filtered.length} total inquiries`}
          </p>
        </div>
        <CreateButton to="/admin/inquiries/new" label="New Inquiry" />
      </div>

      {error && (
        <div style={{
          marginBottom: 16, padding: "12px 18px", borderRadius: 10,
          background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)",
          color: "#f87171", fontSize: 13,
        }}>{error}</div>
      )}

      {/* Card */}
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>

        <TableToolbar
          search={search}
          onSearch={v => { setSearch(v); setPage(1) }}
          placeholder="Search by name, ID, source, or service…"
        />

        {/* Status Tabs */}
        <StatusTabs
          tabs={STATUS_TABS}
          activeTab={activeTab}
          data={inquiries}
          onChange={handleTabChange}
        />

        <DataTable
          columns={columns}
          data={paged}
          keyExtractor={inq => inq.id}
          onRowClick={inq => navigate(`/admin/inquiries/${inq.id}`)}
          emptyMessage={loading ? "Loading inquiries…" : "No inquiries found."}
        />

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: 12.5, color: "#475569" }}>
            {filtered.length === 0 ? "No results" : `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 10px", color: page === 1 ? "#334155" : "#94a3b8", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                background: p === page ? "#6366f1" : "transparent",
                border: "1px solid " + (p === page ? "#6366f1" : "rgba(255,255,255,0.08)"),
                borderRadius: 7, padding: "6px 11px", color: p === page ? "#fff" : "#64748b",
                cursor: "pointer", fontSize: 13, fontWeight: p === page ? 500 : 400, minWidth: 32,
              }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 10px", color: page === totalPages ? "#334155" : "#94a3b8", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
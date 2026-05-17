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

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "New" | "Assigned" | "InDiagnosis" | "Quoted" | "Closed"

interface Inquiry {
  id: number
  customerId:   number | null
  guestId:      number | null
  companyId:    number | null
  urgency:      string
  intakeSource: string
  status:       Status
  createdAt:    string
  inquiryItems: {
    serviceCategory: { name: string } | null
  }[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: Status | "All" }[] = [
  { label: "All",          value: "All" },
  { label: "New",          value: "New" },
  { label: "Assigned",     value: "Assigned" },
  { label: "In Diagnosis", value: "InDiagnosis" },
  { label: "Quoted",       value: "Quoted" },
  { label: "Closed",       value: "Closed" },
]

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  "New":          { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  "Assigned":     { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  "InDiagnosis":  { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  "Quoted":       { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  "Closed":       { bg: "rgba(100,116,139,0.15)", color: "#64748b" },
}

const STATUS_LABEL: Record<Status, string> = {
  "New":         "New",
  "Assigned":    "Assigned",
  "InDiagnosis": "In Diagnosis",
  "Quoted":      "Quoted",
  "Closed":      "Closed",
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
      label: "Client", width: "18%",
      render: (inq) => (
        <span style={{ fontSize: 13, color: "#e2e8f0" }}>
          {inq.customerId  ? `Customer #${inq.customerId}`
           : inq.guestId   ? `Guest #${inq.guestId}`
           : inq.companyId ? `Company #${inq.companyId}`
           : "—"}
        </span>
      ),
    },
    {
      label: "Service Category", width: "20%",
      render: (inq) => (
        <span style={{ fontSize: 13, color: "#94a3b8" }}>
          {inq.inquiryItems?.[0]?.serviceCategory?.name ?? "—"}
        </span>
      ),
    },
    {
      label: "Source", width: "12%",
      render: (inq) => (
        <span style={{ fontSize: 12.5, color: "#64748b" }}>{inq.intakeSource}</span>
      ),
    },
    {
      label: "Date", width: "14%",
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
          background: STATUS_STYLE[inq.status]?.bg ?? "transparent",
          color:      STATUS_STYLE[inq.status]?.color ?? "#fff",
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
      inq.intakeSource.toLowerCase().includes(search.toLowerCase()) ||
      inq.inquiryItems?.[0]?.serviceCategory?.name?.toLowerCase().includes(search.toLowerCase())
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
          placeholder="Search by ID, source, or service…"
        />

        {/* Status Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 22px" }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.value} onClick={() => handleTabChange(tab.value)} style={{
              background: "transparent", border: "none",
              borderBottom: activeTab === tab.value ? "2px solid #6366f1" : "2px solid transparent",
              padding: "12px 16px", fontSize: 13, marginBottom: -1,
              color: activeTab === tab.value ? "#818cf8" : "#64748b",
              cursor: "pointer", fontWeight: activeTab === tab.value ? 500 : 400,
              transition: "color 150ms ease",
            }}>
              {tab.label}
              {tab.value !== "All" && (
                <span style={{
                  marginLeft: 6, fontSize: 11, padding: "1px 6px", borderRadius: 10,
                  background: activeTab === tab.value ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)",
                  color: activeTab === tab.value ? "#818cf8" : "#475569",
                }}>
                  {inquiries.filter(i => i.status === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

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
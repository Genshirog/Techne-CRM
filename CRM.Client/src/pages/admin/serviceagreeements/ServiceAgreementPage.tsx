import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, Edit2, Trash2, RotateCcw,
  ChevronLeft, ChevronRight, FileSignature, Filter, Send,
} from "lucide-react"
import CreateButton from "../../../components/common/buttons/CreateButton"
import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceAgreementStatus = "Draft" | "Issued" | "Signed"

interface ServiceAgreement {
  id: number
  jobOrderRef: number
  quotationRef: string
  finalLabor: number
  finalParts: number
  finalTotal: number
  warrantyStart: string | null
  warrantyEnd: string | null
  status: ServiceAgreementStatus
  customerSigned: boolean
  providerSigned: boolean
  createdAt: string
  deletedAt: string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: ServiceAgreement[] = [
  { id: 1,  jobOrderRef: 1,  quotationRef: "QUO-1001", finalLabor: 2000,  finalParts: 2800,  finalTotal: 4800,  warrantyStart: "May 10, 2026", warrantyEnd: "May 10, 2027", status: "Signed",  customerSigned: true,  providerSigned: true,  createdAt: "May 8, 2026",  deletedAt: null },
  { id: 2,  jobOrderRef: 2,  quotationRef: "QUO-1002", finalLabor: 500,   finalParts: 750,   finalTotal: 1250,  warrantyStart: "May 12, 2026", warrantyEnd: "May 12, 2027", status: "Issued",  customerSigned: false, providerSigned: true,  createdAt: "May 9, 2026",  deletedAt: null },
  { id: 3,  jobOrderRef: 4,  quotationRef: "QUO-1004", finalLabor: 1400,  finalParts: 2000,  finalTotal: 3400,  warrantyStart: null,           warrantyEnd: null,           status: "Draft",   customerSigned: false, providerSigned: false, createdAt: "May 9, 2026",  deletedAt: null },
  { id: 4,  jobOrderRef: 6,  quotationRef: "QUO-1006", finalLabor: 900,   finalParts: 1200,  finalTotal: 2100,  warrantyStart: "May 11, 2026", warrantyEnd: "May 11, 2027", status: "Signed",  customerSigned: true,  providerSigned: true,  createdAt: "May 10, 2026", deletedAt: null },
  { id: 5,  jobOrderRef: 9,  quotationRef: "QUO-1009", finalLabor: 1500,  finalParts: 1800,  finalTotal: 3300,  warrantyStart: null,           warrantyEnd: null,           status: "Draft",   customerSigned: false, providerSigned: false, createdAt: "May 10, 2026", deletedAt: null },
  { id: 6,  jobOrderRef: 5,  quotationRef: "QUO-1005", finalLabor: 3000,  finalParts: 3750,  finalTotal: 6750,  warrantyStart: "May 5, 2026",  warrantyEnd: "May 5, 2027",  status: "Signed",  customerSigned: true,  providerSigned: true,  createdAt: "May 3, 2026",  deletedAt: null },
  { id: 7,  jobOrderRef: 8,  quotationRef: "QUO-1008", finalLabor: 300,   finalParts: 500,   finalTotal: 800,   warrantyStart: null,           warrantyEnd: null,           status: "Issued",  customerSigned: false, providerSigned: true,  createdAt: "May 11, 2026", deletedAt: null },
  { id: 8,  jobOrderRef: 3,  quotationRef: "QUO-1003", finalLabor: 4000,  finalParts: 5200,  finalTotal: 9200,  warrantyStart: null,           warrantyEnd: null,           status: "Draft",   customerSigned: false, providerSigned: false, createdAt: "May 11, 2026", deletedAt: "May 12, 2026" },
]

const STATUS_STYLE: Record<ServiceAgreementStatus, { bg: string; color: string }> = {
  Draft:  { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  Issued: { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  Signed: { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
}

const PAGE_SIZE = 8

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n)

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminServiceAgreementPage() {
  const navigate = useNavigate()

  const [data,         setData]         = useState<ServiceAgreement[]>(MOCK_DATA)
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState<ServiceAgreementStatus | "All">("All")
  const [showDeleted,  setShowDeleted]  = useState(false)
  const [page,         setPage]         = useState(1)
  const [deletingId,   setDeletingId]   = useState<number | null>(null)

  const softDelete = (id: number) => {
    setData(prev => prev.map(a => a.id === id ? { ...a, deletedAt: "Just now" } : a))
    setDeletingId(null)
  }
  const restore = (id: number) => {
    setData(prev => prev.map(a => a.id === id ? { ...a, deletedAt: null } : a))
  }

  const columns: ColumnDef<ServiceAgreement>[] = [
    {
      label: "ID", width: "60px",
      render: (row) => (
        <span style={{ fontSize: 12, color: "#475569", fontVariantNumeric: "tabular-nums" }}>
          {row.id}
        </span>
      ),
    },
    {
      label: "Quotation Ref", sortable: true,
      render: (row) => (
        <span
          onClick={() => row.deletedAt === null && navigate(`/admin/quotations/${row.quotationRef}`)}
          style={{
            fontSize: 13, fontWeight: 600, color: "#818cf8",
            cursor: row.deletedAt !== null ? "default" : "pointer",
            textDecoration: row.deletedAt !== null ? "line-through" : "none",
            textDecorationColor: "#475569",
          }}
          onMouseEnter={(e) => { if (row.deletedAt === null) e.currentTarget.style.textDecoration = "underline" }}
          onMouseLeave={(e) => { if (row.deletedAt === null) e.currentTarget.style.textDecoration = "none" }}
        >
          {row.quotationRef}
        </span>
      ),
    },
    {
      label: "Job Order", sortable: true,
      render: (row) => (
        <span
          onClick={() => row.deletedAt === null && navigate(`/admin/job-orders/${row.jobOrderRef}`)}
          style={{
            fontSize: 12.5, color: "#60a5fa",
            cursor: row.deletedAt !== null ? "default" : "pointer",
          }}
          onMouseEnter={(e) => { if (row.deletedAt === null) e.currentTarget.style.textDecoration = "underline" }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none" }}
        >
          JO-{row.jobOrderRef}
        </span>
      ),
    },
    {
      label: "Labor",
      render: (row) => (
        <span style={{ fontSize: 12.5, color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
          {fmt(row.finalLabor)}
        </span>
      ),
    },
    {
      label: "Parts",
      render: (row) => (
        <span style={{ fontSize: 12.5, color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
          {fmt(row.finalParts)}
        </span>
      ),
    },
    {
      label: "Total", sortable: true,
      render: (row) => (
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>
          {fmt(row.finalTotal)}
        </span>
      ),
    },
    {
      label: "Warranty",
      render: (row) => row.warrantyStart && row.warrantyEnd ? (
        <div>
          <div style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{row.warrantyStart}</div>
          <div style={{ fontSize: 11, color: "#334155" }}>→ {row.warrantyEnd}</div>
        </div>
      ) : (
        <span style={{ fontSize: 12, color: "#334155", fontStyle: "italic" }}>No warranty</span>
      ),
    },
    {
      label: "Signatures",
      render: (row) => (
        <div style={{ display: "flex", gap: 5 }}>
          <span style={{
            fontSize: 11, padding: "2px 7px", borderRadius: 10, fontWeight: 500,
            background: row.customerSigned ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
            color: row.customerSigned ? "#34d399" : "#475569",
          }}>
            Customer
          </span>
          <span style={{
            fontSize: 11, padding: "2px 7px", borderRadius: 10, fontWeight: 500,
            background: row.providerSigned ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
            color: row.providerSigned ? "#34d399" : "#475569",
          }}>
            Provider
          </span>
        </div>
      ),
    },
    {
      label: "Status",
      render: (row) => {
        const s = STATUS_STYLE[row.status]
        return (
          <span style={{
            display: "inline-block", padding: "3px 10px", borderRadius: 20,
            fontSize: 11.5, fontWeight: 500, background: s.bg, color: s.color,
          }}>
            {row.status}
          </span>
        )
      },
    },
    {
      label: "", width: "110px",
      render: (row) => {
        const isDeleted    = row.deletedAt !== null
        const isConfirming = deletingId === row.id
        return isConfirming ? (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#f87171", whiteSpace: "nowrap" }}>Archive?</span>
            <button
              onClick={() => softDelete(row.id)}
              style={{
                background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: 6, padding: "4px 9px", color: "#f87171", fontSize: 12, cursor: "pointer",
              }}
            >Yes</button>
            <button
              onClick={() => setDeletingId(null)}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, padding: "4px 9px", color: "#64748b", fontSize: 12, cursor: "pointer",
              }}
            >No</button>
          </div>
        ) : (
          <div
            style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}
            onClick={(e) => e.stopPropagation()}
          >
            {isDeleted ? (
              <ActionBtn icon={<RotateCcw size={13} />} title="Restore" color="#34d399" onClick={() => restore(row.id)} />
            ) : (
              <>
                {row.status === "Draft" && (
                  <ActionBtn icon={<Send size={13} />} title="Issue" color="#60a5fa" onClick={() => {}} />
                )}
                <ActionBtn icon={<Edit2 size={13} />} title="Edit" color="#818cf8" onClick={() => navigate(`/admin/service-agreements/${row.id}`)} />
                <ActionBtn icon={<Trash2 size={13} />} title="Archive" color="#f87171" onClick={() => setDeletingId(row.id)} />
              </>
            )}
          </div>
        )
      },
    },
  ]

  const filtered = data.filter(a => {
    const matchSearch =
      a.quotationRef.toLowerCase().includes(search.toLowerCase()) ||
      String(a.id).includes(search) ||
      String(a.jobOrderRef).includes(search)
    const matchStatus  = statusFilter === "All" || a.status === statusFilter
    const matchDeleted = showDeleted ? true : a.deletedAt === null
    return matchSearch && matchStatus && matchDeleted
  })

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeCount = data.filter(a => a.deletedAt === null).length
  const signedValue = data.filter(a => a.status === "Signed" && !a.deletedAt).reduce((s, a) => s + a.finalTotal, 0)

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <TitleComponent label="Service Agreements" icon={FileSignature} />
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            {activeCount} active · {fmt(signedValue)} signed value
          </p>
        </div>
        <CreateButton to="/admin/service-agreements/new" label="New Agreement" />
      </div>

      {/* Summary Strips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
        {(["Draft", "Issued", "Signed"] as ServiceAgreementStatus[]).map(s => {
          const count = data.filter(a => a.status === s && !a.deletedAt).length
          const style = STATUS_STYLE[s]
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(prev => prev === s ? "All" : s); setPage(1) }}
              style={{
                background: statusFilter === s ? style.bg : "#1e293b",
                border: `1px solid ${statusFilter === s ? style.color + "55" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                display: "flex", flexDirection: "column", gap: 4, textAlign: "left",
              }}
            >
              <span style={{ fontSize: 19, fontWeight: 700, color: style.color }}>{count}</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>{s}</span>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <Search size={14} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by ID, quotation ref, or job order…"
            style={{
              width: "100%", paddingLeft: 36, paddingRight: 14,
              height: 36, background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
              color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
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

      {/* Table */}
      <div style={{
        background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, overflow: "hidden",
      }}>
        <DataTable
          columns={columns}
          data={paged}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => navigate(`/admin/service-agreements/${row.id}`)}
          rowProps={{
            style: (row) => ({
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
          emptyMessage="No service agreements found."
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
              <PaginationBtn icon={<ChevronLeft size={14} />}  disabled={page === 1}          onClick={() => setPage(p => p - 1)} />
              <PaginationBtn icon={<ChevronRight size={14} />} disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ActionBtn({ icon, title, color, onClick }: { icon: React.ReactNode; title: string; color: string; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 30, height: 30, borderRadius: 7,
      background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
      color, cursor: "pointer",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${color}18`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >{icon}</button>
  )
}

function PaginationBtn({ icon, disabled, onClick }: { icon: React.ReactNode; disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 30, height: 30, borderRadius: 7,
      background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
      color: disabled ? "#334155" : "#94a3b8", cursor: disabled ? "not-allowed" : "pointer",
    }}>{icon}</button>
  )
}
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, Edit2, Trash2, RotateCcw,
  ChevronLeft, ChevronRight, ClipboardList, Filter, UserCheck,
} from "lucide-react"
import CreateButton from "../../../components/common/buttons/CreateButton"
import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"
import TableToolbar from "../../../components/common/table/TableToolbar"
import StatusSummaryStrip from "../../../components/common/stats/StatusSummary"

// ─── Types ────────────────────────────────────────────────────────────────────

type JobOrderStatus = "Unassigned" | "Scheduled" | "InProgress" | "PendingReview" | "Completed" | "Cancelled"

interface JobOrder {
  id: number
  quotationRef: string
  technician: string | null
  assignedBy: string | null
  startDate: string | null
  expectedFinishedDate: string | null
  completedAt: string | null
  status: JobOrderStatus
  createdAt: string
  deletedAt: string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: JobOrder[] = [
  { id: 1,  quotationRef: "QUO-1001", technician: "Paulo Mendez",    assignedBy: "James Alcantara", startDate: "May 8, 2026",  expectedFinishedDate: "May 10, 2026", completedAt: null,          status: "InProgress",     createdAt: "May 7, 2026",  deletedAt: null },
  { id: 2,  quotationRef: "QUO-1002", technician: "Nico Bautista",   assignedBy: "James Alcantara", startDate: "May 9, 2026",  expectedFinishedDate: "May 11, 2026", completedAt: null,          status: "Scheduled",      createdAt: "May 7, 2026",  deletedAt: null },
  { id: 3,  quotationRef: "QUO-1003", technician: null,              assignedBy: null,              startDate: null,           expectedFinishedDate: null,           completedAt: null,          status: "Unassigned",     createdAt: "May 8, 2026",  deletedAt: null },
  { id: 4,  quotationRef: "QUO-1004", technician: "Rica Santos",     assignedBy: "James Alcantara", startDate: "May 6, 2026",  expectedFinishedDate: "May 8, 2026",  completedAt: null,          status: "PendingReview",  createdAt: "May 5, 2026",  deletedAt: null },
  { id: 5,  quotationRef: "QUO-1005", technician: "Paulo Mendez",    assignedBy: "Rica Santos",     startDate: "Apr 30, 2026", expectedFinishedDate: "May 2, 2026",  completedAt: "May 2, 2026", status: "Completed",      createdAt: "Apr 29, 2026", deletedAt: null },
  { id: 6,  quotationRef: "QUO-1006", technician: "Nico Bautista",   assignedBy: "James Alcantara", startDate: "May 7, 2026",  expectedFinishedDate: "May 9, 2026",  completedAt: null,          status: "InProgress",     createdAt: "May 6, 2026",  deletedAt: null },
  { id: 7,  quotationRef: "QUO-1007", technician: null,              assignedBy: null,              startDate: null,           expectedFinishedDate: null,           completedAt: null,          status: "Cancelled",      createdAt: "May 6, 2026",  deletedAt: "May 7, 2026" },
  { id: 8,  quotationRef: "QUO-1008", technician: "Rica Santos",     assignedBy: "James Alcantara", startDate: "May 10, 2026", expectedFinishedDate: "May 13, 2026", completedAt: null,          status: "Scheduled",      createdAt: "May 8, 2026",  deletedAt: null },
  { id: 9,  quotationRef: "QUO-1009", technician: "Paulo Mendez",    assignedBy: "Rica Santos",     startDate: "May 3, 2026",  expectedFinishedDate: "May 5, 2026",  completedAt: "May 5, 2026", status: "Completed",      createdAt: "May 2, 2026",  deletedAt: null },
  { id: 10, quotationRef: "QUO-1010", technician: null,              assignedBy: null,              startDate: null,           expectedFinishedDate: null,           completedAt: null,          status: "Unassigned",     createdAt: "May 9, 2026",  deletedAt: null },
]

const STATUS_STYLE: Record<JobOrderStatus, { bg: string; color: string }> = {
  Unassigned:    { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  Scheduled:     { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  InProgress:    { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  PendingReview: { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  Completed:     { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  Cancelled:     { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
}

const STATUS_LABEL: Record<JobOrderStatus, string> = {
  Unassigned:    "Unassigned",
  Scheduled:     "Scheduled",
  InProgress:    "In Progress",
  PendingReview: "Pending Review",
  Completed:     "Completed",
  Cancelled:     "Cancelled",
}

const ALL_STATUSES: JobOrderStatus[] = ["Unassigned", "Scheduled", "InProgress", "PendingReview", "Completed", "Cancelled"]

const PAGE_SIZE = 8

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminJobOrderPage() {
  const navigate = useNavigate()

  const [data,         setData]         = useState<JobOrder[]>(MOCK_DATA)
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState<JobOrderStatus | "All">("All")
  const [showDeleted,  setShowDeleted]  = useState(false)
  const [page,         setPage]         = useState(1)
  const [deletingId,   setDeletingId]   = useState<number | null>(null)

  const softDelete = (id: number) => {
    setData(prev => prev.map(j => j.id === id ? { ...j, deletedAt: "Just now" } : j))
    setDeletingId(null)
  }
  const restore = (id: number) => {
    setData(prev => prev.map(j => j.id === id ? { ...j, deletedAt: null } : j))
  }

  const columns: ColumnDef<JobOrder>[] = [
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
      label: "Technician",
      render: (row) => row.technician ? (
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            background: "rgba(99,102,241,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#818cf8",
          }}>
            {row.technician.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <span style={{ fontSize: 13, color: "#e2e8f0" }}>{row.technician}</span>
        </div>
      ) : (
        <span style={{ fontSize: 12, color: "#334155", fontStyle: "italic" }}>Unassigned</span>
      ),
    },
    {
      label: "Assigned By",
      render: (row) => row.assignedBy ? (
        <span style={{ fontSize: 13, color: "#94a3b8" }}>{row.assignedBy}</span>
      ) : (
        <span style={{ fontSize: 12, color: "#334155", fontStyle: "italic" }}>—</span>
      ),
    },
    {
      label: "Start Date", sortable: true,
      render: (row) => (
        <span style={{ fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>
          {row.startDate ?? "—"}
        </span>
      ),
    },
    {
      label: "Expected Finish", sortable: true,
      render: (row) => (
        <span style={{ fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>
          {row.expectedFinishedDate ?? "—"}
        </span>
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
            {STATUS_LABEL[row.status]}
          </span>
        )
      },
    },
    {
      label: "", width: "100px",
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
                {row.status === "Unassigned" && (
                  <ActionBtn icon={<UserCheck size={13} />} title="Assign" color="#60a5fa" onClick={() => navigate(`/admin/job-orders/${row.id}/assign`)} />
                )}
                <ActionBtn icon={<Edit2 size={13} />} title="Edit" color="#818cf8" onClick={() => navigate(`/admin/job-orders/${row.id}`)} />
                <ActionBtn icon={<Trash2 size={13} />} title="Archive" color="#f87171" onClick={() => setDeletingId(row.id)} />
              </>
            )}
          </div>
        )
      },
    },
  ]

  const filtered = data.filter(j => {
    const matchSearch =
      j.quotationRef.toLowerCase().includes(search.toLowerCase()) ||
      (j.technician ?? "").toLowerCase().includes(search.toLowerCase()) ||
      String(j.id).includes(search)
    const matchStatus  = statusFilter === "All" || j.status === statusFilter
    const matchDeleted = showDeleted ? true : j.deletedAt === null
    return matchSearch && matchStatus && matchDeleted
  })

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeCount = data.filter(j => j.deletedAt === null).length

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <TitleComponent label="Job Orders" icon={ClipboardList} />
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            {activeCount} active job orders
          </p>
        </div>
      </div>

      {/* Summary Strips */}
      <StatusSummaryStrip
        columns={6}
        items={ALL_STATUSES.map((s) => ({
          label: STATUS_LABEL[s],
          count: data.filter(
            j => j.status === s && !j.deletedAt
          ).length,
          color: STATUS_STYLE[s].color,
          bg: STATUS_STYLE[s].bg,
          active: statusFilter === s,
          onClick: () => {
            setStatusFilter(prev =>
              prev === s ? "All" : s
            )
            setPage(1)
          },
        }))}
      />
      {/* Toolbar */}
      <TableToolbar
        search={search}
        onSearch={(value) => {
          setSearch(value)
          setPage(1)
        }}
        buttonLabel={
          showDeleted
            ? "Showing Archived"
            : "Show Archived"
        }
        buttonActive={showDeleted}
        onButtonClick={() => {
          setShowDeleted(v => !v)
          setPage(1)
        }}
        placeholder="Search by ID, quotation ref, or technician…"
        maxWidth={400}
      />

      {/* Table */}
      <div style={{
        background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, overflow: "hidden",
      }}>
        <DataTable
          columns={columns}
          data={paged}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => navigate(`/admin/job-orders/${row.id}`)}
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
          emptyMessage="No job orders found."
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
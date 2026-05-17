import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, Edit2, Trash2, RotateCcw,
  ChevronLeft, ChevronRight, FileText, Filter, Send, FileDown,
} from "lucide-react"
import CreateButton from "../../../components/common/buttons/CreateButton"
import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"
import { generateQuotationPDF } from "./QuotationPdf"
import TableToolbar from "../../../components/common/table/TableToolbar"
import StatusSummaryStrip from "../../../components/common/stats/StatusSummary"

// ─── Types ────────────────────────────────────────────────────────────────────

type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired"

interface Quotation {
  id: number
  quotationNo: string
  inquiryRef: string
  customer: string
  total: number
  status: QuotationStatus
  validUntil: string
  createdAt: string
  deletedAt: string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: Quotation[] = [
  { id: 1,  quotationNo: "QUO-1001", inquiryRef: "INQ-1032", customer: "Aisha Okonkwo",   total: 4800,  status: "Accepted", validUntil: "May 20, 2026", createdAt: "May 1, 2026",  deletedAt: null },
  { id: 2,  quotationNo: "QUO-1002", inquiryRef: "INQ-1033", customer: "Marco Dela Cruz",  total: 1250,  status: "Sent",     validUntil: "May 18, 2026", createdAt: "May 2, 2026",  deletedAt: null },
  { id: 3,  quotationNo: "QUO-1003", inquiryRef: "INQ-1034", customer: "Fatima Al-Hassan", total: 9200,  status: "Draft",    validUntil: "May 25, 2026", createdAt: "May 3, 2026",  deletedAt: null },
  { id: 4,  quotationNo: "QUO-1004", inquiryRef: "INQ-1035", customer: "James Villanueva", total: 3400,  status: "Rejected", validUntil: "May 10, 2026", createdAt: "May 3, 2026",  deletedAt: null },
  { id: 5,  quotationNo: "QUO-1005", inquiryRef: "INQ-1036", customer: "Grace Tan",        total: 6750,  status: "Expired",  validUntil: "May 5, 2026",  createdAt: "Apr 28, 2026", deletedAt: null },
  { id: 6,  quotationNo: "QUO-1006", inquiryRef: "INQ-1037", customer: "Daniel Reyes",     total: 2100,  status: "Accepted", validUntil: "May 22, 2026", createdAt: "May 4, 2026",  deletedAt: null },
  { id: 7,  quotationNo: "QUO-1007", inquiryRef: "INQ-1038", customer: "Sofia Mendoza",    total: 15000, status: "Sent",     validUntil: "May 19, 2026", createdAt: "May 5, 2026",  deletedAt: null },
  { id: 8,  quotationNo: "QUO-1008", inquiryRef: "INQ-1039", customer: "Ryan Santos",      total: 800,   status: "Draft",    validUntil: "May 28, 2026", createdAt: "May 5, 2026",  deletedAt: null },
  { id: 9,  quotationNo: "QUO-1009", inquiryRef: "INQ-1040", customer: "Aisha Okonkwo",   total: 3300,  status: "Draft",    validUntil: "May 30, 2026", createdAt: "May 6, 2026",  deletedAt: null },
  { id: 10, quotationNo: "QUO-1010", inquiryRef: "INQ-1021", customer: "Lena Bautista",    total: 5500,  status: "Accepted", validUntil: "May 12, 2026", createdAt: "Apr 24, 2026", deletedAt: "May 6, 2026" },
]

const STATUS_STYLE: Record<QuotationStatus, { bg: string; color: string }> = {
  Draft:    { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  Sent:     { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  Accepted: { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  Rejected: { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  Expired:  { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
}

const PAGE_SIZE = 8

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n)

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminQuotationPage() {
  const navigate = useNavigate()

  const [data,         setData]         = useState<Quotation[]>(MOCK_DATA)
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "All">("All")
  const [showDeleted,  setShowDeleted]  = useState(false)
  const [page,         setPage]         = useState(1)
  const [deletingId,   setDeletingId]   = useState<number | null>(null)

  const softDelete = (id: number) => {
    setData(prev => prev.map(q => q.id === id ? { ...q, deletedAt: "Just now" } : q))
    setDeletingId(null)
  }
  const restore = (id: number) => {
    setData(prev => prev.map(q => q.id === id ? { ...q, deletedAt: null } : q))
  }

  const downloadPDF = (row: Quotation) => {
    generateQuotationPDF({
      projectTitle:      row.quotationNo,
      objective:         "",
      dateIssued:        row.validUntil,
      clientName:        row.customer,
      clientAddress:     "",
      clientLogoPreview: null,
      items:             [{ name: "See quotation detail", description: "", qty: 1, unit_price: row.total }],
      scopes:            [],
      waivers:           [],
      deliverables:      [],
      timelineMin:       "",
      timelineMax:       "",
      termsConditions:   "",
      customerName:      row.customer,
      customerSignature: "",
      customerDate:      row.validUntil,
      providerName:      "",
      providerSignature: "",
      providerDate:      row.validUntil,
      diagnosticFee:     0,
      serviceName:       "",
    })
  }

  const columns: ColumnDef<Quotation>[] = [
    {
      label: "Quotation",
      render: (row) => (
        <span style={{
          fontSize: 13, fontWeight: 600, color: "#818cf8",
          fontVariantNumeric: "tabular-nums",
          textDecoration: row.deletedAt !== null ? "line-through" : "none",
          textDecorationColor: "#475569",
        }}>
          {row.quotationNo}
        </span>
      ),
    },
    {
      label: "Customer",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            background: "rgba(99,102,241,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#818cf8",
          }}>
            {row.customer.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <span style={{ fontSize: 13, color: "#e2e8f0" }}>{row.customer}</span>
        </div>
      ),
    },
    {
      label: "Inquiry Ref",
      render: (row) => {
        const isDeleted = row.deletedAt !== null
        return (
          <span
            onClick={() => !isDeleted && navigate(`/admin/inquiries/${row.inquiryRef}`)}
            style={{ fontSize: 12.5, color: "#60a5fa", cursor: isDeleted ? "default" : "pointer", textDecoration: "none" }}
            onMouseEnter={(e) => { if (!isDeleted) e.currentTarget.style.textDecoration = "underline" }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none" }}
          >
            {row.inquiryRef}
          </span>
        )
      },
    },
    {
      label: "Total",
      render: (row) => (
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>
          {fmt(row.total)}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => {
        const s = STATUS_STYLE[row.status]
        return (
          <span style={{
            display: "inline-block", padding: "3px 11px", borderRadius: 20,
            fontSize: 11.5, fontWeight: 500, background: s.bg, color: s.color,
          }}>
            {row.status}
          </span>
        )
      },
    },
    {
      label: "Valid Until",
      render: (row) => (
        <span style={{ fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{row.validUntil}</span>
      ),
    },
    {
      label: "Created",
      render: (row) => (
        <span style={{ fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{row.createdAt}</span>
      ),
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
                  <ActionBtn icon={<Send size={13} />} title="Send" color="#60a5fa" onClick={() => {}} />
                )}
                <ActionBtn icon={<FileDown size={13} />} title="Download PDF" color="#34d399" onClick={() => downloadPDF(row)} />
                <ActionBtn icon={<Edit2 size={13} />} title="Edit" color="#818cf8" onClick={() => navigate(`/admin/quotations/${row.id}`)} />
                <ActionBtn icon={<Trash2 size={13} />} title="Archive" color="#f87171" onClick={() => setDeletingId(row.id)} />
              </>
            )}
          </div>
        )
      },
    },
  ]

  const filtered = data.filter(q => {
    const matchSearch =
      q.quotationNo.toLowerCase().includes(search.toLowerCase()) ||
      q.customer.toLowerCase().includes(search.toLowerCase()) ||
      q.inquiryRef.toLowerCase().includes(search.toLowerCase())
    const matchStatus  = statusFilter === "All" || q.status === statusFilter
    const matchDeleted = showDeleted ? true : q.deletedAt === null
    return matchSearch && matchStatus && matchDeleted
  })

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeCount = data.filter(q => q.deletedAt === null)
  const totalValue  = activeCount.filter(q => q.status === "Accepted").reduce((s, q) => s + q.total, 0)

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <TitleComponent label="Quotation" icon={FileText} />
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            {activeCount.length} active · {fmt(totalValue)} accepted value
          </p>
        </div>
      </div>

      {/* Summary Strips */}
      <StatusSummaryStrip
        items={
          (["Draft", "Sent", "Accepted", "Rejected", "Expired"] as QuotationStatus[])
            .map((s) => ({
              label: s,
              count: data.filter(
                q => q.status === s && !q.deletedAt
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
            }))
        }
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
        placeholder="Search by quotation no., customer, or inquiry ref…"
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
          emptyMessage="No quotations found."
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
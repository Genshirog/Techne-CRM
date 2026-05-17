import { useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  Send,
  Tag,
} from "lucide-react"

import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type InvoiceStatus =
  | "Unpaid"
  | "DiagnosisPaid"
  | "DownpaymentPaid"
  | "FullyPaid"
  | "Overdue"

interface Invoice {
  id: number
  invoiceNumber: string
  customer: string
  service: string
  diagnosisFee: number
  estimatedTotal: number
  finalTotal: number
  downpayment: number
  balanceDue: number
  discount: number
  dueDate: string
  daysDue: number
  status: InvoiceStatus
  promoCode?: string
  lastPayment?: string
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const INVOICES: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2026-000124",
    customer: "Juan Dela Cruz",
    service: "Aircon Repair",
    diagnosisFee: 500,
    estimatedTotal: 4500,
    finalTotal: 4200,
    downpayment: 1000,
    balanceDue: 3200,
    discount: 300,
    dueDate: "May 20, 2026",
    daysDue: 4,
    status: "DownpaymentPaid",
    promoCode: "SAVE100",
    lastPayment: "May 13, 2026",
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-000125",
    customer: "Maria Santos",
    service: "Wiring Inspection",
    diagnosisFee: 300,
    estimatedTotal: 1200,
    finalTotal: 1200,
    downpayment: 300,
    balanceDue: 900,
    discount: 0,
    dueDate: "May 18, 2026",
    daysDue: 2,
    status: "DiagnosisPaid",
    lastPayment: "May 12, 2026",
  },
  {
    id: 3,
    invoiceNumber: "INV-2026-000126",
    customer: "Carlos Reyes",
    service: "Full Installation",
    diagnosisFee: 800,
    estimatedTotal: 9000,
    finalTotal: 8500,
    downpayment: 3000,
    balanceDue: 5500,
    discount: 500,
    dueDate: "May 15, 2026",
    daysDue: -12,
    status: "Overdue",
    promoCode: "NEWCLIENT",
    lastPayment: "Apr 30, 2026",
  },
  {
    id: 4,
    invoiceNumber: "INV-2026-000127",
    customer: "Andrea Lim",
    service: "Solar Panel Maintenance",
    diagnosisFee: 600,
    estimatedTotal: 6200,
    finalTotal: 6200,
    downpayment: 6200,
    balanceDue: 0,
    discount: 0,
    dueDate: "May 10, 2026",
    daysDue: 0,
    status: "FullyPaid",
    lastPayment: "May 10, 2026",
  },
]

const currency = (value: number) => `₱${value.toLocaleString()}`

const statusConfig: Record<InvoiceStatus, any> = {
  FullyPaid: {
    label: "Paid",
    bg: "rgba(16,185,129,0.15)",
    color: "#34d399",
    icon: <CheckCircle2 size={13} />,
  },
  Overdue: {
    label: "Past Due",
    bg: "rgba(239,68,68,0.15)",
    color: "#f87171",
    icon: <AlertTriangle size={13} />,
  },
  DiagnosisPaid: {
    label: "Diagnosis Settled",
    bg: "rgba(59,130,246,0.15)",
    color: "#60a5fa",
    icon: <Clock3 size={13} />,
  },
  DownpaymentPaid: {
    label: "Deposit Paid",
    bg: "rgba(168,85,247,0.15)",
    color: "#c084fc",
    icon: <CreditCard size={13} />,
  },
  Unpaid: {
    label: "Unpaid",
    bg: "rgba(148,163,184,0.15)",
    color: "#cbd5e1",
    icon: <Clock3 size={13} />,
  },
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<InvoiceStatus | "All">("All")

  const filtered = useMemo(() => {
    return INVOICES.filter((i) => {
      const matchesSearch =
        i.customer.toLowerCase().includes(search.toLowerCase()) ||
        i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        i.service.toLowerCase().includes(search.toLowerCase())

      const matchesFilter = filter === "All" || i.status === filter

      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  const collectedRevenue = INVOICES.filter(
    (i) => i.status === "FullyPaid"
  ).reduce((sum, i) => sum + i.finalTotal, 0)

  const outstandingBalance = INVOICES.reduce(
    (sum, i) => sum + i.balanceDue,
    0
  )

  const overdueAmount = INVOICES.filter(
    (i) => i.status === "Overdue"
  ).reduce((sum, i) => sum + i.balanceDue, 0)

  const columns: ColumnDef<Invoice>[] = [
    {
      label: "Invoice",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {row.invoiceNumber}
          </span>

          <span
            style={{
              color: "#64748b",
              fontSize: 11,
            }}
          >
            Last payment: {row.lastPayment}
          </span>
        </div>
      ),
    },

    {
      label: "Customer",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              color: "#f8fafc",
              fontWeight: 600,
            }}
          >
            {row.customer}
          </span>

          <span
            style={{
              color: "#64748b",
              fontSize: 12,
            }}
          >
            {row.service}
          </span>
        </div>
      ),
    },

    {
      label: "Payment Progress",
      render: (row) => {
        const paid = row.finalTotal - row.balanceDue
        const progress = (paid / row.finalTotal) * 100

        return (
          <div style={{ minWidth: 180 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                fontSize: 12,
              }}
            >
              <span style={{ color: "#cbd5e1" }}>
                {currency(paid)} paid
              </span>

              <span style={{ color: "#64748b" }}>
                {Math.round(progress)}%
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: 7,
                background: "#0f172a",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background:
                    row.status === "FullyPaid"
                      ? "#10b981"
                      : row.status === "Overdue"
                      ? "#ef4444"
                      : "#3b82f6",
                }}
              />
            </div>
          </div>
        )
      },
    },

    {
      label: "Total",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span
            style={{
              color: "#34d399",
              fontWeight: 700,
            }}
          >
            {currency(row.finalTotal)}
          </span>

          {row.discount > 0 && (
            <span
              style={{
                color: "#a78bfa",
                fontSize: 11,
              }}
            >
              Discount: {currency(row.discount)}
            </span>
          )}
        </div>
      ),
    },

    {
      label: "Balance",
      render: (row) => (
        <span
          style={{
            color: row.balanceDue > 0 ? "#facc15" : "#34d399",
            fontWeight: 700,
          }}
        >
          {currency(row.balanceDue)}
        </span>
      ),
    },

    {
      label: "Due Status",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              color: "#cbd5e1",
              fontSize: 12,
            }}
          >
            {row.dueDate}
          </span>

          <span
            style={{
              color: row.daysDue < 0 ? "#f87171" : "#94a3b8",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {row.daysDue < 0
              ? `OVERDUE • ${Math.abs(row.daysDue)} DAYS`
              : `Due in ${row.daysDue} day(s)`}
          </span>
        </div>
      ),
    },

    {
      label: "Status",
      render: (row) => {
        const config = statusConfig[row.status]

        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              background: config.bg,
              color: config.color,
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {config.icon}
            {config.label}
          </span>
        )
      },
    },

    {
      label: "Promo",
      render: (row) =>
        row.promoCode ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: "#a78bfa",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Tag size={13} />
            {row.promoCode}
          </span>
        ) : (
          <span
            style={{
              color: "#475569",
              fontSize: 12,
            }}
          >
            —
          </span>
        ),
    },

    {
      label: "Actions",
      render: () => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ActionButton icon={<Eye size={14} />} />
          <ActionButton icon={<CreditCard size={14} />} />
          <ActionButton icon={<Send size={14} />} />
          <ActionButton icon={<MoreHorizontal size={14} />} />
        </div>
      ),
    },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "28px",
        color: "#f8fafc",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <TitleComponent label="Invoice Operations" icon={FileText} />

          <p
            style={{
              marginTop: 6,
              color: "#64748b",
              fontSize: 13,
            }}
          >
            Monitor collections, balances, and invoice payment lifecycle
          </p>
        </div>

        <button
          style={{
            height: 42,
            padding: "0 18px",
            borderRadius: 12,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Generate Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 22,
        }}
      >
        <KPI
          label="Collected Revenue"
          value={currency(collectedRevenue)}
          subtitle="Successfully settled invoices"
          color="#34d399"
        />

        <KPI
          label="Outstanding Balance"
          value={currency(outstandingBalance)}
          subtitle="Pending collections"
          color="#facc15"
        />

        <KPI
          label="Past Due Amount"
          value={currency(overdueAmount)}
          subtitle="Requires immediate action"
          color="#f87171"
        />
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", width: 360 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              top: "50%",
              left: 14,
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice, customer, or service..."
            style={{
              width: "100%",
              height: 42,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#111827",
              paddingLeft: 40,
              color: "#f8fafc",
              outline: "none",
              fontSize: 13,
            }}
          />
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            <Filter size={14} />
            Filter:
          </div>

          {[
            "All",
            "Unpaid",
            "DiagnosisPaid",
            "DownpaymentPaid",
            "FullyPaid",
            "Overdue",
          ].map((status) => {
            const active = filter === status

            return (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                style={{
                  height: 34,
                  padding: "0 14px",
                  borderRadius: 999,
                  border: active
                    ? "1px solid #3b82f6"
                    : "1px solid rgba(255,255,255,0.06)",
                  background: active
                    ? "rgba(59,130,246,0.12)"
                    : "#111827",
                  color: active ? "#60a5fa" : "#94a3b8",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {status === "FullyPaid"
                  ? "Paid"
                  : status === "DownpaymentPaid"
                  ? "Deposit Paid"
                  : status === "DiagnosisPaid"
                  ? "Diagnosis"
                  : status === "Overdue"
                  ? "Past Due"
                  : status}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          background: "#111827",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#f8fafc",
              }}
            >
              Invoice Collection Queue
            </div>

            <div
              style={{
                marginTop: 4,
                color: "#64748b",
                fontSize: 12,
              }}
            >
              {filtered.length} invoice(s) found
            </div>
          </div>

          <button
            style={{
              height: 36,
              padding: "0 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "#1f2937",
              color: "#cbd5e1",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Export CSV
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyMessage="No invoices found"
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// KPI Card
// ─────────────────────────────────────────────

function KPI({
  label,
  value,
  subtitle,
  color,
}: {
  label: string
  value: string
  subtitle: string
  color: string
}) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 18,
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight: 800,
          color,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#64748b",
          fontSize: 12,
        }}
      >
        {subtitle}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Action Button
// ─────────────────────────────────────────────

function ActionButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "#1f2937",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#cbd5e1",
        cursor: "pointer",
      }}
    >
      {icon}
    </button>
  )
}

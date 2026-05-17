import { useMemo, useState } from "react"
import {
  CreditCard,
  TrendingUp,
  RefreshCcw,
  Wallet,
  Search,
  Filter,
  AlertTriangle,
  Landmark,
  Banknote,
  Smartphone,
} from "lucide-react"

import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type PaymentStage = "Diagnosis" | "Downpayment" | "Final"
type PaymentMethod = "Cash" | "GCash" | "BankTransfer"

interface Payment {
  id: number
  invoiceId: number
  customer: string
  amount: number
  stage: PaymentStage
  method: PaymentMethod
  referenceNumber?: string
  paidAt: string
  refunded: boolean
}

interface Refund {
  id: number
  paymentId: number
  amount: number
  reason: string
  refundedBy: string
  createdAt: string
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const PAYMENTS: Payment[] = [
  {
    id: 1,
    invoiceId: 1001,
    customer: "Juan Dela Cruz",
    amount: 4500,
    stage: "Downpayment",
    method: "GCash",
    referenceNumber: "GC-981231",
    paidAt: "May 10, 2026",
    refunded: false,
  },
  {
    id: 2,
    invoiceId: 1002,
    customer: "Maria Santos",
    amount: 1200,
    stage: "Diagnosis",
    method: "Cash",
    paidAt: "May 11, 2026",
    refunded: false,
  },
  {
    id: 3,
    invoiceId: 1003,
    customer: "Carlos Reyes",
    amount: 9000,
    stage: "Final",
    method: "BankTransfer",
    referenceNumber: "BTR-550912",
    paidAt: "May 12, 2026",
    refunded: true,
  },
]

const REFUNDS: Refund[] = [
  {
    id: 1,
    paymentId: 3,
    amount: 9000,
    reason: "Duplicate payment",
    refundedBy: "Admin",
    createdAt: "May 13, 2026",
  },
]

const peso = (value: number) => `₱${value.toLocaleString()}`

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function AdminBillingDashboard() {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return PAYMENTS.filter(
      (p) =>
        p.customer.toLowerCase().includes(search.toLowerCase()) ||
        String(p.invoiceId).includes(search)
    )
  }, [search])

  // ─────────────────────────────────────────────
  // Metrics
  // ─────────────────────────────────────────────

  const grossRevenue = PAYMENTS.reduce((sum, p) => sum + p.amount, 0)

  const refundedAmount = REFUNDS.reduce((sum, r) => sum + r.amount, 0)

  const netRevenue = grossRevenue - refundedAmount

  const refundedTransactions = PAYMENTS.filter(
    (p) => p.refunded
  ).length

  const refundRate =
    grossRevenue > 0
      ? ((refundedAmount / grossRevenue) * 100).toFixed(1)
      : "0"

  // Method breakdown

  const cashRevenue = PAYMENTS.filter(
    (p) => p.method === "Cash" && !p.refunded
  ).reduce((sum, p) => sum + p.amount, 0)

  const gcashRevenue = PAYMENTS.filter(
    (p) => p.method === "GCash" && !p.refunded
  ).reduce((sum, p) => sum + p.amount, 0)

  const bankRevenue = PAYMENTS.filter(
    (p) => p.method === "BankTransfer" && !p.refunded
  ).reduce((sum, p) => sum + p.amount, 0)

  // Stage breakdown

  const diagnosisRevenue = PAYMENTS.filter(
    (p) => p.stage === "Diagnosis" && !p.refunded
  ).reduce((sum, p) => sum + p.amount, 0)

  const depositRevenue = PAYMENTS.filter(
    (p) => p.stage === "Downpayment" && !p.refunded
  ).reduce((sum, p) => sum + p.amount, 0)

  const finalRevenue = PAYMENTS.filter(
    (p) => p.stage === "Final" && !p.refunded
  ).reduce((sum, p) => sum + p.amount, 0)

  // ─────────────────────────────────────────────
  // Table
  // ─────────────────────────────────────────────

  const columns: ColumnDef<Payment>[] = [
    {
      label: "Invoice",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#f8fafc",
              fontWeight: 700,
            }}
          >
            INV-2026-{row.invoiceId}
          </span>

          <span
            style={{
              color: "#64748b",
              fontSize: 11,
            }}
          >
            {row.paidAt}
          </span>
        </div>
      ),
    },

    {
      label: "Customer",
      render: (row) => (
        <span style={{ color: "#f8fafc" }}>
          {row.customer}
        </span>
      ),
    },

    {
      label: "Amount",
      render: (row) => (
        <span
          style={{
            color: row.refunded ? "#f87171" : "#34d399",
            fontWeight: 700,
          }}
        >
          {peso(row.amount)}
        </span>
      ),
    },

    {
      label: "Collection Stage",
      render: (row) => {
        const config =
          row.stage === "Final"
            ? {
                bg: "rgba(16,185,129,0.15)",
                color: "#34d399",
              }
            : row.stage === "Downpayment"
            ? {
                bg: "rgba(59,130,246,0.15)",
                color: "#60a5fa",
              }
            : {
                bg: "rgba(148,163,184,0.15)",
                color: "#94a3b8",
              }

        return (
          <span
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              background: config.bg,
              color: config.color,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {row.stage}
          </span>
        )
      },
    },

    {
      label: "Method",
      render: (row) => (
        <span
          style={{
            color: "#cbd5e1",
            fontSize: 12,
          }}
        >
          {row.method}
        </span>
      ),
    },

    {
      label: "Transaction Status",
      render: (row) => (
        <span
          style={{
            color: row.refunded
              ? "#f87171"
              : "#34d399",
            fontWeight: 700,
          }}
        >
          {row.refunded ? "Refunded" : "Successful"}
        </span>
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
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <TitleComponent
            label="Billing & Finance"
            icon={CreditCard}
          />

          <p
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Revenue tracking, refunds, and transaction monitoring
          </p>
        </div>
      </div>

      {/* KPI Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <KPI
          icon={<TrendingUp size={16} />}
          label="Gross Revenue"
          value={peso(grossRevenue)}
          color="#34d399"
        />

        <KPI
          icon={<RefreshCcw size={16} />}
          label="Refund Losses"
          value={peso(refundedAmount)}
          color="#f87171"
        />

        <KPI
          icon={<Wallet size={16} />}
          label="Net Revenue"
          value={peso(netRevenue)}
          color="#60a5fa"
        />

        <KPI
          icon={<AlertTriangle size={16} />}
          label="Refund Rate"
          value={`${refundRate}%`}
          color="#facc15"
        />
      </div>

      {/* Insights Grid */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 22,
        }}
      >
        {/* Payment Methods */}

        <div
          style={{
            background: "#111827",
            borderRadius: 18,
            padding: 18,
            border:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Payment Method Breakdown
          </div>

          <BreakdownItem
            icon={<Banknote size={15} />}
            label="Cash"
            value={peso(cashRevenue)}
          />

          <BreakdownItem
            icon={<Smartphone size={15} />}
            label="GCash"
            value={peso(gcashRevenue)}
          />

          <BreakdownItem
            icon={<Landmark size={15} />}
            label="Bank Transfer"
            value={peso(bankRevenue)}
          />
        </div>

        {/* Collection Stages */}

        <div
          style={{
            background: "#111827",
            borderRadius: 18,
            padding: 18,
            border:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Revenue by Collection Stage
          </div>

          <BreakdownItem
            label="Diagnosis"
            value={peso(diagnosisRevenue)}
          />

          <BreakdownItem
            label="Downpayments"
            value={peso(depositRevenue)}
          />

          <BreakdownItem
            label="Final Collections"
            value={peso(finalRevenue)}
          />
        </div>
      </div>

      {/* Toolbar */}

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
          }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search customer or invoice..."
            style={{
              width: "100%",
              height: 42,
              paddingLeft: 38,
              borderRadius: 12,
              border:
                "1px solid rgba(255,255,255,0.06)",
              background: "#111827",
              color: "#f8fafc",
              outline: "none",
            }}
          />
        </div>

        <button
          style={{
            height: 42,
            padding: "0 14px",
            borderRadius: 12,
            border:
              "1px solid rgba(255,255,255,0.06)",
            background: "#111827",
            color: "#cbd5e1",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <Filter size={14} />
          Filters
        </button>
      </div>

      {/* Table */}

      <div
        style={{
          background: "#111827",
          borderRadius: 20,
          overflow: "hidden",
          border:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyMessage="No payment records found"
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// KPI
// ─────────────────────────────────────────────

function KPI({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 18,
        padding: 18,
        border:
          "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {icon}
        {label}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 26,
          fontWeight: 800,
          color: "#f8fafc",
        }}
      >
        {value}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Breakdown Item
// ─────────────────────────────────────────────

function BreakdownItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom:
          "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#cbd5e1",
          fontSize: 13,
        }}
      >
        {icon}
        {label}
      </div>

      <span
        style={{
          color: "#f8fafc",
          fontWeight: 700,
        }}
      >
        {value}
      </span>
    </div>
  )
}
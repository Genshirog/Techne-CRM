import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Ticket,
  RotateCcw,
  Archive,
  MessageSquare,
  AlertTriangle,
  UserPlus,
  Eye,
} from "lucide-react"

import CreateButton from "../../../components/common/buttons/CreateButton"
import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"
import TableToolbar from "../../../components/common/table/TableToolbar"
import StatusSummaryStrip from "../../../components/common/stats/StatusSummary"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type TicketCategory =
  | "Billing"
  | "Technical"
  | "Warranty"
  | "Complaint"
  | "Other"

type TicketPriority = "Low" | "Medium" | "High" | "Urgent"

type TicketStatus =
  | "Open"
  | "InProgress"
  | "Resolved"
  | "Closed"

interface TicketItem {
  id: number
  customer: string
  title: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  assignedTo: string | null
  replies: number
  createdAt: string
  updatedAt: string
  lastReplyAt: string
  deletedAt: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_TICKETS: TicketItem[] = [
  {
    id: 1001,
    customer: "Northwind Trading",
    title: "POS terminal not syncing transactions",
    category: "Technical",
    priority: "Urgent",
    status: "InProgress",
    assignedTo: "Miguel Santos",
    replies: 8,
    createdAt: "May 10, 2026",
    updatedAt: "5 mins ago",
    lastReplyAt: "5 mins ago",
    deletedAt: null,
  },
  {
    id: 1002,
    customer: "BrightMart",
    title: "Duplicate invoice generated",
    category: "Billing",
    priority: "High",
    status: "Open",
    assignedTo: null,
    replies: 1,
    createdAt: "May 11, 2026",
    updatedAt: "1 hour ago",
    lastReplyAt: "1 hour ago",
    deletedAt: null,
  },
  {
    id: 1003,
    customer: "Urban Retail",
    title: "Warranty request for barcode scanner",
    category: "Warranty",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Alyssa Cruz",
    replies: 5,
    createdAt: "May 8, 2026",
    updatedAt: "Yesterday",
    lastReplyAt: "Yesterday",
    deletedAt: null,
  },
  {
    id: 1004,
    customer: "TechWave",
    title: "Customer complaint regarding delayed repair",
    category: "Complaint",
    priority: "High",
    status: "Open",
    assignedTo: "Jerome Tan",
    replies: 3,
    createdAt: "May 12, 2026",
    updatedAt: "3 days ago",
    lastReplyAt: "3 days ago",
    deletedAt: null,
  },
  {
    id: 1005,
    customer: "Alpha Distribution",
    title: "Need assistance with printer configuration",
    category: "Technical",
    priority: "Low",
    status: "Closed",
    assignedTo: "Kaye Ramos",
    replies: 2,
    createdAt: "May 1, 2026",
    updatedAt: "4 days ago",
    lastReplyAt: "4 days ago",
    deletedAt: null,
  },
]

const PAGE_SIZE = 7

const PRIORITY_STYLE: Record<TicketPriority, { bg: string; color: string }> = {
  Low: {
    bg: "rgba(100,116,139,0.15)",
    color: "#94a3b8",
  },
  Medium: {
    bg: "rgba(250,204,21,0.12)",
    color: "#facc15",
  },
  High: {
    bg: "rgba(249,115,22,0.12)",
    color: "#fb923c",
  },
  Urgent: {
    bg: "rgba(239,68,68,0.14)",
    color: "#f87171",
  },
}

const STATUS_STYLE: Record<TicketStatus, { bg: string; color: string }> = {
  Open: {
    bg: "rgba(59,130,246,0.14)",
    color: "#60a5fa",
  },
  InProgress: {
    bg: "rgba(168,85,247,0.14)",
    color: "#c084fc",
  },
  Resolved: {
    bg: "rgba(16,185,129,0.14)",
    color: "#34d399",
  },
  Closed: {
    bg: "rgba(100,116,139,0.14)",
    color: "#94a3b8",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminTicketPage() {
  const navigate = useNavigate()

  const [data, setData] = useState(MOCK_TICKETS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">(
    "All"
  )
  const [showArchived, setShowArchived] = useState(false)
  const [page, setPage] = useState(1)

  const archiveTicket = (id: number) => {
    setData((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, deletedAt: "Just now" } : t
      )
    )
  }

  const restoreTicket = (id: number) => {
    setData((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, deletedAt: null } : t
      )
    )
  }

  const filtered = useMemo(() => {
    return data.filter((ticket) => {
      const matchSearch =
        ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(search.toLowerCase()) ||
        String(ticket.id).includes(search)

      const matchStatus =
        statusFilter === "All" || ticket.status === statusFilter

      const matchDeleted =
        showArchived ? true : ticket.deletedAt === null

      return matchSearch && matchStatus && matchDeleted
    })
  }, [data, search, statusFilter, showArchived])

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  const paged = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  const openCount = data.filter(
    (t) => t.status === "Open" && !t.deletedAt
  ).length

  const urgentCount = data.filter(
    (t) => t.priority === "Urgent" && !t.deletedAt
  ).length

  const unassignedCount = data.filter(
    (t) => !t.assignedTo && !t.deletedAt
  ).length

  const resolvedCount = data.filter(
    (t) => t.status === "Resolved" && !t.deletedAt
  ).length

  const columns: ColumnDef<TicketItem>[] = [
    {
      label: "ID",
      width: "70px",
      render: (row) => (
        <span
          style={{
            fontSize: 12,
            color: "#94a3b8",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          #{row.id}
        </span>
      ),
    },

    {
      label: "Ticket",
      sortable: true,
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "#f8fafc",
            }}
          >
            {row.title}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <span style={{ color: "#64748b" }}>{row.customer}</span>

            <span style={{ color: "#334155" }}>•</span>

            <span style={{ color: "#818cf8" }}>
              {row.replies} replies
            </span>
          </div>
        </div>
      ),
    },

    {
      label: "Category",
      render: (row) => (
        <span
          style={{
            fontSize: 12,
            color: "#cbd5e1",
          }}
        >
          {row.category}
        </span>
      ),
    },

    {
      label: "Priority",
      render: (row) => {
        const p = PRIORITY_STYLE[row.priority]

        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 20,
              background: p.bg,
              color: p.color,
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            {row.priority === "Urgent" && (
              <AlertTriangle size={12} />
            )}

            {row.priority}
          </span>
        )
      },
    },

    {
      label: "Assigned To",
      render: (row) =>
        row.assignedTo ? (
          <span
            style={{
              fontSize: 12.5,
              color: "#e2e8f0",
            }}
          >
            {row.assignedTo}
          </span>
        ) : (
          <span
            style={{
              fontSize: 12,
              color: "#fb923c",
              fontWeight: 600,
            }}
          >
            Unassigned
          </span>
        ),
    },

    {
      label: "Status",
      render: (row) => {
        const s = STATUS_STYLE[row.status]

        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 999,
              background: s.bg,
              color: s.color,
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            {row.status}
          </span>
        )
      },
    },

    {
      label: "Last Activity",
      render: (row) => {
        const stale =
          row.updatedAt.includes("days")

        return (
          <span
            style={{
              fontSize: 12,
              color: stale ? "#fb923c" : "#94a3b8",
              fontWeight: stale ? 600 : 400,
            }}
          >
            {row.updatedAt}
          </span>
        )
      },
    },

    {
      label: "",
      width: "150px",
      render: (row) => {
        const isDeleted = row.deletedAt !== null

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 6,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isDeleted ? (
              <ActionBtn
                title="Restore"
                color="#34d399"
                icon={<RotateCcw size={13} />}
                onClick={() => restoreTicket(row.id)}
              />
            ) : (
              <>
                <ActionBtn
                  title="View"
                  color="#60a5fa"
                  icon={<Eye size={13} />}
                  onClick={() =>
                    navigate(`/admin/tickets/${row.id}`)
                  }
                />

                <ActionBtn
                  title="Assign"
                  color="#c084fc"
                  icon={<UserPlus size={13} />}
                  onClick={() => {}}
                />

                <ActionBtn
                  title="Reply"
                  color="#34d399"
                  icon={<MessageSquare size={13} />}
                  onClick={() => {}}
                />

                <ActionBtn
                  title="Archive"
                  color="#f87171"
                  icon={<Archive size={13} />}
                  onClick={() => archiveTicket(row.id)}
                />
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "28px 32px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <TitleComponent label="Support Tickets" icon={Ticket} />

          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              marginTop: 4,
            }}
          >
            Manage customer concerns, assignments, and
            technician responses.
          </p>
        </div>

        <CreateButton
          to="/admin/tickets/new"
          label="Create Ticket"
        />
      </div>

      {/* Status Summary */}

      <StatusSummaryStrip
        columns={4}
        items={[
          {
            label: "Open Tickets",
            count: openCount,
            color: "#60a5fa",
            bg: "rgba(59,130,246,0.14)",
          },
          {
            label: "Urgent",
            count: urgentCount,
            color: "#f87171",
            bg: "rgba(239,68,68,0.14)",
          },
          {
            label: "Unassigned",
            count: unassignedCount,
            color: "#fb923c",
            bg: "rgba(249,115,22,0.12)",
          },
          {
            label: "Resolved",
            count: resolvedCount,
            color: "#34d399",
            bg: "rgba(16,185,129,0.14)",
          },
        ]}
      />

      {/* Toolbar */}

      <TableToolbar
        search={search}
        onSearch={(value) => {
          setSearch(value)
          setPage(1)
        }}
        buttonLabel={
          showArchived
            ? "Showing Archived"
            : "Archived"
        }
        buttonActive={showArchived}
        onButtonClick={() => {
          setShowArchived((v) => !v)
          setPage(1)
        }}
        placeholder="Search ticket, customer, or ID..."
        maxWidth={420}
      />

      {/* Table */}

      <div
        style={{
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <DataTable
          columns={columns}
          data={paged}
          keyExtractor={(row) => row.id}
          onRowClick={(row) =>
            navigate(`/admin/tickets/${row.id}`)
          }
          rowProps={{
            style: (row) => ({
              background:
                row.deletedAt !== null
                  ? "rgba(248,113,113,0.03)"
                  : "transparent",
              opacity: row.deletedAt ? 0.6 : 1,
            }),
          }}
          emptyMessage="No tickets found."
        />

        {/* Pagination */}

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 18px",
              borderTop:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "#64748b",
              }}
            >
              {filtered.length} results · Page {page} of{" "}
              {totalPages}
            </span>

            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "#0f172a",
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  color:
                    page === 1 ? "#334155" : "#94a3b8",
                  cursor:
                    page === 1
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "#0f172a",
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  color:
                    page === totalPages
                      ? "#334155"
                      : "#94a3b8",
                  cursor:
                    page === totalPages
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({
  icon,
  title,
  color,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 31,
        height: 31,
        borderRadius: 8,
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.06)",
        color,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${color}15`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent"
      }}
    >
      {icon}
    </button>
  )
}
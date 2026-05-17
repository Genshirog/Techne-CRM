import { useMemo, useState } from "react"
import {
  Clock3,
  CheckCircle2,
  Wrench,
  Star,
  Search,
  Eye,
  MessageSquare,
  CircleAlert,
} from "lucide-react"

import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed"

interface AssignedTicket {
  id: number
  customer: string
  title: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: TicketStatus
  updatedAt: string
  replies: number
}

interface AssignedJob {
  id: number
  service: string
  customer: string
  scheduledDate: string
  status: "Pending" | "On Site" | "Completed"
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_TICKETS: AssignedTicket[] = [
  {
    id: 1001,
    customer: "Northwind Trading",
    title: "POS terminal not syncing sales",
    priority: "Urgent",
    status: "In Progress",
    updatedAt: "5 mins ago",
    replies: 6,
  },
  {
    id: 1002,
    customer: "BrightMart",
    title: "Printer not responding",
    priority: "High",
    status: "Open",
    updatedAt: "30 mins ago",
    replies: 2,
  },
  {
    id: 1003,
    customer: "Urban Retail",
    title: "Warranty replacement request",
    priority: "Medium",
    status: "Resolved",
    updatedAt: "Yesterday",
    replies: 4,
  },
]

const MOCK_JOBS: AssignedJob[] = [
  {
    id: 201,
    service: "Air Conditioner Installation",
    customer: "TechWave Solutions",
    scheduledDate: "May 14, 2026 • 10:00 AM",
    status: "Pending",
  },
  {
    id: 202,
    service: "Electrical Wiring Maintenance",
    customer: "Urban Retail",
    scheduledDate: "May 14, 2026 • 1:00 PM",
    status: "On Site",
  },
]

const PRIORITY_STYLE = {
  Low: {
    bg: "rgba(148,163,184,0.12)",
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
    bg: "rgba(239,68,68,0.12)",
    color: "#f87171",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminTechnicianPage() {
  const [search, setSearch] = useState("")

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter((ticket) => {
      return (
        ticket.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        ticket.customer
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    })
  }, [search])

  const columns: ColumnDef<AssignedTicket>[] = [
    {
      label: "Ticket",
      sortable: true,
      render: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "#f8fafc",
            }}
          >
            {row.title}
          </span>

          <span
            style={{
              fontSize: 12,
              color: "#64748b",
            }}
          >
            {row.customer}
          </span>
        </div>
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
              borderRadius: 999,
              background: p.bg,
              color: p.color,
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            {row.priority === "Urgent" && (
              <CircleAlert size={12} />
            )}

            {row.priority}
          </span>
        )
      },
    },

    {
      label: "Status",
      render: (row) => (
        <span
          style={{
            fontSize: 12,
            color: "#cbd5e1",
          }}
        >
          {row.status}
        </span>
      ),
    },

    {
      label: "Replies",
      render: (row) => (
        <span
          style={{
            fontSize: 12,
            color: "#818cf8",
          }}
        >
          {row.replies} replies
        </span>
      ),
    },

    {
      label: "Updated",
      render: (row) => (
        <span
          style={{
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          {row.updatedAt}
        </span>
      ),
    },

    {
      label: "",
      width: "100px",
      render: () => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <ActionBtn
            icon={<Eye size={13} />}
            color="#60a5fa"
          />

          <ActionBtn
            icon={<MessageSquare size={13} />}
            color="#34d399"
          />
        </div>
      ),
    },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "28px 32px",
        fontFamily: "'DM Sans', sans-serif",
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
          <TitleComponent
            label="Technician Dashboard"
            icon={Wrench}
          />

          <p
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Monitor assigned tickets, customer requests,
            and scheduled field operations.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#1e293b",
            border:
              "1px solid rgba(255,255,255,0.06)",
            padding: "10px 14px",
            borderRadius: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Miguel Santos
            </div>

            <div
              style={{
                fontSize: 11.5,
                color: "#64748b",
              }}
            >
              HVAC Specialist
            </div>
          </div>

          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#34d399",
            }}
          />
        </div>
      </div>

      {/* Summary */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <SummaryCard
          icon={<Clock3 size={18} />}
          value="5"
          label="Active Tickets"
          color="#60a5fa"
        />

        <SummaryCard
          icon={<CheckCircle2 size={18} />}
          value="21"
          label="Completed Jobs"
          color="#34d399"
        />

        <SummaryCard
          icon={<CircleAlert size={18} />}
          value="2"
          label="Urgent Requests"
          color="#f87171"
        />

        <SummaryCard
          icon={<Star size={18} />}
          value="4.8"
          label="Average Rating"
          color="#facc15"
        />
      </div>

      {/* Assigned Jobs */}

      <div
        style={{
          marginBottom: 22,
          background: "#1e293b",
          border:
            "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: 18,
            fontSize: 16,
          }}
        >
          Today's Assignments
        </h3>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {MOCK_JOBS.map((job) => (
            <div
              key={job.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#0f172a",
                borderRadius: 12,
                padding: "14px 16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {job.service}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                  }}
                >
                  {job.customer}
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#cbd5e1",
                    marginBottom: 5,
                  }}
                >
                  {job.scheduledDate}
                </div>

                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: 999,
                    background:
                      job.status === "Completed"
                        ? "rgba(16,185,129,0.12)"
                        : job.status === "On Site"
                        ? "rgba(59,130,246,0.12)"
                        : "rgba(250,204,21,0.12)",
                    color:
                      job.status === "Completed"
                        ? "#34d399"
                        : job.status === "On Site"
                        ? "#60a5fa"
                        : "#facc15",
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Table */}

      <div
        style={{
          background: "#1e293b",
          border:
            "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 18,
            borderBottom:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 15,
            }}
          >
            Assigned Tickets
          </h3>

          <div
            style={{
              position: "relative",
              width: 320,
            }}
          >
            <Search
              size={14}
              color="#475569"
              style={{
                position: "absolute",
                top: "50%",
                left: 12,
                transform: "translateY(-50%)",
              }}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search tickets..."
              style={{
                width: "100%",
                height: 38,
                paddingLeft: 36,
                paddingRight: 14,
                borderRadius: 10,
                border:
                  "1px solid rgba(255,255,255,0.06)",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTickets}
          keyExtractor={(row) => row.id}
          emptyMessage="No assigned tickets found."
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: string
  label: string
  color: string
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#f8fafc",
          marginBottom: 4,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 12.5,
          color: "#94a3b8",
        }}
      >
        {label}
      </div>
    </div>
  )
}

function ActionBtn({
  icon,
  color,
}: {
  icon: React.ReactNode
  color: string
}) {
  return (
    <button
      style={{
        width: 31,
        height: 31,
        borderRadius: 8,
        border:
          "1px solid rgba(255,255,255,0.06)",
        background: "transparent",
        color,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </button>
  )
}

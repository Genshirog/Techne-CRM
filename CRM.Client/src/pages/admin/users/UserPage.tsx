import { useEffect, useMemo, useState } from "react"
import {
  Clock3,
  CheckCircle2,
  Wrench,
  Star,
  Search,
  Eye,
  MessageSquare,
  CircleAlert,
  UserPlus,
  X,
} from "lucide-react"

import axios from "../../../api/axios"

import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed"

interface AssignedTicket {
  id: number
  customer: string
  title: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: TicketStatus
  updatedAt: string
  replies: number
  assignedTechnicianId?: number
}

interface AssignedJob {
  id: number
  service: string
  customer: string
  scheduledDate: string
  status: "Pending" | "On Site" | "Completed"
}

interface TechnicianOption {
  id: number
  userId: number
  specialization: string
  isAvailable: boolean
  averageRating: number
  totalReviews: number
  user: {
    id: number
    name: string
    email: string
  }
}

const PRIORITY_STYLE = {
  Low: { bg: "rgba(148,163,184,0.12)", color: "#94a3b8" },
  Medium: { bg: "rgba(250,204,21,0.12)", color: "#facc15" },
  High: { bg: "rgba(249,115,22,0.12)", color: "#fb923c" },
  Urgent: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
}

// ─────────────────────────────────────────────────────────────────────────────
// Assign Technician Modal
// ─────────────────────────────────────────────────────────────────────────────

function AssignTechnicianModal({
  ticket,
  technicians,
  loading,
  onAssign,
  onClose,
}: {
  ticket: AssignedTicket
  technicians: TechnicianOption[]
  loading: boolean
  onAssign: (technicianId: number) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<number | undefined>(
    ticket.assignedTechnicianId
  )
  const [assigning, setAssigning] = useState(false)

  const handleConfirm = async () => {
    if (!selected) return
    setAssigning(true)
    await onAssign(selected)
    setAssigning(false)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 24,
          width: 460,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
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
              Assign Technician
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                marginTop: 2,
              }}
            >
              #{ticket.id} — {ticket.title}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "#64748b",
                fontSize: 13,
              }}
            >
              Loading technicians...
            </div>
          ) : technicians.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "#64748b",
                fontSize: 13,
              }}
            >
              No technicians available.
            </div>
          ) : (
            technicians.map((tech) => {
              const isSelected = selected === tech.id

              return (
                <div
                  key={tech.id}
                  onClick={() => tech.isAvailable && setSelected(tech.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: isSelected
                      ? "1px solid #6366f1"
                      : "1px solid rgba(255,255,255,0.06)",
                    background: isSelected
                      ? "rgba(99,102,241,0.1)"
                      : "#0f172a",
                    cursor: tech.isAvailable ? "pointer" : "not-allowed",
                    opacity: tech.isAvailable ? 1 : 0.45,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: isSelected
                        ? "rgba(99,102,241,0.2)"
                        : "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: isSelected ? "#818cf8" : "#94a3b8",
                    }}
                  >
                    {tech.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#f8fafc",
                      }}
                    >
                      {tech.user.name}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginTop: 2,
                      }}
                    >
                      {tech.specialization}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#facc15",
                        marginBottom: 4,
                      }}
                    >
                      ★ {tech.averageRating.toFixed(1)}
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: tech.isAvailable
                          ? "rgba(52,211,153,0.12)"
                          : "rgba(239,68,68,0.12)",
                        color: tech.isAvailable ? "#34d399" : "#f87171",
                      }}
                    >
                      {tech.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            paddingTop: 4,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "#94a3b8",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selected || assigning}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: "none",
              background: selected
                ? "#6366f1"
                : "rgba(99,102,241,0.3)",
              color: selected ? "#fff" : "#94a3b8",
              fontSize: 13,
              fontWeight: 600,
              cursor: selected ? "pointer" : "not-allowed",
            }}
          >
            {assigning ? "Assigning..." : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminTechnicianPage() {
  const [search, setSearch] = useState("")

  const [tickets, setTickets] = useState<AssignedTicket[]>([])
  const [jobs, setJobs] = useState<AssignedJob[]>([])
  const [technicians, setTechnicians] = useState<TechnicianOption[]>([])

  const [techLoading, setTechLoading] = useState(false)
  const [ticketLoading, setTicketLoading] = useState(false)
  const [jobLoading, setJobLoading] = useState(false)

  const [modalTicket, setModalTicket] =
    useState<AssignedTicket | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTechLoading(true)
        setTicketLoading(true)
        setJobLoading(true)

        const [techRes, ticketRes, jobRes] = await Promise.all([
          axios.get("/technicians"),
          axios.get("/tickets"),
          axios.get("/jobs"),
        ])

        setTechnicians(techRes.data)
        setTickets(ticketRes.data)
        setJobs(jobRes.data)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      } finally {
        setTechLoading(false)
        setTicketLoading(false)
        setJobLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAssign = async (technicianId: number) => {
    if (!modalTicket) return

    try {
      await axios.post(`/tickets/${modalTicket.id}/assign`, {
        technicianId,
      })

      setTickets((prev) =>
        prev.map((t) =>
          t.id === modalTicket.id
            ? { ...t, assignedTechnicianId: technicianId }
            : t
        )
      )

      setModalTicket(null)
    } catch (err) {
      console.error("Failed to assign technician:", err)
    }
  }

  const filteredTickets = useMemo(() => {
    return tickets.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.customer.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, tickets])

  const getTechnicianName = (id?: number) => {
    if (!id) return null

    const tech = technicians.find((t) => t.id === id)

    return tech ? tech.user.name : null
  }

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
      label: "Assigned To",
      render: (row) => {
        const name = getTechnicianName(
          row.assignedTechnicianId
        )

        return name ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#818cf8",
              background: "rgba(99,102,241,0.1)",
              padding: "3px 10px",
              borderRadius: 999,
            }}
          >
            {name}
          </span>
        ) : (
          <span
            style={{
              fontSize: 12,
              color: "#475569",
            }}
          >
            Unassigned
          </span>
        )
      },
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
      width: "130px",
      render: (row) => (
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

          <ActionBtn
            icon={<UserPlus size={13} />}
            color="#818cf8"
            onClick={() => setModalTicket(row)}
            title="Assign Technician"
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
      {modalTicket && (
        <AssignTechnicianModal
          ticket={modalTicket}
          technicians={technicians}
          loading={techLoading}
          onAssign={handleAssign}
          onClose={() => setModalTicket(null)}
        />
      )}

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
      </div>

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
          value={tickets.length.toString()}
          label="Active Tickets"
          color="#60a5fa"
        />

        <SummaryCard
          icon={<CheckCircle2 size={18} />}
          value={
            jobs
              .filter((j) => j.status === "Completed")
              .length.toString()
          }
          label="Completed Jobs"
          color="#34d399"
        />

        <SummaryCard
          icon={<CircleAlert size={18} />}
          value={
            tickets
              .filter((t) => t.priority === "Urgent")
              .length.toString()
          }
          label="Urgent Requests"
          color="#f87171"
        />

        <SummaryCard
          icon={<Star size={18} />}
          value={
            technicians.length > 0
              ? (
                  technicians.reduce(
                    (sum, tech) =>
                      sum + tech.averageRating,
                    0
                  ) / technicians.length
                ).toFixed(1)
              : "0.0"
          }
          label="Average Rating"
          color="#facc15"
        />
      </div>

      <div
        style={{
          marginBottom: 22,
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.06)",
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
          {jobLoading ? (
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
              }}
            >
              Loading jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
              }}
            >
              No assignments found.
            </div>
          ) : (
            jobs.map((job) => (
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

                <div style={{ textAlign: "right" }}>
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
            ))
          )}
        </div>
      </div>

      <div
        style={{
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
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
          emptyMessage={
            ticketLoading
              ? "Loading tickets..."
              : "No assigned tickets found."
          }
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
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
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "18px 20px",
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
          marginBottom: 14,
        }}
      >
        {icon}
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
  onClick,
  title,
}: {
  icon: React.ReactNode
  color: string
  onClick?: () => void
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 31,
        height: 31,
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.06)",
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
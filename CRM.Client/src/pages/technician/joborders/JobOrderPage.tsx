import { useMemo, useState } from "react"
import {
  Search,
  MapPin,
  Phone,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react"

import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type JobStatus =
  | "Assigned"
  | "On The Way"
  | "In Progress"
  | "Waiting Parts"
  | "Completed"

type Priority = "Low" | "Medium" | "High"

interface TechnicianJob {
  id: string
  customer: string
  phone: string
  address: string
  service: string
  scheduledTime: string
  status: JobStatus
  priority: Priority
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const ALL_JOBS: TechnicianJob[] = [
  {
    id: "JOB-2041",
    customer: "Lena Torres",
    phone: "09171234567",
    address: "Quezon City",
    service: "HVAC Repair",
    scheduledTime: "9:00 AM",
    status: "Assigned",
    priority: "High",
  },
  {
    id: "JOB-2042",
    customer: "Marco Reyes",
    phone: "09179876543",
    address: "Pasig City",
    service: "Electrical Wiring",
    scheduledTime: "11:00 AM",
    status: "On The Way",
    priority: "Medium",
  },
  {
    id: "JOB-2043",
    customer: "David Chen",
    phone: "09174567890",
    address: "Makati City",
    service: "Generator Service",
    scheduledTime: "1:30 PM",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "JOB-2044",
    customer: "Sara Villanueva",
    phone: "09175554444",
    address: "Taguig City",
    service: "AC Installation",
    scheduledTime: "3:00 PM",
    status: "Waiting Parts",
    priority: "Low",
  },
]

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const STATUS_STYLE: Record<
  JobStatus,
  { bg: string; color: string }
> = {
  Assigned: {
    bg: "rgba(59,130,246,0.15)",
    color: "#60a5fa",
  },

  "On The Way": {
    bg: "rgba(245,158,11,0.15)",
    color: "#fbbf24",
  },

  "In Progress": {
    bg: "rgba(168,85,247,0.15)",
    color: "#c084fc",
  },

  "Waiting Parts": {
    bg: "rgba(239,68,68,0.15)",
    color: "#f87171",
  },

  Completed: {
    bg: "rgba(16,185,129,0.15)",
    color: "#34d399",
  },
}

const PRIORITY_STYLE: Record<
  Priority,
  { color: string }
> = {
  Low: {
    color: "#94a3b8",
  },

  Medium: {
    color: "#fbbf24",
  },

  High: {
    color: "#f87171",
  },
}

const PAGE_SIZE = 6

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function TechnicianJobsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return ALL_JOBS.filter(
      (job) =>
        job.customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        job.service
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        job.address
          .toLowerCase()
          .includes(search.toLowerCase())
    )
  }, [search])

  const totalPages = Math.ceil(
    filtered.length / PAGE_SIZE
  )

  const paged = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  // KPIs

  const activeJobs = ALL_JOBS.filter(
    (j) => j.status !== "Completed"
  ).length

  const highPriority = ALL_JOBS.filter(
    (j) => j.priority === "High"
  ).length

  const completedToday = ALL_JOBS.filter(
    (j) => j.status === "Completed"
  ).length

  // Table

  const columns: ColumnDef<TechnicianJob>[] = [
    {
      label: "Job",
      render: (job) => (
        <div>
          <div
            style={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {job.id}
          </div>

          <div
            style={{
              color: "#64748b",
              fontSize: 11,
              marginTop: 3,
            }}
          >
            {job.service}
          </div>
        </div>
      ),
    },

    {
      label: "Customer",
      render: (job) => (
        <div>
          <div
            style={{
              color: "#f8fafc",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {job.customer}
          </div>

          <div
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#64748b",
              fontSize: 11,
            }}
          >
            <Phone size={11} />
            {job.phone}
          </div>
        </div>
      ),
    },

    {
      label: "Location",
      render: (job) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#cbd5e1",
            fontSize: 12,
          }}
        >
          <MapPin size={13} />
          {job.address}
        </div>
      ),
    },

    {
      label: "Schedule",
      render: (job) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#94a3b8",
            fontSize: 12,
          }}
        >
          <Clock3 size={13} />
          {job.scheduledTime}
        </div>
      ),
    },

    {
      label: "Priority",
      render: (job) => (
        <span
          style={{
            color:
              PRIORITY_STYLE[job.priority].color,
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          {job.priority}
        </span>
      ),
    },

    {
      label: "Status",
      render: (job) => (
        <span
          style={{
            padding: "5px 12px",
            borderRadius: 999,
            background:
              STATUS_STYLE[job.status].bg,
            color:
              STATUS_STYLE[job.status].color,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {job.status}
        </span>
      ),
    },

    {
      label: "Action",
      render: () => (
        <button
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border:
              "1px solid rgba(255,255,255,0.08)",
            background: "#1e293b",
            color: "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Eye size={15} />
        </button>
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
          marginBottom: 24,
        }}
      >
        <TitleComponent
          label="Technician Jobs"
          icon={Wrench}
        />

        <p
          style={{
            marginTop: 6,
            color: "#64748b",
            fontSize: 13,
          }}
        >
          Manage assigned service jobs and field
          operations
        </p>
      </div>

      {/* KPI Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 22,
        }}
      >
        <KPI
          label="Active Jobs"
          value={activeJobs}
          color="#60a5fa"
        />

        <KPI
          label="High Priority"
          value={highPriority}
          color="#f87171"
        />

        <KPI
          label="Completed Today"
          value={completedToday}
          color="#34d399"
        />
      </div>

      {/* Toolbar */}

      <div
        style={{
          display: "flex",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 320,
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
            placeholder="Search customer, service, or location..."
            style={{
              width: "100%",
              height: 42,
              paddingLeft: 38,
              background: "#111827",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              color: "#f8fafc",
              outline: "none",
            }}
          />
        </div>
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
          data={paged}
          keyExtractor={(job) => job.id}
          emptyMessage="No assigned jobs."
        />

        {/* Pagination */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderTop:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              color: "#64748b",
              fontSize: 12,
            }}
          >
            Showing {(page - 1) * PAGE_SIZE + 1}
            –
            {Math.min(
              page * PAGE_SIZE,
              filtered.length
            )}{" "}
            of {filtered.length}
          </span>

          <div
            style={{
              display: "flex",
              gap: 6,
            }}
          >
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              style={paginationBtn(page === 1)}
            >
              <ChevronLeft size={14} />
            </button>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              style={paginationBtn(
                page === totalPages
              )}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// KPI
// ─────────────────────────────────────────────

function KPI({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div
      style={{
        background: "#111827",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 18,
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: 12,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 28,
          fontWeight: 800,
          color,
        }}
      >
        {value}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Pagination Button
// ─────────────────────────────────────────────

function paginationBtn(disabled: boolean) {
  return {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#1e293b",
    color: disabled ? "#334155" : "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
  } as React.CSSProperties
}
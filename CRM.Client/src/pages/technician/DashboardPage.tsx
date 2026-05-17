import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  CalendarDays,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react"

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const technicianStats = [
  {
    label: "Assigned Jobs",
    value: 12,
    icon: ClipboardList,
    color: "#6366f1",
  },
  {
    label: "Completed Today",
    value: 5,
    icon: CheckCircle2,
    color: "#10b981",
  },
  {
    label: "Pending Diagnosis",
    value: 3,
    icon: Clock3,
    color: "#f59e0b",
  },
  {
    label: "Urgent Tasks",
    value: 2,
    icon: AlertTriangle,
    color: "#ef4444",
  },
]

const assignedJobs = [
  {
    id: "JOB-2201",
    customer: "Juan Dela Cruz",
    service: "Aircon Repair",
    schedule: "May 13, 2026 • 9:00 AM",
    location: "Quezon City",
    status: "On Going",
  },
  {
    id: "JOB-2202",
    customer: "Maria Santos",
    service: "Electrical Wiring",
    schedule: "May 13, 2026 • 1:00 PM",
    location: "Pasig City",
    status: "Pending",
  },
  {
    id: "JOB-2203",
    customer: "Carlos Reyes",
    service: "Plumbing Leak",
    schedule: "May 14, 2026 • 10:00 AM",
    location: "Makati City",
    status: "Completed",
  },
]

const recentActivity = [
  "Completed JOB-2199",
  "Uploaded diagnosis report",
  "Customer approved quotation",
  "Started repair for JOB-2201",
]

const upcomingSchedule = [
  {
    customer: "Lena Torres",
    time: "3:00 PM",
    service: "HVAC Maintenance",
  },
  {
    customer: "David Chen",
    time: "5:00 PM",
    service: "Generator Checkup",
  },
]

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────

const STATUS_STYLE: Record<
  string,
  { bg: string; color: string }
> = {
  Pending: {
    bg: "rgba(245,158,11,0.15)",
    color: "#fbbf24",
  },

  "On Going": {
    bg: "rgba(59,130,246,0.15)",
    color: "#60a5fa",
  },

  Completed: {
    bg: "rgba(16,185,129,0.15)",
    color: "#34d399",
  },
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status]

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: style.bg,
        color: style.color,
      }}
    >
      {status}
    </span>
  )
}

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: color + "22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} color={color} />
      </div>

      <div
        style={{
          marginTop: 14,
          fontSize: 28,
          fontWeight: 700,
          color: "#f8fafc",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 13,
          color: "#64748b",
        }}
      >
        {label}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function TechnicianDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "28px 32px",
        fontFamily: "DM Sans, sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 26,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              margin: 0,
              fontWeight: 700,
            }}
          >
            Technician Dashboard
          </h1>

          <p
            style={{
              marginTop: 5,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Welcome back. Here's your assigned workload today.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            JD
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {technicianStats.map((item) => (
          <StatCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 18,
        }}
      >
        {/* Assigned Jobs */}
        <div
          style={{
            background: "#1e293b",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 22px",
              borderBottom:
                "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Assigned Job Orders
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginTop: 3,
                }}
              >
                Current assigned service tasks
              </div>
            </div>

            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#818cf8",
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ padding: 18 }}>
            {assignedJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#0f172a",
                  border:
                    "1px solid rgba(255,255,255,0.05)",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {job.service}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginTop: 4,
                      }}
                    >
                      {job.id}
                    </div>
                  </div>

                  <StatusBadge status={job.status} />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    fontSize: 13,
                    color: "#cbd5e1",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Wrench size={14} />
                    {job.customer}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <CalendarDays size={14} />
                    {job.schedule}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <MapPin size={14} />
                    {job.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Activity */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Recent Activity
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {recentActivity.map((activity) => (
                <div
                  key={activity}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    fontSize: 13,
                    color: "#cbd5e1",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#6366f1",
                    }}
                  />

                  {activity}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Upcoming Schedule
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {upcomingSchedule.map((item) => (
                <div
                  key={item.customer}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: "#0f172a",
                    border:
                      "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#f8fafc",
                    }}
                  >
                    {item.customer}
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    {item.service}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
                  >
                    <Clock3 size={13} />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Card */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.15))",
              borderRadius: 16,
              border: "1px solid rgba(99,102,241,0.2)",
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Star size={18} color="#fbbf24" />

              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                  }}
                >
                  Technician Rating
                </div>

                <div
                  style={{
                    marginTop: 2,
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  4.9
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#cbd5e1",
                lineHeight: 1.6,
              }}
            >
              Excellent performance this month.
              Customers are highly satisfied with your
              completed services.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
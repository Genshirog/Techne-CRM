import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Wrench, Search, ChevronRight, MapPin, Navigation,
  Bell, Plus, Droplets, Zap, Wind, Hammer,
  CheckCircle2, Clock, Package, Stethoscope,
  AlertCircle, Calendar, ChevronDown, Inbox,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus =
  | "Assigned"
  | "Traveling"
  | "On-Site"
  | "In Diagnosis"
  | "Awaiting Parts"
  | "Quoted"
  | "Done"
  | "Cancelled"

type ServiceIcon = "plumbing" | "electrical" | "hvac" | "general"

interface Job {
  id: string
  service: string
  serviceIcon: ServiceIcon
  address: string
  scheduledFor: string
  status: JobStatus
  techName: string
  techInitials: string
  eta?: string
  progress?: number
  completedAt?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const JOBS: Job[] = [
  {
    id: "INQ-1041",
    service: "Electrical Rewiring",
    serviceIcon: "electrical",
    address: "42 Mahogany St., Davao City",
    scheduledFor: "May 16, 2026 — 9:00 AM",
    status: "Traveling",
    techName: "Marco Dela Cruz",
    techInitials: "MD",
    eta: "12 min",
    progress: 35,
  },
  {
    id: "INQ-1040",
    service: "Plumbing Leak Repair",
    serviceIcon: "plumbing",
    address: "42 Mahogany St., Davao City",
    scheduledFor: "May 8, 2026 — 9:00 AM",
    status: "In Diagnosis",
    techName: "Paulo Mendez",
    techInitials: "PM",
    progress: 60,
  },
  {
    id: "INQ-1039",
    service: "Generator Service",
    serviceIcon: "general",
    address: "42 Mahogany St., Davao City",
    scheduledFor: "May 12, 2026 — 2:00 PM",
    status: "Awaiting Parts",
    techName: "James Alcantara",
    techInitials: "JA",
    progress: 50,
  },
  {
    id: "INQ-1038",
    service: "AC Maintenance",
    serviceIcon: "hvac",
    address: "42 Mahogany St., Davao City",
    scheduledFor: "Apr 21, 2026 — 2:00 PM",
    status: "Done",
    techName: "Lena Reyes",
    techInitials: "LR",
    completedAt: "Apr 21, 2026",
  },
  {
    id: "INQ-1034",
    service: "Electrical Panel Check",
    serviceIcon: "electrical",
    address: "42 Mahogany St., Davao City",
    scheduledFor: "Apr 5, 2026 — 10:30 AM",
    status: "Done",
    techName: "Marco Dela Cruz",
    techInitials: "MD",
    completedAt: "Apr 5, 2026",
  },
  {
    id: "INQ-1030",
    service: "Pipe Replacement",
    serviceIcon: "plumbing",
    address: "42 Mahogany St., Davao City",
    scheduledFor: "Mar 18, 2026 — 11:00 AM",
    status: "Cancelled",
    techName: "Paulo Mendez",
    techInitials: "PM",
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: "Active" | "Done" | "All" }[] = [
  { label: "Active Jobs", value: "Active" },
  { label: "Completed",   value: "Done"   },
  { label: "All",         value: "All"    },
]

const STATUS_META: Record<JobStatus, { bg: string; color: string; dot: string; label: string }> = {
  "Assigned":       { bg: "rgba(129,140,248,0.12)", color: "#818cf8", dot: "#818cf8", label: "Assigned"       },
  "Traveling":      { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", dot: "#fbbf24", label: "En Route"       },
  "On-Site":        { bg: "rgba(52,211,153,0.12)",  color: "#34d399", dot: "#34d399", label: "On-Site"        },
  "In Diagnosis":   { bg: "rgba(96,165,250,0.12)",  color: "#60a5fa", dot: "#60a5fa", label: "Diagnosing"     },
  "Awaiting Parts": { bg: "rgba(249,115,22,0.12)",  color: "#fb923c", dot: "#fb923c", label: "Awaiting Parts" },
  "Quoted":         { bg: "rgba(167,139,250,0.12)", color: "#a78bfa", dot: "#a78bfa", label: "Quoted"         },
  "Done":           { bg: "rgba(52,211,153,0.12)",  color: "#34d399", dot: "#34d399", label: "Completed"      },
  "Cancelled":      { bg: "rgba(248,113,113,0.12)", color: "#f87171", dot: "#f87171", label: "Cancelled"      },
}

const ACTIVE_STATUSES: JobStatus[] = ["Assigned", "Traveling", "On-Site", "In Diagnosis", "Awaiting Parts", "Quoted"]

const SERVICE_META: Record<ServiceIcon, { bg: string; color: string; icon: React.ElementType }> = {
  plumbing:   { bg: "rgba(56,189,248,0.15)",  color: "#38bdf8", icon: Droplets },
  electrical: { bg: "rgba(251,191,36,0.15)",  color: "#fbbf24", icon: Zap      },
  hvac:       { bg: "rgba(52,211,153,0.15)",  color: "#34d399", icon: Wind     },
  general:    { bg: "rgba(167,139,250,0.15)", color: "#a78bfa", icon: Wrench   },
}

const PROGRESS_STEPS: { key: JobStatus; label: string }[] = [
  { key: "Assigned",       label: "Assigned"   },
  { key: "Traveling",      label: "En Route"   },
  { key: "On-Site",        label: "On-Site"    },
  { key: "In Diagnosis",   label: "Diagnosing" },
  { key: "Quoted",         label: "Quoted"     },
  { key: "Done",           label: "Done"       },
]

const STEP_INDEX: Partial<Record<JobStatus, number>> = {
  "Assigned": 0, "Traveling": 1, "On-Site": 2,
  "In Diagnosis": 3, "Awaiting Parts": 3, "Quoted": 4, "Done": 5,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerMyJobsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"Active" | "Done" | "All">("Active")
  const [search, setSearch]       = useState("")
  const [expanded, setExpanded]   = useState<string | null>(JOBS[0].id)

  const activeJobs = JOBS.filter(j => ACTIVE_STATUSES.includes(j.status))
  const doneJobs   = JOBS.filter(j => j.status === "Done" || j.status === "Cancelled")

  const filtered = JOBS.filter(j => {
    const matchTab =
      activeTab === "All" ? true :
      activeTab === "Active" ? ACTIVE_STATUSES.includes(j.status) :
      j.status === "Done" || j.status === "Cancelled"
    const matchSearch =
      search === "" ||
      j.service.toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#f1f5f9",
    }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>My Jobs</h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>
            {activeJobs.length > 0
              ? `${activeJobs.length} active job${activeJobs.length !== 1 ? "s" : ""} in progress`
              : "No active jobs right now"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button style={{
            position: "relative", background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8, color: "#64748b", cursor: "pointer",
            padding: "7px 10px", display: "flex", alignItems: "center",
          }}>
            <Bell size={16} />
            <span style={{
              position: "absolute", top: 6, right: 6,
              width: 7, height: 7, borderRadius: "50%",
              background: "#f87171", border: "2px solid #0f172a",
            }} />
          </button>
          <button
            onClick={() => navigate("/customer/inquiries/new")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#6366f1", border: "none", borderRadius: 8,
              padding: "8px 16px", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
            onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
          >
            <Plus size={14} /> Book a Service
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff",
          }}>AO</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Active Jobs",   value: activeJobs.length, icon: Clock,        color: "#fbbf24", bg: "rgba(251,191,36,0.15)",  badge: activeJobs.length > 0 ? "In Progress" : undefined, badgeColor: "#fbbf24", badgeBg: "rgba(251,191,36,0.12)" },
          { label: "En Route",      value: JOBS.filter(j => j.status === "Traveling").length, icon: Navigation, color: "#818cf8", bg: "rgba(129,140,248,0.15)", badge: undefined },
          { label: "Awaiting Parts",value: JOBS.filter(j => j.status === "Awaiting Parts").length, icon: Package, color: "#fb923c", bg: "rgba(249,115,22,0.15)", badge: undefined },
          { label: "Completed",     value: doneJobs.filter(j => j.status === "Done").length, icon: CheckCircle2, color: "#34d399", bg: "rgba(52,211,153,0.15)", badge: undefined },
        ].map(({ label, value, icon: Icon, color, bg, badge, badgeColor, badgeBg }) => (
          <div key={label} style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={color} />
              </div>
              {badge && (
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: badgeBg, color: badgeColor, fontWeight: 500 }}>
                  {badge}
                </span>
              )}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", gap: 4, background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 3 }}>
            {STATUS_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: "6px 14px", borderRadius: 6,
                  fontSize: 12.5, fontWeight: activeTab === tab.value ? 500 : 400,
                  border: activeTab === tab.value ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                  background: activeTab === tab.value ? "#1e293b" : "transparent",
                  color: activeTab === tab.value ? "#e2e8f0" : "#475569",
                  cursor: "pointer",
                }}
              >
                {tab.label}
                {tab.value === "Active" && activeJobs.length > 0 && (
                  <span style={{
                    marginLeft: 6, fontSize: 10, fontWeight: 600,
                    background: "rgba(251,191,36,0.15)", color: "#fbbf24",
                    padding: "1px 6px", borderRadius: 10,
                  }}>{activeJobs.length}</span>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8, padding: "7px 12px",
            }}>
              <Search size={13} color="#475569" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search job or ID…"
                style={{
                  border: "none", background: "transparent",
                  fontSize: 12.5, color: "#e2e8f0", outline: "none", width: 160,
                }}
              />
            </div>
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 28px", gap: 10 }}>
            <Inbox size={28} color="#334155" />
            <p style={{ fontSize: 13.5, color: "#475569", margin: 0 }}>No jobs found.</p>
          </div>
        ) : (
          <div>
            {filtered.map((job, idx) => {
              const sm   = STATUS_META[job.status]
              const svc  = SERVICE_META[job.serviceIcon]
              const Icon = svc.icon
              const isActive   = ACTIVE_STATUSES.includes(job.status)
              const isExpanded = expanded === job.id
              const stepIdx    = STEP_INDEX[job.status] ?? 0

              return (
                <div
                  key={job.id}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    opacity: job.status === "Cancelled" ? 0.5 : 1,
                  }}
                >
                  {/* Row */}
                  <div
                    onClick={() => isActive ? setExpanded(isExpanded ? null : job.id) : navigate(`/customer/jobs/${job.id}`)}
                    style={{
                      display: "flex", alignItems: "center", gap: 0,
                      cursor: "pointer", transition: "background 120ms",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Service icon */}
                    <div style={{ padding: "16px 18px 16px 22px" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: svc.bg, color: svc.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={15} />
                      </div>
                    </div>

                    {/* Service + ID */}
                    <div style={{ flex: "0 0 200px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{job.service}</div>
                      <div style={{ fontSize: 11.5, color: "#64748b", fontFamily: "monospace", marginTop: 2 }}>{job.id}</div>
                    </div>

                    {/* Technician */}
                    <div style={{ flex: "0 0 160px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          background: "rgba(99,102,241,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 700, color: "#818cf8",
                        }}>
                          {job.techInitials}
                        </div>
                        <span style={{ fontSize: 12.5, color: "#94a3b8" }}>{job.techName}</span>
                      </div>
                    </div>

                    {/* Address */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#64748b" }}>
                        <MapPin size={11} color="#475569" />
                        {job.address}
                      </div>
                    </div>

                    {/* Schedule */}
                    <div style={{ flex: "0 0 190px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#94a3b8" }}>
                        <Calendar size={11} color="#475569" />
                        {job.scheduledFor}
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{ flex: "0 0 140px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 10px", borderRadius: 20,
                        fontSize: 11.5, fontWeight: 500,
                        background: sm.bg, color: sm.color,
                      }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: sm.dot, flexShrink: 0,
                          boxShadow: isActive ? `0 0 0 2px ${sm.dot}33` : "none",
                        }} />
                        {sm.label}
                      </span>
                    </div>

                    {/* Expand / Arrow */}
                    <div style={{ padding: "16px 22px 16px 0" }}>
                      {isActive ? (
                        <ChevronDown
                          size={14} color="#334155"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
                        />
                      ) : (
                        <ChevronRight size={14} color="#334155" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Panel (active jobs only) */}
                  {isActive && isExpanded && (
                    <div style={{
                      padding: "0 22px 20px 22px",
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                      background: "rgba(255,255,255,0.01)",
                    }}>

                      {/* Progress stepper */}
                      <div style={{ paddingTop: 20, marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {PROGRESS_STEPS.map((step, i) => {
                            const done   = i < stepIdx
                            const active = i === stepIdx
                            return (
                              <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < PROGRESS_STEPS.length - 1 ? 1 : 0 }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                                  <div style={{
                                    width: 28, height: 28, borderRadius: "50%",
                                    background: done ? "#6366f1" : active ? "#1e293b" : "#0f172a",
                                    border: active ? "2px solid #6366f1" : done ? "none" : "1px solid rgba(255,255,255,0.08)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}>
                                    {done
                                      ? <CheckCircle2 size={13} color="#fff" />
                                      : <div style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "#6366f1" : "#475569" }} />
                                    }
                                  </div>
                                  <span style={{ fontSize: 10.5, color: active ? "#f1f5f9" : "#64748b", fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>
                                    {step.label}
                                  </span>
                                </div>
                                {i < PROGRESS_STEPS.length - 1 && (
                                  <div style={{ flex: 1, height: 2, margin: "0 8px 18px", background: i < stepIdx ? "#6366f1" : "#334155" }} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Bottom row: ETA + actions */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ display: "flex", gap: 10 }}>
                          {job.eta && (
                            <div style={{
                              display: "flex", alignItems: "center", gap: 6,
                              background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)",
                              borderRadius: 8, padding: "7px 12px",
                              fontSize: 12.5, color: "#fbbf24", fontWeight: 500,
                            }}>
                              <Clock size={12} /> ETA {job.eta}
                            </div>
                          )}
                          {job.status === "Awaiting Parts" && (
                            <div style={{
                              display: "flex", alignItems: "center", gap: 6,
                              background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.18)",
                              borderRadius: 8, padding: "7px 12px",
                              fontSize: 12.5, color: "#fb923c", fontWeight: 500,
                            }}>
                              <Package size={12} /> Parts being sourced
                            </div>
                          )}
                          {job.status === "In Diagnosis" && (
                            <div style={{
                              display: "flex", alignItems: "center", gap: 6,
                              background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.18)",
                              borderRadius: 8, padding: "7px 12px",
                              fontSize: 12.5, color: "#60a5fa", fontWeight: 500,
                            }}>
                              <Stethoscope size={12} /> Diagnosis in progress
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          {job.status === "Traveling" && (
                            <button
                              onClick={e => { e.stopPropagation(); navigate(`/customer/track/${job.id}`) }}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                                borderRadius: 8, padding: "7px 14px",
                                color: "#818cf8", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.18)")}
                              onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
                            >
                              <Navigation size={12} /> Live Track
                            </button>
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); navigate(`/customer/jobs/${job.id}`) }}
                            style={{
                              display: "flex", alignItems: "center", gap: 6,
                              background: "#1e3a5f", border: "1px solid rgba(96,165,250,0.2)",
                              borderRadius: 8, padding: "7px 14px",
                              color: "#60a5fa", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(96,165,250,0.15)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "#1e3a5f")}
                          >
                            View Details <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
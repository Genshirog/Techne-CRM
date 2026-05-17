import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Star, Bell, CheckCircle2, Clock,
  Droplets, Zap, Wind, Wrench,
  ThumbsUp, ChevronRight, MessageSquare,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceIcon = "plumbing" | "electrical" | "hvac" | "general"

interface CompletedJob {
  id: string
  service: string
  serviceIcon: ServiceIcon
  technician: string
  techInitials: string
  completedAt: string
  reviewed: boolean
  review?: {
    professionalism: number
    communication: number
    quality: number
    speed: number
    comment: string
    submittedAt: string
  }
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const JOBS: CompletedJob[] = [
  {
    id: "INQ-1041",
    service: "Electrical Rewiring",
    serviceIcon: "electrical",
    technician: "Marco Dela Cruz",
    techInitials: "MD",
    completedAt: "May 14, 2026",
    reviewed: false,
  },
  {
    id: "INQ-1040",
    service: "Plumbing Leak Repair",
    serviceIcon: "plumbing",
    technician: "Paulo Mendez",
    techInitials: "PM",
    completedAt: "May 8, 2026",
    reviewed: false,
  },
  {
    id: "INQ-1038",
    service: "AC Maintenance",
    serviceIcon: "hvac",
    technician: "Lena Reyes",
    techInitials: "LR",
    completedAt: "Apr 21, 2026",
    reviewed: true,
    review: {
      professionalism: 5,
      communication: 4,
      quality: 5,
      speed: 4,
      comment: "Lena was very thorough and explained everything clearly. The AC has been working great since.",
      submittedAt: "Apr 22, 2026",
    },
  },
  {
    id: "INQ-1034",
    service: "Electrical Panel Check",
    serviceIcon: "electrical",
    technician: "Marco Dela Cruz",
    techInitials: "MD",
    completedAt: "Apr 5, 2026",
    reviewed: true,
    review: {
      professionalism: 5,
      communication: 5,
      quality: 5,
      speed: 5,
      comment: "Excellent work. Marco was on time, professional, and very knowledgeable. Highly recommend.",
      submittedAt: "Apr 6, 2026",
    },
  },
  {
    id: "INQ-1030",
    service: "Pipe Replacement",
    serviceIcon: "plumbing",
    technician: "Juan Santos",
    techInitials: "JS",
    completedAt: "Mar 18, 2026",
    reviewed: true,
    review: {
      professionalism: 4,
      communication: 3,
      quality: 4,
      speed: 3,
      comment: "Good work overall, took a bit longer than expected but the result was solid.",
      submittedAt: "Mar 20, 2026",
    },
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const SERVICE_META: Record<ServiceIcon, { bg: string; color: string; icon: React.ElementType }> = {
  plumbing:   { bg: "rgba(56,189,248,0.15)",  color: "#38bdf8", icon: Droplets },
  electrical: { bg: "rgba(251,191,36,0.15)",  color: "#fbbf24", icon: Zap      },
  hvac:       { bg: "rgba(52,211,153,0.15)",  color: "#34d399", icon: Wind     },
  general:    { bg: "rgba(167,139,250,0.15)", color: "#a78bfa", icon: Wrench   },
}

const RATING_CATEGORIES = [
  { key: "professionalism", label: "Professionalism" },
  { key: "communication",   label: "Communication"   },
  { key: "quality",         label: "Quality of Work" },
  { key: "speed",           label: "Speed"           },
] as const

// ─── Star display ─────────────────────────────────────────────────────────────

function StarDisplay({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i} size={size}
          fill={i < value ? "#fbbf24" : "transparent"}
          color={i < value ? "#fbbf24" : "#334155"}
        />
      ))}
    </div>
  )
}

// ─── Star input ───────────────────────────────────────────────────────────────

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}
        >
          <Star
            size={24}
            fill={(hover || value) > i ? "#fbbf24" : "transparent"}
            color={(hover || value) > i ? "#fbbf24" : "#334155"}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomerReviewsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">("pending")
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [jobs, setJobs] = useState<CompletedJob[]>(JOBS)

  // form state
  const [ratings, setRatings] = useState({ professionalism: 0, communication: 0, quality: 0, speed: 0 })
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const pending   = jobs.filter(j => !j.reviewed)
  const submitted_ = jobs.filter(j => j.reviewed)
  const displayed  = activeTab === "pending" ? pending : submitted_

  const avgRating = (r: typeof ratings) =>
    ((r.professionalism + r.communication + r.quality + r.speed) / 4)

  const openReview = (id: string) => {
    setReviewingId(id)
    setRatings({ professionalism: 0, communication: 0, quality: 0, speed: 0 })
    setComment("")
    setSubmitted(false)
  }

  const submitReview = () => {
    if (Object.values(ratings).some(v => v === 0)) return
    setJobs(prev => prev.map(j =>
      j.id === reviewingId
        ? {
            ...j,
            reviewed: true,
            review: {
              ...ratings,
              comment,
              submittedAt: "Just now",
            },
          }
        : j
    ))
    setSubmitted(true)
  }

  const closeModal = () => {
    setReviewingId(null)
    if (submitted) setActiveTab("submitted")
  }

  const reviewingJob = jobs.find(j => j.id === reviewingId)

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
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>Reviews & Feedback</h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>
            {pending.length > 0
              ? `${pending.length} job${pending.length !== 1 ? "s" : ""} awaiting your review`
              : "All jobs reviewed — thank you!"}
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
            {pending.length > 0 && (
              <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#f87171", border: "2px solid #0f172a" }} />
            )}
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
            AO
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Pending Reviews", value: pending.length,    icon: Clock,        color: "#fbbf24", bg: "rgba(251,191,36,0.15)",  badge: pending.length > 0 ? "Action Needed" : undefined, badgeColor: "#fbbf24", badgeBg: "rgba(251,191,36,0.12)" },
          { label: "Reviews Given",   value: submitted_.length, icon: ThumbsUp,     color: "#34d399", bg: "rgba(52,211,153,0.15)",  badge: undefined },
          { label: "Avg. Rating",     value: submitted_.length > 0
              ? (submitted_.reduce((s, j) => s + avgRating(j.review as any), 0) / submitted_.length).toFixed(1) + " ★"
              : "—",
            icon: Star, color: "#fbbf24", bg: "rgba(251,191,36,0.15)", badge: undefined, isString: true },
          { label: "Technicians Rated", value: new Set(submitted_.map(j => j.technician)).size, icon: CheckCircle2, color: "#818cf8", bg: "rgba(129,140,248,0.15)", badge: undefined },
        ].map(({ label, value, icon: Icon, color, bg, badge, badgeColor, badgeBg }) => (
          <div key={label} style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", gap: 4, background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 3 }}>
            {([
              { value: "pending",   label: "Pending" },
              { value: "submitted", label: "Submitted" },
            ] as const).map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: "6px 16px", borderRadius: 6,
                  fontSize: 12.5, fontWeight: activeTab === tab.value ? 500 : 400,
                  border: activeTab === tab.value ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                  background: activeTab === tab.value ? "#1e293b" : "transparent",
                  color: activeTab === tab.value ? "#e2e8f0" : "#475569",
                  cursor: "pointer",
                }}
              >
                {tab.label}
                {tab.value === "pending" && pending.length > 0 && (
                  <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 600, background: "rgba(251,191,36,0.15)", color: "#fbbf24", padding: "1px 6px", borderRadius: 10 }}>
                    {pending.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {displayed.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 28px", gap: 10 }}>
            <ThumbsUp size={28} color="#334155" />
            <p style={{ fontSize: 13.5, color: "#475569", margin: 0 }}>
              {activeTab === "pending" ? "No pending reviews — you're all caught up!" : "No reviews submitted yet."}
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {(activeTab === "pending"
                  ? ["Service", "Technician", "Completed", ""]
                  : ["Service", "Technician", "Completed", "Rating", "Comment", ""]
                ).map(h => (
                  <th key={h} style={{ padding: "10px 22px", textAlign: "left", fontSize: 11, fontWeight: 500, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((job, idx) => {
                const svc  = SERVICE_META[job.serviceIcon]
                const Icon = svc.icon
                const isLast = idx === displayed.length - 1

                if (activeTab === "pending") {
                  return (
                    <tr key={job.id}
                      style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td style={{ padding: "16px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: svc.bg, color: svc.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{job.service}</div>
                            <div style={{ fontSize: 11.5, color: "#64748b", fontFamily: "monospace", marginTop: 1 }}>{job.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#818cf8" }}>
                            {job.techInitials}
                          </div>
                          <span style={{ fontSize: 13, color: "#94a3b8" }}>{job.technician}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 22px", fontSize: 13, color: "#64748b" }}>{job.completedAt}</td>
                      <td style={{ padding: "16px 22px" }}>
                        <button
                          onClick={() => openReview(job.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: "#6366f1", border: "none", borderRadius: 8,
                            padding: "7px 16px", color: "#fff",
                            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
                        >
                          <Star size={12} /> Leave Review
                        </button>
                      </td>
                    </tr>
                  )
                }

                // submitted
                const avg = job.review ? avgRating(job.review as any) : 0
                return (
                  <tr key={job.id}
                    style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "16px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: svc.bg, color: svc.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{job.service}</div>
                          <div style={{ fontSize: 11.5, color: "#64748b", fontFamily: "monospace", marginTop: 1 }}>{job.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#818cf8" }}>
                          {job.techInitials}
                        </div>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{job.technician}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 22px", fontSize: 13, color: "#64748b" }}>{job.completedAt}</td>
                    <td style={{ padding: "16px 22px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <StarDisplay value={Math.round(avg)} />
                        <span style={{ fontSize: 11, color: "#64748b" }}>{avg.toFixed(1)} avg</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 22px", maxWidth: 260 }}>
                      {job.review?.comment ? (
                        <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          "{job.review.comment}"
                        </p>
                      ) : (
                        <span style={{ fontSize: 12, color: "#334155" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 22px" }}>
                      <ChevronRight size={14} color="#334155" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Modal */}
      {reviewingId && reviewingJob && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.65)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, padding: 20,
        }}>
          <div style={{
            width: 520, maxWidth: "100%",
            background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: 28,
          }}>
            {submitted ? (
              /* Success state */
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 18px",
                }}>
                  <ThumbsUp size={26} color="#34d399" />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>Thank you!</h2>
                <p style={{ margin: "0 0 24px", fontSize: 13.5, color: "#64748b", lineHeight: 1.7 }}>
                  Your review for <strong style={{ color: "#e2e8f0" }}>{reviewingJob.technician}</strong> has been submitted.
                </p>
                <div style={{
                  background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "16px 20px", marginBottom: 24,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Overall Rating</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <StarDisplay value={Math.round(avgRating(ratings))} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fbbf24" }}>{avgRating(ratings).toFixed(1)}</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    background: "#6366f1", border: "none", borderRadius: 10,
                    padding: "11px 28px", color: "#fff",
                    fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%",
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              /* Form state */
              <>
                {/* Modal header */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: SERVICE_META[reviewingJob.serviceIcon].bg, color: SERVICE_META[reviewingJob.serviceIcon].color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {(() => { const Icon = SERVICE_META[reviewingJob.serviceIcon].icon; return <Icon size={15} /> })()}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{reviewingJob.service}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>with {reviewingJob.technician} · {reviewingJob.completedAt}</div>
                    </div>
                  </div>
                </div>

                {/* Category ratings */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 22 }}>
                  {RATING_CATEGORIES.map(cat => (
                    <div key={cat.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "#cbd5e1", width: 140 }}>{cat.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <StarInput
                          value={ratings[cat.key]}
                          onChange={v => setRatings(prev => ({ ...prev, [cat.key]: v }))}
                        />
                        <span style={{ fontSize: 12, color: "#64748b", width: 28 }}>
                          {ratings[cat.key] > 0 ? `${ratings[cat.key]}/5` : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall */}
                {Object.values(ratings).every(v => v > 0) && (
                  <div style={{
                    background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: 10, padding: "12px 16px", marginBottom: 18,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 12, color: "#818cf8" }}>Overall</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <StarDisplay value={Math.round(avgRating(ratings))} size={14} />
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>
                        {avgRating(ratings).toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Comment */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageSquare size={12} /> Comments <span style={{ color: "#334155" }}>(optional)</span>
                  </div>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share your experience with this technician…"
                    rows={3}
                    style={{
                      width: "100%", background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10, padding: "12px 14px",
                      color: "#e2e8f0", fontSize: 13,
                      resize: "none", outline: "none",
                      boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setReviewingId(null)}
                    style={{
                      background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, padding: "10px 18px",
                      color: "#64748b", fontSize: 13, cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReview}
                    disabled={Object.values(ratings).some(v => v === 0)}
                    style={{
                      background: Object.values(ratings).some(v => v === 0) ? "#1e293b" : "#6366f1",
                      border: "none", borderRadius: 10, padding: "10px 22px",
                      color: Object.values(ratings).some(v => v === 0) ? "#475569" : "#fff",
                      fontSize: 13, fontWeight: 600,
                      cursor: Object.values(ratings).some(v => v === 0) ? "not-allowed" : "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => { if (!Object.values(ratings).some(v => v === 0)) e.currentTarget.style.background = "#4f46e5" }}
                    onMouseLeave={e => { if (!Object.values(ratings).some(v => v === 0)) e.currentTarget.style.background = "#6366f1" }}
                  >
                    Submit Review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
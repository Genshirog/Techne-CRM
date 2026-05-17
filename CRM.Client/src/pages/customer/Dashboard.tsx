import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus, MapPin, Phone, MessageSquare, Navigation,
  FileText, Star, Wrench, Zap, Droplets, Wind,
  CheckCircle2, AlertCircle, ArrowRight, ChevronRight,
  Bell, TrendingUp, Receipt, Clock, Package,
} from "lucide-react"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LIVE_JOB = {
  id: "INQ-1041",
  service: "Electrical Rewiring",
  technician: "Marco Dela Cruz",
  techInitials: "MD",
  techPhone: "+63 912 345 6789",
  eta: "12 min",
  status: "Traveling",
  address: "42 Mahogany St., Davao City",
  progress: 35,
}

const PAST_BOOKINGS = [
  { id: "INQ-1040", service: "Plumbing Leak Repair",   icon: Droplets, technician: "Juan Santos",     date: "May 6, 2026",  status: "Completed", rating: 5 },
  { id: "INQ-1038", service: "AC Maintenance",         icon: Wind,     technician: "Lena Reyes",      date: "Apr 21, 2026", status: "Completed", rating: 4 },
  { id: "INQ-1034", service: "Electrical Panel Check", icon: Zap,      technician: "Marco Dela Cruz", date: "Apr 5, 2026",  status: "Completed", rating: 5 },
]

const INVOICES = [
  { id: "INV-2041", service: "Electrical Rewiring",    amount: 4800, date: "May 16, 2026", status: "Unpaid", dueDate: "May 23, 2026" },
  { id: "INV-2040", service: "Plumbing Leak Repair",   amount: 2350, date: "May 6, 2026",  status: "Paid",   dueDate: undefined },
  { id: "INV-2038", service: "AC Maintenance",         amount: 1800, date: "Apr 21, 2026", status: "Paid",   dueDate: undefined },
  { id: "INV-2034", service: "Electrical Panel Check", amount: 1200, date: "Apr 5, 2026",  status: "Paid",   dueDate: undefined },
]

const SERVICES = [
  { label: "Plumbing",   icon: Droplets, color: "#38bdf8", bg: "rgba(56,189,248,0.15)"  },
  { label: "Electrical", icon: Zap,      color: "#fbbf24", bg: "rgba(251,191,36,0.15)"  },
  { label: "HVAC / AC",  icon: Wind,     color: "#34d399", bg: "rgba(52,211,153,0.15)"  },
  { label: "General",    icon: Wrench,   color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
]

// ─── Status Meta ──────────────────────────────────────────────────────────────

const INVOICE_STATUS: Record<string, { color: string; bg: string }> = {
  Paid:    { color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  Unpaid:  { color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  Overdue: { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
}

const BOOKING_STATUS: Record<string, { color: string; bg: string }> = {
  Completed:  { color: "#64748b", bg: "rgba(100,116,139,0.12)" },
  Confirmed:  { color: "#818cf8", bg: "rgba(129,140,248,0.12)" },
  Travelling: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  Cancelled:  { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
}

// ─── Spend Sparkline ──────────────────────────────────────────────────────────

function SpendSparkline() {
  const data = [1200, 0, 1800, 0, 2350, 0, 4800]
  const W = 120, H = 36
  const max = Math.max(...data) * 1.1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - (v / max) * H}`)
  const area = `M${pts.join("L")} L${W},${H} L0,${H} Z`
  const line = `M${pts.join("L")}`
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"   />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sg)" />
      <path d={line} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"history" | "invoices">("history")

  const unpaidTotal = INVOICES
    .filter(i => i.status === "Unpaid" || i.status === "Overdue")
    .reduce((s, i) => s + i.amount, 0)

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
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>My Dashboard</h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>Saturday, May 16, 2026</p>
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
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
          }}>
            AO
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>

        {/* Active Job */}
        <div style={{
          background: "#1e293b", border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={20} color="#fbbf24" />
            </div>
            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "rgba(251,191,36,0.12)", color: "#fbbf24", fontWeight: 500 }}>
              En Route
            </span>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>1</div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5 }}>Active Job</div>
          </div>
        </div>

        {/* Completed */}
        <div style={{
          background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={20} color="#34d399" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#34d399" }}>
              <TrendingUp size={13} /> +3 this mo.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>12</div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5 }}>Completed Jobs</div>
          </div>
        </div>

        {/* Total Spent */}
        <div style={{
          background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Receipt size={20} color="#818cf8" />
            </div>
            <SpendSparkline />
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>₱24,850</div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5 }}>Total Spent</div>
          </div>
        </div>

        {/* Pending Payment */}
        <div style={{
          background: "#1e293b",
          border: unpaidTotal > 0 ? "1px solid rgba(248,113,113,0.2)" : "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={20} color="#f87171" />
            </div>
            {unpaidTotal > 0 && (
              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "rgba(248,113,113,0.12)", color: "#f87171", fontWeight: 500 }}>
                Due May 23
              </span>
            )}
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>₱{unpaidTotal.toLocaleString()}</div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5 }}>Pending Payment</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Live Tracking Card */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Active Job</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Technician is on the way</div>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 600, color: "#fbbf24",
                background: "rgba(251,191,36,0.12)", padding: "4px 10px", borderRadius: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 5px #fbbf24" }} />
                Traveling
              </span>
            </div>

            <div style={{ padding: "18px 22px" }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 3 }}>{LIVE_JOB.service}</div>
                <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={11} /> {LIVE_JOB.address} · {LIVE_JOB.id}
                </div>
              </div>

              {/* Tech row */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 10, padding: "12px 14px", marginBottom: 16,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(99,102,241,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#818cf8", flexShrink: 0,
                }}>
                  {LIVE_JOB.techInitials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{LIVE_JOB.technician}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>Assigned technician</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`tel:${LIVE_JOB.techPhone}`} style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
                    color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
                  }}>
                    <Phone size={13} />
                  </a>
                  <button style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
                    color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  }}>
                    <MessageSquare size={13} />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#475569" }}>Job progress</span>
                  <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>ETA {LIVE_JOB.eta}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                  <div style={{
                    height: "100%", borderRadius: 99, width: `${LIVE_JOB.progress}%`,
                    background: "linear-gradient(90deg, #6366f1, #fbbf24)",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 11, color: "#334155" }}>
                  {["Dispatched", "Traveling", "On-Site", "Done"].map(s => <span key={s}>{s}</span>)}
                </div>
              </div>

              <button
                onClick={() => navigate(`/customer/track/${LIVE_JOB.id}`)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  width: "100%", marginTop: 14, padding: "9px",
                  background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 8, color: "#818cf8", fontSize: 13, fontWeight: 500, cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.18)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
              >
                <Navigation size={13} /> Open Live Tracking
              </button>
            </div>
          </div>

          {/* History / Invoices Tabs */}
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", gap: 4, background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 3 }}>
                {(["history", "invoices"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "6px 16px",
                      background: activeTab === tab ? "#1e293b" : "transparent",
                      border: activeTab === tab ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                      borderRadius: 6, color: activeTab === tab ? "#e2e8f0" : "#475569",
                      fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                    }}
                  >
                    {tab === "history" ? "Service History" : "Invoices & Payments"}
                  </button>
                ))}
              </div>
              <a href="#" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#818cf8", textDecoration: "none" }}>
                View all <ArrowRight size={13} />
              </a>
            </div>

            {activeTab === "history" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["ID", "Service", "Technician", "Date", "Rating", "Status", ""].map(h => (
                      <th key={h} style={{
                        padding: "10px 22px", textAlign: "left", fontSize: 11,
                        fontWeight: 500, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAST_BOOKINGS.map((b, i) => {
                    const sm = BOOKING_STATUS[b.status] ?? { color: "#94a3b8", bg: "rgba(255,255,255,0.08)" }
                    const Icon = b.icon
                    return (
                      <tr key={b.id}
                        style={{ borderBottom: i < PAST_BOOKINGS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        onClick={() => navigate(`/customer/booking/${b.id}`)}
                      >
                        <td style={{ padding: "14px 22px", fontSize: 12.5, color: "#64748b", fontFamily: "monospace" }}>{b.id}</td>
                        <td style={{ padding: "14px 22px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8", flexShrink: 0 }}>
                              <Icon size={13} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{b.service}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 22px", fontSize: 13, color: "#94a3b8" }}>{b.technician}</td>
                        <td style={{ padding: "14px 22px", fontSize: 13, color: "#64748b" }}>{b.date}</td>
                        <td style={{ padding: "14px 22px" }}>
                          <div style={{ display: "flex", gap: 2 }}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} size={11} color={idx < b.rating ? "#fbbf24" : "#1e293b"} fill={idx < b.rating ? "#fbbf24" : "#1e293b"} />
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "14px 22px" }}>
                          <span style={{ fontSize: 11.5, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: sm.bg, color: sm.color }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px 22px" }}>
                          <ChevronRight size={14} color="#334155" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div>
                {unpaidTotal > 0 && (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 22px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: "rgba(251,191,36,0.05)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <AlertCircle size={14} color="#fbbf24" />
                      <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 500 }}>
                        1 invoice pending — ₱{unpaidTotal.toLocaleString()} due May 23
                      </span>
                    </div>
                    <button style={{
                      background: "#fbbf24", border: "none", borderRadius: 7,
                      padding: "6px 14px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>Pay Now</button>
                  </div>
                )}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {["Invoice", "Service", "Date", "Amount", "Status", ""].map(h => (
                        <th key={h} style={{
                          padding: "10px 22px", textAlign: "left", fontSize: 11,
                          fontWeight: 500, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICES.map((inv, i) => {
                      const im = INVOICE_STATUS[inv.status] ?? { color: "#94a3b8", bg: "rgba(255,255,255,0.08)" }
                      return (
                        <tr key={inv.id}
                          style={{ borderBottom: i < INVOICES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <td style={{ padding: "14px 22px", fontSize: 12.5, color: "#64748b", fontFamily: "monospace" }}>{inv.id}</td>
                          <td style={{ padding: "14px 22px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(96,165,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", flexShrink: 0 }}>
                                <FileText size={13} />
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{inv.service}</div>
                                {inv.dueDate && <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>Due {inv.dueDate}</div>}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "14px 22px", fontSize: 13, color: "#64748b" }}>{inv.date}</td>
                          <td style={{ padding: "14px 22px", fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>₱{inv.amount.toLocaleString()}</td>
                          <td style={{ padding: "14px 22px" }}>
                            <span style={{ fontSize: 11.5, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: im.bg, color: im.color }}>
                              {inv.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 22px" }}>
                            {inv.status !== "Paid" ? (
                              <button
                                onClick={e => e.stopPropagation()}
                                style={{
                                  background: "#6366f1", border: "none", borderRadius: 7,
                                  padding: "5px 12px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
                                onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
                              >Pay</button>
                            ) : (
                              <ChevronRight size={14} color="#334155" />
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Book a Service */}
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Book a Service</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Choose a category to get started</div>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {SERVICES.map(s => {
                const Icon = s.icon
                return (
                  <button
                    key={s.label}
                    onClick={() => navigate("/customer/book")}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      width: "100%", padding: "11px 14px",
                      background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 10, cursor: "pointer", textAlign: "left",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "#141e33"
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "#0f172a"
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"
                    }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1", flex: 1 }}>{s.label}</span>
                    <ChevronRight size={14} color="#334155" />
                  </button>
                )
              })}

              <button
                onClick={() => navigate("/customer/book")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  width: "100%", marginTop: 2, padding: "11px",
                  background: "#6366f1", border: "none", borderRadius: 10,
                  color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
                onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
              >
                <Plus size={15} /> Request Custom Job
              </button>
            </div>
          </div>

          {/* Summary mini grid */}
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 22px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>Your Summary</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>All-time overview</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: CheckCircle2, label: "Jobs Done",   value: "12",     color: "#34d399" },
                { icon: Star,         label: "Avg Rating",  value: "4.8 ★",  color: "#fbbf24" },
                { icon: Receipt,      label: "Total Spent", value: "₱24.8k", color: "#818cf8" },
                { icon: Package,      label: "Technicians", value: "3",      color: "#60a5fa" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{
                  background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 10, padding: "12px 14px",
                }}>
                  <Icon size={14} color={color} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
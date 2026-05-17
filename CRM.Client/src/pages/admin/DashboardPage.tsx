import { useState } from "react"
import {
  Ticket, ClipboardList, FileText, MessageSquare,
  TrendingUp, TrendingDown, Users, HardHat,
  AlertCircle, CheckCircle2, MoreHorizontal, ArrowRight,
} from "lucide-react"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const monthlyJobOrders = [
  { month: "Nov", completed: 38, ongoing: 12, cancelled: 3 },
  { month: "Dec", completed: 45, ongoing: 9,  cancelled: 2 },
  { month: "Jan", completed: 30, ongoing: 15, cancelled: 5 },
  { month: "Feb", completed: 52, ongoing: 11, cancelled: 1 },
  { month: "Mar", completed: 48, ongoing: 14, cancelled: 4 },
  { month: "Apr", completed: 61, ongoing: 18, cancelled: 2 },
  { month: "May", completed: 55, ongoing: 21, cancelled: 3 },
]

const revenueData = [
  { month: "Nov", revenue: 48000 },
  { month: "Dec", revenue: 61000 },
  { month: "Jan", revenue: 43000 },
  { month: "Feb", revenue: 72000 },
  { month: "Mar", revenue: 65000 },
  { month: "Apr", revenue: 89000 },
  { month: "May", revenue: 78000 },
]

const ticketStatusData = [
  { name: "Open",        value: 34, color: "#f59e0b" },
  { name: "In Progress", value: 27, color: "#6366f1" },
  { name: "Resolved",    value: 89, color: "#10b981" },
  { name: "Closed",      value: 52, color: "#475569" },
]

const recentInquiries = [
  { id: "INQ-1042", customer: "Lena Torres",     service: "HVAC Repair",       date: "May 7, 2026", status: "New" },
  { id: "INQ-1041", customer: "Marco Reyes",     service: "Electrical Wiring", date: "May 7, 2026", status: "Assigned" },
  { id: "INQ-1040", customer: "Aisha Okonkwo",   service: "Plumbing Leak",     date: "May 6, 2026", status: "In Diagnosis" },
  { id: "INQ-1039", customer: "David Chen",      service: "Generator Service", date: "May 6, 2026", status: "Quoted" },
  { id: "INQ-1038", customer: "Sara Villanueva", service: "AC Installation",   date: "May 5, 2026", status: "New" },
]

const topTechnicians = [
  { name: "James Alcantara", jobs: 14, rating: 4.9, status: "Available" },
  { name: "Paulo Mendez",    jobs: 11, rating: 4.8, status: "On Job" },
  { name: "Rica Santos",     jobs: 10, rating: 4.7, status: "Available" },
  { name: "Nico Bautista",   jobs: 9,  rating: 4.6, status: "On Job" },
]

// ─── Pure SVG Charts ──────────────────────────────────────────────────────────

function AreaChartSVG() {
  const [hovered, setHovered] = useState<number | null>(null)
  const W = 420, H = 160, PL = 44, PR = 12, PT = 10, PB = 28
  const cW = W - PL - PR, cH = H - PT - PB
  const vals = revenueData.map(d => d.revenue)
  const maxV = Math.max(...vals) * 1.1

  const x = (i: number) => PL + (i / (vals.length - 1)) * cW
  const y = (v: number) => PT + cH - (v / maxV) * cH

  const linePath = vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  const areaPath = `${linePath} L${x(vals.length - 1).toFixed(1)},${(PT + cH).toFixed(1)} L${x(0).toFixed(1)},${(PT + cH).toFixed(1)} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"    />
        </linearGradient>
      </defs>
      {[0, 25000, 50000, 75000].map(t => (
        <g key={t}>
          <line x1={PL} y1={y(t)} x2={PL + cW} y2={y(t)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={PL - 6} y={y(t) + 4} textAnchor="end" fill="#475569" fontSize="10">
            {t === 0 ? "0" : `₱${t / 1000}k`}
          </text>
        </g>
      ))}
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
      {revenueData.map((d, i) => (
        <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fill="#475569" fontSize="10">{d.month}</text>
      ))}
      {revenueData.map((d, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          <circle cx={x(i)} cy={y(d.revenue)} r="12" fill="transparent" style={{ cursor: "pointer" }} />
          <circle cx={x(i)} cy={y(d.revenue)} r={hovered === i ? 4 : 3}
            fill={hovered === i ? "#818cf8" : "#6366f1"} stroke="#1e293b" strokeWidth="2" />
          {hovered === i && (
            <g>
              <rect x={x(i) - 38} y={y(d.revenue) - 32} width="76" height="22" rx="5"
                fill="#0f172a" stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
              <text x={x(i)} y={y(d.revenue) - 17} textAnchor="middle" fill="#818cf8" fontSize="11" fontWeight="600">
                ₱{(d.revenue / 1000).toFixed(0)}k
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  )
}

function BarChartSVG() {
  const [hovered, setHovered] = useState<string | null>(null)
  const W = 420, H = 160, PL = 28, PR = 12, PT = 10, PB = 28
  const cW = W - PL - PR, cH = H - PT - PB
  const n = monthlyJobOrders.length
  const groupW = cW / n
  const barW = 7, gap = 2
  const maxV = 70

  const y  = (v: number) => PT + cH - (v / maxV) * cH
  const bH = (v: number) => Math.max((v / maxV) * cH, 1)

  const colors = ["#6366f1", "#3b82f6", "#475569"]
  const keys   = ["completed", "ongoing", "cancelled"] as const

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {[0, 20, 40, 60].map(t => (
        <line key={t} x1={PL} y1={y(t)} x2={PL + cW} y2={y(t)}
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {monthlyJobOrders.map((d, i) => {
        const cx = PL + i * groupW + groupW / 2
        const totalW = keys.length * barW + (keys.length - 1) * gap
        return (
          <g key={i}>
            {keys.map((k, ki) => {
              const bx  = cx - totalW / 2 + ki * (barW + gap)
              const id  = `${i}-${k}`
              const val = d[k]
              return (
                <g key={k} onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}>
                  <rect x={bx} y={y(val)} width={barW} height={bH(val)}
                    fill={colors[ki]} rx="2"
                    opacity={hovered === id ? 1 : 0.72}
                    style={{ cursor: "pointer", transition: "opacity 120ms" }} />
                  {hovered === id && (
                    <g>
                      <rect x={bx - 8} y={y(val) - 24} width="30" height="18" rx="4"
                        fill="#0f172a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <text x={bx + barW / 2} y={y(val) - 11} textAnchor="middle"
                        fill={colors[ki]} fontSize="10" fontWeight="600">{val}</text>
                    </g>
                  )}
                </g>
              )
            })}
            <text x={cx} y={H - 6} textAnchor="middle" fill="#475569" fontSize="10">{d.month}</text>
          </g>
        )
      })}
    </svg>
  )
}

function DonutChart() {
  const [hovered, setHovered] = useState<number | null>(null)
  const total = ticketStatusData.reduce((s, d) => s + d.value, 0)
  const cx = 80, cy = 80, R = 62, r = 40
  let angle = -Math.PI / 2

  const slices = ticketStatusData.map((d) => {
    const sweep = (d.value / total) * 2 * Math.PI
    const x1 = cx + R * Math.cos(angle),  y1 = cy + R * Math.sin(angle)
    angle += sweep
    const x2 = cx + R * Math.cos(angle),  y2 = cy + R * Math.sin(angle)
    const xi1 = cx + r * Math.cos(angle), yi1 = cy + r * Math.sin(angle)
    const xi2 = cx + r * Math.cos(angle - sweep), yi2 = cy + r * Math.sin(angle - sweep)
    const large = sweep > Math.PI ? 1 : 0
    const path = [
      `M${x1.toFixed(2)},${y1.toFixed(2)}`,
      `A${R},${R} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`,
      `L${xi1.toFixed(2)},${yi1.toFixed(2)}`,
      `A${r},${r} 0 ${large} 0 ${xi2.toFixed(2)},${yi2.toFixed(2)}`,
      "Z",
    ].join(" ")
    return { ...d, path }
  })

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {slices.map((s, i) => (
        <path key={s.name} d={s.path} fill={s.color}
          opacity={hovered === null || hovered === i ? 1 : 0.3}
          style={{ cursor: "pointer", transition: "opacity 150ms" }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
      <text x={cx} y={cy - 6}  textAnchor="middle" fill="#f1f5f9" fontSize="20" fontWeight="700">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="10">Total</text>
    </svg>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

const statusColors: Record<string, { bg: string; color: string }> = {
  "New":          { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  "Assigned":     { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  "In Diagnosis": { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  "Quoted":       { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
}

function StatusBadge({ status }: { status: string }) {
  const s = statusColors[status] ?? { bg: "rgba(255,255,255,0.08)", color: "#94a3b8" }
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 11.5, fontWeight: 500, background: s.bg, color: s.color, letterSpacing: "0.3px",
    }}>
      {status}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, delta, positive, accent }: {
  icon: React.ElementType; label: string; value: number
  delta: string; positive: boolean; accent: string
}) {
  return (
    <div style={{
      background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: accent + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={20} color={accent} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: positive ? "#34d399" : "#f87171" }}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {delta}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5 }}>{label}</div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>Dashboard</h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>Thursday, May 7, 2026</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#94a3b8", cursor: "pointer",
          }}>
            This Month ▾
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
          }}>
            AD
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon={MessageSquare} label="New Inquiries"      value={47} delta="+12% vs last mo." positive accent="#6366f1" />
        <StatCard icon={ClipboardList} label="Active Job Orders"  value={21} delta="+5% vs last mo."  positive accent="#3b82f6" />
        <StatCard icon={Ticket}        label="Open Tickets"       value={34} delta="-8% vs last mo."  positive accent="#f59e0b" />
        <StatCard icon={FileText}      label="Pending Quotations" value={13} delta="+3% vs last mo."  positive={false} accent="#10b981" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 16, marginBottom: 24 }}>

        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Monthly Revenue</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Last 7 months</div>
          </div>
          <AreaChartSVG />
        </div>

        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Job Orders</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>By status per month</div>
          </div>
          <BarChartSVG />
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {(["#6366f1","#3b82f6","#475569"] as const).map((c, i) => (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                {["Completed","Ongoing","Cancelled"][i]}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Ticket Status</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>All-time breakdown</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <DonutChart />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {ticketStatusData.map((d) => (
              <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ color: "#94a3b8" }}>{d.name}</span>
                </div>
                <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

        {/* Recent Inquiries */}
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Recent Inquiries</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Latest customer requests</div>
            </div>
            <a href="/admin/inquiries/" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#818cf8", textDecoration: "none" }}>
              View all <ArrowRight size={13} />
            </a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["ID", "Customer", "Service", "Date", "Status", ""].map((h) => (
                  <th key={h} style={{
                    padding: "10px 22px", textAlign: "left", fontSize: 11,
                    fontWeight: 500, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inq, i) => (
                <tr key={inq.id}
                  style={{ borderBottom: i < recentInquiries.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "13px 22px", fontSize: 13, color: "#64748b", fontFamily: "monospace" }}>{inq.id}</td>
                  <td style={{ padding: "13px 22px", fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{inq.customer}</td>
                  <td style={{ padding: "13px 22px", fontSize: 13, color: "#94a3b8" }}>{inq.service}</td>
                  <td style={{ padding: "13px 22px", fontSize: 13, color: "#64748b" }}>{inq.date}</td>
                  <td style={{ padding: "13px 22px" }}><StatusBadge status={inq.status} /></td>
                  <td style={{ padding: "13px 22px" }}>
                    <button style={{ background: "transparent", border: "none", color: "#475569", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Technicians */}
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Top Technicians</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>This month's performance</div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {topTechnicians.map((tech, i) => (
              <div key={tech.name}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  background: (["#6366f1","#3b82f6","#10b981","#f59e0b"][i]) + "33",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                  color: ["#818cf8","#60a5fa","#34d399","#fbbf24"][i],
                }}>
                  {tech.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tech.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 1 }}>
                    {tech.jobs} jobs · ★ {tech.rating}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 500, flexShrink: 0,
                  background: tech.status === "Available" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                  color:      tech.status === "Available" ? "#34d399"               : "#fbbf24",
                }}>
                  {tech.status}
                </span>
              </div>
            ))}
          </div>
          <div style={{
            margin: "8px 16px 16px",
            background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 10, padding: "14px 16px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
          }}>
            {[
              { icon: HardHat,      label: "Available",  value: "3 / 8", color: "#34d399" },
              { icon: Users,        label: "Customers",  value: "214",   color: "#60a5fa" },
              { icon: AlertCircle,  label: "Overdue",    value: "5",     color: "#f87171" },
              { icon: CheckCircle2, label: "Done Today", value: "7",     color: "#818cf8" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Icon size={15} color={color} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, User, Mail, Phone, MapPin, Wrench,
  Calendar, Clock, CheckCircle2, AlertCircle,
  ChevronDown, Send, Paperclip, Edit2, Trash2,MessageSquare
} from "lucide-react"

// ─── Mock Data ────────────────────────────────────────────────────────────────

type Status = "New" | "Assigned" | "In Diagnosis" | "Quoted" | "Closed"

interface TimelineEvent {
  id: number
  type: "status" | "note" | "assignment" | "system"
  actor: string
  content: string
  time: string
}

const MOCK_INQUIRY = {
  id: "INQ-1040",
  status: "In Diagnosis" as Status,
  createdAt: "May 6, 2026 — 9:14 AM",
  updatedAt: "May 6, 2026 — 2:30 PM",
  customer: {
    name: "Aisha Okonkwo",
    email: "aisha.okonkwo@email.com",
    phone: "+63 917 234 5678",
    address: "42 Mahogany St., Davao City",
  },
  service: {
    type: "Plumbing Leak",
    description: "There's a persistent leak under the kitchen sink. Water pools after running the tap for more than a minute. The cabinet underneath has already sustained water damage.",
    urgency: "High",
    preferredDate: "May 8, 2026",
  },
  assignedTo: {
    name: "Paulo Mendez",
    initials: "PM",
    role: "Senior Technician",
  },
}

const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 1, type: "system",     actor: "System",         content: "Inquiry INQ-1040 was created.",                         time: "May 6, 9:14 AM" },
  { id: 2, type: "assignment", actor: "Admin",          content: "Assigned to Paulo Mendez.",                             time: "May 6, 10:02 AM" },
  { id: 3, type: "status",     actor: "Paulo Mendez",   content: "Status changed to In Diagnosis.",                       time: "May 6, 11:30 AM" },
  { id: 4, type: "note",       actor: "Paulo Mendez",   content: "Initial inspection done. The P-trap is corroded and needs replacement. Will need to source the part before proceeding.", time: "May 6, 2:30 PM" },
]

const STATUS_OPTIONS: Status[] = ["New", "Assigned", "In Diagnosis", "Quoted", "Closed"]

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  "New":          { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  "Assigned":     { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  "In Diagnosis": { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  "Quoted":       { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  "Closed":       { bg: "rgba(100,116,139,0.15)", color: "#64748b" },
}

const URGENCY_STYLE: Record<string, { bg: string; color: string }> = {
  "High":   { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  "Medium": { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24" },
  "Low":    { bg: "rgba(16,185,129,0.12)",  color: "#34d399" },
}

const TIMELINE_ICON: Record<TimelineEvent["type"], React.ReactNode> = {
  status:     <CheckCircle2 size={14} color="#34d399" />,
  note:       <Edit2        size={14} color="#818cf8" />,
  assignment: <User         size={14} color="#fbbf24" />,
  system:     <AlertCircle  size={14} color="#475569" />,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminInquiryDetailPage() {
  const { id }                = useParams()
  const navigate              = useNavigate()
  const inq                   = MOCK_INQUIRY        // swap with real fetch by id
  const [status, setStatus]   = useState<Status>(inq.status)
  const [statusOpen, setStatusOpen] = useState(false)
  const [note, setNote]       = useState("")
  const [timeline, setTimeline] = useState<TimelineEvent[]>(MOCK_TIMELINE)

  const addNote = () => {
    if (!note.trim()) return
    setTimeline(prev => [...prev, {
      id:      prev.length + 1,
      type:    "note",
      actor:   "Admin",
      content: note.trim(),
      time:    "Just now",
    }])
    setNote("")
  }

  const changeStatus = (s: Status) => {
    setStatus(s)
    setStatusOpen(false)
    setTimeline(prev => [...prev, {
      id:      prev.length + 1,
      type:    "status",
      actor:   "Admin",
      content: `Status changed to ${s}.`,
      time:    "Just now",
    }])
  }

  return (
    <div
      style={{
        minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
      }}
      onClick={() => statusOpen && setStatusOpen(false)}
    >
      {/* Back + Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate("/admin/inquiries")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Inquiries
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>
                {inq.id}
              </h1>
              <span style={{
                display: "inline-block", padding: "3px 12px", borderRadius: 20,
                fontSize: 12, fontWeight: 500,
                background: STATUS_STYLE[status].bg,
                color: STATUS_STYLE[status].color,
              }}>
                {status}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: "5px 0 0" }}>
              Created {inq.createdAt} · Last updated {inq.updatedAt}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => navigate(`/admin/tickets/${inq.id}`)}
                title="View Conversation"
                style={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e2e8f0",
                  cursor: "pointer",
                  padding: 8,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                  e.currentTarget.style.color = "#94a3b8"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#475569"
                }}
              >
                View Conversation <MessageSquare size={14} />
              </button>
            {/* Status Dropdown */}
            <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setStatusOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "8px 14px", color: "#e2e8f0",
                  fontSize: 13, cursor: "pointer",
                }}
              >
                Change Status <ChevronDown size={13} />
              </button>
              {statusOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                  background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, overflow: "hidden", minWidth: 160,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}>
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => changeStatus(s)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "10px 16px", background: s === status ? "rgba(99,102,241,0.12)" : "transparent",
                        border: "none", color: s === status ? "#818cf8" : "#94a3b8",
                        fontSize: 13, cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { if (s !== status) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                      onMouseLeave={(e) => { if (s !== status) e.currentTarget.style.background = "transparent" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button style={{
              background: "transparent", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 8, padding: "8px 10px", color: "#f87171",
              cursor: "pointer", display: "flex", alignItems: "center",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Body Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Service Details */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 16 }}>
              Service Details
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <InfoRow icon={<Wrench size={14} color="#818cf8" />}   label="Service Type"    value={inq.service.type} />
              <InfoRow icon={<AlertCircle size={14} color="#f87171" />} label="Urgency"
                value={
                  <span style={{
                    padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: URGENCY_STYLE[inq.service.urgency].bg,
                    color: URGENCY_STYLE[inq.service.urgency].color,
                  }}>
                    {inq.service.urgency}
                  </span>
                }
              />
              <InfoRow icon={<Calendar size={14} color="#60a5fa" />} label="Preferred Date"  value={inq.service.preferredDate} />
              <InfoRow icon={<Clock    size={14} color="#fbbf24" />} label="Created"         value={inq.createdAt} />
            </div>
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Description</div>
              <p style={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                {inq.service.description}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 20 }}>
              Activity Timeline
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {timeline.map((event, i) => (
                <div key={event.id} style={{ display: "flex", gap: 14 }}>
                  {/* Line + Icon */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {TIMELINE_ICON[event.type]}
                    </div>
                    {i < timeline.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.06)", minHeight: 24, margin: "4px 0" }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ paddingBottom: i < timeline.length - 1 ? 20 : 0, flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{event.actor}</span>
                      <span style={{ fontSize: 11.5, color: "#475569" }}>{event.time}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0", lineHeight: 1.6 }}>
                      {event.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Note */}
            <div style={{
              marginTop: 20, paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 10 }}>Add a note</div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note or update…"
                rows={3}
                style={{
                  width: "100%", background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                  padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
                  resize: "vertical", outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit", lineHeight: 1.6,
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 7, padding: "7px 13px", color: "#64748b",
                  fontSize: 13, cursor: "pointer",
                }}>
                  <Paperclip size={13} /> Attach
                </button>
                <button
                  onClick={addNote}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#6366f1", border: "none", borderRadius: 7,
                    padding: "7px 16px", color: "#fff", fontSize: 13,
                    fontWeight: 500, cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
                >
                  <Send size={13} /> Post Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Customer Info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 16 }}>
              Customer
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700, color: "#818cf8", flexShrink: 0,
              }}>
                {inq.customer.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{inq.customer.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Customer</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <InfoRow icon={<Mail    size={13} color="#818cf8" />} label="Email"   value={inq.customer.email}   small />
              <InfoRow icon={<Phone   size={13} color="#818cf8" />} label="Phone"   value={inq.customer.phone}   small />
              <InfoRow icon={<MapPin  size={13} color="#818cf8" />} label="Address" value={inq.customer.address} small />
            </div>
          </div>

          {/* Assigned Technician */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 16 }}>
              Assigned Technician
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "rgba(245,158,11,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "#fbbf24", flexShrink: 0,
              }}>
                {inq.assignedTo.initials}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{inq.assignedTo.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{inq.assignedTo.role}</div>
              </div>
            </div>
            <button style={{
              width: "100%", background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
              padding: "8px", color: "#94a3b8", fontSize: 13, cursor: "pointer",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Reassign Technician
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14 }}>
              Quick Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Create Quotation",       color: "#6366f1", onClick: () => navigate("/admin/quotations/create") },
                { label: "Convert to Job Order",   color: "#3b82f6" },
                { label: "Send to Customer",       color: "#10b981" },
              ].map(({ label, color, onClick }) => (
                <button key={label} onClick={onClick} style={{
                  width: "100%", background: color + "18",
                  border: `1px solid ${color}33`, borderRadius: 8,
                  padding: "9px 14px", color: color,
                  fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = color + "28")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = color + "18")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function InfoRow({
  icon, label, value, small = false,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  small?: boolean
}) {
  return (
    <div style={{ display: "flex", alignItems: small ? "flex-start" : "center", gap: 10 }}>
      <div style={{ flexShrink: 0, marginTop: small ? 1 : 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: small ? 12.5 : 13.5, color: "#cbd5e1" }}>{value}</div>
      </div>
    </div>
  )
}
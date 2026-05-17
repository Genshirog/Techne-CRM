import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, Wrench, MapPin, Phone, Mail,
  Calendar, Clock, AlertCircle, CheckCircle2,
  ChevronDown, Send, Camera, ClipboardList,
  User, Hammer, Package, FileText, ThumbsUp
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = "Assigned" | "Traveling" | "On-Site" | "In Diagnosis" | "Awaiting Parts" | "Done"

interface FieldNote {
  id: number
  content: string
  time: string
  hasPhoto?: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_JOB = {
  id: "INQ-1040",
  status: "In Diagnosis" as JobStatus,
  assignedAt: "May 6, 2026 — 10:02 AM",
  scheduledFor: "May 8, 2026 — 9:00 AM",
  customer: {
    name: "Aisha Okonkwo",
    initials: "AO",
    phone: "+63 917 234 5678",
    email: "aisha.okonkwo@email.com",
    address: "42 Mahogany St., Davao City",
    mapUrl: "https://maps.google.com/?q=42+Mahogany+St+Davao+City",
  },
  service: {
    type: "Plumbing Leak",
    urgency: "High",
    description:
      "Persistent leak under the kitchen sink. Water pools after running the tap for more than a minute. Cabinet underneath has already sustained water damage.",
  },
  partsNeeded: [
    { name: "P-Trap (1.5\")", status: "To Source" },
    { name: "Compression Fittings x2", status: "In Stock" },
    { name: "Teflon Tape", status: "In Stock" },
  ],
}

const MOCK_NOTES: FieldNote[] = [
  {
    id: 1,
    content: "Initial inspection done. P-trap is heavily corroded. Will need a 1.5\" replacement. Cabinet floor has mild water damage — homeowner is aware.",
    time: "May 6, 2:30 PM",
    hasPhoto: true,
  },
]

const STATUS_OPTIONS: JobStatus[] = [
  "Assigned", "Traveling", "On-Site", "In Diagnosis", "Awaiting Parts", "Done",
]

const STATUS_META: Record<JobStatus, { bg: string; color: string; dot: string }> = {
  "Assigned":      { bg: "rgba(129,140,248,0.12)", color: "#818cf8", dot: "#818cf8" },
  "Traveling":     { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", dot: "#fbbf24" },
  "On-Site":       { bg: "rgba(52,211,153,0.12)",  color: "#34d399", dot: "#34d399" },
  "In Diagnosis":  { bg: "rgba(96,165,250,0.12)",  color: "#60a5fa", dot: "#60a5fa" },
  "Awaiting Parts":{ bg: "rgba(251,146,60,0.12)",  color: "#fb923c", dot: "#fb923c" },
  "Done":          { bg: "rgba(100,116,139,0.12)", color: "#64748b", dot: "#64748b" },
}

const URGENCY_META: Record<string, { bg: string; color: string }> = {
  "High":   { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  "Medium": { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
  "Low":    { bg: "rgba(52,211,153,0.12)",  color: "#34d399" },
}

const PARTS_STATUS: Record<string, { color: string }> = {
  "In Stock":  { color: "#34d399" },
  "To Source": { color: "#fb923c" },
  "Ordered":   { color: "#60a5fa" },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TechnicianInquiryDetailPage() {
  const { id }            = useParams()
  const navigate          = useNavigate()
  const job               = MOCK_JOB

  const [status, setStatus]         = useState<JobStatus>(job.status)
  const [statusOpen, setStatusOpen] = useState(false)
  const [note, setNote]             = useState("")
  const [notes, setNotes]           = useState<FieldNote[]>(MOCK_NOTES)
  const [checkedIn, setCheckedIn]   = useState(false)

  const postNote = () => {
    if (!note.trim()) return
    setNotes(prev => [...prev, {
      id:      prev.length + 1,
      content: note.trim(),
      time:    "Just now",
    }])
    setNote("")
  }

  const changeStatus = (s: JobStatus) => {
    setStatus(s)
    setStatusOpen(false)
    if (s === "On-Site") setCheckedIn(true)
  }

  const sm = STATUS_META[status]

  return (
    <div
      onClick={() => statusOpen && setStatusOpen(false)}
      style={{
        minHeight: "100vh",
        background: "#0b1120",
        padding: "24px 28px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#e2e8f0",
      }}
    >
      {/* Back */}
      <button
        onClick={() => navigate("/technician/jobs")}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "transparent", border: "none",
          color: "#475569", fontSize: 13, cursor: "pointer",
          padding: "0 0 18px",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
        onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
      >
        <ArrowLeft size={14} /> My Jobs
      </button>

      {/* Header */}
      <div style={{
        background: "#141e33",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: "20px 24px",
        marginBottom: 18,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                {job.id}
              </h1>
              {/* Status badge */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "3px 12px", borderRadius: 20,
                fontSize: 12, fontWeight: 500,
                background: sm.bg, color: sm.color,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: sm.dot,
                  boxShadow: `0 0 5px ${sm.dot}`,
                }} />
                {status}
              </span>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <MetaChip icon={<Calendar size={12} />} text={`Scheduled: ${job.scheduledFor}`} />
              <MetaChip icon={<Clock size={12} />}    text={`Assigned: ${job.assignedAt}`} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

            {/* Start Diagnosis — fixed: was referencing undefined `inq`, now uses `job` */}
            <button
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#6366f1", border: "none", borderRadius: 8,
                padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
              onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
              onClick={() => navigate(`/technician/diagnosis/${job.id}`)}
            >
              <Wrench size={14} /> Start Diagnosis
            </button>

            {/* Check-In */}
            <button
              onClick={() => { setCheckedIn(true); changeStatus("On-Site") }}
              disabled={checkedIn}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: checkedIn ? "rgba(52,211,153,0.1)" : "#10b981",
                border: checkedIn ? "1px solid rgba(52,211,153,0.25)" : "none",
                borderRadius: 8, padding: "8px 14px",
                color: checkedIn ? "#34d399" : "#fff",
                fontSize: 13, fontWeight: 500, cursor: checkedIn ? "default" : "pointer",
              }}
            >
              {checkedIn ? <><CheckCircle2 size={13} /> Checked In</> : <><MapPin size={13} /> Check In</>}
            </button>

            {/* Status Dropdown */}
            <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setStatusOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "8px 14px",
                  color: "#e2e8f0", fontSize: 13, cursor: "pointer",
                }}
              >
                Update Status <ChevronDown size={13} />
              </button>
              {statusOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                  background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, overflow: "hidden", minWidth: 170,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}>
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => changeStatus(s)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        width: "100%", textAlign: "left",
                        padding: "9px 14px",
                        background: s === status ? "rgba(99,102,241,0.1)" : "transparent",
                        border: "none",
                        color: s === status ? "#818cf8" : "#94a3b8",
                        fontSize: 13, cursor: "pointer",
                      }}
                      onMouseEnter={e => { if (s !== status) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                      onMouseLeave={e => { if (s !== status) e.currentTarget.style.background = "transparent" }}
                    >
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                        background: STATUS_META[s].dot,
                      }} />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mark Done */}
            <button
              onClick={() => changeStatus("Done")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#6366f1", border: "none", borderRadius: 8,
                padding: "8px 16px", color: "#fff",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
              onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
            >
              <ThumbsUp size={13} /> Mark Done
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Job Brief */}
          <Card label="Job Brief">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <DetailRow icon={<Wrench size={13} color="#818cf8" />}       label="Service Type" value={job.service.type} />
              <DetailRow
                icon={<AlertCircle size={13} color="#f87171" />}
                label="Urgency"
                value={
                  <span style={{
                    padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: URGENCY_META[job.service.urgency].bg,
                    color: URGENCY_META[job.service.urgency].color,
                  }}>
                    {job.service.urgency}
                  </span>
                }
              />
            </div>
            <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>Customer Description</div>
              <p style={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>
                {job.service.description}
              </p>
            </div>
          </Card>

          {/* Parts & Materials */}
          <Card label="Parts & Materials">
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {MOCK_JOB.partsNeeded.map((p, i) => (
                <div key={p.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 0",
                  borderBottom: i < MOCK_JOB.partsNeeded.length - 1
                    ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Package size={13} color="#60a5fa" />
                    <span style={{ fontSize: 13, color: "#cbd5e1" }}>{p.name}</span>
                  </div>
                  <span style={{
                    fontSize: 11.5, fontWeight: 500,
                    color: PARTS_STATUS[p.status]?.color ?? "#94a3b8",
                    background: (PARTS_STATUS[p.status]?.color ?? "#94a3b8") + "18",
                    padding: "2px 10px", borderRadius: 20,
                  }}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
            <button style={{
              marginTop: 14, width: "100%",
              background: "transparent",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "8px",
              color: "#475569", fontSize: 13, cursor: "pointer",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              + Add Part / Material
            </button>
          </Card>

          {/* Field Notes */}
          <Card label="Field Notes">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {notes.map(n => (
                <div key={n.id} style={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 10, padding: "14px 16px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <ClipboardList size={12} color="#818cf8" />
                      <span style={{ fontSize: 12, color: "#64748b" }}>{n.time}</span>
                    </div>
                    {n.hasPhoto && (
                      <span style={{
                        display: "flex", alignItems: "center", gap: 4,
                        fontSize: 11, color: "#60a5fa",
                        background: "rgba(96,165,250,0.1)",
                        padding: "2px 8px", borderRadius: 20,
                      }}>
                        <Camera size={10} /> Photo attached
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.65 }}>
                    {n.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Note */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#64748b", marginBottom: 10 }}>
                Add field note
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Describe what you found, what you did, or any issues…"
                rows={3}
                style={{
                  width: "100%", background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 8, padding: "10px 14px",
                  color: "#e2e8f0", fontSize: 13,
                  resize: "vertical", outline: "none",
                  boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 7, padding: "7px 13px",
                  color: "#64748b", fontSize: 13, cursor: "pointer",
                }}>
                  <Camera size={13} /> Attach Photo
                </button>
                <button
                  onClick={postNote}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#6366f1", border: "none", borderRadius: 7,
                    padding: "7px 16px", color: "#fff",
                    fontSize: 13, fontWeight: 500, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
                >
                  <Send size={13} /> Save Note
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Customer */}
          <Card label="Customer">
            {/* Avatar + Name */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(99,102,241,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700, color: "#818cf8", flexShrink: 0,
              }}>
                {job.customer.initials}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{job.customer.name}</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Customer</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <DetailRow icon={<Phone size={12} color="#818cf8" />}  label="Phone"   value={job.customer.phone}   small />
              <DetailRow icon={<Mail  size={12} color="#818cf8" />}  label="Email"   value={job.customer.email}   small />
              <DetailRow icon={<MapPin size={12} color="#818cf8" />} label="Address" value={job.customer.address} small />
            </div>

            {/* Navigate Button */}
            <a
              href={job.customer.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                marginTop: 16,
                background: "rgba(96,165,250,0.1)",
                border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: 8, padding: "9px",
                color: "#60a5fa", fontSize: 13, fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <MapPin size={13} /> Open in Maps
            </a>

            {/* Call button */}
            <a
              href={`tel:${job.customer.phone}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                marginTop: 8,
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: 8, padding: "9px",
                color: "#34d399", fontSize: 13, fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <Phone size={13} /> Call Customer
            </a>
          </Card>

          {/* Diagnosis Checklist */}
          <Card label="Diagnosis Checklist">
            <ChecklistItem label="Inspect leak source" />
            <ChecklistItem label="Check P-trap & drain assembly" defaultChecked />
            <ChecklistItem label="Test water pressure" />
            <ChecklistItem label="Assess cabinet damage" defaultChecked />
            <ChecklistItem label="Document with photos" />
          </Card>

          {/* Need Help? */}
          <Card label="Need Help?">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SupportButton label="Request Parts from Warehouse" icon={<Package size={13} />} color="#fb923c" />
              <SupportButton label="Escalate to Senior Tech"      icon={<User size={13} />}    color="#818cf8" />
              <SupportButton label="View Job Manual / Guide"      icon={<FileText size={13} />} color="#60a5fa" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#141e33",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "20px 22px",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: "#475569",
        textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 16,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function MetaChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569", fontSize: 12 }}>
      {icon} {text}
    </div>
  )
}

function DetailRow({
  icon, label, value, small = false,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  small?: boolean
}) {
  return (
    <div style={{ display: "flex", alignItems: small ? "flex-start" : "center", gap: 9 }}>
      <div style={{ flexShrink: 0, marginTop: small ? 1 : 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10.5, color: "#475569", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: small ? 12 : 13, color: "#cbd5e1" }}>{value}</div>
      </div>
    </div>
  )
}

function ChecklistItem({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div
      onClick={() => setChecked(c => !c)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: "pointer",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        background: checked ? "#6366f1" : "transparent",
        border: checked ? "none" : "1.5px solid rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {checked && <CheckCircle2 size={11} color="#fff" />}
      </div>
      <span style={{
        fontSize: 13, color: checked ? "#475569" : "#94a3b8",
        textDecoration: checked ? "line-through" : "none",
        transition: "all 0.15s",
      }}>
        {label}
      </span>
    </div>
  )
}

function SupportButton({ label, icon, color }: { label: string; icon: React.ReactNode; color: string }) {
  return (
    <button style={{
      display: "flex", alignItems: "center", gap: 8,
      width: "100%",
      background: color + "12",
      border: `1px solid ${color}30`,
      borderRadius: 8, padding: "9px 14px",
      color, fontSize: 13, fontWeight: 500,
      cursor: "pointer", textAlign: "left",
    }}
      onMouseEnter={e => (e.currentTarget.style.background = color + "22")}
      onMouseLeave={e => (e.currentTarget.style.background = color + "12")}
    >
      {icon} {label}
    </button>
  )
}
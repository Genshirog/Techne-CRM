import { useState, useRef, type JSX } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, Save, ChevronRight,
  Link2, Calendar, Clock, CheckCircle2, Edit2, Send,
  Wrench, MapPin, Phone, Mail, AlertCircle,
  UserCheck, Plus, Trash2, Image, X, PackageOpen,
  Truck, PlayCircle, AlertTriangle, ThumbsUp, RotateCcw,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type TechStatus =
  | "Assigned"
  | "On The Way"
  | "In Progress"
  | "Waiting Parts"
  | "Completed"

type ItemSource = "Quotation" | "Technician"

type TimelineEventType = "status" | "note" | "assignment" | "system"

interface JobItem {
  id:          number
  name:        string
  description: string
  qty:         number
  unitPrice:   number
  source:      ItemSource
}

interface ScopeCase  { name: string; desc: string }
interface WaiverCase { name: string; desc: string }

interface JobScope  { scenario: string; cases: ScopeCase[]  }
interface JobWaiver { title:    string; cases: WaiverCase[] }

interface Customer {
  name:    string
  email:   string
  phone:   string
  address: string
}

interface MockJob {
  id:             number
  jobNo:          string
  quotationRef:   string
  inquiryRef:     string
  projectTitle:   string
  status:         TechStatus
  assignedBy:     string | null
  startDate:      string | null
  expectedFinish: string | null
  completedAt:    string | null
  customer:       Customer
  items:          JobItem[]
  scopes:         JobScope[]
  waivers:        JobWaiver[]
  deliverables:   string[]
  createdAt:      string
  updatedAt:      string
}

interface TimelineEvent {
  id:      number
  type:    TimelineEventType
  actor:   string
  content: string
  time:    string
}

interface UploadedPhoto {
  id:   number
  name: string
  url:  string
  size: string
}

interface Transition {
  label: string
  next:  TechStatus
  icon:  React.ElementType
  color: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_JOB: MockJob = {
  id:             9,
  jobNo:          "JO-00009",
  quotationRef:   "QUO-1009",
  inquiryRef:     "INQ-1040",
  projectTitle:   "Kitchen Sink Plumbing Repair",
  status:         "In Progress",
  assignedBy:     "James Alcantara",
  startDate:      "May 8, 2026",
  expectedFinish: "May 10, 2026",
  completedAt:    null,
  customer: {
    name:    "Aisha Okonkwo",
    email:   "aisha.okonkwo@email.com",
    phone:   "+63 917 234 5678",
    address: "42 Mahogany St., Davao City",
  },
  items: [
    { id: 1, name: "P-trap replacement",      description: "Standard P-trap for kitchen sink", qty: 1, unitPrice: 850, source: "Quotation"  },
    { id: 2, name: "Labor — pipe repair",      description: "Installation and sealing",         qty: 2, unitPrice: 600, source: "Quotation"  },
    { id: 3, name: "Cabinet waterproofing",    description: "Waterproof sealant application",   qty: 1, unitPrice: 450, source: "Quotation"  },
    { id: 4, name: "Service call fee",         description: "",                                 qty: 1, unitPrice: 400, source: "Quotation"  },
    { id: 5, name: "Silicone sealant (extra)", description: "Additional due to corrosion",      qty: 2, unitPrice: 120, source: "Technician" },
  ],
  scopes: [
    {
      scenario: "Plumbing Leak — Under Sink",
      cases: [
        { name: "P-trap failure",   desc: "Replace corroded P-trap with new PVC fitting." },
        { name: "Cabinet moisture", desc: "Apply waterproof sealant to interior cabinet panels." },
      ],
    },
  ],
  waivers: [
    {
      title: "Pre-existing Damage",
      cases: [
        { name: "Cabinet panel", desc: "Service provider is not liable for pre-existing water damage to cabinet panels." },
        { name: "Hidden piping", desc: "Damage found within walls or concealed plumbing is not covered under this order." },
      ],
    },
  ],
  deliverables: [
    "Functional, leak-free P-trap installation",
    "Waterproofed cabinet interior",
    "Written technician report with before/after notes",
  ],
  createdAt: "May 6, 2026 — 10:00 AM",
  updatedAt: "May 8, 2026 — 3:15 PM",
}

const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 1, type: "system",     actor: "System",          content: "Job Order JO-00009 assigned to you.", time: "May 6, 10:00 AM" },
  { id: 2, type: "assignment", actor: "James Alcantara", content: "Assigned to you.",                    time: "May 6, 10:45 AM" },
  { id: 3, type: "status",     actor: "You",             content: "Marked as On The Way.",               time: "May 8, 8:00 AM"  },
  { id: 4, type: "status",     actor: "You",             content: "Marked as In Progress.",              time: "May 8, 8:30 AM"  },
  { id: 5, type: "note",       actor: "You",             content: "P-trap corroded beyond repair. Sourcing PVC replacement. Additional sealant needed.", time: "May 8, 3:15 PM" },
]

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_FLOW: TechStatus[] = ["Assigned", "On The Way", "In Progress", "Completed"]

const TRANSITIONS: Record<TechStatus, Transition[]> = {
  "Assigned":      [{ label: "I'm on my way",           next: "On The Way",    icon: Truck,       color: "#fbbf24" }],
  "On The Way":    [{ label: "I've arrived",             next: "In Progress",   icon: PlayCircle,  color: "#818cf8" }],
  "In Progress":   [
    { label: "Submit for Review",                         next: "Completed",     icon: ThumbsUp,    color: "#34d399" },
    { label: "Waiting on Parts",                          next: "Waiting Parts", icon: PackageOpen, color: "#fb923c" },
  ],
  "Waiting Parts": [{ label: "Parts received, resuming", next: "In Progress",   icon: RotateCcw,   color: "#60a5fa" }],
  "Completed":     [],
}

const STATUS_STYLE: Record<TechStatus, { bg: string; color: string }> = {
  "Assigned":      { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  "On The Way":    { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  "In Progress":   { bg: "rgba(168,85,247,0.15)",  color: "#c084fc" },
  "Waiting Parts": { bg: "rgba(251,146,60,0.15)",  color: "#fb923c" },
  "Completed":     { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
}

const TIMELINE_ICON: Record<TimelineEventType, JSX.Element> = {
  status:     <CheckCircle2 size={13} color="#34d399" />,
  note:       <Edit2        size={13} color="#818cf8" />,
  assignment: <UserCheck    size={13} color="#fbbf24" />,
  system:     <AlertCircle  size={13} color="#475569" />,
}

const fmt = (n: number): string =>
  new Intl.NumberFormat("en-PH", {
    style:                 "currency",
    currency:              "PHP",
    minimumFractionDigits: 2,
  }).format(n)

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: "#475569",
      textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 14,
    }}>
      {children}
    </div>
  )
}

interface MetaRowProps {
  icon:  React.ReactNode
  label: string
  value: string
}

function MetaRow({ icon, label, value }: MetaRowProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: "#cbd5e1" }}>{value}</div>
      </div>
    </div>
  )
}

interface CollapsibleSectionProps {
  title:       string
  children:    React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      background: "#1e293b",
      border:     "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 22px", background: "transparent", border: "none",
          color: "#94a3b8", fontSize: 11, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.7px", cursor: "pointer",
        }}
      >
        {title}
        <ChevronRight
          size={14}
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        />
      </button>
      {open && (
        <div style={{ padding: "0 22px 20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Status Progress Track ────────────────────────────────────────────────────

function StatusTrack({ status }: { status: TechStatus }) {
  const isWaiting  = status === "Waiting Parts"
  const currentIdx = isWaiting
    ? STATUS_FLOW.indexOf("In Progress")
    : STATUS_FLOW.indexOf(status)

  return (
    <div style={{
      background: "#111827", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 14, padding: "18px 24px", marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {STATUS_FLOW.map((step, i) => {
          const isDone    = i < currentIdx
          const isCurrent = i === currentIdx
          const isLast    = i === STATUS_FLOW.length - 1
          const sStyle    = STATUS_STYLE[step]

          return (
            <div key={step} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: isDone ? "#34d399" : isCurrent ? sStyle.bg : "rgba(255,255,255,0.04)",
                  border: `2px solid ${isDone ? "#34d399" : isCurrent ? sStyle.color : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                }}>
                  {isDone
                    ? <CheckCircle2 size={14} color="#0f172a" />
                    : <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: isCurrent ? sStyle.color : "rgba(255,255,255,0.15)",
                      }} />
                  }
                </div>
                <span style={{
                  fontSize: 10.5,
                  fontWeight: isCurrent ? 600 : 400,
                  color: isDone ? "#34d399" : isCurrent ? sStyle.color : "#475569",
                  whiteSpace: "nowrap",
                }}>
                  {step}
                </span>
              </div>

              {!isLast && (
                <div style={{
                  flex: 1, height: 2, margin: "0 6px", marginBottom: 20,
                  background: isDone ? "#34d399" : "rgba(255,255,255,0.07)",
                  borderRadius: 1, transition: "background 0.3s",
                }} />
              )}
            </div>
          )
        })}

        {isWaiting && (
          <div style={{
            marginLeft: 16, display: "flex", alignItems: "center", gap: 6,
            background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)",
            borderRadius: 8, padding: "5px 10px",
          }}>
            <PackageOpen size={12} color="#fb923c" />
            <span style={{ fontSize: 11, color: "#fb923c", fontWeight: 600 }}>Waiting Parts</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Shared mini-styles ───────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background:  "#0f172a",
  border:      "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  padding:     "5px 8px",
  color:       "#e2e8f0",
  fontSize:    12,
  outline:     "none",
  width:       "100%",
  fontFamily:  "inherit",
}

function miniBtn(color: string): React.CSSProperties {
  return {
    width: 28, height: 28, borderRadius: 7,
    background: `${color}18`,
    border:     `1px solid ${color}44`,
    color,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TechnicianJobDetailPage() {
  const navigate = useNavigate()
  useParams<{ id: string }>()

  const [job]                             = useState<MockJob>(MOCK_JOB)
  const [status,       setStatus]         = useState<TechStatus>(MOCK_JOB.status)
  const [items,        setItems]          = useState<JobItem[]>(MOCK_JOB.items)
  const [notes,        setNotes]          = useState<string>(
    "P-trap was severely corroded — replaced with PVC. Cabinet interior had moisture damage on left panel. Applied extra sealant layers. Will check for leaks on follow-up visit before marking complete."
  )
  const [photos,       setPhotos]         = useState<UploadedPhoto[]>([])
  const [timeline,     setTimeline]       = useState<TimelineEvent[]>(MOCK_TIMELINE)
  const [noteText,     setNoteText]       = useState<string>("")
  const [saving,       setSaving]         = useState<boolean>(false)
  const [saved,        setSaved]          = useState<boolean>(false)
  const [showAddItem,  setShowAddItem]    = useState<boolean>(false)
  const [newItemName,  setNewItemName]    = useState<string>("")
  const [newItemDesc,  setNewItemDesc]    = useState<string>("")
  const [newItemQty,   setNewItemQty]     = useState<number>(1)
  const [newItemPrice, setNewItemPrice]   = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Derived ──────────────────────────────────────────────────────────────

  const quotationItems = items.filter(i => i.source === "Quotation")
  const techItems      = items.filter(i => i.source === "Technician")
  const quotationSub   = quotationItems.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const techSub        = techItems.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const subtotal       = quotationSub + techSub
  const diagnosticFee  = subtotal * 0.10
  const grandTotal     = subtotal + diagnosticFee

  const transitions = TRANSITIONS[status]
  const isFinal     = status === "Completed"

  // ── Handlers ─────────────────────────────────────────────────────────────

  const advanceStatus = (next: TechStatus) => {
    setStatus(next)
    setTimeline(prev => [...prev, {
      id:      prev.length + 1,
      type:    "status" as TimelineEventType,
      actor:   "You",
      content: next === "Completed" ? "Job submitted for admin review." : `Marked as ${next}.`,
      time:    "Just now",
    }])
  }

  const addItem = () => {
    if (!newItemName.trim() || !newItemPrice) return
    const newId = Math.max(...items.map(i => i.id)) + 1
    setItems(prev => [...prev, {
      id:          newId,
      name:        newItemName.trim(),
      description: newItemDesc.trim(),
      qty:         Math.max(1, parseInt(String(newItemQty)) || 1),
      unitPrice:   parseFloat(newItemPrice) || 0,
      source:      "Technician" as ItemSource,
    }])
    setNewItemName(""); setNewItemDesc(""); setNewItemQty(1); setNewItemPrice("")
    setShowAddItem(false)
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.source === "Technician")))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const newPhotos: UploadedPhoto[] = files.map(file => ({
      id:   Date.now() + Math.random(),
      name: file.name,
      url:  URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(1) + " KB",
    }))
    setPhotos(prev => [...prev, ...newPhotos])
  }

  const removePhoto = (id: number) =>
    setPhotos(prev => prev.filter(p => p.id !== id))

  const postNote = () => {
    if (!noteText.trim()) return
    setTimeline(prev => [...prev, {
      id:      prev.length + 1,
      type:    "note" as TimelineEventType,
      actor:   "You",
      content: noteText.trim(),
      time:    "Just now",
    }])
    setNoteText("")
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false); setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    }, 700)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
      }}
    >
      {/* ── Back + Header ── */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate("/technician/jobs")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to My Jobs
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: "rgba(99,102,241,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Wrench size={18} color="#818cf8" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                  {job.jobNo}
                </h1>
                <span style={{
                  display: "inline-block", padding: "3px 12px", borderRadius: 20,
                  fontSize: 12, fontWeight: 500,
                  background: STATUS_STYLE[status].bg,
                  color:      STATUS_STYLE[status].color,
                }}>
                  {status}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: "#475569", margin: "3px 0 0" }}>
                {job.projectTitle} ·{" "}
                <span style={{ color: "#60a5fa" }}>{job.quotationRef}</span>
                {" · "}
                <span style={{ color: "#60a5fa" }}>{job.inquiryRef}</span>
                {job.updatedAt && ` · Updated ${job.updatedAt}`}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || isFinal}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: saved ? "#059669" : saving || isFinal ? "#334155" : "#6366f1",
              border: "none", borderRadius: 8, padding: "8px 18px",
              color: "#fff", fontSize: 13, fontWeight: 500,
              cursor: saving || isFinal ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => { if (!saving && !isFinal && !saved) (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5" }}
            onMouseLeave={e => { if (!saving && !saved)             (e.currentTarget as HTMLButtonElement).style.background = isFinal ? "#334155" : "#6366f1" }}
          >
            <Save size={14} />
            {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── Status Track ── */}
      <StatusTrack status={status} />

      {/* ── Completed Banner ── */}
      {isFinal && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#34d399", fontSize: 13,
        }}>
          <CheckCircle2 size={15} />
          Submitted for admin review. No further edits allowed.
        </div>
      )}

      {/* ── Two-Column Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* ─── LEFT COLUMN ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Job Information */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Job Information</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {([
                { label: "Project Title",   value: job.projectTitle },
                { label: "Assigned By",     value: job.assignedBy ?? "—" },
                { label: "Start Date",      value: job.startDate ?? "—" },
                { label: "Expected Finish", value: job.expectedFinish ?? "—" },
                { label: "Quotation Ref",   value: job.quotationRef },
                { label: "Inquiry Ref",     value: job.inquiryRef },
              ] as { label: string; value: string }[]).map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13.5, color: "#e2e8f0" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Items & Services */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <SectionLabel>Items & Services Used</SectionLabel>
              <div style={{ display: "flex", gap: 12, marginTop: -6 }}>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: "rgba(100,116,139,0.15)", color: "#94a3b8" }}>
                  Grayed = from Quotation (read-only)
                </span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                  White = added by you
                </span>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {(["Item / Part", "Description", "Qty", "Unit Price", "Total", ""] as string[]).map((h, i) => (
                    <th key={i} style={{
                      padding: "9px 16px",
                      textAlign: (i >= 2 && i <= 4) ? "right" : "left",
                      fontSize: 11, fontWeight: 600, color: "#475569",
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const isQ = item.source === "Quotation"
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: idx < items.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                        background:   isQ ? "rgba(255,255,255,0.015)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "10px 16px", fontSize: 13, color: isQ ? "#94a3b8" : "#e2e8f0" }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12.5, color: "#64748b" }}>
                        {item.description || "—"}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, color: "#94a3b8" }}>
                        {item.qty}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, color: "#94a3b8" }}>
                        {fmt(item.unitPrice)}
                      </td>
                      <td style={{
                        padding: "10px 16px", textAlign: "right",
                        fontSize: 13, fontWeight: 500, color: "#f1f5f9",
                        fontVariantNumeric: "tabular-nums",
                      }}>
                        {fmt(item.qty * item.unitPrice)}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "center", width: 40 }}>
                        {!isQ && !isFinal && (
                          <button
                            onClick={() => removeItem(item.id)}
                            title="Remove item"
                            style={{
                              width: 28, height: 28, borderRadius: 7,
                              background: "transparent", border: "1px solid rgba(248,113,113,0.2)",
                              color: "#f87171", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {/* Inline add-item row */}
                {showAddItem && (
                  <tr style={{ background: "rgba(99,102,241,0.06)", borderTop: "1px solid rgba(99,102,241,0.2)" }}>
                    <td style={{ padding: "8px 10px" }}>
                      <input
                        autoFocus
                        value={newItemName}
                        onChange={e => setNewItemName(e.target.value)}
                        placeholder="Item name"
                        style={inputStyle}
                      />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input
                        value={newItemDesc}
                        onChange={e => setNewItemDesc(e.target.value)}
                        placeholder="Description"
                        style={inputStyle}
                      />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input
                        type="number" min={1}
                        value={newItemQty}
                        onChange={e => setNewItemQty(Number(e.target.value))}
                        style={{ ...inputStyle, width: 52, textAlign: "right" }}
                      />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input
                        type="number" min={0}
                        value={newItemPrice}
                        onChange={e => setNewItemPrice(e.target.value)}
                        placeholder="0.00"
                        style={{ ...inputStyle, width: 88, textAlign: "right" }}
                      />
                    </td>
                    <td />
                    <td style={{ padding: "8px 10px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={addItem}               style={miniBtn("#34d399")}><CheckCircle2 size={13} /></button>
                        <button onClick={() => setShowAddItem(false)} style={miniBtn("#f87171")}><X size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Footer: add-item + totals */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "14px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              {!isFinal && !showAddItem ? (
                <button
                  onClick={() => setShowAddItem(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: 8, padding: "7px 13px",
                    color: "#818cf8", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.18)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
                >
                  <Plus size={13} /> Add Part / Item
                </button>
              ) : <div />}

              <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 7 }}>
                {([
                  { label: "Quotation Subtotal",  value: fmt(quotationSub),  color: "#94a3b8" },
                  { label: "Your Added Items",    value: fmt(techSub),       color: "#818cf8" },
                  { label: "Diagnostic Fee (10%)",value: fmt(diagnosticFee), color: "#94a3b8" },
                ] as { label: string; value: string; color: string }[]).map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>{label}</span>
                    <span style={{ fontSize: 12.5, color, fontVariantNumeric: "tabular-nums" }}>{value}</span>
                  </div>
                ))}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 9,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Grand Total</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>
                    {fmt(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technician Notes */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>My Notes / Findings</SectionLabel>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              disabled={isFinal}
              placeholder="Describe what you found, what was replaced, any issues encountered…"
              rows={5}
              style={{
                width: "100%", background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                padding: "12px 14px", color: "#e2e8f0", fontSize: 13,
                resize: "vertical", outline: "none", boxSizing: "border-box",
                fontFamily: "inherit", lineHeight: 1.7,
                opacity: isFinal ? 0.6 : 1,
              }}
            />
            {!isFinal && (
              <p style={{ fontSize: 11.5, color: "#334155", margin: "6px 0 0" }}>
                These notes are visible to admin and included in the PDF report.
              </p>
            )}
          </div>

          {/* Photos / Attachments */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <SectionLabel>Photos / Attachments</SectionLabel>
              {!isFinal && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: 8, padding: "6px 12px",
                    color: "#34d399", fontSize: 12, fontWeight: 500, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(16,185,129,0.18)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(16,185,129,0.1)")}
                >
                  <Image size={13} /> Upload Photos
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />

            {photos.length === 0 ? (
              <div
                onClick={() => { if (!isFinal) fileInputRef.current?.click() }}
                style={{
                  border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 10, padding: "32px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 8, cursor: isFinal ? "default" : "pointer", color: "#475569",
                }}
                onMouseEnter={e => { if (!isFinal) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
              >
                <Image size={22} color="#334155" />
                <span style={{ fontSize: 13 }}>
                  {isFinal ? "No photos uploaded." : "Click or drag to upload before/after photos"}
                </span>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                {photos.map(photo => (
                  <div key={photo.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
                    <img
                      src={photo.url}
                      alt={photo.name}
                      style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }}
                    />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "rgba(0,0,0,0.65)", padding: "4px 6px",
                    }}>
                      <div style={{ fontSize: 10, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {photo.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{photo.size}</div>
                    </div>
                    {!isFinal && (
                      <button
                        onClick={() => removePhoto(photo.id)}
                        style={{
                          position: "absolute", top: 5, right: 5,
                          width: 22, height: 22, borderRadius: "50%",
                          background: "rgba(0,0,0,0.7)", border: "none",
                          color: "#f87171", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scope of Work */}
          <CollapsibleSection title="Scope of Work (Reference)">
            <div style={{ paddingTop: 16 }}>
              {job.scopes.map((sc, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 }}>
                    {i + 1}. {sc.scenario}
                  </div>
                  {sc.cases.map((c, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4, paddingLeft: 12 }}>
                      <span style={{ color: "#475569", fontSize: 12 }}>•</span>
                      <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                        <strong style={{ color: "#cbd5e1" }}>{c.name}:</strong> {c.desc}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Waiver */}
          <CollapsibleSection title="Waiver of Liability (Reference)">
            <div style={{ paddingTop: 16 }}>
              {job.waivers.map((w, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 }}>{w.title}</div>
                  {w.cases.map((c, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4, paddingLeft: 12 }}>
                      <span style={{ color: "#475569", fontSize: 12 }}>•</span>
                      <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                        <strong style={{ color: "#cbd5e1" }}>{c.name}:</strong> {c.desc}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Activity Timeline */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Activity Timeline</SectionLabel>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {timeline.map((event, i) => (
                <div key={event.id} style={{ display: "flex", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                      background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {TIMELINE_ICON[event.type]}
                    </div>
                    {i < timeline.length - 1 && (
                      <div style={{
                        width: 1, flex: 1, background: "rgba(255,255,255,0.05)",
                        minHeight: 20, margin: "4px 0",
                      }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < timeline.length - 1 ? 18 : 0, flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{event.actor}</span>
                      <span style={{ fontSize: 11, color: "#475569" }}>{event.time}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "3px 0 0", lineHeight: 1.6 }}>
                      {event.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {!isFinal && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: "#64748b", marginBottom: 10 }}>
                  Add a note
                </div>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Write a field note or update…"
                  rows={3}
                  style={{
                    width: "100%", background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                    padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
                    resize: "vertical", outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit", lineHeight: 1.6,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <button
                    onClick={postNote}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "#6366f1", border: "none", borderRadius: 7,
                      padding: "7px 16px", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
                  >
                    <Send size={13} /> Post Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT SIDEBAR ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Status Actions */}
          {transitions.length > 0 && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "20px 22px",
            }}>
              <SectionLabel>Update Status</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {transitions.map(({ label, next, icon: Icon, color }) => (
                  <button
                    key={next}
                    onClick={() => advanceStatus(next)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 8, padding: "11px",
                      background: `${color}18`,
                      border: `1px solid ${color}44`,
                      borderRadius: 10, color, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${color}28`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${color}18`)}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: "#334155", margin: "10px 0 0", lineHeight: 1.6 }}>
                {status === "In Progress"
                  ? "Submit for Review when work is fully done. Use Waiting Parts if you need to pause."
                  : status === "Waiting Parts"
                  ? "Resume the job once parts have arrived."
                  : "Update your status so dispatch can track you."}
              </p>
            </div>
          )}

          {/* Linked Records */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Linked Records</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {([
                { label: "Quotation", ref: job.quotationRef, color: "#818cf8" },
                { label: "Inquiry",   ref: job.inquiryRef,   color: "#60a5fa" },
              ] as { label: string; ref: string; color: string }[]).map(({ label, ref, color }) => (
                <div
                  key={label}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8, padding: "10px 14px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color }}>{ref}</div>
                  </div>
                  <Link2 size={13} color={color} />
                </div>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Customer</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#818cf8", flexShrink: 0,
              }}>
                {job.customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{job.customer.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Customer</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <MetaRow icon={<Mail   size={12} color="#818cf8" />} label="Email"   value={job.customer.email}   />
              <MetaRow icon={<Phone  size={12} color="#818cf8" />} label="Phone"   value={job.customer.phone}   />
              <MetaRow icon={<MapPin size={12} color="#818cf8" />} label="Address" value={job.customer.address} />
            </div>
          </div>

          {/* Record Info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Record Info</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <MetaRow icon={<Calendar size={12} color="#818cf8" />} label="Created"        value={job.createdAt}       />
              <MetaRow icon={<Clock    size={12} color="#fbbf24" />} label="Last Updated"   value={job.updatedAt}       />
              {job.startDate      && <MetaRow icon={<Wrench   size={12} color="#60a5fa" />} label="Started"         value={job.startDate}      />}
              {job.expectedFinish && <MetaRow icon={<Calendar size={12} color="#94a3b8" />} label="Expected Finish" value={job.expectedFinish} />}
            </div>
          </div>

          {/* Deliverables */}
          {job.deliverables.length > 0 && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "20px 22px",
            }}>
              <SectionLabel>Expected Deliverables</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {job.deliverables.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "#34d399", flexShrink: 0, marginTop: 6,
                    }} />
                    <span style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.6 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technician Access Notice */}
          <div style={{
            background: "rgba(100,116,139,0.06)",
            border: "1px solid rgba(100,116,139,0.15)",
            borderRadius: 10, padding: "14px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <AlertTriangle size={13} color="#64748b" />
              <span style={{
                fontSize: 11, fontWeight: 600, color: "#64748b",
                textTransform: "uppercase", letterSpacing: "0.5px",
              }}>
                Technician Access
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.6 }}>
              You can update status, add parts, upload photos, and post notes.
              Job assignment and archiving are admin-only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
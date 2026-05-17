import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, ClipboardList, Save, Trash2, RotateCcw,
  ChevronDown, AlertTriangle, Link2, User, Calendar,
  Clock, CheckCircle2, AlertCircle, Edit2, Send,
  Wrench, FileDown, ChevronRight, UserCheck, X,
} from "lucide-react"
import { generateJobOrderPDF } from "./JobOrderPdf"

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = "Unassigned" | "Scheduled" | "InProgress" | "PendingReview" | "Completed" | "Cancelled"

interface JobItem {
  id: number
  name: string
  description: string
  qty: number
  unitPrice: number
  source: "Quotation" | "Technician"
}

interface TimelineEvent {
  id: number
  type: "status" | "note" | "assignment" | "system"
  actor: string
  content: string
  time: string
}

interface JobOrderRecord {
  id: number
  jobNo: string
  quotationRef: string
  inquiryRef: string
  projectTitle: string
  status: JobStatus
  technician: string | null
  assignedBy: string | null
  startDate: string | null
  expectedFinish: string | null
  completedAt: string | null
  customer: { name: string; email: string; phone: string; address: string }
  items: JobItem[]
  technicianNotes: string
  customerName: string
  customerSignature: string
  customerDate: string
  technicianSignature: string
  technicianDate: string
  scopes: { scenario: string; cases: { name: string; desc: string }[] }[]
  waivers: { title: string; cases: { name: string; desc: string }[] }[]
  deliverables: string[]
  timelineMin: string
  timelineMax: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_RECORD: JobOrderRecord = {
  id:            9,
  jobNo:         "JO-00009",
  quotationRef:  "QUO-1009",
  inquiryRef:    "INQ-1040",
  projectTitle:  "Kitchen Sink Plumbing Repair",
  status:        "InProgress",
  technician:    "Paulo Mendez",
  assignedBy:    "James Alcantara",
  startDate:     "May 8, 2026",
  expectedFinish:"May 10, 2026",
  completedAt:   null,
  customer: {
    name:    "Aisha Okonkwo",
    email:   "aisha.okonkwo@email.com",
    phone:   "+63 917 234 5678",
    address: "42 Mahogany St., Davao City",
  },
  items: [
    { id: 1, name: "P-trap replacement",         description: "Standard P-trap for kitchen sink",   qty: 1, unitPrice: 850,  source: "Quotation"   },
    { id: 2, name: "Labor — pipe repair",         description: "Installation and sealing",           qty: 2, unitPrice: 600,  source: "Quotation"   },
    { id: 3, name: "Cabinet waterproofing",       description: "Waterproof sealant application",     qty: 1, unitPrice: 450,  source: "Quotation"   },
    { id: 4, name: "Service call fee",            description: "",                                   qty: 1, unitPrice: 400,  source: "Quotation"   },
    { id: 5, name: "Silicone sealant (extra)",    description: "Additional sealant due to corrosion",qty: 2, unitPrice: 120,  source: "Technician"  },
  ],
  technicianNotes: "P-trap was severely corroded — replaced with PVC. Cabinet interior had moisture damage on left panel. Applied extra sealant layers. Will check for leaks on follow-up visit before marking complete.",
  customerName:      "Aisha Okonkwo",
  customerSignature: "",
  customerDate:      "May 10, 2026",
  technicianSignature: "",
  technicianDate:      "May 10, 2026",
  scopes: [
    {
      scenario: "Plumbing Leak — Under Sink",
      cases: [
        { name: "P-trap failure",      desc: "Replace corroded P-trap with new PVC fitting." },
        { name: "Cabinet moisture",    desc: "Apply waterproof sealant to interior cabinet panels." },
      ],
    },
  ],
  waivers: [
    {
      title: "Pre-existing Damage",
      cases: [
        { name: "Cabinet panel",  desc: "Service provider is not liable for pre-existing water damage to cabinet panels." },
        { name: "Hidden piping",  desc: "Damage found within walls or concealed plumbing is not covered under this order." },
      ],
    },
  ],
  deliverables: [
    "Functional, leak-free P-trap installation",
    "Waterproofed cabinet interior",
    "Written technician report with before/after notes",
  ],
  timelineMin: "2",
  timelineMax: "3",
  createdAt:  "May 6, 2026 — 10:00 AM",
  updatedAt:  "May 8, 2026 — 3:15 PM",
  deletedAt:  null,
}

const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 1, type: "system",     actor: "System",          content: "Job Order JO-00009 created from QUO-1009.",          time: "May 6, 10:00 AM" },
  { id: 2, type: "assignment", actor: "James Alcantara", content: "Assigned to Paulo Mendez.",                           time: "May 6, 10:45 AM" },
  { id: 3, type: "status",     actor: "James Alcantara", content: "Status changed to Scheduled.",                        time: "May 6, 11:00 AM" },
  { id: 4, type: "status",     actor: "Paulo Mendez",    content: "Status changed to In Progress.",                      time: "May 8, 8:30 AM"  },
  { id: 5, type: "note",       actor: "Paulo Mendez",    content: "P-trap corroded beyond repair. Sourcing PVC replacement. Additional sealant needed.", time: "May 8, 3:15 PM" },
]

const STATUS_OPTIONS: JobStatus[] = ["Unassigned", "Scheduled", "InProgress", "PendingReview", "Completed", "Cancelled"]

const STATUS_STYLE: Record<JobStatus, { bg: string; color: string }> = {
  Unassigned:    { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  Scheduled:     { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  InProgress:    { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  PendingReview: { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  Completed:     { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  Cancelled:     { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
}

const STATUS_LABEL: Record<JobStatus, string> = {
  Unassigned:    "Unassigned",
  Scheduled:     "Scheduled",
  InProgress:    "In Progress",
  PendingReview: "Pending Review",
  Completed:     "Completed",
  Cancelled:     "Cancelled",
}

// Valid transitions — admin can only move forward (or cancel)
const VALID_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  Unassigned:    ["Scheduled", "Cancelled"],
  Scheduled:     ["InProgress", "Cancelled"],
  InProgress:    ["PendingReview", "Cancelled"],
  PendingReview: ["Completed", "InProgress"],
  Completed:     [],
  Cancelled:     ["Unassigned"],
}

const TIMELINE_ICON: Record<TimelineEvent["type"], React.ReactNode> = {
  status:     <CheckCircle2 size={13} color="#34d399" />,
  note:       <Edit2        size={13} color="#818cf8" />,
  assignment: <UserCheck    size={13} color="#fbbf24" />,
  system:     <AlertCircle  size={13} color="#475569" />,
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 }).format(n)

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

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
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

function CollapsibleSection({
  title, children, defaultOpen = false,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12,
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminJobOrderDetailPage() {
  const navigate = useNavigate()
  const { id }   = useParams()

  const [record,         setRecord]         = useState<JobOrderRecord>(MOCK_RECORD)
  const [status,         setStatus]         = useState<JobStatus>(MOCK_RECORD.status)
  const [statusOpen,     setStatusOpen]     = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [note,           setNote]           = useState("")
  const [timeline,       setTimeline]       = useState<TimelineEvent[]>(MOCK_TIMELINE)

  const isArchived    = record.deletedAt !== null
  const isFinal       = status === "Completed" || status === "Cancelled"
  const showSignatures = status === "PendingReview" || status === "Completed"

  const quotationItems  = record.items.filter(i => i.source === "Quotation")
  const techItems       = record.items.filter(i => i.source === "Technician")
  const quotationSub    = quotationItems.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const techSub         = techItems.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const subtotal        = quotationSub + techSub
  const diagnosticFee   = subtotal * 0.10
  const grandTotal      = subtotal + diagnosticFee

  const changeStatus = (s: JobStatus) => {
    if (!VALID_TRANSITIONS[status].includes(s)) return
    setStatus(s)
    setStatusOpen(false)
    setTimeline(prev => [...prev, {
      id:      prev.length + 1,
      type:    "status",
      actor:   "Admin",
      content: `Status changed to ${STATUS_LABEL[s]}.`,
      time:    "Just now",
    }])
    setRecord(r => ({ ...r, updatedAt: "Just now" }))
  }

  const postNote = () => {
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

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setRecord(r => ({ ...r, updatedAt: "Just now" }))
      setSaving(false); setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    }, 700)
  }

  const handleArchive = () => {
    setRecord(r => ({ ...r, deletedAt: "Just now" }))
    setConfirmArchive(false)
  }

  const handleRestore = () => setRecord(r => ({ ...r, deletedAt: null }))

  const handleDownloadPDF = () => {
    generateJobOrderPDF({
      jobNo:          record.jobNo,
      projectTitle:   record.projectTitle,
      status:         STATUS_LABEL[status],
      technician:     record.technician,
      assignedBy:     record.assignedBy,
      startDate:      record.startDate,
      expectedFinish: record.expectedFinish,
      completedAt:    record.completedAt,
      customer:       record.customer,
      items:          record.items.map(i => ({
        name:        i.name,
        description: i.description,
        qty:         i.qty,
        unitPrice:   i.unitPrice,
        source:      i.source,
      })),
      scopes:            record.scopes,
      waivers:           record.waivers,
      deliverables:      record.deliverables,
      timelineMin:       record.timelineMin,
      timelineMax:       record.timelineMax,
      technicianNotes:   record.technicianNotes,
      customerName:      record.customerName,
      customerSignature: record.customerSignature,
      customerDate:      record.customerDate,
      technicianSignature: record.technicianSignature,
      technicianDate:    record.technicianDate,
      quotationRef:      record.quotationRef,
      inquiryRef:        record.inquiryRef,
      createdAt:         record.createdAt,
      updatedAt:         record.updatedAt,
    })
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
      }}
      onClick={() => statusOpen && setStatusOpen(false)}
    >
      {/* ── Back + Header ── */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => navigate("/admin/job-orders")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Job Orders
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: "rgba(245,158,11,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <ClipboardList size={18} color="#fbbf24" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                  {record.jobNo}
                </h1>
                <span style={{
                  display: "inline-block", padding: "3px 12px", borderRadius: 20,
                  fontSize: 12, fontWeight: 500,
                  background: STATUS_STYLE[status].bg, color: STATUS_STYLE[status].color,
                }}>
                  {STATUS_LABEL[status]}
                </span>
                {isArchived && (
                  <span style={{
                    padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: "rgba(248,113,113,0.1)", color: "#f87171",
                  }}>Archived</span>
                )}
              </div>
              <p style={{ fontSize: 12.5, color: "#475569", margin: "3px 0 0" }}>
                {record.projectTitle} ·{" "}
                <span
                  onClick={() => navigate(`/admin/quotations/${record.quotationRef}`)}
                  style={{ color: "#60a5fa", cursor: "pointer" }}
                >
                  {record.quotationRef}
                </span>
                {" · "}
                <span
                  onClick={() => navigate(`/admin/inquiries/${record.inquiryRef}`)}
                  style={{ color: "#60a5fa", cursor: "pointer" }}
                >
                  {record.inquiryRef}
                </span>
                {record.updatedAt && ` · Updated ${record.updatedAt}`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

            {/* Status Dropdown */}
            {!isArchived && !isFinal && (
              <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setStatusOpen(o => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "8px 14px", color: "#e2e8f0", fontSize: 13, cursor: "pointer",
                  }}
                >
                  Change Status <ChevronDown size={13} />
                </button>
                {statusOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                    background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, overflow: "hidden", minWidth: 175,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}>
                    {STATUS_OPTIONS.map(s => {
                      const allowed = VALID_TRANSITIONS[status].includes(s)
                      const isCurrent = s === status
                      return (
                        <button
                          key={s}
                          onClick={() => allowed && changeStatus(s)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            width: "100%", textAlign: "left",
                            padding: "10px 16px",
                            background: isCurrent ? "rgba(99,102,241,0.12)" : "transparent",
                            border: "none",
                            color: isCurrent ? "#818cf8" : allowed ? "#94a3b8" : "#334155",
                            fontSize: 13,
                            cursor: allowed ? "pointer" : "not-allowed",
                            opacity: allowed || isCurrent ? 1 : 0.45,
                          }}
                          onMouseEnter={(e) => { if (allowed && !isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                          onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = "transparent" }}
                        >
                          <span>{STATUS_LABEL[s]}</span>
                          {isCurrent && <span style={{ fontSize: 10, color: "#475569" }}>current</span>}
                          {!isCurrent && !allowed && <span style={{ fontSize: 10, color: "#334155" }}>locked</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: 8, padding: "8px 14px", color: "#34d399",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.12)")}
            >
              <FileDown size={14} /> Download PDF
            </button>

            {/* Archive / Restore */}
            {!isArchived ? (
              confirmArchive ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, color: "#f87171" }}>Archive?</span>
                  <button onClick={handleArchive} style={{
                    background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
                    borderRadius: 7, padding: "7px 12px", color: "#f87171", fontSize: 13, cursor: "pointer",
                  }}>Confirm</button>
                  <button onClick={() => setConfirmArchive(false)} style={{
                    background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 7, padding: "7px 12px", color: "#64748b", fontSize: 13, cursor: "pointer",
                  }}>Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmArchive(true)}
                  style={{
                    background: "transparent", border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: 8, padding: "8px 10px", color: "#f87171", cursor: "pointer",
                    display: "flex", alignItems: "center",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Trash2 size={15} />
                </button>
              )
            ) : (
              <button
                onClick={handleRestore}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: 8, padding: "8px 14px", color: "#34d399", fontSize: 13, cursor: "pointer",
                }}
              >
                <RotateCcw size={13} /> Restore
              </button>
            )}

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving || isArchived}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: saved ? "#059669" : (saving || isArchived) ? "#334155" : "#6366f1",
                border: "none", borderRadius: 8, padding: "8px 18px",
                color: "#fff", fontSize: 13, fontWeight: 500,
                cursor: saving || isArchived ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (!saving && !isArchived && !saved) e.currentTarget.style.background = "#4f46e5" }}
              onMouseLeave={(e) => { if (!saving && !saved) e.currentTarget.style.background = isArchived ? "#334155" : "#6366f1" }}
            >
              <Save size={14} />
              {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Banners ── */}
      {isArchived && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#f87171", fontSize: 13,
        }}>
          <AlertTriangle size={15} />
          This job order is archived. Archived on <strong style={{ margin: "0 4px" }}>{record.deletedAt}</strong>.
        </div>
      )}
      {status === "Completed" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#34d399", fontSize: 13,
        }}>
          <CheckCircle2 size={15} />
          This job order is <strong style={{ margin: "0 4px" }}>Completed</strong>. No further edits allowed.
        </div>
      )}

      {/* ── Main Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* ── Left Column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Job Info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Job Information</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Project Title",    value: record.projectTitle },
                { label: "Technician",       value: record.technician ?? "Unassigned" },
                { label: "Start Date",       value: record.startDate ?? "—" },
                { label: "Expected Finish",  value: record.expectedFinish ?? "—" },
                { label: "Completed At",     value: record.completedAt ?? "—" },
                { label: "Assigned By",      value: record.assignedBy ?? "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13.5, color: "#e2e8f0" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Items & Services Table */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <SectionLabel>Items & Services Used</SectionLabel>
              <div style={{ display: "flex", gap: 12, marginTop: -6 }}>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 5,
                  background: "rgba(100,116,139,0.15)", color: "#94a3b8",
                }}>
                  Grayed = from Quotation (read-only)
                </span>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 5,
                  background: "rgba(99,102,241,0.12)", color: "#818cf8",
                }}>
                  White = added by Technician
                </span>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {["Item / Part", "Description", "Qty", "Unit Price", "Total", "Source"].map((h, i) => (
                    <th key={i} style={{
                      padding: "9px 16px",
                      textAlign: i >= 2 && i <= 4 ? "right" : i === 5 ? "center" : "left",
                      fontSize: 11, fontWeight: 600, color: "#475569",
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {record.items.map((item, idx) => {
                  const isQuotation = item.source === "Quotation"
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: idx < record.items.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                        background: isQuotation ? "rgba(255,255,255,0.015)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "10px 16px", fontSize: 13, color: isQuotation ? "#94a3b8" : "#e2e8f0" }}>
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
                      <td style={{ padding: "10px 16px", textAlign: "center" }}>
                        <span style={{
                          fontSize: 10.5, fontWeight: 500, padding: "2px 8px", borderRadius: 5,
                          background: isQuotation ? "rgba(100,116,139,0.15)" : "rgba(99,102,241,0.12)",
                          color: isQuotation ? "#64748b" : "#818cf8",
                        }}>
                          {item.source}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Cost Summary */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 22px", display: "flex", justifyContent: "flex-end",
            }}>
              <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>Quotation Subtotal</span>
                  <span style={{ fontSize: 12.5, color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>{fmt(quotationSub)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>Technician Added</span>
                  <span style={{ fontSize: 12.5, color: "#818cf8", fontVariantNumeric: "tabular-nums" }}>{fmt(techSub)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>Diagnostic Fee (10%)</span>
                  <span style={{ fontSize: 12.5, color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>{fmt(diagnosticFee)}</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10,
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
            <SectionLabel>Technician Notes / Findings</SectionLabel>
            <div style={{
              background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8, padding: "14px 16px",
              fontSize: 13, color: "#94a3b8", lineHeight: 1.7,
              fontStyle: record.technicianNotes ? "normal" : "italic",
              whiteSpace: "pre-line",
            }}>
              {record.technicianNotes || "No notes recorded yet."}
            </div>
            <p style={{ fontSize: 11.5, color: "#334155", margin: "8px 0 0" }}>
              Read-only — updated by the assigned technician.
            </p>
          </div>

          {/* Scope of Work — collapsible */}
          <CollapsibleSection title="Scope of Work (Reference)">
            <div style={{ paddingTop: 16 }}>
              {record.scopes.length === 0 ? (
                <p style={{ fontSize: 13, color: "#475569" }}>No scope defined.</p>
              ) : record.scopes.map((sc, i) => (
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

          {/* Waiver — collapsible */}
          <CollapsibleSection title="Waiver of Liability (Reference)">
            <div style={{ paddingTop: 16 }}>
              {record.waivers.length === 0 ? (
                <p style={{ fontSize: 13, color: "#475569" }}>No waiver information.</p>
              ) : record.waivers.map((w, i) => (
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

          {/* Completion Signatures — shown when PendingReview or Completed */}
          {showSignatures && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 12, padding: "22px 24px",
            }}>
              <SectionLabel>Completion Confirmation</SectionLabel>
              <p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 18, marginTop: -6 }}>
                By signing below, both parties confirm all listed services were rendered as agreed.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {[
                  { role: "Customer / Authorized Representative", nameVal: record.customerName,   sigVal: record.customerSignature,    dateVal: record.customerDate },
                  { role: "Technician",                           nameVal: record.technician ?? "",sigVal: record.technicianSignature,  dateVal: record.technicianDate },
                ].map(({ role, nameVal, sigVal, dateVal }) => (
                  <div key={role}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#818cf8", marginBottom: 12 }}>{role}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Name</div>
                        <div style={{ fontSize: 13, color: "#e2e8f0" }}>{nameVal || "—"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Signature / eSign</div>
                        <div style={{
                          background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, padding: "8px 12px", fontSize: 13,
                          color: sigVal ? "#e2e8f0" : "#334155", fontStyle: sigVal ? "normal" : "italic",
                          minHeight: 36,
                        }}>
                          {sigVal || "Not yet signed"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Date</div>
                        <div style={{ fontSize: 13, color: "#e2e8f0" }}>{dateVal || "—"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Activity Timeline</SectionLabel>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
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

            {/* Add Note */}
            {!isArchived && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: "#64748b", marginBottom: 10 }}>
                  Add internal note
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write an internal note or update…"
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
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
                  >
                    <Send size={13} /> Post Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Linked Records */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Linked Records</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Quotation",  ref: record.quotationRef, path: `/admin/quotations/${record.quotationRef}`, color: "#818cf8" },
                { label: "Inquiry",    ref: record.inquiryRef,   path: `/admin/inquiries/${record.inquiryRef}`,   color: "#60a5fa" },
              ].map(({ label, ref, path, color }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8, padding: "10px 14px", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = color + "44")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color }}>{ref}</div>
                  </div>
                  <Link2 size={13} color={color} />
                </button>
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
                {record.customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{record.customer.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Customer</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <MetaRow icon={<Send   size={12} color="#818cf8" />} label="Email"   value={record.customer.email}   />
              <MetaRow icon={<Wrench size={12} color="#818cf8" />} label="Phone"   value={record.customer.phone}   />
              <MetaRow icon={<User   size={12} color="#818cf8" />} label="Address" value={record.customer.address} />
            </div>
          </div>

          {/* Assignment */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Assignment</SectionLabel>
            {record.technician ? (
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(245,158,11,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#fbbf24", flexShrink: 0,
                }}>
                  {record.technician.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{record.technician}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    Assigned by {record.assignedBy ?? "—"}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                padding: "12px", background: "#0f172a", borderRadius: 8,
                fontSize: 13, color: "#475569", fontStyle: "italic", marginBottom: 14, textAlign: "center",
              }}>
                No technician assigned
              </div>
            )}
            {!isFinal && !isArchived && (
              <button style={{
                width: "100%", background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                padding: "8px", color: "#94a3b8", fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <UserCheck size={13} /> {record.technician ? "Reassign" : "Assign Technician"}
              </button>
            )}
          </div>

          {/* Dates / Record Info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Record Info</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <MetaRow icon={<Calendar     size={12} color="#818cf8" />} label="Created"          value={record.createdAt} />
              <MetaRow icon={<Clock        size={12} color="#fbbf24" />} label="Last Updated"     value={record.updatedAt} />
              {record.startDate     && <MetaRow icon={<Wrench size={12} color="#60a5fa" />} label="Started"           value={record.startDate} />}
              {record.expectedFinish && <MetaRow icon={<Calendar size={12} color="#94a3b8" />} label="Expected Finish" value={record.expectedFinish} />}
              {record.completedAt   && <MetaRow icon={<CheckCircle2 size={12} color="#34d399" />} label="Completed" value={record.completedAt} />}
              {record.deletedAt     && <MetaRow icon={<Trash2 size={12} color="#f87171" />} label="Archived"         value={record.deletedAt} />}
            </div>
          </div>

          {/* Deliverables */}
          {record.deliverables.length > 0 && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "20px 22px",
            }}>
              <SectionLabel>Expected Deliverables</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {record.deliverables.map((d, i) => (
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

          {/* Danger Zone */}
          {!isArchived && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(248,113,113,0.15)",
              borderRadius: 12, padding: "20px 22px",
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: "#f87171",
                textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 10,
              }}>
                Danger Zone
              </div>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 14px", lineHeight: 1.6 }}>
                Archiving removes this job order from active workflows. Restorable at any time.
              </p>
              <button
                onClick={() => setConfirmArchive(true)}
                style={{
                  width: "100%", background: "transparent",
                  border: "1px solid rgba(248,113,113,0.25)",
                  borderRadius: 8, padding: "8px", color: "#f87171", fontSize: 13, cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Archive Job Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
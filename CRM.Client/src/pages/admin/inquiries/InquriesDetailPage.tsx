import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, User, Mail, Phone, MapPin, Wrench,
  Calendar, Clock, CheckCircle2, AlertCircle,
  ChevronDown, Send, Paperclip, Edit2, Trash2, MessageSquare, Loader2, Star, X
} from "lucide-react"
import api from "../../../api/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "Pending" | "Acknowledged" | "InProgress" | "Completed" | "Cancelled"

interface TechnicianOption {
  id: number
  specialization: string
  isAvailable: boolean
  averageRating: number
  totalReviews: number
  user: {
    id: number
    name: string
    email: string
  }
}

interface InquiryDetail {
  id: number
  status: Status
  urgency: string
  createdAt: string
  updatedAt: string
  serviceAddress: string
  customer: {
    id: number
    name: string
    email: string
    phoneNumber: string
  } | null
  guest: {
    id: number
    name: string
    email: string
    phoneNumber: string
  } | null
  inquiryItems: {
    id: number
    serviceCategoryId: number | null
    serviceCategory: { id: number; name: string } | null
    serviceId: number | null
    preferredDate: string | null
    preferredTime: string | null
    issueDescription: string
    inquiryTechnicalDetails: {
      id: number
      customerDeviceId: number | null
      deviceModelId: number | null
      technician: {
        id: number
        specialization: string
        isAvailable: boolean
        averageRating: number
        totalReviews: number
        user: {
          id: number
          name: string
          email: string
        }
      } | null
    }[]
  }[]
}

interface TimelineEvent {
  id:      number
  type:    "status" | "note" | "assignment" | "system"
  actor:   string
  content: string
  time:    string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: Status[] = ["Pending", "Acknowledged", "InProgress", "Completed", "Cancelled"]

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  "Pending":      { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  "Acknowledged": { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
  "InProgress":   { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  "Completed":    { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  "Cancelled":    { bg: "rgba(100,116,139,0.15)", color: "#64748b" },
}

const STATUS_LABEL: Record<Status, string> = {
  "Pending":      "Pending",
  "Acknowledged": "Acknowledged",
  "InProgress":   "In Progress",
  "Completed":    "Completed",
  "Cancelled":    "Cancelled",
}

const URGENCY_STYLE: Record<string, { bg: string; color: string }> = {
  "Urgent":   { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  "Normal":   { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24" },
  "Flexible": { bg: "rgba(16,185,129,0.12)",  color: "#34d399" },
}

const TIMELINE_ICON: Record<TimelineEvent["type"], React.ReactNode> = {
  status:     <CheckCircle2 size={14} color="#34d399" />,
  note:       <Edit2        size={14} color="#818cf8" />,
  assignment: <User         size={14} color="#fbbf24" />,
  system:     <AlertCircle  size={14} color="#475569" />,
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminInquiryDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [inq,             setInq]             = useState<InquiryDetail | null>(null)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState<string | null>(null)
  const [status,          setStatus]          = useState<Status>("Pending")
  const [statusOpen,      setStatusOpen]      = useState(false)
  const [note,            setNote]            = useState("")
  const [timeline,        setTimeline]        = useState<TimelineEvent[]>([])
  const [saving,          setSaving]          = useState(false)
  const [technicians,     setTechnicians]     = useState<TechnicianOption[]>([])
  const [techLoading,     setTechLoading]     = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<number | null>(null)

  // ── Derive early so handlers can reference them ────────────────────────────
  const firstItem          = inq?.inquiryItems?.[0]
  const firstDetail        = firstItem?.inquiryTechnicalDetails?.[0]
  const assignedTechnician = firstDetail?.technician ?? null
  const technicalDetailId  = firstDetail?.id

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return

    setLoading(true)
    api.get(`/inquiries/${id}`)
      .then(res => {
        const data: InquiryDetail = res.data
        console.log("[InquiryDetail] full response:", data)
        console.log("[InquiryDetail] inquiryItems:", data.inquiryItems)
        console.log("[InquiryDetail] firstItem:", data.inquiryItems?.[0])
        console.log("[InquiryDetail] inquiryTechnicalDetails:", data.inquiryItems?.[0]?.inquiryTechnicalDetails)
        setInq(data)
        setStatus(data.status)
        setTimeline([{
          id:      1,
          type:    "system",
          actor:   "System",
          content: `Inquiry INQ-${data.id} was created.`,
          time:    fmtDateTime(data.createdAt),
        }])
      })
      .catch(() => setError("Failed to load inquiry."))
      .finally(() => setLoading(false))

    setTechLoading(true)
    api.get("/technicians")
      .then(res => setTechnicians(res.data))
      .catch(err => console.error(err))
      .finally(() => setTechLoading(false))
  }, [id])

  // ── Add Note ───────────────────────────────────────────────────────────────
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

  // ── Change Status ──────────────────────────────────────────────────────────
  const changeStatus = async (s: Status) => {
    setStatusOpen(false)
    setSaving(true)
    try {
      await api.patch(`/inquiries/${id}/status`, { status: s })
      setStatus(s)
      setTimeline(prev => [...prev, {
        id:      prev.length + 1,
        type:    "status",
        actor:   "Admin",
        content: `Status changed to ${STATUS_LABEL[s]}.`,
        time:    "Just now",
      }])
    } catch {
      alert("Failed to update status.")
    } finally {
      setSaving(false)
    }
  }

  // ── Assign / Reassign Technician ───────────────────────────────────────────
  const assignTechnician = async () => {
    if (!selectedTechnician || !inq) return

    const isReassign    = !!assignedTechnician
    const inquiryItemId = firstItem?.id

    if (!inquiryItemId) {
      alert("No inquiry item found.")
      return
    }

    try {
      const newTechnician = technicians.find(t => t.id === selectedTechnician) ?? null
      let newDetailId = technicalDetailId

      if (isReassign) {
        // Reassign: PUT /api/inquiry-technical-details/{technicalDetailId}/reassign-technician
        if (!technicalDetailId) {
          alert("No inquiry technical detail found.")
          return
        }
        await api.put(`/inquiry-technical-details/${technicalDetailId}/reassign-technician`, { technicianId: selectedTechnician })
      } else {
        // First assign: no detail record exists yet
        // Step 1 — create the InquiryTechnicalDetail record
        const created = await api.post(`/inquiry-technical-details`, {
          technicianId: selectedTechnician,
          inquiryItemId,
          diagnoses: [],
        })
        newDetailId = created.data.id

        // Step 2 — assign the technician to the newly created detail
        await api.put(`/inquiry-technical-details/${newDetailId}/assign-technician`, { technicianId: selectedTechnician })
      }

      // Optimistically update nested technician in state
      setInq(prev => {
        if (!prev) return prev
        return {
          ...prev,
          inquiryItems: prev.inquiryItems.map((item, itemIdx) => {
            if (itemIdx !== 0) return item
            const updatedDetails = isReassign
              ? item.inquiryTechnicalDetails.map((detail, detailIdx) =>
                  detailIdx !== 0 ? detail : { ...detail, technician: newTechnician }
                )
              : [{ id: newDetailId ?? 0, customerDeviceId: null, deviceModelId: null, technician: newTechnician }]
            return { ...item, inquiryTechnicalDetails: updatedDetails }
          }),
        }
      })

      setTimeline(prev => [...prev, {
        id:      prev.length + 1,
        type:    "assignment",
        actor:   "Admin",
        content: isReassign ? "Technician reassigned." : "Technician assigned.",
        time:    "Just now",
      }])

      setAssignModalOpen(false)
      setSelectedTechnician(null)
    } catch {
      alert(isReassign ? "Failed to reassign technician." : "Failed to assign technician.")
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm("Delete this inquiry?")) return
    try {
      await api.delete(`/inquiries/${id}`)
      navigate("/admin/inquiries")
    } catch {
      alert("Failed to delete inquiry.")
    }
  }

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={24} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
    </div>
  )

  if (error || !inq) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", fontSize: 14 }}>
      {error ?? "Inquiry not found."}
    </div>
  )

  // ── Render ─────────────────────────────────────────────────────────────────
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
          style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", padding: "0 0 12px" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Inquiries
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>
                INQ-{inq.id}
              </h1>
              <span style={{
                display: "inline-block", padding: "3px 12px", borderRadius: 20,
                fontSize: 12, fontWeight: 500,
                background: STATUS_STYLE[status].bg,
                color:      STATUS_STYLE[status].color,
              }}>
                {STATUS_LABEL[status]}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: "5px 0 0" }}>
              Created {fmtDateTime(inq.createdAt)}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => navigate(`/admin/tickets/${inq.id}`)}
              style={{
                background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)",
                color: "#e2e8f0", cursor: "pointer", padding: "8px 12px",
                borderRadius: 8, display: "flex", alignItems: "center", gap: 7, fontSize: 13,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1e293b" }}
            >
              View Conversation <MessageSquare size={14} />
            </button>

            {/* Status Dropdown */}
            <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setStatusOpen(o => !o)}
                disabled={saving}
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
                  borderRadius: 10, overflow: "hidden", minWidth: 170,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}>
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => changeStatus(s)} style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "10px 16px",
                      background: s === status ? "rgba(99,102,241,0.12)" : "transparent",
                      border: "none", color: s === status ? "#818cf8" : "#94a3b8",
                      fontSize: 13, cursor: "pointer",
                    }}
                      onMouseEnter={e => { if (s !== status) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                      onMouseLeave={e => { if (s !== status) e.currentTarget.style.background = "transparent" }}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleDelete}
              style={{
                background: "transparent", border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: 8, padding: "8px 10px", color: "#f87171",
                cursor: "pointer", display: "flex", alignItems: "center",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
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
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px 24px" }}>
            <SectionLabel>Service Details</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <InfoRow icon={<Wrench size={14} color="#818cf8" />}
                label="Service Category"
                value={firstItem?.serviceCategory?.name ?? "—"} />
              <InfoRow icon={<AlertCircle size={14} color="#f87171" />}
                label="Urgency"
                value={
                  <span style={{
                    padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: URGENCY_STYLE[inq.urgency]?.bg ?? "rgba(255,255,255,0.06)",
                    color:      URGENCY_STYLE[inq.urgency]?.color ?? "#94a3b8",
                  }}>
                    {inq.urgency}
                  </span>
                }
              />
              <InfoRow icon={<Calendar size={14} color="#60a5fa" />}
                label="Preferred Date"
                value={firstItem?.preferredDate && firstItem.preferredDate !== "0001-01-01"
                  ? fmtDate(firstItem.preferredDate) : "—"} />
              <InfoRow icon={<Clock size={14} color="#fbbf24" />}
                label="Preferred Time"
                value={firstItem?.preferredTime && firstItem.preferredTime !== "00:00:00"
                  ? firstItem.preferredTime : "—"} />
              <InfoRow icon={<MapPin size={14} color="#34d399" />}
                label="Service Address"
                value={inq.serviceAddress || "—"} />
            </div>

            {/* Issue Description */}
            {firstItem?.issueDescription && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Issue Description</div>
                <p style={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                  {firstItem.issueDescription}
                </p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px 24px" }}>
            <SectionLabel>Activity Timeline</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 20 }}>
              {timeline.map((event, i) => (
                <div key={event.id} style={{ display: "flex", gap: 14 }}>
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
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 10 }}>Add a note</div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
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
                  borderRadius: 7, padding: "7px 13px", color: "#64748b", fontSize: 13, cursor: "pointer",
                }}>
                  <Paperclip size={13} /> Attach
                </button>
                <button onClick={addNote} style={{
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
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Customer Info */}
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px 24px" }}>
            <SectionLabel>Customer</SectionLabel>
            {inq.customer ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 18px" }}>
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
                  <InfoRow icon={<Mail  size={13} color="#818cf8" />} label="Email"   value={inq.customer.email}       small />
                  <InfoRow icon={<Phone size={13} color="#818cf8" />} label="Phone"   value={inq.customer.phoneNumber} small />
                  <InfoRow icon={<MapPin size={13} color="#818cf8" />} label="Address" value={inq.serviceAddress || "—"} small />
                </div>
              </>
            ) : inq.guest ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 18px" }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "rgba(245,158,11,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: "#fbbf24", flexShrink: 0,
                  }}>
                    {inq.guest.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{inq.guest.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Walk-in / Guest</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <InfoRow icon={<Mail  size={13} color="#fbbf24" />} label="Email"   value={inq.guest.email || "—"}       small />
                  <InfoRow icon={<Phone size={13} color="#fbbf24" />} label="Phone"   value={inq.guest.phoneNumber || "—"} small />
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: "#475569", marginTop: 12, fontStyle: "italic" }}>
                Walk-in / Guest — no customer profile linked.
              </div>
            )}
          </div>

          {/* Assigned Technician */}
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px 24px" }}>
            <SectionLabel>Assigned Technician</SectionLabel>

            {assignedTechnician ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, marginBottom: 18 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%",
                    background: "rgba(99,102,241,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: "#818cf8", flexShrink: 0,
                  }}>
                    {assignedTechnician.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>
                      {assignedTechnician.user.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {assignedTechnician.specialization}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <InfoRow icon={<Mail size={13} color="#818cf8" />}         label="Email"        value={assignedTechnician.user.email}                      small />
                  <InfoRow icon={<Star size={13} color="#facc15" />}         label="Rating"       value={`${assignedTechnician.averageRating.toFixed(1)} ⭐`} small />
                  <InfoRow icon={<CheckCircle2 size={13} color="#34d399" />} label="Availability" value={
                    <span style={{ color: assignedTechnician.isAvailable ? "#34d399" : "#f87171" }}>
                      {assignedTechnician.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  } small />
                </div>
                <button
                  onClick={() => setAssignModalOpen(true)}
                  style={{
                    width: "100%", marginTop: 18,
                    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: 8, padding: "9px", color: "#818cf8", fontSize: 13, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.12)")}
                >
                  Reassign Technician
                </button>
              </>
            ) : (
              <>
                <div style={{ marginTop: 16, fontSize: 13, color: "#475569", fontStyle: "italic", marginBottom: 16 }}>
                  No technician assigned yet.
                </div>
                <button
                  onClick={() => setAssignModalOpen(true)}
                  style={{
                    width: "100%", background: "transparent",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "8px", color: "#94a3b8", fontSize: 13, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  Assign Technician
                </button>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px 24px" }}>
            <SectionLabel>Quick Actions</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
              {[
                { label: "Create Quotation",     color: "#6366f1", onClick: () => navigate(`/admin/quotations/create?inquiryId=${inq.id}`) },
                { label: "Convert to Job Order", color: "#3b82f6", onClick: () => navigate(`/admin/job-orders/create?inquiryId=${inq.id}`) },
                { label: "Send to Customer",     color: "#10b981" },
              ].map(({ label, color, onClick }) => (
                <button key={label} onClick={onClick} style={{
                  width: "100%", background: color + "18",
                  border: `1px solid ${color}33`, borderRadius: 8,
                  padding: "9px 14px", color, fontSize: 13,
                  fontWeight: 500, cursor: "pointer", textAlign: "left",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = color + "28")}
                  onMouseLeave={e => (e.currentTarget.style.background = color + "18")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Technician Modal */}
      {assignModalOpen && (
        <div
          onClick={() => setAssignModalOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 420, background: "#1e293b", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)", padding: 22,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>
                  {assignedTechnician ? "Reassign Technician" : "Assign Technician"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>Inquiry #{inq.id}</div>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 320, overflowY: "auto" }}>
              {techLoading ? (
                <div style={{ color: "#64748b", fontSize: 13 }}>Loading technicians...</div>
              ) : technicians.length === 0 ? (
                <div style={{ color: "#64748b", fontSize: 13, fontStyle: "italic" }}>No technicians found.</div>
              ) : (
                technicians.map(tech => {
                  const isSelected = selectedTechnician === tech.id
                  const isCurrent  = assignedTechnician?.id === tech.id
                  return (
                    <div
                      key={tech.id}
                      onClick={() => tech.isAvailable && setSelectedTechnician(tech.id)}
                      style={{
                        padding: "12px 14px", borderRadius: 10,
                        border: isSelected ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.06)",
                        background: isSelected ? "rgba(99,102,241,0.1)" : "#0f172a",
                        cursor: tech.isAvailable ? "pointer" : "not-allowed",
                        opacity: tech.isAvailable ? 1 : 0.45,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f8fafc", display: "flex", alignItems: "center", gap: 8 }}>
                          {tech.user.name}
                          {isCurrent && (
                            <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 999, background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                              Current
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{tech.specialization}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 12, color: "#facc15", marginBottom: 4 }}>★ {tech.averageRating.toFixed(1)}</div>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                          background: tech.isAvailable ? "rgba(52,211,153,0.12)" : "rgba(239,68,68,0.12)",
                          color:      tech.isAvailable ? "#34d399" : "#f87171",
                        }}>
                          {tech.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <button
              onClick={assignTechnician}
              disabled={!selectedTechnician}
              style={{
                width: "100%", marginTop: 18,
                background: selectedTechnician ? "#6366f1" : "rgba(99,102,241,0.25)",
                border: "none", borderRadius: 10, padding: "10px",
                color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: selectedTechnician ? "pointer" : "not-allowed",
              }}
            >
              {assignedTechnician ? "Confirm Reassignment" : "Confirm Assignment"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>
      {children}
    </div>
  )
}

function InfoRow({ icon, label, value, small = false }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; small?: boolean
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
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, Megaphone, Save, Trash2, RotateCcw,
  ChevronDown, AlertTriangle, CheckCircle2, Send,
  Users, Tag, Plus, X, Calendar, Clock, User,
  Mail, Percent, DollarSign, Eye, EyeOff,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type CampaignChannel  = "Email" | "SMS" | "InApp"
type CampaignStatus   = "Draft" | "Scheduled" | "Sent"
type DiscountType     = "Fixed" | "Percentage"

interface CampaignTarget {
  id:         number
  campaignId: number
  customerId: number
  name:       string    // from Customer nav prop
  email:      string    // from Customer nav prop
  isSent:     boolean
  sentAt:     string | null
  createdAt:  string
}

interface PromoCode {
  id:            number
  campaignId:    number | null
  code:          string
  discountType:  DiscountType
  discountValue: number
  validFrom:     string
  validUntil:    string
  maxUses:       number
  usedCount:     number
  createdAt:     string
  deletedAt:     string | null
}

interface CampaignRecord {
  id:             number
  createdBy:      string
  title:          string
  message:        string
  channel:        CampaignChannel
  status:         CampaignStatus
  scheduledAt:    string
  createdAt:      string
  updatedAt:      string
  deletedAt:      string | null
  targets:        CampaignTarget[]
  promoCodes:     PromoCode[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_RECORD: CampaignRecord = {
  id:          2,
  createdBy:   "James Alcantara",
  title:       "Loyalty Reward — Q2 2026",
  message:     "Dear {{customer_name}},\n\nThank you for your continued trust in Techne Fixer Computer and Laptop Repair Services.\n\nAs a token of our appreciation, we're giving you an exclusive loyalty discount on your next service booking. Use the promo code below when you book your next repair or maintenance visit.\n\nWe look forward to serving you again!\n\n— The Techne Fixer Team",
  channel:     "Email",
  status:      "Scheduled",
  scheduledAt: "2026-05-22T10:00",
  createdAt:   "May 5, 2026 — 11:00 AM",
  updatedAt:   "May 5, 2026 — 11:00 AM",
  deletedAt:   null,
  targets: [
    { id: 1, campaignId: 2, customerId: 101, name: "Aisha Okonkwo",    email: "aisha.okonkwo@email.com",   isSent: false, sentAt: null,              createdAt: "May 5, 2026" },
    { id: 2, campaignId: 2, customerId: 102, name: "Marco Reyes",      email: "marco.reyes@email.com",      isSent: false, sentAt: null,              createdAt: "May 5, 2026" },
    { id: 3, campaignId: 2, customerId: 103, name: "Lena Torres",      email: "lena.torres@email.com",      isSent: false, sentAt: null,              createdAt: "May 5, 2026" },
    { id: 4, campaignId: 2, customerId: 104, name: "David Chen",       email: "david.chen@email.com",       isSent: false, sentAt: null,              createdAt: "May 5, 2026" },
    { id: 5, campaignId: 2, customerId: 105, name: "Sara Villanueva",  email: "sara.v@email.com",           isSent: false, sentAt: null,              createdAt: "May 5, 2026" },
  ],
  promoCodes: [
    {
      id: 1, campaignId: 2, code: "LOYAL2026",
      discountType: "Percentage", discountValue: 15,
      validFrom: "2026-05-22", validUntil: "2026-06-30",
      maxUses: 50, usedCount: 0,
      createdAt: "May 5, 2026", deletedAt: null,
    },
  ],
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<CampaignStatus, { bg: string; color: string }> = {
  Draft:     { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  Scheduled: { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  Sent:      { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
}

const VALID_TRANSITIONS: Record<CampaignStatus, CampaignStatus[]> = {
  Draft:     ["Scheduled"],
  Scheduled: ["Sent"],
  Sent:      [],
}

const STATUS_LABELS: CampaignStatus[] = ["Draft", "Scheduled", "Sent"]

const fmt = (n: number, type: DiscountType): string =>
  type === "Percentage" ? `${n}%` : `₱${n.toFixed(2)}`

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

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0f172a",
  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
  padding: "8px 12px", color: "#e2e8f0", fontSize: 13,
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminCampaignDetailPage() {
  const navigate = useNavigate()
  useParams<{ id: string }>()

  const [record,         setRecord]         = useState<CampaignRecord>(MOCK_RECORD)
  const [status,         setStatus]         = useState<CampaignStatus>(MOCK_RECORD.status)
  const [statusOpen,     setStatusOpen]     = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [confirmSend,    setConfirmSend]    = useState(false)

  // Editable campaign fields
  const [title,       setTitle]       = useState(MOCK_RECORD.title)
  const [message,     setMessage]     = useState(MOCK_RECORD.message)
  const [scheduledAt, setScheduledAt] = useState(MOCK_RECORD.scheduledAt)

  // Targets
  const [targets,      setTargets]      = useState<CampaignTarget[]>(MOCK_RECORD.targets)
  const [newTargetName, setNewTargetName] = useState("")
  const [newTargetEmail,setNewTargetEmail] = useState("")
  const [showAddTarget, setShowAddTarget] = useState(false)

  // Promo codes
  const [promoCodes,      setPromoCodes]      = useState<PromoCode[]>(MOCK_RECORD.promoCodes)
  const [showAddPromo,    setShowAddPromo]     = useState(false)
  const [newCode,         setNewCode]         = useState("")
  const [newDiscountType, setNewDiscountType] = useState<DiscountType>("Percentage")
  const [newDiscountVal,  setNewDiscountVal]  = useState("")
  const [newValidFrom,    setNewValidFrom]    = useState("")
  const [newValidUntil,   setNewValidUntil]   = useState("")
  const [newMaxUses,      setNewMaxUses]      = useState("")
  const [showMessage,     setShowMessage]     = useState(true)

  // ── Derived ──
  const isArchived  = record.deletedAt !== null
  const isSent      = status === "Sent"
  const isEditable  = status === "Draft" && !isArchived
  const sentCount   = targets.filter(t => t.isSent).length
  const pendingCount= targets.length - sentCount

  // ── Handlers ──
  const changeStatus = (s: CampaignStatus) => {
    if (!VALID_TRANSITIONS[status].includes(s)) return
    setStatus(s)
    setStatusOpen(false)
    setRecord(r => ({ ...r, updatedAt: "Just now" }))
  }

  const sendNow = () => {
    setTargets(prev => prev.map(t => ({ ...t, isSent: true, sentAt: "Just now" })))
    setStatus("Sent")
    setRecord(r => ({ ...r, updatedAt: "Just now" }))
    setConfirmSend(false)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setRecord(r => ({ ...r, title, message, scheduledAt, updatedAt: "Just now" }))
      setSaving(false); setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    }, 700)
  }

  const handleArchive = () => {
    setRecord(r => ({ ...r, deletedAt: "Just now" }))
    setConfirmArchive(false)
  }

  const addTarget = () => {
    if (!newTargetName.trim() || !newTargetEmail.trim()) return
    const newId = Math.max(0, ...targets.map(t => t.id)) + 1
    setTargets(prev => [...prev, {
      id: newId, campaignId: record.id, customerId: newId + 200,
      name: newTargetName.trim(), email: newTargetEmail.trim(),
      isSent: false, sentAt: null, createdAt: "Just now",
    }])
    setNewTargetName(""); setNewTargetEmail(""); setShowAddTarget(false)
  }

  const removeTarget = (id: number) =>
    setTargets(prev => prev.filter(t => t.id !== id))

  const addPromoCode = () => {
    if (!newCode.trim() || !newDiscountVal || !newValidFrom || !newValidUntil || !newMaxUses) return
    const newId = Math.max(0, ...promoCodes.map(p => p.id)) + 1
    setPromoCodes(prev => [...prev, {
      id: newId, campaignId: record.id,
      code:          newCode.trim().toUpperCase(),
      discountType:  newDiscountType,
      discountValue: parseFloat(newDiscountVal),
      validFrom:     newValidFrom,
      validUntil:    newValidUntil,
      maxUses:       parseInt(newMaxUses),
      usedCount:     0,
      createdAt:     "Just now",
      deletedAt:     null,
    }])
    setNewCode(""); setNewDiscountVal(""); setNewValidFrom("")
    setNewValidUntil(""); setNewMaxUses(""); setShowAddPromo(false)
  }

  const removePromoCode = (id: number) =>
    setPromoCodes(prev => prev.filter(p => p.id !== id))

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
          onClick={() => navigate("/admin/campaigns")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Campaigns
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: "rgba(99,102,241,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Megaphone size={18} color="#818cf8" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                  CAMP-{String(record.id).padStart(3, "0")}
                </h1>
                <span style={{
                  display: "inline-block", padding: "3px 12px", borderRadius: 20,
                  fontSize: 12, fontWeight: 500,
                  background: STATUS_STYLE[status].bg, color: STATUS_STYLE[status].color,
                }}>
                  {status}
                </span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 10px", borderRadius: 20,
                  background: "rgba(99,102,241,0.12)", color: "#818cf8",
                  fontSize: 11.5, fontWeight: 500,
                }}>
                  <Mail size={11} /> {record.channel}
                </span>
                {isArchived && (
                  <span style={{
                    padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: "rgba(248,113,113,0.1)", color: "#f87171",
                  }}>Archived</span>
                )}
              </div>
              <p style={{ fontSize: 12.5, color: "#475569", margin: "3px 0 0" }}>
                {record.title}
                {record.updatedAt && ` · Updated ${record.updatedAt}`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

            {/* Status dropdown */}
            {!isArchived && !isSent && (
              <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
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
                    borderRadius: 10, overflow: "hidden", minWidth: 155,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}>
                    {STATUS_LABELS.map(s => {
                      const allowed   = VALID_TRANSITIONS[status].includes(s)
                      const isCurrent = s === status
                      return (
                        <button
                          key={s}
                          onClick={() => allowed && changeStatus(s)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            width: "100%", textAlign: "left", padding: "10px 16px",
                            background: isCurrent ? "rgba(99,102,241,0.12)" : "transparent",
                            border: "none",
                            color: isCurrent ? "#818cf8" : allowed ? "#94a3b8" : "#334155",
                            fontSize: 13, cursor: allowed ? "pointer" : "not-allowed",
                            opacity: allowed || isCurrent ? 1 : 0.4,
                          }}
                          onMouseEnter={e => { if (allowed && !isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                          onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = "transparent" }}
                        >
                          <span>{s}</span>
                          {isCurrent && <span style={{ fontSize: 10, color: "#475569" }}>current</span>}
                          {!isCurrent && !allowed && <span style={{ fontSize: 10, color: "#334155" }}>locked</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

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
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Trash2 size={15} />
                </button>
              )
            ) : (
              <button
                onClick={() => setRecord(r => ({ ...r, deletedAt: null }))}
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
              disabled={saving || isArchived || isSent}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: saved ? "#059669" : saving || isArchived || isSent ? "#334155" : "#6366f1",
                border: "none", borderRadius: 8, padding: "8px 18px",
                color: "#fff", fontSize: 13, fontWeight: 500,
                cursor: saving || isArchived || isSent ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (!saving && !isArchived && !isSent && !saved) (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5" }}
              onMouseLeave={e => { if (!saving && !saved) (e.currentTarget as HTMLButtonElement).style.background = isArchived || isSent ? "#334155" : "#6366f1" }}
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
          This campaign is archived. Archived on <strong style={{ margin: "0 4px" }}>{record.deletedAt}</strong>.
        </div>
      )}
      {isSent && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#34d399", fontSize: 13,
        }}>
          <CheckCircle2 size={15} />
          Campaign has been <strong style={{ margin: "0 4px" }}>sent</strong> to {sentCount} recipients. No further edits allowed.
        </div>
      )}
      {status === "Scheduled" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#60a5fa", fontSize: 13,
        }}>
          <Calendar size={15} />
          Scheduled to send on <strong style={{ margin: "0 4px" }}>{record.scheduledAt || scheduledAt}</strong> to {targets.length} recipient{targets.length !== 1 ? "s" : ""}.
        </div>
      )}

      {/* ── Main Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Campaign Info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Campaign Details</SectionLabel>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                Title
              </label>
              {isEditable ? (
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={inputStyle}
                />
              ) : (
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>{title}</div>
              )}
            </div>

            {/* Channel (read-only) */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                Channel
              </label>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 8,
                background: "rgba(99,102,241,0.12)", color: "#818cf8",
                fontSize: 13, fontWeight: 500,
              }}>
                <Mail size={13} /> {record.channel}
              </span>
            </div>

            {/* Scheduled At */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                Scheduled At
              </label>
              {!isSent ? (
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  disabled={isSent}
                  style={{ ...inputStyle, opacity: isSent ? 0.5 : 1 }}
                />
              ) : (
                <div style={{ fontSize: 13, color: "#94a3b8" }}>{record.scheduledAt}</div>
              )}
            </div>

            {/* Message */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                  Message Body
                </label>
                <button
                  onClick={() => setShowMessage(v => !v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: "transparent", border: "none",
                    color: "#475569", fontSize: 11.5, cursor: "pointer", padding: 0,
                  }}
                >
                  {showMessage ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showMessage ? "Hide" : "Show"}
                </button>
              </div>
              {showMessage && (
                <>
                  {isEditable ? (
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={8}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
                    />
                  ) : (
                    <div style={{
                      background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8, padding: "14px 16px",
                      fontSize: 13, color: "#94a3b8", lineHeight: 1.7,
                      whiteSpace: "pre-line",
                    }}>
                      {message}
                    </div>
                  )}
                  <p style={{ fontSize: 11.5, color: "#334155", margin: "6px 0 0" }}>
                    Available variables: <code style={{ color: "#818cf8" }}>{"{{customer_name}}"}</code>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Target Audience */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div>
                <SectionLabel>Target Audience</SectionLabel>
                <div style={{ fontSize: 12, color: "#475569", marginTop: -10 }}>
                  {targets.length} recipient{targets.length !== 1 ? "s" : ""}
                  {isSent && ` · ${sentCount} sent · ${pendingCount} pending`}
                </div>
              </div>
              {!isSent && !isArchived && !showAddTarget && (
                <button
                  onClick={() => setShowAddTarget(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: 8, padding: "6px 12px",
                    color: "#818cf8", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.18)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
                >
                  <Plus size={13} /> Add Target
                </button>
              )}
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {(["Customer", "Email", "Status", ""] as string[]).map((h, i) => (
                    <th key={i} style={{
                      padding: "9px 16px", textAlign: "left",
                      fontSize: 11, fontWeight: 600, color: "#475569",
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {targets.map((t, idx) => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: idx < targets.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                  >
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: "rgba(99,102,241,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700, color: "#818cf8", flexShrink: 0,
                        }}>
                          {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span style={{ fontSize: 13, color: "#e2e8f0" }}>{t.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12.5, color: "#64748b" }}>
                      {t.email}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      {t.isSent ? (
                        <span style={{
                          fontSize: 11, padding: "2px 8px", borderRadius: 6,
                          background: "rgba(16,185,129,0.12)", color: "#34d399", fontWeight: 500,
                        }}>
                          ✓ Sent {t.sentAt ? `· ${t.sentAt}` : ""}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 11, padding: "2px 8px", borderRadius: 6,
                          background: "rgba(100,116,139,0.12)", color: "#64748b", fontWeight: 500,
                        }}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right", width: 40 }}>
                      {!isSent && !isArchived && (
                        <button
                          onClick={() => removeTarget(t.id)}
                          style={{
                            width: 26, height: 26, borderRadius: 6,
                            background: "transparent", border: "1px solid rgba(248,113,113,0.2)",
                            color: "#f87171", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <X size={11} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Add target inline row */}
                {showAddTarget && (
                  <tr style={{ background: "rgba(99,102,241,0.05)", borderTop: "1px solid rgba(99,102,241,0.2)" }}>
                    <td style={{ padding: "8px 12px" }}>
                      <input
                        autoFocus
                        value={newTargetName}
                        onChange={e => setNewTargetName(e.target.value)}
                        placeholder="Customer name"
                        style={{ ...inputStyle, fontSize: 12 }}
                      />
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <input
                        value={newTargetEmail}
                        onChange={e => setNewTargetEmail(e.target.value)}
                        placeholder="Email address"
                        style={{ ...inputStyle, fontSize: 12 }}
                      />
                    </td>
                    <td />
                    <td style={{ padding: "8px 12px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          onClick={addTarget}
                          style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                            color: "#34d399", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <CheckCircle2 size={13} />
                        </button>
                        <button
                          onClick={() => setShowAddTarget(false)}
                          style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                            color: "#f87171", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {targets.length === 0 && !showAddTarget && (
                  <tr>
                    <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#334155", fontSize: 13, fontStyle: "italic" }}>
                      No targets added yet. Add recipients above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Promo Codes */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div>
                <SectionLabel>Promo Codes</SectionLabel>
                <div style={{ fontSize: 12, color: "#475569", marginTop: -10 }}>
                  {promoCodes.length} code{promoCodes.length !== 1 ? "s" : ""} attached to this campaign
                </div>
              </div>
              {!isSent && !isArchived && !showAddPromo && (
                <button
                  onClick={() => setShowAddPromo(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)",
                    borderRadius: 8, padding: "6px 12px",
                    color: "#fbbf24", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(251,191,36,0.18)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(251,191,36,0.1)")}
                >
                  <Plus size={13} /> Add Promo Code
                </button>
              )}
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {(["Code", "Discount", "Valid From", "Valid Until", "Uses", ""] as string[]).map((h, i) => (
                    <th key={i} style={{
                      padding: "9px 16px", textAlign: "left",
                      fontSize: 11, fontWeight: 600, color: "#475569",
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((p, idx) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: idx < promoCodes.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                  >
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        fontFamily: "monospace", fontSize: 13, fontWeight: 700,
                        color: "#fbbf24", letterSpacing: "0.5px",
                      }}>
                        {p.code}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {p.discountType === "Percentage"
                          ? <Percent size={12} color="#34d399" />
                          : <DollarSign size={12} color="#34d399" />
                        }
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#34d399" }}>
                          {fmt(p.discountValue, p.discountType)}
                        </span>
                        <span style={{ fontSize: 11, color: "#475569" }}>{p.discountType}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "#64748b" }}>{p.validFrom}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "#64748b" }}>{p.validUntil}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        <span style={{ color: p.usedCount >= p.maxUses ? "#f87171" : "#94a3b8" }}>
                          {p.usedCount}
                        </span>
                        <span style={{ color: "#334155" }}> / {p.maxUses}</span>
                      </div>
                      {/* Usage bar */}
                      <div style={{
                        marginTop: 4, height: 3, borderRadius: 2,
                        background: "rgba(255,255,255,0.06)", width: 60, overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 2,
                          width: `${Math.min(100, (p.usedCount / p.maxUses) * 100)}%`,
                          background: p.usedCount >= p.maxUses ? "#f87171" : "#34d399",
                        }} />
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right", width: 40 }}>
                      {!isSent && !isArchived && (
                        <button
                          onClick={() => removePromoCode(p.id)}
                          style={{
                            width: 26, height: 26, borderRadius: 6,
                            background: "transparent", border: "1px solid rgba(248,113,113,0.2)",
                            color: "#f87171", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <X size={11} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Add promo inline form */}
                {showAddPromo && (
                  <tr style={{ background: "rgba(251,191,36,0.04)", borderTop: "1px solid rgba(251,191,36,0.2)" }}>
                    <td style={{ padding: "8px 10px" }}>
                      <input
                        autoFocus
                        value={newCode}
                        onChange={e => setNewCode(e.target.value.toUpperCase())}
                        placeholder="PROMO CODE"
                        style={{ ...inputStyle, fontSize: 12, fontFamily: "monospace", letterSpacing: "0.5px" }}
                      />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <select
                          value={newDiscountType}
                          onChange={e => setNewDiscountType(e.target.value as DiscountType)}
                          style={{ ...inputStyle, width: 105, fontSize: 12 }}
                        >
                          <option value="Percentage">%</option>
                          <option value="Fixed">Fixed</option>
                        </select>
                        <input
                          type="number" min={0}
                          value={newDiscountVal}
                          onChange={e => setNewDiscountVal(e.target.value)}
                          placeholder="0"
                          style={{ ...inputStyle, width: 60, fontSize: 12 }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input type="date" value={newValidFrom} onChange={e => setNewValidFrom(e.target.value)} style={{ ...inputStyle, fontSize: 12 }} />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input type="date" value={newValidUntil} onChange={e => setNewValidUntil(e.target.value)} style={{ ...inputStyle, fontSize: 12 }} />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <input
                        type="number" min={1}
                        value={newMaxUses}
                        onChange={e => setNewMaxUses(e.target.value)}
                        placeholder="Max"
                        style={{ ...inputStyle, width: 70, fontSize: 12 }}
                      />
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          onClick={addPromoCode}
                          style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                            color: "#34d399", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <CheckCircle2 size={13} />
                        </button>
                        <button
                          onClick={() => setShowAddPromo(false)}
                          style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                            color: "#f87171", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {promoCodes.length === 0 && !showAddPromo && (
                  <tr>
                    <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#334155", fontSize: 13, fontStyle: "italic" }}>
                      No promo codes attached. Add one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Send Actions */}
          {status === "Scheduled" && !isArchived && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: 12, padding: "20px 22px",
            }}>
              <SectionLabel>Send Actions</SectionLabel>

              {confirmSend ? (
                <div>
                  <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "0 0 14px", lineHeight: 1.6 }}>
                    Send to all <strong style={{ color: "#f1f5f9" }}>{targets.length}</strong> recipients now?
                    This cannot be undone.
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={sendNow}
                      style={{
                        flex: 1, background: "#059669", border: "none", borderRadius: 8,
                        padding: "9px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      Confirm Send
                    </button>
                    <button
                      onClick={() => setConfirmSend(false)}
                      style={{
                        flex: 1, background: "transparent",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8, padding: "9px", color: "#64748b", fontSize: 13, cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setConfirmSend(true)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 8, padding: "11px",
                      background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                      borderRadius: 10, color: "#34d399", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(16,185,129,0.22)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(16,185,129,0.12)")}
                  >
                    <Send size={15} /> Send Now
                  </button>
                  <p style={{ fontSize: 11.5, color: "#334155", margin: "10px 0 0", lineHeight: 1.6 }}>
                    Or wait for the scheduled time. The campaign will send automatically.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Campaign Stats */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Campaign Stats</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {([
                { label: "Total Recipients", value: targets.length,   color: "#94a3b8", icon: <Users       size={13} /> },
                { label: "Sent",             value: sentCount,        color: "#34d399", icon: <CheckCircle2 size={13} /> },
                { label: "Pending",          value: pendingCount,     color: "#60a5fa", icon: <Clock        size={13} /> },
                { label: "Promo Codes",      value: promoCodes.length,color: "#fbbf24", icon: <Tag          size={13} /> },
              ] as { label: string; value: number; color: string; icon: React.ReactNode }[]).map(({ label, value, color, icon }) => (
                <div
                  key={label}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#0f172a", borderRadius: 8, padding: "10px 14px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ color }}>{icon}</span>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Record Info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Record Info</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <MetaRow icon={<User     size={12} color="#818cf8" />} label="Created By"   value={record.createdBy} />
              <MetaRow icon={<Calendar size={12} color="#818cf8" />} label="Created"      value={record.createdAt} />
              <MetaRow icon={<Clock    size={12} color="#fbbf24" />} label="Last Updated" value={record.updatedAt} />
              {record.deletedAt && (
                <MetaRow icon={<Trash2 size={12} color="#f87171" />} label="Archived" value={record.deletedAt} />
              )}
            </div>
          </div>

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
                Archiving removes this campaign from active records. Restorable at any time.
              </p>
              <button
                onClick={() => setConfirmArchive(true)}
                style={{
                  width: "100%", background: "transparent",
                  border: "1px solid rgba(248,113,113,0.25)",
                  borderRadius: 8, padding: "8px", color: "#f87171", fontSize: 13, cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Archive Campaign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
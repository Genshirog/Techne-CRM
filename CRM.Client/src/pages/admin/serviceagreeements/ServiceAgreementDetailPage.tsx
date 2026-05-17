import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, FileSignature, Save, Trash2, RotateCcw,
  ChevronDown, AlertTriangle, Link2, Calendar, Clock,
  CheckCircle2, Send, FileDown, Shield, User,
} from "lucide-react"
import { generateServiceAgreementPDF } from "./ServiceAgreementPdf"

// ─── Types (mirrors C# entities exactly) ─────────────────────────────────────

type ServiceAgreementStatus = "Draft" | "Issued" | "Signed"

interface ServiceAgreementSignature {
  id:                 number
  serviceAgreementId: number
  customerSignature:  string | null   // null = not yet signed
  customerDate:       string | null
  providerName:       string
  providerSignature:  string | null   // null = not yet signed
  providerDate:       string | null
}

interface ServiceAgreementRecord {
  id:           number
  jobOrderId:   number
  quotationId:  number
  quotationRef: string        // display only — from Quotation nav prop
  jobOrderRef:  string        // display only — from JobOrder nav prop
  inquiryRef:   string        // display only — from Quotation.Inquiry nav prop
  clientName:   string        // from Quotation.client_name
  clientAddress:string
  clientEmail:  string
  clientPhone:  string
  projectTitle: string        // from Quotation.project_title
  finalLabor:   number
  finalParts:   number
  finalTotal:   number
  warrantyStart:string | null
  warrantyEnd:  string | null
  status:       ServiceAgreementStatus
  createdAt:    string
  updatedAt:    string
  deletedAt:    string | null
  signature:    ServiceAgreementSignature | null  // nullable — may not exist yet
  // From linked Quotation (reference only, not editable here)
  scopes:       { scenario: string; cases: { name: string; desc: string }[] }[]
  waivers:      { title: string;    cases: { name: string; desc: string }[] }[]
  deliverables: string[]
  terms:        string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_RECORD: ServiceAgreementRecord = {
  id:           5,
  jobOrderId:   9,
  quotationId:  9,
  quotationRef: "QUO-1009",
  jobOrderRef:  "JO-00009",
  inquiryRef:   "INQ-1040",
  clientName:   "Aisha Okonkwo",
  clientAddress:"42 Mahogany St., Davao City",
  clientEmail:  "aisha.okonkwo@email.com",
  clientPhone:  "+63 917 234 5678",
  projectTitle: "Kitchen Sink Plumbing Repair",
  finalLabor:   1500,
  finalParts:   1800,
  finalTotal:   3300,
  warrantyStart:null,
  warrantyEnd:  null,
  status:       "Draft",
  createdAt:    "May 10, 2026 — 9:00 AM",
  updatedAt:    "May 10, 2026 — 9:00 AM",
  deletedAt:    null,
  signature:    null,
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
  terms: "Payment is due upon completion of services. A 50% downpayment is required before work begins. Warranty covers parts and labor defects only and does not apply to misuse or accidental damage by the customer.",
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<ServiceAgreementStatus, { bg: string; color: string }> = {
  Draft:  { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  Issued: { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  Signed: { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
}

// Only valid forward transitions
const VALID_TRANSITIONS: Record<ServiceAgreementStatus, ServiceAgreementStatus[]> = {
  Draft:  ["Issued"],
  Issued: ["Signed"],
  Signed: [],
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

function SignedBadge({ signed }: { signed: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: 10,
      background: signed ? "rgba(16,185,129,0.12)" : "rgba(100,116,139,0.12)",
      color: signed ? "#34d399" : "#475569",
    }}>
      {signed ? "✓ Signed" : "Pending"}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminServiceAgreementDetailPage() {
  const navigate = useNavigate()
  useParams<{ id: string }>()

  const initial = MOCK_RECORD

  const [record,         setRecord]         = useState<ServiceAgreementRecord>(initial)
  const [status,         setStatus]         = useState<ServiceAgreementStatus>(initial.status)
  const [statusOpen,     setStatusOpen]     = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)

  // Editable fields (only when Draft)
  const [finalLabor,    setFinalLabor]    = useState(initial.finalLabor)
  const [finalParts,    setFinalParts]    = useState(initial.finalParts)
  const [warrantyStart, setWarrantyStart] = useState(initial.warrantyStart ?? "")
  const [warrantyEnd,   setWarrantyEnd]   = useState(initial.warrantyEnd ?? "")
  const [terms,         setTerms]         = useState(initial.terms)

  // Signature state (mirrors ServiceAgreementSignature entity)
  const [sig, setSig] = useState<ServiceAgreementSignature>(
    initial.signature ?? {
      id:                 0,
      serviceAgreementId: initial.id,
      customerSignature:  null,
      customerDate:       null,
      providerName:       "James Alcantara",
      providerSignature:  null,
      providerDate:       null,
    }
  )

  // ── Derived ──
  const isArchived     = record.deletedAt !== null
  const isSigned       = status === "Signed"
  const isEditable     = status === "Draft" && !isArchived
  const finalTotal     = finalLabor + finalParts
  const customerSigned = sig.customerSignature !== null
  const providerSigned = sig.providerSignature  !== null

  // ── Handlers ──
  const changeStatus = (s: ServiceAgreementStatus) => {
    if (!VALID_TRANSITIONS[status].includes(s)) return
    if (s === "Issued" && !record.signature) {
      setSig(prev => ({ ...prev, id: 1 }))
    }
    setStatus(s)
    setStatusOpen(false)
    setRecord(r => ({ ...r, updatedAt: "Just now" }))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setRecord(r => ({
        ...r,
        finalLabor,
        finalParts,
        finalTotal,
        warrantyStart: warrantyStart || null,
        warrantyEnd:   warrantyEnd   || null,
        terms,
        updatedAt: "Just now",
      }))
      setSaving(false); setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    }, 700)
  }

  const handleArchive = () => {
    setRecord(r => ({ ...r, deletedAt: "Just now" }))
    setConfirmArchive(false)
  }

  const markProviderSigned = () => {
    setSig(prev => ({
      ...prev,
      providerSignature: prev.providerName,
      providerDate:      new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }),
    }))
  }

  // ── PDF Download — wired to ServiceAgreementPdf.ts ──
  const handleDownloadPDF = () => {
    generateServiceAgreementPDF({
      agreementId:  record.id,
      jobOrderId:   record.jobOrderId,
      quotationRef: record.quotationRef,
      jobOrderRef:  record.jobOrderRef,
      inquiryRef:   record.inquiryRef,
      status,
      issuedDate:   record.createdAt,

      clientName:    record.clientName,
      clientAddress: record.clientAddress,
      clientPhone:   record.clientPhone,
      clientEmail:   record.clientEmail,
      projectTitle:  record.projectTitle,

      finalLabor,
      finalParts,
      finalTotal,

      warrantyStart: warrantyStart || null,
      warrantyEnd:   warrantyEnd   || null,

      scopes:          record.scopes,
      waivers:         record.waivers,
      deliverables:    record.deliverables,
      termsConditions: terms,

      customerSignature: sig.customerSignature,
      customerDate:      sig.customerDate,
      providerName:      sig.providerName,
      providerSignature: sig.providerSignature,
      providerDate:      sig.providerDate,
    })
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
    padding: "8px 12px", color: "#e2e8f0", fontSize: 13,
    outline: "none", boxSizing: "border-box",
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
          onClick={() => navigate("/admin/service-agreements")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Service Agreements
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: "rgba(99,102,241,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <FileSignature size={18} color="#818cf8" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                  SA-{String(record.id).padStart(5, "0")}
                </h1>
                <span style={{
                  display: "inline-block", padding: "3px 12px", borderRadius: 20,
                  fontSize: 12, fontWeight: 500,
                  background: STATUS_STYLE[status].bg, color: STATUS_STYLE[status].color,
                }}>
                  {status}
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
                <span onClick={() => navigate(`/admin/quotations/${record.quotationRef}`)}
                  style={{ color: "#60a5fa", cursor: "pointer" }}>{record.quotationRef}</span>
                {" · "}
                <span onClick={() => navigate(`/admin/job-orders/${record.jobOrderId}`)}
                  style={{ color: "#60a5fa", cursor: "pointer" }}>{record.jobOrderRef}</span>
                {record.updatedAt && ` · Updated ${record.updatedAt}`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

            {/* Status dropdown */}
            {!isArchived && !isSigned && (
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
                    borderRadius: 10, overflow: "hidden", minWidth: 160,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}>
                    {(["Draft", "Issued", "Signed"] as ServiceAgreementStatus[]).map(s => {
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
                            fontSize: 13,
                            cursor: allowed ? "pointer" : "not-allowed",
                            opacity: allowed || isCurrent ? 1 : 0.4,
                          }}
                          onMouseEnter={(e) => { if (allowed && !isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                          onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = "transparent" }}
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
              disabled={saving || isArchived || isSigned}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: saved ? "#059669" : (saving || isArchived || isSigned) ? "#334155" : "#6366f1",
                border: "none", borderRadius: 8, padding: "8px 18px",
                color: "#fff", fontSize: 13, fontWeight: 500,
                cursor: saving || isArchived || isSigned ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (!saving && !isArchived && !isSigned && !saved) e.currentTarget.style.background = "#4f46e5" }}
              onMouseLeave={(e) => { if (!saving && !saved) e.currentTarget.style.background = (isArchived || isSigned) ? "#334155" : "#6366f1" }}
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
          This agreement is archived. Archived on <strong style={{ margin: "0 4px" }}>{record.deletedAt}</strong>.
        </div>
      )}
      {isSigned && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#34d399", fontSize: 13,
        }}>
          <CheckCircle2 size={15} />
          This agreement is fully <strong style={{ margin: "0 4px" }}>Signed</strong> by both parties. No further edits allowed.
        </div>
      )}
      {status === "Issued" && !customerSigned && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#60a5fa", fontSize: 13,
        }}>
          <Send size={15} />
          Agreement has been issued. Awaiting customer signature.
        </div>
      )}

      {/* ── Main Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* ── Left Column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Financials */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Final Financials</SectionLabel>
            <p style={{ fontSize: 12, color: "#475569", marginTop: -10, marginBottom: 18 }}>
              These are the confirmed amounts after job completion — may differ from the original quotation.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {([
                { label: "Final Labor", value: finalLabor, set: setFinalLabor },
                { label: "Final Parts", value: finalParts, set: setFinalParts },
              ] as { label: string; value: number; set: (v: number) => void }[]).map(({ label, value, set }) => (
                <div key={label}>
                  <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                    {label}
                  </label>
                  {isEditable ? (
                    <input
                      type="number" min={0} value={value}
                      onChange={(e) => set(parseFloat(e.target.value) || 0)}
                      style={inputStyle}
                    />
                  ) : (
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>{fmt(value)}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "14px 18px",
            }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Final Total</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>
                {fmt(finalTotal)}
              </span>
            </div>
          </div>

          {/* Warranty */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Shield size={14} color="#818cf8" />
              <SectionLabel>Warranty Period</SectionLabel>
            </div>

            {isEditable ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {([
                  { label: "Warranty Start", value: warrantyStart, set: setWarrantyStart },
                  { label: "Warranty End",   value: warrantyEnd,   set: setWarrantyEnd   },
                ] as { label: string; value: string; set: (v: string) => void }[]).map(({ label, value, set }) => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                      {label}
                    </label>
                    <input
                      type="date" value={value}
                      onChange={(e) => set(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            ) : warrantyStart && warrantyEnd ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 10, padding: "12px 18px", flex: 1, textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Start</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#818cf8" }}>{warrantyStart}</div>
                </div>
                <div style={{ color: "#334155", fontSize: 18 }}>→</div>
                <div style={{
                  background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 10, padding: "12px 18px", flex: 1, textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>End</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#818cf8" }}>{warrantyEnd}</div>
                </div>
              </div>
            ) : (
              <div style={{
                background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "14px", fontSize: 13, color: "#475569",
                fontStyle: "italic", textAlign: "center",
              }}>
                No warranty period set.{isEditable ? " Set dates above to include warranty." : ""}
              </div>
            )}
          </div>

          {/* Scope of Work */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Scope of Work</SectionLabel>
            <p style={{ fontSize: 12, color: "#475569", marginTop: -10, marginBottom: 16 }}>
              Pulled from linked quotation · Read-only
            </p>
            {record.scopes.length === 0 ? (
              <p style={{ fontSize: 13, color: "#475569" }}>No scope defined.</p>
            ) : record.scopes.map((sc, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                  {i + 1}. {sc.scenario}
                </div>
                {sc.cases.map((c, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5, paddingLeft: 12 }}>
                    <span style={{ color: "#475569", fontSize: 12, flexShrink: 0 }}>•</span>
                    <span style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.6 }}>
                      <strong style={{ color: "#cbd5e1" }}>{c.name}:</strong> {c.desc}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Waiver */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Waiver of Liability</SectionLabel>
            <p style={{ fontSize: 12, color: "#475569", marginTop: -10, marginBottom: 16 }}>
              Pulled from linked quotation · Read-only
            </p>
            {record.waivers.length === 0 ? (
              <p style={{ fontSize: 13, color: "#475569" }}>No waiver defined.</p>
            ) : record.waivers.map((w, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>{w.title}</div>
                {w.cases.map((c, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5, paddingLeft: 12 }}>
                    <span style={{ color: "#475569", fontSize: 12, flexShrink: 0 }}>•</span>
                    <span style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.6 }}>
                      <strong style={{ color: "#cbd5e1" }}>{c.name}:</strong> {c.desc}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            {/* Indemnification */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8 }}>Indemnification</div>
              <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
                The Customer agrees to indemnify and hold harmless the Service Provider from any claims, damages,
                or expenses resulting from misuse or negligence of the repaired equipment.
              </p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <SectionLabel>Terms & Conditions</SectionLabel>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              disabled={!isEditable}
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical", fontFamily: "inherit", lineHeight: 1.7,
                opacity: !isEditable ? 0.55 : 1,
              }}
            />
          </div>

          {/* Signatures Block */}
          <div style={{
            background: "#1e293b",
            border: `1px solid ${status === "Draft" ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.25)"}`,
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <SectionLabel>Signatures</SectionLabel>
              {status === "Draft" && (
                <span style={{ fontSize: 12, color: "#475569", fontStyle: "italic" }}>
                  Available once Issued
                </span>
              )}
            </div>

            {status === "Draft" ? (
              <div style={{
                background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8, padding: "20px", textAlign: "center",
                fontSize: 13, color: "#334155",
              }}>
                Signature fields are created when you issue the agreement.
              </div>
            ) : (
              <>
                <p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 20, marginTop: -6 }}>
                  By signing below, both parties confirm acceptance of all listed terms, scope, and conditions.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* Customer Signature */}
                  <div style={{
                    background: "#0f172a",
                    border: `1px solid ${customerSigned ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 10, padding: "18px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Customer
                      </span>
                      <SignedBadge signed={customerSigned} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Name</div>
                        <div style={{ fontSize: 13, color: "#e2e8f0" }}>{record.clientName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Signature / eSign</div>
                        <div style={{
                          background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, padding: "10px 12px", minHeight: 40,
                          fontSize: 13,
                          color: sig.customerSignature ? "#34d399" : "#334155",
                          fontStyle: sig.customerSignature ? "normal" : "italic",
                        }}>
                          {sig.customerSignature ?? "Awaiting customer signature…"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Date</div>
                        <div style={{ fontSize: 13, color: "#e2e8f0" }}>{sig.customerDate ?? "—"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Provider Signature */}
                  <div style={{
                    background: "#0f172a",
                    border: `1px solid ${providerSigned ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 10, padding: "18px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Service Provider
                      </span>
                      <SignedBadge signed={providerSigned} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Name</div>
                        {!isSigned ? (
                          <input
                            value={sig.providerName}
                            onChange={(e) => setSig(s => ({ ...s, providerName: e.target.value }))}
                            style={{ ...inputStyle, fontSize: 13 }}
                          />
                        ) : (
                          <div style={{ fontSize: 13, color: "#e2e8f0" }}>{sig.providerName}</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Signature / eSign</div>
                        <div style={{
                          background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, padding: "10px 12px", minHeight: 40,
                          fontSize: 13,
                          color: sig.providerSignature ? "#34d399" : "#334155",
                          fontStyle: sig.providerSignature ? "normal" : "italic",
                        }}>
                          {sig.providerSignature ?? "Not yet signed"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Date</div>
                        <div style={{ fontSize: 13, color: "#e2e8f0" }}>{sig.providerDate ?? "—"}</div>
                      </div>
                      {!providerSigned && !isSigned && (
                        <button
                          onClick={markProviderSigned}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                            borderRadius: 8, padding: "8px", color: "#818cf8",
                            fontSize: 13, cursor: "pointer", marginTop: 4,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.22)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.12)")}
                        >
                          <CheckCircle2 size={13} /> Mark as Signed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Deliverables */}
          {record.deliverables.length > 0 && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "22px 24px",
            }}>
              <SectionLabel>Expected Deliverables</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {record.deliverables.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "#34d399", flexShrink: 0, marginTop: 7,
                    }} />
                    <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              {([
                { label: "Job Order", ref: record.jobOrderRef,  path: `/admin/job-orders/${record.jobOrderId}`,  color: "#fbbf24" },
                { label: "Quotation", ref: record.quotationRef, path: `/admin/quotations/${record.quotationRef}`,color: "#818cf8" },
                { label: "Inquiry",   ref: record.inquiryRef,   path: `/admin/inquiries/${record.inquiryRef}`,   color: "#60a5fa" },
              ] as { label: string; ref: string; path: string; color: string }[]).map(({ label, ref, path, color }) => (
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
                {record.clientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{record.clientName}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Customer</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <MetaRow icon={<User  size={12} color="#818cf8" />} label="Email"   value={record.clientEmail}   />
              <MetaRow icon={<Send  size={12} color="#818cf8" />} label="Phone"   value={record.clientPhone}   />
              <MetaRow icon={<Link2 size={12} color="#818cf8" />} label="Address" value={record.clientAddress} />
            </div>
          </div>

          {/* Signature Summary */}
          {status !== "Draft" && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "20px 22px",
            }}>
              <SectionLabel>Signature Status</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {([
                  { label: "Customer",         signed: customerSigned, date: sig.customerDate },
                  { label: "Service Provider", signed: providerSigned, date: sig.providerDate },
                ] as { label: string; signed: boolean; date: string | null }[]).map(({ label, signed, date }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#0f172a", borderRadius: 8, padding: "10px 14px",
                    border: `1px solid ${signed ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)"}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>{label}</div>
                      {date && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{date}</div>}
                    </div>
                    <SignedBadge signed={signed} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Record Info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Record Info</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
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
                Archiving removes this agreement from active records. Restorable at any time.
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
                Archive Agreement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
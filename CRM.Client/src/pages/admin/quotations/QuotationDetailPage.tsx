import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, FileText, Save, Trash2, RotateCcw,
  Send, Plus, X, Calendar, Clock, Mail, Phone,
  ChevronDown, AlertTriangle, Link2, User, FileDown,
} from "lucide-react"
import { generateQuotationPDF } from "./QuotationPdf"

// ─── Types ────────────────────────────────────────────────────────────────────

type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired"

interface LineItem {
  id: number
  description: string
  qty: number
  unitPrice: number
}

interface QuotationRecord {
  id: number | null
  quotationNo: string
  inquiryRef: string
  status: QuotationStatus
  customer: { name: string; email: string; phone: string }
  assignedTech: string
  validUntil: string
  notes: string
  taxRate: number
  lineItems: LineItem[]
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_RECORD: QuotationRecord = {
  id:          9,
  quotationNo: "QUO-1009",
  inquiryRef:  "INQ-1040",
  status:      "Draft",
  customer: {
    name:  "Aisha Okonkwo",
    email: "aisha.okonkwo@email.com",
    phone: "+63 917 234 5678",
  },
  assignedTech: "Paulo Mendez",
  validUntil:   "2026-05-30",
  notes:        "Price subject to change if additional parts are required after full inspection.",
  taxRate:      12,
  lineItems: [
    { id: 1, description: "P-trap replacement (standard)",      qty: 1, unitPrice: 850 },
    { id: 2, description: "Labor — pipe repair & installation",  qty: 2, unitPrice: 600 },
    { id: 3, description: "Cabinet waterproofing sealant",      qty: 1, unitPrice: 450 },
    { id: 4, description: "Service call fee",                   qty: 1, unitPrice: 400 },
  ],
  createdAt:  "May 6, 2026 — 10:00 AM",
  updatedAt:  "May 6, 2026 — 2:45 PM",
  deletedAt:  null,
}

const STATUS_OPTIONS: QuotationStatus[] = ["Draft", "Sent", "Accepted", "Rejected", "Expired"]

const STATUS_STYLE: Record<QuotationStatus, { bg: string; color: string }> = {
  Draft:    { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
  Sent:     { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  Accepted: { bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  Rejected: { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  Expired:  { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24" },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let nextLineId = 10

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 }).format(n)

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 600, color: "#475569",
      textTransform: "uppercase", letterSpacing: "0.6px",
    }}>
      {children}
    </div>
  )
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: "#cbd5e1" }}>{value}</div>
      </div>
    </div>
  )
}

function TotalRow({
  label, value, bold = false,
}: {
  label: React.ReactNode; value: string; bold?: boolean
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: bold ? "#e2e8f0" : "#64748b", fontWeight: bold ? 600 : 400 }}>
        {label}
      </span>
      <span style={{
        fontSize: bold ? 15 : 13, color: bold ? "#f1f5f9" : "#94a3b8",
        fontWeight: bold ? 700 : 400, fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </span>
    </div>
  )
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%", background: "#0f172a",
  border: `1px solid ${hasError ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
  borderRadius: 8, padding: "9px 13px", color: "#e2e8f0",
  fontSize: 13, outline: "none", boxSizing: "border-box",
})

const errStyle: React.CSSProperties = {
  fontSize: 12, color: "#f87171", margin: "5px 0 0",
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminQuotationDetailPage() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = id === "new"

  // Redirect "new" to the dedicated form page
  if (isNew) {
    navigate("/admin/quotations/create", { replace: true })
    return null
  }

  return <QuotationDetail />
}

function QuotationDetail() {
  const navigate = useNavigate()

  const initial = MOCK_RECORD

  const [record,         setRecord]         = useState<QuotationRecord>(initial)
  const [status,         setStatus]         = useState<QuotationStatus>(initial.status)
  const [statusOpen,     setStatusOpen]     = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)

  const [lineItems,    setLineItems]    = useState<LineItem[]>(initial.lineItems)
  const [notes,        setNotes]        = useState(initial.notes)
  const [validUntil,   setValidUntil]   = useState(initial.validUntil)
  const [taxRate,      setTaxRate]      = useState(initial.taxRate)
  const [fieldErrors,  setFieldErrors]  = useState<Record<string, string>>({})

  // ── Derived ──
  const isArchived = record.deletedAt !== null
  const isEditable = !isArchived && status === "Draft"
  const subtotal   = lineItems.reduce((s, l) => s + l.qty * l.unitPrice, 0)
  const taxAmt     = subtotal * (taxRate / 100)
  const total      = subtotal + taxAmt

  // ── Line item handlers ──
  const updateLine = (id: number, field: keyof LineItem, value: string | number) =>
    setLineItems(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  const addLine    = () =>
    setLineItems(prev => [...prev, { id: nextLineId++, description: "", qty: 1, unitPrice: 0 }])
  const removeLine = (id: number) =>
    setLineItems(prev => prev.filter(l => l.id !== id))

  // ── Validation ──
  const validate = () => {
    const e: Record<string, string> = {}
    if (!record.inquiryRef.trim())                  e.inquiryRef = "Inquiry reference is required."
    if (!validUntil)                                e.validUntil = "Valid until date is required."
    if (lineItems.some(l => !l.description.trim())) e.lineItems  = "All line item descriptions must be filled."
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Action handlers ──
  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      setRecord(prev => ({ ...prev, updatedAt: "Just now" }))
      setSaving(false); setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    }, 700)
  }

  const handleSend    = () => { setStatus("Sent"); setRecord(prev => ({ ...prev, updatedAt: "Just now" })) }
  const handleArchive = () => { setRecord(prev => ({ ...prev, deletedAt: "Just now" })); setConfirmArchive(false) }
  const handleRestore = () => { setRecord(prev => ({ ...prev, deletedAt: null })) }
  const changeStatus  = (s: QuotationStatus) => { setStatus(s); setStatusOpen(false); setRecord(prev => ({ ...prev, updatedAt: "Just now" })) }

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
          onClick={() => navigate("/admin/quotations")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Quotations
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "rgba(16,185,129,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <FileText size={18} color="#34d399" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                  {record.quotationNo}
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
                    display: "inline-block", padding: "3px 12px", borderRadius: 20,
                    fontSize: 12, fontWeight: 500,
                    background: "rgba(248,113,113,0.1)", color: "#f87171",
                  }}>
                    Archived
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12.5, color: "#475569", margin: "3px 0 0" }}>
                Linked to{" "}
                <span
                  onClick={() => navigate(`/admin/inquiries/${record.inquiryRef}`)}
                  style={{ color: "#60a5fa", cursor: "pointer" }}
                >
                  {record.inquiryRef}
                </span>
                {record.updatedAt && ` · Last updated ${record.updatedAt}`}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

            {/* Status Dropdown */}
            {!isArchived && (
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
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s} onClick={() => changeStatus(s)}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "10px 16px",
                          background: s === status ? "rgba(99,102,241,0.12)" : "transparent",
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
            )}

            {/* Send */}
            {!isArchived && status === "Draft" && (
              <button
                onClick={handleSend}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                  borderRadius: 8, padding: "8px 14px", color: "#60a5fa", fontSize: 13, cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.15)")}
              >
                <Send size={14} /> Send to Customer
              </button>
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
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "transparent", border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: 8, padding: "8px 10px", color: "#f87171", cursor: "pointer",
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

            {/* Download PDF */}
            <button
              onClick={() => generateQuotationPDF({
                projectTitle:      record.quotationNo,
                objective:         notes,
                dateIssued:        validUntil,
                clientName:        record.customer.name,
                clientAddress:     "",
                clientLogoPreview: null,
                items:             lineItems.map(l => ({
                  name:        l.description,
                  description: "",
                  qty:         l.qty,
                  unit_price:  l.unitPrice,
                })),
                scopes:            [],
                waivers:           [],
                deliverables:      [],
                timelineMin:       "",
                timelineMax:       "",
                termsConditions:   notes,
                customerName:      record.customer.name,
                customerSignature: "",
                customerDate:      validUntil,
                providerName:      record.assignedTech,
                providerSignature: "",
                providerDate:      validUntil,
                diagnosticFee:     0,
                serviceName:       "",
              })}
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

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving || isArchived}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: saved ? "#059669" : (saving || isArchived) ? "#334155" : "#6366f1",
                border: "none", borderRadius: 8,
                padding: "8px 18px", color: "#fff",
                fontSize: 13, fontWeight: 500,
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
          borderRadius: 10, padding: "12px 18px", marginBottom: 20,
          color: "#f87171", fontSize: 13,
        }}>
          <AlertTriangle size={15} />
          This quotation is archived and cannot be modified. Archived on{" "}
          <strong style={{ marginLeft: 4 }}>{record.deletedAt}</strong>.
        </div>
      )}

      {!isArchived && status !== "Draft" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20,
          color: "#fbbf24", fontSize: 13,
        }}>
          <AlertTriangle size={15} />
          This quotation is <strong style={{ margin: "0 4px" }}>{status}</strong> and is read-only.
          Change status back to Draft to edit.
        </div>
      )}

      {/* ── Main Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* Left — Meta, Line Items, Notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Meta Fields */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18,
          }}>
            {/* Inquiry Reference */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                Inquiry Reference {isEditable && <span style={{ color: "#f87171" }}>*</span>}
              </label>
              {isEditable ? (
                <>
                  <input
                    value={record.inquiryRef}
                    onChange={(e) => setRecord(r => ({ ...r, inquiryRef: e.target.value }))}
                    placeholder="INQ-XXXX"
                    style={inputStyle(!!fieldErrors.inquiryRef)}
                  />
                  {fieldErrors.inquiryRef && <p style={errStyle}>{fieldErrors.inquiryRef}</p>}
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Link2 size={13} color="#60a5fa" />
                  <span
                    onClick={() => navigate(`/admin/inquiries/${record.inquiryRef}`)}
                    style={{ fontSize: 13.5, color: "#60a5fa", cursor: "pointer" }}
                  >
                    {record.inquiryRef || "—"}
                  </span>
                </div>
              )}
            </div>

            {/* Valid Until */}
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                Valid Until {isEditable && <span style={{ color: "#f87171" }}>*</span>}
              </label>
              {isEditable ? (
                <>
                  <input
                    type="date" value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    style={inputStyle(!!fieldErrors.validUntil)}
                  />
                  {fieldErrors.validUntil && <p style={errStyle}>{fieldErrors.validUntil}</p>}
                </>
              ) : (
                <span style={{ fontSize: 13.5, color: "#cbd5e1" }}>{validUntil || "—"}</span>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                Line Items
              </span>
              {isEditable && (
                <button
                  onClick={addLine}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: 7, padding: "5px 12px", color: "#818cf8", fontSize: 12.5, cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.12)")}
                >
                  <Plus size={13} /> Add Line
                </button>
              )}
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {["Description", "Qty", "Unit Price", "Amount", ""].map((h, i) => (
                    <th key={i} style={{
                      padding: "9px 16px", textAlign: i >= 1 ? "right" : "left",
                      fontSize: 11, fontWeight: 600, color: "#475569",
                      textTransform: "uppercase", letterSpacing: "0.6px",
                      width: i === 1 ? 70 : i === 2 ? 130 : i === 3 ? 130 : i === 4 ? 36 : "auto",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lineItems.map((line, i) => (
                  <tr key={line.id} style={{ borderBottom: i < lineItems.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <td style={{ padding: "10px 16px" }}>
                      {isEditable ? (
                        <input
                          value={line.description}
                          onChange={(e) => updateLine(line.id, "description", e.target.value)}
                          placeholder="Describe the item or service…"
                          style={{
                            width: "100%", background: "#0f172a",
                            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
                            padding: "7px 10px", color: "#e2e8f0", fontSize: 13, outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 13, color: "#cbd5e1" }}>{line.description}</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      {isEditable ? (
                        <input
                          type="number" min={1} value={line.qty}
                          onChange={(e) => updateLine(line.id, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                          style={{
                            width: 52, background: "#0f172a",
                            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
                            padding: "7px 8px", color: "#e2e8f0", fontSize: 13,
                            outline: "none", textAlign: "center",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{line.qty}</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      {isEditable ? (
                        <input
                          type="number" min={0} value={line.unitPrice}
                          onChange={(e) => updateLine(line.id, "unitPrice", parseFloat(e.target.value) || 0)}
                          style={{
                            width: 110, background: "#0f172a",
                            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
                            padding: "7px 10px", color: "#e2e8f0", fontSize: 13,
                            outline: "none", textAlign: "right",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{fmt(line.unitPrice)}</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, fontWeight: 500, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>
                      {fmt(line.qty * line.unitPrice)}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center" }}>
                      {isEditable && lineItems.length > 1 && (
                        <button
                          onClick={() => removeLine(line.id)}
                          style={{
                            background: "transparent", border: "none",
                            color: "#475569", cursor: "pointer", padding: 4, borderRadius: 5,
                            display: "flex", alignItems: "center",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {fieldErrors.lineItems && (
              <div style={{ padding: "8px 16px" }}>
                <p style={{ ...errStyle, margin: 0 }}>{fieldErrors.lineItems}</p>
              </div>
            )}

            {/* Totals */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 22px", display: "flex", justifyContent: "flex-end",
            }}>
              <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 9 }}>
                <TotalRow label="Subtotal" value={fmt(subtotal)} />
                <TotalRow
                  label={
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      Tax
                      {isEditable && (
                        <input
                          type="number" min={0} max={100} value={taxRate}
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          style={{
                            width: 42, background: "#0f172a",
                            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5,
                            padding: "2px 6px", color: "#94a3b8", fontSize: 12,
                            outline: "none", textAlign: "center",
                          }}
                        />
                      )}
                      <span style={{ fontSize: 12, color: "#475569" }}>{taxRate}%</span>
                    </span>
                  }
                  value={fmt(taxAmt)}
                />
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
                  <TotalRow label="Total" value={fmt(total)} bold />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "22px 24px",
          }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes or terms to include in the quotation…"
              rows={3}
              disabled={!isEditable}
              style={{
                width: "100%", background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
                resize: "vertical", outline: "none", boxSizing: "border-box",
                fontFamily: "inherit", lineHeight: 1.65,
                opacity: !isEditable ? 0.55 : 1,
              }}
            />
          </div>
        </div>

        {/* Right — Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Customer */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Customer</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 11, margin: "14px 0 16px" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#818cf8", flexShrink: 0,
              }}>
                {record.customer.name
                  ? record.customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                  : "—"}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{record.customer.name || "—"}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Customer</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <MetaRow icon={<Mail  size={12} color="#818cf8" />} label="Email" value={record.customer.email} />
              <MetaRow icon={<Phone size={12} color="#818cf8" />} label="Phone" value={record.customer.phone} />
              <MetaRow icon={<User  size={12} color="#fbbf24" />} label="Tech"  value={record.assignedTech || "Unassigned"} />
            </div>
          </div>

          {/* Record Info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Record Info</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 14 }}>
              <MetaRow icon={<Calendar size={12} color="#818cf8" />} label="Created"      value={record.createdAt  ?? "—"} />
              <MetaRow icon={<Clock    size={12} color="#fbbf24" />} label="Last Updated" value={record.updatedAt  ?? "—"} />
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
              <div style={{ fontSize: 12, fontWeight: 600, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>
                Danger Zone
              </div>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 14px", lineHeight: 1.6 }}>
                Archiving removes this quotation from active workflows. Restorable at any time.
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
                Archive Quotation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
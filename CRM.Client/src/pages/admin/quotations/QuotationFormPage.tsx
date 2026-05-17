import React, { useState, useRef } from "react"
// FIX: removed unused `useEffect` import
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, Upload, Plus, Trash2, Send, Save,
  FileText, X, AlertCircle, User,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface InquiryService {
  name: string
  diagnostic_fee: number
}

interface Inquiry {
  id: number
  category: string
  contact_number: string
  name: string
  device_details: string
  issue_description: string
  service_location: string
  service: InquiryService
}

interface Template {
  id: number
  name: string
  category: string
}

interface ItemRow {
  id: number
  name: string
  description: string
  qty: number
  unit_price: number
}

interface CaseRow {
  id: number
  name: string
  description: string
}

interface ScenarioRow {
  id: number
  scenario: string
  cases: CaseRow[]
}

interface DeliverableRow {
  id: number
  detail: string
}

// ─── Mock / seed data (swap with real fetch) ──────────────────────────────────

const MOCK_INQUIRY: Inquiry = {
  id: 1040,
  category: "Computer Repair",
  contact_number: "09662406825",
  name: "Aisha Okonkwo",
  device_details: "Laptop Screen Replacement",
  issue_description: "The LCD panel has multiple dead zones and backlight bleeding along the bottom edge.",
  service_location: "42 Mahogany St., Davao City",
  service: { name: "Diagnostic – Computer", diagnostic_fee: 350 },
}

const MOCK_TEMPLATES: Template[] = [
  { id: 1, name: "Basic Laptop Repair",   category: "Computer" },
  { id: 2, name: "Network Setup",         category: "Networking" },
  { id: 3, name: "Data Recovery Package", category: "Storage" },
]

const TEMPLATE_DATA: Record<number, {
  scopes: { scenario_name: string; cases: { case_title: string; case_description: string }[] }[]
  waivers: { waiver_title: string; cases: { case_title: string; description: string }[] }[]
  deliverables: { deliverable_detail: string }[]
}> = {
  1: {
    scopes: [
      {
        scenario_name: "Hardware Inspection",
        cases: [
          { case_title: "Visual Check", case_description: "Full physical inspection of chassis and components." },
          { case_title: "Thermal Scan", case_description: "Check CPU and GPU temperatures under load." },
        ],
      },
    ],
    waivers: [
      {
        waiver_title: "Pre-existing Damage",
        cases: [
          { case_title: "Cosmetic Damage", description: "Service provider is not liable for pre-existing cosmetic damage." },
        ],
      },
    ],
    deliverables: [
      { deliverable_detail: "Fully repaired and tested unit returned to client." },
      { deliverable_detail: "Diagnostic report summarising findings." },
    ],
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().split("T")[0]

// FIX: module-level counter is fine for ID generation across renders;
// made explicit it is only used as a stable incrementing source — not reactive state
let _nextId = 1
const uid = () => _nextId++

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 }).format(n)

// ─── Sub-components ──────────────────────────────────────────────────────────

// FIX: added explicit prop types to all sub-components (no more implicit `any`)

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: "#64748b",
      textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 14,
    }}>
      {children}
    </div>
  )
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>
      {children} {required && <span style={{ color: "#f87171" }}>*</span>}
    </label>
  )
}

function Field({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { style?: React.CSSProperties }) {
  return (
    <input
      style={{
        width: "100%", background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
        padding: "9px 13px", color: "#e2e8f0", fontSize: 13,
        outline: "none", boxSizing: "border-box", fontFamily: "inherit",
        ...style,
      }}
      {...props}
    />
  )
}

function Textarea({ style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { style?: React.CSSProperties }) {
  return (
    <textarea
      style={{
        width: "100%", background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
        padding: "9px 13px", color: "#e2e8f0", fontSize: 13,
        outline: "none", boxSizing: "border-box", fontFamily: "inherit",
        resize: "vertical", lineHeight: 1.65,
        ...style,
      }}
      {...props}
    />
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "22px 24px",
      ...style,
    }}>
      {children}
    </div>
  )
}

function IconBtn({
  onClick,
  color = "#f87171",
  children,
  title,
}: {
  onClick: () => void
  color?: string
  children: React.ReactNode
  title?: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? `${color}18` : "transparent",
        border: "none", borderRadius: 6,
        padding: "4px 6px", cursor: "pointer",
        color: hover ? color : "#475569",
        display: "flex", alignItems: "center",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  )
}

// ─── Items Table ──────────────────────────────────────────────────────────────

function ItemsTable({ items, setItems }: { items: ItemRow[]; setItems: React.Dispatch<React.SetStateAction<ItemRow[]>> }) {
  const update = (id: number, field: keyof ItemRow, val: string | number) =>
    setItems(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r))

  const add = () =>
    setItems(prev => [...prev, { id: uid(), name: "", description: "", qty: 1, unit_price: 0 }])

  const remove = (id: number) => setItems(prev => prev.filter(r => r.id !== id))

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              {["Item Name", "Description", "Qty", "Unit Price (₱)", "Total (₱)", ""].map((h, i) => (
                <th key={i} style={{
                  padding: "9px 12px", textAlign: i >= 2 ? "right" : "left",
                  fontSize: 11, fontWeight: 600, color: "#475569",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  whiteSpace: "nowrap",
                  width: i === 2 ? 64 : i === 3 ? 120 : i === 4 ? 110 : i === 5 ? 36 : "auto",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <td style={{ padding: "8px 10px" }}>
                  <Field value={row.name} placeholder={`Item ${i + 1}`}
                    onChange={e => update(row.id, "name", e.target.value)} />
                </td>
                <td style={{ padding: "8px 10px" }}>
                  <Textarea rows={2} value={row.description} placeholder="Description"
                    onChange={e => update(row.id, "description", e.target.value)} />
                </td>
                <td style={{ padding: "8px 10px" }}>
                  <Field type="number" min={1} value={row.qty}
                    style={{ textAlign: "center", padding: "9px 6px" }}
                    onChange={e => update(row.id, "qty", Math.max(1, parseInt(e.target.value) || 1))} />
                </td>
                <td style={{ padding: "8px 10px" }}>
                  <Field type="number" min={0} step={0.01} value={row.unit_price}
                    style={{ textAlign: "right" }}
                    onChange={e => update(row.id, "unit_price", parseFloat(e.target.value) || 0)} />
                </td>
                <td style={{ padding: "8px 10px", textAlign: "right", color: "#f1f5f9", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {fmt(row.qty * row.unit_price)}
                </td>
                <td style={{ padding: "8px 6px", textAlign: "center" }}>
                  {items.length > 1 && (
                    <IconBtn onClick={() => remove(row.id)} title="Remove row">
                      <X size={13} />
                    </IconBtn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button type="button" onClick={add}
          style={{ background: "transparent", border: "none", color: "#60a5fa", fontSize: 13, cursor: "pointer" }}>
          + Add Item
        </button>
      </div>
    </div>
  )
}

// ─── Totals ───────────────────────────────────────────────────────────────────

function Totals({
  items,
  diagnosticFee,
  serviceName,
}: {
  items: ItemRow[]
  diagnosticFee: number
  serviceName: string
}) {
  const subtotal = items.reduce((s, r) => s + r.qty * r.unit_price, 0)
  const grand    = subtotal + (diagnosticFee || 0)

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{
        background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, padding: "14px 18px", width: 300,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>
          <span>Subtotal (Labor)</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>
          <span>Diagnostic Fee {serviceName ? `(${serviceName})` : ""}</span>
          <span>{fmt(diagnosticFee || 0)}</span>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 14, fontWeight: 600, color: "#f1f5f9",
          borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10,
        }}>
          <span>Grand Total</span>
          <span>{fmt(grand)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Scope / Waiver Table ─────────────────────────────────────────────────────

function ScenarioTable({
  rows,
  setRows,
  caseLabel = "Case",
  scenarioLabel = "Scenario",
}: {
  rows: ScenarioRow[]
  setRows: React.Dispatch<React.SetStateAction<ScenarioRow[]>>
  // FIX: removed unused `prefix` prop
  caseLabel?: string
  scenarioLabel?: string
}) {
  const addScenario = () =>
    setRows(prev => [...prev, { id: uid(), scenario: "", cases: [] }])

  const removeScenario = (sid: number) =>
    setRows(prev => prev.filter(s => s.id !== sid))

  const updateScenario = (sid: number, val: string) =>
    setRows(prev => prev.map(s => s.id === sid ? { ...s, scenario: val } : s))

  const addCase = (sid: number) =>
    setRows(prev => prev.map(s =>
      s.id === sid ? { ...s, cases: [...s.cases, { id: uid(), name: "", description: "" }] } : s
    ))

  const removeCase = (sid: number, cid: number) =>
    setRows(prev => prev.map(s =>
      s.id === sid ? { ...s, cases: s.cases.filter(c => c.id !== cid) } : s
    ))

  const updateCase = (sid: number, cid: number, field: keyof CaseRow, val: string) =>
    setRows(prev => prev.map(s =>
      s.id === sid
        ? { ...s, cases: s.cases.map(c => c.id === cid ? { ...c, [field]: val } : c) }
        : s
    ))

  return (
    <div>
      <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              {[`${scenarioLabel} Name`, `${caseLabel} Name`, "Description", ""].map((h, i) => (
                <th key={i} style={{
                  padding: "9px 12px", textAlign: "left",
                  fontSize: 11, fontWeight: 600, color: "#475569",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  width: i === 0 ? "22%" : i === 1 ? "22%" : i === 3 ? 36 : "auto",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "20px 14px", textAlign: "center", color: "#475569", fontSize: 13 }}>
                  No scenarios added yet.
                </td>
              </tr>
            )}
            {rows.map((scenario, si) => (
              // FIX: replaced bare <> fragment (no key) with <React.Fragment key={...}>
              <React.Fragment key={scenario.id}>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                    <Field
                      value={scenario.scenario}
                      placeholder={`${scenarioLabel} ${si + 1}`}
                      onChange={e => updateScenario(scenario.id, e.target.value)}
                      style={{ fontWeight: 500 }}
                    />
                  </td>
                  <td colSpan={2} style={{ padding: "10px 12px" }}>
                    {scenario.cases.length === 0 && (
                      <span style={{ fontSize: 12, color: "#475569" }}>No cases yet.</span>
                    )}
                    {scenario.cases.map((c, ci) => (
                      <div key={c.id} style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr 36px",
                        gap: 8, marginBottom: ci < scenario.cases.length - 1 ? 8 : 0,
                      }}>
                        <Field
                          value={c.name}
                          placeholder={`${caseLabel} ${ci + 1}`}
                          onChange={e => updateCase(scenario.id, c.id, "name", e.target.value)}
                        />
                        <Textarea
                          rows={2}
                          value={c.description}
                          placeholder="Description"
                          onChange={e => updateCase(scenario.id, c.id, "description", e.target.value)}
                        />
                        <IconBtn onClick={() => removeCase(scenario.id, c.id)} title="Remove case">
                          <X size={12} />
                        </IconBtn>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addCase(scenario.id)}
                      style={{ background: "transparent", border: "none", color: "#60a5fa", fontSize: 12, cursor: "pointer", marginTop: 6 }}
                    >
                      + Add {caseLabel}
                    </button>
                  </td>
                  <td style={{ padding: "10px 6px", verticalAlign: "top", textAlign: "right" }}>
                    <IconBtn onClick={() => removeScenario(scenario.id)} title="Remove scenario">
                      <Trash2 size={13} />
                    </IconBtn>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button type="button" onClick={addScenario}
          style={{ background: "transparent", border: "none", color: "#60a5fa", fontSize: 13, cursor: "pointer" }}>
          + Add {scenarioLabel}
        </button>
      </div>
    </div>
  )
}

// ─── Deliverables Table ───────────────────────────────────────────────────────

function DeliverablesTable({
  rows,
  setRows,
}: {
  rows: DeliverableRow[]
  setRows: React.Dispatch<React.SetStateAction<DeliverableRow[]>>
}) {
  const add    = ()          => setRows(prev => [...prev, { id: uid(), detail: "" }])
  const remove = (id: number) => setRows(prev => prev.filter(r => r.id !== id))
  const update = (id: number, val: string) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, detail: val } : r))

  return (
    <div>
      <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              {["#", "Deliverable Detail", ""].map((h, i) => (
                <th key={i} style={{
                  padding: "9px 12px", textAlign: "left",
                  fontSize: 11, fontWeight: 600, color: "#475569",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  width: i === 0 ? 40 : i === 2 ? 36 : "auto",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "20px 14px", textAlign: "center", color: "#475569", fontSize: 13 }}>
                  No deliverables added yet.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={row.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "10px 12px", color: "#64748b", fontWeight: 500 }}>{i + 1}</td>
                <td style={{ padding: "8px 10px" }}>
                  <Field value={row.detail} placeholder="Deliverable detail"
                    onChange={e => update(row.id, e.target.value)} />
                </td>
                <td style={{ padding: "8px 6px", textAlign: "center" }}>
                  <IconBtn onClick={() => remove(row.id)} title="Remove">
                    <Trash2 size={13} />
                  </IconBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button type="button" onClick={add}
          style={{ background: "transparent", border: "none", color: "#60a5fa", fontSize: 13, cursor: "pointer" }}>
          + Add Deliverable
        </button>
      </div>
    </div>
  )
}

// ─── Action Button ────────────────────────────────────────────────────────────

// FIX: moved ActionBtn ABOVE QuotationFormPage so it is declared before use
function ActionBtn({
  children,
  onClick,
  color,
  hoverColor,
}: {
  children: React.ReactNode
  onClick: () => void
  color: string
  hoverColor: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "9px 18px", background: hover ? hoverColor : color,
        border: "none", borderRadius: 8, color: "#fff",
        fontSize: 13, fontWeight: 500, cursor: "pointer",
        transition: "background 0.15s",
      }}
    >
      {children}
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function QuotationFormPage() {
  const navigate    = useNavigate()
  const { inquiryId } = useParams()

  // swap: fetch by inquiryId
  const inquiry: Inquiry       = MOCK_INQUIRY
  const templates: Template[]  = MOCK_TEMPLATES

  // ── form state ──
  const [clientLogoPreview, setClientLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [projectTitle,  setProjectTitle]  = useState(inquiry?.device_details   ?? "")
  const [dateIssued,    setDateIssued]    = useState(today())
  const [clientName,    setClientName]    = useState(inquiry?.name              ?? "")
  const [clientAddress, setClientAddress] = useState(inquiry?.service_location  ?? "")
  const [objective,     setObjective]     = useState(inquiry?.issue_description ?? "")

  const [items,        setItems]        = useState<ItemRow[]>([{ id: uid(), name: "", description: "", qty: 1, unit_price: 0 }])
  const [scopes,       setScopes]       = useState<ScenarioRow[]>([])
  const [waivers,      setWaivers]      = useState<ScenarioRow[]>([])
  const [deliverables, setDeliverables] = useState<DeliverableRow[]>([])

  const [templateId,   setTemplateId]   = useState("")
  const [timelineMin,  setTimelineMin]  = useState("")
  const [timelineMax,  setTimelineMax]  = useState("")
  const [terms,        setTerms]        = useState("")

  // acceptance
  const [customerName, setCustomerName] = useState(inquiry?.name ?? "")
  const [customerSig,  setCustomerSig]  = useState("")
  const [customerDate, setCustomerDate] = useState(today())
  const [providerName, setProviderName] = useState("")
  const [providerSig,  setProviderSig]  = useState("")
  const [providerDate, setProviderDate] = useState(today())

  const [errors, setErrors] = useState<Record<string, string>>({})

  const diagnosticFee = inquiry?.service?.diagnostic_fee ?? 0
  const serviceName   = inquiry?.service?.name           ?? "N/A"

  const timelinePreview = timelineMin && timelineMax
    ? `Estimated completion: ${timelineMin}–${timelineMax} days`
    : timelineMin
    ? `Estimated completion: ${timelineMin} days`
    : ""

  // ── logo upload ──
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setClientLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // ── template load ──
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value)
    setTemplateId(String(id))
    if (!id) return
    // Simulated fetch — replace with: fetch(`/technician/quotation/template/${id}`)
    const tpl = TEMPLATE_DATA[id]
    if (!tpl) return
    setScopes(tpl.scopes.map(s => ({
      id: uid(),
      scenario: s.scenario_name,
      cases: s.cases.map(c => ({ id: uid(), name: c.case_title, description: c.case_description })),
    })))
    setWaivers(tpl.waivers.map(w => ({
      id: uid(),
      scenario: w.waiver_title,
      cases: w.cases.map(c => ({ id: uid(), name: c.case_title, description: c.description })),
    })))
    setDeliverables(tpl.deliverables.map(d => ({ id: uid(), detail: d.deliverable_detail })))
  }

  // ── validation ──
  const validate = (action: string) => {
    const e: Record<string, string> = {}
    if (!projectTitle.trim()) e.projectTitle = "Project title is required."
    if (!clientName.trim())   e.clientName   = "Client name is required."
    if (!dateIssued)          e.dateIssued   = "Date issued is required."
    if (action === "submit_manager" && items.every(r => !r.name.trim()))
      e.items = "Add at least one item before sending to manager."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── submit ──
  const handleSubmit = (action: string) => {
    if (!validate(action)) return
    const payload = {
      inquiry_id:         inquiry?.id,
      project_title:      projectTitle,
      date_issued:        dateIssued,
      client_name:        clientName,
      client_address:     clientAddress,
      objective,
      items,
      scope:              scopes,
      waiver:             waivers,
      deliverables,
      timeline_min_days:  timelineMin,
      timeline_max_days:  timelineMax,
      terms_conditions:   terms,
      customer_name:      customerName,
      customer_signature: customerSig,
      customer_date:      customerDate,
      provider_name:      providerName,
      provider_signature: providerSig,
      provider_date:      providerDate,
      action,
    }
    console.log("Submit payload:", payload)
    // TODO: POST to /quotation/store
  }

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh", background: "#0f172a",
        padding: "28px 32px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#f1f5f9",
      }}
    >
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "transparent", border: "none", color: "#64748b",
          fontSize: 13, cursor: "pointer", padding: "0 0 16px",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
        onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Inquiry Banner */}
      {inquiry && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 10, padding: "11px 16px", marginBottom: 22, fontSize: 13, color: "#93c5fd",
        }}>
          <AlertCircle size={15} />
          <span>
            <strong>Converting Inquiry:</strong>{" "}
            INQ-{String(inquiry.id).padStart(5, "0")} — {inquiry.category}
            {inquiry.contact_number && (
              <span style={{ marginLeft: 8, color: "#60a5fa" }}>| Contact: {inquiry.contact_number}</span>
            )}
          </span>
        </div>
      )}

      {/* Validation errors */}
      {Object.keys(errors).length > 0 && (
        <div style={{
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 10, padding: "12px 16px", marginBottom: 22, color: "#fca5a5", fontSize: 13,
        }}>
          <strong>Please fix the following errors:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
            {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Company Header ── */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
                Techne Fixer Computer and Laptop Repair Services
              </div>
              <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 3 }}>007 Manga Street Crossing Bayabas Davao City</div>
              <div style={{ fontSize: 12.5, color: "#64748b" }}>Contact No: 09662406825 &nbsp;·&nbsp; TIN 618‑863‑736‑000000</div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: 10,
              background: "rgba(99,102,241,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FileText size={22} color="#818cf8" />
            </div>
          </div>

          {/* Client Logo */}
          <div>
            <Label>Client Logo / Face Photo</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {clientLogoPreview
                  ? <img src={clientLogoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <User size={28} color="#334155" />
                }
              </div>
              <div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleLogoChange}
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: 8, padding: "8px 14px", color: "#818cf8",
                    fontSize: 13, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.12)")}
                >
                  <Upload size={14} /> Add Photo
                </button>
                <p style={{ fontSize: 11.5, color: "#475569", marginTop: 6 }}>Upload client's logo or face photo (PNG, JPG)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Project Info ── */}
        <Card>
          <SectionTitle>Project Information</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <Label required>Project Title</Label>
              <Field value={projectTitle} onChange={e => setProjectTitle(e.target.value)}
                style={errors.projectTitle ? { borderColor: "rgba(248,113,113,0.5)" } : {}} />
            </div>
            <div>
              <Label required>Date Issued</Label>
              <Field type="date" value={dateIssued} onChange={e => setDateIssued(e.target.value)}
                style={errors.dateIssued ? { borderColor: "rgba(248,113,113,0.5)" } : {}} />
            </div>
            <div>
              <Label required>Client Company Name</Label>
              <Field value={clientName} onChange={e => setClientName(e.target.value)}
                style={errors.clientName ? { borderColor: "rgba(248,113,113,0.5)" } : {}} />
            </div>
            <div>
              <Label>Client Address</Label>
              <Field value={clientAddress} onChange={e => setClientAddress(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* ── Objective ── */}
        <Card>
          <Label>Objective</Label>
          <Textarea rows={3} value={objective} onChange={e => setObjective(e.target.value)} />
        </Card>

        {/* ── Items ── */}
        <Card>
          <SectionTitle>Items and Services</SectionTitle>
          {errors.items && (
            <div style={{ fontSize: 12, color: "#f87171", marginBottom: 10 }}>{errors.items}</div>
          )}
          <ItemsTable items={items} setItems={setItems} />
          <div style={{ marginTop: 20 }}>
            <Totals items={items} diagnosticFee={diagnosticFee} serviceName={serviceName} />
          </div>
        </Card>

        {/* ── Template Loader ── */}
        <Card>
          <Label>Load Template</Label>
          <select
            value={templateId}
            onChange={handleTemplateChange}
            style={{
              width: "100%", background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
              padding: "9px 13px", color: "#e2e8f0", fontSize: 13,
              outline: "none", cursor: "pointer",
            }}
          >
            <option value="">— Select Service Template —</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
            ))}
          </select>
          <p style={{ fontSize: 11.5, color: "#475569", marginTop: 6 }}>
            Selecting a template will auto-fill scopes, waivers, and deliverables.
          </p>
        </Card>

        {/* ── Scope of Work ── */}
        <Card>
          <SectionTitle>Scope of Work</SectionTitle>
          <ScenarioTable
            rows={scopes} setRows={setScopes}
            scenarioLabel="Scenario" caseLabel="Task"
          />
        </Card>

        {/* ── Scope of Waiver ── */}
        <Card>
          <SectionTitle>Scope of Waiver</SectionTitle>
          <ScenarioTable
            rows={waivers} setRows={setWaivers}
            scenarioLabel="Waiver Scenario" caseLabel="Waiver Case"
          />
        </Card>

        {/* ── Deliverables ── */}
        <Card>
          <SectionTitle>Expected Deliverables</SectionTitle>
          <DeliverablesTable rows={deliverables} setRows={setDeliverables} />
        </Card>

        {/* ── Timeline ── */}
        <Card>
          <Label>Timeline / Completion Schedule</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Field
              type="number" min={1} placeholder="Min"
              value={timelineMin} onChange={e => setTimelineMin(e.target.value)}
              style={{ width: 90 }}
            />
            <span style={{ color: "#475569", fontSize: 13 }}>to</span>
            <Field
              type="number" min={1} placeholder="Max"
              value={timelineMax} onChange={e => setTimelineMax(e.target.value)}
              style={{ width: 90 }}
            />
            <span style={{ color: "#94a3b8", fontSize: 13 }}>days</span>
          </div>
          {timelinePreview && (
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 8, fontStyle: "italic" }}>{timelinePreview}</p>
          )}
        </Card>

        {/* ── Terms & Conditions ── */}
        <Card>
          <Label>Terms and Conditions</Label>
          <Textarea
            rows={5}
            placeholder="Detail payment terms, warranty statements, confidentiality clauses, etc."
            value={terms}
            onChange={e => setTerms(e.target.value)}
          />
        </Card>

        {/* ── Acceptance ── */}
        <Card>
          <SectionTitle>Acceptance of Terms</SectionTitle>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.65 }}>
            By signing below, the Customer acknowledges and agrees to the terms of this quotation and service agreement.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Customer */}
            <div>
              <Label>Customer Name</Label>
              <Field
                value={customerName}
                placeholder="Client / Authorized Representative"
                onChange={e => setCustomerName(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <Field value={customerSig} placeholder="Signature / eSign" onChange={e => setCustomerSig(e.target.value)}
                  style={{ flex: 1, borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none", background: "transparent" }} />
                <Field type="date" value={customerDate} onChange={e => setCustomerDate(e.target.value)} style={{ width: 140 }} />
              </div>
            </div>
            {/* Provider */}
            <div>
              <Label>Service Provider Representative</Label>
              <Field
                value={providerName}
                placeholder="Techne Fixer Representative"
                onChange={e => setProviderName(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <Field value={providerSig} placeholder="Signature / eSign" onChange={e => setProviderSig(e.target.value)}
                  style={{ flex: 1, borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none", background: "transparent" }} />
                <Field type="date" value={providerDate} onChange={e => setProviderDate(e.target.value)} style={{ width: 140 }} />
              </div>
            </div>
          </div>
        </Card>

        {/* ── Action Buttons ── */}
        <div style={{
          display: "flex", justifyContent: "flex-end", gap: 10,
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20,
        }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: "9px 18px", background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
              color: "#94a3b8", fontSize: 13, cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Cancel
          </button>

          <ActionBtn color="#059669" hoverColor="#047857" onClick={() => handleSubmit("draft")}>
            <Save size={14} /> Save Draft
          </ActionBtn>

          <ActionBtn color="#d97706" hoverColor="#b45309" onClick={() => handleSubmit("diagnostic")}>
            <AlertCircle size={14} /> Diagnostic Only
          </ActionBtn>

          <ActionBtn color="#2563eb" hoverColor="#1d4ed8" onClick={() => handleSubmit("submit_manager")}>
            <Send size={14} /> Send to Manager
          </ActionBtn>
        </div>
      </div>
    </div>
  )
}
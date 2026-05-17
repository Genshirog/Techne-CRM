import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, Stethoscope, Plus, Trash2,
  Search, AlertTriangle, CheckCircle2, PenLine,
  BookOpen, X, ChevronDown,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiagnosisCatalogItem {
  id: number
  name: string
  description: string
}

interface InquiryDiagnosis {
  id: number                        // local temp id (negative = unsaved)
  diagnosisCatalogId: number | null
  catalogName: string | null        // resolved display name
  customDiagnosis: string | null
  type: "catalog" | "custom"
}

interface InquiryInfo {
  id: number
  customerName: string
  deviceLabel: string
  itemLabel: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CATALOG: DiagnosisCatalogItem[] = [
  { id: 1,  name: "Pipe Corrosion",         description: "Oxidation of metallic pipe surfaces due to moisture or chemical exposure." },
  { id: 2,  name: "Faulty Wiring",          description: "Damaged or improperly installed electrical wiring posing short-circuit risk." },
  { id: 3,  name: "Compressor Failure",     description: "Mechanical breakdown of the HVAC compressor resulting in loss of cooling." },
  { id: 4,  name: "Thermostat Malfunction", description: "Temperature sensor failure causing inaccurate readings or poor regulation." },
  { id: 5,  name: "Blocked Drainage",       description: "Debris accumulation obstructing wastewater or stormwater drainage lines." },
  { id: 6,  name: "Roof Leak",              description: "Water infiltration through damaged or deteriorated roofing materials." },
  { id: 7,  name: "Structural Crack",       description: "Fractures in load-bearing walls or foundations indicating stress." },
  { id: 8,  name: "Water Heater Failure",   description: "Malfunction of heating elements resulting in insufficient hot water." },
  { id: 9,  name: "Circuit Overload",       description: "Excessive electrical load causing breaker trips or potential hazards." },
  { id: 10, name: "Mold Infestation",       description: "Fungal growth due to persistent moisture or poor ventilation." },
]

const MOCK_INQUIRY: InquiryInfo = {
  id: 42,
  customerName: "Juan dela Cruz",
  deviceLabel: "HVAC Unit — Daikin FTK25",
  itemLabel: "Cooling System",
}

const EXISTING_DIAGNOSES: InquiryDiagnosis[] = [
  { id: 1, diagnosisCatalogId: 3, catalogName: "Compressor Failure", customDiagnosis: null, type: "catalog" },
]

let _tempId = -1
const nextTempId = () => _tempId--

// ─── Component ────────────────────────────────────────────────────────────────

export default function TechnicianDiagnosisPage() {
  const navigate  = useNavigate()
  const { id }    = useParams() // inquiry id

  const [inquiry,    ]         = useState<InquiryInfo>(MOCK_INQUIRY)
  const [diagnoses,  setDiagnoses]  = useState<InquiryDiagnosis[]>(EXISTING_DIAGNOSES)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [showForm,   setShowForm]   = useState(false)

  // ─ Add-form state ─
  const [addType,       setAddType]       = useState<"catalog" | "custom">("catalog")
  const [catalogSearch, setCatalogSearch] = useState("")
  const [selectedItem,  setSelectedItem]  = useState<DiagnosisCatalogItem | null>(null)
  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const [customText,    setCustomText]    = useState("")
  const [addError,      setAddError]      = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filteredCatalog = CATALOG.filter(c =>
    c.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    c.description.toLowerCase().includes(catalogSearch.toLowerCase())
  )

  const alreadyAdded = (catalogId: number) =>
    diagnoses.some(d => d.diagnosisCatalogId === catalogId)

  const handleAdd = () => {
    setAddError(null)

    if (addType === "catalog") {
      if (!selectedItem) { setAddError("Please select a diagnosis from the catalog."); return }
      if (alreadyAdded(selectedItem.id)) { setAddError("This diagnosis is already added."); return }
      setDiagnoses(prev => [...prev, {
        id: nextTempId(),
        diagnosisCatalogId: selectedItem.id,
        catalogName: selectedItem.name,
        customDiagnosis: null,
        type: "catalog",
      }])
    } else {
      if (!customText.trim()) { setAddError("Custom diagnosis cannot be empty."); return }
      setDiagnoses(prev => [...prev, {
        id: nextTempId(),
        diagnosisCatalogId: null,
        catalogName: null,
        customDiagnosis: customText.trim(),
        type: "custom",
      }])
    }

    // reset form
    setSelectedItem(null)
    setCatalogSearch("")
    setCustomText("")
    setShowForm(false)
  }

  const handleRemove = (id: number) => {
    setDiagnoses(prev => prev.filter(d => d.id !== id))
  }

  const handleSave = () => {
    if (diagnoses.length === 0) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    }, 800)
  }

  const cancelForm = () => {
    setShowForm(false)
    setAddError(null)
    setSelectedItem(null)
    setCatalogSearch("")
    setCustomText("")
    setAddType("catalog")
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>

      {/* Back + Header */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Inquiry
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "rgba(99,102,241,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Stethoscope size={18} color="#818cf8" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                Diagnosis
              </h1>
              <p style={{ fontSize: 12.5, color: "#475569", margin: "3px 0 0" }}>
                Inquiry #{inquiry.id} · {inquiry.customerName}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || diagnoses.length === 0}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: saved ? "#059669" : (saving || diagnoses.length === 0) ? "#1e293b" : "#6366f1",
              border: `1px solid ${saved ? "#059669" : (saving || diagnoses.length === 0) ? "rgba(255,255,255,0.08)" : "#6366f1"}`,
              borderRadius: 8, padding: "8px 18px", color: saved ? "#fff" : (diagnoses.length === 0 || saving) ? "#334155" : "#fff",
              fontSize: 13, fontWeight: 500,
              cursor: saving || diagnoses.length === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (diagnoses.length > 0 && !saving && !saved) e.currentTarget.style.background = "#4f46e5" }}
            onMouseLeave={e => { if (!saved) e.currentTarget.style.background = diagnoses.length === 0 || saving ? "#1e293b" : "#6366f1" }}
          >
            <CheckCircle2 size={14} />
            {saved ? "Saved!" : saving ? "Saving…" : "Save Diagnoses"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>

        {/* Left — Diagnoses list + add form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Existing diagnoses */}
          {diagnoses.length === 0 && !showForm && (
            <div style={{
              background: "#1e293b", border: "1px dashed rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "40px 28px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            }}>
              <Stethoscope size={28} color="#334155" />
              <p style={{ fontSize: 13.5, color: "#475569", margin: 0 }}>No diagnoses added yet.</p>
              <p style={{ fontSize: 12.5, color: "#334155", margin: 0 }}>Add at least one before saving.</p>
            </div>
          )}

          {diagnoses.map((d, idx) => (
            <DiagnosisCard
              key={d.id}
              diagnosis={d}
              index={idx + 1}
              onRemove={() => handleRemove(d.id)}
            />
          ))}

          {/* Add form */}
          {showForm ? (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 12, padding: "22px 24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <SectionLabel>Add Diagnosis</SectionLabel>
                <button
                  onClick={cancelForm}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "#475569", padding: 2 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Type toggle */}
              <div style={{
                display: "flex", gap: 0, marginBottom: 18,
                background: "#0f172a", borderRadius: 8, padding: 3,
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                {(["catalog", "custom"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => { setAddType(t); setAddError(null) }}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "7px 0", borderRadius: 6, border: "none",
                      background: addType === t ? "#1e293b" : "transparent",
                      color: addType === t ? "#e2e8f0" : "#475569",
                      fontSize: 13, fontWeight: addType === t ? 500 : 400,
                      cursor: "pointer", transition: "all 0.15s",
                      boxShadow: addType === t ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                    }}
                  >
                    {t === "catalog" ? <BookOpen size={13} /> : <PenLine size={13} />}
                    {t === "catalog" ? "From Catalog" : "Custom"}
                  </button>
                ))}
              </div>

              {/* Catalog picker */}
              {addType === "catalog" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7, fontWeight: 500 }}>
                    Diagnosis <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <div ref={dropdownRef} style={{ position: "relative" }}>
                    {/* Trigger */}
                    <button
                      onClick={() => setDropdownOpen(v => !v)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "#0f172a",
                        border: `1px solid ${addError ? "rgba(248,113,113,0.5)" : dropdownOpen ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 8, padding: "10px 14px", color: selectedItem ? "#e2e8f0" : "#475569",
                        fontSize: 13.5, cursor: "pointer", textAlign: "left", boxSizing: "border-box",
                      }}
                    >
                      <span>{selectedItem ? selectedItem.name : "Select from catalog…"}</span>
                      <ChevronDown size={14} color="#475569" style={{ flexShrink: 0, transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                        background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10, overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}>
                        {/* Search inside dropdown */}
                        <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ position: "relative" }}>
                            <Search size={13} color="#475569" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                            <input
                              autoFocus
                              value={catalogSearch}
                              onChange={e => setCatalogSearch(e.target.value)}
                              placeholder="Search catalog…"
                              style={{
                                width: "100%", paddingLeft: 32, paddingRight: 10,
                                height: 34, background: "#0f172a",
                                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
                                color: "#e2e8f0", fontSize: 13, outline: "none",
                                boxSizing: "border-box",
                              }}
                            />
                          </div>
                        </div>

                        {/* Options */}
                        <div style={{ maxHeight: 220, overflowY: "auto" }}>
                          {filteredCatalog.length === 0 ? (
                            <div style={{ padding: "16px", fontSize: 13, color: "#475569", textAlign: "center" }}>
                              No results found.
                            </div>
                          ) : filteredCatalog.map(item => {
                            const added    = alreadyAdded(item.id)
                            const selected = selectedItem?.id === item.id
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  if (added) return
                                  setSelectedItem(item)
                                  setDropdownOpen(false)
                                  setCatalogSearch("")
                                  setAddError(null)
                                }}
                                style={{
                                  width: "100%", textAlign: "left", padding: "10px 14px",
                                  background: selected ? "rgba(99,102,241,0.12)" : "transparent",
                                  border: "none", cursor: added ? "not-allowed" : "pointer",
                                  display: "flex", flexDirection: "column", gap: 2,
                                  opacity: added ? 0.4 : 1,
                                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                                }}
                                onMouseEnter={e => { if (!added) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                                onMouseLeave={e => { e.currentTarget.style.background = selected ? "rgba(99,102,241,0.12)" : "transparent" }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <span style={{ fontSize: 13.5, fontWeight: 500, color: selected ? "#818cf8" : "#e2e8f0" }}>
                                    {item.name}
                                  </span>
                                  {added && (
                                    <span style={{ fontSize: 11, color: "#475569" }}>Already added</span>
                                  )}
                                </div>
                                <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{item.description}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preview selected */}
                  {selectedItem && (
                    <div style={{
                      marginTop: 10, padding: "10px 14px", borderRadius: 8,
                      background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)",
                    }}>
                      <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                        {selectedItem.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Custom input */}
              {addType === "custom" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7, fontWeight: 500 }}>
                    Custom Diagnosis <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <textarea
                    value={customText}
                    onChange={e => { setCustomText(e.target.value); setAddError(null) }}
                    placeholder="Describe the diagnosis — root cause, affected parts, observed symptoms…"
                    rows={4}
                    style={{
                      width: "100%", background: "#0f172a",
                      border: `1px solid ${addError ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 8, padding: "10px 14px", color: "#e2e8f0",
                      fontSize: 13.5, outline: "none", resize: "vertical",
                      boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.65,
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                    <span style={{ fontSize: 11.5, color: "#475569" }}>{customText.length} chars</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {addError && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "9px 14px", borderRadius: 8, marginBottom: 14,
                  background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)",
                  color: "#f87171", fontSize: 12.5,
                }}>
                  <AlertTriangle size={13} />
                  {addError}
                </div>
              )}

              {/* Form actions */}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={cancelForm}
                  style={{
                    background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "8px 16px", color: "#64748b",
                    fontSize: 13, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)",
                    borderRadius: 8, padding: "8px 16px", color: "#818cf8",
                    fontSize: 13, fontWeight: 500, cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
                >
                  <Plus size={13} /> Add Diagnosis
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "transparent",
                border: "1px dashed rgba(99,102,241,0.3)",
                borderRadius: 10, padding: "13px",
                color: "#6366f1", fontSize: 13.5,
                cursor: "pointer", width: "100%", transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(99,102,241,0.07)"
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"
              }}
            >
              <Plus size={15} /> Add Diagnosis
            </button>
          )}
        </div>

        {/* Right — Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Inquiry info */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Inquiry Info</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <MetaRow label="Customer"  value={inquiry.customerName} />
              <MetaRow label="Device"    value={inquiry.deviceLabel} />
              <MetaRow label="Item"      value={inquiry.itemLabel} />
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Summary</SectionLabel>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>Total diagnoses</span>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: "#e2e8f0",
                  background: "rgba(99,102,241,0.12)", padding: "2px 10px",
                  borderRadius: 20,
                }}>
                  {diagnoses.length}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>From catalog</span>
                <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                  {diagnoses.filter(d => d.type === "catalog").length}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>Custom</span>
                <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                  {diagnoses.filter(d => d.type === "custom").length}
                </span>
              </div>
            </div>
          </div>

          {/* Billing note */}
          <div style={{
            background: "#1e293b",
            border: "1px solid rgba(251,191,36,0.15)",
            borderRadius: 12, padding: "18px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <AlertTriangle size={13} color="#fbbf24" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Billing Note
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.65 }}>
              If the customer stops at diagnosis,
              a <strong style={{ color: "#94a3b8" }}>₱500 diagnosis fee</strong> applies.
              If they proceed to quotation, diagnosis is <strong style={{ color: "#94a3b8" }}>free</strong> and
              50% downpayment is required.
            </p>
          </div>

          {/* Tips */}
          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Tips</SectionLabel>
            <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Add all findings before saving — you can add multiple.",
                "Use catalog entries when possible for consistency.",
                "Custom notes are for unique or unlisted conditions.",
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55 }}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Diagnosis Card ───────────────────────────────────────────────────────────

function DiagnosisCard({
  diagnosis, index, onRemove,
}: {
  diagnosis: InquiryDiagnosis
  index: number
  onRemove: () => void
}) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  const isCatalog = diagnosis.type === "catalog"

  return (
    <div style={{
      background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "18px 20px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#475569",
            background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 6, padding: "2px 8px",
          }}>
            #{index}
          </span>
          <span style={{
            fontSize: 11.5, fontWeight: 500,
            padding: "2px 9px", borderRadius: 20,
            background: isCatalog ? "rgba(99,102,241,0.1)" : "rgba(251,191,36,0.1)",
            color: isCatalog ? "#818cf8" : "#fbbf24",
          }}>
            {isCatalog ? "Catalog" : "Custom"}
          </span>
        </div>

        {/* Remove */}
        {confirmRemove ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#f87171" }}>Remove?</span>
            <button
              onClick={onRemove}
              style={{
                background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: 6, padding: "4px 10px", color: "#f87171",
                fontSize: 12, cursor: "pointer",
              }}
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmRemove(false)}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6, padding: "4px 10px", color: "#64748b",
                fontSize: 12, cursor: "pointer",
              }}
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmRemove(true)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 7,
              background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
              color: "#475569", cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(248,113,113,0.1)"
              e.currentTarget.style.color = "#f87171"
              e.currentTarget.style.borderColor = "rgba(248,113,113,0.25)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "#475569"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"
            }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", margin: "0 0 4px" }}>
          {isCatalog ? diagnosis.catalogName : "Custom Diagnosis"}
        </p>
        {isCatalog
          ? (
            <p style={{ fontSize: 12.5, color: "#475569", margin: 0, lineHeight: 1.6 }}>
              {CATALOG.find(c => c.id === diagnosis.diagnosisCatalogId)?.description ?? "—"}
            </p>
          )
          : (
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
              {diagnosis.customDiagnosis}
            </p>
          )
        }
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.6px" }}>
      {children}
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: "#cbd5e1" }}>{value}</div>
    </div>
  )
}
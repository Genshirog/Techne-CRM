import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, Stethoscope, Save, Trash2,
  RotateCcw, Clock, Calendar, AlertTriangle,
} from "lucide-react"
import api from "../../../api/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiagnosisCatalog {
  id: number | null
  name: string
  description: string
  createdAt: string | null
  deletedAt: string | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDiagnosisDetailPage() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = id === "new"

  const [form,           setForm]           = useState({ name: "", description: "" })
  const [record,         setRecord]         = useState<DiagnosisCatalog>({ id: null, name: "", description: "", createdAt: null, deletedAt: null })
  const [loading,        setLoading]        = useState(!isNew)
  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [errors,         setErrors]         = useState<{ name?: string; description?: string }>({})
  const [fetchError,     setFetchError]     = useState<string | null>(null)

  const isDirty    = form.name !== record.name || form.description !== record.description
  const isArchived = record.deletedAt !== null

  // ── Fetch existing record ──────────────────────────────────────────────────
  useEffect(() => {
    if (isNew) return
    const fetch = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/diagnosis/${id}`)
        const d   = res.data
        const mapped: DiagnosisCatalog = {
          id:          d.id,
          name:        d.name,
          description: d.description,
          createdAt:   new Date(d.createdAt).toLocaleDateString("en-PH", {
            month: "long", day: "numeric", year: "numeric",
          }),
          deletedAt:   null, // API doesn't return deletedAt — tracked locally
        }
        setRecord(mapped)
        setForm({ name: d.name, description: d.description })
      } catch {
        setFetchError("Failed to load diagnosis record.")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e: typeof errors = {}
    if (!form.name.trim())        e.name        = "Name is required."
    if (!form.description.trim()) e.description = "Description is required."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (isNew) {
        const res = await api.post("/diagnosis", {
          name:        form.name,
          description: form.description,
        })
        setSaved(true)
        setTimeout(() => {
          setSaved(false)
          navigate(`/admin/diagnosis/${res.data.id}`)
        }, 1000)
      } else {
        await api.put("/diagnosis", {
          id:          record.id,
          name:        form.name,
          description: form.description,
        })
        setRecord(prev => ({ ...prev, name: form.name, description: form.description }))
        setSaved(true)
        setTimeout(() => setSaved(false), 2200)
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save diagnosis.")
    } finally {
      setSaving(false)
    }
  }

  // ── Archive ────────────────────────────────────────────────────────────────
  const handleArchive = async () => {
    try {
      await api.delete(`/diagnosis/${record.id}`)
      setRecord(prev => ({ ...prev, deletedAt: new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) }))
    } catch {
      alert("Failed to archive diagnosis.")
    }
    setConfirmArchive(false)
  }

  const handleRestore = () => {
    // local restore — add restore endpoint if needed
    setRecord(prev => ({ ...prev, deletedAt: null }))
  }

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
      Loading...
    </div>
  )

  if (fetchError) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>
      {fetchError}
    </div>
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>
      {/* Back + Header */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => navigate("/admin/diagnosis")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: "#64748b",
            fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Catalog
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
                {isNew ? "New Diagnosis" : record.name}
              </h1>
              {!isNew && (
                <p style={{ fontSize: 12.5, color: "#475569", margin: "3px 0 0" }}>
                  ID #{record.id}
                  {isArchived && (
                    <span style={{
                      marginLeft: 10, padding: "2px 9px", borderRadius: 20,
                      background: "rgba(248,113,113,0.1)", color: "#f87171",
                      fontSize: 11.5, fontWeight: 500,
                    }}>Archived</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            {!isNew && !isArchived && (
              confirmArchive ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, color: "#f87171" }}>Archive this diagnosis?</span>
                  <button
                    onClick={handleArchive}
                    style={{
                      background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
                      borderRadius: 7, padding: "7px 14px", color: "#f87171",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >Confirm</button>
                  <button
                    onClick={() => setConfirmArchive(false)}
                    style={{
                      background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 7, padding: "7px 14px", color: "#64748b",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmArchive(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "transparent", border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: 8, padding: "8px 14px", color: "#f87171",
                    fontSize: 13, cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Trash2 size={13} /> Archive
                </button>
              )
            )}

            {isArchived && (
              <button
                onClick={handleRestore}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: 8, padding: "8px 14px", color: "#34d399",
                  fontSize: 13, cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.1)")}
              >
                <RotateCcw size={13} /> Restore
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={saving || (!isDirty && !isNew)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: saved ? "#059669" : (saving || (!isDirty && !isNew)) ? "#334155" : "#6366f1",
                border: "none", borderRadius: 8,
                padding: "8px 18px", color: "#fff",
                fontSize: 13, fontWeight: 500,
                cursor: saving || (!isDirty && !isNew) ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!saving && (isDirty || isNew) && !saved)
                  e.currentTarget.style.background = "#4f46e5"
              }}
              onMouseLeave={(e) => {
                if (!saving && !saved)
                  e.currentTarget.style.background = (isDirty || isNew) ? "#6366f1" : "#334155"
              }}
            >
              <Save size={14} />
              {saved ? "Saved!" : saving ? "Saving…" : isNew ? "Create" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Archived Banner */}
      {isArchived && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(248,113,113,0.07)",
          border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20,
          color: "#f87171", fontSize: 13,
        }}>
          <AlertTriangle size={15} />
          This diagnosis is archived and won't appear in active workflows.
          Archived on <strong style={{ marginLeft: 4 }}>{record.deletedAt}</strong>.
        </div>
      )}

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 288px", gap: 20 }}>

        {/* Left — Form */}
        <div style={{
          background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "26px 28px",
          display: "flex", flexDirection: "column", gap: 22,
        }}>
          <SectionLabel>Details</SectionLabel>

          <div>
            <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7, fontWeight: 500 }}>
              Name <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => {
                setForm(f => ({ ...f, name: e.target.value }))
                if (errors.name) setErrors(er => ({ ...er, name: undefined }))
              }}
              placeholder="e.g. Overheating"
              disabled={isArchived}
              style={{
                width: "100%", background: "#0f172a",
                border: `1px solid ${errors.name ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, padding: "10px 14px", color: "#e2e8f0",
                fontSize: 13.5, outline: "none", boxSizing: "border-box",
                opacity: isArchived ? 0.5 : 1,
              }}
            />
            {errors.name && <p style={{ fontSize: 12, color: "#f87171", margin: "6px 0 0" }}>{errors.name}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7, fontWeight: 500 }}>
              Description <span style={{ color: "#f87171" }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => {
                setForm(f => ({ ...f, description: e.target.value }))
                if (errors.description) setErrors(er => ({ ...er, description: undefined }))
              }}
              placeholder="Describe the diagnosis — causes, symptoms, affected systems…"
              rows={6}
              disabled={isArchived}
              style={{
                width: "100%", background: "#0f172a",
                border: `1px solid ${errors.description ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, padding: "10px 14px", color: "#e2e8f0",
                fontSize: 13.5, outline: "none", resize: "vertical",
                boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.65,
                opacity: isArchived ? 0.5 : 1,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              {errors.description
                ? <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>{errors.description}</p>
                : <span />}
              <span style={{ fontSize: 11.5, color: "#475569" }}>{form.description.length} chars</span>
            </div>
          </div>

          <div style={{
            padding: "14px 16px", borderRadius: 9,
            background: "rgba(99,102,241,0.06)",
            border: "1px dashed rgba(99,102,241,0.2)",
          }}>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              <span style={{ color: "#818cf8", fontWeight: 500 }}>Coming soon:</span>{" "}
              Service category association — link this diagnosis to a specific service type.
            </p>
          </div>
        </div>

        {/* Right — Metadata */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!isNew && (
            <div style={{
              background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "20px 22px",
            }}>
              <SectionLabel>Record Info</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
                <MetaRow
                  icon={<Calendar size={13} color="#818cf8" />}
                  label="Created"
                  value={record.createdAt ?? "—"}
                />
                {record.deletedAt && (
                  <MetaRow
                    icon={<Trash2 size={13} color="#f87171" />}
                    label="Archived"
                    value={record.deletedAt}
                  />
                )}
              </div>
            </div>
          )}

          <div style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <SectionLabel>Writing Tips</SectionLabel>
            <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Be specific about root causes, not just symptoms.",
                "Mention which systems or materials are affected.",
                "Keep it under 300 characters for readability.",
                "Avoid jargon — technicians and staff both read this.",
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55 }}>{tip}</li>
              ))}
            </ul>
          </div>

          {!isNew && !isArchived && (
            <div style={{
              background: "#1e293b",
              border: "1px solid rgba(248,113,113,0.15)",
              borderRadius: 12, padding: "20px 22px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>
                Danger Zone
              </div>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 14px", lineHeight: 1.6 }}>
                Archiving removes this diagnosis from active workflows. You can restore it later.
              </p>
              <button
                onClick={() => setConfirmArchive(true)}
                style={{
                  width: "100%", background: "transparent",
                  border: "1px solid rgba(248,113,113,0.25)",
                  borderRadius: 8, padding: "8px", color: "#f87171",
                  fontSize: 13, cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Archive Diagnosis
              </button>
            </div>
          )}
        </div>
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

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: "#cbd5e1" }}>{value}</div>
      </div>
    </div>
  )
}
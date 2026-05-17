import { useState } from "react"
import {
  ArrowLeft,
  Ticket,
  Wrench,
  AlertTriangle,
  FileText,
  CalendarDays,
  Paperclip,
  X,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Priority = "Low" | "Medium" | "High" | "Urgent"

interface FormState {
  service: string
  subject: string
  priority: Priority
  description: string
  preferredDate: string
  attachments: File[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  "Air Conditioner Installation",
  "Electrical Wiring Maintenance",
  "Office Renovation Service",
  "General Cleaning Service",
  "Solar Panel Installation",
  "Interior Painting",
  "Other / Not Listed",
]

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; bg: string; color: string; description: string }
> = {
  Low: {
    label: "Low",
    bg: "rgba(100,116,139,0.12)",
    color: "#94a3b8",
    description: "No urgency, general inquiry",
  },
  Medium: {
    label: "Medium",
    bg: "rgba(59,130,246,0.12)",
    color: "#60a5fa",
    description: "Needs attention within a few days",
  },
  High: {
    label: "High",
    bg: "rgba(245,158,11,0.12)",
    color: "#fbbf24",
    description: "Affects daily operations",
  },
  Urgent: {
    label: "Urgent",
    bg: "rgba(239,68,68,0.12)",
    color: "#f87171",
    description: "Immediate attention required",
  },
}

const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"]

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CreateTicketPage() {
  const [form, setForm] = useState<FormState>({
    service: "",
    subject: "",
    priority: "Medium",
    description: "",
    preferredDate: "",
    attachments: [],
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [generatedId] = useState(
    () => `TKT-${Math.floor(2300 + Math.random() * 100)}`
  )

  // ─── Helpers ────────────────────────────────────────
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!form.service) newErrors.service = "Please select a service."
    if (!form.subject.trim()) newErrors.subject = "Subject is required."
    if (form.subject.trim().length < 10)
      newErrors.subject = "Subject must be at least 10 characters."
    if (!form.description.trim())
      newErrors.description = "Please describe your issue."
    if (form.description.trim().length < 20)
      newErrors.description = "Description must be at least 20 characters."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setSubmitted(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    set("attachments", [...form.attachments, ...files].slice(0, 5))
  }

  const removeFile = (index: number) => {
    set(
      "attachments",
      form.attachments.filter((_, i) => i !== index)
    )
  }

  // ─── Success Screen ─────────────────────────────────
  if (submitted) {
    return (
      <SuccessScreen
        ticketId={generatedId}
        subject={form.subject}
        service={form.service}
        priority={form.priority}
      />
    )
  }

  // ─── Form ────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 32px",
          position: "sticky",
          top: 0,
          background: "#0f172a",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <a
            href="/tickets"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              marginBottom: 8,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={13} />
            Back to Tickets
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Ticket size={18} color="#818cf8" />
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              Create a Ticket
            </h1>
          </div>

          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Describe your concern and we'll assign the right technician.
          </p>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "36px 32px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >

        {/* ── Service Selection ── */}
        <FormSection
          icon={<Wrench size={15} />}
          title="Service"
          subtitle="Which service does this ticket relate to?"
        >
          <div style={{ position: "relative" }}>
            <select
              value={form.service}
              onChange={(e) => set("service", e.target.value)}
              style={{
                width: "100%",
                height: 46,
                paddingLeft: 14,
                paddingRight: 40,
                borderRadius: 12,
                border: errors.service
                  ? "1px solid #f87171"
                  : "1px solid rgba(255,255,255,0.08)",
                background: "#1e293b",
                color: form.service ? "#f8fafc" : "#64748b",
                fontSize: 14,
                appearance: "none",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="" disabled>
                Select a service...
              </option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              color="#64748b"
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {errors.service && <FieldError>{errors.service}</FieldError>}
        </FormSection>

        {/* ── Subject ── */}
        <FormSection
          icon={<FileText size={15} />}
          title="Subject"
          subtitle="A brief, clear summary of the issue."
        >
          <input
            type="text"
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            placeholder="e.g. Aircon leaking water after cleaning"
            maxLength={120}
            style={{
              width: "100%",
              height: 46,
              padding: "0 14px",
              borderRadius: 12,
              border: errors.subject
                ? "1px solid #f87171"
                : "1px solid rgba(255,255,255,0.08)",
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            {errors.subject ? (
              <FieldError>{errors.subject}</FieldError>
            ) : (
              <span />
            )}
            <span style={{ fontSize: 11, color: "#334155" }}>
              {form.subject.length}/120
            </span>
          </div>
        </FormSection>

        {/* ── Priority ── */}
        <FormSection
          icon={<AlertTriangle size={15} />}
          title="Priority"
          subtitle="How urgently does this need to be addressed?"
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {PRIORITIES.map((p) => {
              const cfg = PRIORITY_CONFIG[p]
              const isSelected = form.priority === p

              return (
                <button
                  key={p}
                  onClick={() => set("priority", p)}
                  style={{
                    padding: "12px 8px",
                    borderRadius: 12,
                    border: isSelected
                      ? `1.5px solid ${cfg.color}50`
                      : "1px solid rgba(255,255,255,0.06)",
                    background: isSelected ? cfg.bg : "#1e293b",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isSelected ? cfg.color : "#94a3b8",
                      marginBottom: 4,
                    }}
                  >
                    {cfg.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isSelected ? cfg.color + "aa" : "#475569",
                      lineHeight: 1.4,
                    }}
                  >
                    {cfg.description}
                  </div>
                </button>
              )
            })}
          </div>
        </FormSection>

        {/* ── Description ── */}
        <FormSection
          icon={<FileText size={15} />}
          title="Description"
          subtitle="Provide as much detail as possible about the issue."
        >
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the problem in detail. Include when it started, what you've tried, and any relevant context..."
            rows={6}
            maxLength={2000}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: errors.description
                ? "1px solid #f87171"
                : "1px solid rgba(255,255,255,0.08)",
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: 14,
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              lineHeight: 1.7,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            {errors.description ? (
              <FieldError>{errors.description}</FieldError>
            ) : (
              <span />
            )}
            <span style={{ fontSize: 11, color: "#334155" }}>
              {form.description.length}/2000
            </span>
          </div>
        </FormSection>

        {/* ── Preferred Date ── */}
        <FormSection
          icon={<CalendarDays size={15} />}
          title="Preferred Visit Date"
          subtitle="Optional — when would be a convenient time for our technician?"
          optional
        >
          <input
            type="date"
            value={form.preferredDate}
            onChange={(e) => set("preferredDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            style={{
              width: "100%",
              height: 46,
              padding: "0 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#1e293b",
              color: form.preferredDate ? "#f8fafc" : "#64748b",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              colorScheme: "dark",
            }}
          />
        </FormSection>

        {/* ── Attachments ── */}
        <FormSection
          icon={<Paperclip size={15} />}
          title="Attachments"
          subtitle="Optional — upload photos or documents to support your ticket. Max 5 files."
          optional
        >
          {/* Drop zone */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              height: 110,
              borderRadius: 12,
              border: "1.5px dashed rgba(255,255,255,0.1)",
              background: "#1e293b",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(129,140,248,0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(255,255,255,0.1)"
            }}
          >
            <Paperclip size={20} color="#334155" />
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Click to upload or drag and drop
            </span>
            <span style={{ fontSize: 11, color: "#334155" }}>
              PNG, JPG, PDF up to 10MB each
            </span>
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf,.heic"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={form.attachments.length >= 5}
            />
          </label>

          {/* File List */}
          {form.attachments.length > 0 && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {form.attachments.map((file, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <FileText size={14} color="#818cf8" />
                    <div>
                      <div style={{ fontSize: 13, color: "#e2e8f0" }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        {(file.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(i)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      display: "flex",
                      padding: 4,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        {/* ── Submit ── */}
        <div
          style={{
            paddingTop: 8,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 12,
          }}
        >
          <a
            href="/tickets"
            style={{
              height: 44,
              padding: "0 20px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "#64748b",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            Cancel
          </a>

          <button
            onClick={handleSubmit}
            style={{
              height: 44,
              padding: "0 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
            }}
          >
            Submit Ticket
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Success Screen
// ─────────────────────────────────────────────────────────────────────────────

function SuccessScreen({
  ticketId,
  subject,
  service,
  priority,
}: {
  ticketId: string
  subject: string
  service: string
  priority: Priority
}) {
  const cfg = PRIORITY_CONFIG[priority]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 24,
          padding: "44px 40px",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "rgba(52,211,153,0.1)",
            border: "1.5px solid rgba(52,211,153,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 22px",
          }}
        >
          <CheckCircle2 size={30} color="#34d399" />
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>
          Ticket Submitted!
        </h2>

        <p style={{ margin: "0 0 30px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
          We've received your request and will assign a technician shortly.
          You'll be notified via email once someone is assigned.
        </p>

        {/* Ticket details */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            padding: "20px 22px",
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Ticket Reference
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#818cf8",
                background: "rgba(99,102,241,0.1)",
                padding: "4px 12px",
                borderRadius: 8,
              }}
            >
              {ticketId}
            </span>
          </div>

          {[
            { label: "Subject", value: subject },
            { label: "Service", value: service },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                padding: "9px 0",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ color: "#64748b" }}>{row.label}</span>
              <span style={{ color: "#e2e8f0", maxWidth: "60%", textAlign: "right" }}>
                {row.value}
              </span>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              padding: "9px 0",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span style={{ color: "#64748b" }}>Priority</span>
            <span
              style={{
                background: cfg.bg,
                color: cfg.color,
                fontSize: 12,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 999,
              }}
            >
              {priority}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <a
            href="/tickets"
            style={{
              height: 42,
              padding: "0 20px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "#94a3b8",
              fontSize: 13,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            View All Tickets
          </a>

          <a
            href={`/tickets/${ticketId}`}
            style={{
              height: 42,
              padding: "0 20px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
            }}
          >
            View Ticket <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Section
// ─────────────────────────────────────────────────────────────────────────────

function FormSection({
  icon,
  title,
  subtitle,
  optional = false,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span style={{ color: "#818cf8" }}>{icon}</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
          {optional && (
            <span
              style={{
                fontSize: 11,
                color: "#475569",
                background: "rgba(255,255,255,0.04)",
                padding: "2px 8px",
                borderRadius: 999,
              }}
            >
              Optional
            </span>
          )}
        </div>
        <p style={{ margin: "0 0 0 26px", fontSize: 12.5, color: "#64748b" }}>
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  )
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: "#f87171",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {children}
    </span>
  )
}
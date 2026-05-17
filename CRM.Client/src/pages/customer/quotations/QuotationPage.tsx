import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Send,
  ShieldCheck,
  Wrench,
  Receipt,
  Package,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type QuoteStatus =
  | "Pending"
  | "Sent"
  | "Accepted"
  | "Rejected"
  | "Expired"

interface QuoteItem {
  name: string
  description: string
  qty: number
  price: number
}

interface CustomerQuotation {
  id: string
  inquiryId: string
  service: string
  customer: string
  issuedAt: string
  validUntil: string
  status: QuoteStatus
  notes: string
  technician: string
  items: QuoteItem[]
  diagnosticFee: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_QUOTE: CustomerQuotation = {
  id: "QUO-1040",
  inquiryId: "INQ-1040",
  service: "Kitchen Sink Leak Repair",
  customer: "Aisha Okonkwo",
  issuedAt: "May 8, 2026 — 11:12 AM",
  validUntil: "May 15, 2026",
  status: "Sent",
  technician: "Paulo Mendez",
  notes:
    "Quotation includes labor, replacement P-trap assembly, compression fittings, sealing materials, and testing after installation.",

  diagnosticFee: 500,

  items: [
    {
      name: "P-Trap Replacement",
      description: "1.5 inch PVC P-trap assembly",
      qty: 1,
      price: 1200,
    },
    {
      name: "Compression Fittings",
      description: "Heavy duty leak-resistant fittings",
      qty: 2,
      price: 350,
    },
    {
      name: "Labor",
      description: "Removal, installation, sealing, and testing",
      qty: 1,
      price: 1800,
    },
    {
      name: "Water Damage Sealant",
      description: "Cabinet moisture protection treatment",
      qty: 1,
      price: 750,
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<
  QuoteStatus,
  {
    bg: string
    color: string
    border: string
    icon: React.ReactNode
  }
> = {
  Pending: {
    bg: "rgba(245,158,11,0.12)",
    color: "#f59e0b",
    border: "rgba(245,158,11,0.2)",
    icon: <Clock size={14} />,
  },

  Sent: {
    bg: "rgba(59,130,246,0.12)",
    color: "#60a5fa",
    border: "rgba(59,130,246,0.2)",
    icon: <Send size={14} />,
  },

  Accepted: {
    bg: "rgba(16,185,129,0.12)",
    color: "#34d399",
    border: "rgba(16,185,129,0.2)",
    icon: <CheckCircle2 size={14} />,
  },

  Rejected: {
    bg: "rgba(239,68,68,0.12)",
    color: "#f87171",
    border: "rgba(239,68,68,0.2)",
    icon: <XCircle size={14} />,
  },

  Expired: {
    bg: "rgba(148,163,184,0.12)",
    color: "#94a3b8",
    border: "rgba(148,163,184,0.2)",
    icon: <AlertTriangle size={14} />,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const money = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n)

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomerQuotationDetailPage() {
  const navigate = useNavigate()

  const [status, setStatus] = useState<QuoteStatus>(
    MOCK_QUOTE.status
  )

  const quote = MOCK_QUOTE

  const subtotal = useMemo(() => {
    return quote.items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    )
  }, [quote.items])

  const tax = subtotal * 0.1

  const total =
    subtotal + tax + quote.diagnosticFee

  const style = STATUS_STYLE[status]

  const canRespond =
    status === "Sent" || status === "Pending"

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#f8fafc",
        fontFamily:
          "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(15,23,42,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "16px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => navigate("/quotations")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <ArrowLeft size={15} />
            My Quotations
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 38,
              padding: "0 14px",
              borderRadius: 10,
              border:
                "1px solid rgba(255,255,255,0.06)",
              background: "#1e293b",
              color: "#e2e8f0",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "28px 32px 60px",
        }}
      >
        {/* Hero */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#1e293b 0%, #172033 100%)",
            border:
              "1px solid rgba(255,255,255,0.06)",
            borderRadius: 22,
            padding: 28,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background:
                      "rgba(99,102,241,0.15)",
                    color: "#818cf8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Receipt size={24} />
                </div>

                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: 26,
                      fontWeight: 700,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {quote.service}
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      marginTop: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <StatusBadge status={status} />

                    <span
                      style={{
                        fontSize: 12.5,
                        color: "#64748b",
                      }}
                    >
                      {quote.id}
                    </span>
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  color: "#94a3b8",
                  maxWidth: 760,
                  margin: "14px 0 0",
                }}
              >
                {quote.notes}
              </p>
            </div>

            <div
              style={{
                minWidth: 240,
                background: "#0f172a",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginBottom: 8,
                }}
              >
                Grand Total
              </div>

              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: "-1px",
                }}
              >
                {money(total)}
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <MetaRow
                  icon={<Calendar size={13} />}
                  label="Issued"
                  value={quote.issuedAt}
                />

                <MetaRow
                  icon={<Clock size={13} />}
                  label="Valid Until"
                  value={quote.validUntil}
                />

                <MetaRow
                  icon={<Wrench size={13} />}
                  label="Technician"
                  value={quote.technician}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 18,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* Items */}
            <Card>
              <SectionTitle
                icon={<Package size={15} />}
                title="Quotation Breakdown"
              />

              <div style={{ marginTop: 18 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "Item",
                        "Qty",
                        "Price",
                        "Total",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            paddingBottom: 12,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#64748b",
                            textTransform: "uppercase",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {quote.items.map((item, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            padding: "16px 0",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 600,
                                color: "#f8fafc",
                              }}
                            >
                              {item.name}
                            </div>

                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 12.5,
                                color: "#64748b",
                                lineHeight: 1.6,
                              }}
                            >
                              {item.description}
                            </div>
                          </div>
                        </td>

                        <td
                          style={{
                            fontSize: 13,
                            color: "#cbd5e1",
                          }}
                        >
                          {item.qty}
                        </td>

                        <td
                          style={{
                            fontSize: 13,
                            color: "#cbd5e1",
                          }}
                        >
                          {money(item.price)}
                        </td>

                        <td
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#f8fafc",
                          }}
                        >
                          {money(
                            item.qty * item.price
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Notes */}
            <Card>
              <SectionTitle
                icon={<ShieldCheck size={15} />}
                title="Terms & Notes"
              />

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  "Quotation validity is limited to the stated expiration date.",
                  "Parts availability may affect repair schedule.",
                  "Additional hidden damage may require approval before proceeding.",
                  "Workmanship includes post-repair testing and verification.",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <CheckCircle2
                      size={14}
                      color="#34d399"
                      style={{
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />

                    <span
                      style={{
                        fontSize: 13.5,
                        color: "#94a3b8",
                        lineHeight: 1.7,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              position: "sticky",
              top: 92,
            }}
          >
            {/* Summary */}
            <Card>
              <SectionTitle
                icon={<FileText size={15} />}
                title="Payment Summary"
              />

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <PriceRow
                  label="Subtotal"
                  value={money(subtotal)}
                />

                <PriceRow
                  label="Diagnostic Fee"
                  value={money(
                    quote.diagnosticFee
                  )}
                />

                <PriceRow
                  label="Tax (10%)"
                  value={money(tax)}
                />

                <div
                  style={{
                    height: 1,
                    background:
                      "rgba(255,255,255,0.06)",
                  }}
                />

                <PriceRow
                  label="Grand Total"
                  value={money(total)}
                  strong
                />
              </div>
            </Card>

            {/* Actions */}
            {canRespond && (
              <Card>
                <SectionTitle
                  icon={<CheckCircle2 size={15} />}
                  title="Respond to Quotation"
                />

                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <button
                    onClick={() =>
                      setStatus("Accepted")
                    }
                    style={{
                      height: 44,
                      borderRadius: 10,
                      border: "none",
                      background: "#6366f1",
                      color: "#fff",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Accept Quotation
                  </button>

                  <button
                    onClick={() =>
                      setStatus("Rejected")
                    }
                    style={{
                      height: 44,
                      borderRadius: 10,
                      background:
                        "rgba(239,68,68,0.12)",
                      border:
                        "1px solid rgba(239,68,68,0.18)",
                      color: "#f87171",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Reject Quotation
                  </button>
                </div>
              </Card>
            )}

            {/* Accepted */}
            {status === "Accepted" && (
              <Card>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background:
                        "rgba(16,185,129,0.15)",
                      color: "#34d399",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      Quotation Accepted
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "#94a3b8",
                        lineHeight: 1.7,
                      }}
                    >
                      Your technician has been
                      notified. Repair scheduling
                      will proceed shortly.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI
// ─────────────────────────────────────────────────────────────────────────────

function Card({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 18,
        padding: 22,
      }}
    >
      {children}
    </div>
  )
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode
  title: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ color: "#818cf8" }}>
        {icon}
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#e2e8f0",
        }}
      >
        {title}
      </div>
    </div>
  )
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
      }}
    >
      <div style={{ color: "#64748b" }}>
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 12.5,
            color: "#e2e8f0",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}

function PriceRow({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: strong ? 14 : 13,
          fontWeight: strong ? 700 : 500,
          color: strong
            ? "#f8fafc"
            : "#94a3b8",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: strong ? 18 : 13.5,
          fontWeight: strong ? 800 : 700,
          color: "#f8fafc",
        }}
      >
        {value}
      </span>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: QuoteStatus
}) {
  const s = STATUS_STYLE[status]

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {s.icon}
      {status}
    </span>
  )
}
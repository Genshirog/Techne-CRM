import { useMemo, useState } from "react"
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wallet,
  QrCode,
  Copy,
  Download,
  Building2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type InvoiceStatus =
  | "Unpaid"
  | "DiagnosisPaid"
  | "DownpaymentPaid"
  | "FullyPaid"
  | "Overdue"

type PaymentMethod =
  | "GCash"
  | "BankTransfer"
  | "Cash"

type PaymentStage =
  | "Diagnosis"
  | "Downpayment"
  | "Final"

interface PaymentItem {
  id: number
  stage: PaymentStage
  amount: number
  method: PaymentMethod
  paidAt: string
  referenceNumber?: string
}

interface InvoiceItem {
  id: number
  invoiceNumber: string
  serviceTitle: string
  customer: string

  diagnosisFee: number
  estimatedTotal: number
  finalTotal: number
  downpaymentAmount: number
  balanceDue: number
  discountAmount: number

  dueDate: string
  createdAt: string
  status: InvoiceStatus

  qrCodeUrl: string
  gcashNumber: string
  accountName: string

  payments: PaymentItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_INVOICE: InvoiceItem = {
  id: 1,
  invoiceNumber: "INV-2026-1044",
  serviceTitle: "Kitchen Plumbing Repair",
  customer: "Juan Dela Cruz",

  diagnosisFee: 500,
  estimatedTotal: 4500,
  finalTotal: 4200,
  downpaymentAmount: 2000,
  balanceDue: 2200,
  discountAmount: 300,

  dueDate: "May 20, 2026",
  createdAt: "May 16, 2026",

  status: "DownpaymentPaid",

  qrCodeUrl:
    "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=GCASH_PAYMENT_INV_2026_1044",

  gcashNumber: "09171234567",
  accountName: "CRM Services Inc.",

  payments: [
    {
      id: 1,
      stage: "Diagnosis",
      amount: 500,
      method: "GCash",
      paidAt: "May 10, 2026",
      referenceNumber: "GC1238891",
    },
    {
      id: 2,
      stage: "Downpayment",
      amount: 2000,
      method: "GCash",
      paidAt: "May 12, 2026",
      referenceNumber: "GC7281912",
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<
  InvoiceStatus,
  {
    bg: string
    color: string
    label: string
  }
> = {
  Unpaid: {
    bg: "rgba(251,191,36,0.12)",
    color: "#fbbf24",
    label: "Unpaid",
  },

  DiagnosisPaid: {
    bg: "rgba(96,165,250,0.12)",
    color: "#60a5fa",
    label: "Diagnosis Paid",
  },

  DownpaymentPaid: {
    bg: "rgba(167,139,250,0.12)",
    color: "#a78bfa",
    label: "Downpayment Paid",
  },

  FullyPaid: {
    bg: "rgba(52,211,153,0.12)",
    color: "#34d399",
    label: "Fully Paid",
  },

  Overdue: {
    bg: "rgba(248,113,113,0.12)",
    color: "#f87171",
    label: "Overdue",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomerInvoicePage() {
  const navigate = useNavigate()

  const invoice = MOCK_INVOICE

  const [copied, setCopied] = useState(false)

  const totalPaid = useMemo(() => {
    return invoice.payments.reduce(
      (sum, p) => sum + p.amount,
      0
    )
  }, [invoice])

  const remaining = invoice.finalTotal - totalPaid

  const statusStyle = STATUS_STYLE[invoice.status]

  const copyGCash = async () => {
    await navigator.clipboard.writeText(
      invoice.gcashNumber
    )

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

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
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "16px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#1e293b",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                color: "#94a3b8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowLeft size={16} />
            </button>

            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Invoice Details
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color: "#64748b",
                  marginTop: 2,
                }}
              >
                {invoice.invoiceNumber}
              </div>
            </div>
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#6366f1",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={14} />
            Download Invoice
          </button>
        </div>
      </div>

      {/* Body */}

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "28px",
        }}
      >
        {/* Top */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 380px",
            gap: 20,
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
            {/* Invoice Summary */}

            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
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
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        fontSize: 22,
                        fontWeight: 700,
                      }}
                    >
                      {invoice.serviceTitle}
                    </h1>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 999,
                        background:
                          statusStyle.bg,
                        color:
                          statusStyle.color,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background:
                            statusStyle.color,
                        }}
                      />

                      {statusStyle.label}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 18,
                      flexWrap: "wrap",
                    }}
                  >
                    <MetaItem
                      icon={
                        <Calendar size={13} />
                      }
                      label={`Created ${invoice.createdAt}`}
                    />

                    <MetaItem
                      icon={<Clock size={13} />}
                      label={`Due ${invoice.dueDate}`}
                    />
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    Remaining Balance
                  </div>

                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 800,
                      color: "#f8fafc",
                      marginTop: 4,
                    }}
                  >
                    ₱
                    {remaining.toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>

            {/* Breakdown */}

            <Card>
              <SectionTitle
                icon={<Receipt size={15} />}
                title="Invoice Breakdown"
              />

              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <AmountRow
                  label="Diagnosis Fee"
                  amount={
                    invoice.diagnosisFee
                  }
                />

                <AmountRow
                  label="Estimated Total"
                  amount={
                    invoice.estimatedTotal
                  }
                />

                <AmountRow
                  label="Discount"
                  amount={
                    invoice.discountAmount
                  }
                  negative
                />

                <div
                  style={{
                    height: 1,
                    background:
                      "rgba(255,255,255,0.06)",
                    margin: "4px 0",
                  }}
                />

                <AmountRow
                  label="Final Total"
                  amount={invoice.finalTotal}
                  strong
                />

                <AmountRow
                  label="Paid"
                  amount={totalPaid}
                  success
                />

                <AmountRow
                  label="Balance Due"
                  amount={remaining}
                  strong
                  danger={remaining > 0}
                />
              </div>
            </Card>

            {/* Payment History */}

            <Card>
              <SectionTitle
                icon={
                  <CreditCard size={15} />
                }
                title="Payment History"
              />

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {invoice.payments.map(
                  (payment) => (
                    <div
                      key={payment.id}
                      style={{
                        background:
                          "#0f172a",
                        border:
                          "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 12,
                        padding:
                          "14px 16px",
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <CheckCircle2
                            size={14}
                            color="#34d399"
                          />

                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {
                              payment.stage
                            }{" "}
                            Payment
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color:
                              "#64748b",
                          }}
                        >
                          {
                            payment.method
                          }{" "}
                          •{" "}
                          {
                            payment.paidAt
                          }
                        </div>

                        {payment.referenceNumber && (
                          <div
                            style={{
                              fontSize: 11.5,
                              color:
                                "#475569",
                              marginTop: 3,
                            }}
                          >
                            Ref:{" "}
                            {
                              payment.referenceNumber
                            }
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#34d399",
                        }}
                      >
                        ₱
                        {payment.amount.toLocaleString()}
                      </div>
                    </div>
                  )
                )}
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
              top: 90,
            }}
          >
            {/* QR */}

            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  marginBottom: 18,
                }}
              >
                <SectionTitle
                  icon={<QrCode size={15} />}
                  title="Pay via QR"
                />

                <ShieldCheck
                  size={16}
                  color="#34d399"
                />
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 18,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={invoice.qrCodeUrl}
                  alt="QR"
                  style={{
                    width: 240,
                    height: 240,
                    objectFit: "contain",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <InfoRow
                  label="Account Name"
                  value={
                    invoice.accountName
                  }
                />

                <InfoRow
                  label="GCash Number"
                  value={
                    invoice.gcashNumber
                  }
                />
              </div>

              <button
                onClick={copyGCash}
                style={{
                  width: "100%",
                  marginTop: 16,
                  height: 42,
                  borderRadius: 10,
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  background: "#1e293b",
                  color: copied
                    ? "#34d399"
                    : "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <Copy size={14} />

                {copied
                  ? "Copied"
                  : "Copy GCash Number"}
              </button>
            </Card>

            {/* Instructions */}

            <Card>
              <SectionTitle
                icon={<Wallet size={15} />}
                title="Payment Instructions"
              />

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  "Open your GCash app",
                  "Scan the QR code",
                  "Pay the exact amount",
                  "Upload proof of payment",
                  "Wait for confirmation",
                ].map((step, i) => (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems:
                        "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius:
                          "50%",
                        background:
                          "rgba(99,102,241,0.14)",
                        color: "#818cf8",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#cbd5e1",
                        lineHeight: 1.5,
                        paddingTop: 3,
                      }}
                    >
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upload */}

            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <Building2
                  size={16}
                  color="#818cf8"
                />

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Submit Payment Proof
                </div>
              </div>

              <div
                style={{
                  border:
                    "1.5px dashed rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "28px 18px",
                  textAlign: "center",
                  background:
                    "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#94a3b8",
                    marginBottom: 16,
                  }}
                >
                  Upload screenshot or receipt
                </div>

                <button
                  style={{
                    background: "#6366f1",
                    border: "none",
                    borderRadius: 10,
                    height: 40,
                    padding: "0 18px",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Upload Proof
                </button>
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  color: "#64748b",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                }}
              >
                <AlertCircle
                  size={14}
                  style={{
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                />

                Payments are manually verified by
                accounting before invoice status
                updates.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
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
        borderRadius: 16,
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
      <div
        style={{
          color: "#818cf8",
          display: "flex",
        }}
      >
        {icon}
      </div>

      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {title}
      </span>
    </div>
  )
}

function MetaItem({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "#94a3b8",
        fontSize: 12.5,
      }}
    >
      {icon}
      {label}
    </div>
  )
}

function AmountRow({
  label,
  amount,
  strong,
  negative,
  success,
  danger,
}: {
  label: string
  amount: number
  strong?: boolean
  negative?: boolean
  success?: boolean
  danger?: boolean
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
          fontSize: 13,
          color: "#94a3b8",
          fontWeight: strong ? 600 : 400,
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: strong ? 18 : 14,
          fontWeight: strong ? 700 : 600,
          color: success
            ? "#34d399"
            : danger
            ? "#f87171"
            : "#f8fafc",
        }}
      >
        {negative && "-"}₱
        {amount.toLocaleString()}
      </span>
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11.5,
          color: "#64748b",
          marginBottom: 5,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13.5,
          fontWeight: 600,
          color: "#f8fafc",
        }}
      >
        {value}
      </div>
    </div>
  )
}
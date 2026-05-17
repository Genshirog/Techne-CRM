import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Wrench,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  Star,
  MessageCircle,
  ThumbsUp,
  Package,
  AlertCircle,
  FileText,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus =
  | "Pending"
  | "Assigned"
  | "Traveling"
  | "On-Site"
  | "In Diagnosis"
  | "Awaiting Parts"
  | "Quoted"
  | "Done"

interface QuoteItem {
  label: string
  amount: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_JOB = {
  id: "INQ-1040",
  status: "In Diagnosis" as JobStatus,
  submittedAt: "May 6, 2026 — 10:02 AM",
  scheduledFor: "May 8, 2026 — 9:00 AM",

  service: {
    type: "Plumbing Leak",
    urgency: "High",
    description:
      "Persistent leak under the kitchen sink. Water pools after running the tap for more than a minute. Cabinet underneath has already sustained water damage.",
  },

  technician: {
    name: "Paulo Mendez",
    initials: "PM",
    rating: 4.9,
    jobsDone: 312,
    phone: "+63 912 345 6789",
  },

  address: "42 Mahogany St., Davao City",

  updates: [
    {
      time: "May 8, 9:05 AM",
      message: "Paulo has checked in at your address.",
      icon: "checkin",
    },
    {
      time: "May 8, 9:30 AM",
      message:
        "Diagnosis started. P-trap is corroded and needs replacement.",
      icon: "wrench",
    },
    {
      time: "May 8, 10:00 AM",
      message:
        'Parts sourced — awaiting delivery of 1.5" P-trap.',
      icon: "package",
    },
  ],

  partsNeeded: [
    {
      name: 'P-Trap (1.5")',
      status: "To Source",
    },
    {
      name: "Compression Fittings x2",
      status: "In Stock",
    },
    {
      name: "Teflon Tape",
      status: "In Stock",
    },
  ],

  quote: null as QuoteItem[] | null,
}

// ─── Progress ────────────────────────────────────────────────────────────────

const STEPS: { key: JobStatus; label: string }[] = [
  { key: "Pending", label: "Request Sent" },
  { key: "Assigned", label: "Assigned" },
  { key: "On-Site", label: "On-Site" },
  { key: "In Diagnosis", label: "Diagnosing" },
  { key: "Quoted", label: "Quoted" },
  { key: "Done", label: "Completed" },
]

const STEP_ORDER: Record<JobStatus, number> = {
  Pending: 0,
  Assigned: 1,
  Traveling: 1,
  "On-Site": 2,
  "In Diagnosis": 3,
  "Awaiting Parts": 3,
  Quoted: 4,
  Done: 5,
}

const STATUS_META: Record<
  JobStatus,
  { bg: string; color: string }
> = {
  Pending: {
    bg: "rgba(251,191,36,0.14)",
    color: "#fbbf24",
  },

  Assigned: {
    bg: "rgba(96,165,250,0.14)",
    color: "#60a5fa",
  },

  Traveling: {
    bg: "rgba(251,191,36,0.14)",
    color: "#fbbf24",
  },

  "On-Site": {
    bg: "rgba(52,211,153,0.14)",
    color: "#34d399",
  },

  "In Diagnosis": {
    bg: "rgba(129,140,248,0.14)",
    color: "#818cf8",
  },

  "Awaiting Parts": {
    bg: "rgba(249,115,22,0.14)",
    color: "#fb923c",
  },

  Quoted: {
    bg: "rgba(167,139,250,0.14)",
    color: "#a78bfa",
  },

  Done: {
    bg: "rgba(52,211,153,0.14)",
    color: "#34d399",
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerInquiryDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const job = MOCK_JOB

  const [rating, setRating] = useState(0)
  const [hoverStar, setHoverStar] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const currentStep = STEP_ORDER[job.status]
  const isDone = job.status === "Done"

  const updateIcons: Record<string, React.ReactNode> = {
    checkin: (
      <CheckCircle2 size={14} color="#34d399" />
    ),

    wrench: (
      <Wrench size={14} color="#60a5fa" />
    ),

    package: (
      <Package size={14} color="#a78bfa" />
    ),
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "28px 32px",
        fontFamily:
          "'DM Sans', 'Segoe UI', sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => navigate("/customer/inquiries")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
          }}
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div
          style={{
            width: 1,
            height: 16,
            background: "#334155",
          }}
        />

        <span
          style={{
            fontSize: 13,
            color: "#64748b",
            fontFamily: "monospace",
          }}
        >
          {job.id}
        </span>
      </div>

      {/* Top Card */}

      <div
        style={{
          background: "#1e293b",
          border:
            "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "24px 26px",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
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
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                {job.service.type}
              </h1>

              <StatusBadge status={job.status} />
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.6,
                maxWidth: 650,
              }}
            >
              {job.service.description}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 18,
              }}
            >
              <MetaChip
                icon={<Calendar size={12} />}
                text={job.scheduledFor}
              />

              <MetaChip
                icon={<Clock size={12} />}
                text={job.submittedAt}
              />

              <MetaChip
                icon={<MapPin size={12} />}
                text={job.address}
              />
            </div>
          </div>

          {/* Technician */}

          <div
            style={{
              width: 260,
              background: "#0f172a",
              border:
                "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 14,
              }}
            >
              Technician
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {job.technician.initials}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {job.technician.name}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 3,
                  }}
                >
                  <Star
                    size={11}
                    fill="#fbbf24"
                    color="#fbbf24"
                  />

                  <span
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    {job.technician.rating} ·{" "}
                    {job.technician.jobsDone} jobs
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  background:
                    "rgba(52,211,153,0.12)",
                  border:
                    "1px solid rgba(52,211,153,0.2)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  color: "#34d399",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Phone size={13} />
                Call Technician
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  background:
                    "rgba(96,165,250,0.12)",
                  border:
                    "1px solid rgba(96,165,250,0.2)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  color: "#60a5fa",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <MessageCircle size={13} />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}

      <Card>
        <SectionLabel>
          Job Progress
        </SectionLabel>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 18,
          }}
        >
          {STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep

            return (
              <div
                key={step.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex:
                    i < STEPS.length - 1
                      ? 1
                      : 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: done
                        ? "#6366f1"
                        : active
                        ? "#1e293b"
                        : "#0f172a",

                      border: active
                        ? "2px solid #6366f1"
                        : done
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {done ? (
                      <CheckCircle2
                        size={14}
                        color="#fff"
                      />
                    ) : (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: active
                            ? "#6366f1"
                            : "#475569",
                        }}
                      />
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      color: active
                        ? "#f8fafc"
                        : "#64748b",

                      fontWeight: active
                        ? 600
                        : 400,

                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      margin:
                        "0 10px 20px",
                      background:
                        i < currentStep
                          ? "#6366f1"
                          : "#334155",
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Body */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 320px",
          gap: 18,
          marginTop: 18,
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
          {/* Updates */}

          <Card>
            <SectionLabel>
              Live Updates
            </SectionLabel>

            <div
              style={{
                marginTop: 18,
              }}
            >
              {job.updates.map((upd, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    position: "relative",
                    paddingBottom: 20,
                  }}
                >
                  {i <
                    job.updates.length -
                      1 && (
                    <div
                      style={{
                        position:
                          "absolute",
                        left: 14,
                        top: 30,
                        bottom: 0,
                        width: 1,
                        background:
                          "#334155",
                      }}
                    />
                  )}

                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background:
                        "#0f172a",
                      border:
                        "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      zIndex: 1,
                      flexShrink: 0,
                    }}
                  >
                    {updateIcons[upd.icon]}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: "#e2e8f0",
                        lineHeight: 1.5,
                        marginBottom: 5,
                      }}
                    >
                      {upd.message}
                    </div>

                    <span
                      style={{
                        fontSize: 11.5,
                        color: "#64748b",
                      }}
                    >
                      {upd.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quote */}

          {job.status === "Quoted" &&
            job.quote && (
              <Card>
                <SectionLabel>
                  Quote
                </SectionLabel>

                <div
                  style={{
                    marginTop: 16,
                  }}
                >
                  {job.quote.map(
                    (item, i) => (
                      <div
                        key={i}
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",

                          padding:
                            "12px 0",

                          borderBottom:
                            i <
                            job.quote!
                              .length -
                              1
                              ? "1px solid rgba(255,255,255,0.06)"
                              : "none",

                          fontSize:
                            13.5,
                        }}
                      >
                        <span
                          style={{
                            color:
                              "#cbd5e1",
                          }}
                        >
                          {item.label}
                        </span>

                        <span
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          ₱
                          {item.amount.toLocaleString()}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}

          {/* Rating */}

          {isDone && (
            <Card>
              <SectionLabel>
                Rate Experience
              </SectionLabel>

              {submitted ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 16,
                    padding: 14,
                    borderRadius: 12,
                    background:
                      "rgba(52,211,153,0.12)",

                    color: "#34d399",
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  <ThumbsUp size={15} />
                  Thank you for your
                  feedback!
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    {[1, 2, 3, 4, 5].map(
                      (s) => (
                        <Star
                          key={s}
                          size={28}
                          fill={
                            (
                              hoverStar ||
                              rating
                            ) >= s
                              ? "#fbbf24"
                              : "none"
                          }
                          color={
                            (
                              hoverStar ||
                              rating
                            ) >= s
                              ? "#fbbf24"
                              : "#475569"
                          }
                          style={{
                            cursor:
                              "pointer",
                          }}
                          onMouseEnter={() =>
                            setHoverStar(
                              s
                            )
                          }
                          onMouseLeave={() =>
                            setHoverStar(
                              0
                            )
                          }
                          onClick={() =>
                            setRating(s)
                          }
                        />
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      rating > 0 &&
                      setSubmitted(
                        true
                      )
                    }
                    style={{
                      background:
                        "#6366f1",
                      border: "none",
                      borderRadius: 10,
                      padding:
                        "10px 18px",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Submit Rating
                  </button>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Parts */}

          <Card>
            <SectionLabel>
              Parts & Materials
            </SectionLabel>

            <div
              style={{
                marginTop: 14,
              }}
            >
              {job.partsNeeded.map(
                (part, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      padding:
                        "11px 0",

                      borderBottom:
                        i <
                        job.partsNeeded
                          .length -
                          1
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color:
                          "#cbd5e1",
                      }}
                    >
                      {part.name}
                    </span>

                    <span
                      style={{
                        fontSize: 11,
                        padding:
                          "3px 8px",
                        borderRadius:
                          999,

                        background:
                          part.status ===
                          "In Stock"
                            ? "rgba(52,211,153,0.12)"
                            : "rgba(249,115,22,0.12)",

                        color:
                          part.status ===
                          "In Stock"
                            ? "#34d399"
                            : "#fb923c",

                        fontWeight: 600,
                      }}
                    >
                      {part.status}
                    </span>
                  </div>
                )
              )}
            </div>
          </Card>

          {/* Actions */}

          <Card>
            <SectionLabel>
              Support
            </SectionLabel>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",

                gap: 10,
                marginTop: 16,
              }}
            >
              {[
                {
                  label:
                    "View Job Report",
                  icon: (
                    <FileText
                      size={13}
                    />
                  ),
                  color: "#60a5fa",
                  bg: "rgba(96,165,250,0.12)",
                },

                {
                  label:
                    "Report Issue",
                  icon: (
                    <AlertCircle
                      size={13}
                    />
                  ),
                  color: "#fb923c",
                  bg: "rgba(249,115,22,0.12)",
                },

                {
                  label:
                    "Contact Support",
                  icon: (
                    <MessageCircle
                      size={13}
                    />
                  ),
                  color: "#a78bfa",
                  bg: "rgba(167,139,250,0.12)",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems:
                      "center",

                    gap: 8,
                    width: "100%",

                    background:
                      item.bg,

                    border:
                      "1px solid rgba(255,255,255,0.06)",

                    borderRadius: 10,

                    padding:
                      "11px 14px",

                    color:
                      item.color,

                    fontSize: 13,
                    fontWeight: 600,

                    cursor:
                      "pointer",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({
  status,
}: {
  status: JobStatus
}) {
  const s = STATUS_META[status]

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,

        padding: "4px 10px",
        borderRadius: 999,

        background: s.bg,
        color: s.color,

        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.color,
        }}
      />

      {status}
    </span>
  )
}

function MetaChip({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,

        padding: "8px 10px",

        background:
          "rgba(255,255,255,0.03)",

        border:
          "1px solid rgba(255,255,255,0.06)",

        borderRadius: 10,

        fontSize: 12,
        color: "#94a3b8",
      }}
    >
      {icon}
      {text}
    </div>
  )
}

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
        padding: "22px 24px",
      }}
    >
      {children}
    </div>
  )
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#64748b",

        textTransform: "uppercase",
        letterSpacing: "0.8px",
      }}
    >
      {children}
    </div>
  )
}
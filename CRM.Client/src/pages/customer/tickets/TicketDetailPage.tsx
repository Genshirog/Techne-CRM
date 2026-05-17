import { useEffect, useMemo, useRef, useState } from "react"
import {
  Send,
  Paperclip,
  Star,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Wrench,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type TicketStatus =
  | "Open"
  | "WaitingForCustomer"
  | "InProgress"
  | "Resolved"
  | "Closed"

type MessageSender = "customer" | "technician" | "system"

interface Message {
  id: number
  sender: MessageSender
  senderName: string
  initials: string
  content: string
  time: string
  attachments?: {
    name: string
    size: string
  }[]
}

interface RatingBreakdown {
  professionalism: number
  communication: number
  quality: number
  speed: number
}

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────

const MOCK_TICKET = {
  id: "TKT-2304",
  subject: "Aircon leaking water after cleaning",
  status: "InProgress" as TicketStatus,
  createdAt: "May 15, 2026",
  inquiryId: "INQ-1094",
  quotationId: "QT-4102",

  customer: {
    name: "Juan Dela Cruz",
    email: "juan@email.com",
    phone: "+63 917 123 4567",
  },

  technician: {
    name: "Paulo Mendez",
    initials: "PM",
    role: "Senior Aircon Technician",
    avatarColor: "#818cf8",
    totalJobs: 142,
    averageRating: 4.9,
  },
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "customer",
    senderName: "Juan Dela Cruz",
    initials: "JD",
    content:
      "Hello, my aircon is leaking water again even after the cleaning service last week.",
    time: "9:10 AM",
  },

  {
    id: 2,
    sender: "technician",
    senderName: "Paulo Mendez",
    initials: "PM",
    content:
      "Good morning sir. I checked your previous service record and this may be caused by a clogged drain line. I'll visit tomorrow afternoon for inspection.",
    time: "9:22 AM",
  },

  {
    id: 3,
    sender: "customer",
    senderName: "Juan Dela Cruz",
    initials: "JD",
    content:
      "Thank you. Will there be additional charges if parts need replacement?",
    time: "9:25 AM",
  },

  {
    id: 4,
    sender: "technician",
    senderName: "Paulo Mendez",
    initials: "PM",
    content:
      "Yes sir, but I will first provide a quotation before any replacement or repair.",
    time: "9:31 AM",
  },
]

// ─────────────────────────────────────────────────────────────
// STATUS STYLE
// ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<
  TicketStatus,
  {
    bg: string
    color: string
  }
> = {
  Open: {
    bg: "rgba(59,130,246,0.15)",
    color: "#60a5fa",
  },

  WaitingForCustomer: {
    bg: "rgba(245,158,11,0.15)",
    color: "#fbbf24",
  },

  InProgress: {
    bg: "rgba(99,102,241,0.15)",
    color: "#818cf8",
  },

  Resolved: {
    bg: "rgba(16,185,129,0.15)",
    color: "#34d399",
  },

  Closed: {
    bg: "rgba(100,116,139,0.15)",
    color: "#94a3b8",
  },
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function CustomerTicketDetailPage() {
  const [messages, setMessages] =
    useState<Message[]>(INITIAL_MESSAGES)

  const [reply, setReply] = useState("")

  const [showRating, setShowRating] = useState(false)

  const [rating, setRating] =
    useState<RatingBreakdown>({
      professionalism: 5,
      communication: 5,
      quality: 5,
      speed: 5,
    })

  const [feedback, setFeedback] = useState("")

  const bottomRef = useRef<HTMLDivElement>(null)

  const averageRating = useMemo(() => {
    return (
      (
        rating.professionalism +
        rating.communication +
        rating.quality +
        rating.speed
      ) / 4
    ).toFixed(1)
  }, [rating])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  const sendReply = () => {
    if (!reply.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "customer",
      senderName: "Juan Dela Cruz",
      initials: "JD",
      content: reply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, newMessage])

    setReply("")
  }

  const submitRating = () => {
    alert(
      `Rating Submitted!\n\nAverage Rating: ${averageRating}\n\nFeedback:\n${feedback}`
    )

    setShowRating(false)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#f8fafc",
        fontFamily:
          "'DM Sans', 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          borderBottom:
            "1px solid rgba(255,255,255,0.06)",
          padding: "18px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "#0f172a",
          zIndex: 20,
        }}
      >
        <div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              marginBottom: 8,
              padding: 0,
            }}
          >
            <ArrowLeft size={13} />
            Back to Tickets
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {MOCK_TICKET.subject}
          </h1>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <StatusBadge
              status={MOCK_TICKET.status}
            />

            <SmallMeta>
              Ticket #{MOCK_TICKET.id}
            </SmallMeta>

            <SmallMeta>
              Inquiry {MOCK_TICKET.inquiryId}
            </SmallMeta>

            <SmallMeta>
              Quotation {MOCK_TICKET.quotationId}
            </SmallMeta>

            <SmallMeta>
              Created {MOCK_TICKET.createdAt}
            </SmallMeta>
          </div>
        </div>

        <button
          onClick={() => setShowRating(true)}
          style={{
            background:
              "linear-gradient(135deg,#6366f1,#4f46e5)",
            border: "none",
            color: "#fff",
            padding: "11px 18px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            boxShadow:
              "0 10px 25px rgba(79,70,229,0.25)",
          }}
        >
          Rate Technician
        </button>
      </div>

      {/* BODY */}

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* LEFT */}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* CHAT */}

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
              />
            ))}

            <div ref={bottomRef} />
          </div>

          {/* REPLY */}

          <div
            style={{
              borderTop:
                "1px solid rgba(255,255,255,0.06)",
              padding: 20,
            }}
          >
            <div
              style={{
                background: "#1e293b",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {/* TOOLBAR */}

              <div
                style={{
                  padding: "10px 14px",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  Reply to technician
                </span>

                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  <Paperclip size={14} />
                </button>
              </div>

              <textarea
                value={reply}
                onChange={(e) =>
                  setReply(e.target.value)
                }
                placeholder="Type your message..."
                rows={4}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  resize: "none",
                  outline: "none",
                  padding: 16,
                  color: "#e2e8f0",
                  fontSize: 14,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  lineHeight: 1.7,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: 14,
                  borderTop:
                    "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <button
                  onClick={sendReply}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#6366f1",
                    border: "none",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  <Send size={14} />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}

        <div
          style={{
            width: 340,
            borderLeft:
              "1px solid rgba(255,255,255,0.06)",
            padding: 22,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* TECHNICIAN */}

          <SidebarCard title="Assigned Technician">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <Avatar initials="PM" />

              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {MOCK_TICKET.technician.name}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginTop: 3,
                  }}
                >
                  {
                    MOCK_TICKET.technician.role
                  }
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <MiniStat
                label="Completed Jobs"
                value={String(
                  MOCK_TICKET.technician.totalJobs
                )}
              />

              <MiniStat
                label="Avg Rating"
                value={`${MOCK_TICKET.technician.averageRating}★`}
              />
            </div>
          </SidebarCard>

          {/* CONTACT */}

          <SidebarCard title="Contact">
            <InfoRow
              icon={<Phone size={13} />}
              value="+63 917 882 1102"
            />

            <InfoRow
              icon={<Mail size={13} />}
              value="support@crmpro.com"
            />

            <InfoRow
              icon={<Clock size={13} />}
              value="Mon - Sat · 8AM - 6PM"
            />
          </SidebarCard>

          {/* SERVICE */}

          <SidebarCard title="Service Information">
            <InfoRow
              icon={<Wrench size={13} />}
              value="Aircon Cleaning & Repair"
            />

            <InfoRow
              icon={<ShieldCheck size={13} />}
              value="30 Days Service Warranty"
            />

            <InfoRow
              icon={<CheckCircle2 size={13} />}
              value="Quotation Approved"
            />
          </SidebarCard>

          {/* TIMELINE */}

          <SidebarCard title="Progress Timeline">
            <TimelineItem
              done
              label="Inquiry Submitted"
            />

            <TimelineItem
              done
              label="Technician Assigned"
            />

            <TimelineItem
              done
              label="Inspection Completed"
            />

            <TimelineItem
              done
              label="Quotation Sent"
            />

            <TimelineItem
              active
              label="Repair Ongoing"
            />

            <TimelineItem
              label="Job Completion"
            />
          </SidebarCard>
        </div>
      </div>

      {/* RATING MODAL */}

      {showRating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: 20,
          }}
        >
          <div
            style={{
              width: 520,
              maxWidth: "100%",
              background: "#1e293b",
              borderRadius: 20,
              border:
                "1px solid rgba(255,255,255,0.08)",
              padding: 24,
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 22,
              }}
            >
              Rate Technician
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: 13,
                marginBottom: 24,
                lineHeight: 1.7,
              }}
            >
              Your feedback helps improve
              technician service quality.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <RatingField
                label="Professionalism"
                value={rating.professionalism}
                onChange={(v) =>
                  setRating((prev) => ({
                    ...prev,
                    professionalism: v,
                  }))
                }
              />

              <RatingField
                label="Communication"
                value={rating.communication}
                onChange={(v) =>
                  setRating((prev) => ({
                    ...prev,
                    communication: v,
                  }))
                }
              />

              <RatingField
                label="Quality of Work"
                value={rating.quality}
                onChange={(v) =>
                  setRating((prev) => ({
                    ...prev,
                    quality: v,
                  }))
                }
              />

              <RatingField
                label="Service Speed"
                value={rating.speed}
                onChange={(v) =>
                  setRating((prev) => ({
                    ...prev,
                    speed: v,
                  }))
                }
              />

              <div>
                <div
                  style={{
                    fontSize: 13,
                    marginBottom: 10,
                    color: "#cbd5e1",
                  }}
                >
                  Feedback
                </div>

                <textarea
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(e.target.value)
                  }
                  rows={5}
                  placeholder="Tell us about your experience..."
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: 14,
                    color: "#e2e8f0",
                    resize: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                  }}
                />
              </div>

              <div
                style={{
                  background:
                    "rgba(99,102,241,0.12)",
                  border:
                    "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#818cf8",
                    marginBottom: 6,
                  }}
                >
                  Overall Rating
                </div>

                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                  }}
                >
                  {averageRating}★
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <button
                  onClick={() =>
                    setShowRating(false)
                  }
                  style={{
                    background: "transparent",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                    padding: "11px 16px",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={submitRating}
                  style={{
                    background:
                      "linear-gradient(135deg,#6366f1,#4f46e5)",
                    border: "none",
                    color: "#fff",
                    padding: "11px 18px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SUB COMPONENTS
// ─────────────────────────────────────────────────────────────

function StatusBadge({
  status,
}: {
  status: TicketStatus
}) {
  const s = STATUS_STYLE[status]

  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "5px 11px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  )
}

function SmallMeta({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span
      style={{
        fontSize: 11.5,
        color: "#64748b",
      }}
    >
      {children}
    </span>
  )
}

function Avatar({
  initials,
}: {
  initials: string
}) {
  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg,#6366f1,#4f46e5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

function MessageBubble({
  message,
}: {
  message: Message
}) {
  const isCustomer =
    message.sender === "customer"

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCustomer
          ? "flex-end"
          : "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "72%",
          background: isCustomer
            ? "linear-gradient(135deg,#6366f1,#4f46e5)"
            : "#1e293b",
          border: isCustomer
            ? "none"
            : "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 6,
            color: isCustomer
              ? "#fff"
              : "#cbd5e1",
          }}
        >
          {message.senderName}
        </div>

        <div
          style={{
            fontSize: 13.5,
            lineHeight: 1.8,
            color: isCustomer
              ? "#fff"
              : "#e2e8f0",
            whiteSpace: "pre-wrap",
          }}
        >
          {message.content}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: isCustomer
              ? "rgba(255,255,255,0.7)"
              : "#64748b",
          }}
        >
          {message.time}
        </div>
      </div>
    </div>
  )
}

function SidebarCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          marginBottom: 16,
          textTransform: "uppercase",
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      {children}
    </div>
  )
}

function MiniStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  value,
}: {
  icon: React.ReactNode
  value: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "#cbd5e1",
        fontSize: 13,
        marginBottom: 12,
      }}
    >
      <span style={{ color: "#818cf8" }}>
        {icon}
      </span>

      {value}
    </div>
  )
}

function TimelineItem({
  label,
  done,
  active,
}: {
  label: string
  done?: boolean
  active?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: done
            ? "#34d399"
            : active
            ? "#818cf8"
            : "#334155",
        }}
      />

      <span
        style={{
          fontSize: 13,
          color: done || active
            ? "#e2e8f0"
            : "#64748b",
        }}
      >
        {label}
      </span>
    </div>
  )
}

function RatingField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "#cbd5e1",
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontSize: 13,
            color: "#fbbf24",
            fontWeight: 700,
          }}
        >
          {value}/5
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Star
              size={28}
              fill={
                star <= value
                  ? "#fbbf24"
                  : "transparent"
              }
              color="#fbbf24"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
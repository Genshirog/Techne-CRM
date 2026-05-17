import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, ChevronDown, Paperclip, Send,
  CheckCircle2, AlertCircle, User, Clock,
  MessageSquare, Activity, Phone, Mail,
  MoreHorizontal, Smile, X, Link2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type TicketStatus = "Open" | "Pending" | "Resolved" | "Closed"
type TicketPriority = "Low" | "Medium" | "High" | "Urgent"
type MessageSender = "customer" | "staff"
type ActivityType = "status" | "assignment" | "system" | "note"

interface Attachment {
  name: string
  size: string
  type: "image" | "doc" | "pdf"
}

interface Message {
  id: number
  sender: MessageSender
  senderName: string
  senderInitials: string
  content: string
  time: string
  date: string
  read: boolean
  attachments?: Attachment[]
}

interface ActivityEvent {
  id: number
  type: ActivityType
  actor: string
  content: string
  time: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TICKET = {
  id: "TKT-2291",
  subject: "Persistent kitchen sink leak — follow-up on INQ-1040",
  status: "Open" as TicketStatus,
  priority: "High" as TicketPriority,
  createdAt: "May 6, 2026 — 9:14 AM",
  linkedInquiry: "INQ-1040",
  channel: "Email",
  customer: {
    name: "Aisha Okonkwo",
    initials: "AO",
    email: "aisha.okonkwo@email.com",
    phone: "+63 917 234 5678",
    since: "March 2025",
    totalTickets: 3,
  },
  assignedTo: {
    name: "Paulo Mendez",
    initials: "PM",
    role: "Senior Technician",
  },
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "customer",
    senderName: "Aisha Okonkwo",
    senderInitials: "AO",
    content: "Hi, I submitted an inquiry a few days ago about a leak under my kitchen sink. I haven't heard back yet about whether a technician has been assigned. The leak is getting worse and the cabinet underneath is starting to warp. Can someone please update me on the status?",
    time: "9:14 AM",
    date: "May 6, 2026",
    read: true,
  },
  {
    id: 2,
    sender: "staff",
    senderName: "Paulo Mendez",
    senderInitials: "PM",
    content: "Hi Aisha, thank you for reaching out. I can see your inquiry INQ-1040 has been assigned to me. I completed an initial inspection earlier today and identified that the P-trap underneath is heavily corroded and needs to be replaced.\n\nI need to source the replacement part, which typically takes 1–2 business days. I'll reach out as soon as the part arrives to schedule the repair. In the meantime, try to minimize use of that sink to prevent further cabinet damage.",
    time: "2:45 PM",
    date: "May 6, 2026",
    read: true,
  },
  {
    id: 3,
    sender: "customer",
    senderName: "Aisha Okonkwo",
    senderInitials: "AO",
    content: "Thanks for the update Paulo. I appreciate you getting back to me. Will the quotation be sent to my email before the repair? I'd like to know the cost estimate ahead of time.",
    time: "3:02 PM",
    date: "May 6, 2026",
    read: true,
    attachments: [
      { name: "sink-damage.jpg", size: "1.4 MB", type: "image" },
    ],
  },
  {
    id: 4,
    sender: "staff",
    senderName: "Paulo Mendez",
    senderInitials: "PM",
    content: "Absolutely. Once I confirm the part cost with our supplier, I'll generate a formal quotation and send it to your registered email before scheduling anything. You'll have a chance to review and approve it first.",
    time: "3:18 PM",
    date: "May 6, 2026",
    read: true,
  },
  {
    id: 5,
    sender: "customer",
    senderName: "Aisha Okonkwo",
    senderInitials: "AO",
    content: "Perfect, thank you! I'll wait for the quotation. Please also let me know if there's anything else I should do in the meantime.",
    time: "9:31 AM",
    date: "May 7, 2026",
    read: false,
  },
]

const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: 1, type: "system",     actor: "System",       content: "Ticket TKT-2291 created and linked to INQ-1040.", time: "May 6, 9:14 AM" },
  { id: 2, type: "assignment", actor: "Admin",        content: "Assigned to Paulo Mendez.",                       time: "May 6, 10:02 AM" },
  { id: 3, type: "status",     actor: "Paulo Mendez", content: "Status changed to Open.",                         time: "May 6, 11:30 AM" },
  { id: 4, type: "note",       actor: "Paulo Mendez", content: "P-trap identified as the source. Part sourcing in progress.", time: "May 6, 2:30 PM" },
  { id: 5, type: "system",     actor: "System",       content: "Customer replied — ticket marked as awaiting staff response.", time: "May 7, 9:31 AM" },
]

const STATUS_OPTIONS: TicketStatus[] = ["Open", "Pending", "Resolved", "Closed"]

const STATUS_STYLE: Record<TicketStatus, { bg: string; color: string; dot: string }> = {
  "Open":     { bg: "rgba(99,102,241,0.15)",  color: "#818cf8", dot: "#818cf8" },
  "Pending":  { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24", dot: "#fbbf24" },
  "Resolved": { bg: "rgba(16,185,129,0.15)",  color: "#34d399", dot: "#34d399" },
  "Closed":   { bg: "rgba(100,116,139,0.15)", color: "#64748b", dot: "#64748b" },
}

const PRIORITY_STYLE: Record<TicketPriority, { bg: string; color: string }> = {
  "Low":    { bg: "rgba(16,185,129,0.12)",  color: "#34d399" },
  "Medium": { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24" },
  "High":   { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  "Urgent": { bg: "rgba(239,68,68,0.2)",    color: "#ef4444" },
}

const ACTIVITY_ICON: Record<ActivityType, React.ReactNode> = {
  status:     <CheckCircle2 size={13} color="#34d399" />,
  note:       <MessageSquare size={13} color="#818cf8" />,
  assignment: <User size={13} color="#fbbf24" />,
  system:     <AlertCircle size={13} color="#475569" />,
}

const ATTACH_ICON: Record<Attachment["type"], string> = {
  image: "🖼",
  doc:   "📄",
  pdf:   "📋",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 500,
      ...style,
    }}>
      {children}
    </span>
  )
}

function Avatar({
  initials, color = "#818cf8", bg = "rgba(99,102,241,0.2)", size = 34,
}: {
  initials: string; color?: string; bg?: string; size?: number
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isStaff = msg.sender === "staff"
  return (
    <div style={{
      display: "flex", gap: 10,
      flexDirection: isStaff ? "row-reverse" : "row",
      alignItems: "flex-start",
    }}>
      <Avatar
        initials={msg.senderInitials}
        color={isStaff ? "#fbbf24" : "#818cf8"}
        bg={isStaff ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)"}
        size={32}
      />
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{
          display: "flex", gap: 8, alignItems: "center",
          justifyContent: isStaff ? "flex-end" : "flex-start",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{msg.senderName}</span>
          <span style={{ fontSize: 11, color: "#475569" }}>{msg.time}</span>
        </div>
        <div style={{
          background: isStaff ? "rgba(99,102,241,0.14)" : "#1e293b",
          border: isStaff
            ? "1px solid rgba(99,102,241,0.25)"
            : "1px solid rgba(255,255,255,0.06)",
          borderRadius: isStaff ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
          padding: "12px 15px",
        }}>
          {msg.content.split("\n").map((line, i) => (
            <p key={i} style={{
              margin: i === 0 ? 0 : "10px 0 0", fontSize: 13.5,
              color: "#cbd5e1", lineHeight: 1.7,
            }}>
              {line}
            </p>
          ))}
          {msg.attachments && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {msg.attachments.map((att, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.05)", borderRadius: 6,
                  padding: "7px 10px", border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <span style={{ fontSize: 14 }}>{ATTACH_ICON[att.type]}</span>
                  <div>
                    <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500 }}>{att.name}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{att.size}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminTicketDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const ticket   = MOCK_TICKET

  const [activeTab, setActiveTab]     = useState<"conversation" | "activity">("conversation")
  const [status, setStatus]           = useState<TicketStatus>(ticket.status)
  const [statusOpen, setStatusOpen]   = useState(false)
  const [messages, setMessages]       = useState<Message[]>(MOCK_MESSAGES)
  const [activity, setActivity]       = useState<ActivityEvent[]>(MOCK_ACTIVITY)
  const [reply, setReply]             = useState("")
  const [isSending, setIsSending]     = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeTab === "conversation") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeTab])

  const sendReply = () => {
    if (!reply.trim() || isSending) return
    setIsSending(true)
    const newMsg: Message = {
      id:             messages.length + 1,
      sender:         "staff",
      senderName:     "Paulo Mendez",
      senderInitials: "PM",
      content:        reply.trim(),
      time:           new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date:           "Today",
      read:           true,
    }
    setMessages(prev => [...prev, newMsg])
    setActivity(prev => [...prev, {
      id:      prev.length + 1,
      type:    "system",
      actor:   "System",
      content: "Staff replied to the customer.",
      time:    "Just now",
    }])
    setReply("")
    setTimeout(() => setIsSending(false), 300)
  }

  const changeStatus = (s: TicketStatus) => {
    setStatus(s)
    setStatusOpen(false)
    setActivity(prev => [...prev, {
      id:      prev.length + 1,
      type:    "status",
      actor:   "Admin",
      content: `Status changed to ${s}.`,
      time:    "Just now",
    }])
  }

  // Group messages by date
  const groupedMessages = messages.reduce<Record<string, Message[]>>((acc, msg) => {
    if (!acc[msg.date]) acc[msg.date] = []
    acc[msg.date].push(msg)
    return acc
  }, {})

  const unreadCount = messages.filter(m => m.sender === "customer" && !m.read).length

  return (
    <div
      style={{
        minHeight: "100vh", background: "#0f172a",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
        display: "flex", flexDirection: "column",
      }}
      onClick={() => statusOpen && setStatusOpen(false)}
    >
      {/* ── Top Bar ── */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#0f172a", position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => navigate("/admin/tickets")}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "transparent", border: "none", color: "#475569",
              fontSize: 12.5, cursor: "pointer", padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <ArrowLeft size={13} /> Tickets
          </button>
          <span style={{ color: "#1e3a5f", fontSize: 14 }}>›</span>
          <span style={{ fontSize: 13, color: "#64748b" }}>{ticket.id}</span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Status dropdown */}
          <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setStatusOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: STATUS_STYLE[status].bg,
                border: `1px solid ${STATUS_STYLE[status].color}33`,
                borderRadius: 8, padding: "6px 12px",
                color: STATUS_STYLE[status].color,
                fontSize: 12.5, fontWeight: 500, cursor: "pointer",
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: STATUS_STYLE[status].dot,
              }} />
              {status}
              <ChevronDown size={12} />
            </button>
            {statusOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 60,
                background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, overflow: "hidden", minWidth: 150,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => changeStatus(s)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      width: "100%", textAlign: "left",
                      padding: "9px 14px",
                      background: s === status ? "rgba(99,102,241,0.1)" : "transparent",
                      border: "none", color: s === status ? "#818cf8" : "#94a3b8",
                      fontSize: 13, cursor: "pointer",
                    }}
                    onMouseEnter={(e) => { if (s !== status) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
                    onMouseLeave={(e) => { if (s !== status) e.currentTarget.style.background = "transparent" }}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: STATUS_STYLE[s].color,
                    }} />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "6px 8px", color: "#64748b",
            cursor: "pointer", display: "flex", alignItems: "center",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 53px)" }}>

        {/* ── Left: Conversation / Activity ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}>
          {/* Subject + tabs */}
          <div style={{
            padding: "18px 24px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                  {ticket.subject}
                </h1>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge style={{ background: PRIORITY_STYLE[ticket.priority].bg, color: PRIORITY_STYLE[ticket.priority].color }}>
                  {ticket.priority}
                </Badge>
                <span style={{ fontSize: 11.5, color: "#475569" }}>
                  Linked to{" "}
                  <span style={{ color: "#818cf8", cursor: "pointer" }}>
                    {ticket.linkedInquiry}
                  </span>
                </span>
                <span style={{ fontSize: 11.5, color: "#334155" }}>·</span>
                <span style={{ fontSize: 11.5, color: "#475569" }}>via {ticket.channel}</span>
                <span style={{ fontSize: 11.5, color: "#334155" }}>·</span>
                <span style={{ fontSize: 11.5, color: "#475569" }}>Opened {ticket.createdAt}</span>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0 }}>
              {(["conversation", "activity"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    padding: "8px 16px", fontSize: 13, fontWeight: 500,
                    color: activeTab === tab ? "#e2e8f0" : "#475569",
                    borderBottom: activeTab === tab
                      ? "2px solid #6366f1"
                      : "2px solid transparent",
                    textTransform: "capitalize",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => { if (activeTab !== tab) e.currentTarget.style.color = "#94a3b8" }}
                  onMouseLeave={(e) => { if (activeTab !== tab) e.currentTarget.style.color = "#475569" }}
                >
                  {tab === "conversation"
                    ? <MessageSquare size={13} />
                    : <Activity size={13} />
                  }
                  {tab}
                  {tab === "conversation" && unreadCount > 0 && (
                    <span style={{
                      background: "#ef4444", color: "#fff",
                      fontSize: 10, fontWeight: 700, borderRadius: 10,
                      padding: "1px 6px", lineHeight: 1.5,
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Conversation Thread ── */}
          {activeTab === "conversation" && (
            <>
              <div style={{
                flex: 1, overflowY: "auto", padding: "24px",
                display: "flex", flexDirection: "column", gap: 0,
              }}>
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    {/* Date separator */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      margin: "8px 0 20px",
                    }}>
                      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                      <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap" }}>{date}</span>
                      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {msgs.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Reply Box */}
              <div style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "16px 24px",
                background: "#0f172a",
              }}>
                <div style={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, overflow: "hidden",
                }}>
                  {/* Reply toolbar */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "8px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <span style={{ fontSize: 11.5, color: "#475569", marginRight: 4 }}>Reply to customer</span>
                    <div style={{ flex: 1 }} />
                    {[
                      { icon: <Paperclip size={13} />, label: "Attach" },
                      { icon: <Smile size={13} />,     label: "Emoji" },
                      { icon: <Link2 size={13} />,     label: "Link" },
                    ].map(({ icon, label }) => (
                      <button
                        key={label}
                        title={label}
                        style={{
                          background: "transparent", border: "none",
                          padding: "4px 6px", borderRadius: 6,
                          color: "#475569", cursor: "pointer",
                          display: "flex", alignItems: "center",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply()
                    }}
                    placeholder="Type your reply… (⌘ + Enter to send)"
                    rows={4}
                    style={{
                      width: "100%", background: "transparent",
                      border: "none", padding: "12px 14px",
                      color: "#e2e8f0", fontSize: 13.5,
                      resize: "none", outline: "none",
                      boxSizing: "border-box", fontFamily: "inherit",
                      lineHeight: 1.65,
                    }}
                  />

                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <span style={{ fontSize: 11, color: "#334155" }}>
                      {reply.length > 0 ? `${reply.length} chars` : ""}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {reply.length > 0 && (
                        <button
                          onClick={() => setReply("")}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 7, padding: "6px 10px",
                            color: "#64748b", fontSize: 12.5, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                          }}
                        >
                          <X size={12} /> Clear
                        </button>
                      )}
                      <button
                        onClick={sendReply}
                        disabled={!reply.trim()}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: reply.trim() ? "#6366f1" : "rgba(99,102,241,0.25)",
                          border: "none", borderRadius: 7,
                          padding: "6px 16px", color: reply.trim() ? "#fff" : "#475569",
                          fontSize: 13, fontWeight: 500,
                          cursor: reply.trim() ? "pointer" : "not-allowed",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (reply.trim()) e.currentTarget.style.background = "#4f46e5" }}
                        onMouseLeave={(e) => { if (reply.trim()) e.currentTarget.style.background = "#6366f1" }}
                      >
                        <Send size={12} /> Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Activity Log ── */}
          {activeTab === "activity" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {activity.map((event, i) => (
                  <div key={event.id} style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {ACTIVITY_ICON[event.type]}
                      </div>
                      {i < activity.length - 1 && (
                        <div style={{
                          width: 1, flex: 1, minHeight: 24,
                          background: "rgba(255,255,255,0.05)",
                          margin: "4px 0",
                        }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: i < activity.length - 1 ? 18 : 0, flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: "#e2e8f0" }}>{event.actor}</span>
                        <span style={{ fontSize: 11, color: "#334155" }}>{event.time}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "#64748b", margin: "3px 0 0", lineHeight: 1.55 }}>
                        {event.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{
          width: 300, flexShrink: 0,
          overflowY: "auto", padding: "20px 18px",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {/* Customer */}
          <SideCard title="Customer">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Avatar initials={ticket.customer.initials} size={38} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{ticket.customer.name}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>Customer since {ticket.customer.since}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <SideRow icon={<Mail size={12} color="#6366f1" />} value={ticket.customer.email} />
              <SideRow icon={<Phone size={12} color="#6366f1" />} value={ticket.customer.phone} />
              <SideRow icon={<MessageSquare size={12} color="#6366f1" />} value={`${ticket.customer.totalTickets} total tickets`} />
            </div>
          </SideCard>

          {/* Ticket Info */}
          <SideCard title="Ticket Info">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SideField label="Priority">
                <Badge style={{
                  background: PRIORITY_STYLE[ticket.priority].bg,
                  color: PRIORITY_STYLE[ticket.priority].color,
                  fontSize: 11,
                }}>
                  {ticket.priority}
                </Badge>
              </SideField>
              <SideField label="Channel">
                <span style={{ fontSize: 12.5, color: "#94a3b8" }}>{ticket.channel}</span>
              </SideField>
              <SideField label="Linked Inquiry">
                <span style={{ fontSize: 12.5, color: "#818cf8", cursor: "pointer" }}>
                  <Link2 size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
                  {ticket.linkedInquiry}
                </span>
              </SideField>
              <SideField label="Created">
                <span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={11} /> {ticket.createdAt}
                </span>
              </SideField>
            </div>
          </SideCard>

          {/* Assigned */}
          <SideCard title="Assigned To">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar
                initials={ticket.assignedTo.initials}
                color="#fbbf24"
                bg="rgba(245,158,11,0.15)"
                size={36}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{ticket.assignedTo.name}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{ticket.assignedTo.role}</div>
              </div>
            </div>
            <button style={{
              width: "100%", background: "transparent",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 7, padding: "7px", color: "#64748b",
              fontSize: 12.5, cursor: "pointer",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Reassign
            </button>
          </SideCard>

          {/* Quick Actions */}
          <SideCard title="Actions">
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { label: "Create Quotation",     color: "#6366f1" },
                { label: "Convert to Job Order", color: "#3b82f6" },
                { label: "Resolve Ticket",       color: "#10b981" },
                { label: "Merge Ticket",         color: "#f59e0b" },
              ].map(({ label, color }) => (
                <button key={label} style={{
                  width: "100%", background: color + "15",
                  border: `1px solid ${color}30`, borderRadius: 7,
                  padding: "8px 12px", color: color,
                  fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                  textAlign: "left",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = color + "25")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = color + "15")}
                >
                  {label}
                </button>
              ))}
            </div>
          </SideCard>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar Helpers ──────────────────────────────────────────────────────────

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#1e293b",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10, padding: "16px",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: "#475569",
        textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 14,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function SideRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 12.5, color: "#94a3b8" }}>{value}</span>
    </div>
  )
}

function SideField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11.5, color: "#475569" }}>{label}</span>
      {children}
    </div>
  )
}
import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  ArrowLeft, Building2, Mail, Phone, MapPin,
  Tags, StickyNote, Plus, Trash2, Pencil, X,
  Check, User, Calendar, Hash, Tag, ChevronDown,
  Send, Loader2, Star, CheckCircle2, AlertCircle,
} from "lucide-react"
import api from "../../../api/axios"
import {useAuth} from "../../../context/AuthContext"
// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomerAddress  { id: number; label: string; address: string; isDefault: boolean }
interface CustomerContact  { id: number; type: string; value: string }
interface CustomerTag {
  id: number
  tagId: number
  tagName: string
  tagColor: string
  customerId: number
  createdAt: string
}

interface CustomerNote     { id: number; note: string; createdAt: string; updatedAt: string; createdByUser?: { name: string } }
interface TagOption        { id: number; name: string; color: string }

interface CustomerDetail {
  id: number
  name: string
  email: string
  phoneNumber: string
  companyName?: string
  companyEmail?: string
  isPrimary: boolean
  isStarred?: boolean
  createdAt: string
  customerAddress: CustomerAddress[]
  customerContact: CustomerContact[]
  customerTag: CustomerTag[]
  customerNote: CustomerNote[]
}

type TabKey = "overview" | "notes" | "tags"

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminCustomerDetailPage() {
  const { user } = useAuth()
  const { id }                    = useParams<{ id: string }>()
  const navigate                  = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [customer, setCustomer]   = useState<CustomerDetail | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>(
    (searchParams.get("tab") as TabKey) ?? "overview"
  )

  // Starred state (optimistic)
  const [starred, setStarred]         = useState(false)
  const [starLoading, setStarLoading] = useState(false)

  // Notes state
  const [noteText, setNoteText]       = useState("")
  const [editingNote, setEditingNote] = useState<{ id: number; text: string } | null>(null)
  const [noteLoading, setNoteLoading] = useState(false)
  const [noteError, setNoteError]     = useState<string | null>(null)

  // Tags state
  const [allTags, setAllTags]             = useState<TagOption[]>([])
  const [tagLoading, setTagLoading]       = useState(false)
  const [tagError, setTagError]           = useState<string | null>(null)
  const [tagPickerOpen, setTagPickerOpen] = useState(false)
  const [tagSearch, setTagSearch]         = useState("")

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/customer/${id}`)
      setCustomer(res.data)
      setStarred(!!res.data.isStarred)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load customer.")
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const res = await api.get("/tags")
      setAllTags(res.data)
    } catch { /* silent */ }
  }

  useEffect(() => { fetchCustomer(); fetchTags() }, [id])

  useEffect(() => {
    const tab = searchParams.get("tab") as TabKey
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab)
    setSearchParams(tab === "overview" ? {} : { tab })
  }

  // ── Star toggle ────────────────────────────────────────────────────────────
  const handleToggleStar = async () => {
    if (starLoading) return
    const next = !starred
    setStarred(next)          // optimistic
    setStarLoading(true)
    try {
      await api.patch(`/customer/${id}/starred`, { isStarred: next })
    } catch {
      setStarred(!next)       // revert on failure
    } finally {
      setStarLoading(false)
    }
  }

  // ── Notes ──────────────────────────────────────────────────────────────────
  const handleAddNote = async () => {
    if (!noteText.trim()) return
    setNoteLoading(true); setNoteError(null)
    try {
      await api.post(`/customer/${id}/note`, { note: noteText, createdBy: user?.id })
      setNoteText("")
      await fetchCustomer()
    } catch (err: any) {
      setNoteError(err.response?.data?.message || "Failed to add note.")
    } finally { setNoteLoading(false) }
  }

  const handleUpdateNote = async () => {
    if (!editingNote?.text.trim()) return
    setNoteLoading(true); setNoteError(null)
    try {
      await api.put(`/customer/${id}/note/${editingNote.id}`, { note: editingNote.text })
      setEditingNote(null)
      await fetchCustomer()
    } catch (err: any) {
      setNoteError(err.response?.data?.message || "Failed to update note.")
    } finally { setNoteLoading(false) }
  }

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm("Delete this note?")) return
    try {
      await api.delete(`/customer/${id}/note/${noteId}`)
      await fetchCustomer()
    } catch (err: any) {
      setNoteError(err.response?.data?.message || "Failed to delete note.")
    }
  }

  // ── Tags ───────────────────────────────────────────────────────────────────
  const assignedTagIds = new Set(customer?.customerTag?.map((ct) => ct.tagId) ?? [])

  const handleAddTag = async (tagId: number) => {
    setTagLoading(true); setTagError(null)
    try {
      await api.post(`/customer/${id}/tag`, { tagId })
      await fetchCustomer()
      setTagPickerOpen(false)
    } catch (err: any) {
      setTagError(err.response?.data?.message || "Failed to add tag.")
    } finally { setTagLoading(false) }
  }

  const handleRemoveTag = async (customerTagId: number) => {
    setTagLoading(true); setTagError(null)
    try {
      await api.delete(`/customer/${id}/tag/${customerTagId}`)
      await fetchCustomer()
    } catch (err: any) {
      setTagError(err.response?.data?.message || "Failed to remove tag.")
    } finally { setTagLoading(false) }
  }

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={24} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
    </div>
  )

  if (error || !customer) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
      <AlertCircle size={32} color="#f87171" />
      <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>{error ?? "Customer not found."}</p>
      <button
        onClick={() => navigate("/admin/customers")}
        style={{ marginTop: 8, fontSize: 13, color: "#818cf8", background: "none", border: "none", cursor: "pointer" }}
      >
        ← Back to Customers
      </button>
    </div>
  )

  const defaultAddress = customer.customerAddress?.find((a) => !!a.isDefault) ?? customer.customerAddress?.[0]
  const availableTags  = allTags.filter(t => !assignedTagIds.has(t.id) && t.name.toLowerCase().includes(tagSearch.toLowerCase()))

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ minHeight: "100vh", background: "#0f172a", padding: "28px 32px", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9" }}
      onClick={() => tagPickerOpen && setTagPickerOpen(false)}
    >
      {/* Back + Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate("/admin/customers")}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", padding: "0 0 12px" }}
          onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
          onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
        >
          <ArrowLeft size={14} /> Back to Customers
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #818cf8, #60a5fa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>{customer.name}</h1>
                {customer.isPrimary && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#34d399", background: "rgba(16,185,129,0.12)", padding: "3px 8px", borderRadius: 999 }}>
                    Primary
                  </span>
                )}
                {starred && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#fbbf24", background: "rgba(251,191,36,0.12)", padding: "3px 8px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={10} fill="#fbbf24" /> Starred
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
                Customer since {fmtDate(customer.createdAt)}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {/* Star toggle */}
            <button
              onClick={handleToggleStar}
              disabled={starLoading}
              title={starred ? "Unstar customer" : "Star customer"}
              style={{
                background: starred ? "rgba(251,191,36,0.1)" : "#1e293b",
                border: starred ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.08)",
                color: starred ? "#fbbf24" : "#64748b",
                cursor: starLoading ? "wait" : "pointer",
                padding: "8px 10px", borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!starred) e.currentTarget.style.color = "#fbbf24" }}
              onMouseLeave={e => { if (!starred) e.currentTarget.style.color = "#64748b" }}
            >
              <Star size={15} fill={starred ? "#fbbf24" : "none"} />
            </button>

            <button
              onClick={() => navigate(`/admin/customers/${id}/edit`)}
              style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", cursor: "pointer", padding: "8px 14px", borderRadius: 8, display: "flex", alignItems: "center", gap: 7, fontSize: 13 }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "#1e293b"}
            >
              <Pencil size={13} /> Edit Customer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {(["overview", "notes", "tags"] as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: activeTab === tab ? "rgba(129,140,248,0.06)" : "none",
                border: "none",
                color: activeTab === tab ? "#f8fafc" : "#64748b",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                padding: "10px 16px", borderRadius: "8px 8px 0 0",
                borderBottom: activeTab === tab ? "2px solid #818cf8" : "2px solid transparent",
                fontFamily: "'DM Sans', sans-serif",
              } as React.CSSProperties}
            >
              {tab === "overview" && <User size={13} />}
              {tab === "notes"    && <StickyNote size={13} />}
              {tab === "tags"     && <Tags size={13} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "notes" && (customer.customerNote?.length ?? 0) > 0 && (
                <span style={{ fontSize: 10.5, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "#94a3b8", padding: "1px 6px", borderRadius: 999 }}>
                  {customer.customerNote.length}
                </span>
              )}
              {tab === "tags" && (customer.customerTag?.length ?? 0) > 0 && (
                <span style={{ fontSize: 10.5, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "#94a3b8", padding: "1px 6px", borderRadius: 999 }}>
                  {customer.customerTag.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <SectionLabel>Contact Details</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                <InfoRow icon={<Mail  size={14} color="#818cf8" />} label="Email"        value={customer.email} />
                <InfoRow icon={<Phone size={14} color="#818cf8" />} label="Phone"        value={customer.phoneNumber} />
                {defaultAddress && (
                  <InfoRow icon={<MapPin size={14} color="#34d399" />} label="Default Address" value={`${defaultAddress.label} — ${defaultAddress.address}`} />
                )}
                {customer.companyName && (
                  <InfoRow icon={<Building2 size={14} color="#fbbf24" />} label="Company" value={customer.companyName} />
                )}
              </div>
            </Card>

            {/* All Addresses */}
            <Card>
              <SectionLabel>All Addresses</SectionLabel>
              {(customer.customerAddress?.length ?? 0) === 0 ? (
                <Empty text="No addresses on file." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 14 }}>
                  {customer.customerAddress.map((addr, i) => (
                    <div key={addr.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "11px 0",
                      borderBottom: i < customer.customerAddress.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <MapPin size={13} color="#64748b" />
                        <span style={{ fontSize: 13, color: "#cbd5e1" }}>{addr.label}</span>
                        {!!addr.isDefault && (
                          <span style={{ fontSize: 10, color: "#34d399", background: "rgba(16,185,129,0.1)", padding: "1px 6px", borderRadius: 999 }}>Default</span>
                        )}
                      </div>
                      <span style={{ fontSize: 12.5, color: "#64748b" }}>{addr.address}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* All Contacts */}
            <Card>
              <SectionLabel>Contact Channels</SectionLabel>
              {(customer.customerContact?.length ?? 0) === 0 ? (
                <Empty text="No contact channels on file." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 14 }}>
                  {customer.customerContact.map((c, i) => (
                    <div key={c.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "11px 0",
                      borderBottom: i < customer.customerContact.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <span style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.4px" }}>{c.type}</span>
                      <span style={{ fontSize: 13, color: "#cbd5e1" }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <SectionLabel>Account Info</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
                <InfoRow icon={<Hash     size={13} color="#818cf8" />} label="Customer ID" value={`#${customer.id}`}              small />
                <InfoRow icon={<Calendar size={13} color="#818cf8" />} label="Since"       value={fmtDate(customer.createdAt)}    small />
                <InfoRow icon={<Star     size={13} color="#fbbf24" />} label="Starred"     value={starred ? "Yes" : "No"}         small />
                {customer.companyEmail && (
                  <InfoRow icon={<Mail size={13} color="#818cf8" />}   label="Company Email" value={customer.companyEmail}        small />
                )}
              </div>
            </Card>

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <SectionLabel>Tags</SectionLabel>
                <button onClick={() => switchTab("tags")} style={{ fontSize: 12, color: "#818cf8", background: "none", border: "none", cursor: "pointer" }}>
                  Manage →
                </button>
              </div>
              {(customer.customerTag?.length ?? 0) === 0 ? (
                <Empty text="No tags assigned." />
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {customer.customerTag.map((ct) => (
                    <span key={ct.id} style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px", borderRadius: 999,
                      background: `${ct.tagColor ?? "#818cf8"}18`,
                      border: `1px solid ${ct.tagColor ?? "#818cf8"}33`,
                      color: ct.tagColor ?? "#818cf8", fontSize: 12, fontWeight: 500,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ct.tagColor ?? "#818cf8" }} />
                      {ct.tagName ?? "Unknown"}
                    </span>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <SectionLabel>Recent Notes</SectionLabel>
                <button onClick={() => switchTab("notes")} style={{ fontSize: 12, color: "#818cf8", background: "none", border: "none", cursor: "pointer" }}>
                  View all →
                </button>
              </div>
              {(customer.customerNote?.length ?? 0) === 0 ? (
                <Empty text="No notes yet." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                  {[...customer.customerNote].reverse().slice(0, 2).map((n) => (
                    <div key={n.id} style={{ background: "#0f172a", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "0 0 6px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{n.note}</p>
                      <span style={{ fontSize: 11, color: "#334155" }}>{fmtDate(n.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── NOTES TAB ── */}
      {activeTab === "notes" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          {/* Left — note list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <SectionLabel>Activity Notes</SectionLabel>

              {/* Composer */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 10 }}>Add a note</div>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Write a note about this customer…"
                  rows={3}
                  onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote() }}
                  style={{
                    width: "100%", background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                    padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
                    resize: "vertical", outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit", lineHeight: 1.6,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <span style={{ fontSize: 11.5, color: "#334155" }}>Ctrl+Enter to submit</span>
                  <button
                    onClick={handleAddNote}
                    disabled={noteLoading || !noteText.trim()}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "#6366f1", border: "none", borderRadius: 7,
                      padding: "7px 16px", color: "#fff", fontSize: 13, fontWeight: 500,
                      cursor: noteLoading || !noteText.trim() ? "not-allowed" : "pointer",
                      opacity: noteLoading || !noteText.trim() ? 0.5 : 1,
                    }}
                  >
                    {noteLoading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={13} />}
                    Post Note
                  </button>
                </div>
              </div>

              {noteError && <ErrorBanner message={noteError} onDismiss={() => setNoteError(null)} />}

              {/* Notes timeline */}
              {(customer.customerNote?.length ?? 0) === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#334155" }}>
                  <StickyNote size={28} style={{ opacity: 0.4, margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 13 }}>No notes yet. Add one above.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[...customer.customerNote].reverse().map((note, i, arr) => (
                    <div key={note.id} style={{ display: "flex", gap: 14 }}>
                      {/* Timeline spine */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <StickyNote size={13} color="#818cf8" />
                        </div>
                        {i < arr.length - 1 && (
                          <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.06)", minHeight: 24, margin: "4px 0" }} />
                        )}
                      </div>

                      {/* Note content */}
                      <div style={{ paddingBottom: i < arr.length - 1 ? 20 : 0, flex: 1 }}>
                        {editingNote?.id === note.id ? (
                          <div style={{ background: "#0f172a", borderRadius: 10, border: "1px solid rgba(99,102,241,0.4)", padding: "12px 14px", marginBottom: 4 }}>
                            <textarea
                              value={editingNote.text}
                              onChange={e => setEditingNote({ ...editingNote, text: e.target.value })}
                              rows={3}
                              autoFocus
                              style={{
                                width: "100%", background: "transparent",
                                border: "none", color: "#e2e8f0", fontSize: 13,
                                resize: "vertical", outline: "none", boxSizing: "border-box",
                                fontFamily: "inherit", lineHeight: 1.6,
                              }}
                            />
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                              <button onClick={() => setEditingNote(null)} style={{
                                display: "flex", alignItems: "center", gap: 5,
                                background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 7, padding: "6px 12px", color: "#64748b", fontSize: 12, cursor: "pointer",
                              }}>
                                <X size={12} /> Cancel
                              </button>
                              <button onClick={handleUpdateNote} disabled={noteLoading} style={{
                                display: "flex", alignItems: "center", gap: 5,
                                background: "#6366f1", border: "none", borderRadius: 7,
                                padding: "6px 12px", color: "#fff", fontSize: 12, cursor: "pointer",
                              }}>
                                {noteLoading
                                  ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                                  : <Check size={12} />
                                }
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>
                                {note.createdByUser?.name ?? "Admin"}
                              </span>
                              <span style={{ fontSize: 11.5, color: "#475569" }}>{fmtDateTime(note.createdAt)}</span>
                              {note.updatedAt && note.updatedAt !== note.createdAt && (
                                <span style={{ fontSize: 11, color: "#334155", fontStyle: "italic" }}>edited</span>
                              )}
                            </div>
                            <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 8px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                              {note.note}
                            </p>
                            <div style={{ display: "flex", gap: 6 }}>
                              <ActionBtn icon={<Pencil size={12} />} color="#818cf8" title="Edit"
                                onClick={() => setEditingNote({ id: note.id, text: note.note })} />
                              <ActionBtn icon={<Trash2 size={12} />} color="#f87171" title="Delete"
                                onClick={() => handleDeleteNote(note.id)} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right — customer mini-profile */}
          <CustomerSidebar customer={customer} defaultAddress={defaultAddress} starred={starred} />
        </div>
      )}

      {/* ── TAGS TAB ── */}
      {activeTab === "tags" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          {/* Left — tags */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <SectionLabel>Assigned Tags</SectionLabel>
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setTagPickerOpen(o => !o)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8, padding: "7px 13px", color: "#e2e8f0",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >
                    <Plus size={13} /> Add Tag <ChevronDown size={12} style={{ transform: tagPickerOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
                  </button>

                  {/* Tag picker dropdown */}
                  {tagPickerOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                      background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, overflow: "hidden", width: 260,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    }}>
                      <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <input
                          value={tagSearch}
                          onChange={e => setTagSearch(e.target.value)}
                          placeholder="Search tags…"
                          autoFocus
                          style={{
                            width: "100%", background: "#0f172a",
                            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
                            padding: "7px 10px", color: "#f8fafc", fontSize: 12.5,
                            outline: "none", boxSizing: "border-box",
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: 220, overflowY: "auto" }}>
                        {availableTags.length === 0 ? (
                          <div style={{ fontSize: 12.5, color: "#475569", padding: "14px 16px", textAlign: "center" }}>
                            {tagSearch ? "No tags match." : "All tags assigned."}
                          </div>
                        ) : availableTags.map(tag => (
                          <button key={tag.id} onClick={() => handleAddTag(tag.id)} disabled={tagLoading}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              width: "100%", padding: "10px 14px",
                              background: "transparent", border: "none",
                              color: "#e2e8f0", fontSize: 13, cursor: "pointer", textAlign: "left",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: tag.color, flexShrink: 0 }} />
                            <span style={{ flex: 1 }}>{tag.name}</span>
                            <Plus size={12} color="#475569" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {tagError && <ErrorBanner message={tagError} onDismiss={() => setTagError(null)} />}

              {(customer.customerTag?.length ?? 0) === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#334155" }}>
                  <Tags size={28} style={{ opacity: 0.4, margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 13 }}>No tags assigned. Use the button above to add one.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 16 }}>
                  {customer.customerTag.map((ct, i, arr) => (
                    <div key={ct.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: ct.tagColor ?? "#818cf8", flexShrink: 0 }} />
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "4px 12px", borderRadius: 999,
                          background: `${ct.tagColor ?? "#818cf8"}18`,
                          border: `1px solid ${ct.tagColor ?? "#818cf8"}30`,
                          color: ct.tagColor ?? "#818cf8",
                          fontSize: 13, fontWeight: 500,
                        }}>
                          {ct.tagName ?? "Unknown"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveTag(ct.id)}
                        disabled={tagLoading}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: "transparent", border: "1px solid rgba(248,113,113,0.2)",
                          borderRadius: 7, padding: "5px 10px", color: "#f87171",
                          fontSize: 12, cursor: tagLoading ? "not-allowed" : "pointer",
                          opacity: tagLoading ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { if (!tagLoading) e.currentTarget.style.background = "rgba(248,113,113,0.08)" }}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <X size={11} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* All available tags reference */}
            <Card>
              <SectionLabel>All Available Tags</SectionLabel>
              {allTags.length === 0 ? (
                <Empty text="No tags created yet." />
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                  {allTags.map(tag => {
                    const assigned = assignedTagIds.has(tag.id)
                    return (
                      <span key={tag.id}
                        title={assigned ? "Already assigned" : `Click to assign "${tag.name}"`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "5px 12px", borderRadius: 999,
                          background: assigned ? `${tag.color}18` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${assigned ? tag.color + "40" : "rgba(255,255,255,0.06)"}`,
                          color: assigned ? tag.color : "#475569",
                          fontSize: 12.5, fontWeight: assigned ? 500 : 400,
                          cursor: assigned ? "default" : "pointer",
                          transition: "all 0.15s",
                        }}
                        onClick={() => !assigned && !tagLoading && handleAddTag(tag.id)}
                        onMouseEnter={e => { if (!assigned) e.currentTarget.style.borderColor = tag.color + "60" }}
                        onMouseLeave={e => { if (!assigned) e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)" }}
                      >
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: assigned ? tag.color : "#334155" }} />
                        {tag.name}
                        {assigned && <CheckCircle2 size={11} />}
                      </span>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Right sidebar */}
          <CustomerSidebar customer={customer} defaultAddress={defaultAddress} starred={starred} />
        </div>
      )}
    </div>
  )
}

// ─── Shared Sidebar ───────────────────────────────────────────────────────────

function CustomerSidebar({
  customer,
  defaultAddress,
  starred,
}: {
  customer: CustomerDetail
  defaultAddress?: CustomerAddress
  starred?: boolean
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <SectionLabel>Customer</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 18px" }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "rgba(99,102,241,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, color: "#818cf8", flexShrink: 0,
          }}>
            {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 6 }}>
              {customer.name}
              {starred && <Star size={12} fill="#fbbf24" color="#fbbf24" />}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {customer.companyName ?? "Individual Customer"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <InfoRow icon={<Mail  size={13} color="#818cf8" />} label="Email"   value={customer.email}       small />
          <InfoRow icon={<Phone size={13} color="#818cf8" />} label="Phone"   value={customer.phoneNumber} small />
          {defaultAddress && (
            <InfoRow icon={<MapPin size={13} color="#818cf8" />} label="Address"
              value={`${defaultAddress.label} — ${defaultAddress.address}`} small />
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px 24px" }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>
      {children}
    </div>
  )
}

function InfoRow({ icon, label, value, small = false }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; small?: boolean
}) {
  return (
    <div style={{ display: "flex", alignItems: small ? "flex-start" : "center", gap: 10 }}>
      <div style={{ flexShrink: 0, marginTop: small ? 1 : 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: small ? 12.5 : 13.5, color: "#cbd5e1" }}>{value}</div>
      </div>
    </div>
  )
}

function ActionBtn({ icon, color, title, onClick }: {
  icon: React.ReactNode; color: string; title?: string; onClick?: () => void
}) {
  return (
    <button title={title} onClick={onClick} style={{
      width: 28, height: 28, borderRadius: 7,
      border: "1px solid rgba(255,255,255,0.06)",
      background: "transparent", color, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
      onMouseEnter={e => e.currentTarget.style.background = `${color}18`}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {icon}
    </button>
  )
}

function Empty({ text }: { text: string }) {
  return <p style={{ fontSize: 13, color: "#334155", padding: "10px 0", margin: 0 }}>{text}</p>
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
      borderRadius: 8, padding: "10px 14px", margin: "12px 0",
      color: "#f87171", fontSize: 13,
    }}>
      <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: 0, lineHeight: 1 }}>
          <X size={13} />
        </button>
      )}
    </div>
  )
}
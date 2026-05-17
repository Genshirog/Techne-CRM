import { useState } from "react"
import {
  User, MapPin, Phone, Smartphone, Bell, Shield,
  Plus, Pencil, Trash2, Check, X, Star,
  Mail, MessageSquare, ChevronRight, Save,
  Eye, EyeOff, KeyRound, LogOut,
} from "lucide-react"

// ─── Types (mirrors entities) ─────────────────────────────────────────────────

interface CustomerAddress {
  id: number
  label: string
  address: string
  isDefault: boolean
}

interface CustomerContact {
  id: number
  type: "Phone" | "Email" | "Viber" | "WhatsApp"
  value: string
}

interface DeviceModel {
  id: number
  name: string
  brand: string
  category: string
}

interface CustomerDevice {
  id: number
  deviceModelId: number
  model: DeviceModel
  serialNumber: string
  purchaseTime: string | null
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROFILE = {
  firstName: "Aisha",
  lastName: "Okonkwo",
  email: "aisha.okonkwo@email.com",
  initials: "AO",
  memberSince: "March 2025",
  isPrimary: true,
}

const MOCK_ADDRESSES: CustomerAddress[] = [
  { id: 1, label: "Home",   address: "42 Mahogany St., Davao City, 8000",        isDefault: true  },
  { id: 2, label: "Office", address: "Unit 5B, Abreeza Tower, JP Laurel, Davao", isDefault: false },
]

const MOCK_CONTACTS: CustomerContact[] = [
  { id: 1, type: "Phone",    value: "+63 917 234 5678" },
  { id: 2, type: "Viber",    value: "+63 917 234 5678" },
  { id: 3, type: "Email",    value: "aisha.okonkwo@email.com" },
]

const MOCK_DEVICES: CustomerDevice[] = [
  {
    id: 1, deviceModelId: 1,
    model: { id: 1, name: "Inverter Split-Type AC", brand: "Carrier", category: "Air Conditioner" },
    serialNumber: "CA-2023-887712",
    purchaseTime: "2023-06-15",
  },
  {
    id: 2, deviceModelId: 2,
    model: { id: 2, name: "Residential Circuit Breaker", brand: "Schneider", category: "Electrical" },
    serialNumber: "SE-2021-445521",
    purchaseTime: "2021-03-10",
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const CONTACT_TYPE_META: Record<CustomerContact["type"], { color: string; bg: string; icon: React.ElementType }> = {
  Phone:    { color: "#34d399", bg: "rgba(52,211,153,0.12)",  icon: Phone       },
  Email:    { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  icon: Mail        },
  Viber:    { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", icon: MessageSquare },
  WhatsApp: { color: "#34d399", bg: "rgba(52,211,153,0.12)",  icon: MessageSquare },
}

const CONTACT_TYPES: CustomerContact["type"][] = ["Phone", "Email", "Viber", "WhatsApp"]

const TABS = [
  { key: "profile",   label: "Profile",   icon: User       },
  { key: "addresses", label: "Addresses", icon: MapPin     },
  { key: "contacts",  label: "Contacts",  icon: Phone      },
  { key: "devices",   label: "Devices",   icon: Smartphone },
  { key: "security",  label: "Security",  icon: Shield     },
] as const

type Tab = typeof TABS[number]["key"]

// ─── Shared ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
      {children}
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "#1e293b",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 14, padding: "22px 24px",
      ...style,
    }}>
      {children}
    </div>
  )
}

function FieldInput({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string
}) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", height: 42,
          padding: "0 14px",
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10, color: "#e2e8f0",
          fontSize: 13.5, outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={e => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
      />
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const [form, setForm] = useState({
    firstName: MOCK_PROFILE.firstName,
    lastName:  MOCK_PROFILE.lastName,
    email:     MOCK_PROFILE.email,
  })
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card>
        <SectionLabel>Personal Information</SectionLabel>

        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            {MOCK_PROFILE.initials}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>
              {form.firstName} {form.lastName}
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>
              Member since {MOCK_PROFILE.memberSince}
            </div>
            {MOCK_PROFILE.isPrimary && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                marginTop: 6, fontSize: 11, fontWeight: 600,
                color: "#fbbf24", background: "rgba(251,191,36,0.1)",
                padding: "2px 8px", borderRadius: 20,
              }}>
                <Star size={9} fill="#fbbf24" /> Primary Account
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <FieldInput label="First Name" value={form.firstName} onChange={v => setForm(p => ({ ...p, firstName: v }))} />
          <FieldInput label="Last Name"  value={form.lastName}  onChange={v => setForm(p => ({ ...p, lastName: v }))}  />
        </div>
        <FieldInput label="Email Address" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} type="email" />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button
            onClick={save}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: saved ? "rgba(52,211,153,0.15)" : "#6366f1",
              border: saved ? "1px solid rgba(52,211,153,0.25)" : "none",
              borderRadius: 9, padding: "9px 20px",
              color: saved ? "#34d399" : "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </Card>

      <Card>
        <SectionLabel>Danger Zone</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#f1f5f9", marginBottom: 3 }}>Delete Account</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Permanently remove your account and all data.</div>
          </div>
          <button style={{
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 9, padding: "8px 16px",
            color: "#f87171", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            Delete Account
          </button>
        </div>
      </Card>
    </div>
  )
}

// ─── Addresses Tab ────────────────────────────────────────────────────────────

function AddressesTab() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>(MOCK_ADDRESSES)
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [adding, setAdding]         = useState(false)
  const [draft, setDraft]           = useState({ label: "", address: "" })

  const setDefault = (id: number) =>
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))

  const remove = (id: number) =>
    setAddresses(prev => prev.filter(a => a.id !== id))

  const saveEdit = (id: number) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...draft } : a))
    setEditingId(null)
  }

  const addNew = () => {
    if (!draft.label.trim() || !draft.address.trim()) return
    setAddresses(prev => [...prev, { id: Date.now(), ...draft, isDefault: prev.length === 0 }])
    setDraft({ label: "", address: "" })
    setAdding(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SectionLabel>Saved Addresses</SectionLabel>
          <button
            onClick={() => { setAdding(true); setDraft({ label: "", address: "" }) }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 8, padding: "6px 12px",
              color: "#818cf8", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
            }}
          >
            <Plus size={13} /> Add Address
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{
              background: "#0f172a",
              border: addr.isDefault ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12, padding: "16px 18px",
            }}>
              {editingId === addr.id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 10 }}>
                    <FieldInput label="Label"   value={draft.label}   onChange={v => setDraft(p => ({ ...p, label: v }))}   placeholder="e.g. Home" />
                    <FieldInput label="Address" value={draft.address} onChange={v => setDraft(p => ({ ...p, address: v }))} placeholder="Full address" />
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => setEditingId(null)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 14px", color: "#64748b", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                    <button onClick={() => saveEdit(addr.id)} style={{ background: "#6366f1", border: "none", borderRadius: 7, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: addr.isDefault ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: addr.isDefault ? "#818cf8" : "#475569",
                    }}>
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#e2e8f0" }}>{addr.label}</span>
                        {addr.isDefault && (
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: "#818cf8", background: "rgba(99,102,241,0.1)", padding: "2px 8px", borderRadius: 20 }}>
                            Default
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5 }}>{addr.address}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {!addr.isDefault && (
                      <button onClick={() => setDefault(addr.id)} title="Set as default" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "5px 10px", color: "#475569", fontSize: 11.5, cursor: "pointer" }}>
                        Set Default
                      </button>
                    )}
                    <button onClick={() => { setEditingId(addr.id); setDraft({ label: addr.label, address: addr.address }) }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "6px 8px", color: "#475569", cursor: "pointer", display: "flex" }}>
                      <Pencil size={13} />
                    </button>
                    {!addr.isDefault && (
                      <button onClick={() => remove(addr.id)} style={{ background: "transparent", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 7, padding: "6px 8px", color: "#f87171", cursor: "pointer", display: "flex" }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add form */}
          {adding && (
            <div style={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "#818cf8", marginBottom: 12, fontWeight: 600 }}>New Address</div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 10, marginBottom: 12 }}>
                <FieldInput label="Label"   value={draft.label}   onChange={v => setDraft(p => ({ ...p, label: v }))}   placeholder="e.g. Home" />
                <FieldInput label="Address" value={draft.address} onChange={v => setDraft(p => ({ ...p, address: v }))} placeholder="Full address" />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setAdding(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 14px", color: "#64748b", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                <button onClick={addNew} style={{ background: "#6366f1", border: "none", borderRadius: 7, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────────

function ContactsTab() {
  const [contacts, setContacts]   = useState<CustomerContact[]>(MOCK_CONTACTS)
  const [adding, setAdding]       = useState(false)
  const [draft, setDraft]         = useState<{ type: CustomerContact["type"]; value: string }>({ type: "Phone", value: "" })

  const remove = (id: number) => setContacts(prev => prev.filter(c => c.id !== id))

  const addNew = () => {
    if (!draft.value.trim()) return
    setContacts(prev => [...prev, { id: Date.now(), ...draft }])
    setDraft({ type: "Phone", value: "" })
    setAdding(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SectionLabel>Contact Details</SectionLabel>
          <button
            onClick={() => setAdding(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 8, padding: "6px 12px",
              color: "#818cf8", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
            }}
          >
            <Plus size={13} /> Add Contact
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {contacts.map(c => {
            const meta = CONTACT_TYPE_META[c.type]
            const Icon = meta.icon
            return (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 11, padding: "13px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, flexShrink: 0 }}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{c.type}</div>
                    <div style={{ fontSize: 13.5, color: "#e2e8f0" }}>{c.value}</div>
                  </div>
                </div>
                <button onClick={() => remove(c.id)} style={{ background: "transparent", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 7, padding: "6px 8px", color: "#f87171", cursor: "pointer", display: "flex" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}

          {adding && (
            <div style={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 11, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "#818cf8", marginBottom: 12, fontWeight: 600 }}>New Contact</div>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Type</div>
                  <select
                    value={draft.type}
                    onChange={e => setDraft(p => ({ ...p, type: e.target.value as CustomerContact["type"] }))}
                    style={{
                      width: "100%", height: 42, padding: "0 12px",
                      background: "#1e293b", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 10, color: "#e2e8f0", fontSize: 13, outline: "none",
                    }}
                  >
                    {CONTACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <FieldInput label="Value" value={draft.value} onChange={v => setDraft(p => ({ ...p, value: v }))} placeholder="+63 9xx xxx xxxx" />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setAdding(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 14px", color: "#64748b", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                <button onClick={addNew} style={{ background: "#6366f1", border: "none", borderRadius: 7, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── Devices Tab ──────────────────────────────────────────────────────────────

function DevicesTab() {
  const [devices] = useState<CustomerDevice[]>(MOCK_DEVICES)

  const CATEGORY_META: Record<string, { color: string; bg: string }> = {
    "Air Conditioner": { color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
    "Electrical":      { color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
    "Plumbing":        { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SectionLabel>Registered Devices</SectionLabel>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 8, padding: "6px 12px",
            color: "#818cf8", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
          }}>
            <Plus size={13} /> Add Device
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {devices.map(d => {
            const meta = CATEGORY_META[d.model.category] ?? { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" }
            return (
              <div key={d.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 12, padding: "16px 18px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Smartphone size={18} color={meta.color} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#e2e8f0" }}>{d.model.name}</span>
                      <span style={{ fontSize: 11, color: meta.color, background: meta.bg, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>
                        {d.model.category}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#475569" }}>
                      <span>{d.model.brand}</span>
                      <span>·</span>
                      <span style={{ fontFamily: "monospace" }}>S/N: {d.serialNumber}</span>
                      {d.purchaseTime && (
                        <>
                          <span>·</span>
                          <span>Purchased {new Date(d.purchaseTime).toLocaleDateString("en-PH", { year: "numeric", month: "short" })}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "6px 8px", color: "#475569", cursor: "pointer", display: "flex" }}>
                    <Pencil size={13} />
                  </button>
                  <button style={{ background: "transparent", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 7, padding: "6px 8px", color: "#f87171", cursor: "pointer", display: "flex" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <SectionLabel>About Device Registration</SectionLabel>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
          Registering your devices helps our technicians prepare before arriving on-site —
          they'll already know the model, brand, and service history so you get faster, more accurate service.
        </p>
      </Card>
    </div>
  )
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" })
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false })
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
    setForm({ current: "", newPass: "", confirm: "" })
  }

  const strength = (() => {
    const p = form.newPass
    if (!p) return null
    let score = 0
    if (p.length >= 8)         score++
    if (/[A-Z]/.test(p))       score++
    if (/[0-9]/.test(p))       score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  })()

  const strengthLabel = strength === null ? null : ["Weak", "Fair", "Good", "Strong"][strength - 1] ?? "Weak"
  const strengthColor = ["#f87171", "#fbbf24", "#60a5fa", "#34d399"][Math.max(0, (strength ?? 1) - 1)]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card>
        <SectionLabel>Change Password</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(["current", "newPass", "confirm"] as const).map(field => (
            <div key={field}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                {{ current: "Current Password", newPass: "New Password", confirm: "Confirm New Password" }[field]}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={show[field] ? "text" : "password"}
                  value={form[field]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  style={{
                    width: "100%", height: 42,
                    padding: "0 42px 0 14px",
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, color: "#e2e8f0",
                    fontSize: 13.5, outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
                />
                <button
                  onClick={() => setShow(p => ({ ...p, [field]: !p[field] }))}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#475569", cursor: "pointer", display: "flex" }}
                >
                  {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {field === "newPass" && strength !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ width: `${(strength / 4) * 100}%`, height: "100%", borderRadius: 99, background: strengthColor, transition: "width 0.3s, background 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor, fontWeight: 500, width: 40 }}>{strengthLabel}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button
            onClick={save}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: saved ? "rgba(52,211,153,0.15)" : "#6366f1",
              border: saved ? "1px solid rgba(52,211,153,0.25)" : "none",
              borderRadius: 9, padding: "9px 20px",
              color: saved ? "#34d399" : "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {saved ? <><Check size={14} /> Updated</> : <><KeyRound size={14} /> Update Password</>}
          </button>
        </div>
      </Card>

      <Card>
        <SectionLabel>Sessions</SectionLabel>
        {[
          { device: "Chrome · Windows 11", location: "Davao City, PH", time: "Active now", current: true },
          { device: "Safari · iPhone 15",  location: "Davao City, PH", time: "2 hours ago",  current: false },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 0",
            borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: s.current ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={15} color={s.current ? "#34d399" : "#475569"} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", marginBottom: 2 }}>
                  {s.device}
                  {s.current && <span style={{ marginLeft: 8, fontSize: 10.5, color: "#34d399", background: "rgba(52,211,153,0.1)", padding: "1px 7px", borderRadius: 20 }}>Current</span>}
                </div>
                <div style={{ fontSize: 12, color: "#475569" }}>{s.location} · {s.time}</div>
              </div>
            </div>
            {!s.current && (
              <button style={{ background: "transparent", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 7, padding: "6px 12px", color: "#f87171", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <LogOut size={12} /> Revoke
              </button>
            )}
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile")

  const TAB_CONTENT: Record<Tab, React.ReactNode> = {
    profile:   <ProfileTab />,
    addresses: <AddressesTab />,
    contacts:  <ContactsTab />,
    devices:   <DevicesTab />,
    security:  <SecurityTab />,
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#f1f5f9",
    }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>Settings</h1>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>Manage your account, addresses, contacts and devices.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>

        {/* Sidebar nav */}
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", position: "sticky", top: 28 }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "12px 18px",
                  background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                  border: "none",
                  borderLeft: isActive ? "2px solid #6366f1" : "2px solid transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  color: isActive ? "#e2e8f0" : "#64748b",
                  fontSize: 13.5, fontWeight: isActive ? 500 : 400,
                  cursor: "pointer", textAlign: "left",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
              >
                <Icon size={16} color={isActive ? "#818cf8" : "inherit"} style={{ flexShrink: 0 }} />
                {tab.label}
                <ChevronRight size={13} color={isActive ? "#818cf8" : "#334155"} style={{ marginLeft: "auto" }} />
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div>{TAB_CONTENT[activeTab]}</div>
      </div>
    </div>
  )
}
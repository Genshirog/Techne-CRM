import { useState } from "react"
import {
  Smartphone, Plus, Pencil, Trash2, Check,
  ChevronRight, ChevronDown, Search, X,
  Layers, Tag, Cpu, MoreHorizontal,
} from "lucide-react"

// ─── Types (mirrors entities) ─────────────────────────────────────────────────

interface DeviceType {
  id: number
  name: string
  createdAt: string
}

interface DeviceBrand {
  id: number
  deviceTypeId: number
  name: string
  createdAt: string
}

interface DeviceModel {
  id: number
  deviceBrandId: number
  name: string
  createdAt: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INIT_TYPES: DeviceType[] = [
  { id: 1, name: "Air Conditioner",   createdAt: "Jan 10, 2025" },
  { id: 2, name: "Electrical",        createdAt: "Jan 10, 2025" },
  { id: 3, name: "Plumbing",          createdAt: "Feb 3, 2025"  },
  { id: 4, name: "Solar Panel",       createdAt: "Mar 15, 2025" },
]

const INIT_BRANDS: DeviceBrand[] = [
  { id: 1, deviceTypeId: 1, name: "Carrier",     createdAt: "Jan 12, 2025" },
  { id: 2, deviceTypeId: 1, name: "Daikin",      createdAt: "Jan 12, 2025" },
  { id: 3, deviceTypeId: 1, name: "Midea",       createdAt: "Feb 1, 2025"  },
  { id: 4, deviceTypeId: 2, name: "Schneider",   createdAt: "Jan 15, 2025" },
  { id: 5, deviceTypeId: 2, name: "ABB",         createdAt: "Feb 20, 2025" },
  { id: 6, deviceTypeId: 3, name: "American Standard", createdAt: "Feb 5, 2025" },
  { id: 7, deviceTypeId: 4, name: "Huawei",      createdAt: "Mar 16, 2025" },
  { id: 8, deviceTypeId: 4, name: "SolarEdge",   createdAt: "Mar 16, 2025" },
]

const INIT_MODELS: DeviceModel[] = [
  { id: 1,  deviceBrandId: 1, name: "Inverter Split-Type 1.5HP",    createdAt: "Jan 13, 2025" },
  { id: 2,  deviceBrandId: 1, name: "Cassette Type 2HP",            createdAt: "Jan 13, 2025" },
  { id: 3,  deviceBrandId: 2, name: "FTKF35 Inverter",              createdAt: "Jan 14, 2025" },
  { id: 4,  deviceBrandId: 2, name: "RKS50 Multi-Split",            createdAt: "Jan 14, 2025" },
  { id: 5,  deviceBrandId: 3, name: "Aurora Inverter 1HP",          createdAt: "Feb 2, 2025"  },
  { id: 6,  deviceBrandId: 4, name: "Acti9 Circuit Breaker",        createdAt: "Jan 16, 2025" },
  { id: 7,  deviceBrandId: 4, name: "Homeline Load Center",         createdAt: "Jan 16, 2025" },
  { id: 8,  deviceBrandId: 5, name: "OT45 Transfer Switch",         createdAt: "Feb 21, 2025" },
  { id: 9,  deviceBrandId: 6, name: "Colony Toilet Suite",          createdAt: "Feb 6, 2025"  },
  { id: 10, deviceBrandId: 7, name: "SUN2000-5KTL Inverter",        createdAt: "Mar 17, 2025" },
  { id: 11, deviceBrandId: 8, name: "SE5000H Solar Optimizer",      createdAt: "Mar 18, 2025" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_COLORS = [
  { color: "#38bdf8", bg: "rgba(56,189,248,0.12)"  },
  { color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  { color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  { color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
]

function typeColor(typeId: number) {
  return TYPE_COLORS[(typeId - 1) % TYPE_COLORS.length]
}

// ─── Inline Edit Input ────────────────────────────────────────────────────────

function InlineInput({
  value, onChange, onSave, onCancel, placeholder,
}: {
  value: string; onChange: (v: string) => void
  onSave: () => void; onCancel: () => void; placeholder?: string
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
      <input
        autoFocus
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel() }}
        placeholder={placeholder}
        style={{
          flex: 1, height: 34, padding: "0 12px",
          background: "#0f172a", border: "1px solid rgba(99,102,241,0.4)",
          borderRadius: 8, color: "#e2e8f0", fontSize: 13, outline: "none",
        }}
      />
      <button onClick={onSave} style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={13} />
      </button>
      <button onClick={onCancel} style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={13} />
      </button>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDevicesPage() {
  const [types,  setTypes]  = useState<DeviceType[]>(INIT_TYPES)
  const [brands, setBrands] = useState<DeviceBrand[]>(INIT_BRANDS)
  const [models, setModels] = useState<DeviceModel[]>(INIT_MODELS)

  const [search, setSearch] = useState("")

  // expanded state
  const [expandedTypes,  setExpandedTypes]  = useState<Set<number>>(new Set([1]))
  const [expandedBrands, setExpandedBrands] = useState<Set<number>>(new Set([1]))

  // editing state
  const [editingType,  setEditingType]  = useState<number | null>(null)
  const [editingBrand, setEditingBrand] = useState<number | null>(null)
  const [editingModel, setEditingModel] = useState<number | null>(null)
  const [draft, setDraft] = useState("")

  // adding state
  const [addingType,  setAddingType]  = useState(false)
  const [addingBrandFor, setAddingBrandFor] = useState<number | null>(null)   // typeId
  const [addingModelFor, setAddingModelFor] = useState<number | null>(null)   // brandId
  const [addDraft, setAddDraft] = useState("")

  // ── Toggles ──────────────────────────────────────────────────────────────────

  const toggleType = (id: number) =>
    setExpandedTypes(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const toggleBrand = (id: number) =>
    setExpandedBrands(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  // ── CRUD: Types ───────────────────────────────────────────────────────────────

  const saveType = (id: number) => {
    if (!draft.trim()) return
    setTypes(prev => prev.map(t => t.id === id ? { ...t, name: draft } : t))
    setEditingType(null)
  }

  const deleteType = (id: number) => {
    const brandIds = brands.filter(b => b.deviceTypeId === id).map(b => b.id)
    setModels(prev => prev.filter(m => !brandIds.includes(m.deviceBrandId)))
    setBrands(prev => prev.filter(b => b.deviceTypeId !== id))
    setTypes(prev => prev.filter(t => t.id !== id))
  }

  const addType = () => {
    if (!addDraft.trim()) return
    setTypes(prev => [...prev, { id: Date.now(), name: addDraft.trim(), createdAt: "Today" }])
    setAddDraft(""); setAddingType(false)
  }

  // ── CRUD: Brands ──────────────────────────────────────────────────────────────

  const saveBrand = (id: number) => {
    if (!draft.trim()) return
    setBrands(prev => prev.map(b => b.id === id ? { ...b, name: draft } : b))
    setEditingBrand(null)
  }

  const deleteBrand = (id: number) => {
    setModels(prev => prev.filter(m => m.deviceBrandId !== id))
    setBrands(prev => prev.filter(b => b.id !== id))
  }

  const addBrand = (typeId: number) => {
    if (!addDraft.trim()) return
    setBrands(prev => [...prev, { id: Date.now(), deviceTypeId: typeId, name: addDraft.trim(), createdAt: "Today" }])
    setAddDraft(""); setAddingBrandFor(null)
  }

  // ── CRUD: Models ──────────────────────────────────────────────────────────────

  const saveModel = (id: number) => {
    if (!draft.trim()) return
    setModels(prev => prev.map(m => m.id === id ? { ...m, name: draft } : m))
    setEditingModel(null)
  }

  const deleteModel = (id: number) => setModels(prev => prev.filter(m => m.id !== id))

  const addModel = (brandId: number) => {
    if (!addDraft.trim()) return
    setModels(prev => [...prev, { id: Date.now(), deviceBrandId: brandId, name: addDraft.trim(), createdAt: "Today" }])
    setAddDraft(""); setAddingModelFor(null)
  }

  // ── Search filter ─────────────────────────────────────────────────────────────

  const q = search.toLowerCase()
  const filteredTypes = types.filter(t => {
    if (!q) return true
    const brandIds = brands.filter(b => b.deviceTypeId === t.id && (b.name.toLowerCase().includes(q) || models.some(m => m.deviceBrandId === b.id && m.name.toLowerCase().includes(q)))).map(b => b.id)
    return t.name.toLowerCase().includes(q) || brandIds.length > 0
  })

  // ── Stats ─────────────────────────────────────────────────────────────────────

  const stats = [
    { label: "Device Types",  value: types.length,  icon: Layers,     color: "#818cf8", bg: "rgba(129,140,248,0.12)" },
    { label: "Brands",        value: brands.length, icon: Tag,        color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
    { label: "Models",        value: models.length, icon: Cpu,        color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
    { label: "In Use",        value: 4,             icon: Smartphone, color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  ]

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a",
      padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#f1f5f9",
    }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.4px" }}>Device Catalog</h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>
            Manage device types, brands, and models used across inquiries.
          </p>
        </div>
        <button
          onClick={() => { setAddingType(true); setAddDraft("") }}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "#6366f1", border: "none", borderRadius: 9,
            padding: "9px 18px", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#4f46e5")}
          onMouseLeave={e => (e.currentTarget.style.background = "#6366f1")}
        >
          <Plus size={14} /> Add Device Type
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 22px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main card */}
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{types.length}</span> types ·{" "}
            <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{brands.length}</span> brands ·{" "}
            <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{models.length}</span> models
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "7px 12px" }}>
            <Search size={13} color="#475569" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search types, brands, models…"
              style={{ border: "none", background: "transparent", fontSize: 12.5, color: "#e2e8f0", outline: "none", width: 200 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", color: "#475569", cursor: "pointer", display: "flex", padding: 0 }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          {[
            { icon: Layers,     label: "Device Type"  },
            { icon: Tag,        label: "Brand"        },
            { icon: Cpu,        label: "Model"        },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ padding: "10px 22px", display: "flex", alignItems: "center", gap: 7, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
              <Icon size={13} color="#475569" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.7px" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Tree */}
        <div>
          {/* Add type row */}
          {addingType && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(99,102,241,0.04)" }}>
              <div style={{ padding: "12px 22px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
                <InlineInput
                  value={addDraft} onChange={setAddDraft}
                  onSave={addType} onCancel={() => setAddingType(false)}
                  placeholder="Device type name…"
                />
              </div>
              <div /><div />
            </div>
          )}

          {filteredTypes.map(type => {
            const tc = typeColor(type.id)
            const typeExpanded = expandedTypes.has(type.id)
            const typeBrands = brands.filter(b => b.deviceTypeId === type.id).filter(b =>
              !q || b.name.toLowerCase().includes(q) || models.some(m => m.deviceBrandId === b.id && m.name.toLowerCase().includes(q))
            )

            return (
              <div key={type.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>

                {/* Type row */}
                <div
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(255,255,255,0.01)" }}
                >
                  <div style={{ padding: "14px 22px", display: "flex", alignItems: "center", gap: 10, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                    <button
                      onClick={() => toggleType(type.id)}
                      style={{ background: "transparent", border: "none", color: "#475569", cursor: "pointer", display: "flex", padding: 2, flexShrink: 0 }}
                    >
                      {typeExpanded
                        ? <ChevronDown size={14} />
                        : <ChevronRight size={14} />}
                    </button>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Layers size={13} color={tc.color} />
                    </div>

                    {editingType === type.id ? (
                      <InlineInput value={draft} onChange={setDraft} onSave={() => saveType(type.id)} onCancel={() => setEditingType(null)} />
                    ) : (
                      <>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#e2e8f0", flex: 1 }}>{type.name}</span>
                        <div style={{ display: "flex", gap: 5, opacity: 0, transition: "opacity 0.15s" }} className="row-actions">
                          <button onClick={() => { setEditingType(type.id); setDraft(type.name) }} style={{ width: 26, height: 26, borderRadius: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Pencil size={11} /></button>
                          <button onClick={() => deleteType(type.id)} style={{ width: 26, height: 26, borderRadius: 6, background: "transparent", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={11} /></button>
                        </div>
                      </>
                    )}
                  </div>
                  <div style={{ padding: "14px 22px", display: "flex", alignItems: "center", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 12, color: "#334155" }}>{typeBrands.length} brand{typeBrands.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ padding: "14px 22px", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#334155" }}>
                      {models.filter(m => typeBrands.map(b => b.id).includes(m.deviceBrandId)).length} model{models.filter(m => typeBrands.map(b => b.id).includes(m.deviceBrandId)).length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Brands under this type */}
                {typeExpanded && (
                  <>
                    {typeBrands.map(brand => {
                      const brandExpanded = expandedBrands.has(brand.id)
                      const brandModels = models.filter(m => m.deviceBrandId === brand.id).filter(m => !q || m.name.toLowerCase().includes(q) || brand.name.toLowerCase().includes(q) || type.name.toLowerCase().includes(q))

                      return (
                        <div key={brand.id}>
                          {/* Brand row */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                            <div style={{ padding: "12px 22px 12px 52px", display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                              <div style={{ width: 1, height: 16, background: "#1e3a5f", flexShrink: 0 }} />
                            </div>
                            <div style={{ padding: "12px 22px", display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                              <button
                                onClick={() => toggleBrand(brand.id)}
                                style={{ background: "transparent", border: "none", color: "#475569", cursor: "pointer", display: "flex", padding: 2, flexShrink: 0 }}
                              >
                                {brandExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                              </button>
                              <div style={{ width: 24, height: 24, borderRadius: 6, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Tag size={11} color={tc.color} />
                              </div>

                              {editingBrand === brand.id ? (
                                <InlineInput value={draft} onChange={setDraft} onSave={() => saveBrand(brand.id)} onCancel={() => setEditingBrand(null)} />
                              ) : (
                                <>
                                  <span style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1", flex: 1 }}>{brand.name}</span>
                                  <div style={{ display: "flex", gap: 4 }}>
                                    <button
                                      onClick={() => { setAddingModelFor(brand.id === addingModelFor ? null : brand.id); setAddDraft(""); if (!brandExpanded) toggleBrand(brand.id) }}
                                      style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 6, padding: "4px 8px", color: "#818cf8", fontSize: 11, cursor: "pointer" }}
                                    >
                                      <Plus size={10} /> Model
                                    </button>
                                    <button onClick={() => { setEditingBrand(brand.id); setDraft(brand.name) }} style={{ width: 24, height: 24, borderRadius: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Pencil size={10} /></button>
                                    <button onClick={() => deleteBrand(brand.id)} style={{ width: 24, height: 24, borderRadius: 6, background: "transparent", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={10} /></button>
                                  </div>
                                </>
                              )}
                            </div>
                            <div style={{ padding: "12px 22px", display: "flex", alignItems: "center" }}>
                              <span style={{ fontSize: 12, color: "#334155" }}>{brandModels.length} model{brandModels.length !== 1 ? "s" : ""}</span>
                            </div>
                          </div>

                          {/* Models under this brand */}
                          {brandExpanded && (
                            <>
                              {brandModels.map(model => (
                                <div key={model.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.02)", background: "rgba(255,255,255,0.008)" }}>
                                  <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }} />
                                  <div style={{ padding: "10px 22px 10px 52px", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                                    <div style={{ width: 1, height: 14, background: "#1e3a5f" }} />
                                  </div>
                                  <div style={{ padding: "10px 22px", display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                      <Cpu size={10} color="#475569" />
                                    </div>

                                    {editingModel === model.id ? (
                                      <InlineInput value={draft} onChange={setDraft} onSave={() => saveModel(model.id)} onCancel={() => setEditingModel(null)} />
                                    ) : (
                                      <>
                                        <span style={{ fontSize: 12.5, color: "#94a3b8", flex: 1 }}>{model.name}</span>
                                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                          <button onClick={() => { setEditingModel(model.id); setDraft(model.name) }} style={{ width: 22, height: 22, borderRadius: 5, background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Pencil size={9} /></button>
                                          <button onClick={() => deleteModel(model.id)} style={{ width: 22, height: 22, borderRadius: 5, background: "transparent", border: "1px solid rgba(248,113,113,0.12)", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={9} /></button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {/* Add model inline */}
                              {addingModelFor === brand.id && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.02)", background: "rgba(99,102,241,0.03)" }}>
                                  <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }} />
                                  <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }} />
                                  <div style={{ padding: "10px 22px", display: "flex", alignItems: "center", gap: 8 }}>
                                    <InlineInput
                                      value={addDraft} onChange={setAddDraft}
                                      onSave={() => addModel(brand.id)}
                                      onCancel={() => setAddingModelFor(null)}
                                      placeholder="Model name…"
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}

                    {/* Add brand row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.01)" }}>
                      <div style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }} />
                      <div style={{ padding: "10px 22px", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                        {addingBrandFor === type.id ? (
                          <InlineInput
                            value={addDraft} onChange={setAddDraft}
                            onSave={() => addBrand(type.id)}
                            onCancel={() => setAddingBrandFor(null)}
                            placeholder="Brand name…"
                          />
                        ) : (
                          <button
                            onClick={() => { setAddingBrandFor(type.id); setAddDraft("") }}
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 12px", color: "#475569", fontSize: 12, cursor: "pointer", width: "100%" }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                          >
                            <Plus size={11} /> Add Brand
                          </button>
                        )}
                      </div>
                      <div />
                    </div>
                  </>
                )}
              </div>
            )
          })}

          {filteredTypes.length === 0 && (
            <div style={{ padding: "48px 28px", textAlign: "center", color: "#334155" }}>
              <Smartphone size={28} style={{ marginBottom: 10 }} />
              <p style={{ margin: 0, fontSize: 13.5, color: "#475569" }}>No results for "{search}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Dropdown Preview */}
      <div style={{ marginTop: 20, background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 16 }}>
          Inquiry Dropdown Preview
        </div>
        <p style={{ fontSize: 12.5, color: "#475569", margin: "0 0 16px", lineHeight: 1.6 }}>
          This is how the device selector will appear in the inquiry form — cascading from Type → Brand → Model.
        </p>
        <DropdownPreview types={types} brands={brands} models={models} />
      </div>
    </div>
  )
}

// ─── Dropdown Preview ─────────────────────────────────────────────────────────

function DropdownPreview({ types, brands, models }: { types: DeviceType[]; brands: DeviceBrand[]; models: DeviceModel[] }) {
  const [selType,  setSelType]  = useState<number | "">("")
  const [selBrand, setSelBrand] = useState<number | "">("")
  const [selModel, setSelModel] = useState<number | "">("")

  const filteredBrands = brands.filter(b => b.deviceTypeId === selType)
  const filteredModels = models.filter(m => m.deviceBrandId === selBrand)

  const selectStyle: React.CSSProperties = {
    width: "100%", height: 40, padding: "0 12px",
    background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 9, color: "#e2e8f0", fontSize: 13, outline: "none",
    appearance: "none",
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
      <div>
        <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 6 }}>Device Type</div>
        <select value={selType} onChange={e => { setSelType(Number(e.target.value) || ""); setSelBrand(""); setSelModel("") }} style={selectStyle}>
          <option value="">Select type…</option>
          {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11.5, color: selType ? "#64748b" : "#334155", marginBottom: 6 }}>Brand</div>
        <select value={selBrand} onChange={e => { setSelBrand(Number(e.target.value) || ""); setSelModel("") }} disabled={!selType} style={{ ...selectStyle, opacity: selType ? 1 : 0.4 }}>
          <option value="">Select brand…</option>
          {filteredBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11.5, color: selBrand ? "#64748b" : "#334155", marginBottom: 6 }}>Model</div>
        <select value={selModel} onChange={e => setSelModel(Number(e.target.value) || "")} disabled={!selBrand} style={{ ...selectStyle, opacity: selBrand ? 1 : 0.4 }}>
          <option value="">Select model…</option>
          {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
    </div>
  )
}
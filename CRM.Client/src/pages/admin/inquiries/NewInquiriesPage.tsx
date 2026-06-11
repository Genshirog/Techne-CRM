import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft, ClipboardList, Save, CheckCircle2,
  AlertCircle, ChevronDown, User, UserPlus, MapPin,
} from "lucide-react"
import api from "../../../api/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceCategory  { id: number; name: string }
interface Service          { id: number; name: string; serviceCategoryId: number }
interface DeviceType       { id: number; name: string }
interface DeviceBrand      { id: number; name: string }
interface DeviceModel      { id: number; name: string; brandId: number }
interface CustomerDevice   { id: number; deviceModelId: number; serialNumber: string }
interface Customer         { id: number; name: string; phoneNumber: string; email: string }
interface CustomerAddress  { id: number; label: string; address: string; isDefault: boolean }

type ClientMode = "existing" | "guest"

interface FormData {
  customerId:          number | null
  addressId:           number | null
  guestName:           string
  guestContact:        string
  guestEmail:          string
  guestStreet:         string
  guestRegion:         string
  guestProvince:       string
  guestCity:           string
  guestZip:            string
  serviceCategoryId:   number | null
  serviceId:           number | null
  deviceTypeId:        number | null
  deviceBrandId:       number | null
  deviceModelId:       number | null
  customerDeviceId:    number | null
  preferredDate:       string
  preferredTime:       string
  urgency:             "Normal" | "Urgent" | "Flexible"
  issueDescription:    string
  intakeSource:        string
  internalNote:        string
  notifyClient:        boolean
  assignNow:           boolean
}

// ─── PH Address Data ──────────────────────────────────────────────────────────

const PH_ADDRESS: Record<string, Record<string, string[]>> = {
  "NCR": {
    "Metro Manila": ["Manila", "Quezon City", "Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Pateros", "San Juan", "Taguig", "Valenzuela"],
  },
  "Region I – Ilocos Region": {
    "Ilocos Norte": ["Laoag", "Batac", "Pagudpud", "Paoay", "Marcos"],
    "Ilocos Sur": ["Vigan", "Candon", "Bantay", "Narvacan", "Santa"],
    "La Union": ["San Fernando", "Agoo", "Bauang", "Naguilian", "Rosario"],
    "Pangasinan": ["Dagupan", "San Carlos", "Urdaneta", "Alaminos", "Lingayen"],
  },
  "Region III – Central Luzon": {
    "Bulacan": ["Malolos", "Meycauayan", "San Jose del Monte", "Marilao", "Bocaue"],
    "Nueva Ecija": ["Cabanatuan", "San Jose", "Palayan", "Gapan", "Muñoz"],
    "Pampanga": ["San Fernando", "Angeles", "Mabalacat", "Guagua", "Lubao"],
    "Tarlac": ["Tarlac City", "Capas", "Concepcion", "La Paz", "Bamban"],
    "Zambales": ["Olongapo", "Iba", "San Antonio", "Subic", "Castillejos"],
    "Bataan": ["Balanga", "Mariveles", "Orani", "Orion", "Hermosa"],
    "Aurora": ["Baler", "Casiguran", "Dilasag", "Dinalungan", "Dingalan"],
  },
  "Region IV-A – CALABARZON": {
    "Cavite": ["Bacoor", "Dasmariñas", "General Trias", "Imus", "Tagaytay", "Trece Martires"],
    "Laguna": ["Calamba", "San Pablo", "Santa Rosa", "Biñan", "Cabuyao"],
    "Batangas": ["Batangas City", "Lipa", "Tanauan", "Santo Tomas", "Nasugbu"],
    "Rizal": ["Antipolo", "Cainta", "Taytay", "San Mateo", "Angono"],
    "Quezon": ["Lucena", "Tayabas", "Candelaria", "Sariaya", "Pagbilao"],
  },
  "Region VII – Central Visayas": {
    "Cebu": ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay", "Danao", "Toledo"],
    "Bohol": ["Tagbilaran", "Tubigon", "Ubay", "Talibon", "Jagna"],
    "Negros Oriental": ["Dumaguete", "Bayawan", "Tanjay", "Bais", "Canlaon"],
    "Siquijor": ["Siquijor", "Larena", "Maria", "San Juan", "Lazi"],
  },
  "Region XI – Davao Region": {
    "Davao del Sur": ["Davao City", "Digos", "Sta. Cruz", "Hagonoy", "Sulop"],
    "Davao del Norte": ["Tagum", "Panabo", "Samal", "Carmen", "Asuncion"],
    "Davao de Oro": ["Nabunturan", "Compostela", "Maco", "Monkayo", "Montevista"],
    "Davao Occidental": ["Malita", "Santa Maria", "Don Marcelino", "Jose Abad Santos", "Sarangani"],
    "Davao Oriental": ["Mati", "Baganga", "Caraga", "Cateel", "Governor Generoso"],
  },
}

// ─── Constants ────────────────────────────────────────────────────────────────

const URGENCY_OPTIONS = [
  { value: "Normal",   label: "Normal",   sub: "1–3 business days",  color: "#818cf8", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.35)" },
  { value: "Urgent",   label: "Urgent",   sub: "Same / next day",    color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.35)" },
  { value: "Flexible", label: "Flexible", sub: "No strict timeline", color: "#34d399", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.35)" },
] as const

const INTAKE_SOURCES = ["Walk-in", "Phone call", "Facebook", "Google", "Referral", "Other"]

function genRef() {
  const d = new Date(), pad = (n: number) => String(n).padStart(2, "0")
  return `INQ-${d.getFullYear()}-${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(Math.random() * 900 + 100)}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminCreateInquiryPage() {
  const navigate    = useNavigate()
  const [refId]     = useState(genRef)
  const [clientMode, setClientMode] = useState<ClientMode>("guest")

  // Static dropdowns
  const [customers,          setCustomers]          = useState<Customer[]>([])
  const [serviceCategories,  setServiceCategories]  = useState<ServiceCategory[]>([])
  const [allServices,        setAllServices]        = useState<Service[]>([])
  const [deviceTypes,        setDeviceTypes]        = useState<DeviceType[]>([])
  const [allBrands,          setAllBrands]          = useState<DeviceBrand[]>([])

  // Cascaded dropdowns
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [filteredBrands,   setFilteredBrands]   = useState<DeviceBrand[]>([])
  const [deviceModels,     setDeviceModels]     = useState<DeviceModel[]>([])
  const [customerDevices,  setCustomerDevices]  = useState<CustomerDevice[]>([])
  const [customerAddresses,setCustomerAddresses]= useState<CustomerAddress[]>([])

  // Loading
  const [loadingInit,      setLoadingInit]      = useState(true)
  const [loadingModels,    setLoadingModels]    = useState(false)
  const [loadingDevices,   setLoadingDevices]   = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(false)

  // UI
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  const [form, setForm] = useState<FormData>({
    customerId: null, addressId: null,
    guestName: "", guestContact: "", guestEmail: "",
    guestStreet: "", guestRegion: "", guestProvince: "", guestCity: "", guestZip: "",
    serviceCategoryId: null, serviceId: null,
    deviceTypeId: null, deviceBrandId: null, deviceModelId: null,
    customerDeviceId: null,
    preferredDate: "", preferredTime: "",
    urgency: "Normal", issueDescription: "",
    intakeSource: "Walk-in", internalNote: "",
    notifyClient: true, assignNow: false,
  })

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get("/customer"),
      api.get("/services-categories"),
      api.get("/services"),
      api.get("/device-types"),
      api.get("/device-brands"),
    ]).then(([custRes, svcCatRes, svcRes, typeRes, brandRes]) => {
      setCustomers(custRes.data)
      setServiceCategories(svcCatRes.data)
      setAllServices(svcRes.data)
      setDeviceTypes(typeRes.data)
      setAllBrands(brandRes.data)
    }).catch(() => {
      setError("Failed to load form data. Check your connection.")
    }).finally(() => setLoadingInit(false))
  }, [])

  // ── Service category → services ──────────────────────────────────────────
  useEffect(() => {
    if (!form.serviceCategoryId) { setFilteredServices([]); return }
    setFilteredServices(allServices.filter(s => s.serviceCategoryId === form.serviceCategoryId))
    setF("serviceId", null)
  }, [form.serviceCategoryId, allServices])

  // ── Device type → brands (via models endpoint to know which brands apply) ─
  useEffect(() => {
    if (!form.deviceTypeId) { setFilteredBrands([]); return }
    api.get(`/device-models/${form.deviceTypeId}/type`)
      .then(res => {
          const brandIds = [...new Set((res.data as DeviceModel[]).map(m => m.brandId))]
          const filtered = allBrands.filter(b => brandIds.includes(b.id))
          setFilteredBrands(filtered.length > 0 ? filtered : allBrands) // fallback
        })
      .catch(() => setFilteredBrands(allBrands))
    setF("deviceBrandId", null)
    setF("deviceModelId", null)
    setDeviceModels([])
  }, [form.deviceTypeId, allBrands])

  // ── Brand → models ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!form.deviceBrandId) { setDeviceModels([]); return }
    setLoadingModels(true)
    api.get(`/device-models/${form.deviceBrandId}/brand`)
      .then(r => setDeviceModels(r.data))
      .catch(() => setDeviceModels([]))
      .finally(() => setLoadingModels(false))
    setF("deviceModelId", null)
  }, [form.deviceBrandId])

  // ── Customer → addresses + devices ───────────────────────────────────────
  useEffect(() => {
    if (clientMode !== "existing" || !form.customerId) {
      setCustomerAddresses([]); setCustomerDevices([])
      setF("addressId", null); setF("customerDeviceId", null)
      return
    }
    setLoadingAddresses(true); setLoadingDevices(true)
    Promise.all([
      api.get(`/customer-address/${form.customerId}/customer`),
      api.get(`/customer-devices/${form.customerId}/customers`),
    ]).then(([addrRes, devRes]) => {
      const addrs: CustomerAddress[] = addrRes.data
      setCustomerAddresses(addrs)
      setCustomerDevices(devRes.data)
      const def = addrs.find(a => a.isDefault)
      if (def) setF("addressId", def.id)
    }).catch(() => {
      setCustomerAddresses([]); setCustomerDevices([])
    }).finally(() => {
      setLoadingAddresses(false); setLoadingDevices(false)
    })
  }, [form.customerId, clientMode])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setF = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (clientMode === "existing" && !form.customerId)        e.customerId        = "Select a customer."
    if (clientMode === "guest"    && !form.guestName.trim())  e.guestName         = "Name is required."
    if (clientMode === "guest"    && !form.guestContact.trim()) e.guestContact    = "Contact is required."
    if (!form.serviceCategoryId)                              e.serviceCategoryId = "Select a service category."
    if (!form.issueDescription.trim())                        e.issueDescription  = "Issue description is required."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const URGENCY_MAP = { Normal: 0, Urgent: 1, Flexible: 2 }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true); setError(null)
    try {
      const serviceAddress = clientMode === "existing"
        ? customerAddresses.find(a => a.id === form.addressId)?.address ?? ""
        : [form.guestStreet, form.guestCity, form.guestProvince, form.guestRegion, form.guestZip]
            .filter(Boolean).join(", ")

      const payload = {
        customerId:  clientMode === "existing" ? form.customerId : null,
        guestId:     null,
        companyId:   null,
        urgency:     form.urgency,
        intakeSource: form.intakeSource,
        internalNote: form.internalNote,
        notifyClient: form.notifyClient,
        assignNow:    form.assignNow,
        serviceAddress,
        ...(clientMode === "guest" && {
          guest: {
              name:        form.guestName,
              phoneNumber: form.guestContact,
              email:       form.guestEmail,
          }
        }),
        inquiryItems: [{
          serviceCategoryId: form.serviceCategoryId,
          serviceId:         form.serviceId,
          preferredDate:     form.preferredDate || null,
          preferredTime:     form.preferredTime || null,
          issueDescription:  form.issueDescription,
          urgency:           form.urgency,
          notes:             form.internalNote || null,
          inquiryTechnicalDetails: (form.deviceModelId || form.customerDeviceId) ? [{
            customerDeviceId: form.customerDeviceId,
            deviceModelId:    form.deviceModelId,
            diagnoses: [],
          }] : [],
        }],
      }
      const res = await api.post("/inquiries", payload)
      setSaved(true)
      setTimeout(() => navigate(`/admin/inquiries/${res.data.id}`), 1200)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save inquiry.")
    } finally {
      setSaving(false)
    }
  }

  const selectedUrgency  = URGENCY_OPTIONS.find(u => u.value === form.urgency)!
  const regionOptions    = Object.keys(PH_ADDRESS)
  const provinceOptions  = form.guestRegion ? Object.keys(PH_ADDRESS[form.guestRegion] ?? {}) : []
  const cityOptions      = form.guestRegion && form.guestProvince
    ? PH_ADDRESS[form.guestRegion]?.[form.guestProvince] ?? [] : []

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => navigate("/admin/inquiries")}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: "transparent",
            border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", padding: "0 0 12px",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={14} /> Back to Inquiries
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: "rgba(99,102,241,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ClipboardList size={18} color="#818cf8" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>New Inquiry</h1>
              <p style={{ fontSize: 12.5, color: "#475569", margin: "3px 0 0" }}>{refId}</p>
            </div>
          </div>

          <button
            onClick={handleSubmit} disabled={saving || saved}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: saved ? "#059669" : saving ? "#334155" : "#6366f1",
              border: "none", borderRadius: 8, padding: "9px 20px",
              color: "#fff", fontSize: 13, fontWeight: 500,
              cursor: saving || saved ? "not-allowed" : "pointer", transition: "background 0.2s",
            }}
            onMouseEnter={e => { if (!saving && !saved) e.currentTarget.style.background = "#4f46e5" }}
            onMouseLeave={e => { if (!saving && !saved) e.currentTarget.style.background = "#6366f1" }}
          >
            {saved ? <><CheckCircle2 size={14} /> Saved!</>
              : saving ? <><Save size={14} /> Saving…</>
              : <><Save size={14} /> Save Inquiry</>}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#f87171", fontSize: 13,
        }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 288px", gap: 20 }}>

          {/* ── Left ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* 1 · Client */}
            <Card>
              <SectionLabel>1 · Client</SectionLabel>

              {/* Toggle */}
              <div style={{
                display: "flex", marginTop: 16, marginBottom: 20,
                background: "#0f172a", borderRadius: 9, padding: 3,
                border: "1px solid rgba(255,255,255,0.06)", width: "fit-content",
              }}>
                {(["existing", "guest"] as ClientMode[]).map(mode => (
                  <button
                    key={mode} type="button"
                    onClick={() => { setClientMode(mode); setErrors({}) }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 16px", borderRadius: 7, border: "none",
                      background: clientMode === mode ? "#1e3a5f" : "transparent",
                      color: clientMode === mode ? "#93c5fd" : "#475569",
                      fontSize: 13, fontWeight: clientMode === mode ? 600 : 400,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {mode === "existing" ? <User size={13} /> : <UserPlus size={13} />}
                    {mode === "existing" ? "Existing Customer" : "Walk-in / Guest"}
                  </button>
                ))}
              </div>

              {clientMode === "existing" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <FieldLabel>Customer <Req /></FieldLabel>
                    <Sel value={form.customerId ?? ""} onChange={v => setF("customerId", v ? Number(v) : null)}
                      error={errors.customerId} disabled={loadingInit}>
                      <option value="">— Select customer —</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name} · {c.phoneNumber}</option>)}
                    </Sel>
                    {errors.customerId && <FErr>{errors.customerId}</FErr>}
                  </div>

                  {form.customerId && (
                    <div>
                      <FieldLabel>
                        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <MapPin size={12} color="#818cf8" /> Service Address
                        </span>
                      </FieldLabel>
                      {loadingAddresses ? (
                        <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>Loading addresses…</p>
                      ) : customerAddresses.length === 0 ? (
                        <div style={{
                          fontSize: 12.5, color: "#475569", padding: "10px 14px",
                          background: "#0f172a", borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}>No saved addresses for this customer.</div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {customerAddresses.map(addr => (
                            <label key={addr.id} style={{
                              display: "flex", alignItems: "flex-start", gap: 10,
                              padding: "12px 14px", borderRadius: 8, cursor: "pointer",
                              background: form.addressId === addr.id ? "rgba(99,102,241,0.08)" : "#0f172a",
                              border: `1px solid ${form.addressId === addr.id ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.08)"}`,
                              transition: "all 0.15s",
                            }}>
                              <input type="radio" name="addressId" checked={form.addressId === addr.id}
                                onChange={() => setF("addressId", addr.id)}
                                style={{ accentColor: "#6366f1", marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", display: "flex", gap: 8, alignItems: "center" }}>
                                  {addr.label}
                                  {addr.isDefault && (
                                    <span style={{
                                      fontSize: 10.5, padding: "1px 7px", borderRadius: 10,
                                      background: "rgba(99,102,241,0.15)", color: "#818cf8", fontWeight: 600,
                                    }}>Default</span>
                                  )}
                                </div>
                                <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{addr.address}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <FieldLabel>Full Name <Req /></FieldLabel>
                      <Inp value={form.guestName} onChange={v => setF("guestName", v)} placeholder="e.g. Juan dela Cruz" error={errors.guestName} />
                      {errors.guestName && <FErr>{errors.guestName}</FErr>}
                    </div>
                    <div>
                      <FieldLabel>Contact Number <Req /></FieldLabel>
                      <Inp value={form.guestContact} onChange={v => setF("guestContact", v)} placeholder="09XXXXXXXXX" error={errors.guestContact} />
                      {errors.guestContact && <FErr>{errors.guestContact}</FErr>}
                    </div>
                    <div>
                      <FieldLabel>Email <Opt /></FieldLabel>
                      <Inp type="email" value={form.guestEmail} onChange={v => setF("guestEmail", v)} placeholder="you@example.com" />
                    </div>
                  </div>

                  {/* PH Address */}
                  <div>
                    <FieldLabel>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <MapPin size={12} color="#818cf8" /> Service Address <Opt />
                      </span>
                    </FieldLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <Sel value={form.guestRegion} onChange={v => {
                          setF("guestRegion", v); setF("guestProvince", ""); setF("guestCity", "")
                        }}>
                          <option value="">— Region —</option>
                          {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </Sel>
                      </div>
                      <Sel value={form.guestProvince} disabled={!form.guestRegion}
                        onChange={v => { setF("guestProvince", v); setF("guestCity", "") }}>
                        <option value="">— Province —</option>
                        {provinceOptions.map(p => <option key={p} value={p}>{p}</option>)}
                      </Sel>
                      <Sel value={form.guestCity} disabled={!form.guestProvince} onChange={v => setF("guestCity", v)}>
                        <option value="">— City / Municipality —</option>
                        {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </Sel>
                      <Inp value={form.guestStreet} onChange={v => setF("guestStreet", v)} placeholder="Street / Barangay" />
                      <Inp value={form.guestZip} onChange={v => setF("guestZip", v)} placeholder="ZIP code" />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* 2 · Service */}
            <Card>
              <SectionLabel>2 · Service</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                <div>
                  <FieldLabel>Service Category <Req /></FieldLabel>
                  <Sel value={form.serviceCategoryId ?? ""} disabled={loadingInit}
                    onChange={v => setF("serviceCategoryId", v ? Number(v) : null)} error={errors.serviceCategoryId}>
                    <option value="">— Select category —</option>
                    {serviceCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Sel>
                  {errors.serviceCategoryId && <FErr>{errors.serviceCategoryId}</FErr>}
                </div>
                <div>
                  <FieldLabel>Service <Opt /></FieldLabel>
                  <Sel value={form.serviceId ?? ""}
                    onChange={v => setF("serviceId", v ? Number(v) : null)}
                    disabled={!form.serviceCategoryId || filteredServices.length === 0}>
                    <option value="">{!form.serviceCategoryId ? "— Select category first —" : "— Select service —"}</option>
                    {filteredServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Sel>
                </div>
              </div>
            </Card>

            {/* 3 · Device */}
            <Card>
              <SectionLabel>3 · Device <Opt /></SectionLabel>

              {clientMode === "existing" && form.customerId ? (
                <div style={{ marginTop: 16 }}>
                  <FieldLabel>Customer's Registered Device</FieldLabel>
                  {loadingDevices ? (
                    <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>Loading devices…</p>
                  ) : customerDevices.length === 0 ? (
                    <div style={{
                      fontSize: 12.5, color: "#475569", padding: "10px 14px",
                      background: "#0f172a", borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>No registered devices for this customer.</div>
                  ) : (
                    <Sel value={form.customerDeviceId ?? ""} onChange={v => setF("customerDeviceId", v ? Number(v) : null)}>
                      <option value="">— Select device —</option>
                      {customerDevices.map(d => (
                        <option key={d.id} value={d.id}>
                          Device #{d.id}{d.serialNumber ? ` · S/N: ${d.serialNumber}` : ""}
                        </option>
                      ))}
                    </Sel>
                  )}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 16 }}>
                  <div>
                    <FieldLabel>Device Type</FieldLabel>
                    <Sel value={form.deviceTypeId ?? ""} disabled={loadingInit}
                      onChange={v => setF("deviceTypeId", v ? Number(v) : null)}>
                      <option value="">— Type —</option>
                      {deviceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </Sel>
                  </div>
                  <div>
                    <FieldLabel>Brand</FieldLabel>
                    <Sel value={form.deviceBrandId ?? ""}
                      onChange={v => setF("deviceBrandId", v ? Number(v) : null)}
                      disabled={!form.deviceTypeId || filteredBrands.length === 0}>
                      <option value="">{!form.deviceTypeId ? "— Select type first —" : "— Brand —"}</option>
                      {filteredBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Sel>
                  </div>
                  <div>
                    <FieldLabel>Model</FieldLabel>
                    <Sel value={form.deviceModelId ?? ""}
                      onChange={v => setF("deviceModelId", v ? Number(v) : null)}
                      disabled={!form.deviceBrandId || loadingModels}>
                      <option value="">{!form.deviceBrandId ? "— Select brand first —" : loadingModels ? "Loading…" : "— Model —"}</option>
                      {deviceModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </Sel>
                  </div>
                </div>
              )}
            </Card>

            {/* 4 · Issue */}
            <Card>
              <SectionLabel>4 · Issue Details</SectionLabel>

              <div style={{ marginTop: 16 }}>
                <FieldLabel>Urgency</FieldLabel>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {URGENCY_OPTIONS.map(opt => {
                    const active = form.urgency === opt.value
                    return (
                      <button key={opt.value} type="button" onClick={() => setF("urgency", opt.value)}
                        style={{
                          flex: 1, padding: "10px 0", borderRadius: 9, border: "none", cursor: "pointer",
                          background: active ? opt.bg : "rgba(255,255,255,0.03)",
                          outline: active ? `1px solid ${opt.border}` : "1px solid rgba(255,255,255,0.06)",
                          transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                        }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: active ? opt.color : "#64748b" }}>{opt.label}</span>
                        <span style={{ fontSize: 11, color: active ? opt.color : "#334155" }}>{opt.sub}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
                <div>
                  <FieldLabel>Preferred Date <Opt /></FieldLabel>
                  <Inp type="date" value={form.preferredDate} onChange={v => setF("preferredDate", v)} />
                </div>
                <div>
                  <FieldLabel>Preferred Time <Opt /></FieldLabel>
                  <Inp type="time" value={form.preferredTime} onChange={v => setF("preferredTime", v)} />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <FieldLabel>Issue Description <Req /></FieldLabel>
                <textarea
                  value={form.issueDescription}
                  onChange={e => setF("issueDescription", e.target.value)}
                  rows={5}
                  placeholder="Summarize the client's reported issue — symptoms, affected parts, when it started…"
                  style={{
                    width: "100%", background: "#0f172a",
                    border: `1px solid ${errors.issueDescription ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 8, padding: "10px 14px", color: "#e2e8f0",
                    fontSize: 13.5, outline: "none", resize: "vertical",
                    boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.65, marginTop: 7,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {errors.issueDescription ? <FErr>{errors.issueDescription}</FErr> : <span />}
                  <span style={{ fontSize: 11.5, color: "#334155" }}>{form.issueDescription.length} chars</span>
                </div>
              </div>
            </Card>

            {/* 5 · Intake */}
            <Card>
              <SectionLabel>
                5 · Intake & Admin{" "}
                <span style={{ fontSize: 11, color: "#334155", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                  (optional)
                </span>
              </SectionLabel>

              <div style={{ marginTop: 16 }}>
                <FieldLabel>How did the client reach us?</FieldLabel>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  {INTAKE_SOURCES.map(src => {
                    const active = form.intakeSource === src
                    return (
                      <button key={src} type="button" onClick={() => setF("intakeSource", src)}
                        style={{
                          padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                          background: active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                          outline: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
                          color: active ? "#818cf8" : "#475569",
                          fontSize: 12.5, fontWeight: active ? 600 : 400, transition: "all 0.15s",
                        }}>
                        {src}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <FieldLabel>Internal Note</FieldLabel>
                <textarea
                  value={form.internalNote}
                  onChange={e => setF("internalNote", e.target.value)}
                  rows={3}
                  placeholder="e.g. client left device, initial assessment done… (not visible to client)"
                  style={{
                    width: "100%", background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "10px 14px", color: "#e2e8f0",
                    fontSize: 13.5, outline: "none", resize: "vertical",
                    boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.65, marginTop: 7,
                  }}
                />
              </div>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <ChkRow checked={form.notifyClient} onChange={v => setF("notifyClient", v)}
                  label="Send acknowledgment SMS / email to client upon submission" />
                <ChkRow checked={form.assignNow} onChange={v => setF("assignNow", v)}
                  label="Assign to technician immediately" />
              </div>
            </Card>
          </div>

          {/* ── Right ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px" }}>
              <SectionLabel>Urgency</SectionLabel>
              <div style={{
                marginTop: 14, padding: "12px 14px", borderRadius: 9,
                background: selectedUrgency.bg, border: `1px solid ${selectedUrgency.border}`,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedUrgency.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selectedUrgency.color }}>{selectedUrgency.label}</div>
                  <div style={{ fontSize: 11.5, color: selectedUrgency.color, opacity: 0.75, marginTop: 2 }}>{selectedUrgency.sub}</div>
                </div>
              </div>
            </div>

            <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px" }}>
              <SectionLabel>Summary</SectionLabel>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 11 }}>
                <SumRow label="Ref"      value={refId} />
                <SumRow label="Client"   value={clientMode === "existing" ? customers.find(c => c.id === form.customerId)?.name ?? "—" : form.guestName || "—"} />
                <SumRow label="Address"  value={
                  clientMode === "existing"
                    ? customerAddresses.find(a => a.id === form.addressId)?.address ?? "—"
                    : [form.guestCity, form.guestProvince].filter(Boolean).join(", ") || "—"
                } />
                <SumRow label="Category" value={serviceCategories.find(s => s.id === form.serviceCategoryId)?.name ?? "—"} />
                <SumRow label="Service"  value={filteredServices.find(s => s.id === form.serviceId)?.name ?? "—"} />
                <SumRow label="Device"   value={
                  clientMode === "existing"
                    ? form.customerDeviceId ? `Device #${form.customerDeviceId}` : "—"
                    : deviceModels.find(m => m.id === form.deviceModelId)?.name ?? "—"
                } />
                <SumRow label="Schedule" value={form.preferredDate ? `${form.preferredDate}${form.preferredTime ? " · " + form.preferredTime : ""}` : "—"} />
                <SumRow label="Source"   value={form.intakeSource} />
                <SumRow label="Notify"   value={form.notifyClient ? "Yes" : "No"} />
              </div>
            </div>

            <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px" }}>
              <SectionLabel>Tips</SectionLabel>
              <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Select a customer to auto-load their saved addresses and devices.",
                  "Device cascade: Type → Brand → Model.",
                  "Internal notes are staff-only and not sent to the client.",
                  "Urgent inquiries jump the queue — use sparingly.",
                ].map((tip, i) => (
                  <li key={i} style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.55 }}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "22px 24px" }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.6px" }}>{children}</div>
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 12.5, color: "#94a3b8", marginBottom: 7, fontWeight: 500 }}>{children}</label>
}

function Req() { return <span style={{ color: "#f87171" }}>*</span> }
function Opt() { return <span style={{ color: "#475569", fontWeight: 400 }}> (optional)</span> }
function FErr({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 12, color: "#f87171", margin: "5px 0 0" }}>{children}</p>
}

function Inp({ value, onChange, placeholder, type = "text", error }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", background: "#0f172a",
        border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 8, padding: "10px 14px", color: "#e2e8f0",
        fontSize: 13.5, outline: "none", boxSizing: "border-box", colorScheme: "dark",
      }}
    />
  )
}

function Sel({ value, onChange, children, error, disabled }: {
  value: string | number; onChange: (v: string) => void
  children: React.ReactNode; error?: string; disabled?: boolean
}) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{
          width: "100%", background: "#0f172a",
          border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 8, padding: "10px 36px 10px 14px",
          color: value ? "#e2e8f0" : "#475569",
          fontSize: 13.5, outline: "none", boxSizing: "border-box",
          appearance: "none", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        }}
      >{children}</select>
      <ChevronDown size={14} color="#475569" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  )
}

function ChkRow({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ accentColor: "#6366f1", width: 15, height: 15, cursor: "pointer" }} />
      <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
    </label>
  )
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 11.5, color: "#475569", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: "#cbd5e1", textAlign: "right", wordBreak: "break-word" }}>{value}</span>
    </div>
  )
}
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronDown, CheckCircle2, AlertCircle } from "lucide-react"
import api from "../../api/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceCategory { id: number; name: string }
interface Service         { id: number; name: string; serviceCategoryId: number }
interface DeviceType      { id: number; name: string }
interface DeviceBrand     { id: number; name: string }
interface DeviceModel     { id: number; name: string; brandId: number }

interface FormData {
  // Guest info (replaces customerId)
  guestName:         string
  guestEmail:        string
  guestPhone:        string

  serviceCategoryId: number | null
  serviceId:         number | null
  urgency:           "Normal" | "Urgent" | "Flexible"
  deviceTypeId:      number | null
  deviceBrandId:     number | null
  deviceModelId:     number | null
  preferredDate:     string
  preferredTime:     string
  issueDescription:  string
  intakeSource:      string
  guestRegion:       string
  guestProvince:     string
  guestCity:         string
  guestStreet:       string
  guestZip:          string
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
  { value: "Normal",   label: "Normal",   sub: "1–3 business days"  },
  { value: "Urgent",   label: "Urgent",   sub: "Same / next day"    },
  { value: "Flexible", label: "Flexible", sub: "No strict timeline" },
] as const

const INTAKE_SOURCES = ["Facebook", "Google", "Referral", "Walk-in", "Other"]

// ─── Component ────────────────────────────────────────────────────────────────

export default function PublicInquiryPage() {
  const navigate = useNavigate()

  // Dropdowns
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [allServices,       setAllServices]       = useState<Service[]>([])
  const [deviceTypes,       setDeviceTypes]       = useState<DeviceType[]>([])
  const [allBrands,         setAllBrands]         = useState<DeviceBrand[]>([])

  // Cascaded
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [filteredBrands,   setFilteredBrands]   = useState<DeviceBrand[]>([])
  const [deviceModels,     setDeviceModels]     = useState<DeviceModel[]>([])

  // Loading
  const [loadingInit,   setLoadingInit]   = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)

  // UI
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [errors,     setErrors]     = useState<Partial<Record<string, string>>>({})

  const [form, setForm] = useState<FormData>({
    guestName: "", guestEmail: "", guestPhone: "",
    serviceCategoryId: null, serviceId: null,
    urgency: "Normal",
    deviceTypeId: null, deviceBrandId: null, deviceModelId: null,
    preferredDate: "", preferredTime: "",
    issueDescription: "", intakeSource: "",
    guestRegion: "", guestProvince: "", guestCity: "", guestStreet: "", guestZip: "",
  })

  // ── Computed address options ──────────────────────────────────────────────────
  const regionOptions   = Object.keys(PH_ADDRESS)
  const provinceOptions = form.guestRegion ? Object.keys(PH_ADDRESS[form.guestRegion] ?? {}) : []
  const cityOptions     = form.guestRegion && form.guestProvince
    ? PH_ADDRESS[form.guestRegion]?.[form.guestProvince] ?? [] : []

  // ── Initial load (no auth needed) ────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get("/services-categories"),
      api.get("/services"),
      api.get("/device-types"),
      api.get("/device-brands"),
    ]).then(([catRes, svcRes, typeRes, brandRes]) => {
      setServiceCategories(catRes.data)
      setAllServices(svcRes.data)
      setDeviceTypes(typeRes.data)
      setAllBrands(brandRes.data)
    }).catch(() => setError("Failed to load form data."))
      .finally(() => setLoadingInit(false))
  }, [])

  // ── Service category → services ───────────────────────────────────────────────
  useEffect(() => {
    if (!form.serviceCategoryId) { setFilteredServices([]); return }
    setFilteredServices(allServices.filter(s => s.serviceCategoryId === form.serviceCategoryId))
    setF("serviceId", null)
  }, [form.serviceCategoryId, allServices])

  // ── Device type → brands ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!form.deviceTypeId) { setFilteredBrands([]); return }
    api.get(`/device-models/${form.deviceTypeId}/type`)
      .then(res => {
        const brandIds = [...new Set((res.data as DeviceModel[]).map(m => m.brandId))]
        const filtered = allBrands.filter(b => brandIds.includes(b.id))
        setFilteredBrands(filtered.length > 0 ? filtered : allBrands)
      })
      .catch(() => setFilteredBrands(allBrands))
    setF("deviceBrandId", null)
    setF("deviceModelId", null)
    setDeviceModels([])
  }, [form.deviceTypeId, allBrands])

  // ── Brand → models ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!form.deviceBrandId) { setDeviceModels([]); return }
    setLoadingModels(true)
    api.get(`/device-models/${form.deviceBrandId}/brand`)
      .then(r => setDeviceModels(r.data))
      .catch(() => setDeviceModels([]))
      .finally(() => setLoadingModels(false))
    setF("deviceModelId", null)
  }, [form.deviceBrandId])

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const setF = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.guestName.trim())            e.guestName         = "Please enter your name."
    if (!form.guestEmail.trim())           e.guestEmail        = "Please enter your email."
    if (!/\S+@\S+\.\S+/.test(form.guestEmail)) e.guestEmail   = "Please enter a valid email."
    if (!form.serviceCategoryId)           e.serviceCategoryId = "Please select a service category."
    if (!form.issueDescription.trim())     e.issueDescription  = "Please describe your issue."
    if (!form.guestCity.trim())            e.guestCity         = "Please select a city."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true); setError(null)

    try {
      const serviceAddress = [
        form.guestStreet, form.guestCity, form.guestProvince, form.guestRegion, form.guestZip,
      ].filter(Boolean).join(", ")

      const payload = {
        customerId:   null,       // ← no logged-in customer
        guestId:      null,       // ← backend may create a guest record from the info below
        companyId:    null,
        guest: {                        // ✅ nested object, not flat fields
            name:        form.guestName,
            email:       form.guestEmail,
            phoneNumber: form.guestPhone || null,
        },
        urgency:      form.urgency,
        intakeSource: form.intakeSource || "Online",
        serviceAddress,
        notifyClient: true,
        assignNow:    false,
        inquiryItems: [{
          serviceCategoryId: form.serviceCategoryId,
          serviceId:         form.serviceId || null,
          preferredDate:     form.preferredDate || null,
          preferredTime:     form.preferredTime || null,
          issueDescription:  form.issueDescription,
          inquiryTechnicalDetails: form.deviceModelId ? [{
            customerDeviceId: null,
            deviceModelId:    form.deviceModelId,
            diagnoses:        [],
          }] : [],
        }],
      }

      await api.post("/inquiries", payload)   // ← separate guest endpoint
      setSubmitted(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit inquiry.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section style={{ minHeight: "100vh", background: "#0a1f1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center", padding: 32, maxWidth: 400 }}>
          <CheckCircle2 size={52} color="#059669" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Inquiry Submitted!</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
            We'll review your request and reach out to <strong>{form.guestEmail}</strong> as soon as possible.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => navigate("/")}
              style={{ padding: "10px 20px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Back to Home
            </button>
            <button onClick={() => navigate("/login")}
              style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Create an Account
            </button>
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 14 }}>
            Have an account? Track your inquiry status after logging in.
          </p>
        </div>
      </section>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <section style={{ minHeight: "100vh", background: "#0a1f1a", color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 48px" }}>
        <div style={{ borderRadius: 24, overflow: "hidden", background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 20px 50px rgba(15,23,42,0.08)" }}>

          {/* Page title */}
          <div style={{ padding: "28px 28px 0" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Submit an Inquiry</h2>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Tell us about your device issue and we'll get back to you shortly.</p>
          </div>

          {/* Login nudge */}
          <div style={{ margin: "20px 24px 0", padding: "12px 16px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 13, color: "#1d4ed8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Already have an account? Track your inquiries after logging in.</span>
            <Link to="/login" style={{ fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>Log in →</Link>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{ margin: "12px 24px 0", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Loading state */}
          {loadingInit ? (
            <div style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
              Loading form…
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ padding: 24, display: "grid", gap: 20 }}>

                {/* 0 · Guest Info — NEW SECTION */}
                <Section number="1" title="Your Contact Info" subtitle="Required">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <FieldLabel>Full Name <Req /></FieldLabel>
                      <Inp value={form.guestName} onChange={v => setF("guestName", v)}
                        placeholder="e.g. Juan dela Cruz" error={errors.guestName} />
                      {errors.guestName && <FErr>{errors.guestName}</FErr>}
                    </div>
                    <div>
                      <FieldLabel>Email Address <Req /></FieldLabel>
                      <Inp type="email" value={form.guestEmail} onChange={v => setF("guestEmail", v)}
                        placeholder="you@example.com" error={errors.guestEmail} />
                      {errors.guestEmail && <FErr>{errors.guestEmail}</FErr>}
                    </div>
                    <div>
                      <FieldLabel>Phone Number <Opt /></FieldLabel>
                      <Inp type="tel" value={form.guestPhone} onChange={v => setF("guestPhone", v)}
                        placeholder="+63 9XX XXX XXXX" />
                    </div>
                  </div>
                </Section>

                {/* 2 · Service */}
                <Section number="2" title="What service do you need?" subtitle="Required">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <FieldLabel>Service Category <Req /></FieldLabel>
                      <Sel value={form.serviceCategoryId ?? ""}
                        onChange={v => setF("serviceCategoryId", v ? Number(v) : null)}
                        error={errors.serviceCategoryId}>
                        <option value="">— Select category —</option>
                        {serviceCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Sel>
                      {errors.serviceCategoryId && <FErr>{errors.serviceCategoryId}</FErr>}
                    </div>
                    <div>
                      <FieldLabel>Specific Service <Opt /></FieldLabel>
                      <Sel value={form.serviceId ?? ""}
                        onChange={v => setF("serviceId", v ? Number(v) : null)}
                        disabled={!form.serviceCategoryId || filteredServices.length === 0}>
                        <option value="">{!form.serviceCategoryId ? "— Select category first —" : "— Select service —"}</option>
                        {filteredServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </Sel>
                    </div>
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <FieldLabel>Urgency</FieldLabel>
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      {URGENCY_OPTIONS.map(opt => {
                        const active = form.urgency === opt.value
                        return (
                          <button key={opt.value} type="button" onClick={() => setF("urgency", opt.value)}
                            style={{
                              flex: 1, padding: "12px 0", borderRadius: 12, cursor: "pointer",
                              border: `1.5px solid ${active ? "#2563eb" : "#e2e8f0"}`,
                              background: active ? "#eff6ff" : "#f8fafc",
                              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                              transition: "all 0.15s",
                            }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: active ? "#2563eb" : "#64748b" }}>{opt.label}</span>
                            <span style={{ fontSize: 11, color: active ? "#3b82f6" : "#94a3b8" }}>{opt.sub}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </Section>

                {/* 3 · Device */}
                <Section number="3" title="Device Details" subtitle="Optional">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                    <div>
                      <FieldLabel>Device Type</FieldLabel>
                      <Sel value={form.deviceTypeId ?? ""}
                        onChange={v => setF("deviceTypeId", v ? Number(v) : null)}>
                        <option value="">— Type —</option>
                        {deviceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </Sel>
                    </div>
                    <div>
                      <FieldLabel>Brand</FieldLabel>
                      <Sel value={form.deviceBrandId ?? ""}
                        onChange={v => setF("deviceBrandId", v ? Number(v) : null)}
                        disabled={!form.deviceTypeId}>
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
                </Section>

                {/* 4 · Issue */}
                <Section number="4" title="Describe Your Issue" subtitle="Required">
                  <FieldLabel>Issue Description <Req /></FieldLabel>
                  <textarea
                    value={form.issueDescription}
                    onChange={e => setF("issueDescription", e.target.value)}
                    rows={5}
                    placeholder="Describe the problem — what happened, when it started, what you've tried…"
                    style={{
                      width: "100%", borderRadius: 12, marginTop: 7,
                      border: `1.5px solid ${errors.issueDescription ? "#fca5a5" : "#e2e8f0"}`,
                      background: "#fff", padding: "12px 14px", fontSize: 14, color: "#0f172a",
                      outline: "none", resize: "vertical", boxSizing: "border-box",
                      fontFamily: "inherit", lineHeight: 1.65,
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    {errors.issueDescription ? <FErr>{errors.issueDescription}</FErr> : <span />}
                    <span style={{ fontSize: 11.5, color: "#94a3b8" }}>{form.issueDescription.length} chars</span>
                  </div>
                </Section>

                {/* 5 · Schedule & Location */}
                <Section number="5" title="Schedule & Location" subtitle="Optional">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <FieldLabel>Preferred Date</FieldLabel>
                      <Inp type="date" value={form.preferredDate} onChange={v => setF("preferredDate", v)} />
                    </div>
                    <div>
                      <FieldLabel>Preferred Time</FieldLabel>
                      <Inp type="time" value={form.preferredTime} onChange={v => setF("preferredTime", v)} />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <FieldLabel>Service Address <Req /></FieldLabel>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 7 }}>
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

                        <div>
                          <Sel value={form.guestCity} disabled={!form.guestProvince}
                            onChange={v => setF("guestCity", v)} error={errors.guestCity}>
                            <option value="">— City / Municipality —</option>
                            {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                          </Sel>
                          {errors.guestCity && <FErr>{errors.guestCity}</FErr>}
                        </div>

                        <Inp value={form.guestStreet} onChange={v => setF("guestStreet", v)}
                          placeholder="Street / Barangay" />

                        <Inp value={form.guestZip} onChange={v => setF("guestZip", v)}
                          placeholder="ZIP code" />
                      </div>
                    </div>
                  </div>
                </Section>

                {/* 6 · How did you find us */}
                <Section number="6" title="How did you find us?" subtitle="Optional">
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                    {INTAKE_SOURCES.map(src => {
                      const active = form.intakeSource === src
                      return (
                        <button key={src} type="button"
                          onClick={() => setF("intakeSource", active ? "" : src)}
                          style={{
                            padding: "8px 16px", borderRadius: 999, cursor: "pointer",
                            border: `1.5px solid ${active ? "#2563eb" : "#e2e8f0"}`,
                            background: active ? "#eff6ff" : "#f8fafc",
                            color: active ? "#2563eb" : "#64748b",
                            fontSize: 13, fontWeight: active ? 600 : 400, transition: "all 0.15s",
                          }}>
                          {src}
                        </button>
                      )
                    })}
                  </div>
                </Section>
              </div>

              {/* Footer */}
              <div style={{ position: "sticky", bottom: 0, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(10px)", borderTop: "1px solid #e2e8f0", padding: 20 }}>
                <button type="submit" disabled={submitting}
                  style={{
                    width: "100%", border: "none", borderRadius: 16,
                    background: submitting ? "#94a3b8" : "#2563eb",
                    color: "#fff", fontSize: 14, fontWeight: 700, padding: "14px 18px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "0.2s ease", boxShadow: "0 12px 30px rgba(37,99,235,0.18)",
                  }}>
                  {submitting ? "Submitting…" : "Submit Inquiry"}
                </button>
                <p style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#64748b" }}>
                  We'll review your request and contact you as soon as possible.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({ number, title, subtitle, children }: {
  number: string; title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 18, background: "#f8fafc", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#dbeafe", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{number}</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{title}</span>
        </div>
        {subtitle && <span style={{ fontSize: 12, color: "#94a3b8" }}>{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "#334155", marginBottom: 6 }}>{children}</label>
}

function Req() { return <span style={{ color: "#ef4444" }}>*</span> }
function Opt() { return <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}> (optional)</span> }
function FErr({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 12, color: "#dc2626", margin: "5px 0 0" }}>{children}</p>
}

function Inp({ value, onChange, placeholder, type = "text", error }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", borderRadius: 12, padding: "11px 14px", fontSize: 14,
        border: `1.5px solid ${error ? "#fca5a5" : "#e2e8f0"}`,
        background: "#fff", color: "#0f172a", outline: "none",
        boxSizing: "border-box", colorScheme: "light",
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
          width: "100%", borderRadius: 12, padding: "11px 36px 11px 14px", fontSize: 14,
          border: `1.5px solid ${error ? "#fca5a5" : "#e2e8f0"}`,
          background: "#fff", color: value ? "#0f172a" : "#94a3b8",
          outline: "none", appearance: "none", boxSizing: "border-box",
          cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        }}
      >{children}</select>
      <ChevronDown size={14} color="#94a3b8" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  )
}
import { useState, useMemo } from "react"
import {
  Search,
  X,
  ArrowRight,
  ShieldCheck,
  Package,
  FileText,
  Wrench,
  SlidersHorizontal,
  CheckCircle2,
  BarChart2,
  Layers3,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ServiceCategoryType = "Technical" | "Construction" | "General"
type FilterCategory = "All" | ServiceCategoryType

interface Service {
  id: number
  name: string
  summary: string
  category: ServiceCategoryType
  thumbnail: string
  startingPrice: number
  scopes: number
  waivers: number
  deliverables: number
  terms: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data — only PUBLISHED services are listed here
// ─────────────────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    id: 1,
    name: "Air Conditioner Installation",
    summary:
      "Professional installation for residential and commercial AC systems. Includes site assessment, unit mounting, and post-install testing.",
    category: "Technical",
    thumbnail: "https://images.unsplash.com/photo-1581092919535-7146ff1a590d",
    startingPrice: 4500,
    scopes: 12,
    waivers: 3,
    deliverables: 5,
    terms: 7,
  },
  {
    id: 3,
    name: "Office Renovation Service",
    summary:
      "Workspace renovation including partitions, painting, and finishing. Tailored for commercial offices of any size.",
    category: "Construction",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
    startingPrice: 18000,
    scopes: 21,
    waivers: 6,
    deliverables: 11,
    terms: 8,
  },
  {
    id: 4,
    name: "General Cleaning Service",
    summary:
      "Comprehensive deep-cleaning for homes and offices. Includes sanitization, surface treatment, and waste disposal.",
    category: "General",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    startingPrice: 1200,
    scopes: 8,
    waivers: 1,
    deliverables: 3,
    terms: 4,
  },
  {
    id: 5,
    name: "Solar Panel Installation",
    summary:
      "End-to-end solar panel setup for residential rooftops. Includes structural inspection, panel mounting, and inverter wiring.",
    category: "Technical",
    thumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
    startingPrice: 32000,
    scopes: 18,
    waivers: 5,
    deliverables: 9,
    terms: 11,
  },
  {
    id: 6,
    name: "Interior Painting",
    summary:
      "Professional interior painting with premium paint materials. Wall prep, priming, and two-coat finish included.",
    category: "Construction",
    thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13",
    startingPrice: 5800,
    scopes: 10,
    waivers: 2,
    deliverables: 6,
    terms: 5,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n)

const CATEGORY_COLORS: Record<
  ServiceCategoryType,
  { bg: string; text: string; border: string }
> = {
  Technical: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  Construction: { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  General: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
}

const FILTER_TABS: FilterCategory[] = [
  "All",
  "Technical",
  "Construction",
  "General",
]

const META_ITEMS = (s: Service) => [
  { icon: <Wrench size={11} />, label: `${s.scopes} Scopes` },
  { icon: <ShieldCheck size={11} />, label: `${s.waivers} Waivers` },
  { icon: <Package size={11} />, label: `${s.deliverables} Deliverables` },
  { icon: <FileText size={11} />, label: `${s.terms} Terms` },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomerServiceCatalogPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] =
    useState<FilterCategory>("All")

  // Compare: up to 3 services
  const [compareIds, setCompareIds] = useState<number[]>([])

  // Modals
  const [detailService, setDetailService] =
    useState<Service | null>(null)
  const [bookService, setBookService] =
    useState<Service | null>(null)
  const [showCompare, setShowCompare] = useState(false)
  const [bookingDone, setBookingDone] = useState(false)

  // ─── Filter Logic ───────────────────────────────
  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.summary.toLowerCase().includes(search.toLowerCase())
      const matchCat =
        activeCategory === "All" || s.category === activeCategory
      return matchSearch && matchCat
    })
  }, [search, activeCategory])

  const compareServices = SERVICES.filter((s) =>
    compareIds.includes(s.id)
  )

  // ─── Compare Helpers ────────────────────────────
  const toggleCompare = (id: number) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    )
  }

  const openBooking = (service: Service) => {
    setDetailService(null)
    setBookService(service)
    setBookingDone(false)
  }

  // ─── Render ─────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', sans-serif",
        color: "#1e293b",
      }}
    >
      {/* ── Hero ────────────────────────────────── */}
      <div
        style={{
          background: "#0f172a",
          padding: "52px 32px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 999,
            padding: "6px 14px",
          }}
        >
          <Layers3 size={13} color="#60a5fa" />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#60a5fa",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Service Catalog
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 38,
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: -0.5,
            lineHeight: 1.2,
          }}
        >
          What can we help you with?
        </h1>

        <p
          style={{
            margin: "14px auto 0",
            fontSize: 15,
            color: "#94a3b8",
            maxWidth: 460,
            lineHeight: 1.6,
          }}
        >
          Browse our professional services, compare options, and book
          with ease — all in one place.
        </p>
      </div>

      {/* ── Sticky Toolbar ──────────────────────── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #f1f5f9",
          padding: "16px 32px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <Search
              size={14}
              color="#94a3b8"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              style={{
                width: "100%",
                height: 40,
                paddingLeft: 36,
                paddingRight: 14,
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                fontSize: 13,
                color: "#1e293b",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FILTER_TABS.map((tab) => {
              const active = activeCategory === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  style={{
                    height: 36,
                    padding: "0 16px",
                    borderRadius: 20,
                    border: active
                      ? "1.5px solid #0f172a"
                      : "1px solid #e2e8f0",
                    background: active ? "#0f172a" : "#fff",
                    color: active ? "#fff" : "#64748b",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: active ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: `32px 32px ${compareIds.length > 0 ? "120px" : "64px"}`,
        }}
      >
        {/* Result hint */}
        <p
          style={{
            fontSize: 13,
            color: "#94a3b8",
            marginBottom: 24,
          }}
        >
          {filtered.length}{" "}
          {filtered.length === 1 ? "service" : "services"} available
          {compareIds.length > 0 &&
            ` · ${compareIds.length} selected for comparison`}
        </p>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(310px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((service) => {
            const catColors = CATEGORY_COLORS[service.category]
            const isInCompare = compareIds.includes(service.id)
            const compareMaxed =
              compareIds.length >= 3 && !isInCompare

            return (
              <ServiceCard
                key={service.id}
                service={service}
                catColors={catColors}
                isInCompare={isInCompare}
                compareDisabled={compareMaxed}
                onToggleCompare={() => toggleCompare(service.id)}
                onViewDetail={() => setDetailService(service)}
                onBook={() => openBooking(service)}
              />
            )
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div
            style={{
              marginTop: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#94a3b8",
            }}
          >
            <SlidersHorizontal size={36} />
            <p style={{ marginTop: 12, fontSize: 14 }}>
              No services match your search.
            </p>
          </div>
        )}
      </div>

      {/* ── Compare Tray ────────────────────────── */}
      {compareIds.length >= 1 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: "#0f172a",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Left — selected chips */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <BarChart2 size={15} color="#60a5fa" />
              <span style={{ fontSize: 13, color: "#94a3b8" }}>
                {compareIds.length} selected
                {compareIds.length < 2 && (
                  <span style={{ color: "#475569" }}>
                    {" "}
                    — pick at least 2
                  </span>
                )}
              </span>
            </div>

            {compareServices.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: 8,
                  padding: "4px 8px 4px 12px",
                  fontSize: 12,
                  color: "#e2e8f0",
                }}
              >
                {s.name}
                <button
                  onClick={() => toggleCompare(s.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Right — actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setCompareIds([])}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "#94a3b8",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Clear
            </button>

            <button
              onClick={() => setShowCompare(true)}
              disabled={compareIds.length < 2}
              style={{
                height: 36,
                padding: "0 20px",
                borderRadius: 10,
                border: "none",
                background:
                  compareIds.length >= 2
                    ? "#3b82f6"
                    : "rgba(59,130,246,0.25)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor:
                  compareIds.length >= 2
                    ? "pointer"
                    : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Compare <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────── */}
      {detailService && (
        <Modal onClose={() => setDetailService(null)}>
          <div>
            <img
              src={detailService.thumbnail}
              alt={detailService.name}
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                borderRadius: "18px 18px 0 0",
              }}
            />

            <div style={{ padding: "24px 28px 32px" }}>
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 999,
                      background:
                        CATEGORY_COLORS[detailService.category].bg,
                      color:
                        CATEGORY_COLORS[detailService.category].text,
                      border: `1px solid ${CATEGORY_COLORS[detailService.category].border}`,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 10,
                    }}
                  >
                    {detailService.category}
                  </span>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 22,
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    {detailService.name}
                  </h2>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Starting at
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {fmt(detailService.startingPrice)}
                  </div>
                </div>
              </div>

              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.7,
                }}
              >
                {detailService.summary}
              </p>

              {/* Meta grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {[
                  {
                    icon: <Wrench size={16} />,
                    label: "Scope Items",
                    value: detailService.scopes,
                  },
                  {
                    icon: <ShieldCheck size={16} />,
                    label: "Waivers",
                    value: detailService.waivers,
                  },
                  {
                    icon: <Package size={16} />,
                    label: "Deliverables",
                    value: detailService.deliverables,
                  },
                  {
                    icon: <FileText size={16} />,
                    label: "Terms",
                    value: detailService.terms,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 12,
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ color: "#64748b" }}>{item.icon}</div>
                    <div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#0f172a",
                          lineHeight: 1,
                        }}
                      >
                        {item.value}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#94a3b8",
                          marginTop: 2,
                        }}
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openBooking(detailService)}
                style={{
                  width: "100%",
                  height: 46,
                  borderRadius: 12,
                  border: "none",
                  background: "#0f172a",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                Book This Service <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Booking Modal ────────────────────────── */}
      {bookService && (
        <Modal onClose={() => setBookService(null)}>
          <div style={{ padding: "28px 30px 32px" }}>
            {!bookingDone ? (
              <>
                <h2
                  style={{
                    margin: "0 0 4px",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  Book a Service
                </h2>
                <p
                  style={{
                    margin: "0 0 24px",
                    fontSize: 13,
                    color: "#94a3b8",
                  }}
                >
                  You&apos;re booking:{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {bookService.name}
                  </strong>
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      label: "Full Name",
                      placeholder: "Juan dela Cruz",
                      type: "text",
                    },
                    {
                      label: "Email Address",
                      placeholder: "juan@email.com",
                      type: "email",
                    },
                    {
                      label: "Phone Number",
                      placeholder: "+63 9XX XXX XXXX",
                      type: "tel",
                    },
                    {
                      label: "Preferred Date",
                      placeholder: "",
                      type: "date",
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#475569",
                          marginBottom: 6,
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          height: 40,
                          padding: "0 12px",
                          borderRadius: 10,
                          border: "1px solid #e2e8f0",
                          fontSize: 13,
                          color: "#1e293b",
                          outline: "none",
                          boxSizing: "border-box",
                          background: "#f8fafc",
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#475569",
                        marginBottom: 6,
                      }}
                    >
                      Additional Notes
                    </label>
                    <textarea
                      placeholder="Describe your specific requirements..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        fontSize: 13,
                        color: "#1e293b",
                        outline: "none",
                        boxSizing: "border-box",
                        background: "#f8fafc",
                        resize: "vertical",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    />
                  </div>

                  <button
                    onClick={() => setBookingDone(true)}
                    style={{
                      marginTop: 4,
                      width: "100%",
                      height: 46,
                      borderRadius: 12,
                      border: "none",
                      background: "#0f172a",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Submit Request
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "28px 0 16px",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "#f0fdf4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 18px",
                  }}
                >
                  <CheckCircle2 size={28} color="#16a34a" />
                </div>
                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  Request Submitted!
                </h2>
                <p
                  style={{
                    margin: "0 0 28px",
                    fontSize: 13,
                    color: "#64748b",
                    lineHeight: 1.6,
                  }}
                >
                  We&apos;ve received your booking for{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {bookService.name}
                  </strong>
                  . Our team will reach out within 24 hours.
                </p>
                <button
                  onClick={() => setBookService(null)}
                  style={{
                    height: 40,
                    padding: "0 24px",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    color: "#475569",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Compare Modal ────────────────────────── */}
      {showCompare && compareServices.length >= 2 && (
        <Modal onClose={() => setShowCompare(false)} wide>
          <div style={{ padding: "28px 28px 32px" }}>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Compare Services
            </h2>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: 13,
                color: "#94a3b8",
              }}
            >
              Side-by-side breakdown of selected services.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${compareServices.length}, 1fr)`,
                gap: 16,
              }}
            >
              {compareServices.map((s) => {
                const catColors = CATEGORY_COLORS[s.category]
                return (
                  <div
                    key={s.id}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 14,
                      overflow: "hidden",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <img
                      src={s.thumbnail}
                      alt={s.name}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: catColors.bg,
                          color: catColors.text,
                          border: `1px solid ${catColors.border}`,
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        {s.category}
                      </span>

                      <h3
                        style={{
                          margin: "0 0 6px",
                          fontSize: 15,
                          fontWeight: 700,
                          lineHeight: 1.3,
                        }}
                      >
                        {s.name}
                      </h3>

                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 16,
                        }}
                      >
                        {fmt(s.startingPrice)}
                      </div>

                      {/* Compare rows */}
                      {[
                        { label: "Scope Items", value: s.scopes },
                        { label: "Waivers", value: s.waivers },
                        { label: "Deliverables", value: s.deliverables },
                        { label: "Terms", value: s.terms },
                      ].map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "9px 0",
                            borderBottom: "1px solid #f1f5f9",
                            fontSize: 13,
                          }}
                        >
                          <span style={{ color: "#64748b" }}>
                            {row.label}
                          </span>
                          <strong
                            style={{
                              color: "#0f172a",
                              fontWeight: 700,
                            }}
                          >
                            {row.value}
                          </strong>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setShowCompare(false)
                          openBooking(s)
                        }}
                        style={{
                          marginTop: 16,
                          width: "100%",
                          height: 38,
                          borderRadius: 10,
                          border: "none",
                          background: "#0f172a",
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Book This
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  catColors,
  isInCompare,
  compareDisabled,
  onToggleCompare,
  onViewDetail,
  onBook,
}: {
  service: Service
  catColors: { bg: string; text: string; border: string }
  isInCompare: boolean
  compareDisabled: boolean
  onToggleCompare: () => void
  onViewDetail: () => void
  onBook: () => void
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: isInCompare
          ? "2px solid #0f172a"
          : "1px solid #f1f5f9",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: isInCompare
          ? "0 0 0 4px rgba(15,23,42,0.08)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.2s",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 190 }}>
        <img
          src={service.thumbnail}
          alt={service.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))",
          }}
        />

        {/* Compare toggle */}
        <button
          onClick={onToggleCompare}
          disabled={compareDisabled}
          title={
            isInCompare ? "Remove from compare" : "Add to compare"
          }
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: 8,
            border: "none",
            background: isInCompare
              ? "#0f172a"
              : "rgba(255,255,255,0.88)",
            color: isInCompare ? "#fff" : "#64748b",
            cursor: compareDisabled ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: compareDisabled ? 0.4 : 1,
            transition: "all 0.15s",
          }}
        >
          {isInCompare ? (
            <CheckCircle2 size={14} />
          ) : (
            <BarChart2 size={14} />
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 18px 20px" }}>
        {/* Category badge */}
        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 999,
            background: catColors.bg,
            color: catColors.text,
            border: `1px solid ${catColors.border}`,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {service.category}
        </span>

        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#0f172a",
          }}
        >
          {service.name}
        </h3>

        <p
          style={{
            margin: "0 0 16px",
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.65,
          }}
        >
          {service.summary}
        </p>

        {/* Price */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            Starting at
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {fmt(service.startingPrice)}
          </div>
        </div>

        {/* Meta chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 18,
          }}
        >
          {META_ITEMS(service).map((m) => (
            <div
              key={m.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "#f8fafc",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 11.5,
                color: "#64748b",
              }}
            >
              {m.icon}
              {m.label}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onViewDetail}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#fff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            View Details
          </button>

          <button
            onClick={onBook}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              border: "none",
              background: "#0f172a",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            Book Now <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Modal({
  children,
  onClose,
  wide = false,
}: {
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          width: "100%",
          maxWidth: wide ? 820 : 540,
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 10,
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.06)",
            color: "#475569",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={14} />
        </button>
        {children}
      </div>
    </div>
  )
}
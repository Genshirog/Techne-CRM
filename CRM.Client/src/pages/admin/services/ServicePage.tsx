import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Archive,
  RotateCcw,
  Wrench,
  ShieldCheck,
  FileText,
  Package,
  Layers3,
} from "lucide-react"

import TitleComponent from "../../../components/common/header/Title"
import CreateButton from "../../../components/common/buttons/CreateButton"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ServiceCategoryType =
  | "Technical"
  | "Construction"
  | "General"

interface ServiceCatalog {
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
  isPublished: boolean
  createdAt: string
  deletedAt: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_SERVICES: ServiceCatalog[] = [
  {
    id: 1,
    name: "Air Conditioner Installation",
    summary:
      "Professional installation for residential and commercial AC systems.",
    category: "Technical",
    thumbnail:
      "https://images.unsplash.com/photo-1581092919535-7146ff1a590d",
    startingPrice: 4500,
    scopes: 12,
    waivers: 3,
    deliverables: 5,
    terms: 7,
    isPublished: true,
    createdAt: "May 10, 2026",
    deletedAt: null,
  },

  {
    id: 2,
    name: "Electrical Wiring Maintenance",
    summary:
      "Inspection and maintenance for electrical wiring systems.",
    category: "Technical",
    thumbnail:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4",
    startingPrice: 2500,
    scopes: 9,
    waivers: 2,
    deliverables: 4,
    terms: 5,
    isPublished: false,
    createdAt: "May 11, 2026",
    deletedAt: null,
  },

  {
    id: 3,
    name: "Office Renovation Service",
    summary:
      "Workspace renovation including partitions, painting, and finishing.",
    category: "Construction",
    thumbnail:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
    startingPrice: 18000,
    scopes: 21,
    waivers: 6,
    deliverables: 11,
    terms: 8,
    isPublished: true,
    createdAt: "May 9, 2026",
    deletedAt: null,
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

const CATEGORY_COLOR: Record<ServiceCategoryType, string> = {
  Technical: "#60a5fa",
  Construction: "#f59e0b",
  General: "#34d399",
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminServiceCatalogPage() {
  const [services, setServices] =
    useState<ServiceCatalog[]>(MOCK_SERVICES)

  const [search, setSearch] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  const filtered = useMemo(() => {
    return services.filter((service) => {
      const matchSearch =
        service.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        service.summary
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchDeleted = showArchived
        ? true
        : service.deletedAt === null

      return matchSearch && matchDeleted
    })
  }, [services, search, showArchived])

  const archiveService = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              deletedAt: "Just now",
            }
          : service
      )
    )
  }

  const restoreService = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              deletedAt: null,
            }
          : service
      )
    )
  }

  const publishedCount = services.filter(
    (s) => s.isPublished && !s.deletedAt
  ).length

  const draftCount = services.filter(
    (s) => !s.isPublished && !s.deletedAt
  ).length

  const totalScopes = services.reduce(
    (sum, s) => sum + s.scopes,
    0
  )

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "28px 32px",
        fontFamily: "'DM Sans', sans-serif",
        color: "#f8fafc",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <TitleComponent
            label="Service Catalog"
            icon={Layers3}
          />

          <p
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Manage published services, scopes, waivers,
            deliverables, and operational terms.
          </p>
        </div>

        <CreateButton
          to="/admin/services/new"
          label="Create Service"
        />
      </div>

      {/* Summary */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <SummaryCard
          label="Published Services"
          value={publishedCount}
          color="#34d399"
        />

        <SummaryCard
          label="Draft Services"
          value={draftCount}
          color="#f59e0b"
        />

        <SummaryCard
          label="Total Scope Items"
          value={totalScopes}
          color="#60a5fa"
        />
      </div>

      {/* Toolbar */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 380,
          }}
        >
          <Search
            size={14}
            color="#475569"
            style={{
              position: "absolute",
              top: "50%",
              left: 12,
              transform: "translateY(-50%)",
            }}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service..."
            style={{
              width: "100%",
              height: 40,
              paddingLeft: 36,
              paddingRight: 14,
              borderRadius: 10,
              border:
                "1px solid rgba(255,255,255,0.06)",
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={() =>
            setShowArchived((prev) => !prev)
          }
          style={{
            height: 40,
            padding: "0 14px",
            borderRadius: 10,
            border:
              "1px solid rgba(255,255,255,0.06)",
            background: showArchived
              ? "rgba(99,102,241,0.14)"
              : "#1e293b",
            color: showArchived
              ? "#818cf8"
              : "#94a3b8",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {showArchived
            ? "Showing Archived"
            : "Show Archived"}
        </button>
      </div>

      {/* Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 18,
        }}
      >
        {filtered.map((service) => {
          const archived = service.deletedAt !== null

          return (
            <div
              key={service.id}
              style={{
                background: "#1e293b",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                borderRadius: 18,
                overflow: "hidden",
                opacity: archived ? 0.55 : 1,
                transition: "0.2s ease",
              }}
            >
              {/* Thumbnail */}

              <div
                style={{
                  position: "relative",
                  height: 180,
                  overflow: "hidden",
                }}
              >
                <img
                  src={service.thumbnail}
                  alt={service.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: service.isPublished
                      ? "rgba(16,185,129,0.14)"
                      : "rgba(245,158,11,0.14)",
                    color: service.isPublished
                      ? "#34d399"
                      : "#f59e0b",
                    fontSize: 11.5,
                    fontWeight: 600,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {service.isPublished
                    ? "Published"
                    : "Draft"}
                </div>
              </div>

              {/* Content */}

              <div
                style={{
                  padding: 18,
                }}
              >
                {/* Category */}

                <div
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      color:
                        CATEGORY_COLOR[
                          service.category
                        ],
                    }}
                  >
                    {service.category}
                  </span>
                </div>

                {/* Title */}

                <h3
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    fontSize: 18,
                    lineHeight: 1.3,
                    color: "#f8fafc",
                  }}
                >
                  {service.name}
                </h3>

                {/* Summary */}

                <p
                  style={{
                    margin: 0,
                    marginBottom: 16,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#94a3b8",
                  }}
                >
                  {service.summary}
                </p>

                {/* Price */}

                <div
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    Starting at
                  </span>

                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#f8fafc",
                    }}
                  >
                    {fmt(service.startingPrice)}
                  </div>
                </div>

                {/* Service Metadata */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: 10,
                    marginBottom: 18,
                  }}
                >
                  <MiniInfo
                    icon={<Wrench size={13} />}
                    label={`${service.scopes} Scopes`}
                  />

                  <MiniInfo
                    icon={<ShieldCheck size={13} />}
                    label={`${service.waivers} Waivers`}
                  />

                  <MiniInfo
                    icon={<Package size={13} />}
                    label={`${service.deliverables} Deliverables`}
                  />

                  <MiniInfo
                    icon={<FileText size={13} />}
                    label={`${service.terms} Terms`}
                  />
                </div>

                {/* Actions */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#64748b",
                    }}
                  >
                    Created {service.createdAt}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    {archived ? (
                      <ActionBtn
                        icon={
                          <RotateCcw size={13} />
                        }
                        color="#34d399"
                        onClick={() =>
                          restoreService(service.id)
                        }
                      />
                    ) : (
                      <>
                        <ActionBtn
                          icon={<Eye size={13} />}
                          color="#60a5fa"
                          onClick={() => {}}
                        />

                        <ActionBtn
                          icon={<Pencil size={13} />}
                          color="#818cf8"
                          onClick={() => {}}
                        />

                        <ActionBtn
                          icon={<Archive size={13} />}
                          color="#f87171"
                          onClick={() =>
                            archiveService(service.id)
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}

      {filtered.length === 0 && (
        <div
          style={{
            marginTop: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#64748b",
          }}
        >
          <Layers3 size={38} />

          <p
            style={{
              marginTop: 14,
              fontSize: 14,
            }}
          >
            No services found.
          </p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color,
          marginBottom: 6,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 12.5,
          color: "#94a3b8",
        }}
      >
        {label}
      </div>
    </div>
  )
}

function MiniInfo({
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
        gap: 8,
        background: "#0f172a",
        borderRadius: 10,
        padding: "10px 12px",
        fontSize: 12,
        color: "#cbd5e1",
      }}
    >
      {icon}
      {label}
    </div>
  )
}

function ActionBtn({
  icon,
  color,
  onClick,
}: {
  icon: React.ReactNode
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        border:
          "1px solid rgba(255,255,255,0.06)",
        background: "transparent",
        color,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${color}15`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "transparent"
      }}
    >
      {icon}
    </button>
  )
}
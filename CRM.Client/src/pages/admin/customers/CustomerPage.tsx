import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, Building2, Phone, Mail,
  MapPin, Tags, StickyNote, Eye,
  Pencil, Trash2, Plus,
} from "lucide-react"

import TitleComponent from "../../../components/common/header/Title"
import CreateButton from "../../../components/common/buttons/CreateButton"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"
import api from "../../../api/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

type CustomerStatus = "Active" | "Inactive" | "Blacklisted"

interface Customer {
  id: number
  name: string
  email: string
  phoneNumber: string
  companyName?: string
  companyEmail?: string
  address: string
  tags: { tagName: string; tagColor: string }[]
  status: CustomerStatus
  createdAt: string
}

const STATUS_STYLE: Record<CustomerStatus, { bg: string; color: string }> = {
  Active:      { bg: "rgba(16,185,129,0.12)",  color: "#34d399" },
  Inactive:    { bg: "rgba(148,163,184,0.12)", color: "#94a3b8" },
  Blacklisted: { bg: "rgba(239,68,68,0.12)",   color: "#f87171" },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminCustomerPage() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [search,    setSearch]    = useState("")

  // ── Fetch all customers ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)

        const res = await api.get("/customer")
        const list: any[] = res.data
        console.log("raw response:", JSON.stringify(list[0], null, 2))

        const mapped: Customer[] = list.map((c) => {
          // pick default address or first
          const addrList = c.customerAddress ?? c.customerAddresses ?? []
          const def = addrList.find((a: any) => a.isDefault === true) ?? addrList[0] ?? null
          const address = def ? `${def.label} — ${def.address}` : ""

          // map tags
          const tags = c.customerTags?.map((t: any) => ({
            tagName:  t.tag?.name  ?? t.tagName  ?? "",
            tagColor: t.tag?.color ?? t.tagColor ?? "#818cf8",
          })) ?? []

          return {
            id:          c.id,
            name:        c.name        ?? "",
            email:       c.email       ?? "",
            phoneNumber: c.phoneNumber ?? "",
            companyName: c.companyName,
            companyEmail:c.companyEmail,
            address,
            tags,
            status:    "Active" as CustomerStatus,
            createdAt: new Date(c.createdAt).toLocaleDateString("en-PH", {
              month: "short", day: "numeric", year: "numeric",
            }),
          }
        })

        setCustomers(mapped)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load customers.")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return customers.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber.includes(search)
    )
  }, [search, customers])

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<Customer>[] = [
    {
      label: "Customer", sortable: true,
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#f8fafc" }}>
            {row.name}
          </span>
          {row.companyName && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 12 }}>
              <Building2 size={12} />
              {row.companyName}
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Contact",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#cbd5e1" }}>
            <Mail size={12} />
            {row.email}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#94a3b8" }}>
            <Phone size={12} />
            {row.phoneNumber}
          </div>
        </div>
      ),
    },
    {
      label: "Address",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
          <MapPin size={12} />
          {row.address || "—"}
        </div>
      ),
    },
    {
      label: "Tags",
      render: (row) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {row.tags.length === 0 ? (
            <span style={{ fontSize: 12, color: "#334155" }}>—</span>
          ) : row.tags.map((tag) => (
            <span
              key={tag.tagName}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 9px", borderRadius: 999,
                background: `${tag.tagColor}20`,
                color: tag.tagColor || "#818cf8",
                fontSize: 11.5, fontWeight: 500,
              }}
            >
              <Tags size={11} />
              {tag.tagName}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Status",
      render: (row) => {
        const style = STATUS_STYLE[row.status]
        return (
          <span style={{
            display: "inline-block", padding: "4px 10px", borderRadius: 999,
            background: style.bg, color: style.color,
            fontSize: 11.5, fontWeight: 600,
          }}>
            {row.status}
          </span>
        )
      },
    },
    {
      label: "Since", sortable: true,
      render: (row) => (
        <span style={{ fontSize: 12, color: "#64748b" }}>{row.createdAt}</span>
      ),
    },
    {
      label: "", width: "140px",
      render: (row) => (
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ActionBtn
            icon={<Eye size={13} />}
            color="#60a5fa"
            title="View"
            onClick={() => navigate(`/admin/customers/${row.id}`)}
          />
          <ActionBtn
            icon={<Pencil size={13} />}
            color="#818cf8"
            title="Edit"
            onClick={() => navigate(`/admin/customers/${row.id}/edit`)}
          />
          <ActionBtn
            icon={<StickyNote size={13} />}
            color="#facc15"
            title="Notes"
            onClick={() => navigate(`/admin/customers/${row.id}?tab=notes`)}
          />
          <ActionBtn
            icon={<Trash2 size={13} />}
            color="#f87171"
            title="Delete"
            onClick={() => {}} // add delete confirmation if needed
          />
        </div>
      ),
    },
  ]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', sans-serif", color: "#f8fafc",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <TitleComponent label="Customer Master Data" icon={Building2} />
          <p style={{ marginTop: 4, fontSize: 13, color: "#64748b" }}>
            {loading ? "Loading..." : `${customers.length} total customers`}
          </p>
        </div>
        <CreateButton to="/admin/customers/create" label="New Customer" />
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
        <SummaryCard value={loading ? "—" : String(customers.length)}                                         label="Total Customers" color="#60a5fa" />
        <SummaryCard value={loading ? "—" : String(customers.filter(c => c.status === "Active").length)}      label="Active"          color="#34d399" />
        <SummaryCard value={loading ? "—" : String(customers.filter(c => c.companyName).length)}              label="Corporate"       color="#facc15" />
        <SummaryCard value={loading ? "—" : String(customers.filter(c => c.status === "Blacklisted").length)} label="Blacklisted"     color="#f87171" />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 10, padding: "12px 16px", marginBottom: 16,
          color: "#f87171", fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ position: "relative", width: 350 }}>
          <Search size={14} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone…"
            style={{
              width: "100%", height: 38, paddingLeft: 36, paddingRight: 14,
              borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
              background: "#1e293b", color: "#f8fafc", fontSize: 13,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, padding: "9px 14px", color: "#cbd5e1",
          fontSize: 13, cursor: "pointer",
        }}>
          <Plus size={14} />
          Add Tag Filter
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, overflow: "hidden",
      }}>
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => navigate(`/admin/customers/${row.id}`)}
          emptyMessage={loading ? "Loading customers..." : "No customers found."}
        />
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SummaryCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{
      background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16, padding: "18px 20px",
    }}>
      <div style={{ fontSize: 24, fontWeight: 700, color, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "#94a3b8" }}>{label}</div>
    </div>
  )
}

function ActionBtn({ icon, color, title, onClick }: {
  icon: React.ReactNode
  color: string
  title?: string
  onClick?: () => void
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 31, height: 31, borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "transparent", color,
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${color}18`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
    </button>
  )
}
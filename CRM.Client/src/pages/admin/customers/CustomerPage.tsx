import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  Building2,
  Phone,
  Mail,
  MapPin,
  Tags,
  StickyNote,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"

import TitleComponent from "../../../components/common/header/Title"
import CreateButton from "../../../components/common/buttons/CreateButton"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type CustomerStatus =
  | "Active"
  | "Inactive"
  | "Blacklisted"

interface Customer {
  id: number
  name: string
  company?: string
  email: string
  phone: string
  address: string
  tags: string[]
  openTickets: number
  activeJobs: number
  status: CustomerStatus
  createdAt: string
}

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    company: "Northwind Trading",
    email: "juan@northwind.com",
    phone: "+63 912 456 7811",
    address: "Quezon City",
    tags: ["VIP", "Corporate"],
    openTickets: 3,
    activeJobs: 1,
    status: "Active",
    createdAt: "May 10, 2026",
  },

  {
    id: 2,
    name: "Maria Santos",
    company: "BrightMart",
    email: "maria@brightmart.ph",
    phone: "+63 921 776 1122",
    address: "Makati City",
    tags: ["Maintenance"],
    openTickets: 1,
    activeJobs: 0,
    status: "Active",
    createdAt: "May 9, 2026",
  },

  {
    id: 3,
    name: "Carlos Reyes",
    email: "carlos@gmail.com",
    phone: "+63 998 123 4421",
    address: "Pasig City",
    tags: ["Delayed Payment"],
    openTickets: 5,
    activeJobs: 2,
    status: "Blacklisted",
    createdAt: "May 2, 2026",
  },
]

const STATUS_STYLE: Record<
  CustomerStatus,
  {
    bg: string
    color: string
  }
> = {
  Active: {
    bg: "rgba(16,185,129,0.12)",
    color: "#34d399",
  },

  Inactive: {
    bg: "rgba(148,163,184,0.12)",
    color: "#94a3b8",
  },

  Blacklisted: {
    bg: "rgba(239,68,68,0.12)",
    color: "#f87171",
  },
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function AdminCustomerPage() {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return MOCK_CUSTOMERS.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        customer.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      )
    })
  }, [search])

  const columns: ColumnDef<Customer>[] = [
    {
      label: "Customer",
      sortable: true,

      render: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "#f8fafc",
            }}
          >
            {row.name}
          </span>

          {row.company && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "#64748b",
                fontSize: 12,
              }}
            >
              <Building2 size={12} />
              {row.company}
            </div>
          )}
        </div>
      ),
    },

    {
      label: "Contact",

      render: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              color: "#cbd5e1",
            }}
          >
            <Mail size={12} />
            {row.email}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            <Phone size={12} />
            {row.phone}
          </div>
        </div>
      ),
    },

    {
      label: "Address",

      render: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          <MapPin size={12} />
          {row.address}
        </div>
      ),
    },

    {
      label: "Tags",

      render: (row) => (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {row.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 9px",
                borderRadius: 999,
                background: "rgba(99,102,241,0.12)",
                color: "#818cf8",
                fontSize: 11.5,
                fontWeight: 500,
              }}
            >
              <Tags size={11} />
              {tag}
            </span>
          ))}
        </div>
      ),
    },

    {
      label: "Activity",

      render: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#f8fafc",
            }}
          >
            {row.openTickets} Open Tickets
          </span>

          <span
            style={{
              fontSize: 11.5,
              color: "#64748b",
            }}
          >
            {row.activeJobs} Active Jobs
          </span>
        </div>
      ),
    },

    {
      label: "Status",

      render: (row) => {
        const style = STATUS_STYLE[row.status]

        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 999,
              background: style.bg,
              color: style.color,
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            {row.status}
          </span>
        )
      },
    },

    {
      label: "",

      width: "120px",

      render: () => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <ActionBtn
            icon={<Eye size={13} />}
            color="#60a5fa"
          />

          <ActionBtn
            icon={<Pencil size={13} />}
            color="#818cf8"
          />

          <ActionBtn
            icon={<StickyNote size={13} />}
            color="#facc15"
          />

          <ActionBtn
            icon={<Trash2 size={13} />}
            color="#f87171"
          />
        </div>
      ),
    },
  ]

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
            label="Customer Master Data"
            icon={Building2}
          />

          <p
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Manage customer profiles, contacts,
            operational relationships, and service history.
          </p>
        </div>

        <CreateButton
          to="/admin/customers/create"
          label="New Customer"
        />
      </div>

      {/* Summary Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <SummaryCard
          value="245"
          label="Total Customers"
          color="#60a5fa"
        />

        <SummaryCard
          value="18"
          label="Active Tickets"
          color="#f87171"
        />

        <SummaryCard
          value="42"
          label="Active Projects"
          color="#34d399"
        />

        <SummaryCard
          value="12"
          label="VIP Clients"
          color="#facc15"
        />
      </div>

      {/* Toolbar */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 350,
          }}
        >
          <Search
            size={14}
            color="#475569"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search customers..."
            style={{
              width: "100%",
              height: 38,
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#1e293b",
            border:
              "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10,
            padding: "9px 14px",
            color: "#cbd5e1",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Add Tag Filter
        </button>
      </div>

      {/* Table */}

      <div
        style={{
          background: "#1e293b",
          border:
            "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          emptyMessage="No customers found."
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function SummaryCard({
  value,
  label,
  color,
}: {
  value: string
  label: string
  color: string
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          fontSize: 24,
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

function ActionBtn({
  icon,
  color,
}: {
  icon: React.ReactNode
  color: string
}) {
  return (
    <button
      style={{
        width: 31,
        height: 31,
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
    >
      {icon}
    </button>
  )
}
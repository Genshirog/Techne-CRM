import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Edit2, Trash2, RotateCcw,
  ChevronLeft, ChevronRight, Stethoscope,
} from "lucide-react"
import CreateButton from "../../../components/common/buttons/CreateButton"
import TitleComponent from "../../../components/common/header/Title"
import { DataTable, type ColumnDef } from "../../../components/common/table/DataTable"
import TableToolbar from "../../../components/common/table/TableToolbar"
import api from "../../../api/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiagnosisCatalog {
  id: number
  name: string
  description: string
  createdAt: string
  deletedAt: string | null // soft delete tracked locally
}

const PAGE_SIZE = 8

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDiagnosisPage() {
  const navigate = useNavigate()
  const [data,        setData]        = useState<DiagnosisCatalog[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [search,      setSearch]      = useState("")
  const [showDeleted, setShowDeleted] = useState(false)
  const [page,        setPage]        = useState(1)
  const [deletingId,  setDeletingId]  = useState<number | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get("/diagnosis")
        // map API response to local shape — add deletedAt: null since DTO doesn't return it
        const mapped: DiagnosisCatalog[] = res.data.map((d: any) => ({
          id:          d.id,
          name:        d.name,
          description: d.description,
          createdAt:   new Date(d.createdAt).toLocaleDateString("en-PH", {
            month: "short", day: "numeric", year: "numeric",
          }),
          deletedAt:   null,
        }))
        setData(mapped)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load diagnosis catalog.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ── Actions ────────────────────────────────────────────────────────────────
  const softDelete = async (id: number) => {
    try {
      await api.delete(`/diagnosis/${id}`)
      setData(prev => prev.map(d =>
        d.id === id ? { ...d, deletedAt: "Just now" } : d
      ))
    } catch {
      alert("Failed to archive diagnosis.")
    }
    setDeletingId(null)
  }

  const restore = (id: number) => {
    // local restore only — add a restore endpoint if needed
    setData(prev => prev.map(d =>
      d.id === id ? { ...d, deletedAt: null } : d
    ))
  }

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<DiagnosisCatalog>[] = [
    {
      label: "#", width: "52px",
      render: (row) => (
        <span style={{ fontSize: 12, color: "#475569", fontVariantNumeric: "tabular-nums" }}>
          {row.id}
        </span>
      ),
    },
    {
      label: "Name", sortable: true,
      render: (row) => (
        <span style={{
          fontSize: 13.5, fontWeight: 500, color: "#e2e8f0",
          textDecoration: row.deletedAt !== null ? "line-through" : "none",
          textDecorationColor: "#475569",
        }}>
          {row.name}
        </span>
      ),
    },
    {
      label: "Description",
      render: (row) => (
        <span style={{
          fontSize: 13, color: "#64748b", display: "block",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          maxWidth: 320,
        }}>
          {row.description}
        </span>
      ),
    },
    {
      label: "Created", sortable: true,
      render: (row) => (
        <span style={{ fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>
          {row.createdAt}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => row.deletedAt !== null ? (
        <span style={{
          display: "inline-block", padding: "3px 10px", borderRadius: 20,
          fontSize: 11.5, fontWeight: 500,
          background: "rgba(248,113,113,0.1)", color: "#f87171",
        }}>Archived</span>
      ) : (
        <span style={{
          display: "inline-block", padding: "3px 10px", borderRadius: 20,
          fontSize: 11.5, fontWeight: 500,
          background: "rgba(16,185,129,0.1)", color: "#34d399",
        }}>Active</span>
      ),
    },
    {
      label: "", width: "100px",
      render: (row) => {
        const isConfirming = deletingId === row.id
        return isConfirming ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#f87171", whiteSpace: "nowrap" }}>Archive?</span>
            <button
              onClick={() => softDelete(row.id)}
              style={{
                background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: 6, padding: "4px 10px", color: "#f87171",
                fontSize: 12, cursor: "pointer",
              }}
            >Yes</button>
            <button
              onClick={() => setDeletingId(null)}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, padding: "4px 10px", color: "#64748b",
                fontSize: 12, cursor: "pointer",
              }}
            >No</button>
          </div>
        ) : (
          <div
            style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}
            onClick={(e) => e.stopPropagation()}
          >
            {row.deletedAt !== null ? (
              <ActionBtn
                icon={<RotateCcw size={13} />}
                title="Restore"
                color="#34d399"
                onClick={() => restore(row.id)}
              />
            ) : (
              <>
                <ActionBtn
                  icon={<Edit2 size={13} />}
                  title="Edit"
                  color="#818cf8"
                  onClick={() => navigate(`/admin/diagnosis/${row.id}`)}
                />
                <ActionBtn
                  icon={<Trash2 size={13} />}
                  title="Archive"
                  color="#f87171"
                  onClick={() => setDeletingId(row.id)}
                />
              </>
            )}
          </div>
        )
      },
    },
  ]

  // ── Filter & Paginate ──────────────────────────────────────────────────────
  const filtered = data.filter(d => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
    const matchDeleted = showDeleted ? true : d.deletedAt === null
    return matchSearch && matchDeleted
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a", padding: "28px 32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#f1f5f9",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <TitleComponent label="Diagnosis Catalog" icon={Stethoscope} />
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            {loading ? "Loading..." : `${data.filter(d => d.deletedAt === null).length} active diagnoses`}
          </p>
        </div>
        <CreateButton to="/admin/diagnosis/new" label="New Diagnosis" />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          color: "#f87171", fontSize: 13,
        }}>
          {error}
        </div>
      )}

      <TableToolbar
        search={search}
        onSearch={(value) => { setSearch(value); setPage(1) }}
        buttonLabel={showDeleted ? "Showing Archived" : "Show Archived"}
        buttonActive={showDeleted}
        onButtonClick={() => { setShowDeleted(v => !v); setPage(1) }}
        placeholder="Search by name or description…"
      />

      {/* Table */}
      <div style={{
        background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, overflow: "hidden",
      }}>
        <DataTable
          columns={columns}
          data={paged}
          keyExtractor={(row) => row.id}
          emptyMessage={loading ? "Loading diagnoses..." : "No diagnoses found."}
          rowProps={{
            style: (row) => ({
              background: row.deletedAt !== null ? "rgba(248,113,113,0.03)" : "transparent",
              opacity: row.deletedAt !== null ? 0.7 : 1,
            }),
            onMouseEnter: (row, _, e) => {
              if (row.deletedAt === null)
                e.currentTarget.style.background = "rgba(255,255,255,0.02)"
            },
            onMouseLeave: (row, _, e) => {
              e.currentTarget.style.background =
                row.deletedAt !== null ? "rgba(248,113,113,0.03)" : "transparent"
            },
          }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{ fontSize: 12.5, color: "#475569" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} · Page {page} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <PaginationBtn
                icon={<ChevronLeft size={14} />}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              />
              <PaginationBtn
                icon={<ChevronRight size={14} />}
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ActionBtn({ icon, title, color, onClick }: {
  icon: React.ReactNode
  title: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 30, height: 30, borderRadius: 7,
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.06)",
        color, cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${color}18`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
    </button>
  )
}

function PaginationBtn({ icon, disabled, onClick }: {
  icon: React.ReactNode
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 30, height: 30, borderRadius: 7,
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.08)",
        color: disabled ? "#334155" : "#94a3b8",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {icon}
    </button>
  )
}
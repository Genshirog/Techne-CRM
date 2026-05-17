// components/TableToolbar.tsx

import { Search, Filter } from "lucide-react"

type TableToolbarProps = {
  search: string
  onSearch: (value: string) => void

  buttonLabel?: string
  buttonActive?: boolean
  onButtonClick?: () => void

  placeholder?: string
  maxWidth?: number
  marginBottom?: number
}

export default function TableToolbar({
  search,
  onSearch,

  buttonLabel = "Filter",
  buttonActive = false,
  onButtonClick,

  placeholder = "Search...",
  maxWidth = 380,
  marginBottom = 16,
}: TableToolbarProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        marginBottom,
      }}
    >
      {/* Search */}
      <div
        style={{
          position: "relative",
          flex: 1,
          maxWidth,
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
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            paddingLeft: 36,
            paddingRight: 14,
            height: 36,
            background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            color: "#e2e8f0",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Button */}
      {onButtonClick && (
        <button
            onClick={onButtonClick}
            style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: buttonActive
                ? "rgba(99,102,241,0.15)"
                : "#1e293b",
            border: `1px solid ${
                buttonActive
                ? "rgba(99,102,241,0.4)"
                : "rgba(255,255,255,0.08)"
            }`,
            borderRadius: 8,
            padding: "7px 13px",
            color: buttonActive ? "#818cf8" : "#64748b",
            fontSize: 13,
            cursor: "pointer",
            }}
        >
            <Filter size={13} />
            {buttonLabel}
        </button>
        )}
    </div>
  )
}
// components/common/stats/StatusSummaryStrip.tsx

type SummaryItem = {
  label: string
  count: number
  color: string
  bg: string
  active?: boolean
  onClick?: () => void
}

type StatusSummaryStripProps = {
  items: SummaryItem[]
  columns?: number
}

export default function StatusSummaryStrip({
  items,
  columns,
}: StatusSummaryStripProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${
          columns || items.length
        }, minmax(0, 1fr))`,
        gap: 10,
        marginBottom: 20,
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          style={{
            background: item.active ? item.bg : "#1e293b",
            border: `1px solid ${
              item.active
                ? item.color + "55"
                : "rgba(255,255,255,0.06)"
            }`,
            borderRadius: 10,
            padding: "12px 16px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            textAlign: "left",
            transition: "all 150ms ease",
          }}
        >
          <span
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: item.color,
            }}
          >
            {item.count}
          </span>

          <span
            style={{
              fontSize: 12,
              color: "#64748b",
            }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}
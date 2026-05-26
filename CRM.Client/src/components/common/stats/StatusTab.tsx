// ─── Types ────────────────────────────────────────────────────────────────────

interface Tab {
  label: string;
  value: string;
}

interface StatusTabsProps<T extends { status: string }, V extends string = string> {
  tabs: { label: string; value: V }[];
  activeTab: V;
  data: T[];
  onChange: (value: V) => void;
  allValue?: V;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusTabs<T extends { status: string }, V extends string = string>({
  tabs,
  activeTab,
  data,
  onChange,
  allValue = "All" as V,
}: StatusTabsProps<T, V>) {
  return (
    <div
        className="tabs-scroll"
        style={{
            display: "flex",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "0 22px",
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
        }}
        >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const showBadge = tab.value !== allValue;
        const count = showBadge
          ? data.filter((item) => item.status === tab.value).length
          : null;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            style={{
              background: "transparent",
              border: "none",
              whiteSpace: "nowrap",
              borderBottom: isActive ? "2px solid #6366f1" : "2px solid transparent",
              padding: "12px 16px",
              fontSize: 13,
              marginBottom: -1,
              color: isActive ? "#818cf8" : "#64748b",
              cursor: "pointer",
              fontWeight: isActive ? 500 : 400,
              transition: "color 150ms ease",
            }}
          >
            {tab.label}
            {showBadge && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 11,
                  padding: "1px 6px",
                  borderRadius: 10,
                  background: isActive
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(255,255,255,0.06)",
                  color: isActive ? "#818cf8" : "#475569",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
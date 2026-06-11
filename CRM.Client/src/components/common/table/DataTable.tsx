import React, { type ReactNode, type CSSProperties, type MouseEvent } from "react";
import { ArrowUpDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnDef<T> {
  label?: string;
  key?: keyof T;
  width?: string;
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
}

export interface RowProps<T> {
  style?: (row: T, index: number) => CSSProperties;
  onMouseEnter?: (row: T, index: number, e: MouseEvent<HTMLTableRowElement>) => void;
  onMouseLeave?: (row: T, index: number, e: MouseEvent<HTMLTableRowElement>) => void;
  onClick?: (row: T, index: number, e: MouseEvent<HTMLTableRowElement>) => void;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  rowProps?: RowProps<T>;
  emptyMessage?: string;
  emptyColSpan?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DataTable<T>({
  columns,
  data: rawData,
  keyExtractor,
  onRowClick,
  rowProps,
  emptyMessage = "No data found.",
  emptyColSpan,
}: DataTableProps<T>) {
  const data = rawData.slice(0, 10);
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      {/* ── Head ── */}
      <thead>
        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          {columns.map((col, i) => (
            <th
              key={col.label ?? i}
              style={{
                padding: "11px 22px",
                textAlign: "center",
                width: col.width,
                fontSize: 11,
                fontWeight: 500,
                color: "#475569",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {col.label && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    cursor: col.sortable ? "pointer" : "default",
                  }}
                >
                  {col.label}
                  {col.sortable && <ArrowUpDown size={11} color="#334155" />}
                </div>
              )}
            </th>
          ))}
        </tr>
      </thead>

      {/* ── Body ── */}
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={emptyColSpan ?? columns.length}
              style={{
                padding: "48px 22px",
                textAlign: "center",
                color: "#475569",
                fontSize: 14,
              }}
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row, i) => {
            const customStyle = rowProps?.style?.(row, i) ?? {};
            const defaultBorder = i < data.length - 1
              ? "1px solid rgba(255,255,255,0.04)"
              : "none";

            return (
              <tr
                key={keyExtractor(row)}
                style={{
                  borderBottom: defaultBorder,
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background 120ms",
                  ...customStyle,
                }}
                onMouseEnter={(e) => {
                  if (rowProps?.onMouseEnter) {
                    rowProps.onMouseEnter(row, i, e);
                  } else {
                    e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (rowProps?.onMouseLeave) {
                    rowProps.onMouseLeave(row, i, e);
                  } else {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                onClick={(e) => {
                  rowProps?.onClick?.(row, i, e);
                  onRowClick?.(row);
                }}
              >
                {columns.map((col, ci) => (
                  <td key={ci} style={{ padding: "14px 22px" }}>
                    {col.render
                      ? col.render(row, i)
                      : col.key != null
                      ? String(row[col.key] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  /** Provide to make the column sortable; omit for the render-only "actions" style column. */
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
  /** Card rendering used below the `sm` breakpoint instead of the table. */
  renderCard: (row: T) => React.ReactNode;
  emptyMessage?: string;
}

/**
 * Generic sortable table with a real <table>/<th scope="col"> markup (so
 * screen readers can navigate by column) and a card fallback for narrow
 * screens, where a many-column table stops being readable.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  defaultSortKey,
  defaultSortDir = "desc",
  renderCard,
  emptyMessage = "Brak danych.",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState(defaultSortKey ?? columns[0]?.key);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);

  if (rows.length === 0) {
    return <p className="text-sm text-[#8A99A8]">{emptyMessage}</p>;
  }

  const activeColumn = columns.find((c) => c.key === sortKey);
  const sorted = [...rows].sort((a, b) => {
    if (!activeColumn?.sortValue) return 0;
    const av = activeColumn.sortValue(a);
    const bv = activeColumn.sortValue(b);
    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return sortDir === "asc" ? cmp : -cmp;
  });

  function handleSort(col: DataTableColumn<T>) {
    if (!col.sortValue) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col.key);
      setSortDir("desc");
    }
  }

  return (
    <>
      <div className="hidden sm:block bg-white rounded-xl border border-[#e2e7eb] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F1F4F6]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold text-[#8A99A8] tracking-wider uppercase ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                  aria-sort={
                    col.sortValue
                      ? sortKey === col.key
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col)}
                      className="inline-flex items-center gap-1 hover:text-[#1E2A36] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B9E8C] rounded"
                    >
                      {col.header}
                      {sortKey === col.key &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-3 h-3" aria-hidden="true" />
                        ))}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b border-[#F1F4F6] last:border-0 hover:bg-[#FAFBFC]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-[#1E2A36] ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sm:hidden flex flex-col gap-3">
        {sorted.map((row) => (
          <div key={getRowKey(row)}>{renderCard(row)}</div>
        ))}
      </div>
    </>
  );
}

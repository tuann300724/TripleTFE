import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import EmptyState from "../EmptyState";

export default function DataTable({
  columns,
  rows,
  rowKey = "id",
  query,
  onQueryChange,
  filters = [],
  filter,
  onFilterChange,
  sort,
  onSort,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  emptyTitle,
  emptyDescription,
}) {
  return (
    <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
      <section className="p-4 border-b border-slate-200/60 dark:border-slate-700/60 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <label className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </label>
        {filters.length > 0 && (
          <section className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => onFilterChange(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === f.value
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </section>
        )}
      </section>

      <section className="overflow-x-auto admin-scroll">
        {rows.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50/80 dark:bg-slate-900/50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.sortKey || col.key)}
                        className="inline-flex items-center gap-1 hover:text-emerald-600 transition-colors"
                      >
                        {col.title}
                        <ArrowUpDown size={12} className={sort?.key === (col.sortKey || col.key) ? "text-emerald-500" : "opacity-40"} />
                      </button>
                    ) : (
                      col.title
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row[rowKey]}
                  onClick={() => onRowClick?.(row)}
                  className={`table-row border-t border-slate-100 dark:border-slate-800 ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {rows.length > 0 && (
        <footer className="px-4 py-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            Hiển thị <b className="text-slate-700 dark:text-slate-200">{rows.length}</b> / {total} mục
          </p>
          <section className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1"
            >
              {[5, 8, 10, 15].map((n) => (
                <option key={n} value={n}>{n}/trang</option>
              ))}
            </select>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-medium min-w-[4rem] text-center">{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </section>
        </footer>
      )}
    </article>
  );
}

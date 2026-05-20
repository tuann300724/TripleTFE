import { useMemo, useState } from "react";

/**
 * Search, filter, sort, pagination cho bảng admin.
 */
export function useTableControls(rows, options = {}) {
  const {
    searchKeys = [],
    defaultSort = { key: null, dir: "asc" },
    pageSize: initialPageSize = 8,
    filterFn = null,
  } = options;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState(defaultSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const processed = useMemo(() => {
    let list = [...rows];
    const q = query.trim().toLowerCase();

    if (q && searchKeys.length) {
      list = list.filter((row) =>
        searchKeys.some((key) => {
          const val = typeof key === "function" ? key(row) : row[key];
          return String(val ?? "").toLowerCase().includes(q);
        })
      );
    }

    if (filter !== "all" && filterFn) {
      list = list.filter((row) => filterFn(row, filter));
    }

    if (sort.key) {
      const dir = sort.dir === "desc" ? -1 : 1;
      list.sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av).localeCompare(String(bv), "vi") * dir;
      });
    }

    return list;
  }, [rows, query, filter, sort, searchKeys, filterFn]);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, safePage, pageSize]);

  const toggleSort = (key) => {
    setPage(1);
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const resetPage = () => setPage(1);

  return {
    query,
    setQuery: (v) => { setQuery(v); setPage(1); },
    filter,
    setFilter: (v) => { setFilter(v); setPage(1); },
    sort,
    toggleSort,
    page: safePage,
    setPage,
    pageSize,
    setPageSize: (v) => { setPageSize(v); setPage(1); },
    totalPages,
    total: processed.length,
    rows: paginated,
    allFiltered: processed,
  };
}

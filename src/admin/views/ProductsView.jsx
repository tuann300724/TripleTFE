import { PackagePlus } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { formatCurrency, STOCK_LABEL } from "../data/mockData";
import { useTableControls } from "../hooks/useTableControls";
import CrudPageHeader from "../components/CrudPageHeader";
import DataTable from "../components/table/DataTable";
import ActionButtons from "../components/ActionButtons";

export default function ProductsView() {
  const { products, openModal, openCrud, openDelete } = useAdmin();

  const table = useTableControls(products, {
    searchKeys: ["name", "category", "id"],
    defaultSort: { key: "name", dir: "asc" },
    pageSize: 8,
    filterFn: (row, filter) => row.status === filter,
  });

  const filters = [
    { value: "all", label: "Tất cả" },
    { value: "in_stock", label: "Còn hàng" },
    { value: "low_stock", label: "Sắp hết" },
    { value: "out_of_stock", label: "Hết hàng" },
  ];

  const columns = [
    {
      key: "image",
      title: "Ảnh",
      render: (p) => (
        <img src={p.image} alt="" className="w-11 h-11 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
      ),
    },
    {
      key: "name",
      title: "Sản phẩm",
      sortable: true,
      sortKey: "name",
      render: (p) => (
        <section>
          <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
          <p className="text-xs text-emerald-600">{p.category}</p>
        </section>
      ),
    },
    {
      key: "price",
      title: "Giá",
      sortable: true,
      align: "right",
      render: (p) => <span className="font-semibold text-emerald-600">{formatCurrency(p.price)}</span>,
    },
    {
      key: "stock",
      title: "SL",
      sortable: true,
      align: "center",
      render: (p) => <span className="font-medium">{p.stock}</span>,
    },
    {
      key: "status",
      title: "Kho",
      align: "center",
      render: (p) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STOCK_LABEL[p.status]?.cls}`}>
          {STOCK_LABEL[p.status]?.label}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      align: "right",
      render: (p) => (
        <ActionButtons
          onEdit={() => openCrud("product", "edit", p)}
          onDelete={() => openDelete("product", p)}
        />
      ),
    },
  ];

  return (
    <section className="anim-in space-y-6">
      <CrudPageHeader
        title="Quản lý sản phẩm"
        subtitle={`${products.length} sản phẩm cầu lông`}
        addLabel="Thêm sản phẩm"
        icon={PackagePlus}
        onAdd={() => openCrud("product", "create")}
      />
      <DataTable
        columns={columns}
        rows={table.rows}
        query={table.query}
        onQueryChange={table.setQuery}
        filters={filters}
        filter={table.filter}
        onFilterChange={table.setFilter}
        sort={table.sort}
        onSort={table.toggleSort}
        page={table.page}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        onPageSizeChange={table.setPageSize}
        onRowClick={(p) => openModal("product", p)}
        emptyTitle="Không tìm thấy sản phẩm"
        emptyDescription="Thử từ khóa khác hoặc thêm sản phẩm mới."
      />
    </section>
  );
}

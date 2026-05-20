import { FileText } from "lucide-react";
import { useMemo } from "react";
import { useAdmin } from "../context/AdminContext";
import { formatCurrency, PAYMENT_LABEL } from "../data/mockData";
import { useTableControls } from "../hooks/useTableControls";
import CrudPageHeader from "../components/CrudPageHeader";
import DataTable from "../components/table/DataTable";
import ActionButtons from "../components/ActionButtons";
import ProductImage from "../components/products/ProductImage";

export default function InvoicesView() {
  const { enrichOrders, openModal, openCrud, openDelete } = useAdmin();
  const rows = useMemo(() => enrichOrders(), [enrichOrders]);

  const table = useTableControls(rows, {
    searchKeys: ["id", (r) => r.customer?.name, (r) => r.product?.name],
    defaultSort: { key: "date", dir: "desc" },
    pageSize: 8,
    filterFn: (row, filter) => row.paymentStatus === filter,
  });

  const filters = [
    { value: "all", label: "Tất cả" },
    { value: "paid", label: "Đã thanh toán" },
    { value: "pending", label: "Chờ TT" },
    { value: "failed", label: "Thất bại" },
  ];

  const columns = [
    {
      key: "id",
      title: "Mã HĐ",
      sortable: true,
      render: (o) => <span className="font-medium text-emerald-600">{o.id}</span>,
    },
    {
      key: "customer",
      title: "Khách hàng",
      sortable: true,
      render: (o) => (
        <section>
          <p className="font-medium">{o.customer?.name}</p>
          <p className="text-xs text-slate-500">{o.customer?.phone}</p>
        </section>
      ),
    },
    {
      key: "product",
      title: "Sản phẩm",
      render: (o) => (
        <section className="flex items-center gap-2">
          <ProductImage
            src={o.product?.image}
            productId={o.product?.id}
            alt={o.product?.name}
            className="w-9 h-9 rounded-lg object-cover hidden sm:block shrink-0 bg-slate-100 dark:bg-slate-800"
          />
          <span className="truncate max-w-[180px]">{o.product?.name}</span>
        </section>
      ),
    },
    {
      key: "date",
      title: "Ngày mua",
      sortable: true,
      render: (o) => <span className="text-slate-500">{o.date}</span>,
    },
    {
      key: "total",
      title: "Giá",
      sortable: true,
      align: "right",
      render: (o) => <span className="font-semibold">{formatCurrency(o.total)}</span>,
    },
    {
      key: "paymentStatus",
      title: "Thanh toán",
      align: "center",
      render: (o) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PAYMENT_LABEL[o.paymentStatus]?.cls}`}>
          {PAYMENT_LABEL[o.paymentStatus]?.label}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      align: "right",
      render: (o) => (
        <ActionButtons
          onEdit={() => openCrud("order", "edit", o)}
          onDelete={() => openDelete("order", o)}
        />
      ),
    },
  ];

  return (
    <section className="anim-in space-y-6">
      <CrudPageHeader
        title="Hóa đơn"
        subtitle={`${rows.length} hóa đơn — đồng bộ với đơn hàng & khách hàng`}
        addLabel="Thêm hóa đơn"
        icon={FileText}
        onAdd={() => openCrud("order", "create")}
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
        onRowClick={(o) => openModal("order", o)}
        emptyTitle="Không có hóa đơn"
        emptyDescription="Tạo hóa đơn mới từ đơn hàng liên kết."
      />
    </section>
  );
}

import { ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { useAdmin } from "../context/AdminContext";
import { formatCurrency, PAYMENT_LABEL, ORDER_STATUS_LABEL } from "../data/mockData";
import { useTableControls } from "../hooks/useTableControls";
import CrudPageHeader from "../components/CrudPageHeader";
import DataTable from "../components/table/DataTable";
import ActionButtons from "../components/ActionButtons";

export default function OrdersView() {
  const { enrichOrders, openModal, openCrud, openDelete } = useAdmin();
  const rows = useMemo(() => enrichOrders(), [enrichOrders]);

  const table = useTableControls(rows, {
    searchKeys: ["id", (r) => r.customer?.name, (r) => r.product?.name],
    defaultSort: { key: "date", dir: "desc" },
    pageSize: 8,
    filterFn: (row, filter) => {
      if (["paid", "pending", "failed"].includes(filter)) return row.paymentStatus === filter;
      return row.orderStatus === filter;
    },
  });

  const filters = [
    { value: "all", label: "Tất cả" },
    { value: "paid", label: "Đã TT" },
    { value: "pending", label: "Chờ TT" },
    { value: "shipping", label: "Đang giao" },
    { value: "delivered", label: "Đã giao" },
  ];

  const columns = [
    {
      key: "id",
      title: "Mã đơn",
      sortable: true,
      render: (o) => <span className="font-medium text-emerald-600">{o.id}</span>,
    },
    {
      key: "customer",
      title: "Khách hàng",
      sortable: true,
      sortKey: "customerId",
      render: (o) => (
        <section className="flex items-center gap-2 min-w-[140px]">
          <img src={o.customer?.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          <span className="truncate">{o.customer?.name}</span>
        </section>
      ),
    },
    {
      key: "product",
      title: "Sản phẩm",
      render: (o) => <span className="truncate max-w-[200px] inline-block">{o.product?.name}</span>,
    },
    {
      key: "date",
      title: "Ngày",
      sortable: true,
      render: (o) => <span className="text-slate-500">{o.date}</span>,
    },
    {
      key: "total",
      title: "Tổng",
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
      key: "orderStatus",
      title: "Đơn",
      align: "center",
      render: (o) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ORDER_STATUS_LABEL[o.orderStatus]?.cls}`}>
          {ORDER_STATUS_LABEL[o.orderStatus]?.label}
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
        title="Quản lý đơn hàng"
        subtitle={`${rows.length} đơn — liên kết khách hàng & sản phẩm`}
        addLabel="Thêm đơn hàng"
        icon={ShoppingBag}
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
        emptyTitle="Không có đơn hàng"
        emptyDescription="Tạo đơn mới để bắt đầu."
      />
    </section>
  );
}

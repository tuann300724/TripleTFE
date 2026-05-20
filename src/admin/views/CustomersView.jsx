import { UserPlus } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { formatCurrency } from "../data/mockData";
import { useTableControls } from "../hooks/useTableControls";
import CrudPageHeader from "../components/CrudPageHeader";
import DataTable from "../components/table/DataTable";
import ActionButtons from "../components/ActionButtons";

export default function CustomersView() {
  const { customers, openModal, openCrud, openDelete } = useAdmin();

  const table = useTableControls(customers, {
    searchKeys: ["name", "email", "phone", "id"],
    defaultSort: { key: "name", dir: "asc" },
    pageSize: 8,
  });

  const columns = [
    {
      key: "avatar",
      title: "",
      render: (c) => (
        <img src={c.avatar} alt="" className="w-10 h-10 rounded-full ring-2 ring-emerald-500/20 object-cover" />
      ),
    },
    {
      key: "name",
      title: "Khách hàng",
      sortable: true,
      render: (c) => (
        <section>
          <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
          <p className="text-xs text-slate-500">{c.id}</p>
        </section>
      ),
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
      render: (c) => <span className="text-slate-600 dark:text-slate-300 truncate max-w-[180px] inline-block">{c.email}</span>,
    },
    {
      key: "phone",
      title: "Điện thoại",
      render: (c) => c.phone,
    },
    {
      key: "totalSpent",
      title: "Đã mua",
      sortable: true,
      align: "right",
      render: (c) => <span className="font-semibold text-emerald-600">{formatCurrency(c.totalSpent)}</span>,
    },
    {
      key: "joined",
      title: "Tham gia",
      sortable: true,
      render: (c) => <span className="text-slate-500 text-xs">{c.joined}</span>,
    },
    {
      key: "actions",
      title: "",
      align: "right",
      render: (c) => (
        <ActionButtons
          onEdit={() => openCrud("customer", "edit", c)}
          onDelete={() => openDelete("customer", c)}
        />
      ),
    },
  ];

  return (
    <section className="anim-in space-y-6">
      <CrudPageHeader
        title="Quản lý khách hàng"
        subtitle={`${customers.length} khách hàng`}
        addLabel="Thêm khách hàng"
        icon={UserPlus}
        onAdd={() => openCrud("customer", "create")}
      />
      <DataTable
        columns={columns}
        rows={table.rows}
        query={table.query}
        onQueryChange={table.setQuery}
        sort={table.sort}
        onSort={table.toggleSort}
        page={table.page}
        totalPages={table.totalPages}
        total={table.total}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        onPageSizeChange={table.setPageSize}
        onRowClick={(c) => openModal("customer", c)}
        emptyTitle="Không tìm thấy khách hàng"
        emptyDescription="Thử từ khóa khác hoặc thêm khách hàng mới."
      />
    </section>
  );
}

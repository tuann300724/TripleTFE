import { CUSTOMERS, formatCurrency } from "../data/mockData";
import { useAdmin } from "../context/AdminContext";

export default function CustomersView() {
  const { openModal } = useAdmin();

  return (
    <section className="anim-in space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý khách hàng</h2>
        <p className="text-sm text-slate-500 mt-1">{CUSTOMERS.length} khách hàng</p>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CUSTOMERS.map((c) => (
          <article
            key={c.id}
            onClick={() => openModal("customer", c)}
            className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5 card-hover cursor-pointer flex items-center gap-4 shadow-sm"
          >
            <img src={c.avatar} alt="" className="w-14 h-14 rounded-full ring-2 ring-emerald-500/30 object-cover" />
            <section className="min-w-0 flex-1">
              <h3 className="font-semibold truncate text-slate-900 dark:text-white">{c.name}</h3>
              <p className="text-xs text-slate-500 truncate">{c.email}</p>
              <p className="text-xs text-slate-500">{c.phone}</p>
              <p className="text-sm font-bold text-emerald-600 mt-2">{formatCurrency(c.totalSpent)}</p>
            </section>
          </article>
        ))}
      </section>
    </section>
  );
}

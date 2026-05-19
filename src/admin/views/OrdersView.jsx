import { ORDERS, formatCurrency, enrichOrder, PAYMENT_LABEL } from "../data/mockData";
import { useAdmin } from "../context/AdminContext";

export default function OrdersView() {
  const { openModal } = useAdmin();
  const rows = ORDERS.map(enrichOrder);

  return (
    <section className="anim-in space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý đơn hàng</h2>
        <p className="text-sm text-slate-500 mt-1">{rows.length} đơn hàng</p>
      </header>
      <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-500 bg-slate-50/80 dark:bg-slate-900/50">
            <tr>
              <th className="px-5 py-3 text-left">Mã</th>
              <th className="px-5 py-3 text-left">Khách</th>
              <th className="px-5 py-3 text-left">Sản phẩm</th>
              <th className="px-5 py-3 text-left">Ngày</th>
              <th className="px-5 py-3 text-right">Tổng</th>
              <th className="px-5 py-3 text-center">TT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} onClick={() => openModal("order", o)} className="table-row cursor-pointer border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-3 font-medium text-emerald-600">{o.id}</td>
                <td className="px-5 py-3">
                  <section className="flex items-center gap-2">
                    <img src={o.customer?.avatar} alt="" className="w-8 h-8 rounded-full" />
                    {o.customer?.name}
                  </section>
                </td>
                <td className="px-5 py-3 max-w-[200px] truncate">{o.product?.name}</td>
                <td className="px-5 py-3 text-slate-500">{o.date}</td>
                <td className="px-5 py-3 text-right font-semibold">{formatCurrency(o.total)}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PAYMENT_LABEL[o.paymentStatus]?.cls}`}>
                    {PAYMENT_LABEL[o.paymentStatus]?.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}

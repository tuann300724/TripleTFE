import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import { STATS, ORDERS, formatCurrency, formatNumber, enrichOrder, PAYMENT_LABEL } from "../data/mockData";
import { useAdmin } from "../context/AdminContext";

export default function OverviewView() {
  const { openModal } = useAdmin();
  const recent = ORDERS.slice(0, 5).map(enrichOrder);

  return (
    <section className="anim-in space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard tổng quan</h2>
        <p className="text-sm text-slate-500 mt-1">Thống kê cửa hàng cầu lông TripleT</p>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Doanh thu" value={formatCurrency(STATS.revenue)} growth={STATS.revenueGrowth} icon={DollarSign} color="emerald" />
        <StatCard title="Đơn hàng" value={formatNumber(STATS.orders)} growth={STATS.ordersGrowth} icon={ShoppingCart} color="blue" />
        <StatCard title="Khách hàng" value={formatNumber(STATS.customers)} growth={STATS.customersGrowth} icon={Users} color="violet" />
        <StatCard title="Sản phẩm" value={formatNumber(STATS.products)} growth={STATS.productsGrowth} icon={Package} color="orange" />
      </section>
      <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm">
        <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">Biểu đồ doanh thu theo tháng</h3>
        <RevenueChart />
      </article>
      <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <header className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60 font-semibold">Hóa đơn gần đây</header>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-500 bg-slate-50/80 dark:bg-slate-900/50">
            <tr>
              <th className="px-5 py-3 text-left">Mã</th>
              <th className="px-5 py-3 text-left">Khách</th>
              <th className="px-5 py-3 text-left hidden md:table-cell">Sản phẩm</th>
              <th className="px-5 py-3 text-right">Tiền</th>
              <th className="px-5 py-3 text-center">TT</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} onClick={() => openModal("order", o)} className="table-row cursor-pointer border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-3 font-medium text-emerald-600">{o.id}</td>
                <td className="px-5 py-3">{o.customer?.name}</td>
                <td className="px-5 py-3 hidden md:table-cell truncate max-w-[180px] text-slate-500">{o.product?.name}</td>
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

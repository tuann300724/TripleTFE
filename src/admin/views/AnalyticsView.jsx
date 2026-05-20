import RevenueChart from "../components/RevenueChart";
import { PRODUCTS, CUSTOMERS, ORDERS, formatCurrency } from "../data/mockData";

export default function AnalyticsView() {
  const revenue = ORDERS.reduce((s, o) => s + o.total, 0);
  const topCat = [...new Set(PRODUCTS.map((p) => p.category))];

  return (
    <section className="anim-in space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Phân tích kinh doanh</p>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="glass rounded-2xl border p-5 card-hover">
          <p className="text-sm text-slate-500">Doanh thu từ đơn mẫu</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(revenue)}</p>
        </article>
        <article className="glass rounded-2xl border p-5 card-hover">
          <p className="text-sm text-slate-500">Khách hàng active</p>
          <p className="text-2xl font-bold mt-2">{CUSTOMERS.length}</p>
        </article>
        <article className="glass rounded-2xl border p-5 card-hover">
          <p className="text-sm text-slate-500">Danh mục</p>
          <p className="text-2xl font-bold mt-2">{topCat.length}</p>
          <p className="text-xs text-slate-500 mt-1">{topCat.join(", ")}</p>
        </article>
      </section>
      <article className="glass rounded-2xl border p-5">
        <h3 className="font-semibold mb-3">Xu hướng doanh thu</h3>
        <RevenueChart />
      </article>
    </section>
  );
}

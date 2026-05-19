import { PRODUCTS, formatCurrency, STOCK_LABEL } from "../data/mockData";
import { useAdmin } from "../context/AdminContext";

export default function ProductsView() {
  const { openModal } = useAdmin();

  return (
    <section className="anim-in space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý sản phẩm</h2>
        <p className="text-sm text-slate-500 mt-1">{PRODUCTS.length} sản phẩm cầu lông</p>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PRODUCTS.map((p) => (
          <article
            key={p.id}
            onClick={() => openModal("product", p)}
            className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden card-hover cursor-pointer shadow-sm"
          >
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
            <section className="p-4">
              <p className="text-xs text-emerald-600 font-semibold">{p.category}</p>
              <h3 className="font-semibold mt-1 line-clamp-2 text-slate-900 dark:text-white">{p.name}</h3>
              <p className="text-lg font-bold text-emerald-600 mt-2">{formatCurrency(p.price)}</p>
              <section className="flex justify-between items-center mt-3 text-sm">
                <span className="text-slate-500">SL: <b>{p.stock}</b></span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STOCK_LABEL[p.status]?.cls}`}>
                  {STOCK_LABEL[p.status]?.label}
                </span>
              </section>
            </section>
          </article>
        ))}
      </section>
    </section>
  );
}

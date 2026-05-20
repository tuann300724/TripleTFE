import { X } from "lucide-react";
import { useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { formatCurrency, STOCK_LABEL, PAYMENT_LABEL, enrichOrder } from "../data/mockData";

export default function DetailModal() {
  const { modal, closeModal } = useAdmin();

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  if (!modal) return null;

  const { type, data } = modal;

  return (
    <section className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" aria-label="đóng" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
      <article className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto admin-scroll rounded-2xl glass border border-slate-200/80 dark:border-slate-700/80 shadow-2xl modal-in">
        <header className="sticky top-0 glass flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-700/80 z-10">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
            {type === "product" && "Chi tiết sản phẩm"}
            {type === "customer" && "Hồ sơ khách hàng"}
            {type === "order" && "Chi tiết hóa đơn"}
          </h3>
          <button type="button" onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500">
            <X size={20} />
          </button>
        </header>

        {type === "product" && data && (
          <section className="p-5">
            <img src={data.image} alt={data.name} className="w-full h-56 object-cover rounded-xl mb-4" />
            <p className="text-xs text-emerald-600 font-semibold uppercase">{data.category}</p>
            <h4 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{data.name}</h4>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(data.price)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">{data.description}</p>
            <section className="grid grid-cols-2 gap-3 mt-4">
              <article className="rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3">
                <p className="text-xs text-slate-500">Số lượng kho</p>
                <p className="font-bold text-lg">{data.stock}</p>
              </article>
              <article className="rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3">
                <p className="text-xs text-slate-500">Trạng thái</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STOCK_LABEL[data.status]?.cls}`}>
                  {STOCK_LABEL[data.status]?.label}
                </span>
              </article>
            </section>
          </section>
        )}

        {type === "customer" && data && (
          <section className="p-5 text-center">
            <img src={data.avatar} alt="" className="w-24 h-24 rounded-full mx-auto ring-4 ring-emerald-500/30 object-cover" />
            <h4 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">{data.name}</h4>
            <p className="text-slate-500 text-sm mt-1">{data.email}</p>
            <p className="text-slate-500 text-sm">{data.phone}</p>
            <section className="grid grid-cols-2 gap-3 mt-6 text-left">
              <article className="rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3">
                <p className="text-xs text-slate-500">Ngày tham gia</p>
                <p className="font-semibold">{data.joined}</p>
              </article>
              <article className="rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3">
                <p className="text-xs text-slate-500">Tổng đã mua</p>
                <p className="font-semibold text-emerald-600">{formatCurrency(data.totalSpent)}</p>
              </article>
            </section>
          </section>
        )}

        {type === "order" && data && (() => {
          const o = enrichOrder(data);
          return (
            <section className="p-5">
              <p className="text-sm font-mono text-emerald-600 font-bold">{o.id}</p>
              <p className="text-xs text-slate-500 mt-1">Ngày mua: {o.date}</p>
              <hr className="my-4 border-slate-200 dark:border-slate-700" />
              <section className="flex items-center gap-3 mb-4">
                <img src={o.customer?.avatar} alt="" className="w-12 h-12 rounded-full" />
                <section>
                  <p className="font-semibold">{o.customer?.name}</p>
                  <p className="text-xs text-slate-500">{o.customer?.phone}</p>
                </section>
              </section>
              <article className="flex gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                <img src={o.product?.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <section>
                  <p className="font-medium text-sm">{o.product?.name}</p>
                  <p className="text-xs text-slate-500">SL: {o.quantity}</p>
                  <p className="font-bold text-emerald-600 mt-1">{formatCurrency(o.total)}</p>
                </section>
              </article>
              <section className="flex gap-2 mt-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PAYMENT_LABEL[o.paymentStatus]?.cls}`}>
                  {PAYMENT_LABEL[o.paymentStatus]?.label}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  {o.orderStatus}
                </span>
              </section>
            </section>
          );
        })()}
      </article>
    </section>
  );
}

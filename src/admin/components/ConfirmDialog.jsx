import { AlertTriangle, Trash2 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ConfirmDialog() {
  const { deleteTarget, closeDelete, handleDeleteConfirm, loading } = useAdmin();
  if (!deleteTarget) return null;

  const { entity, item } = deleteTarget;
  const labels = {
    product: "sản phẩm",
    customer: "khách hàng",
    order: "đơn hàng / hóa đơn",
  };
  const name = item.name || item.id;

  return (
    <section className="fixed inset-0 z-[115] flex items-center justify-center p-4">
      <button type="button" aria-label="đóng" className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={closeDelete} />
      <article className="relative w-full max-w-sm rounded-2xl glass border border-slate-200/80 dark:border-slate-700/80 shadow-2xl modal-in p-6 text-center">
        <span className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={28} />
        </span>
        <h3 className="text-lg font-bold mt-4 text-slate-900 dark:text-white">Xác nhận xóa</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Bạn có chắc muốn xóa {labels[entity]} <strong className="text-slate-700 dark:text-slate-200">{name}</strong>?
          Hành động này không thể hoàn tác.
        </p>
        <section className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={closeDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            <Trash2 size={16} />
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </section>
      </article>
    </section>
  );
}

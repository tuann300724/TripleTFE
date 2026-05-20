import { Pencil, Trash2 } from "lucide-react";

export default function ActionButtons({ onEdit, onDelete, stopPropagation = true }) {
  const stop = (e) => {
    if (stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <section className="flex items-center justify-end gap-1" onClick={stop}>
      <button
        type="button"
        title="Chỉnh sửa"
        onClick={(e) => { stop(e); onEdit?.(); }}
        className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        title="Xóa"
        onClick={(e) => { stop(e); onDelete?.(); }}
        className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </section>
  );
}

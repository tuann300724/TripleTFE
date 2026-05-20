import { Save, RotateCcw } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function UnsavedChangesBar() {
  const { isDirty, saveAll, discardChanges } = useSettings();
  if (!isDirty) return null;

  return (
    <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg modal-in">
      <article className="glass rounded-2xl border border-amber-200/80 dark:border-amber-700/50 shadow-2xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
          Có thay đổi chưa lưu
        </p>
        <section className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={discardChanges}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <RotateCcw size={14} /> Hoàn tác
          </button>
          <button
            type="button"
            onClick={saveAll}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[rgb(var(--admin-primary))] text-white text-sm font-medium"
          >
            <Save size={14} /> Lưu ngay
          </button>
        </section>
      </article>
    </aside>
  );
}

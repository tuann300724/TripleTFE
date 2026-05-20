import { Save, RotateCcw } from "lucide-react";

export default function SettingsActions({ onSave, onReset, saveLabel = "Lưu thay đổi" }) {
  return (
    <section className="flex flex-wrap gap-2 pt-2">
      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgb(var(--admin-primary))] text-white text-sm font-medium shadow-lg shadow-emerald-600/20 hover:opacity-95 transition-opacity"
      >
        <Save size={16} /> {saveLabel}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <RotateCcw size={16} /> Đặt lại mục này
      </button>
    </section>
  );
}

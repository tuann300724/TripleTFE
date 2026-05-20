import { Plus } from "lucide-react";

export default function CrudPageHeader({ title, subtitle, addLabel, onAdd, icon: Icon = Plus }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </section>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
        >
          <Icon size={18} />
          {addLabel}
        </button>
      )}
    </header>
  );
}

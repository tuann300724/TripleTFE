export default function FormField({ label, error, required, children, hint }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <section className="mt-1.5">{children}</section>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </label>
  );
}

export const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-shadow";

export const selectCls = `${inputCls} cursor-pointer`;

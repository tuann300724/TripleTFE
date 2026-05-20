export default function SettingsCard({ title, description, children, footer }) {
  return (
    <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden card-hover">
      {(title || description) && (
        <header className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
          {title && <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>}
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </header>
      )}
      <section className="p-5 space-y-4">{children}</section>
      {footer && (
        <footer className="px-5 py-3 border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30">
          {footer}
        </footer>
      )}
    </article>
  );
}

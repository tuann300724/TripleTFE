export default function ToggleSwitch({ checked, onChange, disabled, label, description }) {
  return (
    <label className={`flex items-center justify-between gap-4 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      {(label || description) && (
        <section className="min-w-0 flex-1">
          {label && <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{label}</p>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </section>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
          checked ? "bg-[rgb(var(--admin-primary))]" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "left-6" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

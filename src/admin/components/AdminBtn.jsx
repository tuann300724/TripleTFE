const variants = {
    primary:
        "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30",
    ghost:
        "border border-slate-200/80 bg-white/60 text-slate-700 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200",
    danger:
        "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-red-500/20 hover:-translate-y-0.5",
    soft: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
};

export default function AdminBtn({ children, variant = "primary", className = "", icon: Icon, type = "button", ...props }) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon className="h-4 w-4" />}
            {children}
        </button>
    );
}

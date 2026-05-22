export default function AdminGlassCard({ children, className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/15 dark:border-white/10 dark:bg-slate-900/50 ${className}`}
        >
            {children}
        </div>
    );
}

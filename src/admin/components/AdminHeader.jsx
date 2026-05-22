import { Bell, Search } from "lucide-react";
import AdminThemeToggle from "./AdminThemeToggle";

export default function AdminHeader({ title = "Bảng điều khiển" }) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/70 px-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h1>
            <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Tìm kiếm..."
                        className="w-52 rounded-xl border border-slate-200/80 bg-white/80 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white lg:w-64"
                    />
                </div>
                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <Bell className="h-5 w-5" />
                </button>
                <AdminThemeToggle />
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                    A
                </div>
            </div>
        </header>
    );
}

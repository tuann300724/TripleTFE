import AdminGlassCard from "./AdminGlassCard";

export default function AdminChart() {
    const bars = [40, 65, 45, 80, 55, 90, 70, 85, 50, 75, 88, 60];

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <AdminGlassCard className="lg:col-span-2">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-bold text-slate-900 dark:text-white">Tổng quan</h2>
                    <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                        {["Tuần", "Tháng", "Năm"].map((t, i) => (
                            <button
                                key={t}
                                type="button"
                                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                                    i === 1
                                        ? "bg-white text-emerald-700 shadow dark:bg-slate-700 dark:text-emerald-400"
                                        : "text-slate-500"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex h-48 items-end gap-1.5 border-b border-slate-200/60 pb-2 dark:border-slate-700">
                    {bars.map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-600/80 to-emerald-400/20 transition-all duration-500 hover:from-emerald-500"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            </AdminGlassCard>
            <AdminGlassCard className="flex flex-col items-center justify-center py-8">
                <h2 className="font-bold text-slate-900 dark:text-white">Phân bổ</h2>
                <div className="mt-4 flex h-36 w-36 items-center justify-center rounded-full border-[6px] border-dashed border-slate-200 dark:border-slate-700">
                    <span className="text-3xl font-bold text-slate-300">—</span>
                </div>
            </AdminGlassCard>
        </div>
    );
}

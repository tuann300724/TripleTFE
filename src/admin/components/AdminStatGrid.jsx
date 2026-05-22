import AdminGlassCard from "./AdminGlassCard";

export default function AdminStatGrid() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <AdminGlassCard key={i} className="p-5">
                    <div className="h-2 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <p className="mt-4 text-3xl font-bold text-slate-300 dark:text-slate-600">—</p>
                </AdminGlassCard>
            ))}
        </div>
    );
}

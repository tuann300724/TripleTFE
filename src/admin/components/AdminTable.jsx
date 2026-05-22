import AdminEmptyState from "./AdminEmptyState";
import AdminGlassCard from "./AdminGlassCard";
import AdminPagination from "./AdminPagination";

export default function AdminTable({ title, columns, message, footer, colSpan }) {
    return (
        <AdminGlassCard className="overflow-hidden p-0">
            {title && (
                <div className="border-b border-slate-200/60 px-6 py-4 dark:border-slate-700">
                    <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className={`px-6 py-4 ${col === "Thao tác" ? "text-right" : ""}`}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AdminEmptyState message={message} colSpan={colSpan ?? columns.length} />
                    </tbody>
                </table>
            </div>
            <div className="space-y-4 border-t border-slate-200/60 px-6 py-4 dark:border-slate-700">
                {footer}
                <AdminPagination />
            </div>
        </AdminGlassCard>
    );
}

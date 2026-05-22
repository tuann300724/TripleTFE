import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminBtn from "./AdminBtn";
import AdminGlassCard from "./AdminGlassCard";
import AdminStatGrid from "./AdminStatGrid";
import AdminTable from "./AdminTable";

export function AdminPageActions({ onFilter }) {
    return (
        <>
            <AdminBtn variant="ghost" onClick={onFilter}>
                Lọc
            </AdminBtn>
            <AdminBtn variant="primary" icon={Plus}>
                Thêm
            </AdminBtn>
        </>
    );
}

export function AdminSearchFilter({ searchPlaceholder = "Tìm kiếm..." }) {
    return (
        <AdminGlassCard className="p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row">
                <input
                    type="search"
                    placeholder={searchPlaceholder}
                    className="flex-1 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
                />
                <select
                    className="rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none dark:border-slate-600 dark:bg-slate-800/80 dark:text-white md:w-44"
                    defaultValue=""
                >
                    <option value="">Tất cả trạng thái</option>
                </select>
                <select
                    className="rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none dark:border-slate-600 dark:bg-slate-800/80 dark:text-white md:w-44"
                    defaultValue=""
                >
                    <option value="">Sắp xếp</option>
                </select>
            </div>
        </AdminGlassCard>
    );
}

export function AdminRowActions() {
    return (
        <div className="flex justify-end gap-2">
            <AdminBtn variant="soft" className="!px-3 !py-2 opacity-70" icon={Pencil}>
                Sửa
            </AdminBtn>
            <AdminBtn variant="danger" className="!px-3 !py-2 opacity-70" icon={Trash2}>
                Xóa
            </AdminBtn>
        </div>
    );
}

export function AdminPageBody({ message, columns, searchPlaceholder, tableTitle, showFilter = true }) {
    return (
        <div className="space-y-6 animate-[fadeUp_0.5s_ease-out]">
            <AdminStatGrid />
            {showFilter && <AdminSearchFilter searchPlaceholder={searchPlaceholder} />}
            <AdminTable
                title={tableTitle}
                columns={columns}
                message={message}
                colSpan={columns.length}
                footer={<AdminRowActions />}
            />
        </div>
    );
}

export function AdminPageHero({ title, subtitle, icon: Icon, actions }) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
                {Icon && (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                        <Icon className="h-7 w-7" />
                    </div>
                )}
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                        TripleT Badminton
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">{title}</h1>
                    {subtitle && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
                    )}
                </div>
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
    );
}

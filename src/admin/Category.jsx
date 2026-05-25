import { FolderTree } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";


const message = "Chức năng quản lý danh mục sẽ được phát triển trong tương lai.";


export default function Category() {
    const columns = ["Tên danh mục", "Slug", "Số SP", "Thao tác"];
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1">
           
                <div className="p-6">
                    {/* Hero section */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <FolderTree className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý danh mục</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Phân loại sản phẩm TripleT</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white">Lọc</button>
                            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700">Thêm</button>
                        </div>
                    </div>
                    {/* Search/filter */}
                    <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-800 mb-6">
                        <div className="flex flex-col gap-3 md:flex-row">
                            <input
                                type="search"
                                placeholder="Tìm danh mục..."
                                className="flex-1 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
                            />
                            <select className="rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none dark:border-slate-600 dark:bg-slate-800/80 dark:text-white md:w-44" defaultValue="">
                                <option value="">Tất cả trạng thái</option>
                            </select>
                            <select className="rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none dark:border-slate-600 dark:bg-slate-800/80 dark:text-white md:w-44" defaultValue="">
                                <option value="">Sắp xếp</option>
                            </select>
                        </div>
                    </div>
                    {/* Table */}
                    <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Danh sách danh mục</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">{message}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">Sửa</button>
                            <button className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-white dark:hover:bg-red-600">Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

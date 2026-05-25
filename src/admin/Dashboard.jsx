import { LayoutDashboard } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";


const message = "Chức năng quản lý người dùng sẽ được phát triển trong tương lai.";

export default function Dashboard() {
    const columns = ["Mục", "Mô tả", "Thời gian", "Trạng thái"];
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1">
      
                <div className="p-6 space-y-6 animate-[fadeUp_0.5s_ease-out]">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <LayoutDashboard className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Dashboard</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tổng quan cửa hàng cầu lông TripleT</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white">Lọc</button>
                            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700">Thêm</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-800">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Tổng số mục</div>
                            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0</div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Hoạt động gần đây</h2>
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
                                        <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">Chức năng quản lý người dùng sẽ được phát triển trong tương lai.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

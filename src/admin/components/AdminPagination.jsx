import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminBtn from "./AdminBtn";

export default function AdminPagination() {
    return (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Trang <span className="font-semibold text-slate-800 dark:text-white">1</span>
            </p>
            <div className="flex items-center gap-1">
                <AdminBtn variant="ghost" className="!px-2.5 !py-2 opacity-50" disabled>
                    <ChevronLeft className="h-4 w-4" />
                </AdminBtn>
                {[1, 2, 3].map((p) => (
                    <button
                        key={p}
                        type="button"
                        className={`min-w-[2.25rem] rounded-lg px-2 py-1.5 text-sm font-semibold transition ${
                            p === 1
                                ? "bg-emerald-600 text-white shadow-md"
                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                    >
                        {p}
                    </button>
                ))}
                <AdminBtn variant="ghost" className="!px-2.5 !py-2">
                    <ChevronRight className="h-4 w-4" />
                </AdminBtn>
            </div>
        </div>
    );
}

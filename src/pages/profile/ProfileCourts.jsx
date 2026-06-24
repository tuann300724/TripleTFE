import { useState } from "react";
import ProfileCourtsCreate from "./ProfileCourtsCreate";

export default function ProfileCourts() {
    const [view, setView] = useState("list"); // 'list' | 'create'

    if (view === "create") {
        return <ProfileCourtsCreate onBack={() => setView("list")} />;
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quản lý sân của bạn</h3>
                    <p className="text-xs text-slate-400 mt-1">Đăng ký và quản lý các cụm sân cầu lông của bạn trên hệ thống.</p>
                </div>
                <button 
                    onClick={() => setView("create")}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Tạo sân mới
                </button>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
                <div className="w-24 h-24 mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Bạn chưa có cụm sân nào</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                    Trở thành đối tác của TripleT ngay hôm nay. Thêm sân cầu lông của bạn để tiếp cận hàng ngàn người chơi đang tìm kiếm sân trống!
                </p>
                <button 
                    onClick={() => setView("create")}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-4"
                >
                    Đăng ký sân ngay &rarr;
                </button>
            </div>
        </div>
    );
}

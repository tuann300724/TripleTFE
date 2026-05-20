import { Link } from "react-router-dom";

export default function Success() {
    // Current date format for display
    const currentDate = new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-16 transition-colors duration-300 min-h-[80vh] flex items-center justify-center">
            <div className="mx-auto max-w-xl px-6 w-full text-center">
                {/* Visual Steps - Step 3 (Completed) */}
                <div className="flex justify-center items-center mb-10 max-w-xs mx-auto">
                    <div className="flex items-center text-emerald-500">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-500">✓</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-emerald-500 mx-2"></div>
                    <div className="flex items-center text-emerald-500">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-500">✓</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-emerald-500 mx-2"></div>
                    <div className="flex items-center text-emerald-500 font-bold">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">3</span>
                    </div>
                </div>

                {/* Animated Success Badge */}
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 border border-emerald-500/30 shadow-xl shadow-emerald-500/10 mb-6 relative">
                    {/* Ring animations */}
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-25" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-12 w-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>

                {/* Headers */}
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Đặt hàng thành công!</h1>
                <p className="tt-body text-sm mt-3 max-w-sm mx-auto">
                    Cảm ơn bạn đã lựa chọn mua sắm tại TripleT Badminton. Đơn hàng của bạn đang được xử lý nhanh chóng.
                </p>

                {/* Invoice Detail Summary Box */}
                <div className="tt-card p-6 text-left mt-8 space-y-4 border border-slate-200/60 dark:border-slate-800/80 shadow-md">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                        Thông tin đơn hàng #TT-8829
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <span className="text-slate-400">Ngày đặt hàng</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{currentDate}</span>

                        <span className="text-slate-400">Người nhận</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">Nguyễn Văn A</span>

                        <span className="text-slate-400">Số điện thoại</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">0987 654 321</span>

                        <span className="text-slate-400">Địa chỉ giao hàng</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right line-clamp-1">123 Đường Nguyễn Trãi, Hà Nội</span>

                        <span className="text-slate-400">Phương thức thanh toán</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">Thanh toán khi nhận hàng (COD)</span>

                        <span className="text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 font-bold text-slate-900 dark:text-white">Tổng cộng</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-right border-t border-slate-100 dark:border-slate-800 pt-3 text-lg">
                            6,462,000 ₫
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/product" className="tt-btn-primary px-8 py-3.5 shadow-lg shadow-emerald-500/20 font-bold">
                        Tiếp tục mua sắm
                    </Link>
                    <Link to="/" className="tt-btn-ghost px-8 py-3.5 border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}

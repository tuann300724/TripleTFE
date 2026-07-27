export default function CheckoutProgress() {
    return (
        <div className="flex justify-center items-center mb-10 max-w-md mx-auto">

            <div className="flex items-center text-slate-400 dark:text-slate-500">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold">
                    1
                </span>
                <span className="ml-2 text-xs font-semibold hidden sm:inline">
                    Giỏ hàng
                </span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 mx-4"></div>

            <div className="flex items-center text-emerald-500 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                    2
                </span>
                <span className="ml-2 text-xs hidden sm:inline">
                    Thanh toán
                </span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 mx-4"></div>

            <div className="flex items-center text-slate-400 dark:text-slate-500">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold">
                    3
                </span>
                <span className="ml-2 text-xs hidden sm:inline">
                    Thành công
                </span>
            </div>

        </div>
    );
}

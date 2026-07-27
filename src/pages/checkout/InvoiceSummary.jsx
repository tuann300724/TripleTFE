import { Link } from "react-router-dom";

export default function InvoiceSummary({ invoiceItems, subtotal, total, formatPrice, onPlaceOrder }) {
    return (
        <div className="tt-card p-6 md:p-8 space-y-4 shadow-xl border border-slate-200/50 dark:border-slate-800/50">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Chi tiết hóa đơn
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-60 overflow-y-auto pr-2">

                {invoiceItems.map((item) => (

                    <div
                        key={item.cartItemId}
                        className="flex gap-4 py-3 items-center"
                    >

                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white">

                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />

                        </div>

                        <div className="flex-1 space-y-0.5">

                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                                {item.name}
                            </h4>

                            <p className="text-xs text-slate-400">
                                Phân loại:
                                {" "}
                                {item.selectedSize}
                                {" / "}
                                {item.selectedColor}
                            </p>

                            <div className="flex justify-between items-center text-xs">

                                <span className="text-slate-400">
                                    SL: {item.quantity}
                                </span>

                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {formatPrice(
                                        item.price * item.quantity
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-sm">

                <div className="flex justify-between text-slate-500 dark:text-slate-400">

                    <span>Tạm tính</span>

                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatPrice(subtotal)}
                    </span>

                </div>

                <div className="flex justify-between text-slate-500 dark:text-slate-400">

                    <span>Phí giao hàng</span>

                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Miễn phí
                    </span>

                </div>

            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-baseline">

                <span className="text-base font-bold text-slate-900 dark:text-white">
                    Tổng cộng
                </span>

                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(total)}
                </span>

            </div>

            <button
                type="button"
                onClick={onPlaceOrder}
                className="tt-btn-primary w-full py-4 shadow-lg shadow-emerald-500/20 font-bold tracking-wide mt-2"
            >
                Xác nhận thanh toán
            </button>

            <Link
                to="/cart"
                className="block text-center text-xs font-semibold text-emerald-500 hover:text-emerald-600 hover:underline transition-colors pt-2"
            >
                Quay lại giỏ hàng chỉnh sửa
            </Link>

        </div>
    );
}

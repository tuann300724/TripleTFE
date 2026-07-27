export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
    return (
        <div className="tt-card p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Phương thức thanh toán
            </h2>

            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === "cod"
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-slate-200 dark:border-slate-600"
            }`}>
                <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 h-4 w-4 text-emerald-500 focus:ring-0"
                />
                <div>
                    <span className="block font-bold text-sm text-slate-900 dark:text-white">
                        COD (Thanh toán khi nhận hàng)
                    </span>
                    <span className="block text-xs text-slate-400 mt-0.5">
                        Nhận hàng và thanh toán trực tiếp
                    </span>
                </div>
            </label>

            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === "momo"
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-slate-200 dark:border-slate-600"
            }`}>
                <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    className="mt-1 h-4 w-4 text-pink-500 focus:ring-0"
                />
                <div>
                    <span className="block font-bold text-sm text-slate-900 dark:text-white">
                        Momo (Thanh toán qua ví Momo)
                    </span>
                    <span className="block text-xs text-slate-400 mt-0.5">
                        Quét mã QR hoặc thanh toán qua app Momo
                    </span>
                </div>
            </label>
        </div>
    );
}

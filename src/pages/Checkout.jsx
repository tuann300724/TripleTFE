import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products, formatPrice } from "../data/products";

export default function Checkout() {
    const navigate = useNavigate();

    // Mock invoice products
    const [invoiceItems] = useState([
        {
            ...products[0],
            quantity: 1,
            selectedSize: "4U/G5",
            selectedColor: "Đen Emerald",
        },
        {
            ...products[2],
            quantity: 1,
            selectedSize: "41",
            selectedColor: "Trắng Titan",
        },
    ]);

    const [paymentMethod, setPaymentMethod] = useState("cod");

    // Calculation formulas
    const subtotal = invoiceItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = subtotal * 0.1; // Apply default promo discount for testing
    const shipping = 0; // Free ship for testing
    const total = subtotal + shipping - discount;

    const handlePlaceOrder = () => {
        navigate("/success");
    };

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-12 transition-colors duration-300 min-h-screen">
            <div className="mx-auto max-w-6xl px-6 md:px-12">
                {/* Visual Progress Steps */}
                <div className="flex justify-center items-center mb-10 max-w-md mx-auto">
                    <div className="flex items-center text-slate-400 dark:text-slate-500">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold">1</span>
                        <span className="ml-2 text-xs font-semibold hidden sm:inline">Giỏ hàng</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 mx-4"></div>
                    <div className="flex items-center text-emerald-500 font-bold">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">2</span>
                        <span className="ml-2 text-xs hidden sm:inline">Thanh toán</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 mx-4"></div>
                    <div className="flex items-center text-slate-400 dark:text-slate-500">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold">3</span>
                        <span className="ml-2 text-xs hidden sm:inline">Thành công</span>
                    </div>
                </div>

                {/* Page Grid Layout */}
                <div className="grid gap-8 lg:grid-cols-12 items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Receiver Info */}
                        <div className="tt-card p-6 md:p-8 space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Thông tin giao hàng
                            </h2>

                            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Họ và tên người nhận</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nguyễn Văn A"
                                        className="tt-input"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="0987654321"
                                        className="tt-input"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email (Không bắt buộc)</label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="tt-input"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Địa chỉ giao hàng</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                        className="tt-input"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ghi chú giao hàng</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn đường đi..."
                                        className="tt-input resize-none"
                                    ></textarea>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method selection */}
                        <div className="tt-card p-6 md:p-8 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Phương thức thanh toán
                            </h2>

                            <div className="space-y-3">
                                {/* COD */}
                                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                    paymentMethod === "cod"
                                        ? "border-emerald-500 bg-emerald-500/5"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "cod"}
                                        onChange={() => setPaymentMethod("cod")}
                                        className="mt-1 h-4 w-4 text-emerald-500 focus:ring-0"
                                    />
                                    <div>
                                        <span className="block font-bold text-sm text-slate-900 dark:text-white">COD (Thanh toán khi nhận hàng)</span>
                                        <span className="block text-xs text-slate-400 mt-0.5">Nhận hàng và thanh toán trực tiếp với nhân viên giao hàng.</span>
                                    </div>
                                </label>

                                {/* Bank Transfer */}
                                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                    paymentMethod === "bank"
                                        ? "border-emerald-500 bg-emerald-500/5"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "bank"}
                                        onChange={() => setPaymentMethod("bank")}
                                        className="mt-1 h-4 w-4 text-emerald-500 focus:ring-0"
                                    />
                                    <div className="w-full">
                                        <span className="block font-bold text-sm text-slate-900 dark:text-white">Chuyển khoản ngân hàng</span>
                                        <span className="block text-xs text-slate-400 mt-0.5">Thanh toán qua app ngân hàng bằng mã QR tự động.</span>

                                        {/* Mock Bank Account Info & QR Code */}
                                        {paymentMethod === "bank" && (
                                            <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid gap-4 sm:grid-cols-12 items-center">
                                                <div className="sm:col-span-7 space-y-2 text-xs">
                                                    <p className="text-slate-400">Ngân hàng: <span className="font-bold text-slate-800 dark:text-slate-200">MB BANK (Quân Đội)</span></p>
                                                    <p className="text-slate-400">Số tài khoản: <span className="font-bold text-slate-800 dark:text-slate-200">1902 9999 9999</span></p>
                                                    <p className="text-slate-400">Chủ tài khoản: <span className="font-bold text-slate-800 dark:text-slate-200">CONG TY TNHH TRIPLET</span></p>
                                                    <p className="text-slate-400">Nội dung chuyển khoản: <span className="font-bold text-slate-800 dark:text-slate-200">TTL 10245</span></p>
                                                </div>
                                                <div className="sm:col-span-5 flex flex-col items-center gap-2 p-2 border-l border-slate-100 dark:border-slate-800">
                                                    {/* Beautiful Mock QR Graphic */}
                                                    <div className="relative h-28 w-28 border-2 border-emerald-500 p-1.5 rounded-lg bg-white flex items-center justify-center shadow-inner">
                                                        {/* Simulated QR block layout */}
                                                        <div className="grid grid-cols-5 gap-1 w-full h-full opacity-80">
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-100 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-100 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-100 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-100 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-emerald-500 rounded-sm flex items-center justify-center text-[8px] text-white font-extrabold">TT</div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-100 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-100 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                            <div className="bg-slate-100 rounded-sm"></div>
                                                            <div className="bg-slate-100 rounded-sm"></div>
                                                            <div className="bg-slate-900 rounded-sm"></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-semibold text-center">Quét mã để thanh toán</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </label>

                                {/* Credit Card */}
                                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                    paymentMethod === "card"
                                        ? "border-emerald-500 bg-emerald-500/5"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "card"}
                                        onChange={() => setPaymentMethod("card")}
                                        className="mt-1 h-4 w-4 text-emerald-500 focus:ring-0"
                                    />
                                    <div className="w-full">
                                        <span className="block font-bold text-sm text-slate-900 dark:text-white">Thẻ tín dụng (Visa, Mastercard, JCB)</span>
                                        <span className="block text-xs text-slate-400 mt-0.5">Thanh toán bảo mật trực tiếp bằng thẻ quốc tế.</span>

                                        {paymentMethod === "card" && (
                                            <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid gap-4 grid-cols-2">
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Số thẻ</label>
                                                    <input
                                                        type="text"
                                                        placeholder="4123 4567 8901 2345"
                                                        className="tt-input text-sm py-2"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hạn sử dụng</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="tt-input text-sm py-2"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mã CVV</label>
                                                    <input
                                                        type="password"
                                                        placeholder="•••"
                                                        className="tt-input text-sm py-2"
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tên in trên thẻ</label>
                                                    <input
                                                        type="text"
                                                        placeholder="NGUYEN VAN A"
                                                        className="tt-input text-sm py-2 uppercase"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Invoice */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="tt-card p-6 md:p-8 space-y-4 shadow-xl border border-slate-200/50 dark:border-slate-800/50">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Chi tiết hóa đơn
                            </h2>

                            {/* Itemized List */}
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-60 overflow-y-auto pr-2">
                                {invoiceItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-3 items-center">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-0.5">
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-slate-400">
                                                Phân loại: {item.selectedSize} / {item.selectedColor}
                                            </p>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400">SL: {item.quantity}</span>
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Costs Breakdown */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Tạm tính</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Giảm giá (Áp dụng mã TRIPLET10)</span>
                                    <span className="font-semibold text-emerald-500">
                                        -{formatPrice(discount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Phí giao hàng</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
                                    </span>
                                </div>
                            </div>

                            {/* Total Cost */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-baseline">
                                <span className="text-base font-bold text-slate-900 dark:text-white">Tổng cộng</span>
                                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                    {formatPrice(total)}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                className="tt-btn-primary w-full py-4 shadow-lg shadow-emerald-500/20 font-bold tracking-wide mt-2"
                            >
                                Xác nhận thanh toán
                            </button>

                            <Link to="/cart" className="block text-center text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors pt-2">
                                Quay lại giỏ hàng chỉnh sửa
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

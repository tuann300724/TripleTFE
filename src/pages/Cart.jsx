import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products, formatPrice } from "../data/products";

export default function Cart() {
    const navigate = useNavigate();

    // Mock cart items based on our product list
    const [cartItems, setCartItems] = useState([
        {
            ...products[0], // Yonex Astrox 99 Pro
            quantity: 1,
            selectedSize: "4U/G5",
            selectedColor: "Đen Emerald",
        },
        {
            ...products[2], // Giày Yonex Power Cushion 65 Z3
            quantity: 1,
            selectedSize: "41",
            selectedColor: "Trắng Titan",
        },
    ]);

    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0); // 0 VND initially
    const [promoApplied, setPromoApplied] = useState(false);

    // Quantity update handlers
    const updateQuantity = (id, delta) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    // Remove item handler
    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    // Calculation formulas
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 30000;
    const total = subtotal + shipping - discount;

    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === "TRIPLET10") {
            setDiscount(subtotal * 0.1);
            setPromoApplied(true);
        } else {
            alert("Mã giảm giá không hợp lệ. Hãy thử: TRIPLET10");
        }
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-12 transition-colors duration-300 min-h-[70vh]">
            <div className="mx-auto max-w-6xl px-6 md:px-12">
                {/* Page Title */}
                <div className="mb-8">
                    <span className="tt-label text-xs">Cửa hàng</span>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">Giỏ hàng của bạn</h1>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-12 items-start">
                        {/* Cart items list */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="tt-card overflow-hidden">
                                <div className="hidden md:grid grid-cols-12 gap-4 border-b border-slate-200 dark:border-slate-800 p-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <div className="col-span-6">Sản phẩm</div>
                                    <div className="col-span-2 text-center">Giá</div>
                                    <div className="col-span-2 text-center">Số lượng</div>
                                    <div className="col-span-2 text-right">Tổng cộng</div>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 transition-colors duration-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/30">
                                            {/* Details (Img + Info) */}
                                            <div className="col-span-1 md:col-span-6 flex gap-4">
                                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white">
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="space-y-1 flex flex-col justify-center">
                                                    <Link to={`/product/${item.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors line-clamp-1">
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-xs text-slate-400">
                                                        Phân loại: {item.selectedSize} / {item.selectedColor}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 mt-1 font-medium transition-colors"
                                                    >
                                                        Xóa sản phẩm
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-1 md:col-span-2 text-left md:text-center">
                                                <span className="md:hidden text-xs text-slate-400 font-bold mr-2">Đơn giá:</span>
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>

                                            {/* Qty Selector */}
                                            <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                                                <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="px-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 h-full font-bold transition-all"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="px-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 h-full font-bold transition-all"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="col-span-1 md:col-span-2 text-left md:text-right font-bold text-emerald-600 dark:text-emerald-400">
                                                <span className="md:hidden text-xs text-slate-400 mr-2">Tổng cộng:</span>
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Back link */}
                            <Link to="/product" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>

                        {/* Summary Column */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Promo Code Card */}
                            <div className="tt-card p-6">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Mã giảm giá</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập TRIPLET10"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        disabled={promoApplied}
                                        className="tt-input py-2 text-sm uppercase"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyPromo}
                                        disabled={promoApplied}
                                        className={`px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                            promoApplied
                                                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                                                : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20"
                                        }`}
                                    >
                                        {promoApplied ? "Đã áp dụng" : "Áp dụng"}
                                    </button>
                                </div>
                                {promoApplied && (
                                    <p className="text-xs text-emerald-500 font-semibold mt-2">
                                        ✓ Đã áp dụng mã giảm giá 10%!
                                    </p>
                                )}
                            </div>

                            {/* Order Total Card */}
                            <div className="tt-card p-6 space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                    Tóm tắt đơn hàng
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                        <span>Tạm tính</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                        <span>Phí vận chuyển</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-500 font-semibold">
                                            <span>Giảm giá</span>
                                            <span>-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-baseline">
                                    <span className="text-base font-bold text-slate-900 dark:text-white">Tổng cộng</span>
                                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                        {formatPrice(total)}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    className="tt-btn-primary w-full py-3.5 shadow-lg shadow-emerald-500/20 font-bold"
                                >
                                    Tiến hành thanh toán
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Empty Cart view
                    <div className="tt-card p-12 text-center max-w-xl mx-auto mt-8">
                        <p className="text-6xl animate-pulse">🛒</p>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-4">Giỏ hàng trống</h2>
                        <p className="tt-body text-sm mt-2 max-w-sm mx-auto">
                            Hiện không có sản phẩm nào trong giỏ hàng. Hãy lướt xem các dụng cụ cầu lông tuyệt vời của chúng tôi nhé!
                        </p>
                        <Link to="/product" className="tt-btn-primary mt-6 px-8 py-3 font-semibold">
                            Lướt xem sản phẩm
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

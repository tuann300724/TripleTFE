import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function Success() {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Quản lý dữ liệu đơn hàng bằng state để cập nhật động từ LocalStorage (MoMo)
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processPaymentResult = async () => {
            // -----------------------------------------------------------------
            // LUỒNG 1: ĐẶT HÀNG COD TRUYỀN THỐNG (Có sẵn dữ liệu từ location.state)
            // -----------------------------------------------------------------
            if (location.state) {
                setOrderData(location.state);
                setLoading(false);
                return;
            }

            // -----------------------------------------------------------------
            // LUỒNG 2: QUAY VỀ TỪ MOMO (Kiểm tra Query Parameters trên URL)
            // -----------------------------------------------------------------
            const resultCode = searchParams.get("resultCode");

            if (resultCode === "0") {
                // 1. Lấy lại cục dữ liệu đã cất tạm trước khi sang MoMo
                const savedState = localStorage.getItem("momo_payment_state");

                if (savedState) {
                    const parsedData = JSON.parse(savedState);

                    // Cập nhật trạng thái hiển thị tạm trên UI cho người dùng thấy luôn
                    setOrderData({
                        ...parsedData,
                        paymentMethod: "MOMO (Đã thanh toán)"
                    });

                    // Hàm chạy ngầm cập nhật Database mà không làm block UI
                    const finalizeMomoOrder = async () => {
                        try {
                            // 🔥 2. GỌI API BACKEND ĐỂ CHUYỂN "Waiting" -> "Success"
                            await axios.patch(`https://localhost:7147/api/Payments/ConfirmMomo/${parsedData.order.orderId}`);
                            console.log("Backend chốt đơn MoMo thành công!");

                            // 🔥 3. CHẠY TIẾP LUỒNG XÓA GIỎ HÀNG
                            for (const item of parsedData.items) {
                                await axios.delete(
                                    `https://localhost:7147/api/CartItems/${item.cartItemId}`
                                );
                            }
                            console.log("Đã dọn sạch Cart Items.");

                        } catch (error) {
                            console.error("Lỗi xử lý hậu thanh toán MoMo:", error);
                        }
                    };

                    finalizeMomoOrder();

                    // 4. Xóa dữ liệu đệm tránh lặp request khi F5
                    localStorage.removeItem("momo_payment_state");
                }
            } else if (resultCode && resultCode !== "0") {
                console.warn("Giao dịch MoMo thất bại hoặc bị hủy bởi người dùng.");
            }

            setLoading(false);
        };

        processPaymentResult();
    }, [location.state, searchParams]);

    // FORMAT PRICE
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price || 0);
    };

    // LOADING STATE (Tránh lỗi Undefined trong lúc đợi kiểm tra URL/Local)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0c1219]">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                        Đang xử lý thông tin giao dịch...
                    </p>
                </div>
            </div>
        );
    }

    // FALLBACK: Không có dữ liệu (Hủy thanh toán MoMo hoặc truy cập lậu URL /success)
    if (!orderData || !orderData.order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0c1219]">
                <div className="text-center px-4">
                    <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">
                        Thanh toán thất bại hoặc Không tìm thấy đơn hàng
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                        Giao dịch MoMo đã bị hủy, hết hạn hoặc không tồn tại thông tin đơn hàng hợp lệ.
                    </p>
                    <Link to="/" className="tt-btn-primary inline-flex mt-6 px-6 py-3">
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    // Bóc tách dữ liệu an toàn sau khi đã kiểm tra qua state
    const { order, items, shippingInfo, paymentMethod } = orderData;

    // DATE FORMAT
    const currentDate = new Date(order.orderDate || Date.now()).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-16 transition-colors duration-300 min-h-[80vh] flex items-center justify-center">
            <div className="mx-auto max-w-2xl px-6 w-full text-center">

                {/* STEP */}
                <div className="flex justify-center items-center mb-10 max-w-xs mx-auto">
                    <div className="flex items-center text-emerald-500">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-500">
                            ✓
                        </span>
                    </div>
                    <div className="flex-1 h-0.5 bg-emerald-500 mx-2"></div>
                    <div className="flex items-center text-emerald-500">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-500">
                            ✓
                        </span>
                    </div>
                    <div className="flex-1 h-0.5 bg-emerald-500 mx-2"></div>
                    <div className="flex items-center text-emerald-500 font-bold">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                            3
                        </span>
                    </div>
                </div>

                {/* ICON */}
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 border border-emerald-500/30 shadow-xl shadow-emerald-500/10 mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-25" />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="h-12 w-12"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>

                {/* HEADER */}
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    Đặt hàng thành công!
                </h1>
                <p className="tt-body text-sm mt-3 max-w-sm mx-auto">
                    Cảm ơn bạn đã mua sắm tại TripleT Badminton.
                </p>

                {/* ORDER INFO */}
                <div className="tt-card p-6 text-left mt-8 space-y-4 border border-slate-200/60 dark:border-slate-800/80 shadow-md">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                        Thông tin đơn hàng #{order.orderId}
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <span className="text-slate-400">Ngày đặt hàng</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{currentDate}</span>

                        <span className="text-slate-400">Người nhận</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{shippingInfo?.receiverName}</span>

                        <span className="text-slate-400">Số điện thoại</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{shippingInfo?.receiverPhone}</span>

                        <span className="text-slate-400">Địa chỉ giao hàng</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{shippingInfo?.shippingAddress}</span>

                        <span className="text-slate-400">Thanh toán</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right uppercase">{paymentMethod}</span>
                    </div>
                </div>

                {/* PRODUCTS */}
                <div className="tt-card mt-6 p-6 text-left">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sản phẩm đã mua</h3>
                    <div className="space-y-4">
                        {items?.map((item) => (
                            <div key={item.cartItemId || item.variantId} className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {item.selectedColor} {item.selectedSize ? `/ ${item.selectedSize}` : ""}
                                    </p>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm text-slate-500">SL: {item.quantity}</span>
                                        <span className="font-bold text-emerald-500">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOTAL */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">Tổng cộng</span>
                        <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {formatPrice(order.totalAmount)}
                        </span>
                    </div>
                </div>

                {/* ACTIONS */}
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
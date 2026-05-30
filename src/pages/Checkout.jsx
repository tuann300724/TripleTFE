import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createMomoPayment } from "../service/momoService";

export default function Checkout() {
    const navigate = useNavigate();

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem("user"))
    );

    const [invoiceItems, setInvoiceItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [receiverEmail, setReceiverEmail] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");

    // =========================
    // LOAD USER INFO
    // =========================
    useEffect(() => {
        if (!user?.userId) return;

        const loadUserInfo = async () => {
            const res = await axios.get(
                "https://localhost:7147/api/UserProfile/" + user.userId
            );

            const u = res.data;

            setReceiverName(u.fullName || "");
            setReceiverPhone(u.phone || "");
            setReceiverEmail(u.user.email || "");
            setShippingAddress(u.address || "");
        };

        loadUserInfo();
    }, [user?.userId]);

    // =========================
    // LOAD CART
    // =========================
    useEffect(() => {
        if (!user) return;

        const loadCheckout = async () => {
            try {
                const cartRes = await axios.get(
                    "https://localhost:7147/api/Carts"
                );

                const userCart = cartRes.data.find(
                    (c) => c.userId === user.userId
                );

                if (!userCart) return;

                const items = await Promise.all(
                    userCart.cartItems.map(async (item) => {
                        const variantRes = await axios.get(
                            `https://localhost:7147/api/ProductVariants/${item.variantId}`
                        );

                        const variant = variantRes.data;

                        const productRes = await axios.get(
                            `https://localhost:7147/api/Products/${variant.productId}`
                        );

                        const product = productRes.data;

                        return {
                            ...item,
                            name: product.productName,
                            image: product.thumbnail,
                            price: variant.price,
                            selectedColor: variant.color,
                            selectedSize: variant.size,
                        };
                    })
                );

                setInvoiceItems(items);
            } catch (err) {
                console.log(err);
            }
        };

        loadCheckout();
    }, []);

    // =========================
    // TOTAL
    // =========================
    const subtotal = invoiceItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const total = subtotal;

    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price || 0);

    // =========================
    // PLACE ORDER
    // =========================
    const handlePlaceOrder = async () => {
        if (
            !receiverName.trim() ||
            !receiverPhone.trim() ||
            !receiverEmail.trim() ||
            !shippingAddress.trim()
        ) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            // ================= 1. TẠO ORDER TRÊN BACKEND =================
            const orderRes = await axios.post(
                "https://localhost:7147/api/Orders",
                {
                    userId: user.userId,
                    orderStatus: "Pending",
                    totalAmount: total,
                }
            );

            const order = orderRes.data;

            // ================= 2. TẠO CHI TIẾT ĐƠN HÀNG =================
            for (const item of invoiceItems) {
                await axios.post(
                    "https://localhost:7147/api/OrderDetails",
                    {
                        orderId: order.orderId,
                        variantId: item.variantId,
                        productName: item.name,
                        variantName: `${item.selectedSize} / ${item.selectedColor}`,
                        productImage: item.image,
                        quantity: item.quantity,
                        unitPrice: item.price,
                    }
                );
            }

            // ================= 3. TẠO TRẠNG THÁI THANH TOÁN =================
            await axios.post(
                "https://localhost:7147/api/Payments",
                {
                    orderId: order.orderId,
                    amount: total,
                    paymentMethod: paymentMethod === "momo" ? "MOMO" : "COD",
                    paymentStatus: paymentMethod === "momo" ? "Waiting" : "Paid",
                }
            );

            // ================= 4. XỬ LÝ LUỒNG MOMO THẬT =================
            if (paymentMethod === "momo") {
                // Đóng gói dữ liệu State để cất vào localStorage
                const successStateForMomo = {
                    order,
                    items: invoiceItems,
                    shippingInfo: {
                        receiverName,
                        receiverPhone,
                        shippingAddress,
                    },
                    paymentMethod: "MOMO",
                };

                // Lưu trữ tạm thời để trang /success sau khi quay về lấy ra render
                localStorage.setItem("momo_payment_state", JSON.stringify(successStateForMomo));

                // Gọi Service tạo liên kết thanh toán MoMo
                const momoRes = await createMomoPayment(order.orderId, total);

                // Ép kiểu an toàn từ Object/String JSON trả về
                const data =
                    typeof momoRes === "string"
                        ? JSON.parse(momoRes)
                        : momoRes;

                console.log("MOMO RESPONSE PROCESSING:", data);

                // Chuyển hướng trình duyệt sang MoMo Real
                if (data?.payUrl) {
                    window.location.href = data.payUrl;
                    return;
                }

                alert("Không tạo được link MoMo");
                console.error(data);
                return;
            }

            // ================= 5. XỬ LÝ LUỒNG COD TRUYỀN THỐNG =================
            for (const item of invoiceItems) {
                await axios.delete(
                    `https://localhost:7147/api/CartItems/${item.cartItemId}`
                );
            }

            alert("Đặt hàng thành công");

            navigate("/success", {
                state: {
                    order,
                    items: invoiceItems,
                    shippingInfo: {
                        receiverName,
                        receiverPhone,
                        shippingAddress,
                    },
                    paymentMethod: "COD",
                },
            });

        } catch (err) {
            console.log(err);
            alert("Đặt hàng thất bại");
        }
    };


    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-12 transition-colors duration-300 min-h-screen">

            <div className="mx-auto max-w-6xl px-6 md:px-12">

                {/* Visual Progress Steps */}
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

                <div className="grid gap-8 lg:grid-cols-12 items-start">

                    {/* LEFT */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* SHIPPING */}
                        <div className="tt-card p-6 md:p-8 space-y-4">

                            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Thông tin giao hàng
                            </h2>

                            <form
                                className="grid gap-4 sm:grid-cols-2"
                                onSubmit={(e) => e.preventDefault()}
                            >

                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Họ và tên người nhận
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        value={receiverName}
                                        onChange={(e) => setReceiverName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="tt-input"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Số điện thoại
                                    </label>

                                    <input
                                        type="tel"
                                        required
                                        value={receiverPhone}
                                        onChange={(e) => setReceiverPhone(e.target.value)}
                                        placeholder="0987654321"
                                        className="tt-input"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        required
                                        value={receiverEmail}
                                        onChange={(e) => setReceiverEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="tt-input"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Địa chỉ giao hàng
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Số nhà, tên đường..."
                                        className="tt-input"
                                    />
                                </div>

                            </form>
                        </div>

                        {/* PAYMENT */}
                        <div className="tt-card p-6 md:p-8 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Phương thức thanh toán
                            </h2>

                            {/* COD */}
                            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === "cod"
                                ? "border-emerald-500 bg-emerald-500/5"
                                : "border-slate-200 dark:border-slate-800"
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

                            {/* MOMO */}
                            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === "momo"
                                ? "border-pink-500 bg-pink-100/20"
                                : "border-slate-200 dark:border-slate-800"
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

                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-5 space-y-6">

                        <div className="tt-card p-6 md:p-8 space-y-4 shadow-xl border border-slate-200/50 dark:border-slate-800/50">

                            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Chi tiết hóa đơn
                            </h2>

                            {/* ITEMS */}
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

                            {/* TOTAL */}
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
                                onClick={handlePlaceOrder}
                                className="tt-btn-primary w-full py-4 shadow-lg shadow-emerald-500/20 font-bold tracking-wide mt-2"
                            >
                                Xác nhận thanh toán
                            </button>

                            <Link
                                to="/cart"
                                className="block text-center text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors pt-2"
                            >
                                Quay lại giỏ hàng chỉnh sửa
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
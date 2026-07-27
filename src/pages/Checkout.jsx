import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import { createMomoPayment } from "../service/momoService";
import CheckoutProgress from "./checkout/CheckoutProgress";
import Breadcrumb from "../components/Breadcrumb";
import ShippingForm from "./checkout/ShippingForm";
import PaymentMethod from "./checkout/PaymentMethod";
import InvoiceSummary from "./checkout/InvoiceSummary";
import { FadeIn } from "../components/Animate";
import { useToast } from "../components/Toast";
import { useAuth } from "../hooks/useAuth";

export default function Checkout() {
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    const [invoiceItems, setInvoiceItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [loading, setLoading] = useState(true);
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [receiverEmail, setReceiverEmail] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");

    // =========================
    // LOAD USER INFO
    // =========================
    useEffect(() => {
        if (!user?.userId) {
            setLoading(false);
            return;
        }

        const loadUserInfo = async () => {
            try {
                const res = await api.get(
                    "/UserProfile/" + user.userId
                );

                const u = res.data;

                setReceiverName(u.fullName || "");
                setReceiverPhone(u.phone || "");
                setReceiverEmail(u.email || "");
                setShippingAddress(u.address || "");
            } catch {
                // silent
            }
        };

        loadUserInfo();
    }, [user?.userId]);

    // =========================
    // LOAD CART
    // =========================
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const loadCheckout = async () => {
            try {
                const cartRes = await api.get(
                    "/Carts"
                );

                const userCart = cartRes.data.find(
                    (c) => c.userId === user.userId
                );

                if (!userCart?.cartItems || userCart.cartItems.length === 0) {
                    setLoading(false);
                    return;
                }

                const items = await Promise.all(
                    userCart.cartItems.map(async (item) => {
                        try {
                            const variantRes = await api.get(
                                `/ProductVariants/${item.variantId}`
                            );

                            const variant = variantRes.data;

                            const productRes = await api.get(
                                `/Products/${variant.productId}`
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
                        } catch {
                            return null;
                        }
                    })
                );

                setInvoiceItems(items.filter(Boolean));
                setLoading(false);
            } catch {
                setLoading(false);
            }
        };

        loadCheckout();
    }, [user]);

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
            toast("Vui lòng nhập đầy đủ thông tin", "error");
            return;
        }

        try {
            // ================= 1. TẠO ORDER TRÊN BACKEND =================
            const orderRes = await api.post(
                "/Orders",
                {
                    userId: user.userId,
                    orderStatus: "Pending",
                    totalAmount: total,
                }
            );

            const order = orderRes.data;

            // ================= 2. TẠO CHI TIẾT ĐƠN HÀNG =================
            for (const item of invoiceItems) {
                await api.post(
                    "/OrderDetails",
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
            await api.post(
                "/Payments",
                {
                    orderId: order.orderId,
                    amount: total,
                    paymentMethod: paymentMethod === "momo" ? "MOMO" : "COD",
                    paymentStatus: paymentMethod === "momo" ? "Waiting" : "Paid",
                }
            );

            // ================= 4. XỬ LÝ LUỒNG MOMO THẬT =================
            if (paymentMethod === "momo") {

                // Xóa cart items trước khi redirect MoMo
                for (const item of invoiceItems) {
                    await api.delete(`/CartItems/${item.cartItemId}`).catch(() => {});
                }

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

                // Chuyển hướng trình duyệt sang MoMo Real
                if (data?.payUrl) {
                    window.location.href = data.payUrl;
                    return;
                }

                toast("Không tạo được link MoMo", "error");
                return;
            }

            // ================= 5. XỬ LÝ LUỒNG COD TRUYỀN THỐNG =================
            for (const item of invoiceItems) {
                await api.delete(
                    `/CartItems/${item.cartItemId}`
                );
            }

            toast("Đặt hàng thành công", "success");

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
            toast("Đặt hàng thất bại", "error");
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-screen bg-slate-50 dark:bg-[#0c1219]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-12 transition-colors duration-300 min-h-screen">

            <div className="mx-auto max-w-6xl px-6 md:px-12">

                <Breadcrumb items={[{ to: "/cart", label: "Giỏ hàng" }, { label: "Thanh toán" }]} />

                <FadeIn>
                    <CheckoutProgress />
                </FadeIn>

                <div className="grid gap-8 lg:grid-cols-12 items-start">

                    <div className="lg:col-span-7 space-y-6">
                        <FadeIn>
                            <ShippingForm
                                receiverName={receiverName}
                                setReceiverName={setReceiverName}
                                receiverPhone={receiverPhone}
                                setReceiverPhone={setReceiverPhone}
                                receiverEmail={receiverEmail}
                                setReceiverEmail={setReceiverEmail}
                                shippingAddress={shippingAddress}
                                setShippingAddress={setShippingAddress}
                            />
                        </FadeIn>
                        <FadeIn delay={100}>
                            <PaymentMethod
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                            />
                        </FadeIn>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <FadeIn delay={150}>
                            <InvoiceSummary
                                invoiceItems={invoiceItems}
                                subtotal={subtotal}
                                total={total}
                                formatPrice={formatPrice}
                                onPlaceOrder={handlePlaceOrder}
                            />
                        </FadeIn>
                    </div>

                </div>

            </div>

        </div>
    );
}
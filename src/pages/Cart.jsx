import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../service/api";
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { FadeIn } from "../components/Animate";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../hooks/useAuth";

export default function Cart() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // LOAD CART
    useEffect(() => {

        const fetchCart = async () => {

            if (!user) return;

            try {

                // lấy cart theo user
                const cartRes = await api.get(
                    "/Carts"
                );

                const userCart = cartRes.data.find(
                    (cart) => cart.userId === user.userId
                );

                if (!userCart?.cartItems || userCart.cartItems.length === 0) {

                    setCartItems([]);

                    return;
                }

                // lấy detail variant
                const items = await Promise.all(

                    userCart.cartItems.map(async (item) => {

                        try {
                            const variantRes = await api.get(
                                `/ProductVariants/${item.variantId}`
                            );

                            const variant = variantRes.data;

                            // lấy product
                            const productRes = await api.get(
                                `/Products/${variant.productId}`
                            );

                            const product = productRes.data;

                            return {

                            cartItemId: item.cartItemId,

                            cartId: item.cartId,

                            variantId: item.variantId,

                            quantity: item.quantity,

                            variant: variant,

                            product: product
                        };
                        } catch {
                            return {
                                cartItemId: item.cartItemId,
                                cartId: item.cartId,
                                variantId: item.variantId,
                                quantity: item.quantity,
                                variant: null,
                                product: null
                            };
                        }
                    })
                );

                setCartItems(items);
                setLoading(false);

            } catch (err) {

                console.log(err);
                setLoading(false);

            }
        };

        fetchCart();

    }, [user]);

    // UPDATE QUANTITY
    const updateQuantity = async (cartItemId, delta) => {

        const item = cartItems.find(
            (x) => x.cartItemId === cartItemId
        );

        if (!item) return;

        const newQuantity = item.quantity + delta;

        if (newQuantity < 1) return;

        try {

            await api.put(
                `/CartItems/${cartItemId}`,
                {
                    cartId: item.cartId,
                    variantId: item.variantId,
                    quantity: newQuantity
                }
            );

            setCartItems(
                cartItems.map((x) =>
                    x.cartItemId === cartItemId
                        ? { ...x, quantity: newQuantity }
                        : x
                )
            );

        } catch (err) {

            console.log(err);

        }
    };

    // DELETE ITEM
    const removeItem = async (cartItemId) => {
        try {
            await api.delete(
                `/CartItems/${cartItemId}`
            );

            setCartItems(
                cartItems.filter(
                    (x) => x.cartItemId !== cartItemId
                )
            );

            // ĐOẠN THÊM VÀO: Bắn sự kiện báo cho Header biết giỏ hàng đã thay đổi
            window.dispatchEvent(new Event("cartUpdated"));

        } catch (err) {
            console.log(err);
        }
    };

    // CALCULATE
    const subtotal = cartItems.reduce(
        (acc, item) =>
            acc + item.variant.price * item.quantity,
        0
    );


    const total = subtotal;

    // CHECKOUT
    const handleCheckout = () => {

        navigate("/checkout");

    };

    // FORMAT
    const formatPrice = (price) => {

        return new Intl.NumberFormat(
            "vi-VN",
            {
                style: "currency",
                currency: "VND",
            }
        ).format(price || 0);

    };
    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-12 transition-colors duration-300 min-h-[70vh]">

            <div className="mx-auto max-w-6xl px-6 md:px-12">

                <Breadcrumb items={[{ label: "Giỏ hàng" }]} />

                {/* TITLE */}
                <div className="mb-8">
                    <span className="tt-label text-xs">
                        Cửa hàng
                    </span>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        Giỏ hàng của bạn
                    </h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                    </div>
                ) : cartItems.length > 0 ? (

                    <div className="grid gap-8 lg:grid-cols-12 items-start">

                        {/* CART LIST */}
                        <div className="lg:col-span-8 space-y-4">
                            <FadeIn>
                            <div className="tt-card overflow-hidden">

                                <div className="hidden md:grid grid-cols-12 gap-4 border-b border-slate-200 dark:border-slate-800 p-6 text-xs font-bold uppercase tracking-wider text-slate-400">

                                    <div className="col-span-6">
                                        Sản phẩm
                                    </div>

                                    <div className="col-span-2 text-center">
                                        Giá
                                    </div>

                                    <div className="col-span-2 text-center">
                                        Số lượng
                                    </div>

                                    <div className="col-span-2 text-right">
                                        Tổng cộng
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">

                                    {cartItems.map((item) => (

                                        <div
                                            key={item.cartItemId}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6"
                                        >

                                            {/* PRODUCT */}
                                            <div className="col-span-1 md:col-span-6 flex gap-4">

                                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-600">

                                                    <img
                                                        src={item.product.thumbnail}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="space-y-1 flex flex-col justify-center">

                                                    <Link
                                                        to={`/product/${item.product.productId}`}
                                                        className="font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                                    >
                                                        {item.product.productName}
                                                    </Link>

                                                    <p className="text-xs text-slate-400">
                                                        Size: {item.variant.size} / Màu: {item.variant.color}
                                                    </p>

                                                </div>
                                            </div>

                                            {/* PRICE */}
                                            <div className="col-span-1 md:col-span-2 text-center font-semibold">

                                                {formatPrice(item.variant.price)}

                                            </div>

                                            {/* QUANTITY */}
                                            <div className="col-span-1 md:col-span-2 flex justify-center">

                                                <div className="flex h-9 items-center rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.cartItemId,
                                                                -1
                                                            )
                                                        }
                                                        className="px-3 h-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 active:scale-[0.95]"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="w-10 text-center text-slate-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.cartItemId,
                                                                1
                                                            )
                                                        }
                                                        className="px-3 h-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 active:scale-[0.95]"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* TOTAL */}
                                            <div className="col-span-1 md:col-span-2 text-right flex flex-col items-end gap-1.5">
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatPrice(
                                                        item.variant.price *
                                                        item.quantity
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.cartItemId)}
                                                    className="flex items-center gap-1 rounded-lg border border-red-200/60 px-2.5 py-1 text-[11px] font-medium text-red-400 transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:text-red-500 active:scale-[0.95] dark:border-red-900/40 dark:hover:bg-red-950/20"
                                                >
                                                    <Trash2 size={12} />
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BACK */}
                            <Link
                                to="/product"
                                className="group mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500/30"
                            >
                                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                                Tiếp tục mua sắm
                            </Link>
                            </FadeIn>
                        </div>

                        {/* SUMMARY */}
                        <div className="lg:col-span-4 space-y-6">
                            <FadeIn delay={150}>
                            <div className="tt-card p-6 space-y-4">

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3">

                                    Tóm tắt đơn hàng

                                </h3>

                                <div className="space-y-2 text-sm">

                                    <div className="flex justify-between">

                                        <span className="text-slate-600 dark:text-slate-400">Tạm tính</span>

                                        <span className="font-semibold">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-slate-600 dark:text-slate-400">Phí vận chuyển</span>

                                        <span className="font-semibold">
                                            Miễn phí
                                        </span>
                                    </div>


                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-baseline">

                                    <span className="text-base font-bold text-slate-900 dark:text-white">
                                        Tổng cộng
                                    </span>

                                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">

                                        {formatPrice(total)}

                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    className="tt-btn-primary w-full py-3.5"
                                >
                                    Tiến hành thanh toán
                                </button>
                            </div>
                            </FadeIn>
                        </div>
                    </div>

                ) : (

                    // EMPTY CART
                    <FadeIn>
                    <div className="tt-card p-12 text-center max-w-xl mx-auto mt-8">

                        <ShoppingCart size={56} className="mx-auto text-slate-400 dark:text-slate-500" />

                        <h2 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">
                            Giỏ hàng trống
                        </h2>

                        <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">
                            Hiện không có sản phẩm nào trong giỏ hàng
                        </p>

                        <Link
                            to="/product"
                            className="tt-btn-primary mt-6 px-8 py-3 font-semibold"
                        >
                            Lướt xem sản phẩm
                        </Link>
                    </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
}
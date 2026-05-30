import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";

export default function Cart() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [cartItems, setCartItems] = useState([]);

    // LOAD CART
    useEffect(() => {

        const fetchCart = async () => {

            if (!user) return;

            try {

                // lấy cart theo user
                const cartRes = await axios.get(
                    "https://localhost:7147/api/Carts"
                );

                const userCart = cartRes.data.find(
                    (cart) => cart.userId === user.userId
                );

                if (!userCart) {

                    setCartItems([]);

                    return;
                }

                // lấy detail variant
                const items = await Promise.all(

                    userCart.cartItems.map(async (item) => {

                        const variantRes = await axios.get(
                            `https://localhost:7147/api/ProductVariants/${item.variantId}`
                        );

                        const variant = variantRes.data;

                        // lấy product
                        const productRes = await axios.get(
                            `https://localhost:7147/api/Products/${variant.productId}`
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
                    })
                );

                setCartItems(items);

            } catch (err) {

                console.log(err);

            }
        };

        fetchCart();

    }, []);

    // UPDATE QUANTITY
    const updateQuantity = async (cartItemId, delta) => {

        const item = cartItems.find(
            (x) => x.cartItemId === cartItemId
        );

        if (!item) return;

        const newQuantity = item.quantity + delta;

        if (newQuantity < 1) return;

        try {

            await axios.put(
                `https://localhost:7147/api/CartItems/${cartItemId}`,
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
            await axios.delete(
                `https://localhost:7147/api/CartItems/${cartItemId}`
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

                {/* TITLE */}
                <div className="mb-8">
                    <span className="tt-label text-xs">
                        Cửa hàng
                    </span>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        Giỏ hàng của bạn
                    </h1>
                </div>

                {cartItems.length > 0 ? (

                    <div className="grid gap-8 lg:grid-cols-12 items-start">

                        {/* CART LIST */}
                        <div className="lg:col-span-8 space-y-4">

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

                                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">

                                                    <img
                                                        src={item.product.thumbnail}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="space-y-1 flex flex-col justify-center">

                                                    <Link
                                                        to={`/product/${item.product.productId}`}
                                                        className="font-semibold text-slate-900 dark:text-white"
                                                    >
                                                        {item.product.productName}
                                                    </Link>

                                                    <p className="text-xs text-slate-400">
                                                        Size: {item.variant.size}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        Màu: {item.variant.color}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(item.cartItemId)
                                                        }
                                                        className="w-fit mt-1.5 flex items-center gap-1.5 rounded-md bg-red-50 dark:bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-500/20"
                                                    >
                                                        <Trash2 size={14} />
                                                        Xóa sản phẩm
                                                    </button>
                                                </div>
                                            </div>

                                            {/* PRICE */}
                                            <div className="col-span-1 md:col-span-2 text-center font-semibold">

                                                {formatPrice(item.variant.price)}

                                            </div>

                                            {/* QUANTITY */}
                                            <div className="col-span-1 md:col-span-2 flex justify-center">

                                                <div className="flex h-9 items-center rounded-lg border overflow-hidden">

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.cartItemId,
                                                                -1
                                                            )
                                                        }
                                                        className="px-3 h-full"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="w-10 text-center">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.cartItemId,
                                                                1
                                                            )
                                                        }
                                                        className="px-3 h-full"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* TOTAL */}
                                            <div className="col-span-1 md:col-span-2 text-right font-bold text-emerald-600">

                                                {formatPrice(
                                                    item.variant.price *
                                                    item.quantity
                                                )}

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BACK */}
                            <Link
                                to="/product"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500"
                            >
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>

                        {/* SUMMARY */}
                        <div className="lg:col-span-4 space-y-6">

                            <div className="tt-card p-6 space-y-4">

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b pb-3">

                                    Tóm tắt đơn hàng

                                </h3>

                                <div className="space-y-2 text-sm">

                                    <div className="flex justify-between">

                                        <span>Tạm tính</span>

                                        <span className="font-semibold">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">

                                        <span>Phí vận chuyển</span>

                                        <span className="font-semibold">
                                            Miễn phí
                                        </span>
                                    </div>


                                </div>

                                <div className="border-t pt-4 flex justify-between items-baseline">

                                    <span className="text-base font-bold">
                                        Tổng cộng
                                    </span>

                                    <span className="text-2xl font-extrabold text-emerald-600">

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
                        </div>
                    </div>

                ) : (

                    // EMPTY CART
                    <div className="tt-card p-12 text-center max-w-xl mx-auto mt-8">

                        <p className="text-6xl">
                            🛒
                        </p>

                        <h2 className="text-xl font-bold mt-4">
                            Giỏ hàng trống
                        </h2>

                        <p className="text-sm mt-2">
                            Hiện không có sản phẩm nào trong giỏ hàng
                        </p>

                        <Link
                            to="/product"
                            className="tt-btn-primary mt-6 px-8 py-3 font-semibold"
                        >
                            Lướt xem sản phẩm
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
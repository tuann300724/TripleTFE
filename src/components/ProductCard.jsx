import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
    const isOutOfStock = product.status === 2;

    return (
        <article className={`group tt-card-interactive flex h-full flex-col overflow-hidden ${isOutOfStock ? "opacity-60" : ""}`}>

            {/* IMAGE */}
            <div className="relative aspect-square shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700/80">

                <img
                    src={`${product.thumbnail}`}
                    alt={product.productName}
                    className="tt-img-zoom h-full w-full object-cover"
                />

                {/* BADGE */}
                {isOutOfStock && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                        Hết hàng
                    </span>
                )}

                {/* STOCK BADGE */}
                {!isOutOfStock && (
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                        Còn {product.stock} sp
                    </span>
                )}
            </div>

            {/* INFO */}
            <div className="flex flex-1 flex-col p-5">
                <p className="tt-label text-xs">{product.categoryName}</p>

                <h3 className="mt-1 line-clamp-2 min-h-14 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
                    {product.productName}
                </h3>

                {/* PRICE */}
                <div className="mt-3 flex min-h-8 flex-wrap items-baseline gap-2">
                    {/* Giá lớn (Max Price) */}
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {product.maxPrice.toLocaleString("vi-VN")} đ
                    </span>

                    {/* Giá nhỏ hơn bên cạnh (Min Price) */}
                    <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                        {product.minPrice.toLocaleString("vi-VN")} đ
                    </span>
                </div>
                {/* BUTTON */}
                <Link
                    to={`/product/${product.productId}`}
                    className={`tt-btn-dark mt-auto w-full py-2.5 text-sm ${isOutOfStock ? "pointer-events-none opacity-50" : ""
                        }`}
                >
                    Xem chi tiết
                </Link>
            </div>
        </article>
    );
}
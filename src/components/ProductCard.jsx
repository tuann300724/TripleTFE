import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";

export default function ProductCard({ product }) {
    return (
        <article className="group tt-card-interactive flex h-full flex-col overflow-hidden">
            <div className="relative aspect-square shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700/80">
                <img
                    src={product.image}
                    alt={product.name}
                    className="tt-img-zoom h-full w-full object-cover"
                />
                {product.badge ? (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                        {product.badge}
                    </span>
                ) : (
                    <span className="invisible absolute left-3 top-3 px-3 py-1 text-xs" aria-hidden>
                        &nbsp;
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <p className="tt-label text-xs">{product.category}</p>
                <h3 className="mt-1 line-clamp-2 min-h-14 text-lg font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                    {product.name}
                </h3>
                <div className="mt-3 flex min-h-8 flex-wrap items-baseline gap-2">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(product.price)}
                    </span>
                    <span
                        className={`text-sm text-slate-400 line-through ${!product.oldPrice ? "invisible" : ""}`}
                    >
                        {product.oldPrice ? formatPrice(product.oldPrice) : "—"}
                    </span>
                </div>
                <Link to="/product" className="tt-btn-dark mt-auto w-full py-2.5 text-sm">
                    Xem chi tiết
                </Link>
            </div>
        </article>
    );
}

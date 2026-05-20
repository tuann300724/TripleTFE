import { useState } from "react";
import { Link } from "react-router-dom";
import { products, formatPrice } from "../data/products";

function CustomProductCard({ product }) {
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
                <Link to={`/product/${product.id}`} className="tt-btn-dark mt-auto w-full py-2.5 text-sm text-center">
                    Xem chi tiết
                </Link>
            </div>
        </article>
    );
}

const categories = ["Tất cả", "Vợt cầu lông", "Giày thể thao", "Phụ kiện", "Túi vợt", "Trang phục"];

export default function Product() {
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    const [search, setSearch] = useState("");

    const filtered = products.filter((p) => {
        const matchCategory = activeCategory === "Tất cả" || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div>
            <section className="tt-hero">
                <div className="mx-auto max-w-6xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                        Sản phẩm
                    </span>
                    <h1 className="mt-2 text-4xl font-bold md:text-5xl">Dụng cụ cầu lông chính hãng</h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-300">
                        Vợt, giày, quả cầu, túi vợt và trang phục từ các thương hiệu hàng đầu thế giới.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={`tt-chip ${
                                    activeCategory === cat ? "tt-chip-active" : "tt-chip-inactive"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <input
                        type="search"
                        placeholder="Tìm sản phẩm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="tt-input lg:max-w-xs"
                    />
                </div>

                <p className="tt-muted mt-8 text-sm">
                    Hiển thị {filtered.length} / {products.length} sản phẩm
                </p>

                {filtered.length > 0 ? (
                    <div className="mt-6 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((p) => (
                            <CustomProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="tt-card-interactive mt-16 p-12 text-center">
                        <p className="text-5xl transition-transform duration-300 hover:scale-110">🏸</p>
                        <p className="tt-body mt-4 text-lg">Không tìm thấy sản phẩm phù hợp.</p>
                    </div>
                )}
            </section>
        </div>
    );
}

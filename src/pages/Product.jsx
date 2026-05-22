import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/* CARD - GIỮ NGUYÊN TAILWIND */
function CustomProductCard({ product }) {
    const isOutOfStock = product.status === 2;
    return (
        <article className={`group tt-card-interactive flex h-full flex-col overflow-hidden ${isOutOfStock ? "opacity-60" : ""}`}>

            <div className="relative aspect-square shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700/80">

                <img
                    src={`${product.thumbnail}`}
                    alt={product.productName}
                    className="tt-img-zoom h-full w-full object-cover"
                />


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

            <div className="flex flex-1 flex-col p-5">

                <p className="tt-label text-xs">{product.categoryName}</p>

                <h3 className="mt-1 line-clamp-2 min-h-14 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {product.productName}
                </h3>

                <div className="mt-3 flex min-h-8 items-baseline gap-2">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {product.price.toLocaleString("vi-VN")} đ
                    </span>
                </div>

                <Link
                    to={`/product/${product.productId}`}
                    className="tt-btn-dark mt-auto w-full py-2.5 text-sm text-center"
                >
                    Xem chi tiết
                </Link>

            </div>
        </article>
    );
}

/* PAGE */

export default function Product() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    /* FETCH API */
    useEffect(() => {
        axios.get("https://localhost:7147/api/Products")
            .then(res => {

                const filtered = res.data.filter(p => p.status !== 3);
                setProducts(filtered);
            })
            .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        axios.get("https://localhost:7147/api/Categories")
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => console.log(err));
    }, []);
    const filtered = products.filter((p) => {

        const matchCategory =
            activeCategory === "Tất cả" ||
            p.categoryName === activeCategory;

        const matchSearch =
            p.productName.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });


    return (
        <div>

            {/* HERO (GIỮ NGUYÊN) */}
            <section className="tt-hero">
                <div className="mx-auto max-w-6xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                        Sản phẩm
                    </span>
                    <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                        Dụng cụ cầu lông chính hãng
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-300">
                        Vợt, giày, quả cầu, túi vợt và trang phục từ các thương hiệu hàng đầu thế giới.
                    </p>
                </div>
            </section>

            {/* FILTER (GIỮ NGUYÊN FORM CỦA BẠN) */}
            <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={() => setActiveCategory("Tất cả")}
                            className={`tt-chip ${activeCategory === "Tất cả"
                                ? "tt-chip-active"
                                : "tt-chip-inactive"
                                }`}
                        >
                            Tất cả
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.categoryId}
                                onClick={() => setActiveCategory(cat.categoryName)}
                                className={`tt-chip ${activeCategory === cat.categoryName
                                    ? "tt-chip-active"
                                    : "tt-chip-inactive"
                                    }`}
                            >
                                {cat.categoryName}
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

                {/* GRID */}
                {filtered.length > 0 ? (
                    <div className={`mt-6 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 `}>
                        {filtered.map((p) => (
                            <CustomProductCard
                                key={p.productId}
                                product={p}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="tt-card-interactive mt-16 p-12 text-center">
                        <p className="text-5xl hover:scale-110 transition">🏸</p>
                        <p className="tt-body mt-4 text-lg">
                            Không tìm thấy sản phẩm phù hợp.
                        </p>
                    </div>
                )}

            </section>
        </div>
    );
}
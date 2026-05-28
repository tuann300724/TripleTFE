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
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    // --- PHÂN TRANG STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Giới hạn hiển thị 10 sản phẩm mỗi trang

    /* FETCH API (Đã bỏ API Categories, gom cụm dữ liệu song song) */
    useEffect(() => {
        Promise.all([
            axios.get("https://localhost:7147/api/Products"),
            axios.get("https://localhost:7147/api/ProductVariants")
        ])
            .then(([productsRes, variantsRes]) => {
                const variants = variantsRes.data;
                const filtered = productsRes.data.filter(p => p.status === 1);
                
                // Tính tổng stock cho từng product
                const productsWithStock = filtered.map(product => {
                    const totalStock = variants
                        .filter(v => v.productId === product.productId)
                        .reduce((acc, v) => acc + v.stock, 0);
                    return { ...product, stock: totalStock };
                });
                setProducts(productsWithStock);
            })
            .catch(err => console.log(err));
    }, []);

    // --- TỰ ĐỘNG TRÍCH XUẤT DANH MỤC KHÔNG TRÙNG NHAU (FRONTEND ONLY) ---
    const categories = Array.from(
        new Set(products.map((p) => p.categoryName).filter(Boolean))
    );

    // --- LOGIC LỌC SẢN PHẨM ---
    const filtered = products.filter((p) => {
        const matchCategory =
            activeCategory === "Tất cả" ||
            p.categoryName === activeCategory;

        const matchSearch =
            p.productName.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    // --- XỬ LÝ CHIA DỮ LIỆU ĐỂ PHÂN TRANG ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // Mảng 10 sản phẩm thực tế sẽ render lên màn hình của trang hiện tại
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    // Reset trang về 1 khi người dùng gõ tìm kiếm hoặc đổi danh mục
    const handleCategoryChange = (categoryName) => {
        setActiveCategory(categoryName);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

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

            {/* FILTER & GRID */}
            <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryChange("Tất cả")}
                            className={`tt-chip ${activeCategory === "Tất cả" ? "tt-chip-active" : "tt-chip-inactive"}`}
                        >
                            Tất cả
                        </button>

                        {categories.map((catName) => (
                            <button
                                key={catName}
                                onClick={() => handleCategoryChange(catName)}
                                className={`tt-chip ${activeCategory === catName ? "tt-chip-active" : "tt-chip-inactive"}`}
                            >
                                {catName}
                            </button>
                        ))}
                    </div>

                    <input
                        type="search"
                        placeholder="Tìm sản phẩm..."
                        value={search}
                        onChange={handleSearchChange}
                        className="tt-input lg:max-w-xs"
                    />
                </div>

                <p className="tt-muted mt-8 text-sm">
                    Hiển thị {filtered.length > 0 ? indexOfFirstItem + 1 : 0} - {indexOfLastItem > filtered.length ? filtered.length : indexOfLastItem} trong tổng số {filtered.length} sản phẩm tìm thấy
                </p>

                {/* GRID (Thay đổi render từ filtered thành currentItems) */}
                {currentItems.length > 0 ? (
                    <div className="mt-6 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {currentItems.map((p) => (
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

                {/* --- THANH ĐIỀU HƯỚNG PHÂN TRANG --- */}
                {filtered.length > itemsPerPage && (
                    <div className="mt-12 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 dark:border-slate-800">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="inline-flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                            Trước
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                                        currentPage === page
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="inline-flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                            Sau
                        </button>
                    </div>
                )}

            </section>
        </div>
    );
}
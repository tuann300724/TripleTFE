import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

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
                            <ProductCard key={p.id} product={p} />
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

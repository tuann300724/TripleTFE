import { newsArticles } from "../data/news";
import NewsCard from "../components/NewsCard";

const categories = ["Tất cả", "Giải đấu", "Sản phẩm", "Kỹ thuật", "Tư vấn", "Tin tức", "Khuyến mãi"];

export default function News() {
    const featured = newsArticles.find((a) => a.featured);
    const rest = newsArticles.filter((a) => !a.featured);

    return (
        <div>
            <section className="tt-hero">
                <div className="mx-auto max-w-6xl">
                    <span className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                        Tin tức
                    </span>
                    <h1 className="mt-2 text-4xl font-bold md:text-5xl">Cập nhật thế giới cầu lông</h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-300">
                        Tin giải đấu, đánh giá sản phẩm, mẹo kỹ thuật và khuyến mãi mới nhất từ TripleT
                        Badminton.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat, i) => (
                        <button
                            key={cat}
                            type="button"
                            className={`tt-chip ${i === 0 ? "tt-chip-active" : "tt-chip-inactive"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {featured && (
                    <div className="mt-10">
                        <NewsCard article={featured} featured />
                    </div>
                )}

                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((article) => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
        </div>
    );
}

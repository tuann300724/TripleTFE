import { newsArticles } from "../data/news";
import NewsCard from "../components/NewsCard";
import { useNavigate } from "react-router-dom";

export default function News() {
    const navigate = useNavigate();
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

                {featured && (
                    <div className="mt-10">
                        <div onClick={() => navigate(`/news/${featured.id}`)} className="block cursor-pointer transition-transform hover:-translate-y-1">
                            <NewsCard article={featured} featured />
                        </div>
                    </div>
                )}

                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((article) => (
                        <div onClick={() => navigate(`/news/${article.id}`)} key={article.id} className="block cursor-pointer transition-transform hover:-translate-y-1">
                            <NewsCard article={article} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

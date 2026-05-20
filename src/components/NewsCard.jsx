import { Link } from "react-router-dom";

export default function NewsCard({ article, featured = false }) {
    if (featured) {
        return (
            <article className="group tt-card-interactive relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
                <img
                    src={article.image}
                    alt={article.title}
                    className="tt-img-zoom h-80 w-full object-cover opacity-70 group-hover:opacity-60 md:h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent transition-opacity duration-300 group-hover:via-slate-900/50" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                        {article.category}
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-emerald-300 md:text-3xl">
                        {article.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-slate-300">{article.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-slate-400">{article.date}</span>
                        <Link to="/news" className="tt-link text-sm">
                            Đọc thêm →
                        </Link>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className="group tt-card-interactive overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700/80">
                <img src={article.image} alt={article.title} className="tt-img-zoom h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur transition-transform duration-300 group-hover:scale-105 dark:bg-slate-900/80 dark:text-emerald-400">
                    {article.category}
                </span>
            </div>
            <div className="p-5">
                <time className="tt-muted text-xs">{article.date}</time>
                <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                    {article.title}
                </h3>
                <p className="tt-body mt-2 line-clamp-3 text-sm">{article.excerpt}</p>
                <Link to="/news" className="tt-link mt-4 inline-flex text-sm">
                    Đọc thêm →
                </Link>
            </div>
        </article>
    );
}

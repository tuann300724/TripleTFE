import NewsCard from "../components/NewsCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function News() {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm định dạng ngày tháng sang kiểu Việt Nam (DD/MM/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    // Hàm cắt ngắn nội dung bài viết làm đoạn trích (Excerpt)
    const getExcerpt = (text, maxLength = 100) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    useEffect(() => {
        // Gọi API lấy toàn bộ danh sách tin tức
        fetch("https://localhost:7147/api/News")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Không thể lấy dữ liệu từ server");
                }
                return res.json();
            })
            .then((data) => {
                // Sắp xếp bài viết mới nhất lên đầu (nếu Backend chưa sắp xếp)
                const sortedNews = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setNews(sortedNews);
            })
            .catch((err) => console.error("Lỗi khi fetch API News: ", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-lg font-medium text-slate-400 animate-pulse">
                    Đang tải tin tức...
                </div>
            </div>
        );
    }

    // Phân tách bài viết nổi bật (Mới nhất) và các bài viết còn lại
    const featured = news.length > 0 ? news[0] : null;
    const rest = news.length > 1 ? news.slice(1) : [];

    return (
        <div>
            {/* Hero Section */}
            <section className="tt-hero bg-slate-900 text-white py-16 px-6 md:px-12">
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

            {/* Thân trang hiển thị danh sách tin tức */}
            <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
                {news.length === 0 ? (
                    <div className="text-center text-slate-400 py-10">
                        Hiện chưa có bài viết nào được đăng tải.
                    </div>
                ) : (
                    <>
                        {/* Bài viết nổi bật (Featured Card) */}
                        {featured && (
                            <div className="mt-10">
                                <div
                                    onClick={() => navigate(`/news/${featured.newsId}`)}
                                    className="block cursor-pointer transition-transform hover:-translate-y-1"
                                >
                                    <NewsCard
                                        article={{
                                            id: featured.newsId,
                                            title: featured.title,
                                            // excerpt: getExcerpt(featured.content, 180), // Cắt ngắn đoạn trích cho bài lớn
                                            image: featured.thumbnail || "https://via.placeholder.com/800x400", // Thêm ảnh fallback nếu trống
                                            date: formatDate(featured.createdDate), // Định dạng ngày lại cho đẹp
                                            category: "Tin tức"
                                        }}
                                        featured
                                    />
                                </div>
                            </div>
                        )}

                        {/* Danh sách các bài viết còn lại (Grid Cards) */}
                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {rest.map((article) => (
                                <div
                                    onClick={() => navigate(`/news/${article.newsId}`)}
                                    key={article.newsId}
                                    className="block cursor-pointer transition-transform hover:-translate-y-1"
                                >
                                    <NewsCard
                                        article={{
                                            id: article.newsId,
                                            title: article.title,
                                            // excerpt: getExcerpt(article.content, 90), // Đoạn trích ngắn hơn cho bài nhỏ
                                            image: article.thumbnail || "https://via.placeholder.com/400x250",
                                            date: formatDate(article.createdDate),
                                            category: "Tin tức"
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
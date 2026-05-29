import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NewsDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm định dạng ngày tháng sang kiểu Việt Nam (DD/MM/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    useEffect(() => {
        // Gọi API lấy chi tiết tin tức theo ID
        fetch(`https://localhost:7147/api/News/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Không tìm thấy bài viết");
                return res.json();
            })
            .then((data) => setArticle(data))
            .catch((err) => {
                console.error("Lỗi khi fetch chi tiết bài viết:", err);
                setArticle(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-base sm:text-lg font-medium text-slate-400 animate-pulse">
                    Đang tải nội dung bài viết...
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 sm:px-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">Không tìm thấy bài viết</h1>
                <p className="text-slate-500 mt-2 text-center text-sm sm:text-base">Bài viết này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
                <Link to="/news" className="mt-6 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-md">
                    Quay lại trang tin tức
                </Link>
            </div>
        );
    }

    return (
        <article className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-12 md:px-12 w-full overflow-hidden">
            {/* Nút quay lại */}
            <Link to="/news" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-emerald-500 transition-colors mb-6 sm:mb-8 group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:-translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Quay lại danh sách
            </Link>

            {/* Tiêu đề & Thông tin bài viết */}
            <header className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                    <span className="font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 sm:py-1 rounded-full">Tin tức</span>
                    <span>{formatDate(article.createdDate)}</span>
                    {article.user && (
                        <>
                            <span>•</span>
                            <span className="break-all">Tác giả: <strong>{article.user.fullName || article.user.userName}</strong></span>
                        </>
                    )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold md:text-5xl mb-4 sm:mb-6 leading-tight text-slate-900 dark:text-white break-words">
                    {article.title}
                </h1>
            </header>

            {/* Ảnh Thumbnail lớn */}
            <div className="mb-6 sm:mb-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg">
                <img
                    src={article.thumbnail || "https://via.placeholder.com/1200x600"}
                    alt={article.title}
                    className="w-full h-[220px] sm:h-[380px] md:h-[500px] object-cover transition-transform duration-500 hover:scale-[1.01]"
                />
            </div>

            {/* Khung nội dung chi tiết bài viết (Đã sửa lỗi bể chữ & responsive) */}
            <div className="prose prose-sm sm:prose-base md:prose-lg prose-slate dark:prose-invert max-w-none mt-6 sm:mt-8">
                <div
                    className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 text-justify break-words [word-break:break-word] hyphens-auto news-content-html"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </div>
        </article>
    );
}
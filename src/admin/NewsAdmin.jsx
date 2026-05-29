import { Newspaper } from "lucide-react"; 

 
import AdminSidebar from "./components/AdminSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewsAdmin() {
    const columns = ["Hình ảnh", "Tiêu đề", "Ngày đăng", "Thao tác"];
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    // Hàm biến chuỗi HTML thành chữ thuần và giới hạn độ dài
    const getPlainTextPreview = (htmlString, maxLength = 80) => {
        if (!htmlString) return "";
        // Loại bỏ các thẻ HTML như <p>, <img>, <strong>...
        const plainText = htmlString.replace(/<\/?[^>]+(>|$)/g, " ");
        
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength).trim() + "...";
    };

    const fetchNews = async () => {
        try {
            const response = await fetch("https://localhost:7147/api/News");
            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu tin tức từ server");
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setNewsList(sortedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (news) => {
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${news.title}" không?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://localhost:7147/api/News/${news.newsId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Không thể xóa bài viết này. Vui lòng kiểm tra lại hệ thống!");
            }

            alert("Xóa bài viết thành công!");
            fetchNews();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 min-w-0"> {/* Thêm min-w-0 để tránh flex con bị tràn */}
                <div className="p-6">
                    {/* Hero section */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <Newspaper className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý tin tức</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Bài viết, tin khuyến mãi & đánh giá sản phẩm</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => navigate("/admin/news/add")}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 whitespace-nowrap"
                            >
                                Thêm bài viết
                            </button>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Danh sách bài viết</h2>
                        <div className="overflow-x-auto JSON-table-scroll">
                            <table className="min-w-full table-fixed divide-y divide-slate-200 dark:divide-slate-700">
                                <thead>
                                    <tr>
                                        <th className="w-28 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Hình ảnh</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Tiêu đề & Nội dung</th>
                                        <th className="w-32 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Ngày đăng</th>
                                        <th className="w-28 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">Đang tải danh sách bài viết...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-red-500 font-medium">{error}</td>
                                        </tr>
                                    ) : newsList.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">Chưa có bài viết nào được đăng tải.</td>
                                        </tr>
                                    ) : (
                                        newsList.map((news) => (
                                            <tr key={news.newsId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                                {/* Cột hình ảnh */}
                                                <td className="px-4 py-3 align-middle">
                                                    <img
                                                        src={news.thumbnail || "https://via.placeholder.com/80x50"}
                                                        alt={news.title}
                                                        className="h-12 w-20 rounded-lg object-cover shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0"
                                                    />
                                                </td>

                                                {/* Cột tiêu đề & nội dung đã làm gọn sạch sẽ */}
                                                <td className="px-4 py-3 text-sm align-middle">
                                                    <div className="font-semibold text-slate-900 dark:text-white truncate max-w-lg mb-1" title={news.title}>
                                                        {news.title}
                                                    </div>
                                                    {/* Chỉ hiển thị text thuần rút gọn, không có hình ảnh bị lọt vào đây nữa */}
                                                    <div className="text-slate-400 dark:text-slate-500 text-xs line-clamp-1 max-w-lg break-all">
                                                        {getPlainTextPreview(news.content)}
                                                    </div>
                                                </td>

                                                {/* Cột ngày đăng */}
                                                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 align-middle whitespace-nowrap">
                                                    {formatDate(news.createdDate)}
                                                </td>

                                                {/* Cột thao tác */}
                                                <td className="px-4 py-3 text-sm align-middle">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/news/edit/${news.newsId}`)}
                                                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(news)}
                                                            className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/80"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
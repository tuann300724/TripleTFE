import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import NewsCard from "../components/NewsCard";
import axios from "axios";
import { useEffect, useState } from "react";

const features = [
    { icon: "🏸", title: "Chính hãng 100%", desc: "Vợt, giày, phụ kiện từ Yonex, Victor, Li-Ning" },
    { icon: "🚚", title: "Giao hàng nhanh", desc: "Miễn phí ship đơn từ 500.000đ toàn quốc" },
    { icon: "🔧", title: "Bảo hành uy tín", desc: "Hỗ trợ căng vợt, đổi size trong 7 ngày" },
    { icon: "💬", title: "Tư vấn chuyên sâu", desc: "Đội ngũ VĐV & HLV tư vấn chọn đồ phù hợp" },
];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [news, setNews] = useState([]); // Khai báo State để lưu danh sách tin tức

    // Hàm định dạng ngày tháng (DD/MM/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    // Hàm cắt ngắn nội dung bài viết
    const getExcerpt = (text, maxLength = 90) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    useEffect(() => {
        // Gộp chung API lấy Sản phẩm và Tin tức bằng Promise.all
        Promise.all([
            axios.get("https://localhost:7147/api/Products"),
            axios.get("https://localhost:7147/api/ProductVariants"),
            axios.get("https://localhost:7147/api/News") // Gọi thêm API News
        ])
            .then(([productsRes, variantsRes, newsRes]) => {
                // 1. Xử lý logic sản phẩm
                const variants = variantsRes.data;
                const filteredProducts = productsRes.data.filter(p => p.status === 1);
                
                const productsWithStock = filteredProducts.map(product => {
                    const totalStock = variants
                        .filter(v => v.productId === product.productId)
                        .reduce((acc, v) => acc + v.stock, 0);
                    return { ...product, stock: totalStock };
                });
                
                setProducts(productsWithStock.slice(0, 4));

                // 2. Xử lý logic tin tức (Lấy 3 bài viết mới nhất)
                const sortedNews = newsRes.data.sort(
                    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                );
                setNews(sortedNews.slice(0, 3)); // Chỉ lấy tối đa 3 bài viết hiển thị ở trang chủ
            })
            .catch(err => console.log("Lỗi tải dữ liệu trang chủ:", err));
    }, []);

    return (
        <div>
            {/* HERO SECTION */}
            <section className="tt-hero relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
                    <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-lime-400 blur-3xl" />
                </div>
                <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:py-28">
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/20">
                            Mùa giải mới — Giảm đến 30%
                        </span>
                        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                            Chinh phục{" "}
                            <span className="block bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">
                                mọi cú smash
                            </span>
                        </h1>
                        <p className="mt-6 max-w-lg text-lg text-slate-300">
                            TripleT Badminton — cửa hàng cầu lông chuyên nghiệp với đầy đủ vợt, giày, trang phục
                            và phụ kiện cho mọi trình độ.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                            <Link to="/product" className="tt-btn-primary px-8 py-3.5 shadow-lg shadow-emerald-500/30">
                                Mua sắm ngay
                            </Link>
                            <Link to="/about" className="tt-btn-ghost px-8 py-3.5">
                                Tìm hiểu thêm
                            </Link>
                        </div>
                    </div>
                    <div className="relative flex-1">
                        <div className="group relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl shadow-2xl ring-4 ring-emerald-500/30 transition-all duration-300 hover:ring-emerald-400/50 hover:shadow-emerald-500/20">
                            <img
                                src="https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA"
                                alt="Vận động viên cầu lông"
                                className="tt-img-zoom h-full w-full object-cover"
                            />
                        </div>
                        <div className="tt-card-interactive absolute -bottom-4 -left-4 p-4 md:-left-8">
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">500+</p>
                            <p className="tt-muted text-sm">Sản phẩm chính hãng</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f) => (
                        <div key={f.title} className="tt-card-interactive p-6 text-center">
                            <span className="inline-block text-4xl transition-transform duration-300 group-hover:scale-110">
                                {f.icon}
                            </span>
                            <h3 className="mt-3 font-semibold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                {f.title}
                            </h3>
                            <p className="tt-body mt-1 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED PRODUCTS SECTION */}
            <section className="tt-section-alt py-16">
                <div className="mx-auto max-w-6xl px-6 md:px-12">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <span className="tt-label">Sản phẩm nổi bật</span>
                            <h2 className="tt-title mt-1">Được yêu thích nhất</h2>
                        </div>
                        <Link to="/product" className="tt-link">
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="mt-10 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((p) => (
                            <ProductCard key={p.productId} product={p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWSLETTER SECTION */}
            <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
                <div className="group overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-10 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 md:p-14">
                    <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                        <div>
                            <h2 className="text-3xl font-bold">Đăng ký nhận ưu đãi 10%</h2>
                            <p className="mt-2 text-emerald-100">Cho đơn hàng đầu tiên và cập nhật tin khuyến mãi hàng tuần.</p>
                        </div>
                        <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="tt-hover-lift flex-1 rounded-xl border-0 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-white/50"
                            />
                            <button type="submit" className="tt-btn-dark whitespace-nowrap">
                                Đăng ký
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* LATEST NEWS SECTION */}
            <section className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <span className="tt-label">Tin tức</span>
                        <h2 className="tt-title mt-1">Bài viết mới nhất</h2>
                    </div>
                    <Link to="/news" className="tt-link">
                        Xem tất cả →
                    </Link>
                </div>

                {/* Đổ data bài viết ở đây */}
                {news.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 mt-6">
                        Chưa có bài viết mới.
                    </div>
                ) : (
                    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {news.map((article) => (
                            <Link 
                                to={`/news/${article.newsId}`} 
                                key={article.newsId} 
                                className="block transition-transform hover:-translate-y-1"
                            >
                                <NewsCard 
                                    article={{
                                        id: article.newsId,
                                        title: article.title,
                                        excerpt: getExcerpt(article.content, 90),
                                        image: article.thumbnail || "https://via.placeholder.com/400x250",
                                        date: formatDate(article.createdDate),
                                        category: "Tin tức"
                                    }} 
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
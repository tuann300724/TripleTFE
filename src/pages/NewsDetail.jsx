import { useParams, Link } from "react-router-dom";
import { newsArticles } from "../data/news";

export default function NewsDetail() {
    const { id } = useParams();
    const article = newsArticles.find((a) => a.id === parseInt(id));

    if (!article) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
                <Link to="/news" className="mt-4 text-emerald-500 hover:underline">Quay lại trang tin tức</Link>
            </div>
        );
    }

    return (
        <article className="mx-auto max-w-4xl px-6 py-12 md:px-12">
            <Link to="/news" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-500 transition-colors mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Quay lại danh sách
            </Link>

            <header className="mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                    <span className="font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">{article.category}</span>
                    <span>{article.date}</span>
                </div>
                <h1 className="text-3xl font-bold md:text-5xl mb-4 leading-tight">{article.title}</h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">{article.excerpt}</p>
            </header>

            <img
                src={article.image}
                alt={article.title}
                className="w-full h-[400px] md:h-[600px] object-cover rounded-3xl mb-12 shadow-lg"
            />

            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p>Đây là nội dung chi tiết của bài viết. Vì dữ liệu mẫu chỉ có đoạn trích ngắn, nên phần này là văn bản giả (placeholder) để hiển thị cấu trúc trang tin tức chi tiết.</p>
                <p>Bộ môn cầu lông đòi hỏi sức bền, sự nhanh nhẹn và phản xạ nhạy bén. Để đạt được phong độ tốt nhất, người chơi cần trang bị những kiến thức về kỹ thuật, chọn mua đúng sản phẩm phù hợp với bản thân cũng như cập nhật những thông tin mới nhất về thế giới cầu lông.</p>
                <h3 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Tại sao cần lựa chọn đúng sản phẩm?</h3>
                <p>Một cây vợt tốt không chỉ giúp người chơi phát huy tối đa sức mạnh, mà còn tránh được những chấn thương không đáng có. Các thương hiệu lớn luôn không ngừng cải tiến công nghệ để mang lại những trải nghiệm tốt nhất trên sân.</p>
                <h3 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">Tin tức và giải đấu</h3>
                <p>Cập nhật thông tin về các giải đấu giúp người hâm mộ và vận động viên nắm bắt được những xu hướng mới, học hỏi từ các tay vợt hàng đầu và luôn giữ được ngọn lửa đam mê với bộ môn này.</p>
            </div>
        </article>
    );
}

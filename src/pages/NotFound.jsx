import { Link } from "react-router-dom";
import { FadeIn } from "../components/Animate";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0c1219] px-4 py-16 transition-colors duration-300">
            <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-400/20 dark:bg-emerald-600/30 blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-lime-400/15 dark:bg-lime-500/20 blur-3xl" />

            <FadeIn>
                <div className="relative text-center max-w-md">
                    <div className="text-9xl font-extrabold text-emerald-500/20 dark:text-emerald-400/10 select-none">
                        404
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white -mt-6">
                        Trang không tìm thấy
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    </p>
                    <Link
                        to="/"
                        className="tt-btn-primary inline-flex mt-8 px-8 py-3 shadow-lg shadow-emerald-500/20"
                    >
                        Quay lại trang chủ
                    </Link>
                </div>
            </FadeIn>
        </div>
    );
}

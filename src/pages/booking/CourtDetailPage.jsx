import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    MapPin, Clock, Phone, Star, ArrowLeft,
    CheckCircle2, ChevronRight, Wifi, ShowerHead,
    Coffee, Car, Lightbulb, Users, Trophy, Sparkles, XCircle,
    Eye, ThumbsUp, MessageSquare
} from "lucide-react";
import { branchesData } from "./bookingData";
import { useTheme } from "../../context/ThemeContext";

const amenityIcon = (name) => {
    if (name.includes("WiFi")) return <Wifi size={14} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("tắm") || name.includes("sinh")) return <ShowerHead size={14} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("Căng") || name.includes("Shop") || name.includes("tin")) return <Coffee size={14} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("xe")) return <Car size={14} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("sáng") || name.includes("đèn")) return <Lightbulb size={14} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("Khán") || name.includes("đài")) return <Users size={14} className="text-emerald-500 dark:text-emerald-400" />;
    return <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400" />;
};

export default function CourtDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const branch = branchesData.find(b => b.id === id);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [likedComments, setLikedComments] = useState({});

    if (!branch) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50 text-slate-800 dark:bg-[#0c1219] dark:text-white">
                <XCircle size={48} className="text-rose-500 animate-bounce" />
                <h1 className="text-xl font-bold">Không tìm thấy chi nhánh sân</h1>
                <Link to="/booking"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
                    <ArrowLeft size={16} /> Quay lại danh sách bản đồ
                </Link>
            </div>
        );
    }

    const handleLikeComment = (commentId) => {
        setLikedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    return (
        <div className="bg-slate-50 text-slate-800 dark:bg-[#08101a] min-h-screen dark:text-slate-100 pb-20 font-sans">
            {/* ══ BANNER HERO ══ */}
            <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden group">
                <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 dark:via-[#08101a]/70 to-slate-50 dark:to-[#08101a]" />

                {/* back button */}
                <Link to="/booking" className="absolute top-[18px] left-[18px] z-10 flex items-center gap-1.5 bg-black/50 hover:bg-black/75 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold transition-all border border-white/10 shadow-lg active:scale-95">
                    <ArrowLeft size={14} /> Quay lại Bản đồ
                </Link>

                {/* badge */}
                <span className="absolute top-[18px] right-[18px] z-10 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-sm">
                    TRIPLE T BADMINTON
                </span>
            </div>

            {/* ══ CONTAINER CHÍNH ══ */}
            <div className="max-w-[1100px] mx-auto px-4 -mt-24 relative z-20">
                {/* ── TIÊU ĐỀ CHI NHÁNH ── */}
                <div className="mb-8">
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-extrabold leading-snug drop-shadow-md">
                        {branch.name}
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs md:text-sm flex items-center gap-2 leading-relaxed font-semibold">
                        <MapPin size={16} className="text-rose-500 shrink-0" />
                        <span>{branch.address}</span>
                    </p>
                </div>

                {/* ── CẤU TRÚC HAI CỘT ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CỘT TRÁI & GIỮA: Thông tin chi tiết */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* 🌟 1. GIỚI THIỆU & TIỆN ÍCH */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-[#0d1627] dark:border-white/5 shadow-md flex flex-col gap-6">
                            <div>
                                <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-wide flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                                    <Trophy size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    Giới thiệu chi nhánh
                                </h2>
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mt-4 m-0 font-medium">
                                    {branch.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                                    Tiện ích có sẵn tại cơ sở:
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {(branch.amenities || []).map((a, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-150/80 rounded-xl py-2.5 px-4 text-emerald-700 dark:bg-[#08101a] dark:border-white/5 dark:text-emerald-300 text-xs font-semibold shadow-sm">
                                            {amenityIcon(a)}
                                            <span className="truncate">{a}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 📸 2. THƯ VIỆN HÌNH ẢNH */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-[#0d1627] dark:border-white/5 shadow-md">
                            <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-wide flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3 mb-5">
                                <Eye size={18} className="text-emerald-600 dark:text-emerald-400" />
                                Hình ảnh thực tế
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {(branch.gallery || []).map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setLightboxImage(imgUrl)}
                                        className="relative rounded-xl overflow-hidden aspect-video bg-slate-150 border border-slate-200 dark:bg-[#08101a] dark:border-white/5 cursor-zoom-in group shadow-md hover:border-emerald-500/40 transition-all duration-300"
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`${branch.name} gallery ${idx + 1}`}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                            <span className="bg-emerald-500/90 text-slate-900 rounded-full p-2 shadow-lg">
                                                <Eye size={16} className="stroke-[3]" />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ⭐ 3. ĐÁNH GIÁ & BÌNH LUẬN */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-[#0d1627] dark:border-white/5 shadow-md">
                            <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-wide flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3 mb-6">
                                <MessageSquare size={18} className="text-emerald-600 dark:text-emerald-400" />
                                Đánh giá của khách hàng
                            </h2>

                            {/* Tóm tắt điểm đánh giá */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 border border-slate-150/80 rounded-2xl p-6 mb-8 dark:bg-[#08101a] dark:border-white/5">
                                <div className="text-center sm:border-r sm:border-slate-200 dark:sm:border-white/10 sm:pr-8 flex flex-col items-center">
                                    <span className="text-slate-900 dark:text-white text-5xl font-black">{branch.rating}</span>
                                    <div className="flex items-center gap-1 my-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < Math.floor(branch.rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-700"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Tỉ lệ hài lòng 98%</span>
                                </div>

                                <div className="flex-1 w-full flex flex-col gap-2">
                                    {[
                                        { star: 5, pct: "85%" },
                                        { star: 4, pct: "12%" },
                                        { star: 3, pct: "3%" },
                                        { star: 2, pct: "0%" },
                                        { star: 1, pct: "0%" }
                                    ].map((row) => (
                                        <div key={row.star} className="flex items-center gap-3 text-xs">
                                            <span className="text-slate-500 dark:text-slate-400 font-bold w-3">{row.star}★</span>
                                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: row.pct }} />
                                            </div>
                                            <span className="text-slate-500 dark:text-slate-400 font-bold w-8 text-right">{row.pct}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Danh sách bình luận */}
                            <div className="flex flex-col gap-5">
                                {(branch.comments || []).map((cmt) => (
                                    <div key={cmt.id} className="border-b border-slate-100 dark:border-white/5 pb-5 last:border-0 last:pb-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={cmt.avatar}
                                                    alt={cmt.user}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10"
                                                />
                                                <div>
                                                    <h4 className="text-slate-900 dark:text-white text-xs font-extrabold m-0 leading-tight">
                                                        {cmt.user}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <div className="flex gap-0.5">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={10}
                                                                    className={i < Math.floor(cmt.rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-700"}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{cmt.date}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleLikeComment(cmt.id)}
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                                    likedComments[cmt.id]
                                                        ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-600 dark:text-emerald-400"
                                                        : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10"
                                                }`}
                                            >
                                                <ThumbsUp size={10} />
                                                <span>Hữu ích {likedComments[cmt.id] ? "(1)" : ""}</span>
                                            </button>
                                        </div>
                                        <p className="mt-3 text-slate-755 dark:text-slate-300 text-xs leading-relaxed pl-13 font-medium m-0">
                                            {cmt.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: Widget đặt sân sticky */}
                    <div className="w-full flex flex-col gap-6 font-sans">
                        <div className="bg-white border border-slate-200 dark:bg-[#0d1627] dark:border-emerald-500/20 rounded-2xl p-6 shadow-md flex flex-col gap-5 lg:sticky lg:top-6">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-3.5">
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Trạng thái sân</span>
                                <span className="text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 text-[10px] font-black px-2.5 py-1 rounded-full">
                                    Hoạt động
                                </span>
                            </div>

                            <div className="flex flex-col gap-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-150 flex items-center justify-center shrink-0 dark:bg-blue-500/10 dark:border-blue-500/20">
                                        <Clock size={15} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="m-0 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">Giờ hoạt động</p>
                                        <p className="m-0 mt-0.5 text-xs text-slate-800 dark:text-white font-extrabold">{branch.openTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-150 flex items-center justify-center shrink-0 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                                        <Sparkles size={15} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="m-0 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">Mức giá tham khảo</p>
                                        <p className="m-0 mt-0.5 text-xs text-amber-600 dark:text-amber-400 font-extrabold">{branch.priceRange}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-150 flex items-center justify-center shrink-0 dark:bg-purple-500/10 dark:border-purple-500/20">
                                        <Phone size={15} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="m-0 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">Số điện thoại liên hệ</p>
                                        <p className="m-0 mt-0.5 text-xs text-slate-800 dark:text-white font-extrabold">{branch.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex items-center gap-3 mt-1 dark:bg-[#08101a] dark:border-white/5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-[#00f5a0] shrink-0 dark:animate-pulse dark:shadow-[0_0_8px_#00f5a0]" />
                                <span className="text-emerald-700 dark:text-[#00f5a0] text-xs font-black">
                                    Còn {branch.freeCourts} sân trống hôm nay!
                                </span>
                            </div>

                            <button
                                onClick={() => navigate(`/booking/${branch.id}/book`)}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 dark:text-slate-950 font-black text-xs rounded-xl tracking-wider shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2 uppercase border-0 font-sans"
                            >
                                ⚡ Đặt lịch chơi ngay <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ LIGHTBOX OVERLAY ══ */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white font-extrabold w-10 h-10 rounded-full flex items-center justify-center transition-colors text-lg"
                    >
                        ✕
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Court full preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-[zoomIn_0.3s_cubic-bezier(.34,1.56,.64,1)_both]"
                    />
                </div>
            )}
        </div>
    );
}

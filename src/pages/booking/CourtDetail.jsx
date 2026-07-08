import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    MapPin, Clock, Phone, Star, ArrowLeft, Calendar,
    CheckCircle2, ChevronRight, Layers, Wifi, ShowerHead,
    Coffee, Car, Lightbulb, Users, Trophy, Sparkles, XCircle,
    User, Mail, FileText, CreditCard, ChevronLeft, Eye
} from "lucide-react";
import { 
    branchesData, 
    mockedBookedSlots, 
    timeSlots 
} from "./bookingData";
import { useTheme } from "../../context/ThemeContext";

const amenityIcon = (name) => {
    if (name.includes("WiFi"))   return <Wifi size={13} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("tắm") || name.includes("sinh")) return <ShowerHead size={13} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("Căng") || name.includes("Shop")) return <Coffee size={13} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("xe"))     return <Car size={13} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("sáng") || name.includes("đèn")) return <Lightbulb size={13} className="text-emerald-500 dark:text-emerald-400" />;
    if (name.includes("Khán"))   return <Users size={13} className="text-emerald-500 dark:text-emerald-400" />;
    return <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400" />;
};

export default function CourtDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const branch = branchesData.find(b => b.id === id);

    const [selectedDate, setSelectedDate]   = useState(() => new Date().toISOString().split("T")[0]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [activeTab, setActiveTab]         = useState("booking");
    const [lightboxImage, setLightboxImage] = useState(null);

    // Form inputs state
    const [customerName, setCustomerName] = useState("Nguyễn Văn A");
    const [customerPhone, setCustomerPhone] = useState("0901234567");
    const [customerEmail, setCustomerEmail] = useState("nva@gmail.com");
    const [customerNotes, setCustomerNotes] = useState("Cần thuê thêm 2 đôi giày size 41.");
    const [paymentMethod, setPaymentMethod] = useState("momo");

    useEffect(() => { 
        setSelectedCells([]); 
    }, [selectedDate]);

    if (!branch) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50 text-slate-800 dark:bg-[#0c1219] dark:text-white">
                <XCircle size={48} className="text-rose-500 animate-bounce" />
                <h1 className="text-xl font-bold">Không tìm thấy chi nhánh sân</h1>
                <Link to="/booking"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
                    <ArrowLeft size={16}/> Quay lại danh sách bản đồ
                </Link>
            </div>
        );
    }

    const handleCellClick = (courtId, time) => {
        if (mockedBookedSlots[courtId]?.includes(time)) return;
        setSelectedCells(prev => {
            const exists = prev.find(c => c.courtId === courtId && c.time === time);
            return exists
                ? prev.filter(c => !(c.courtId === courtId && c.time === time))
                : [...prev, { courtId, time }];
        });
    };

    const totalMoney  = selectedCells.reduce((acc, cell) => {
        const court = branch.courts.find(c => c.id === cell.courtId);
        return acc + (court?.pricePerSlot ?? 0);
    }, 0);
    const totalMins   = selectedCells.length * 30;
    const timeStr     = totalMins >= 60
        ? `${Math.floor(totalMins/60)}h${totalMins%60>0 ? totalMins%60+"m":""}`
        : totalMins > 0 ? `${totalMins} phút` : "—";

    const handleConfirm = () => {
        if (!selectedCells.length) return;
        setActiveTab("form");
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setBookingSuccess(true);
        setSelectedCells([]);
        setTimeout(() => setBookingSuccess(false), 4500);
    };

    return (
        <div className="bg-slate-50 text-slate-800 dark:bg-[#08101a] min-h-screen dark:text-slate-100 pb-20 font-sans">
            {/* ══ BANNER HERO ══ */}
            <div className="relative w-full h-[280px] overflow-hidden group">
                <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#08101a]/80 to-[#08101a]" />

                {/* back button */}
                <Link to={`/booking/${branch.id}`} className="absolute top-[18px] left-[18px] z-10 flex items-center gap-1.5 bg-black/45 hover:bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-white/10 shadow-lg active:scale-95">
                    <ArrowLeft size={13}/> Quay lại
                </Link>

                {/* badge */}
                <span className="absolute top-[18px] right-[18px] z-10 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase shadow-sm shadow-emerald-500/10">
                    TripleT Court
                </span>
            </div>

            {/* ══ CONTAINER CHÍNH ══ */}
            <div className="max-w-[1000px] mx-auto px-4 -mt-20 relative z-20">
                {/* ── TIÊU ĐỀ CHI NHÁNH ── */}
                <div className="mb-6 animate-fade-in-up">
                    <h1 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-extrabold leading-snug drop-shadow-md">
                        {branch.name}
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs md:text-sm flex items-center gap-1.5 leading-relaxed">
                        <MapPin size={14} className="text-rose-500 shrink-0"/> 
                        <span>{branch.address}</span>
                    </p>
                </div>

                {/* ── THÔNG TIN CHI TIẾT TỔNG QUAN ── */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                    {[
                        { icon: <Trophy size={14} className="text-amber-550 dark:text-amber-400" />, text: `${branch.rating} ★`, bg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/15 dark:border-amber-500/20 text-amber-700 dark:text-amber-200" },
                        { icon: <Clock size={14} className="text-blue-500 dark:text-blue-400" />, text: branch.openTime, bg: "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/15 dark:border-blue-500/20 text-blue-700 dark:text-blue-200" },
                        { icon: <Sparkles size={14} className="text-emerald-500 dark:text-emerald-400" />, text: branch.priceRange, bg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/15 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-200" },
                        { icon: <Phone size={14} className="text-purple-500 dark:text-purple-400" />, text: branch.phone, bg: "bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/15 dark:border-purple-500/20 text-purple-700 dark:text-purple-200" },
                    ].map((b, i) => (
                        <div key={i} className={`flex items-center justify-center gap-2 border rounded-xl py-2 px-3 ${b.bg} text-xs font-bold shadow-sm`}>
                            {b.icon}
                            <span>{b.text}</span>
                        </div>
                    ))}
                    <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 border bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500/20 dark:border-emerald-500/30 rounded-xl py-2 px-3 text-emerald-700 dark:text-[#00f5a0] text-xs font-black shadow-sm">
                        <CheckCircle2 size={14} className="text-emerald-500 dark:text-[#00f5a0] shrink-0" />
                        <span>Còn {branch.freeCourts} sân trống</span>
                    </div>
                </div>

                {/* ── THANH NAV TABS ── */}
                <div className="flex gap-1 bg-slate-200/50 border border-slate-250 dark:bg-white/5 dark:border-white/5 rounded-2xl p-1.5 mb-8 w-fit overflow-x-auto">
                    {[
                        { key: "booking", label: "🏸 Đặt lịch ngay" },
                        { key: "form", label: "📋 Thông tin người đặt" },
                        { key: "gallery", label: "📸 Hình ảnh thực tế" },
                        { key: "info", label: "ℹ️ Tiện ích & Sân con" }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                activeTab === tab.key
                                    ? "bg-[#059669] dark:bg-emerald-600 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-300/30 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ══════════════ TAB: ĐẶT LỊCH ══════════════ */}
                {activeTab === "booking" && (
                    <div className="animate-[fadeUp_0.3s_ease_both]">
                        {/* Chú thích màu sắc & Chọn ngày */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-5">
                                {[
                                    { color: "bg-white border-slate-200 dark:bg-white/5 dark:border-white/15", label: "Trống" },
                                    { color: "bg-rose-500/70 border-0", label: "Đã đặt" },
                                    { color: "bg-emerald-500 shadow-inner border-0", label: "Đang chọn" }
                                ].map((l, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className={`block w-4 h-4 rounded border ${l.color}`} />
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">{l.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wide">Chọn ngày thi đấu:</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={e => setSelectedDate(e.target.value)}
                                    className="bg-white border border-slate-200 dark:bg-[#0d1627] dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white outline-none cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Lưới chọn slot giờ */}
                        <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-[#0b1422] shadow-md dark:shadow-xl">
                            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                                <table className="border-collapse table-fixed min-w-max w-full">
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 z-20 w-[140px] bg-slate-50 border-r border-slate-200 border-b border-slate-200 dark:bg-[#0d1627] dark:border-r-white/10 dark:border-b-white/5 p-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                Sân / Giờ
                                            </th>
                                            {timeSlots.map(t => (
                                                <th key={t} className="w-11 bg-slate-50/80 border-r border-slate-200/50 border-b border-slate-200/50 dark:bg-[#0c1525] dark:border-r-white/5 dark:border-b-white/5 py-2.5 text-center text-[9px] font-black text-slate-500">
                                                    {t}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {branch.courts.map((court, ri) => (
                                            <tr key={court.id} className={ri % 2 === 0 ? "bg-white dark:bg-[#0b1422]" : "bg-slate-50/30 dark:bg-[#0c1525]"}>
                                                {/* Tên sân con sticky bên trái */}
                                                <td className={`sticky left-0 z-10 w-[140px] border-r border-slate-200 border-b border-slate-100 dark:border-r-white/10 dark:border-b-white/5 px-3 py-2.5 ${ri % 2 === 0 ? "bg-slate-100 dark:bg-[#0d1730]" : "bg-slate-100/90 dark:bg-[#0d1830]"} shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)]`}>
                                                    <p className="m-0 text-xs font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                                        {court.name.split(" - ")[0]}
                                                    </p>
                                                    <p className="m-0 mt-1 text-[9px] text-slate-500 dark:text-slate-400 font-bold">{court.price}</p>
                                                </td>
                                                {timeSlots.map(time => {
                                                    const booked = mockedBookedSlots[court.id]?.includes(time);
                                                    const chosen = selectedCells.some(c => c.courtId === court.id && c.time === time);
                                                    
                                                    let cellClass = "cursor-pointer bg-white dark:bg-[#0b1422] hover:bg-emerald-50 dark:hover:bg-emerald-500/20";
                                                    if (booked) cellClass = "bg-rose-500/70 border-0 cursor-not-allowed text-white";
                                                    else if (chosen) cellClass = "bg-emerald-500 border-0 shadow-[inset_0_0_8px_rgba(0,0,0,0.2)] text-white";
 
                                                    return (
                                                        <td
                                                            key={`${court.id}-${time}`}
                                                            onClick={() => handleCellClick(court.id, time)}
                                                            className={`h-9 w-11 border-r border-b border-slate-100 dark:border-white/5 transition-colors duration-100 ${cellClass}`}
                                                        />
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tổng quan giá tạm tính */}
                        <div className={`mt-6 border rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 transition-all duration-300 ${
                            selectedCells.length 
                                ? "border-emerald-500/35 bg-emerald-50 dark:bg-emerald-500/5" 
                                : "border-slate-200 bg-white dark:border-white/5 dark:bg-[#0d1627]"
                        }`}>
                            <div className="flex gap-8 text-center md:text-left">
                                <div>
                                    <p className="m-0 text-[9px] text-slate-500 font-black uppercase tracking-wider">Tổng thời gian</p>
                                    <p className="m-0 mt-1.5 text-2xl font-black text-emerald-600 dark:text-emerald-400">{timeStr}</p>
                                </div>
                                <div className="border-l border-slate-200 dark:border-white/10 px-8">
                                    <p className="m-0 text-[9px] text-slate-500 font-black uppercase tracking-wider">Tổng tiền tạm tính</p>
                                    <p className="m-0 mt-1.5 text-2xl font-black text-amber-600 dark:text-amber-400">
                                        {totalMoney > 0 ? `${totalMoney.toLocaleString("vi-VN")} đ` : "—"}
                                    </p>
                                </div>
                                {selectedCells.length > 0 && (
                                    <div className="border-l border-slate-200 dark:border-white/10 pl-8 hidden sm:block">
                                        <p className="m-0 text-[9px] text-slate-500 font-black uppercase tracking-wider">Số ô đã chọn</p>
                                        <p className="m-0 mt-1.5 text-2xl font-black text-slate-700 dark:text-white">{selectedCells.length} ô</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedCells.length}
                                className={`flex items-center gap-1.5 px-7 py-3.5 rounded-xl text-xs font-black transition-all shadow-md ${
                                    selectedCells.length
                                        ? "bg-amber-400 text-slate-900 hover:bg-amber-300 hover:shadow-amber-400/25 hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
                                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                }`}
                            >
                                TIẾP TỤC ĐẶT SÂN <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════ TAB: FORM THÔNG TIN NGƯỜI ĐẶT ══════════════ */}
                {activeTab === "form" && (
                    <div className="animate-[fadeUp_0.3s_ease_both] grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cột trái & giữa: Biểu mẫu form */}
                        <form onSubmit={handleFormSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 dark:bg-[#0d1627] dark:border-white/5 flex flex-col gap-5 shadow-sm">
                            <h2 className="text-slate-800 dark:text-white text-base font-black flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-white/5 pb-3">
                                <User size={16} className="text-emerald-500 dark:text-emerald-400" />
                                Thông Tin Khách Hàng & Thanh Toán
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                                        Họ và tên <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={customerName}
                                            onChange={e => setCustomerName(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-3 text-xs text-slate-850 placeholder-slate-400 outline-none focus:border-emerald-500 dark:bg-[#08101a] dark:border-white/10 dark:text-white dark:placeholder-slate-500 transition-colors font-semibold"
                                            placeholder="Nhập họ và tên..."
                                        />
                                        <User size={14} className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                                        Số điện thoại <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            required
                                            value={customerPhone}
                                            onChange={e => setCustomerPhone(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-3 text-xs text-slate-850 placeholder-slate-400 outline-none focus:border-emerald-500 dark:bg-[#08101a] dark:border-white/10 dark:text-white dark:placeholder-slate-500 transition-colors font-semibold"
                                            placeholder="Nhập số điện thoại..."
                                        />
                                        <Phone size={14} className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wide">Địa chỉ Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={customerEmail}
                                        onChange={e => setCustomerEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-3 text-xs text-slate-855 placeholder-slate-400 outline-none focus:border-emerald-500 dark:bg-[#08101a] dark:border-white/10 dark:text-white dark:placeholder-slate-500 transition-colors font-semibold"
                                        placeholder="customer@domain.com"
                                    />
                                    <Mail size={14} className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wide">Ghi chú thêm</label>
                                <div className="relative">
                                    <textarea
                                        value={customerNotes}
                                        onChange={e => setCustomerNotes(e.target.value)}
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-855 placeholder-slate-400 outline-none focus:border-emerald-500 dark:bg-[#08101a] dark:border-white/10 dark:text-white dark:placeholder-slate-500 transition-colors font-semibold resize-none"
                                        placeholder="Yêu cầu thêm ví dụ thuê vợt, thuê nước, chuẩn bị bóng..."
                                    />
                                    <FileText size={14} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                                </div>
                            </div>

                            {/* Phương thức thanh toán */}
                            <div className="flex flex-col gap-2.5">
                                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                                    Phương thức thanh toán <span className="text-rose-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: "momo", title: "Ví MoMo", desc: "Thanh toán ví điện tử" },
                                        { id: "vnpay", title: "Thẻ ATM / Visa", desc: "Cổng VNPay trực tuyến" },
                                        { id: "counter", title: "Tại quầy", desc: "Thanh toán sau khi chơi" }
                                    ].map(method => (
                                        <label
                                            key={method.id}
                                            className={`border rounded-xl p-3 flex flex-col gap-1 cursor-pointer transition-all ${
                                                paymentMethod === method.id
                                                    ? "bg-emerald-500/10 border-emerald-500/50 text-slate-900 dark:text-white"
                                                    : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-[#08101a] dark:border-white/5 dark:text-slate-400 hover:border-slate-350 dark:hover:border-white/15"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id)}
                                                className="sr-only"
                                            />
                                            <span className="text-xs font-black flex items-center gap-1">
                                                <CreditCard size={12} className={paymentMethod === method.id ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} />
                                                {method.title}
                                            </span>
                                            <span className="text-[9px] text-slate-550 dark:text-slate-500 font-semibold leading-tight">{method.desc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-4 border-t border-slate-100 dark:border-white/5 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("booking")}
                                    className="flex items-center gap-1 bg-slate-100 border border-slate-200 hover:bg-slate-200/70 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={14} /> Quay lại chọn giờ
                                </button>
                                <button
                                    type="submit"
                                    disabled={selectedCells.length === 0}
                                    className={`flex items-center gap-1.5 px-8 py-3.5 rounded-xl text-xs font-black transition-all shadow-lg ${
                                        selectedCells.length
                                            ? "bg-emerald-500 hover:bg-emerald-400 text-white dark:text-[#0c1219] hover:shadow-emerald-500/20 hover:-translate-y-0.5 cursor-pointer active:translate-y-0 border-0"
                                            : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-0"
                                    }`}
                                >
                                    XÁC NHẬN THANH TOÁN & ĐẶT SÂN <ChevronRight size={14} />
                                </button>
                            </div>
                        </form>

                        {/* Cột phải: Tóm tắt đơn đặt */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 dark:bg-[#0d1627] dark:border-white/5 flex flex-col gap-4 h-fit shadow-sm">
                            <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-wider border-b border-slate-100 dark:border-white/5 pb-2.5">
                                Tóm tắt đặt sân
                            </h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-start text-xs gap-3">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0">Chi nhánh:</span>
                                    <span className="text-slate-900 dark:text-white font-extrabold text-right leading-relaxed">{branch.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs gap-3">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold">Ngày chơi:</span>
                                    <span className="text-[#059669] dark:text-emerald-400 font-extrabold">{selectedDate}</span>
                                </div>
                                <div className="border-t border-dashed border-slate-200 dark:border-white/10 pt-3 flex flex-col gap-2">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">Các khung giờ chọn ({selectedCells.length}):</span>
                                    {selectedCells.length === 0 ? (
                                        <p className="text-[10px] text-amber-600 dark:text-amber-505 font-bold">Chưa chọn khung giờ nào. Vui lòng quay lại tab Chọn giờ.</p>
                                    ) : (
                                        <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 pr-1">
                                            {selectedCells.map((cell, idx) => {
                                                const court = branch.courts.find(c => c.id === cell.courtId);
                                                return (
                                                    <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1.5 text-[10px] font-bold dark:bg-[#08101a] dark:border-white/5">
                                                        <span className="text-slate-700 dark:text-slate-300">{court?.name.split(" - ")[0]}</span>
                                                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                            <Clock size={9} />
                                                            {cell.time}
                                                        </span>
                                                        <span className="text-amber-600 dark:text-amber-400">{(court?.pricePerSlot || 0).toLocaleString("vi-VN")}đ</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-slate-100 dark:border-white/5 pt-3 mt-1 flex justify-between items-baseline">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">Tổng cộng:</span>
                                    <span className="text-amber-600 dark:text-amber-400 font-black text-xl">{totalMoney.toLocaleString("vi-VN")}đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════ TAB: HÌNH ẢNH MINH HỌA ══════════════ */}
                {activeTab === "gallery" && (
                    <div className="animate-[fadeUp_0.3s_ease_both]">
                        <div className="mb-4">
                            <h2 className="text-slate-900 dark:text-white text-base font-black flex items-center gap-2">
                                📸 Thư Viện Ảnh Minh Họa Thực Tế
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">
                                Ảnh chụp thật các sân thi đấu, cơ sở vật chất, hệ thống thảm, và khu vực phòng chờ căng tin tại chi nhánh. Click vào ảnh để xem chi tiết.
                            </p>
                        </div>

                        {/* Grid ảnh */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {(branch.gallery || []).map((imgUrl, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setLightboxImage(imgUrl)}
                                    className="relative rounded-2xl overflow-hidden aspect-video bg-slate-150 border border-slate-200 cursor-zoom-in group shadow-sm dark:bg-[#0d1627] dark:border-white/5 hover:border-emerald-500/40 transition-all duration-300"
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`${branch.name} illustration ${idx + 1}`}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* gradient overlay */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                        <div className="bg-emerald-500/90 text-slate-900 rounded-full p-2.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <Eye size={18} className="stroke-[3]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══════════════ TAB: GIỚI THIỆU & TIỆN ÍCH ══════════════ */}
                {activeTab === "info" && (
                    <div className="animate-[fadeUp_0.3s_ease_both] grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Giới thiệu */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 dark:bg-[#0d1627] dark:border-white/5 shadow-sm flex flex-col gap-3">
                            <h2 className="text-slate-950 dark:text-white text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2.5">
                                <Layers size={14} className="text-emerald-500 dark:text-emerald-400" /> Giới thiệu chi nhánh
                            </h2>
                            <p className="text-slate-655 dark:text-slate-400 text-xs leading-relaxed leading-7 m-0 font-medium">
                                {branch.description}
                            </p>
                        </div>

                        {/* Tiện ích */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 dark:bg-[#0d1627] dark:border-white/5 shadow-sm flex flex-col gap-3">
                            <h2 className="text-slate-950 dark:text-white text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2.5">
                                <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400" /> Tiện ích có sẵn
                            </h2>
                            <div className="grid grid-cols-2 gap-2">
                                {(branch.amenities || []).map((a, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-150 dark:bg-[#08101a] dark:border-white/5 rounded-xl py-2 px-3 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shadow-sm animate-fade-in">
                                        <span className="text-emerald-500 dark:text-emerald-400 shrink-0">{amenityIcon(a)}</span>
                                        <span className="truncate">{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sân con */}
                        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 dark:bg-[#0d1627] dark:border-white/5 shadow-sm flex flex-col gap-4">
                            <h2 className="text-slate-950 dark:text-white text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2.5">
                                <Trophy size={14} className="text-amber-500 dark:text-amber-400" /> Danh sách sân thi đấu
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {branch.courts.map(c => (
                                    <div key={c.id} className="bg-slate-50 border border-slate-150 hover:border-emerald-400/50 rounded-xl p-3.5 transition-all shadow-sm dark:bg-[#08101a] dark:border-white/5 dark:hover:border-emerald-500/20">
                                        <p className="m-0 text-xs font-black text-slate-800 dark:text-white">{c.name}</p>
                                        <p className="m-0 mt-1 text-[10px] text-slate-500 font-bold">{c.type}</p>
                                        <p className="m-0 mt-2 text-[#059669] dark:text-[#00f5a0] text-sm font-black">{c.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
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
                        alt="Badminton court full preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-[zoomIn_0.3s_cubic-bezier(.34,1.56,.64,1)_both]"
                    />
                </div>
            )}

            {/* ══ MODAL TOAST ĐẶT SÂN THÀNH CÔNG ══ */}
            {bookingSuccess && (
                <div className="fixed inset-0 z-[400] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0d2217] border border-emerald-500/30 rounded-3xl p-8 flex flex-col items-center gap-4 max-w-[340px] w-full text-center shadow-[0_24px_60px_rgba(0,0,0,0.8)] animate-[successPop_0.4s_cubic-bezier(.34,1.56,.64,1)_both]">
                        <style>{`
                            @keyframes successPop {
                                0%   { transform: scale(0.8); opacity: 0; }
                                70%  { transform: scale(1.03); opacity: 1; }
                                100% { transform: scale(1); }
                            }
                            @keyframes fadeUp {
                                from { opacity: 0; transform: translateY(12px); }
                                to   { opacity: 1; transform: translateY(0); }
                            }
                        `}</style>

                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center animate-pulse">
                            <CheckCircle2 size={32} className="text-[#00f5a0]" />
                        </div>
                        <h3 className="m-0 text-white text-lg font-black tracking-wide">Đặt sân thành công!</h3>
                        <div className="flex flex-col gap-1.5 text-slate-300 text-xs leading-relaxed font-semibold">
                            <p className="m-0">Lịch thi đấu tại <strong className="text-emerald-400">{branch.name}</strong> đã được lưu lại thành công.</p>
                            <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-left flex flex-col gap-1 mt-2">
                                <p className="m-0 text-[10px] text-slate-400">Khách hàng: <span className="text-white font-extrabold">{customerName}</span></p>
                                <p className="m-0 text-[10px] text-slate-400">SĐT: <span className="text-white font-extrabold">{customerPhone}</span></p>
                                <p className="m-0 text-[10px] text-slate-400">Ngày chơi: <span className="text-emerald-400 font-extrabold">{selectedDate}</span></p>
                                <p className="m-0 text-[10px] text-slate-400">Hình thức: <span className="text-amber-400 font-extrabold">{paymentMethod === "momo" ? "Ví MoMo" : paymentMethod === "vnpay" ? "ATM / Visa" : "Tại quầy"}</span></p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setBookingSuccess(false);
                                navigate("/booking");
                            }}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border-0 mt-3"
                        >
                            Quay lại Bản đồ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
    QrCode, 
    MapPin, 
    Clock, 
    Phone, 
    ArrowLeft, 
    Calendar, 
    Award, 
    Compass,
    Sparkles,
    Search,
    ExternalLink
} from "lucide-react";

// Dữ liệu giả lập 6 chi nhánh của hệ thống sân cầu lông TripleT
// Trùng khớp địa chỉ và tọa độ GPS thực tế tương đương khu vực trong ảnh mẫu (Đồng Nai & Bình Phước)
const branchesData = [
    {
        id: "tran-bien",
        name: "Sân Cầu Lông Premium - Trấn Biên",
        coords: [10.9612, 106.7972],
        address: "Đường Chu Văn An, P. Quang Vinh, TP. Biên Hòa, Đồng Nai",
        phone: "0251.3847.111",
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
        openTime: "05:00 - 22:00",
        priceRange: "100.000đ - 150.000đ/h",
        rating: 4.8,
        freeCourts: 2,
        description: "Tọa lạc tại khu vực Văn Miếu Trấn Biên thoáng đãng, cơ sở vật chất khang trang. Sân trang bị thảm PVC tiêu chuẩn quốc tế BWF, có hệ thống thông gió mát mẻ và khu căng tin hiện đại.",
        courts: [
            { id: 1, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000 },
            { id: 2, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000 },
            { id: 3, name: "Sân 3 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000 },
            { id: 4, name: "Sân 4 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000 }
        ]
    },
    {
        id: "chien-khu-d",
        name: "CLB Cầu Lông Thử Thách - Chiến Khu Đ",
        coords: [11.1718, 107.0125],
        address: "Khu bảo tồn di tích lịch sử Chiến khu Đ, Vĩnh Cửu, Đồng Nai",
        phone: "0251.3961.222",
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80",
        openTime: "06:00 - 21:00",
        priceRange: "80.000đ - 120.000đ/h",
        rating: 4.5,
        freeCourts: 1,
        description: "Địa điểm tập luyện lý tưởng hòa mình cùng thiên nhiên lịch sử chiến khu. Sân thích hợp tổ chức các giải đấu phong trào, trang bị đèn chống lóa mắt giúp bảo vệ tầm nhìn vợt thủ.",
        courts: [
            { id: 5, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 6, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 7, name: "Sân 3 - Cao cấp", type: "Thảm cao su", price: "120.000đ/h", pricePerSlot: 60000 }
        ]
    },
    {
        id: "tan-hiep",
        name: "Sân Cầu Lông Đẳng Cấp - Tân Hiệp",
        coords: [10.9628, 106.8291],
        address: "114 Nguyễn Ái Quốc, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai",
        phone: "0251.3822.333",
        image: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=600&q=80",
        openTime: "05:00 - 23:00",
        priceRange: "100.000đ - 150.000đ/h",
        rating: 4.9,
        freeCourts: 2,
        description: "Chi nhánh ngay trung tâm thành phố Biên Hòa, thiết kế trần cao cực thoáng mát, hệ thống thảm chống trượt tuyệt vời. Có cửa hàng thể thao chuyên căng vợt, bán phụ kiện cầu lông tại chỗ.",
        courts: [
            { id: 8, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000 },
            { id: 9, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000 },
            { id: 10, name: "Sân 3 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000 },
            { id: 11, name: "Sân 4 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000 }
        ]
    },
    {
        id: "phu-rieng-do",
        name: "Sân Cầu Lông Premium - Phú Riềng Đỏ",
        coords: [11.6667, 106.9022],
        address: "Đường ĐT 741, Xã Phú Riềng, Huyện Phú Riềng, Bình Phước",
        phone: "0271.3999.444",
        image: "https://images.unsplash.com/photo-1613918431208-6752c2ecdfd4?auto=format&fit=crop&w=600&q=80",
        openTime: "06:00 - 22:00",
        priceRange: "80.000đ - 120.000đ/h",
        rating: 4.6,
        freeCourts: 1,
        description: "Cơ sở thể thao hiện đại nổi bật tại Bình Phước. Thảm trải sàn đệm êm giảm chấn thương đầu gối hiệu quả, thích hợp cho cả người lớn tuổi và trẻ em tham gia câu lạc bộ tập luyện.",
        courts: [
            { id: 12, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 13, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 14, name: "Sân 3 - Cao cấp", type: "Thảm cao su", price: "120.000đ/h", pricePerSlot: 60000 }
        ]
    },
    {
        id: "ta-thiet",
        name: "CLB Cầu Lông Thử Thách - Tà Thiết",
        coords: [11.8384, 106.5367],
        address: "Khu di tích lịch sử Căn cứ Tà Thiết, Lộc Ninh, Bình Phước",
        phone: "0271.3555.666",
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80",
        openTime: "05:30 - 21:30",
        priceRange: "90.000đ - 140.000đ/h",
        rating: 4.7,
        freeCourts: 3,
        description: "Thiết kế CLB cầu lông chuyên nghiệp phục vụ người dân địa phương và cán bộ chiến sĩ tập luyện thể thao. Không gian sạch sẽ, bồn rửa tay, phòng tắm nước nóng đầy đủ.",
        courts: [
            { id: 15, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "90.000đ/h", pricePerSlot: 45000 },
            { id: 16, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "90.000đ/h", pricePerSlot: 45000 },
            { id: 17, name: "Sân 3 - VIP", type: "Thảm cao su", price: "140.000đ/h", pricePerSlot: 70000 },
            { id: 18, name: "Sân 4 - VIP", type: "Thảm cao su", price: "140.000đ/h", pricePerSlot: 70000 }
        ]
    },
    {
        id: "soc-bom-bo",
        name: "Sân Cầu Lông Đẳng Cấp - Sóc Bom Bo",
        coords: [11.7584, 107.1983],
        address: "Khu di tích bảo tồn văn hóa Sóc Bom Bo, Bù Đăng, Bình Phước",
        phone: "0271.3777.888",
        image: "https://images.unsplash.com/photo-1609121826763-149b5d278f2f?auto=format&fit=crop&w=600&q=80",
        openTime: "06:00 - 22:00",
        priceRange: "80.000đ - 130.000đ/h",
        rating: 4.8,
        freeCourts: 2,
        description: "Điểm đến giao lưu văn hóa kết hợp thể thao của đồng bào địa phương. Cơ sở trang bị thảm giảm rung chấn, khán đài ngồi theo dõi các trận đấu kịch tính thoải mái.",
        courts: [
            { id: 19, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 20, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 21, name: "Sân 3 - Premium", type: "Thảm cao su", price: "130.000đ/h", pricePerSlot: 65000 }
        ]
    }
];

const timeSlots = Array.from({ length: 33 }, (_, i) => {
    const h = Math.floor(i / 2) + 6;
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
});

// Giả lập dữ liệu các khung giờ đã được đặt trước
const mockedBookedSlots = {
    1: ["07:00", "07:30", "08:00"],
    2: ["12:00", "12:30", "16:00"],
    3: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
    4: ["06:00", "06:30"]
};

// Chuẩn hóa giờ để so sánh dễ dàng (thêm số 0 ở đầu nếu cần)
const normalizeTime = (t) => {
    const [h, m] = t.split(":");
    return `${h.padStart(2, '0')}:${m}`;
};

const normalizedTimeSlots = timeSlots.map(normalizeTime);

export default function CourtBooking() {
    const [isGridModalOpen, setIsGridModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedCells, setSelectedCells] = useState([]);

    const handleOpenGrid = () => {
        setIsGridModalOpen(true);
    };

    // Chọn ô giờ đặt sân
    const handleCellClick = (courtId, time) => {
        if (mockedBookedSlots[courtId]?.includes(time)) return;
        setSelectedCells((prev) => {
            const exists = prev.find(cell => cell.courtId === courtId && cell.time === time);
            return exists ? prev.filter(cell => !(cell.courtId === courtId && cell.time === time)) : [...prev, { courtId, time }];
        });
    };

    // Tính toán tổng tiền & thời gian
    const calculateTotal = () => {
        let totalMoney = 0;
        selectedCells.forEach(cell => {
            const court = courtsInfo.find(c => c.id === cell.courtId);
            if (court) totalMoney += court.pricePerSlot;
        });
        const totalMinutes = selectedCells.length * 30;
        return { totalMoney, timeString: `${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 > 0 ? totalMinutes % 60 : ''}` };
    };

    const { totalMoney, timeString } = calculateTotal();

    const handleConfirmBooking = () => {
        if (selectedCells.length === 0) return;
        alert(`Đã đặt thành công ${selectedCells.length} khung giờ vào ngày ${selectedDate}.\nTổng tiền: ${totalMoney.toLocaleString('vi-VN')}đ`);
        setSelectedCells([]);
        setIsGridModalOpen(false);
    };

    return (
        <div className="min-h-screen">
            {/* HERO SECTION */}
            <section className="tt-hero relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
                    <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-lime-400 blur-3xl" />
                </div>
                <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center">
                    <span className="inline-block rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
                        Hệ thống đặt lịch trực quan
                    </span>
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                        Hệ thống sân cầu lông <br />
                        <span className="bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">
                            Tiêu Chuẩn Quốc Tế
                        </span>
                    </h1>
                    <p className="max-w-2xl text-lg text-slate-300">
                        Trải nghiệm không gian thể thao đẳng cấp với giao diện đặt lịch dễ nhìn, chọn khung giờ nhanh chóng và thuận tiện nhất.
                    </p>
                    <button 
                        onClick={handleOpenGrid}
                        className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1 hover:bg-emerald-400 hover:shadow-emerald-500/50"
                    >
                        📅 Mở bảng đặt lịch ngay
                    </button>
                </div>
            </section>

            {/* DANH SÁCH SÂN */}
            <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
                <div className="mb-10 text-center">
                    <span className="tt-label">Danh sách</span>
                    <h2 className="tt-title mt-2">Thông tin các sân hiện có</h2>
                </div>
                
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {courtsInfo.map(court => (
                        <div key={court.id} className="tt-card flex flex-col md:flex-row overflow-hidden group">
                            <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                                <img 
                                    src={court.image} 
                                    alt={court.name} 
                                    className="tt-img-zoom h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6 md:w-3/5 flex flex-col justify-between bg-white dark:bg-slate-800">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 transition-colors">
                                            {court.name}
                                        </h3>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{court.price}</span>
                                    </div>
                                    <p className="tt-muted text-sm mt-2 flex items-center gap-2">
                                        <span>🏸</span> Loại thảm: {court.type}
                                    </p>
                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">Nước suối miễn phí</span>
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">Wifi tốc độ cao</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button 
                                        onClick={handleOpenGrid}
                                        className="w-full py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                                    >
                                        Xem lịch sân này
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL GRID ĐẶT SÂN */}
            {isGridModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-6">
                    <div className="flex h-full w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0c1219] animate-in zoom-in-95 duration-200">
                        
                        {/* HEADER LỊCH */}
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-emerald-700 px-6 py-4 dark:border-emerald-800">
                            <h2 className="text-xl font-bold text-white">Đặt lịch trực quan</h2>
                            <button 
                                onClick={() => setIsGridModalOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40"
                            >
                                ✕
                            </button>
                        </div>

                        {/* THANH CÔNG CỤ: CHÚ THÍCH & CHỌN NGÀY */}
                        <div className="flex flex-col sm:flex-row shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-emerald-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4 text-sm font-medium">
                                <div className="flex items-center gap-1.5">
                                    <span className="block h-5 w-5 rounded border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"></span>
                                    <span className="text-slate-700 dark:text-slate-300">Trống</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="block h-5 w-5 rounded border border-red-500 bg-red-400"></span>
                                    <span className="text-slate-700 dark:text-slate-300">Đã đặt</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="block h-5 w-5 rounded border border-emerald-600 bg-emerald-500 shadow-sm shadow-emerald-500/40"></span>
                                    <span className="text-slate-700 dark:text-slate-300">Đang chọn</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ngày chơi:</label>
                                <input 
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedCells([]); // Reset selected when changing date
                                    }}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        {/* GRID THỜI GIAN */}
                        <div className="flex-1 overflow-auto bg-slate-50 p-4 dark:bg-[#121b24] relative">
                            <div className="inline-block min-w-full rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 z-20 w-32 border-b border-r border-slate-200 bg-slate-100 px-4 py-3 text-left text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                Tên Sân
                                            </th>
                                            {normalizedTimeSlots.slice(0, -1).map((time, index) => (
                                                <th key={time} className="min-w-[48px] border-b border-r border-slate-100 bg-slate-50 px-1 py-2 text-center text-[11px] font-semibold text-slate-500 dark:border-slate-700/50 dark:bg-slate-800 dark:text-slate-400">
                                                    {time}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courtsInfo.map(court => (
                                            <tr key={court.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                                <td className="sticky left-0 z-10 w-32 border-b border-r border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400">
                                                    {court.name.split(' - ')[0]}
                                                    <span className="block text-[10px] font-normal text-slate-400">{court.price}</span>
                                                </td>
                                                {normalizedTimeSlots.slice(0, -1).map((time) => {
                                                    const isBooked = mockedBookedSlots[court.id]?.includes(time);
                                                    const isSelected = selectedCells.some(cell => cell.courtId === court.id && cell.time === time);
                                                    
                                                    let cellClass = "cursor-pointer bg-white hover:bg-emerald-50 dark:bg-slate-800/50 dark:hover:bg-emerald-900/30";
                                                    if (isBooked) {
                                                        cellClass = "bg-red-400/90 cursor-not-allowed";
                                                    } else if (isSelected) {
                                                        cellClass = "bg-emerald-500 shadow-inner";
                                                    }

                                                    return (
                                                        <td key={`${court.id}-${time}`} onClick={() => handleCellClick(court.id, time)} className={`border-b border-r border-slate-100 dark:border-slate-700/50 ${cellClass}`}>
                                                            <div className="h-8 w-full"></div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* FOOTER THANH TOÁN */}
                        <div className="flex shrink-0 items-center justify-between border-t border-emerald-700 bg-emerald-600 px-6 py-4 text-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-emerald-100">Tổng thời gian</span>
                                    <span className="text-xl font-bold">{timeString}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-emerald-100">Tổng tiền</span>
                                    <span className="text-xl font-bold">{totalMoney.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    if (selectedCells.length === 0) return;
                                    alert(`Đặt thành công tại: ${activeBranch.name}\nTổng tiền: ${totalMoney.toLocaleString('vi-VN')}đ`);
                                    setSelectedCells([]); setIsGridModalOpen(false);
                                }}
                                disabled={selectedCells.length === 0}
                                className={`rounded-xl px-8 py-3 font-bold transition-all ${
                                    selectedCells.length > 0 
                                    ? "bg-amber-400 text-slate-900 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/30 active:scale-95" 
                                    : "bg-emerald-700 text-emerald-400 cursor-not-allowed"
                                }`}
                            >
                                TIẾP THEO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
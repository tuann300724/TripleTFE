import { useState, useEffect, useRef } from "react";
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

const mockedBookedSlots = {
    1: ["07:00", "07:30", "08:00"],
    2: ["12:00", "12:30", "16:00"],
    3: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
    4: ["06:00", "06:30"]
};

const normalizeTime = (t) => {
    const [h, m] = t.split(":");
    return `${h.padStart(2, '0')}:${m}`;
};

const normalizedTimeSlots = timeSlots.map(normalizeTime);

export default function CourtBooking() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeBranchId, setActiveBranchId] = useState(branchesData[0]?.id || null);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedCells, setSelectedCells] = useState([]);
    const mapRef = useRef(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const activeBranch = branchesData.find((branch) => branch.id === activeBranchId) || branchesData[0];
    const filteredBranches = branchesData.filter((branch) =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (typeof window === "undefined" || !activeBranch) return;
        if (!window.L) return;
        if (!mapRef.current) {
            mapRef.current = window.L.map("booking-map", {
                center: activeBranch.coords,
                zoom: 12,
                scrollWheelZoom: false,
                zoomControl: false,
                attributionControl: false
            });
            window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19
            }).addTo(mapRef.current);
            setIsMapReady(true);
        }

        if (mapRef.current) {
            mapRef.current.setView(activeBranch.coords, 12, {
                animate: true,
                duration: 0.4
            });
        }
    }, [activeBranch]);

    const handleBranchSelect = (branchId) => {
        setActiveBranchId(branchId);
        setSelectedCells([]);
    };

    const handleCellClick = (courtId, time) => {
        if (mockedBookedSlots[courtId]?.includes(time)) return;
        setSelectedCells((prev) => {
            const exists = prev.find(cell => cell.courtId === courtId && cell.time === time);
            return exists ? prev.filter(cell => !(cell.courtId === courtId && cell.time === time)) : [...prev, { courtId, time }];
        });
    };

    const activeCourts = activeBranch?.courts || [];
    const calculateTotal = () => {
        let totalMoney = 0;
        selectedCells.forEach(cell => {
            const court = activeCourts.find(c => c.id === cell.courtId);
            if (court) totalMoney += court.pricePerSlot;
        });
        const totalMinutes = selectedCells.length * 30;
        return {
            totalMoney,
            timeString: `${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 > 0 ? totalMinutes % 60 : ''}`
        };
    };

    const { totalMoney, timeString } = calculateTotal();

    const handleBookNow = () => {
        if (!selectedCells.length) return;
        alert(`Đã đặt thành công ${selectedCells.length} khung giờ vào ngày ${selectedDate} tại ${activeBranch.name}.\nTổng tiền: ${totalMoney.toLocaleString('vi-VN')}đ`);
        setSelectedCells([]);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-16">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_35%)]" />
                <div className="relative mx-auto max-w-6xl px-6 text-center">
                    <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                        <MapPin className="h-4 w-4" /> Đặt sân nhanh, chọn thời gian tiện lợi
                    </p>
                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Tìm sân cầu lông gần bạn <br /> và đặt lịch cực nhanh
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                        Đăng ký theo giờ, xem bản đồ trực quan và chọn sân phù hợp nhất với lịch của bạn. Giao diện tối ưu cho cả desktop và tablet.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] xl:gap-8">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Chọn chi nhánh</h2>
                                    <p className="mt-2 text-sm text-slate-400">Tìm theo tên hoặc khu vực, sau đó xem vị trí ngay trên bản đồ.</p>
                                </div>
                                <div className="relative max-w-sm">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Tìm theo tên sân hoặc quận..."
                                        className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4">
                                {filteredBranches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        type="button"
                                        onClick={() => handleBranchSelect(branch.id)}
                                        className={`group flex w-full items-start gap-4 rounded-3xl border p-5 text-left transition ${branch.id === activeBranchId ? "border-emerald-400 bg-emerald-500/10 shadow-[0_20px_80px_-60px_rgba(16,185,129,0.6)]" : "border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-950/90"}`}
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800 text-emerald-400">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <h3 className="text-lg font-semibold text-white">{branch.name}</h3>
                                                <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-300">{branch.rating} ★</span>
                                            </div>
                                            <p className="mt-2 text-sm text-slate-400">{branch.address}</p>
                                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                                                <span className="rounded-full bg-slate-850 px-3 py-1">{branch.priceRange}</span>
                                                <span className="rounded-full bg-slate-850 px-3 py-1">{branch.freeCourts} sân trống</span>
                                                <span className="rounded-full bg-slate-850 px-3 py-1">{branch.openTime}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">Chi nhánh được chọn</p>
                                    <h3 className="mt-2 text-2xl font-semibold text-white">{activeBranch.name}</h3>
                                </div>
                                <span className="rounded-3xl bg-slate-950/90 px-4 py-2 text-sm font-semibold text-slate-300">{activeBranch.freeCourts} sân trống</span>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                                    <p className="text-sm text-slate-400">Địa chỉ</p>
                                    <p className="mt-2 text-base font-medium text-white">{activeBranch.address}</p>
                                </div>
                                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                                    <p className="text-sm text-slate-400">Số điện thoại</p>
                                    <p className="mt-2 text-base font-medium text-white">{activeBranch.phone}</p>
                                </div>
                            </div>

                            <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950/80 p-5 text-slate-300">
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Mô tả</p>
                                <p className="mt-3 leading-7 text-slate-300">{activeBranch.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-emerald-400">Bản đồ chi nhánh</p>
                                    <h3 className="mt-2 text-2xl font-semibold text-white">Xem vị trí thực tế</h3>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/90 px-4 py-2 text-sm text-slate-300">
                                    <MapPin className="h-4 w-4 text-emerald-400" /> {activeBranch.name}
                                </div>
                            </div>
                            <div className="mt-6 h-[520px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                                <div id="booking-map" className="h-full w-full" />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm text-emerald-400">Lịch đặt & chọn giờ</p>
                                    <h3 className="mt-2 text-2xl font-semibold text-white">Chọn sân và khung giờ</h3>
                                </div>
                                <div className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/90 px-4 py-2 text-sm text-slate-300">
                                    <Calendar className="h-4 w-4 text-emerald-400" />
                                    <span>{selectedDate}</span>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4">
                                {activeCourts.map((court) => (
                                    <div key={court.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-slate-400">{court.name}</p>
                                                <h4 className="mt-2 text-lg font-semibold text-white">{court.type}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-400">Giá</p>
                                                <p className="mt-2 text-lg font-semibold text-emerald-300">{court.price}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                            {normalizedTimeSlots.slice(0, 12).map((time) => {
                                                const isBooked = mockedBookedSlots[court.id]?.includes(time);
                                                const isSelected = selectedCells.some((cell) => cell.courtId === court.id && cell.time === time);
                                                return (
                                                    <button
                                                        key={`${court.id}-${time}`}
                                                        type="button"
                                                        onClick={() => handleCellClick(court.id, time)}
                                                        disabled={isBooked}
                                                        className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                                                            isBooked
                                                                ? "cursor-not-allowed border-red-500 bg-red-500/10 text-red-300"
                                                                : isSelected
                                                                    ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                                                                    : "border-slate-700 bg-slate-950 text-slate-300 hover:border-emerald-400 hover:bg-emerald-400/10"
                                                        }`}
                                                    >
                                                        {time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Tổng</p>
                                    <p className="mt-2 text-2xl font-semibold text-white">{selectedCells.length} khung giờ • {timeString}</p>
                                    <p className="mt-1 text-sm text-slate-400">Tổng tiền: {totalMoney.toLocaleString('vi-VN')} đ</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleBookNow}
                                    disabled={selectedCells.length === 0}
                                    className={`inline-flex items-center justify-center rounded-3xl px-6 py-3 text-sm font-semibold transition ${
                                        selectedCells.length > 0
                                            ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                                            : "cursor-not-allowed bg-slate-700 text-slate-500"
                                    }`}
                                >
                                    Đặt sân ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

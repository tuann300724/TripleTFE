import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
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

// Giả lập dữ liệu các khung giờ đã được đặt trước cho toàn bộ các sân
const mockedBookedSlots = {
    1: ["07:00", "07:30", "08:00"],
    2: ["12:00", "12:30", "16:00"],
    3: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
    4: ["06:00", "06:30"],
    5: ["08:00", "08:30", "09:00"],
    6: ["14:00", "14:30"],
    7: ["19:00", "19:30", "20:00"],
    8: ["07:00", "07:30"],
    9: ["12:00", "12:30"],
    10: ["17:00", "17:30", "18:00"],
    11: ["20:00", "20:30"],
    12: ["09:00", "09:30"],
    13: ["15:00", "15:30"],
    14: ["18:00", "18:30"],
    15: ["06:00", "06:30"],
    16: ["11:00", "11:30"],
    17: ["16:00", "16:30"],
    18: ["19:00", "19:30"],
    19: ["08:00", "08:30"],
    20: ["13:00", "13:30"],
    21: ["17:00", "17:30"]
};

const normalizeTime = (t) => {
    const [h, m] = t.split(":");
    return `${h.padStart(2, '0')}:${m}`;
};

const normalizedTimeSlots = timeSlots.map(normalizeTime);

export default function CourtBooking() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [selectedBranch, setSelectedBranch] = useState(branchesData[2]); // Chọn mặc định Tân Hiệp như trong ảnh mẫu ( Quận 7 / Sân Tân Hiệp)
    const [activeCourts, setActiveCourts] = useState([]);
    const [isGridModalOpen, setIsGridModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const [selectedCells, setSelectedCells] = useState([]);

    // QR code scan simulation states
    const [scanning, setScanning] = useState(false);
    const [scannedBranchName, setScannedBranchName] = useState("");

    // Live search and region filtering states
    const [searchQuery, setSearchQuery] = useState("");
    const [regionFilter, setRegionFilter] = useState("all");

    const mapRef = useRef(null);
    const markersRef = useRef([]);

    // Lọc chi nhánh sân dựa trên từ khóa tìm kiếm và bộ lọc vùng miền
    const filteredBranches = branchesData.filter(branch => {
        const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion = regionFilter === "all" ||
            (regionFilter === "tphcm" && branch.address.includes("TP.HCM")) ||
            (regionFilter === "dong-nai" && branch.address.includes("Đồng Nai")) ||
            (regionFilter === "binh-phuoc" && branch.address.includes("Bình Phước"));

        return matchesSearch && matchesRegion;
    });

    // Hàm khởi tạo bản đồ Leaflet
    const initializeMap = () => {
        if (!window.L || mapRef.current) return;

        // Tâm bản đồ đặt gần khu vực Trị An / Biên Hòa để bao quát được cả Bình Phước & Đồng Nai
        const map = window.L.map("map", {
            center: [11.35, 106.9],
            zoom: 9,
            zoomControl: true
        });
        mapRef.current = map;

        // Thêm Layer bản đồ
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    };

    // Effect khởi chạy bản đồ Leaflet (kèm cơ chế phòng vệ nạp trễ)
    useEffect(() => {
        let interval;
        const checkAndInit = () => {
            if (window.L) {
                initializeMap();
            } else {
                interval = setInterval(() => {
                    if (window.L) {
                        clearInterval(interval);
                        initializeMap();
                    }
                }, 100);
            }
        };

        checkAndInit();

        return () => {
            if (interval) clearInterval(interval);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Effect cập nhật markers khi danh sách chi nhánh được lọc thay đổi
    useEffect(() => {
        if (!window.L || !mapRef.current) return;

        // Xóa các marker cũ
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Tạo marker cho mỗi chi nhánh trong danh sách đã lọc
        filteredBranches.forEach(branch => {
            const customIcon = window.L.divIcon({
                html: `<div class="flex items-center justify-center">
                        <div class="w-8 h-8 flex items-center justify-center relative">
                        <div class="absolute w-6 h-6 rounded-full bg-red-500 animate-ping opacity-35"></div>
    
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-red-600 drop-shadow-md z-10">
                        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742c1.004-.717 2.173-1.654 3.202-2.77C18.856 16.591 20.5 14.154 20.5 11c0-4.749-3.83-8.5-8.5-8.5S3.5 6.251 3.5 11c0 3.154 1.644 5.591 2.833 7.839 1.029 1.116 2.198 2.053 3.202 2.77a16.97 16.97 0 001.143.742zM12 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd" />
                        </svg>
                        </div>
                        </div>`,
                className: "custom-div-icon",
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            const marker = window.L.marker(branch.coords, { icon: customIcon })
                .addTo(mapRef.current)
                .on("click", () => {
                    setSelectedBranch(branch);
                });

            marker.bindTooltip(`<b>${branch.name}</b>`, {
                direction: "top",
                offset: [0, -10],
                className: "bg-slate-900 text-white border-0 shadow-lg font-medium text-xs px-2.5 py-1 rounded-md"
            });

            markersRef.current.push(marker);
        });
    }, [filteredBranches]);

    // Effect tự động pan/flyTo đến chi nhánh khi selectedBranch thay đổi
    useEffect(() => {
        if (selectedBranch && mapRef.current) {
            mapRef.current.flyTo(selectedBranch.coords, 12, {
                animate: true,
                duration: 1.5
            });
        }
    }, [selectedBranch]);

    // Giả lập quét mã QR
    const handleSimulateQR = (branch) => {
        setScanning(true);
        setScannedBranchName(branch.name);

        setTimeout(() => {
            setScanning(false);
            setSelectedBranch(branch);
        }, 1200); // 1.2s delay tạo hiệu ứng quét
    };

    // Điều hướng đến trang chi tiết của sân rồi mới đặt lịch
    const handleOpenGridForBranch = (branch) => {
        navigate(`/booking/${branch.id}`);
    };

    // Mở Google Maps
    const handleOpenInGoogleMaps = () => {
        if (!selectedBranch) return;
        const [lat, lng] = selectedBranch.coords;
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    };

    // Chọn ô giờ đặt sân
    const handleCellClick = (courtId, time) => {
        const isBooked = mockedBookedSlots[courtId]?.includes(time);
        if (isBooked) return;

        setSelectedCells((prev) => {
            const exists = prev.find(cell => cell.courtId === courtId && cell.time === time);
            if (exists) {
                return prev.filter(cell => !(cell.courtId === courtId && cell.time === time));
            } else {
                return [...prev, { courtId, time }];
            }
        });
    };

    // Tính toán tổng tiền & thời gian
    const calculateTotal = () => {
        let totalMoney = 0;
        selectedCells.forEach(cell => {
            const court = activeCourts.find(c => c.id === cell.courtId);
            if (court) totalMoney += court.pricePerSlot;
        });
        const totalMinutes = selectedCells.length * 30;
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const timeString = hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins} phút`;

        return { totalMoney, timeString };
    };

    const { totalMoney, timeString } = calculateTotal();

    // Xác nhận đặt sân thành công
    const handleConfirmBooking = () => {
        if (selectedCells.length === 0) return;
        alert(`Đã đặt thành công ${selectedCells.length} khung giờ tại ${selectedBranch.name} vào ngày ${selectedDate}.\nTổng tiền: ${totalMoney.toLocaleString('vi-VN')}đ`);
        setSelectedCells([]);
        setIsGridModalOpen(false);
    };

    return (
        <div className="min-h-screen py-10 px-4 md:px-8 bg-slate-50 dark:bg-[#0c1219]">
            {/* CSS Tùy biến để bản đồ Leaflet chuyển màu tối & bỏ viền xấu */}
            <style>{`
                @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
                .dark-map .leaflet-tile {
                    filter: invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) !important;
                }
                .leaflet-container {
                    background: #0d1527 !important;
                }
                .custom-div-icon {
                    background: none !important;
                    border: none !important;
                }
                .leaflet-bar {
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    background: #0f172a !important;
                    border-radius: 8px !important;
                    overflow: hidden;
                }
                .leaflet-bar a {
                    background: #0f172a !important;
                    color: #94a3b8 !important;
                    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                }
                .leaflet-bar a:hover {
                    background: #1e293b !important;
                    color: #fff !important;
                }
            `}</style>

            {/* KHUNG TOÀN CỤC CHỨA HEADER & BODY MAP */}
            <div className="max-w-6xl mx-auto flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c111c] shadow-2xl">

                {/* THANH HEADER TIÊU ĐỀ & TÌM KIẾM (Y CHANG ẢNH MẪU) */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 bg-slate-50 dark:bg-[#0d1424] border-b border-slate-200 dark:border-slate-800 shrink-0">
                    {/* Logo & Tên thương hiệu */}
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
                            🏸
                        </div>
                        <span className="font-extrabold text-emerald-600 dark:text-[#00f5a0] tracking-wider text-sm md:text-base">
                            COURTMAP BOOKING
                        </span>
                    </div>

                    {/* Bộ lọc Tìm kiếm & Chọn Vùng miền */}
                    <div className="flex items-center gap-2 flex-1 md:justify-end">
                        <div className="relative w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sân gần bạn hoặc nhập địa chỉ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 dark:bg-[#070b13] dark:border-slate-700/55 dark:text-white dark:placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                            />
                            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <select
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 dark:bg-[#070b13] dark:border-slate-700/55 dark:text-slate-300 outline-none focus:border-emerald-500 cursor-pointer transition-colors"
                        >
                            <option value="all">Toàn quốc</option>
                            <option value="tphcm">TP. Hồ Chí Minh</option>
                            <option value="dong-nai">Đồng Nai</option>
                            <option value="binh-phuoc">Bình Phước</option>
                        </select>
                    </div>
                </header>

                {/* BẢN ĐỒ & SIDEBAR CHIA ĐÔI BỐ CỤC (SIDEBAR TRÁI, MAP PHẢI) */}
                <div className="flex flex-col lg:flex-row h-[580px] w-full relative overflow-hidden">

                    {/* HIỆU ỨNG QUÉT MÃ QR GIẢ LẬP (PHỦ KHU VỰC BẢN ĐỒ & SIDEBAR) */}
                    {scanning && (
                        <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                            <div className="relative w-36 h-36 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center mb-6 overflow-hidden bg-slate-900">
                                <QrCode size={72} className="text-emerald-400" />
                                <div
                                    className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399]"
                                    style={{ animation: "scan 1.5s infinite ease-in-out" }}
                                />
                            </div>
                            <h3 className="text-emerald-400 font-bold tracking-wider uppercase text-sm animate-pulse flex items-center gap-1.5 justify-center">
                                <Sparkles size={16} className="animate-spin text-emerald-400" />
                                Đang xử lý quét mã QR...
                            </h3>
                            <p className="text-slate-400 text-xs mt-3 font-semibold px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 max-w-[80%] truncate">
                                {scannedBranchName}
                            </p>
                        </div>
                    )}

                    {/* BÊN TRÁI: DANH SÁCH CHI NHÁNH KẾT QUẢ TÌM KIẾM */}
                    <aside className="w-full lg:w-[32%] h-[300px] lg:h-full flex flex-col bg-slate-50 border-r border-slate-200 dark:bg-[#0b1322] dark:border-slate-800 shrink-0">
                        {/* Tiêu đề Kết quả */}
                        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                                KẾT QUẢ TÌM THẤY ({filteredBranches.length})
                            </span>
                        </div>

                        {/* Danh sách thẻ Card cuộn dọc */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                            {filteredBranches.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                                    Không tìm thấy sân phù hợp.
                                </div>
                            ) : (
                                filteredBranches.map(branch => {
                                    const isSelected = selectedBranch?.id === branch.id;
                                    return (
                                        <div
                                            key={branch.id}
                                            onClick={() => setSelectedBranch(branch)}
                                            className={`p-3.5 rounded-xl cursor-pointer transition-all duration-300 flex flex-col ${isSelected
                                                ? "bg-emerald-50/40 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.08)] dark:bg-slate-900 dark:border-emerald-500 dark:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                                : "bg-white border border-slate-200/80 hover:border-emerald-400 hover:bg-slate-50/50 dark:bg-[#0f172a] dark:border-slate-800/70 dark:hover:border-slate-700 dark:hover:bg-slate-900/60"
                                                }`}
                                        >
                                            {/* Tiêu đề & Rating */}
                                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                                <h3 className="font-bold text-xs text-slate-800 dark:text-white leading-tight">{branch.name}</h3>
                                                <div className="flex items-center gap-0.5 text-[10px] text-amber-500 dark:text-amber-400 font-bold shrink-0">
                                                    <span>★</span>
                                                    <span>{branch.rating}</span>
                                                </div>
                                            </div>

                                            {/* Địa chỉ cụ thể */}
                                            <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-relaxed mb-3 flex items-start gap-1">
                                                <MapPin size={11} className="text-rose-400 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2">{branch.address}</span>
                                            </p>

                                            {/* Footer thẻ: Sân trống & nút đặt lịch nhanh */}
                                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/40">
                                                <span className="text-[9px] text-emerald-600 bg-emerald-50 dark:text-[#00f5a0] dark:bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
                                                    Có {branch.freeCourts} sân trống
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenGridForBranch(branch);
                                                    }}
                                                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] py-1.5 px-2.5 rounded-lg transition-all active:scale-[0.97] cursor-pointer"
                                                >
                                                    <span>Xem Chi Tiết Sân</span>
                                                    <span>→</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* PHẦN GIẢ LẬP QUÉT QR Ở DƯỚI CÙNG SIDEBAR */}
                        <div className="p-3 bg-slate-100 border-t border-slate-200 dark:bg-[#080d1a] dark:border-slate-800 shrink-0">
                            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest block mb-2">
                                Giả lập quét mã QR nhanh:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                                {branchesData.map(branch => (
                                    <button
                                        key={branch.id}
                                        onClick={() => handleSimulateQR(branch)}
                                        className="flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/15 dark:text-emerald-300 font-semibold py-1.5 px-2 rounded-lg transition-all text-[9px] text-left hover:border-emerald-400 truncate active:scale-[0.98] cursor-pointer"
                                    >
                                        <QrCode size={11} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                                        <span className="truncate">{branch.name.replace("Sân Cầu Lông Premium - ", "").replace("CLB Cầu Lông Thử Thách - ", "").replace("Sân Cầu Lông Đẳng Cấp - ", "")}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* BÊN PHẢI: BẢN ĐỒ CHIẾM HẦU HẾT KHÔNG GIAN */}
                    <div className="w-full lg:w-[68%] h-[280px] lg:h-full relative bg-slate-900">
                        {/* Leaflet Map Div */}
                        <div id="map" className="w-full h-full dark-map" style={{ zIndex: 1 }} />

                        {/* NÚT KHÁM PHÁ NỔI (MỞ TRONG MAPS) */}
                        {selectedBranch && (
                            <button
                                onClick={handleOpenInGoogleMaps}
                                className="absolute top-4 left-14 z-[10] flex items-center gap-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-lg transition-all cursor-pointer"
                            >
                                <ExternalLink size={12} />
                                <span>Mở trong Maps</span>
                            </button>
                        )}

                        {/* THẺ THÔNG TIN NỔI TRÊN BẢN ĐỒ */}
                        {selectedBranch && (
                            <div className="absolute top-4 right-4 z-[10] bg-white/95 border border-slate-200 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden dark:bg-[#0d1424]/95 dark:border-emerald-500/30"
                                style={{ width: 260, animation: "slideInCard 0.3s cubic-bezier(.22,1,.36,1)" }}>
                                <style>{`
                                    @keyframes slideInCard {
                                        from { opacity:0; transform: translateY(-12px) scale(0.96); }
                                        to   { opacity:1; transform: translateY(0) scale(1); }
                                    }
                                `}</style>

                                {/* Ảnh sân */}
                                <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
                                    <img
                                        src={selectedBranch.image}
                                        alt={selectedBranch.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                                    />
                                    {/* gradient overlay */}
                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(13,20,36,.9) 100%)" }} />
                                    {/* Badge ĐANG CHỌN */}
                                    <span style={{
                                        position: "absolute", top: 8, left: 8,
                                        background: "rgba(0,245,160,.15)", border: "1px solid rgba(0,245,160,.4)",
                                        color: "#00f5a0", fontSize: 8, fontWeight: 800,
                                        padding: "3px 8px", borderRadius: 99, letterSpacing: 1.2, textTransform: "uppercase"
                                    }}>
                                        📍 Đang chọn vị trí
                                    </span>
                                    {/* Rating */}
                                    <span style={{
                                        position: "absolute", top: 8, right: 8,
                                        background: "rgba(251,191,36,.2)", border: "1px solid rgba(251,191,36,.4)",
                                        color: "#fde68a", fontSize: 10, fontWeight: 800,
                                        padding: "3px 8px", borderRadius: 99, display: "flex", alignItems: "center", gap: 3
                                    }}>
                                        ★ {selectedBranch.rating}
                                    </span>
                                    {/* Tên sân trên ảnh */}
                                    <div style={{ position: "absolute", bottom: 8, left: 10, right: 10 }}>
                                        <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 900, lineHeight: 1.3, textShadow: "0 1px 6px rgba(0,0,0,.8)" }}>
                                            {selectedBranch.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Thông tin chi tiết */}
                                <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
                                    {/* Địa chỉ */}
                                    <p style={{ margin: 0, color: theme === "dark" ? "#94a3b8" : "#475569", fontSize: 10, display: "flex", alignItems: "flex-start", gap: 5, lineHeight: 1.4 }}>
                                        <MapPin size={11} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                                        <span>{selectedBranch.address}</span>
                                    </p>

                                    {/* Giờ & Giá */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 5, color: theme === "dark" ? "#93c5fd" : "#1e40af", fontSize: 10, fontWeight: 600 }}>
                                            <Clock size={11} color={theme === "dark" ? "#60a5fa" : "#2563eb"} />
                                            {selectedBranch.openTime}
                                        </span>
                                        <span style={{ color: theme === "dark" ? "#00f5a0" : "#10b981", fontSize: 11, fontWeight: 800 }}>
                                            {selectedBranch.priceRange.split(' - ')[0]}
                                        </span>
                                    </div>

                                    {/* Số sân trống */}
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        background: theme === "dark" ? "rgba(0,245,160,.08)" : "rgba(16,185,129,.05)",
                                        border: theme === "dark" ? "1px solid rgba(0,245,160,.2)" : "1px solid rgba(16,185,129,.15)",
                                        borderRadius: 8, padding: "5px 9px"
                                    }}>
                                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: theme === "dark" ? "#00f5a0" : "#10b981", flexShrink: 0, boxShadow: theme === "dark" ? "0 0 6px #00f5a0" : "none" }} />
                                        <span style={{ color: theme === "dark" ? "#6ee7b7" : "#047857", fontSize: 10, fontWeight: 700 }}>
                                            Còn {selectedBranch.freeCourts} sân trống hôm nay
                                        </span>
                                    </div>

                                    {/* Nút đặt sân */}
                                    <button
                                        onClick={() => { setIsGridModalOpen(true); }}
                                        style={{
                                            width: "100%", padding: "8px 0",
                                            background: "linear-gradient(135deg, #00f5a0, #00d4aa)",
                                            border: "none", borderRadius: 10, cursor: "pointer",
                                            color: "#0a1628", fontSize: 11, fontWeight: 900,
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                                            boxShadow: "0 4px 14px rgba(0,245,160,.35)",
                                            transition: "transform .15s, box-shadow .15s"
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,245,160,.5)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,245,160,.35)"; }}
                                    >
                                        ⚡ Đặt Sân Ngay
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL LƯỚI ĐẶT GIỜ (BẢNG GRID TÍNH TOÁN) */}
            {isGridModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-6">
                    <div className="flex h-full w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0c1219] animate-in zoom-in-95 duration-200">

                        {/* Header của Modal đặt lịch */}
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-emerald-700 px-6 py-4 dark:border-emerald-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">Bảng Chọn Giờ Đặt Lịch</h2>
                                <p className="text-emerald-200 text-xs mt-0.5">{selectedBranch?.name}</p>
                            </div>
                            <button
                                onClick={() => setIsGridModalOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 cursor-pointer font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Thanh công cụ: Chọn ngày & giải thích chú thích màu sắc */}
                        <div className="flex flex-col sm:flex-row shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-emerald-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4 text-xs font-semibold">
                                <div className="flex items-center gap-1.5">
                                    <span className="block h-4.5 w-4.5 rounded border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"></span>
                                    <span className="text-slate-600 dark:text-slate-300">Trống</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="block h-4.5 w-4.5 rounded border border-red-500 bg-red-400"></span>
                                    <span className="text-slate-600 dark:text-slate-300">Đã đặt trước</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="block h-4.5 w-4.5 rounded border border-emerald-600 bg-emerald-500 shadow-sm shadow-emerald-500/40"></span>
                                    <span className="text-slate-600 dark:text-slate-300">Đang chọn</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Chọn ngày thi đấu:</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedCells([]); // Reset các ô đã chọn khi đổi ngày
                                    }}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        {/* BẢNG LƯỚI GRID CHI TIẾT (CUỘN TRANG) */}
                        <div className="flex-1 overflow-auto bg-slate-50 p-4 dark:bg-[#121b24] relative">
                            <div className="inline-block min-w-full rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 z-20 w-32 border-b border-r border-slate-200 bg-slate-100 px-4 py-3 text-left text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                Tên Sân con
                                            </th>
                                            {normalizedTimeSlots.slice(0, -1).map((time) => (
                                                <th key={time} className="min-w-[48px] border-b border-r border-slate-100 bg-slate-50 px-1 py-2 text-center text-[10px] font-semibold text-slate-500 dark:border-slate-700/50 dark:bg-slate-800 dark:text-slate-400">
                                                    {time}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeCourts.map(court => (
                                            <tr key={court.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                                <td className="sticky left-0 z-10 w-32 border-b border-r border-slate-200 bg-white px-4 py-3 text-xs font-bold text-emerald-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400">
                                                    {court.name.split(' - ')[0]}
                                                    <span className="block text-[9px] font-normal text-slate-400 mt-0.5">{court.price}</span>
                                                </td>
                                                {normalizedTimeSlots.slice(0, -1).map((time) => {
                                                    const isBooked = mockedBookedSlots[court.id]?.includes(time);
                                                    const isSelected = selectedCells.some(cell => cell.courtId === court.id && cell.time === time);

                                                    let cellClass = "cursor-pointer bg-white hover:bg-emerald-50 dark:bg-slate-800/50 dark:hover:bg-emerald-950/40";
                                                    if (isBooked) {
                                                        cellClass = "bg-red-400/90 dark:bg-red-500/80 cursor-not-allowed";
                                                    } else if (isSelected) {
                                                        cellClass = "bg-emerald-500 dark:bg-emerald-600 shadow-inner";
                                                    }

                                                    return (
                                                        <td
                                                            key={`${court.id}-${time}`}
                                                            onClick={() => handleCellClick(court.id, time)}
                                                            className={`border-b border-r border-slate-100 transition-colors duration-150 dark:border-slate-700/50 ${cellClass}`}
                                                        >
                                                            <div className="h-10 w-full"></div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* THANH TOÁN & TIẾP TỤC Ở FOOTER MODAL */}
                        <div className="flex shrink-0 items-center justify-between border-t border-emerald-700 bg-[#0e172a] px-6 py-4 text-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Tổng thời gian đặt</span>
                                    <span className="text-lg font-bold text-emerald-400">{timeString}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Tổng tiền tạm tính</span>
                                    <span className="text-lg font-bold text-amber-400">{totalMoney.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={selectedCells.length === 0}
                                className={`rounded-xl px-8 py-3 font-bold text-sm transition-all cursor-pointer ${selectedCells.length > 0
                                    ? "bg-amber-400 text-slate-900 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/30 active:scale-95"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
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

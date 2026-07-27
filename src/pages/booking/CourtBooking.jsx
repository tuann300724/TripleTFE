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
import {
    branchesData,
    mockedBookedSlots,
    timeSlots,
    normalizedTimeSlots
} from "./bookingData";
import { useNavigate } from "react-router-dom";

export default function CourtBooking() {
    const navigate = useNavigate();
    const [selectedBranch, setSelectedBranch] = useState(branchesData[2]); // Chọn mặc định Tân Hiệp như trong ảnh mẫu ( Quận 7 / Sân Tân Hiệp)
    const [activeCourts, setActiveCourts] = useState(branchesData[2]?.courts || []);

    useEffect(() => {
        if (selectedBranch) {
            setActiveCourts(selectedBranch.courts || []);
        }
    }, [selectedBranch]);
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
                                         <div class="w-8 h-8 rounded-full bg-blue-500/25 flex items-center justify-center border border-rose-500/40 relative">
                           <div class="w-4.5 h-4.5 rounded-full bg-blue-600 shadow-md"></div>
                           <div class="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-35"></div>
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
    };

    return (
        <div className="bg-gradient-to-b from-[#080f1a] to-[#0c1527] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
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
                    border: 1px solid rgba(255,255,255,0.08) !important;
                    background: #0d1627 !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
                }
                .leaflet-bar a {
                    background: #0d1627 !important;
                    color: #94a3b8 !important;
                    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                }
                .leaflet-bar a:hover {
                    background: #1e293b !important;
                    color: #fff !important;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 5px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.15);
                    border-radius: 99px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.35);
                }
            `}</style>

            {/* KHUNG TOÀN CỤC CHỨA HEADER & BODY MAP */}
            <div className="max-w-[1240px] mx-auto flex flex-col rounded-3xl overflow-hidden border border-white/5 bg-[#0b1424]/40 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.4)]">

                {/* THANH HEADER TIÊU ĐỀ & TÌM KIẾM (Y CHANG ẢNH MẪU) */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 bg-[#0d1627]/80 border-b border-white/5 shrink-0">
                    {/* Logo & Tên thương hiệu */}
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/25 animate-pulse text-sm">
                            🏸
                        </div>
                        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f5a0] to-emerald-400 tracking-wider text-sm md:text-base">
                            COURTMAP BOOKING
                        </span>
                    </div>

                    {/* Bộ lọc Tìm kiếm & Chọn Vùng miền */}
                    <div className="flex items-center gap-3 flex-1 md:justify-end">
                        <div className="relative w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sân gần bạn hoặc nhập địa chỉ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/10 transition-colors font-semibold"
                            />
                            <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
                        </div>
                        <select
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-300 outline-none focus:border-emerald-500/80 cursor-pointer transition-colors font-semibold hover:border-white/20"
                        >
                            <option value="all">Toàn quốc</option>
                            <option value="tphcm">TP. Hồ Chí Minh</option>
                            <option value="dong-nai">Đồng Nai</option>
                            <option value="binh-phuoc">Bình Phước</option>
                        </select>
                    </div>
                </header>

                {/* BẢN ĐỒ & SIDEBAR CHIA ĐÔI BỐ CỤC (SIDEBAR TRÁI, MAP PHẢI) */}
                <div className="flex flex-col lg:flex-row h-[620px] w-full relative overflow-hidden">

                    {/* HIỆU ỨNG QUÉT MÃ QR GIẢ LẬP (PHỦ KHU VỰC BẢN ĐỒ & SIDEBAR) */}
                    {scanning && (
                        <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                            <div className="relative w-36 h-36 border-2 border-emerald-500/50 rounded-3xl flex items-center justify-center mb-6 overflow-hidden bg-slate-900">
                                <QrCode size={72} className="text-emerald-400" />
                                <div
                                    className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399]"
                                    style={{ animation: "scan 1.5s infinite ease-in-out" }}
                                />
                            </div>
                            <h3 className="text-emerald-400 font-bold tracking-wider uppercase text-xs animate-pulse flex items-center gap-1.5 justify-center">
                                <Sparkles size={16} className="animate-spin text-emerald-400" />
                                Đang xử lý quét mã QR...
                            </h3>
                            <p className="text-slate-400 text-[10px] mt-3 font-semibold px-4 py-1.5 rounded-full bg-slate-800/80 border border-white/5 max-w-[80%] truncate">
                                {scannedBranchName}
                            </p>
                        </div>
                    )}

                    {/* BÊN TRÁI: DANH SÁCH CHI NHÁNH KẾT QUẢ TÌM KIẾM */}
                    <aside className="w-full lg:w-[34%] h-[320px] lg:h-full flex flex-col bg-[#080f1e]/80 border-r border-white/5 shrink-0">
                        {/* Tiêu đề Kết quả */}
                        <div className="p-4 border-b border-white/5 bg-black/10 shrink-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                KẾT QUẢ TÌM THẤY ({filteredBranches.length})
                            </span>
                        </div>

                        {/* Danh sách thẻ Card cuộn dọc */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                            {filteredBranches.length === 0 ? (
                                <div className="text-center py-10 text-slate-500 text-xs font-semibold">
                                    Không tìm thấy sân phù hợp.
                                </div>
                            ) : (
                                filteredBranches.map(branch => {
                                    const isSelected = selectedBranch?.id === branch.id;
                                    return (
                                        <div
                                            key={branch.id}
                                            onClick={() => setSelectedBranch(branch)}
                                            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col hover:-translate-y-0.5 active:scale-[0.99] ${isSelected
                                                ? "bg-[#102436]/90 border border-emerald-500/50 shadow-[0_4px_25px_rgba(16,185,129,0.15)]"
                                                : "bg-[#0c1525]/60 border border-white/5 hover:border-white/10 hover:bg-[#101c30]/50"
                                                }`}
                                        >
                                            {/* Tiêu đề & Rating */}
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <h3 className="font-black text-xs text-white leading-tight hover:text-emerald-400 transition-colors">{branch.name}</h3>
                                                <div className="flex items-center gap-0.5 text-[9px] text-amber-300 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                                                    <span>★</span>
                                                    <span>{branch.rating}</span>
                                                </div>
                                            </div>

                                            {/* Địa chỉ cụ thể */}
                                            <p className="text-slate-400 text-[10px] leading-relaxed mb-4 flex items-start gap-1 font-semibold">
                                                <MapPin size={11} className="text-rose-400 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2">{branch.address}</span>
                                            </p>

                                            {/* Footer thẻ: Sân trống & nút đặt lịch nhanh */}
                                            <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/5">
                                                <span className="text-[9px] text-[#00f5a0] font-black bg-[#00f5a0]/10 border border-[#00f5a0]/25 px-2 py-1 rounded-lg">
                                                    Có {branch.freeCourts} sân trống
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenGridForBranch(branch);
                                                    }}
                                                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[9px] py-2 px-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/15 hover:shadow-emerald-500/35 hover:scale-[1.03] active:scale-100 cursor-pointer border-0"
                                                >
                                                    <span>Đặt Sân Ngay</span>
                                                    <span>→</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* PHẦN GIẢ LẬP QUÉT QR Ở DƯỚI CÙNG SIDEBAR */}
                        <div className="p-4 bg-[#050b15] border-t border-white/5 shrink-0">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2.5">
                                Giả lập quét mã QR nhanh:
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                {branchesData.map(branch => (
                                    <button
                                        key={branch.id}
                                        onClick={() => handleSimulateQR(branch)}
                                        className="flex items-center gap-1.5 border border-emerald-500/15 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 font-extrabold py-2 px-2.5 rounded-xl transition-all text-[9px] text-left hover:border-emerald-400/40 truncate active:scale-[0.98] cursor-pointer"
                                    >
                                        <QrCode size={11} className="text-emerald-400 shrink-0" />
                                        <span className="truncate">{branch.name.replace("Sân Cầu Lông Premium - ", "").replace("CLB Cầu Lông Thử Thách - ", "").replace("Sân Cầu Lông Đẳng Cấp - ", "")}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* BÊN PHẢI: BẢN ĐỒ CHIẾM HẦU HẾT KHÔNG GIAN */}
                    <div className="w-full lg:w-[66%] h-[300px] lg:h-full relative bg-slate-900">
                        {/* Leaflet Map Div */}
                        <div id="map" className="w-full h-full dark-map" style={{ zIndex: 1 }} />

                        {/* NÚT KHÁM PHÁ NỔI (MỞ TRONG MAPS) */}
                        {selectedBranch && (
                            <button
                                onClick={handleOpenInGoogleMaps}
                                className="absolute top-4 left-14 z-[10] flex items-center gap-1.5 bg-[#0f172a]/95 hover:bg-[#1a263f] text-slate-200 text-[10px] font-black px-3.5 py-2 rounded-xl border border-white/10 shadow-xl transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md hover:scale-[1.02]"
                            >
                                <ExternalLink size={12} />
                                <span>Mở trong Maps</span>
                            </button>
                        )}

                        {/* THẺ THÔNG TIN NỔI TRÊN BẢN ĐỒ */}
                        {selectedBranch && (
                            <div className="absolute top-4 right-4 z-[10] w-[260px] bg-[#0d1424]/95 border border-emerald-500/30 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden animate-[slideInCard_0.3s_cubic-bezier(.22,1,.36,1)]">
                                <style>{`
                                    @keyframes slideInCard {
                                        from { opacity:0; transform: translateY(-12px) scale(0.96); }
                                        to   { opacity:1; transform: translateY(0) scale(1); }
                                    }
                                `}</style>

                                {/* Ảnh sân */}
                                <div className="relative h-[130px] overflow-hidden">
                                    <img
                                        src={selectedBranch.image}
                                        alt={selectedBranch.name}
                                        className="w-full h-full object-cover object-center"
                                    />
                                    {/* gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d1424]/95" />
                                    {/* Badge ĐANG CHỌN */}
                                    <span className="absolute top-2 left-2 bg-emerald-500/15 border border-emerald-500/40 text-[#00f5a0] text-[8px] font-extrabold px-2 py-0.5 rounded-full tracking-widest uppercase">
                                        📍 Đang chọn vị trí
                                    </span>
                                    {/* Rating */}
                                    <span className="absolute top-2 right-2 bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                        ★ {selectedBranch.rating}
                                    </span>
                                    {/* Tên sân trên ảnh */}
                                    <div className="absolute bottom-2 left-2.5 right-2.5">
                                        <p className="m-0 text-white text-xs font-black leading-tight [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
                                            {selectedBranch.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Thông tin chi tiết */}
                                <div className="p-3 flex flex-col gap-2">
                                    {/* Địa chỉ */}
                                    <p className="m-0 text-slate-400 text-[10px] flex items-start gap-1 leading-normal font-semibold">
                                        <MapPin size={11} className="text-[#ff455f] shrink-0 mt-0.5" />
                                        <span>{selectedBranch.address}</span>
                                    </p>

                                    {/* Giờ & Giá */}
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1 text-blue-300 text-[10px] font-semibold">
                                            <Clock size={11} className="text-blue-400" />
                                            {selectedBranch.openTime}
                                        </span>
                                        <span className="text-[#00f5a0] text-xs font-extrabold">
                                            {selectedBranch.priceRange.split(' - ')[0]}
                                        </span>
                                    </div>

                                    {/* Số sân trống */}
                                    <div className="flex items-center gap-1.5 bg-[#00f5a0]/8 border border-[#00f5a0]/25 rounded-lg px-2 py-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] shrink-0 shadow-[0_0_6px_#00f5a0]" />
                                        <span className="text-emerald-300 text-[10px] font-bold">
                                            Còn {selectedBranch.freeCourts} sân trống hôm nay
                                        </span>
                                    </div>

                                    {/* Nút đặt sân */}
                                    <button
                                        onClick={() => handleOpenGridForBranch(selectedBranch)}
                                        className="w-full py-2 bg-gradient-to-r from-[#00f5a0] to-[#00d4aa] rounded-xl text-[#0a1628] text-[11px] font-black flex items-center justify-center gap-1 shadow-lg shadow-[#00f5a0]/30 hover:scale-[1.02] hover:shadow-[#00f5a0]/50 active:scale-100 transition-all duration-200 cursor-pointer border-0"
                                    >
                                        ⚡ Đặt Sân Ngay
                                    </button>

                                </div>

                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL LƯỚI ĐẶT GIỜ (BẢNG GRID TÍNH TOÁN) */}
                {isGridModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6">
                        <div className="flex h-full w-full max-w-[1100px] max-h-[640px] flex-col overflow-hidden rounded-3xl bg-[#0c1219] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-200">

                            {/* Header của Modal đặt lịch */}
                            <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-[#0d1627] px-6 py-4">
                                <div>
                                    <h2 className="text-sm md:text-base font-black text-white">Bảng Chọn Giờ Đặt Lịch</h2>
                                    <p className="text-emerald-400 text-xs mt-1 font-bold">{selectedBranch?.name}</p>
                                </div>
                                <button
                                    onClick={() => setIsGridModalOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-colors cursor-pointer text-xs font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Thanh công cụ: Chọn ngày & giải thích chú thích màu sắc */}
                            <div className="flex flex-col sm:flex-row shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-[#080f1e]/60 px-6 py-3">
                                <div className="flex items-center gap-4 text-[10px] font-bold">
                                    <div className="flex items-center gap-1.5">
                                        <span className="block h-4 w-4 rounded border border-white/10 bg-[#08101a]"></span>
                                        <span className="text-slate-400">Trống</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="block h-4 w-4 rounded bg-rose-500/70"></span>
                                        <span className="text-slate-400">Đã đặt</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="block h-4 w-4 rounded bg-emerald-500 shadow-inner"></span>
                                        <span className="text-slate-400">Đang chọn</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Chọn ngày thi đấu:</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setSelectedCells([]); // Reset các ô đã chọn khi đổi ngày
                                        }}
                                        className="bg-[#0d1627] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* BẢNG LƯỚI GRID CHI TIẾT (CUỘN TRANG) */}
                            <div className="flex-1 overflow-auto bg-[#08101a] p-4 relative scrollbar-thin">
                                <div className="inline-block min-w-full rounded-2xl border border-white/5 bg-[#0b1422] shadow-xl overflow-hidden">
                                    <table className="w-full border-collapse table-fixed min-w-max">
                                        <thead>
                                            <tr>
                                                <th className="sticky left-0 z-20 w-32 border-b border-r border-white/10 bg-[#0d1627] p-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    Tên Sân
                                                </th>
                                                {normalizedTimeSlots.slice(0, -1).map((time) => (
                                                    <th key={time} className="w-11 border-b border-r border-white/5 bg-[#0c1525] py-2.5 text-center text-[9px] font-black text-slate-500">
                                                        {time}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeCourts.map((court, ri) => (
                                                <tr key={court.id} className={ri % 2 === 0 ? "bg-[#0b1422]" : "bg-[#0c1525]"}>
                                                    <td className={`sticky left-0 z-10 w-32 border-r border-white/10 border-b border-white/5 px-3 py-2.5 shadow-[2px_0_5px_rgba(0,0,0,0.3)] ${ri % 2 === 0 ? "bg-[#0d1730]" : "bg-[#0d1830]"}`}>
                                                        <p className="m-0 text-xs font-black text-emerald-400 leading-none">
                                                            {court.name.split(' - ')[0]}
                                                        </p>
                                                        <p className="m-0 mt-1 text-[9px] font-bold text-slate-400">{court.price}</p>
                                                    </td>
                                                    {normalizedTimeSlots.slice(0, -1).map((time) => {
                                                        const isBooked = mockedBookedSlots[court.id]?.includes(time);
                                                        const isSelected = selectedCells.some(cell => cell.courtId === court.id && cell.time === time);

                                                        let cellClass = "cursor-pointer hover:bg-emerald-500/20";
                                                        if (isBooked) {
                                                            cellClass = "bg-rose-500/70 cursor-not-allowed";
                                                        } else if (isSelected) {
                                                            cellClass = "bg-emerald-500 shadow-inner";
                                                        }

                                                        return (
                                                            <td
                                                                key={`${court.id}-${time}`}
                                                                onClick={() => handleCellClick(court.id, time)}
                                                                className={`h-9 w-11 border-r border-b border-white/5 transition-colors duration-100 ${cellClass}`}
                                                            />
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* THANH TOÁN & TIẾP TỤC Ở FOOTER MODAL */}
                            <div className="flex shrink-0 items-center justify-between border-t border-white/5 bg-[#0d1627] px-6 py-4 text-white shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Tổng thời gian đặt</span>
                                        <span className="text-base font-black text-emerald-400 mt-1">{timeString}</span>
                                    </div>
                                    <div className="flex flex-col border-l border-white/10 pl-8">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Tổng tiền tạm tính</span>
                                        <span className="text-base font-black text-amber-400 mt-1">{totalMoney.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={selectedCells.length === 0}
                                    className={`rounded-xl px-7 py-3 font-black text-xs transition-all shadow-md border-0 cursor-pointer ${selectedCells.length > 0
                                        ? "bg-amber-400 text-slate-900 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95"
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
        </div>
    );
}

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
    QrCode,
    MapPin,
    Clock,
    Search,
    ExternalLink,
    Target,
    Star,
    Zap
} from "lucide-react";
import { branchesData, mockedBookedSlots } from "./bookingData";
import Breadcrumb from "../../components/Breadcrumb";
import BranchCard from "./components/BranchCard";
import QRScannerOverlay from "./components/QRScannerOverlay";
import BookingGridModal from "./components/BookingGridModal";
import { useToast } from "../../components/Toast";

export default function CourtBooking() {
    const navigate = useNavigate();
    const toast = useToast();
    const { theme } = useTheme();
    const [selectedBranch, setSelectedBranch] = useState(branchesData[2]);
    const activeCourts = selectedBranch?.courts || [];
    const [isGridModalOpen, setIsGridModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const [selectedCells, setSelectedCells] = useState([]);

    const [scanning, setScanning] = useState(false);
    const [scannedBranchName, setScannedBranchName] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [regionFilter, setRegionFilter] = useState("all");

    const mapRef = useRef(null);
    const markersRef = useRef([]);

    const filteredBranches = branchesData.filter(branch => {
        const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion = regionFilter === "all" ||
            (regionFilter === "tphcm" && branch.address.includes("TP.HCM")) ||
            (regionFilter === "dong-nai" && branch.address.includes("Đồng Nai")) ||
            (regionFilter === "binh-phuoc" && branch.address.includes("Bình Phước"));

        return matchesSearch && matchesRegion;
    });

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedCells([]);
    };

    const initializeMap = () => {
        if (!window.L || mapRef.current) return;

        const map = window.L.map("map", {
            center: [11.35, 106.9],
            zoom: 9,
            zoomControl: true
        });
        mapRef.current = map;

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    };

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

    useEffect(() => {
        if (!window.L || !mapRef.current) return;

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

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

    useEffect(() => {
        if (selectedBranch && mapRef.current) {
            mapRef.current.flyTo(selectedBranch.coords, 12, {
                animate: true,
                duration: 1.5
            });
        }
    }, [selectedBranch]);

    const handleSimulateQR = (branch) => {
        setScanning(true);
        setScannedBranchName(branch.name);

        setTimeout(() => {
            setScanning(false);
            setSelectedBranch(branch);
        }, 1200);
    };

    const handleOpenGridForBranch = (branch) => {
        navigate(`/booking/${branch.id}`);
    };

    const handleOpenInGoogleMaps = () => {
        if (!selectedBranch) return;
        const [lat, lng] = selectedBranch.coords;
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    };

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

    const handleConfirmBooking = () => {
        if (selectedCells.length === 0) return;
        toast(`Đã đặt thành công ${selectedCells.length} khung giờ tại ${selectedBranch.name} vào ngày ${selectedDate}.\nTổng tiền: ${totalMoney.toLocaleString('vi-VN')}đ`, "success");
        setSelectedCells([]);
        setIsGridModalOpen(false);
    };

    return (
        <div className="min-h-screen py-10 px-4 md:px-8 bg-slate-50 dark:bg-[#0c1219]">
            <style>{`
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

            <div className="max-w-6xl mx-auto flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c111c] shadow-2xl">

                <Breadcrumb items={[{ label: "Đặt sân" }]} />

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 bg-slate-50 dark:bg-[#0d1424] border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
                            <Target className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-extrabold text-emerald-600 dark:text-[#00f5a0] tracking-wider text-sm md:text-base">
                            COURTMAP BOOKING
                        </span>
                    </div>

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

                <div className="flex flex-col lg:flex-row h-[580px] w-full relative overflow-hidden">

                    <QRScannerOverlay scanning={scanning} scannedBranchName={scannedBranchName} />

                    <aside className="w-full lg:w-[32%] h-[300px] lg:h-full flex flex-col bg-slate-50 border-r border-slate-200 dark:bg-[#0b1322] dark:border-slate-800 shrink-0">
                        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                                KẾT QUẢ TÌM THẤY ({filteredBranches.length})
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                            {filteredBranches.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                                    Không tìm thấy sân phù hợp.
                                </div>
                            ) : (
                                filteredBranches.map(branch => (
                                    <BranchCard
                                        key={branch.id}
                                        branch={branch}
                                        isSelected={selectedBranch?.id === branch.id}
                                        onSelect={setSelectedBranch}
                                        onViewDetails={handleOpenGridForBranch}
                                    />
                                ))
                            )}
                        </div>

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

                    <div className="w-full lg:w-[68%] h-[280px] lg:h-full relative bg-slate-900">
                        <div id="map" className="w-full h-full dark-map" style={{ zIndex: 1 }} />

                        {selectedBranch && (
                            <button
                                onClick={handleOpenInGoogleMaps}
                                className="absolute top-4 left-14 z-[10] flex items-center gap-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-lg transition-all cursor-pointer"
                            >
                                <ExternalLink size={12} />
                                <span>Mở trong Maps</span>
                            </button>
                        )}

                        {selectedBranch && (
                            <div className="absolute top-4 right-4 z-[10] bg-white/95 border border-slate-200 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden dark:bg-[#0d1424]/95 dark:border-emerald-500/30 w-64"
                                style={{ animation: "slideInCard 0.3s cubic-bezier(.22,1,.36,1)" }}>
                                <style>{`
                                    @keyframes slideInCard {
                                        from { opacity:0; transform: translateY(-12px) scale(0.96); }
                                        to   { opacity:1; transform: translateY(0) scale(1); }
                                    }
                                `}</style>

                                <div className="relative h-[130px] overflow-hidden">
                                    <img
                                        src={selectedBranch.image}
                                        alt={selectedBranch.name}
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90" />
                                    <span className="absolute top-2 left-2 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-400 text-[8px] font-extrabold px-2 py-[3px] uppercase tracking-wider">
                                        <MapPin size={10} className="inline" /> Đang chọn vị trí
                                    </span>
                                    <span className="absolute top-2 right-2 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 text-[10px] font-extrabold px-2 py-[3px] flex items-center gap-[3px]">
                                        <Star size={10} className="inline fill-amber-200" /> {selectedBranch.rating}
                                    </span>
                                    <div className="absolute bottom-2 left-2.5 right-2.5">
                                        <p className="text-white text-xs font-black leading-tight drop-shadow-[0_1px_6px_rgba(0,0,0,.8)]">
                                            {selectedBranch.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-3 py-2.5 flex flex-col gap-[7px]">
                                    <p className="m-0 flex items-start gap-[5px] text-slate-600 dark:text-slate-400 text-[10px] leading-[1.4]">
                                        <MapPin size={11} color="#f87171" className="shrink-0 mt-[1px]" />
                                        <span>{selectedBranch.address}</span>
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-[5px] text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                                            <Clock size={11} className="text-blue-600 dark:text-blue-400" />
                                            {selectedBranch.openTime}
                                        </span>
                                        <span className="text-emerald-600 dark:text-[#00f5a0] text-[11px] font-extrabold">
                                            {selectedBranch.priceRange.split(' - ')[0]}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-[6px] bg-emerald-50 dark:bg-[rgba(0,245,160,.08)] border border-emerald-200 dark:border-[rgba(0,245,160,.2)] rounded-lg px-[9px] py-[5px]">
                                        <span className="w-[7px] h-[7px] rounded-full bg-emerald-600 dark:bg-[#00f5a0] shrink-0 dark:shadow-[0_0_6px_#00f5a0]" />
                                        <span className="text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                            Còn {selectedBranch.freeCourts} sân trống hôm nay
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => { setIsGridModalOpen(true); }}
                                        className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 text-[11px] font-black flex items-center justify-center gap-1 shadow-lg shadow-emerald-400/30 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-emerald-400/50 active:translate-y-0"
                                    >
                                        <Zap size={14} /> Đặt Sân Ngay
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BookingGridModal
                isOpen={isGridModalOpen}
                onClose={() => setIsGridModalOpen(false)}
                selectedBranch={selectedBranch}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                activeCourts={activeCourts}
                selectedCells={selectedCells}
                onCellClick={handleCellClick}
                onConfirmBooking={handleConfirmBooking}
                totalMoney={totalMoney}
                timeString={timeString}
            />
        </div>
    );
}

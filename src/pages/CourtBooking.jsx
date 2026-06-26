import { useState, useMemo } from "react";

// 1. Dữ liệu chi nhánh bổ sung liên kết nhúng Google Maps thực tế (embedMapUrl)
const branchesData = [
    {
        id: "cn1",
        name: "Sân Cầu Lông Premium - Bình Thạnh",
        address: "123 Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM",
        area: "Hồ Chí Minh",
        rating: 4.8,
        // Bản đồ nhúng mẫu (Bạn có thể thay bằng link nhúng từ Google Maps của sân thật)
        embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2234762512196!2d106.6985012757034!3d10.794191658863647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b7468132cb%3A0xbd8f8ef696f5b9d3!2zMTIzIMSQaeG7h24gQmnDqm4gUGjhu6csIFBoxrDhu51uZyAxNSwgQsOsbmggVGjhuqFuaCwgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1svi!2s!4v1717000000000!5m2!1svi!2s",
        courts: [
            { id: 1, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000, image: "https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA" },
            { id: 2, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000, image: "https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA" },
        ]
    },
    {
        id: "cn2",
        name: "Sân Cầu Lông Đẳng Cấp - Quận 7",
        address: "456 Nguyễn Thị Thập, Tân Phong, Quận 7, TP.HCM",
        area: "Hồ Chí Minh",
        rating: 4.9,
        embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9544111300994!2d106.70119107570252!3d10.738018559897074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f90a1961555%3A0x6e761d1565a44df8!2zNDU2IE5ndXnhu4VuIFRo4buLIFRo4bqtcCwgVMOibiBQaG9uZywgIFF14bqtbiA3LCBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1svi!2s!4v1717000000001!5m2!1svi!2s",
        courts: [
            { id: 4, name: "Sân 1 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000, image: "https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA" }
        ]
    },
    {
        id: "cn3",
        name: "CLB Cầu Lông Thử Thách - Cầu Giấy",
        address: "78 Duy Tân, Cầu Giấy, Hà Nội",
        area: "Hà Nội",
        rating: 4.6,
        embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096814112423!2d105.78184857591645!3d21.028820087777174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd0510529%3A0xa14ff25cfb8813d4!2zNzggRHV5IFTDom4sIEThu4tjaCBW4buNbmcgSOG6rXUsIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1717000000002!5m2!1svi!2s",
        courts: [
            { id: 6, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "120.000đ/h", pricePerSlot: 60000, image: "https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA" }
        ]
    }
];

const timeSlots = Array.from({ length: 33 }, (_, i) => {
    const h = Math.floor(i / 2) + 6;
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
});

const mockedBookedSlots = { 1: ["07:00", "07:30"], 2: ["12:00"] };
const normalizeTime = (t) => { const [h, m] = t.split(":"); return `${h.padStart(2, '0')}:${m}`; };
const normalizedTimeSlots = timeSlots.map(normalizeTime);

export default function CourtBooking() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedArea, setSelectedArea] = useState("All");
    
    // Mặc định chọn chi nhánh đầu tiên để hiển thị map ban đầu
    const [activeBranch, setActiveBranch] = useState(branchesData[0]);
    // Trạng thái xem chi tiết danh sách sân của chi nhánh đó
    const [isViewingDetails, setIsViewingDetails] = useState(false);

    // Modal Đặt lịch Grid
    const [isGridModalOpen, setIsGridModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedCells, setSelectedCells] = useState([]);

    // Lọc chi nhánh theo ô tìm kiếm
    const filteredBranches = useMemo(() => {
        return branchesData.filter(branch => {
            const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  branch.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesArea = selectedArea === "All" || branch.area === selectedArea;
            return matchesSearch && matchesArea;
        });
    }, [searchTerm, selectedArea]);

    const handleBranchSelect = (branch) => {
        setActiveBranch(branch);
    };

    const handleOpenGrid = () => setIsGridModalOpen(true);

    const handleCellClick = (courtId, time) => {
        if (mockedBookedSlots[courtId]?.includes(time)) return;
        setSelectedCells((prev) => {
            const exists = prev.find(cell => cell.courtId === courtId && cell.time === time);
            return exists ? prev.filter(cell => !(cell.courtId === courtId && cell.time === time)) : [...prev, { courtId, time }];
        });
    };

    const calculateTotal = () => {
        let totalMoney = 0;
        selectedCells.forEach(cell => {
            let court = activeBranch.courts.find(c => c.id === cell.courtId);
            if (court) totalMoney += court.pricePerSlot;
        });
        const totalMinutes = selectedCells.length * 30;
        return { totalMoney, timeString: `${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 > 0 ? totalMinutes % 60 : ''}` };
    };

    const { totalMoney, timeString } = calculateTotal();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
            
            {/* THANH TÌM KIẾM CỐ ĐỊNH PHÍA TRÊN */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🏸</span>
                    <h1 className="text-xl font-black bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">COURTMAP BOOKING</h1>
                </div>

                <div className="flex flex-1 max-w-2xl w-full gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                        <input 
                            type="text"
                            placeholder="Tìm kiếm sân gần bạn hoặc nhập địa chỉ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>
                    <select 
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none dark:border-slate-700 dark:bg-slate-800"
                    >
                        <option value="All">Toàn quốc</option>
                        <option value="Hồ Chí Minh">TP. HCM</option>
                        <option value="Hà Nội">Hà Nội</option>
                    </select>
                </div>
            </header>

            {/* GIAO DIỆN CHÍNH CHIA ĐÔI: DANH SÁCH & BẢN ĐỒ */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                
                {/* CỘT TRÁI: HIỂN THỊ DANH SÁCH CHI NHÁNH / HOẶC CHI TIẾT SÂN */}
                <div className="w-full lg:w-[450px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[50vh] lg:h-[calc(100vh-73px)] overflow-y-auto p-4 shrink-0 shadow-lg z-10">
                    
                    {!isViewingDetails ? (
                        /* GIAO DIỆN DANH SÁCH CÁC CHI NHÁNH */
                        <div className="flex flex-col gap-3">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kết quả tìm thấy ({filteredBranches.length})</div>
                            
                            {filteredBranches.map(branch => {
                                const isActive = activeBranch?.id === branch.id;
                                return (
                                    <div 
                                        key={branch.id}
                                        onClick={() => handleBranchSelect(branch)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                                            isActive 
                                            ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500" 
                                            : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 line-clamp-1">{branch.name}</h3>
                                                <span className="text-xs text-amber-500 font-bold whitespace-nowrap">⭐ {branch.rating}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">📍 {branch.address}</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                                            <span className="text-xs text-slate-400 font-medium">Có {branch.courts.length} sân trống</span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveBranch(branch);
                                                    setIsViewingDetails(true);
                                                }}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                                            >
                                                Đặt Sân Ngay ➜
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredBranches.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm">Không có chi nhánh phù hợp từ khóa.</div>
                            )}
                        </div>
                    ) : (
                        /* GIAO DIỆN CHI TIẾT CÁC SÂN CON (Khi bấm Đặt sân ngay) */
                        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                            <button 
                                onClick={() => { setIsViewingDetails(false); setSelectedCells([]); }}
                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mb-2"
                            >
                                ⬅ Quay lại danh sách bản đồ
                            </button>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                                <h2 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">{activeBranch.name}</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">📍 {activeBranch.address}</p>
                            </div>

                            <button 
                                onClick={handleOpenGrid}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                            >
                                📅 Xem Lịch Đặt Tổng Hợp
                            </button>

                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Danh sách sân trực thuộc</h4>
                            
                            <div className="flex flex-col gap-3">
                                {activeBranch.courts.map(court => (
                                    <div key={court.id} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col shadow-sm">
                                        <div className="h-32 w-full relative">
                                            <img src={court.image} alt={court.name} className="h-full w-full object-cover"/>
                                            <span className="absolute bottom-2 right-2 bg-slate-900/80 text-emerald-400 font-bold text-xs px-2 py-0.5 rounded backdrop-blur-sm">{court.price}</span>
                                        </div>
                                        <div className="p-3 flex flex-col justify-between flex-1">
                                            <div>
                                                <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{court.name}</h5>
                                                <p className="text-[11px] text-slate-400">🏸 Thảm: {court.type}</p>
                                            </div>
                                            <button 
                                                onClick={handleOpenGrid}
                                                className="mt-3 w-full py-1.5 bg-slate-100 hover:bg-emerald-50 text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/30 dark:text-emerald-400 text-xs font-bold rounded-lg transition"
                                            >
                                                Chọn khung giờ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* CỘT PHẢI: MAP GOOGLE ĐỒNG BỘ THEO CHI NHÁNH ĐANG CHỌN */}
                <div className="flex-1 h-[50vh] lg:h-[calc(100vh-73px)] relative bg-slate-200 dark:bg-slate-800">
                    {activeBranch ? (
                        <iframe
                            title={activeBranch.name}
                            src={activeBranch.embedMapUrl}
                            className="w-full h-full border-0 grayscale dark:invert-[0.9] dark:hue-rotate-180" // Class filter màu tối cho Map nếu sài DarkMode
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">Vui lòng chọn một chi nhánh để hiển thị vị trí trên bản đồ</div>
                    )}

                    {/* Tiện ích Marker nhỏ ghim trên Map góc phải */}
                    {activeBranch && (
                        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-xl shadow-xl max-w-sm border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4 duration-300">
                            <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">Đang ghim vị trí</span>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-1 line-clamp-1">{activeBranch.name}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">📍 {activeBranch.address}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL GRID ĐẶT SÂN */}
            {isGridModalOpen && activeBranch && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4">
                    <div className="flex h-full w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0c1219] animate-in zoom-in-95 duration-200">
                        {/* HEADER LỊCH */}
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-emerald-700 px-5 py-3 dark:border-emerald-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">Bảng Đặt Lịch Trực Quan</h2>
                                <p className="text-xs text-emerald-200 font-medium line-clamp-1">Chi nhánh: {activeBranch.name}</p>
                            </div>
                            <button onClick={() => setIsGridModalOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 text-sm">✕</button>
                        </div>

                        {/* THANH CÔNG CỤ */}
                        <div className="flex flex-col sm:flex-row shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-emerald-50/50 px-5 py-2.5 dark:border-slate-800 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1.5"><span className="block h-4 w-4 rounded border bg-white"></span><span>Trống</span></div>
                                <div className="flex items-center gap-1.5"><span className="block h-4 w-4 rounded bg-red-400"></span><span>Đã đặt</span></div>
                                <div className="flex items-center gap-1.5"><span className="block h-4 w-4 rounded bg-emerald-500"></span><span>Đang chọn</span></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ngày chơi:</label>
                                <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedCells([]); }} className="rounded-lg border bg-white px-2 py-1 text-xs outline-none dark:bg-slate-800" />
                            </div>
                        </div>

                        {/* GRID THỜI GIAN TRONG TABLE */}
                        <div className="flex-1 overflow-auto bg-slate-50 p-4 dark:bg-[#121b24]">
                            <div className="inline-block min-w-full rounded-xl border bg-white dark:border-slate-700 dark:bg-slate-800">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 top-0 z-20 w-28 border-b border-r bg-slate-100 px-3 py-2 text-left text-xs font-bold dark:bg-slate-900">Tên Sân</th>
                                            {normalizedTimeSlots.slice(0, -1).map((time) => (
                                                <th key={time} className="min-w-[44px] border-b border-r bg-slate-50 px-0.5 py-1.5 text-center text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{time}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeBranch.courts.map(court => (
                                            <tr key={court.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                                <td className="sticky left-0 z-10 w-28 border-b border-r bg-white px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-slate-800 dark:text-emerald-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                    {court.name.split(' - ')[0]}
                                                    <span className="block text-[9px] font-normal text-slate-400">{court.price}</span>
                                                </td>
                                                {normalizedTimeSlots.slice(0, -1).map((time) => {
                                                    const isBooked = mockedBookedSlots[court.id]?.includes(time);
                                                    const isSelected = selectedCells.some(cell => cell.courtId === court.id && cell.time === time);
                                                    let cellClass = isBooked ? "bg-red-400/90 cursor-not-allowed" : isSelected ? "bg-emerald-500 shadow-inner" : "cursor-pointer bg-white hover:bg-emerald-50 dark:bg-slate-800/50 dark:hover:bg-emerald-900/30";
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
                        <div className="flex shrink-0 items-center justify-between border-t border-emerald-700 bg-emerald-600 px-5 py-3 text-white">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col"><span className="text-[10px] text-emerald-100">Tổng thời gian</span><span className="text-base font-bold">{timeString}</span></div>
                                <div className="flex flex-col"><span className="text-[10px] text-emerald-100">Tổng tiền</span><span className="text-base font-bold">{totalMoney.toLocaleString('vi-VN')} đ</span></div>
                            </div>
                            <button 
                                onClick={() => {
                                    if (selectedCells.length === 0) return;
                                    alert(`Đặt thành công tại: ${activeBranch.name}\nTổng tiền: ${totalMoney.toLocaleString('vi-VN')}đ`);
                                    setSelectedCells([]); setIsGridModalOpen(false);
                                }}
                                disabled={selectedCells.length === 0}
                                className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${selectedCells.length > 0 ? "bg-amber-400 text-slate-900 hover:bg-amber-300" : "bg-emerald-700 text-emerald-400 cursor-not-allowed"}`}
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
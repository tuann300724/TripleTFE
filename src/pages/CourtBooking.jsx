import { useState } from "react";

const courtsInfo = [
    { id: 1, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000, image: "https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA" },
    { id: 2, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000, image: "https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA" },
    { id: 3, name: "Sân 3 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000, image: "https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA" },
    { id: 4, name: "Sân 4 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000, image: "https://imgs.search.brave.com/6-SPQR7zidaUK9Mqu1XwJxq68sfhXtRk2_3JvS1x38M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcHZuYi5jb20v/dXBsb2Fkcy9pbWFn/ZXMvdGluX3R1Yy9t/b2MtdHJlby12b3Qt/Y2F1LWxvbmctNi0x/NzE2MTczMjExLndl/YnA" },
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
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const [selectedCells, setSelectedCells] = useState([]);

    const handleOpenGrid = () => {
        setIsGridModalOpen(true);
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
            const court = courtsInfo.find(c => c.id === cell.courtId);
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
            </section>

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
                                onClick={handleConfirmBooking}
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

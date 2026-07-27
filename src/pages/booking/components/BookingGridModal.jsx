import { X } from "lucide-react";
import { normalizedTimeSlots, mockedBookedSlots } from "../bookingData";

export default function BookingGridModal({
    isOpen,
    onClose,
    selectedBranch,
    selectedDate,
    onDateChange,
    activeCourts,
    selectedCells,
    onCellClick,
    onConfirmBooking,
    totalMoney,
    timeString
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-6">
            <div className="flex h-full w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0c1219] animate-in zoom-in-95 duration-200">

                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-emerald-700 px-6 py-4 dark:border-emerald-800">
                    <div>
                        <h2 className="text-lg font-bold text-white">Bảng Chọn Giờ Đặt Lịch</h2>
                        <p className="text-emerald-200 text-xs mt-0.5">{selectedBranch?.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 cursor-pointer font-bold"
                    >
                        <X size={16} />
                    </button>
                </div>

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
                            onChange={onDateChange}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

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
                                                    onClick={() => onCellClick(court.id, time)}
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
                        onClick={onConfirmBooking}
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
    );
}

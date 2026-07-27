import { X, Clock } from "lucide-react";
import { normalizedTimeSlots, mockedBookedSlots } from "../bookingData";

const groupAndMergeSelectedCells = (selectedCells, courts) => {
    if (!selectedCells || selectedCells.length === 0) return [];
    
    // Group by courtId
    const groups = {};
    selectedCells.forEach(cell => {
        if (!groups[cell.courtId]) {
            groups[cell.courtId] = [];
        }
        groups[cell.courtId].push(cell.time);
    });

    const result = [];

    Object.keys(groups).forEach(courtIdStr => {
        const courtId = parseInt(courtIdStr, 10);
        const court = courts.find(c => c.id === courtId);
        if (!court) return;

        const times = groups[courtIdStr];
        
        // Convert hh:mm to minutes from midnight
        const timeInMinutes = times.map(t => {
            const [h, m] = t.split(":").map(Number);
            return { time: t, mins: h * 60 + m };
        });

        // Sort by minutes ascending
        timeInMinutes.sort((a, b) => a.mins - b.mins);

        // Group consecutive slots (where diff is exactly 30 minutes)
        let currentGroup = [];
        const mergedRanges = [];

        timeInMinutes.forEach((item) => {
            if (currentGroup.length === 0) {
                currentGroup.push(item);
            } else {
                const lastItem = currentGroup[currentGroup.length - 1];
                if (item.mins - lastItem.mins === 30) {
                    currentGroup.push(item);
                } else {
                    mergedRanges.push([...currentGroup]);
                    currentGroup = [item];
                }
            }
        });
        if (currentGroup.length > 0) {
            mergedRanges.push(currentGroup);
        }

        // Format each group
        mergedRanges.forEach(group => {
            const startMins = group[0].mins;
            // 30 minutes duration for the last slot
            const endMins = group[group.length - 1].mins + 30;

            const formatTime = (totalMins) => {
                const h = Math.floor(totalMins / 60);
                const m = totalMins % 60;
                return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            };

            const startTimeStr = formatTime(startMins);
            const endTimeStr = formatTime(endMins);
            const slotCount = group.length;
            const price = slotCount * (court.pricePerSlot || 0);

            result.push({
                courtId,
                courtName: court.name,
                startTime: startTimeStr,
                endTime: endTimeStr,
                timeRange: `${startTimeStr} - ${endTimeStr}`,
                slotCount,
                price,
                rawTimes: group.map(g => g.time)
            });
        });
    });

    // Sort result by courtId then startTime
    return result.sort((a, b) => {
        if (a.courtId !== b.courtId) return a.courtId - b.courtId;
        const [aH, aM] = a.startTime.split(":").map(Number);
        const [bH, bM] = b.startTime.split(":").map(Number);
        return (aH * 60 + aM) - (bH * 60 + bM);
    });
};

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
    timeString,
    onRemoveSlots,
    onClearAll
}) {
    if (!isOpen) return null;

    const mergedSlots = groupAndMergeSelectedCells(selectedCells, activeCourts);

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

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-[#121b24]">
                    
                    <div className="flex-1 overflow-auto p-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
                        <div className="inline-block min-w-full rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 z-20 w-32 border-b border-r border-slate-200 bg-slate-100 px-4 py-3 text-left text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                            Sân / Giờ
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

                                                const [sh, sm] = time.split(":").map(Number);
                                                const endSlotMins = sh * 60 + sm + 30;
                                                const endSlotH = Math.floor(endSlotMins / 60).toString().padStart(2, '0');
                                                const endSlotM = (endSlotMins % 60).toString().padStart(2, '0');
                                                const slotRange = `${time} - ${endSlotH}:${endSlotM}`;
                                                
                                                const tooltipText = isBooked
                                                    ? `Sân ${court.name.split(' - ')[0]}: Khung giờ ${slotRange} đã được đặt trước`
                                                    : isSelected
                                                    ? `Sân ${court.name.split(' - ')[0]}: Đang chọn ${slotRange} (${(court.pricePerSlot || 0).toLocaleString('vi-VN')}đ). Bấm để bỏ chọn.`
                                                    : `Sân ${court.name.split(' - ')[0]}: Chọn ${slotRange} (${(court.pricePerSlot || 0).toLocaleString('vi-VN')}đ)`;

                                                return (
                                                    <td
                                                        key={`${court.id}-${time}`}
                                                        onClick={() => onCellClick(court.id, time)}
                                                        title={tooltipText}
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

                    <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-[#0c1219] p-4 flex flex-col overflow-y-auto border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 shrink-0">
                            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                Khung giờ đã chọn ({selectedCells.length})
                            </h3>
                            {selectedCells.length > 0 && onClearAll && (
                                <button 
                                    onClick={onClearAll}
                                    className="text-[10px] text-rose-500 hover:text-rose-600 font-bold transition-colors cursor-pointer"
                                >
                                    Xóa tất cả
                                </button>
                            )}
                        </div>

                        {selectedCells.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400 dark:text-slate-500">
                                <Clock size={32} className="mb-2 opacity-50 text-slate-350 dark:text-slate-600" />
                                <p className="text-xs font-bold">Chưa chọn khung giờ nào</p>
                                <p className="text-[10px] mt-1 px-4 text-slate-400 dark:text-slate-500 leading-normal">Hãy nhấp vào các ô trống màu trắng trên bảng lịch để đặt giờ chơi.</p>
                            </div>
                        ) : (
                            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                                {mergedSlots.map((slot, idx) => (
                                    <div key={idx} className="group relative border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-[#121a24] hover:border-emerald-500/40 dark:hover:border-emerald-500/25 transition-all flex items-center justify-between shadow-sm">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-black text-emerald-700 dark:text-emerald-450">{slot.courtName.split(' - ')[0]}</span>
                                            <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                <Clock size={11} className="text-emerald-600 dark:text-emerald-400" />
                                                {slot.timeRange}
                                            </span>
                                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">({slot.slotCount * 30} phút • {slot.slotCount} slot)</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">{slot.price.toLocaleString('vi-VN')}đ</span>
                                            {onRemoveSlots && (
                                                <button 
                                                    onClick={() => onRemoveSlots(slot.courtId, slot.rawTimes)}
                                                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                                                    title="Hủy chọn khung giờ này"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

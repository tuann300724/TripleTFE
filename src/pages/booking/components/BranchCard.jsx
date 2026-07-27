import { MapPin, Star, ArrowRight } from "lucide-react";

export default function BranchCard({ branch, isSelected, onSelect, onViewDetails }) {
    return (
        <div
            onClick={() => onSelect(branch)}
            className={`p-3.5 rounded-xl cursor-pointer transition-all duration-300 flex flex-col ${isSelected
                ? "bg-emerald-50/40 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.08)] dark:bg-slate-900 dark:border-emerald-500 dark:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                : "bg-white border border-slate-200/80 hover:border-emerald-400 hover:bg-slate-50/50 dark:bg-[#0f172a] dark:border-slate-800/70 dark:hover:border-slate-700 dark:hover:bg-slate-900/60"
            }`}
        >
            <div className="flex justify-between items-start gap-2 mb-1.5">
                <h3 className="font-bold text-xs text-slate-800 dark:text-white leading-tight">{branch.name}</h3>
                <div className="flex items-center gap-0.5 text-[10px] text-amber-500 dark:text-amber-400 font-bold shrink-0">
                    <Star size={10} className="fill-current" />
                    <span>{branch.rating}</span>
                </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-relaxed mb-3 flex items-start gap-1">
                <MapPin size={11} className="text-rose-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{branch.address}</span>
            </p>

            <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] text-emerald-600 bg-emerald-50 dark:text-[#00f5a0] dark:bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
                    Có {branch.freeCourts} sân trống
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(branch);
                    }}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] py-1.5 px-2.5 rounded-lg transition-all active:scale-[0.97] cursor-pointer"
                >
                    <span>Xem Chi Tiết Sân</span>
                    <ArrowRight size={10} className="inline" />
                </button>
            </div>
        </div>
    );
}

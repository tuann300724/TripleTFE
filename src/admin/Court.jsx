import { useState } from "react";
import { Link } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    Search,
    Filter,
    Tent,
    MapPin,
    Building2,
    Calendar,
    AlertCircle,
    Pencil,
} from "lucide-react";
import { MOCK_COURTS, formatCourtDate } from "./data/mockCourts";

export default function AdminCourt() {
    const [courts] = useState(MOCK_COURTS);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2800);
    };

    const filtered = courts.filter((c) => {
        const q = search.toLowerCase();
        const matchSearch =
            c.courtName.toLowerCase().includes(q) ||
            c.owner.fullName.toLowerCase().includes(q) ||
            c.address.toLowerCase().includes(q);
        const matchFilter =
            filter === "all" ||
            (filter === "pending" && !c.isApproved) ||
            (filter === "approved" && c.isApproved);
        return matchSearch && matchFilter;
    });

    const pendingCount = courts.filter((c) => !c.isApproved).length;
    const approvedCount = courts.filter((c) => c.isApproved).length;

    return (
        <div className="space-y-6">
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl ${
                        toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                    }`}
                >
                    {toast.type === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    {toast.message}
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                        <Tent className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                            Yêu cầu từ người dùng
                        </p>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                            Quản lý sân cầu lông
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Xem chi tiết SubCourts & TimeSlots trước khi phê duyệt
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon={Tent} label="Tổng yêu cầu" value={courts.length} color="slate" />
                <StatCard icon={AlertCircle} label="Chờ phê duyệt" value={pendingCount} color="amber" />
                <StatCard icon={CheckCircle} label="Đã phê duyệt" value={approvedCount} color="emerald" />
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên sân, chủ sân, địa chỉ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    {[
                        { key: "all", label: "Tất cả" },
                        { key: "pending", label: `Chờ duyệt (${pendingCount})` },
                        { key: "approved", label: `Đã duyệt (${approvedCount})` },
                    ].map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => setFilter(f.key)}
                            className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                                filter === f.key
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                {["#", "Cụm sân", "Chủ sân", "Sân con", "Khung giờ", "Ngày đăng ký", "Trạng thái", "Thao tác"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="px-5 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-slate-400 last:text-right"
                                        >
                                            {h}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-slate-400">
                                        <Tent className="mx-auto mb-3 h-12 w-12 opacity-30" />
                                        Không tìm thấy yêu cầu phù hợp
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((court, idx) => (
                                    <tr
                                        key={court.courtId}
                                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
                                    >
                                        <td className="px-5 py-4 font-mono text-xs text-slate-400">{idx + 1}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                    <img
                                                        src={court.thumbnail}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {court.courtName}
                                                    </p>
                                                    <p className="flex max-w-[220px] items-center gap-1 truncate text-xs text-slate-400">
                                                        <MapPin className="h-3 w-3 shrink-0" />
                                                        {court.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-700 dark:text-slate-300">
                                                {court.owner.fullName}
                                            </p>
                                            <p className="text-xs text-slate-400">{court.owner.email}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                                <Building2 className="h-3 w-3" />
                                                {court.subCourts.length}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                {court.timeSlots.length} khung
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatCourtDate(court.createdAt)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge approved={court.isApproved} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/courts/${court.courtId}`}
                                                    className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Xem chi tiết sân
                                                </Link>
                                                <Link
                                                    to={`/admin/courts/edit/${court.courtId}`}
                                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Sửa
                                                </Link>
                                                {!court.isApproved ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            showToast("Đã phê duyệt sân (giao diện demo)", "success")
                                                        }
                                                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        Duyệt
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            showToast("Đã thu hồi phê duyệt (giao diện demo)", "error")
                                                        }
                                                        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Thu hồi
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colors = {
        slate: "bg-slate-100 text-slate-500 dark:bg-slate-700",
        amber: "bg-amber-50 text-amber-500 dark:bg-amber-900/20",
        emerald: "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20",
    };
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
}

function StatusBadge({ approved }) {
    if (approved) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Đã duyệt
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            Chờ duyệt
        </span>
    );
}

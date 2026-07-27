import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    MapPin,
    Pencil,
    Timer,
    User,
    XCircle,
    Target
} from "lucide-react";
import { getCourtById, formatCourtDate, formatCourtPrice, formatTime } from "./data/mockCourts";

export default function CourtDetail() {
    const { id } = useParams();
    const court = getCourtById(id);

    if (!court) {
        return (
            <div className="py-20 text-center">
                <p className="text-5xl"><Target className="h-12 w-12 mx-auto" /></p>
                <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Không tìm thấy sân</h1>
                <Link to="/admin/courts" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <Link
                to="/admin/courts"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
            >
                <ArrowLeft className="h-4 w-4" />
                Quay lại quản lý sân
            </Link>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="relative h-48 bg-slate-100 sm:h-56">
                    <img src={court.thumbnail} alt={court.courtName} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h1 className="text-2xl font-bold text-white">{court.courtName}</h1>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-200">
                            <MapPin className="h-4 w-4" />
                            {court.address}
                        </p>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    <div className="flex flex-wrap items-center gap-3">
                        {court.isApproved ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <CheckCircle className="h-4 w-4" />
                                Đã phê duyệt
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <Clock className="h-4 w-4" />
                                Đang chờ duyệt — kiểm tra SubCourts & TimeSlots bên dưới
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="h-3.5 w-3.5" />
                            Đăng ký: {formatCourtDate(court.createdAt)}
                        </span>
                    </div>

                    <section className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <User className="h-4 w-4 text-blue-500" />
                            Thông tin chủ sân
                        </h2>
                        <dl className="grid gap-2 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-slate-400">Họ tên</dt>
                                <dd className="font-semibold text-slate-800 dark:text-slate-200">{court.owner.fullName}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Email</dt>
                                <dd className="text-slate-700 dark:text-slate-300">{court.owner.email}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-400">Số điện thoại</dt>
                                <dd className="text-slate-700 dark:text-slate-300">{court.owner.phone}</dd>
                            </div>
                        </dl>
                    </section>

                    {court.description && (
                        <section>
                            <h2 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Mô tả</h2>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{court.description}</p>
                            {court.amenities?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {court.amenities.map((a) => (
                                        <span
                                            key={a}
                                            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        >
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    <section>
                        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <Building2 className="h-4 w-4 text-emerald-500" />
                            Danh sách SubCourts ({court.subCourts.length})
                        </h2>
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800/80">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left text-xs font-bold uppercase text-slate-400">ID</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-bold uppercase text-slate-400">Tên sân con</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-bold uppercase text-slate-400">Loại sàn</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-bold uppercase text-slate-400">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {court.subCourts.map((sc) => (
                                        <tr key={sc.subCourtId} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                                            <td className="px-4 py-3 font-mono text-xs text-slate-400">#{sc.subCourtId}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                                                {sc.subCourtName}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{sc.floorType}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Hoạt động
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <Timer className="h-4 w-4 text-blue-500" />
                            Danh sách TimeSlots ({court.timeSlots.length})
                        </h2>
                        <div className="space-y-2">
                            {court.timeSlots.map((slot, idx) => (
                                <div
                                    key={slot.slotId}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            {idx + 1}
                                        </span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                                            {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                        <DollarSign className="h-3.5 w-3.5" />
                                        {formatCourtPrice(slot.price)}/giờ
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
                        <Link
                            to={`/admin/courts/edit/${court.courtId}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                        >
                            <Pencil className="h-4 w-4" />
                            Chỉnh sửa thông tin
                        </Link>
                        {!court.isApproved ? (
                            <>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Từ chối yêu cầu
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Phê duyệt sân
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600"
                            >
                                <XCircle className="h-4 w-4" />
                                Thu hồi phê duyệt
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

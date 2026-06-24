import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Plus, Save, Timer, Trash2 } from "lucide-react";
import { getCourtById, formatTime } from "./data/mockCourts";

export default function CourtEdit() {
    const { id } = useParams();
    const court = getCourtById(id);

    if (!court) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-xl font-bold">Không tìm thấy sân</h1>
                <Link to="/admin/courts" className="mt-4 inline-block text-emerald-600">
                    Quay lại
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <Link
                to={`/admin/courts/${court.courtId}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600"
            >
                <ArrowLeft className="h-4 w-4" />
                Quay lại chi tiết sân
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh sửa yêu cầu đăng ký sân</h1>
                <p className="mt-1 text-sm text-slate-500">Giao diện demo — chưa kết nối backend</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Thông tin cụm sân</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Tên cụm sân</label>
                            <input defaultValue={court.courtName} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
                            <input defaultValue={court.address} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Mô tả</label>
                            <textarea
                                rows={3}
                                defaultValue={court.description}
                                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                            <Building2 className="h-4 w-4 text-emerald-500" />
                            SubCourts
                        </h2>
                        <button type="button" className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Plus className="h-3.5 w-3.5" />
                            Thêm sân con
                        </button>
                    </div>
                    <div className="space-y-3">
                        {court.subCourts.map((sc) => (
                            <div
                                key={sc.subCourtId}
                                className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-600"
                            >
                                <div className="min-w-[120px] flex-1">
                                    <label className="mb-1 block text-xs text-slate-400">Tên sân con</label>
                                    <input
                                        defaultValue={sc.subCourtName}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                                    />
                                </div>
                                <div className="min-w-[120px] flex-1">
                                    <label className="mb-1 block text-xs text-slate-400">Loại sàn</label>
                                    <input
                                        defaultValue={sc.floorType}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                                    />
                                </div>
                                <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                            <Timer className="h-4 w-4 text-blue-500" />
                            TimeSlots
                        </h2>
                        <button type="button" className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <Plus className="h-3.5 w-3.5" />
                            Thêm khung giờ
                        </button>
                    </div>
                    <div className="space-y-3">
                        {court.timeSlots.map((slot) => (
                            <div
                                key={slot.slotId}
                                className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-600"
                            >
                                <div>
                                    <label className="mb-1 block text-xs text-slate-400">Bắt đầu</label>
                                    <input
                                        type="time"
                                        defaultValue={formatTime(slot.startTime)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs text-slate-400">Kết thúc</label>
                                    <input
                                        type="time"
                                        defaultValue={formatTime(slot.endTime)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                                    />
                                </div>
                                <div className="min-w-[140px] flex-1">
                                    <label className="mb-1 block text-xs text-slate-400">Giá / giờ (VND)</label>
                                    <input
                                        type="number"
                                        defaultValue={slot.price}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                                    />
                                </div>
                                <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
                    >
                        <Save className="h-4 w-4" />
                        Lưu thay đổi
                    </button>
                    <Link
                        to={`/admin/courts/${court.courtId}`}
                        className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300"
                    >
                        Hủy
                    </Link>
                </div>
            </form>
        </div>
    );
}

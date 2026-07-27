export default function ProfileInfo({
    userData,
    handleInputChange,
    provinces,
    districts,
    wards,
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedWard,
    setSelectedWard,
    detailAddress,
    setDetailAddress,
    handleSaveInfo
}) {
    return (
        <div>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h3>
                <p className="text-xs text-slate-400 mt-1">Cập nhật chi tiết thông tin của bạn để nhận dịch vụ tối ưu và theo dõi thành tích.</p>
            </div>

            <form onSubmit={handleSaveInfo} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={userData.fullName}
                            onChange={handleInputChange}
                            className="tt-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            className="tt-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            placeholder="0987 654 321"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Địa chỉ Email</label>
                        <input
                            type="email"
                            value={userData.email}
                            readOnly
                            className="tt-input bg-slate-50 dark:bg-slate-900 cursor-not-allowed border-slate-200/60 dark:border-slate-700 text-slate-400 dark:text-slate-500 w-full px-4 py-2.5 rounded-xl"
                            disabled
                            title="Email đăng nhập không thể thay đổi"
                        />
                    </div>
                </div>

                {/* Dropdown 3 cấp Open API tỉnh thành */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Địa chỉ nhận hàng mới (Để trống nếu giữ nguyên: {userData.address || "Chưa có"})</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">-- Chọn Tỉnh / Thành phố --</option>
                            {provinces.map((p) => (
                                <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            disabled={!selectedProvince}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                        >
                            <option value="">-- Chọn Quận / Huyện --</option>
                            {districts.map((d) => (
                                <option key={d.code} value={d.code}>{d.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                            disabled={!selectedDistrict}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                        >
                            <option value="">-- Chọn Phường / Xã --</option>
                            {wards.map((w) => (
                                <option key={w.code} value={w.code}>{w.name}</option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Số nhà, tên đường, ngách..."
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        disabled={!selectedWard}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="tt-btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all duration-200"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSecurity() {
    const navigate = useNavigate();

    const [pwdData, setPwdData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

    // Quản lý trạng thái ẩn/hiện của 3 ô: old (hiện tại), new (mới), confirm (xác nhận)
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    // Hàm helper để đảo ngược trạng thái ẩn/hiện của một ô cụ thể
    const toggleShowPassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwdMessage({ type: "", text: "" });

        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setPwdMessage({ type: "error", text: "Mật khẩu xác nhận mới không trùng khớp!" });
            return;
        }

        try {
            const userId = localStorage.getItem("userId") || 6;
            const response = await fetch(`https://localhost:7147/api/User/${userId}/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldPassword: pwdData.oldPassword,
                    newPassword: pwdData.newPassword
                }),
            });

            const resultText = await response.text();

            if (!response.ok) {
                throw new Error(resultText || "Đã xảy ra lỗi không xác định.");
            }

            // --- XỬ LÝ LOGOUT VÀ CHUYỂN TRANG KHI ĐỔI MẬT KHẨU THÀNH CÔNG ---

            // 1. Hiển thị thông báo thành công cho user thấy trong 1.5 giây trước khi đá ra ngoài
            setPwdMessage({
                type: "success",
                text: "Đổi mật khẩu thành công! Hệ thống đang đăng xuất và quay về trang đăng nhập..."
            });

            // Xóa trắng form nhập liệu
            setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "" });

            setTimeout(() => {
                // 2. Xóa sạch dữ liệu đăng nhập cũ lưu trong localStorage / sessionStorage
                localStorage.removeItem("userId");
                localStorage.removeItem("token"); // Nếu bạn có xài JWT Token
                localStorage.clear(); // Hoặc xóa hết cho chắc chắn

                // 3. Đẩy user về trang login (thay "/login" bằng đường dẫn route login thực tế của bạn)
                navigate("/login");
            }, 1500); // Chờ 1.5 giây để user kịp đọc thông báo thông thái

        } catch (error) {
            setPwdMessage({ type: "error", text: error.message });
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bảo mật tài khoản</h3>
                <p className="text-xs text-slate-400 mt-1">Đổi mật khẩu bảo vệ và liên kết các mạng xã hội để tăng bảo mật.</p>
            </div>

            {/* Change password section */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Cập nhật mật khẩu</h4>

                {pwdMessage.text && (
                    <div className={`p-4 rounded-xl text-xs font-semibold border ${pwdMessage.type === "success"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        }`}>
                        {pwdMessage.text}
                    </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">

                    {/* 1. MẬT KHẨU HIỆN TẠI */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mật khẩu hiện tại</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword.old ? "text" : "password"}
                                required
                                value={pwdData.oldPassword}
                                onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                                className="tt-input w-full pr-10" // pr-10 để chừa khoảng trống bên phải không bị đè chữ lên icon
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => toggleShowPassword('old')}
                                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm focus:outline-none select-none"
                            >
                                {showPassword.old ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* 2. MẬT KHẨU MỚI */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mật khẩu mới</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword.new ? "text" : "password"}
                                required
                                value={pwdData.newPassword}
                                onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                                className="tt-input w-full pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => toggleShowPassword('new')}
                                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm focus:outline-none select-none"
                            >
                                {showPassword.new ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* 3. XÁC NHẬN MẬT KHẨU MỚI */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Xác nhận mật khẩu mới</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                required
                                value={pwdData.confirmPassword}
                                onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                                className="tt-input w-full pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => toggleShowPassword('confirm')}
                                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm focus:outline-none select-none"
                            >
                                {showPassword.confirm ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="tt-btn-dark px-5 py-2.5 text-xs font-semibold active:scale-95 transition-transform">
                        Cập nhật mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
}

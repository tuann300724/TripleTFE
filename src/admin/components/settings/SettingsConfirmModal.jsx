import { AlertTriangle } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useAdmin } from "../../context/AdminContext";

export default function SettingsConfirmModal() {
  const { confirmModal, setConfirmModal } = useSettings();
  const { loading } = useAdmin();
  if (!confirmModal) return null;

  const { type, onConfirm } = confirmModal;
  const titles = {
    save: "Xác nhận lưu thông tin nhạy cảm",
    reset: "Đặt lại toàn bộ cài đặt?",
    unsaved: "Bỏ thay đổi chưa lưu?",
    resetData: "Reset dữ liệu dashboard?",
    clearCache: "Xóa cache hệ thống?",
  };
  const messages = {
    save: "Bạn sắp lưu thông tin bảo mật hoặc tài khoản. Tiếp tục?",
    reset: "Mọi cài đặt sẽ về mặc định. Hành động này không thể hoàn tác.",
    unsaved: "Thay đổi hiện tại sẽ bị hủy nếu bạn chuyển tab.",
    resetData: "Sản phẩm, khách hàng và đơn hàng sẽ về dữ liệu mẫu ban đầu.",
    clearCache: "Cache cục bộ (trừ phiên đăng nhập) sẽ bị xóa.",
  };

  return (
    <section className="fixed inset-0 z-[118] flex items-center justify-center p-4">
      <button type="button" aria-label="đóng" className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
      <article className="relative w-full max-w-sm rounded-2xl glass border border-slate-200/80 dark:border-slate-700/80 shadow-2xl modal-in p-6 text-center">
        <span className="w-14 h-14 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <AlertTriangle className="text-amber-500" size={28} />
        </span>
        <h3 className="text-lg font-bold mt-4 text-slate-900 dark:text-white">{titles[type]}</h3>
        <p className="text-sm text-slate-500 mt-2">{messages[type]}</p>
        <section className="flex gap-3 mt-6">
          <button type="button" onClick={() => setConfirmModal(null)} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-medium">
            Hủy
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => { onConfirm?.(); setConfirmModal(null); }}
            className="flex-1 py-2.5 rounded-xl bg-[rgb(var(--admin-primary))] text-white font-medium disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </section>
      </article>
    </section>
  );
}

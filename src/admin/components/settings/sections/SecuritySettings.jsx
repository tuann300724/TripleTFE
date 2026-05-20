import { useState } from "react";
import { Key } from "lucide-react";
import { useSettings } from "../../../context/SettingsContext";
import { useAdmin } from "../../../context/AdminContext";
import SettingsCard from "../SettingsCard";
import SettingsActions from "../SettingsActions";
import ToggleSwitch from "../ToggleSwitch";
import FormField, { inputCls, selectCls } from "../../forms/FormField";
import Modal from "../../Modal";

export default function SecuritySettings() {
  const { draft, updateSection, saveSection, resetSection, changePassword, sessions } = useSettings();
  const { showToast } = useAdmin();
  const s = draft.security;

  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwd, setPwd] = useState({ current: "", newPass: "", confirm: "" });
  const [err, setErr] = useState("");

  const handlePwd = async () => {
    setErr("");
    if (pwd.newPass !== pwd.confirm) {
      setErr("Mật khẩu xác nhận không khớp");
      return;
    }
    const res = await changePassword({ currentPassword: pwd.current, newPassword: pwd.newPass });
    if (res.success) {
      showToast(res.message || "Đổi mật khẩu thành công");
      setPwdOpen(false);
    } else setErr(res.error);
  };

  return (
    <>
      <SettingsCard title="Bảo mật" description="Mật khẩu, phiên và chính sách bảo vệ">
        <button
          type="button"
          onClick={() => setPwdOpen(true)}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <span className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Key className="text-emerald-600" size={20} />
          </span>
          <section>
            <p className="font-medium text-sm">Đổi mật khẩu</p>
            <p className="text-xs text-slate-500">Cập nhật mật khẩu đăng nhập admin</p>
          </section>
        </button>

        <FormField label="Tự động đăng xuất khi không hoạt động">
          <select
            className={selectCls}
            value={s.autoLogoutMinutes}
            onChange={(e) => updateSection("security", { autoLogoutMinutes: Number(e.target.value) })}
          >
            <option value={15}>15 phút</option>
            <option value={30}>30 phút</option>
            <option value={60}>1 giờ</option>
            <option value={120}>2 giờ</option>
            <option value={0}>Không tự động</option>
          </select>
        </FormField>

        <ToggleSwitch
          label="Xác nhận trước thay đổi quan trọng"
          description="Hiện hộp thoại khi lưu bảo mật / tài khoản"
          checked={s.confirmSensitiveChanges}
          onChange={(v) => updateSection("security", { confirmSensitiveChanges: v })}
        />

        <ToggleSwitch
          label="Xác thực 2 lớp (2FA)"
          checked={s.twoFactorEnabled}
          onChange={(v) => updateSection("security", { twoFactorEnabled: v })}
        />

        <p className="text-sm font-medium pt-2">Phiên đăng nhập ({sessions.length})</p>
        <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
          {sessions.map((sess) => (
            <li key={sess.id} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span>{sess.device}</span>
              <span className="text-xs">{sess.lastActive}</span>
            </li>
          ))}
        </ul>

        <SettingsActions
          onSave={() => saveSection("security", "Lưu cài đặt bảo mật")}
          onReset={() => resetSection("security")}
        />
      </SettingsCard>

      <Modal open={pwdOpen} onClose={() => setPwdOpen(false)} title="Đổi mật khẩu bảo mật">
        <section className="space-y-3">
          <FormField label="Mật khẩu hiện tại">
            <input type="password" className={inputCls} value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} />
          </FormField>
          <FormField label="Mật khẩu mới">
            <input type="password" className={inputCls} value={pwd.newPass} onChange={(e) => setPwd((p) => ({ ...p, newPass: e.target.value }))} />
          </FormField>
          <FormField label="Xác nhận" error={err}>
            <input type="password" className={inputCls} value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} />
          </FormField>
          <button type="button" onClick={handlePwd} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium">
            Lưu mật khẩu
          </button>
        </section>
      </Modal>
    </>
  );
}

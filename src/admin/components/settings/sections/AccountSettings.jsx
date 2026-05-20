import { useState } from "react";
import { Key, Shield, Monitor } from "lucide-react";
import { useSettings } from "../../../context/SettingsContext";
import { useAdmin } from "../../../context/AdminContext";
import SettingsCard from "../SettingsCard";
import SettingsActions from "../SettingsActions";
import ToggleSwitch from "../ToggleSwitch";
import ImageSettingField from "../ImageSettingField";
import FormField, { inputCls } from "../../forms/FormField";
import Modal from "../../Modal";

export default function AccountSettings() {
  const { profile, updateProfile, changePassword, saveSection, draft, updateSection, sessions } = useSettings();
  const { showToast, withLoading } = useAdmin();

  const [form, setForm] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    avatar: profile.avatar,
  });
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwd, setPwd] = useState({ current: "", newPass: "", confirm: "" });
  const [pwdError, setPwdError] = useState("");

  const twoFactor = draft.security?.twoFactorEnabled ?? false;

  const handleSaveProfile = () => {
    if (!form.fullName.trim()) {
      showToast("Họ tên không được trống", "error");
      return;
    }
    withLoading(() => {
      updateProfile(form);
      saveSection("account", "Cập nhật tài khoản admin");
    });
  };

  const handlePassword = async () => {
    setPwdError("");
    if (pwd.newPass !== pwd.confirm) {
      setPwdError("Mật khẩu xác nhận không khớp");
      return;
    }
    const res = await changePassword({ currentPassword: pwd.current, newPassword: pwd.newPass });
    if (res.success) {
      showToast(res.message || "Đổi mật khẩu thành công");
      setPwdOpen(false);
      setPwd({ current: "", newPass: "", confirm: "" });
    } else {
      setPwdError(res.error);
    }
  };

  return (
    <>
      <SettingsCard title="Tài khoản quản trị" description="Thông tin đăng nhập và hồ sơ admin">
        <ImageSettingField label="Avatar" value={form.avatar} onChange={(v) => setForm((f) => ({ ...f, avatar: v }))} />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tên admin" required>
            <input className={inputCls} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
          </FormField>
          <FormField label="Email">
            <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </FormField>
          <FormField label="Số điện thoại">
            <input className={inputCls} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </FormField>
          <FormField label="Vai trò">
            <input className={inputCls} value={profile.role} disabled />
          </FormField>
        </section>

        <ToggleSwitch
          label="Xác thực bảo mật (2FA)"
          description="Yêu cầu mã OTP khi đăng nhập (demo)"
          checked={twoFactor}
          onChange={(v) => updateSection("security", { twoFactorEnabled: v })}
        />

        <SettingsActions onSave={handleSaveProfile} onReset={() => setForm({ fullName: profile.fullName, email: profile.email, phone: profile.phone, avatar: profile.avatar })} />

        <button
          type="button"
          onClick={() => setPwdOpen(true)}
          className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:underline"
        >
          <Key size={16} /> Đổi mật khẩu
        </button>
      </SettingsCard>

      <SettingsCard title="Trạng thái đăng nhập" description="Phiên làm việc hiện tại">
        <article className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/40">
          <Shield className="text-emerald-600 shrink-0" size={22} />
          <section>
            <p className="font-medium text-sm">{profile.fullName}</p>
            <p className="text-xs text-emerald-600 font-semibold">● Đang trực tuyến</p>
          </section>
        </article>
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm">
              <Monitor size={18} className="text-slate-400 shrink-0" />
              <section className="flex-1 min-w-0">
                <p className="font-medium">{s.device}</p>
                <p className="text-xs text-slate-500">{s.location} · {s.lastActive}</p>
              </section>
              {s.current && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">Hiện tại</span>
              )}
            </li>
          ))}
        </ul>
      </SettingsCard>

      <Modal open={pwdOpen} onClose={() => setPwdOpen(false)} title="Đổi mật khẩu">
        <section className="space-y-3">
          <FormField label="Mật khẩu hiện tại">
            <input type="password" className={inputCls} value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} />
          </FormField>
          <FormField label="Mật khẩu mới">
            <input type="password" className={inputCls} value={pwd.newPass} onChange={(e) => setPwd((p) => ({ ...p, newPass: e.target.value }))} />
          </FormField>
          <FormField label="Xác nhận mật khẩu" error={pwdError}>
            <input type="password" className={inputCls} value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} />
          </FormField>
          <button type="button" onClick={handlePassword} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium">
            Cập nhật mật khẩu
          </button>
        </section>
      </Modal>
    </>
  );
}

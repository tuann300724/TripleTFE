import { useState, useRef } from "react";
import { Camera, Save, Key, Activity, Shield } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { useAdmin } from "../context/AdminContext";
import Modal from "../components/Modal";

export default function ProfileView() {
  const { profile, updateProfile, changePassword, recentActivity } = useAuth();
  const { withLoading, showToast } = useAdmin();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
    department: profile.department,
    bio: profile.bio,
  });
  const [avatar, setAvatar] = useState(profile.avatar);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwd, setPwd] = useState({ current: "", newPass: "", confirm: "" });
  const [pwdError, setPwdError] = useState("");

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      showToast("Ảnh đại diện đã cập nhật (xem trước)");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.fullName.trim()) {
      showToast("Họ tên không được trống", "error");
      return;
    }
    withLoading(() => {
      updateProfile({ ...form, avatar });
      showToast("Lưu hồ sơ thành công");
    });
  };

  const handleChangePassword = async () => {
    setPwdError("");
    if (pwd.newPass !== pwd.confirm) {
      setPwdError("Mật khẩu xác nhận không khớp");
      return;
    }
    withLoading(async () => {
      const res = await changePassword({ currentPassword: pwd.current, newPassword: pwd.newPass });
      if (!res.success) {
        setPwdError(res.error);
        showToast(res.error, "error");
        return;
      }
      setPwdOpen(false);
      setPwd({ current: "", newPass: "", confirm: "" });
      showToast(res.message);
    });
  };

  return (
    <section className="anim-in space-y-6 max-w-4xl">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hồ sơ Admin</h2>
        <p className="text-sm text-slate-500 mt-1">Quản lý thông tin cá nhân và bảo mật</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 text-center card-hover">
          <section className="relative inline-block">
            <img src={avatar} alt="" className="w-28 h-28 rounded-2xl object-cover ring-4 ring-emerald-500/30 mx-auto" />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" title="Online" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors"
            >
              <Camera size={16} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </section>
          <h3 className="font-bold text-lg mt-4 text-slate-900 dark:text-white">{form.fullName}</h3>
          <p className="text-sm text-emerald-600 font-medium">{form.role}</p>
          <p className="text-xs text-slate-500 mt-1">{form.department}</p>
          <span className="inline-flex mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            ● Đang hoạt động
          </span>
          <section className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 text-left space-y-2 text-sm">
            <p className="flex justify-between"><span className="text-slate-500">Tham gia</span><b>{profile.joined}</b></p>
            <p className="flex justify-between"><span className="text-slate-500">ID</span><b className="font-mono text-xs">{profile.id}</b></p>
          </section>
        </article>

        <article className="lg:col-span-2 glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Shield size={18} className="text-emerald-500" /> Thông tin cá nhân
          </h3>
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["fullName", "Họ và tên"],
              ["email", "Email"],
              ["phone", "Số điện thoại"],
              ["role", "Vai trò"],
              ["department", "Phòng ban"],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs font-medium text-slate-500 mb-1 block">{label}</span>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  disabled={key === "role"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/80 text-sm disabled:opacity-60 outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
            ))}
          </section>
          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-slate-500 mb-1 block">Giới thiệu</span>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/80 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </label>
          <section className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-opacity">
              <Save size={16} /> Lưu thay đổi
            </button>
            <button type="button" onClick={() => setPwdOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Key size={16} /> Đổi mật khẩu
            </button>
          </section>
        </article>
      </section>

      <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
          <Activity size={18} className="text-emerald-500" /> Hoạt động gần đây
        </h3>
        <ul className="space-y-3">
          {recentActivity.map((a) => (
            <li key={a.id} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-sm">
              <span className="text-slate-700 dark:text-slate-200">{a.action}</span>
              <span className="text-xs text-slate-500">{a.time}</span>
            </li>
          ))}
        </ul>
      </article>

      <Modal open={pwdOpen} onClose={() => setPwdOpen(false)} title="Đổi mật khẩu">
        <section className="space-y-4">
          {["current", "newPass", "confirm"].map((k, i) => (
            <label key={k} className="block">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                {i === 0 ? "Mật khẩu hiện tại" : i === 1 ? "Mật khẩu mới" : "Xác nhận mật khẩu"}
              </span>
              <input
                type="password"
                value={pwd[k]}
                onChange={(e) => setPwd({ ...pwd, [k]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
              />
            </label>
          ))}
          {pwdError && <p className="text-red-500 text-sm">{pwdError}</p>}
          <button type="button" onClick={handleChangePassword} className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600">
            Cập nhật mật khẩu
          </button>
        </section>
      </Modal>
    </section>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Eye, EyeOff, Feather, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { DEMO_CREDENTIALS } from "../auth/defaultAdmin";
import "../admin.css";

function validate(email, password) {
  const errors = {};
  if (!email.trim()) errors.email = "Vui lòng nhập email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email không hợp lệ";
  if (!password) errors.password = "Vui lòng nhập mật khẩu";
  else if (password.length < 6) errors.password = "Mật khẩu tối thiểu 6 ký tự";
  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginLoading, isAuthenticated, authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {};
  }, []);

  if (authLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="w-10 h-10 border-[3px] border-emerald-200 border-t-emerald-500 rounded-full anim-spin" />
      </section>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const v = validate(email, password);
    setErrors(v);
    if (Object.keys(v).length) return;

    const result = await login({ email, password, rememberMe });
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    }, 600);
  };

  return (
    <section className="login-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <section className="login-bg absolute inset-0 pointer-events-none" aria-hidden />
      <section className="login-orb login-orb-1" aria-hidden />
      <section className="login-orb login-orb-2" aria-hidden />

      <article className="relative w-full max-w-md login-card glass border border-slate-700/60 rounded-2xl shadow-2xl p-8 anim-in">
        <header className="text-center mb-8">
          <span className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
            <Feather className="text-white" size={28} />
          </span>
          <h1 className="text-2xl font-bold text-white">TripleT Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Đăng nhập quản trị cửa hàng cầu lông</p>
        </header>

        {success && (
          <p className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm text-center anim-in">
            Đăng nhập thành công! Đang chuyển hướng...
          </p>
        )}

        {serverError && (
          <p className="mb-4 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm text-center anim-in">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <label className="block">
            <span className="text-sm font-medium text-slate-300 mb-1.5 block">Email</span>
            <section className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                placeholder="admin@triplet.vn"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border text-white text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500/40 ${
                  errors.email ? "border-red-500" : "border-slate-600 focus:border-emerald-500"
                }`}
              />
            </section>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300 mb-1.5 block">Mật khẩu</span>
            <section className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/80 border text-white text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500/40 ${
                  errors.password ? "border-red-500" : "border-slate-600 focus:border-emerald-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </section>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </label>

          <section className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/40"
              />
              Ghi nhớ đăng nhập
            </label>
            <button type="button" className="text-emerald-400 hover:text-emerald-300 hover:underline">
              Quên mật khẩu?
            </button>
          </section>

          <button
            type="submit"
            disabled={loginLoading || success}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:opacity-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loginLoading ? (
              <>
                <Loader2 size={18} className="anim-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <footer className="mt-6 pt-5 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-500">Demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}</p>
        </footer>
      </article>
    </section>
  );
}

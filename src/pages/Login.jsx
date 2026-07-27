import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../service/api";
import { FadeIn } from "../components/Animate";


export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/User/login", { email, password });
            const userData = { ...res.data };
            delete userData.passwordHash;
            delete userData.PasswordHash;
            localStorage.setItem("user", JSON.stringify(userData));
            setLoading(false);
            navigate("/");
        } catch {
            setLoading(false);
            setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
            {/* Background Blob Elements */}
            <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-400/20 dark:bg-emerald-600/30 blur-3xl" />
            <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-lime-400/15 dark:bg-lime-500/20 blur-3xl" />

            {/* Back to Home Button */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Quay lại trang chủ
                </Link>
            </div>

            <div className="relative w-full max-w-md space-y-8">
                {/* Card */}
                <FadeIn>
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl space-y-6 transition-colors duration-300">
                    {/* Header */}
                    <div className="flex flex-col items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-2xl shadow-lg shadow-emerald-500/30">
                                🏸
                            </span>
                            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Triple<span className="text-emerald-500 dark:text-emerald-400">T</span>
                            </span>
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Đăng nhập tài khoản</h2>
                        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                            Chào mừng bạn trở lại với TripleT Badminton
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Email của bạn</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Mật khẩu</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-2.25 0h13.5m-13.5 0a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25M10.5 15h3" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-10 pr-10 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-300"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Ghi nhớ</span>
                            </label>
                            <a href="#forgot" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-300" onClick={(e) => e.preventDefault()}>
                                Quên mật khẩu?
                            </a>
                        </div>

                        {error && <div className="text-red-500 dark:text-red-400 text-sm text-center font-semibold bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-xl py-2">{error}</div>}

                        <button
                            type="submit"
                            className="tt-btn-primary w-full py-3 disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
                        <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Hoặc tiếp tục với</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="tt-hover-lift flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="tt-hover-lift flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="#1877F2" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-300">
                            Đăng ký ngay
                        </Link>
                    </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
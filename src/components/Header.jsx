import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navLinkClass = ({ isActive }) =>
    `tt-nav ${isActive ? "tt-nav-active" : "tt-nav-inactive"}`;

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Chuyển giao diện sáng" : "Chuyển giao diện tối"}
            title={isDark ? "Giao diện sáng" : "Giao diện tối"}
            className="tt-hover-lift flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-amber-300 dark:hover:bg-white/20 dark:hover:shadow-amber-500/10"
        >
            {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path
                        fillRule="evenodd"
                        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5a10.503 10.503 0 016.46-9.694.75.75 0 01.818.162z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </button>
    );
}

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur-md dark:border-slate-700/50 dark:bg-[#0c1219]/95 dark:text-white">
            <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-6">
                <Link to="/" className="tt-logo flex shrink-0 items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-lg shadow-md shadow-emerald-500/30 transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-500/40">
                        🏸
                    </span>
                    <span className="text-xl font-bold tracking-tight">
                        Triple<span className="text-emerald-500 dark:text-emerald-400">T</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <NavLink to="/" end className={navLinkClass}>
                        Trang chủ
                    </NavLink>
                    <NavLink to="/product" className={navLinkClass}>
                        Sản phẩm
                    </NavLink>
                    <NavLink to="/about" className={navLinkClass}>
                        Giới thiệu
                    </NavLink>
                    <NavLink to="/news" className={navLinkClass}>
                        Tin tức
                    </NavLink>
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <Link to="/login" className="tt-btn-primary hidden px-5 py-2 text-sm sm:inline-flex">
                        Đăng nhập
                    </Link>
                </div>
            </div>

            <nav className="flex justify-center gap-6 border-t border-slate-200 py-3 dark:border-slate-700/50 md:hidden">
                <NavLink to="/" end className={navLinkClass}>
                    Trang chủ
                </NavLink>
                <NavLink to="/product" className={navLinkClass}>
                    Sản phẩm
                </NavLink>
                <NavLink to="/about" className={navLinkClass}>
                    Giới thiệu
                </NavLink>
                <NavLink to="/news" className={navLinkClass}>
                    Tin tức
                </NavLink>
            </nav>
        </header>
    );
}

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

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
            {isDark ? "☀️" : "🌙"}
        </button>
    );
}

export default function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    
    const [cartCount, setCartCount] = useState(0);
    // State quản lý ẩn/hiện dropdown user
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Tải số lượng giỏ hàng
    useEffect(() => {
        if (!user) return;

        const fetchCartCount = () => {
            axios
                .get("https://localhost:7147/api/Carts")
                .then((res) => {
                    const userCart = res.data.find((cart) => cart.userId === user.userId);
                    if (userCart) {
                        setCartCount(userCart.cartItems.length);
                    }
                })
                .catch((err) => console.log(err));
        };

        fetchCartCount();

        window.addEventListener("cartUpdated", fetchCartCount);

        return () => {
            window.removeEventListener("cartUpdated", fetchCartCount);
        };
    }, []);

    // Xử lý click ra ngoài để đóng Dropdown tự động
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Logic Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("user");
        setDropdownOpen(false);
        setCartCount(0); // Reset số lượng cart về 0 khi logout
        navigate("/login");
        window.location.reload(); // Reload nhẹ để các component khác cập nhật trạng thái trống
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur-md dark:border-slate-700/50 dark:bg-[#0c1219]/95 dark:text-white">
            <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-6">

                {/* Logo */}
                <Link to="/" className="tt-logo flex shrink-0 items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-lg shadow-md shadow-emerald-500/30 transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-500/40">
                        🏸
                    </span>
                    <span className="text-xl font-bold tracking-tight">
                        Triple <span className="text-emerald-500 dark:text-emerald-400">T</span>
                    </span>
                </Link>

                {/* Menu */}
                <nav className="hidden items-center gap-8 md:flex">
                    <NavLink to="/" end className={navLinkClass}>Trang chủ</NavLink>
                    <NavLink to="/product" className={navLinkClass}>Sản phẩm</NavLink>
                    <NavLink to="/about" className={navLinkClass}>Giới thiệu</NavLink>
                    <NavLink to="/news" className={navLinkClass}>Tin tức</NavLink>
                </nav>

                {/* Right */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xl"
                    >
                        🛒
                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <ThemeToggle />

                    {/* User Profile & Dropdown */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition focus:outline-none"
                            >
                                <span>👤</span>
                                <span className="max-w-[120px] truncate">
                                    {user.fullName || user.email}
                                </span>
                                <span className={`text-[10px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-[#121b24] animate-in fade-in slide-in-from-top-2 duration-150">
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                                    >
                                        ℹ️ Thông tin tài khoản
                                    </Link>
                                    
                                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                                    
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50/60 dark:hover:bg-red-950/20"
                                    >
                                        🚪 Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="tt-btn-primary hidden px-5 py-2 text-sm sm:inline-flex"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <nav className="flex justify-center gap-6 border-t border-slate-200 py-3 dark:border-slate-700/50 md:hidden">
                <NavLink to="/" end className={navLinkClass}>Trang chủ</NavLink>
                <NavLink to="/product" className={navLinkClass}>Sản phẩm</NavLink>
                <NavLink to="/about" className={navLinkClass}>Giới thiệu</NavLink>
                <NavLink to="/news" className={navLinkClass}>Tin tức</NavLink>
            </nav>
        </header>
    );
}
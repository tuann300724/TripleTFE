import { useState, useEffect } from "react";
import { Users, Loader2, Edit, Search } from "lucide-react";
import { API_BASE } from "../config";


export default function User() {
    const columns = ["Người dùng", "Email", "Vai trò", "Thao tác"];
    
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- STATE BỘ LỌC & TÌM KIẾM (CLIENT SIDE) ---
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // --- FETCH DATA TỪ API USER ---
    useEffect(() => {
        fetch(API_BASE + "/User")
            .then((res) => {
                if (!res.ok) throw new Error("Không thể tải danh sách tài khoản người dùng!");
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    // --- LOGIC XỬ LÝ LỌC VÀ TÌM KIẾM DỮ LIỆU ĐỘNG ---
    const filteredUsers = users.filter((user) => {
        const fullName = user.profile?.fullName || "";
        const email = user.email || "";
        const role = user.role || "";

        // Khớp từ khóa (Không phân biệt chữ hoa chữ thường)
        const matchSearch = 
            fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
            
        // Khớp vai trò (Admin, Staff, Customer)
        const matchRole = roleFilter === "" || role === roleFilter;

        return matchSearch && matchRole;
    });

    return (
        <div className="flex-1 min-w-0">
               
                <div className="p-6 space-y-6 max-w-7xl mx-auto">
                    
                    {/* Hero section */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <Users className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                                    TripleT Badminton
                                </p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý người dùng</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tài khoản và quyền truy cập</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button className="tt-btn-primary text-sm px-4 py-2">
                                Thêm tài khoản
                            </button>
                        </div>
                    </div>

                    {/* Body section */}
                    <div className="space-y-6 animate-[fadeUp_0.5s_ease-out]">
                        
                        {/* Thẻ Thống Kê Tổng Số Tài Khoản */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="rounded-xl bg-white p-5 shadow dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tổng người dùng</div>
                                <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                                    {isLoading ? "..." : users.length}
                                </div>
                            </div>
                        </div>

                        {/* Bộ lọc và Tìm kiếm */}
                        <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <div className="flex flex-col gap-3 md:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="search"
                                        placeholder="Tìm theo tên, email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200/80 bg-white/80 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <select
                                        className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none dark:border-slate-600 dark:bg-slate-800/80 dark:text-white md:w-48"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="">Tất cả vai trò</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Customer">Customer</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table hiển thị danh sách */}
                        <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Danh sách người dùng</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                            {columns.map((col) => (
                                                <th key={col} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                        
                                        {/* 1. TRẠNG THÁI ĐANG TẢI (LOADING) */}
                                        {isLoading && (
                                            <tr>
                                                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                                                    <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                                        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Đang tải danh sách...
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {/* 2. TRẠNG THÁI LỖI (ERROR) */}
                                        {error && !isLoading && (
                                            <tr>
                                                <td colSpan={columns.length} className="px-4 py-10 text-center text-rose-500 text-sm font-medium">
                                                    Lỗi: {error}
                                                </td>
                                            </tr>
                                        )}

                                        {/* 3. TRẠNG THÁI KHÔNG TÌM THẤY DỮ LIỆU */}
                                        {!isLoading && !error && filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                                                    Không tìm thấy người dùng nào phù hợp.
                                                </td>
                                            </tr>
                                        )}

                                        {/* 4. ĐỔ DỮ LIỆU SAU KHI LỌC THÀNH CÔNG */}
                                        {!isLoading && !error && filteredUsers.map((user) => {
                                            const userId = user.userId;
                                            const email = user.email || "N/A";
                                            const role = user.role || "Customer";
                                            const fullName = user.profile?.fullName || "Chưa cập nhật";
                                            const avatar = user.profile?.avatar;

                                            return (
                                                <tr key={userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                                    
                                                    {/* Cột 1: Thông tin người dùng */}
                                                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                                                        <div className="flex items-center gap-3">
                                                            {avatar && avatar !== "string" ? (
                                                                <img 
                                                                    src={avatar} 
                                                                    alt={fullName} 
                                                                    className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                />
                                                            ) : (
                                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                                                                    {fullName.substring(0, 2)}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-semibold text-sm text-slate-900 dark:text-white">
                                                                    {fullName}
                                                                </div>
                                                               
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Cột 2: Email */}
                                                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                        {email}
                                                    </td>

                                                    {/* Cột 3: Vai trò (Role Badge) */}
                                                    <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                                                            role === "Admin"
                                                                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900"
                                                                : role === "Staff"
                                                                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
                                                                : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900"
                                                        }`}>
                                                            {role}
                                                        </span>
                                                    </td>

                                                    {/* Cột 4: Thao tác hành động */}
                                                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-500">
                                                        <div className="flex items-center gap-2">
                                                            <a 
                                                                href={`/admin/users/edit/${userId}`} 
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition dark:bg-slate-700 dark:text-slate-300"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </a>
                                                           
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    );
}
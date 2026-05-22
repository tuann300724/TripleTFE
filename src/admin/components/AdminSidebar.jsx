import { NavLink } from "react-router-dom";
import {
    ClipboardList,
    CreditCard,
    FolderTree,
    LayoutDashboard,
    Package,
    Users,
} from "lucide-react";

const menu = [
    { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/users", icon: Users, label: "Người dùng" },
    { to: "/admin/products", icon: Package, label: "Sản phẩm" },
    { to: "/admin/orders", icon: ClipboardList, label: "Đơn hàng" },
    { to: "/admin/categories", icon: FolderTree, label: "Danh mục" },
    { to: "/admin/payments", icon: CreditCard, label: "Thanh toán" },
];

export default function AdminSidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white shadow-2xl">
            <div className="border-b border-white/10 px-5 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-lg font-black shadow-lg shadow-emerald-500/30">
                        T
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/90">
                            TripleT
                        </p>
                        <p className="text-sm font-bold">Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {menu.map(({ to, end, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                isActive
                                    ? "bg-emerald-500/20 text-emerald-300 shadow-inner shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-white/10 p-4">
                <p className="text-center text-[10px] uppercase tracking-wider text-slate-500">
                    Cầu lông chuyên nghiệp
                </p>
            </div>
        </aside>
    );
}

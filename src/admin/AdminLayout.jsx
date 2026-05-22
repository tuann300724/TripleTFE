import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

const titles = {
    "/admin": "Dashboard",
    "/admin/users": "Quản lý người dùng",
    "/admin/products": "Quản lý sản phẩm",
    "/admin/products/new": "Thêm sản phẩm",
    "/admin/orders": "Quản lý đơn hàng",
    "/admin/categories": "Quản lý danh mục",
    "/admin/payments": "Quản lý thanh toán",
};

export default function AdminLayout() {
    const { pathname } = useLocation();
    const title = titles[pathname] ?? "Admin";

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <AdminSidebar />
            <div className="ml-64 flex min-h-screen flex-col">
                <AdminHeader title={title} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="pointer-events-none fixed inset-0 ml-64 overflow-hidden">
                        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
                    </div>
                    <div className="relative z-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

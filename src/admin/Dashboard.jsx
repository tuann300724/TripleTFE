import { useEffect, useState } from "react";
import { LayoutDashboard, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";

// IMPORT CHART.JS
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
    // Đổi tiêu đề card đầu tiên thành "Doanh thu tháng này" cho chuẩn nghĩa nhé bạn
    const [stats, setStats] = useState([
        { title: "Doanh thu tháng này", value: "0₫", icon: <DollarSign className="h-7 w-7 text-emerald-600" />, bg: "from-emerald-500 to-teal-600" },
        { title: "Tổng đơn hàng", value: "0", icon: <ShoppingCart className="h-7 w-7 text-blue-500" />, bg: "from-blue-400 to-blue-600" },
        { title: "Khách hàng", value: "0", icon: <Users className="h-7 w-7 text-pink-500" />, bg: "from-pink-400 to-pink-600" },
        { title: "Tổng sản phẩm", value: "0", icon: <Package className="h-7 w-7 text-yellow-500" />, bg: "from-yellow-400 to-yellow-600" },
    ]);

    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resPayments, resOrders, resProducts, resUsers] = await Promise.all([
                    fetch("https://localhost:7147/api/Payments").then(res => res.json()),
                    fetch("https://localhost:7147/api/Orders").then(res => res.json()),
                    fetch("https://localhost:7147/api/Products").then(res => res.json()),
                    fetch("https://localhost:7147/api/User").then(res => res.json())
                ]);

                // Lấy thông tin thời gian hiện tại của hệ thống máy tính
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth(); // Tháng hiện tại (0 -> 11)

                // 1. CHỈ TÍNH DOANH THU CỦA THÁNG NÀY
                const thisMonthRevenue = resPayments
                    .filter(p => {
                        if (p.paymentStatus !== "Paid" || !p.paymentDate) return false;
                        const pDate = new Date(p.paymentDate);
                        // Ép điều kiện: Phải trùng cả Năm và trùng cả Tháng hiện tại
                        return pDate.getFullYear() === currentYear && pDate.getMonth() === currentMonth;
                    })
                    .reduce((sum, p) => sum + Number(p.amount), 0);

                // 2. Cập nhật các Stats Cards (Card 1 sẽ hiển thị số tiền của riêng tháng này)
                setStats([
                    { title: "Doanh thu tháng này", value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(thisMonthRevenue), icon: <DollarSign className="h-7 w-7 text-emerald-600" />, bg: "from-emerald-500 to-teal-600" },
                    { title: "Tổng đơn hàng", value: resOrders.length.toString(), icon: <ShoppingCart className="h-7 w-7 text-blue-500" />, bg: "from-blue-400 to-blue-600" },
                    { title: "Khách hàng", value: resUsers.length.toString(), icon: <Users className="h-7 w-7 text-pink-500" />, bg: "from-pink-400 to-pink-600" },
                    { title: "Tổng sản phẩm", value: resProducts.length.toString(), icon: <Package className="h-7 w-7 text-yellow-500" />, bg: "from-yellow-400 to-yellow-600" },
                ]);

                // 3. Xử lý mảng dữ liệu 12 tháng độc lập để vẽ biểu đồ cột bên dưới
                const rawMonthlyRevenue = Array(12).fill(0);
                resPayments.forEach(p => {
                    if (p.paymentStatus === "Paid" && p.paymentDate) {
                        const pDate = new Date(p.paymentDate);
                        if (pDate.getFullYear() === currentYear) {
                            const monthIdx = pDate.getMonth();
                            rawMonthlyRevenue[monthIdx] += Number(p.amount);
                        }
                    }
                });

                setChartData({
                    labels: Array.from({ length: 12 }, (_, i) => `Tháng ${String(i + 1).padStart(2, '0')}`),
                    datasets: [
                        {
                            label: "Doanh thu",
                            data: rawMonthlyRevenue,
                            backgroundColor: "#10B981",
                            hoverBackgroundColor: "#059669",
                            borderRadius: 6,
                            borderSkipped: false,
                            barThickness: 28,
                        }
                    ]
                });

                // 4. Lấy danh sách 5 đơn hàng mới nhất
                const sortedOrders = resOrders
                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                    .slice(0, 5);
                setRecentOrders(sortedOrders);

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Cấu hình Options Chart.js
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                titleColor: "#94A3B8",
                bodyColor: "#10B981",
                bodyFont: { size: 13, weight: "bold" },
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: function (context) {
                        let value = context.raw || 0;
                        return ` Doanh thu: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#64748B", font: { size: 11 } }
            },
            y: {
                grid: { color: "#E2E8F0" },
                border: { dash: [5, 5] },
                ticks: {
                    color: "#64748B",
                    font: { size: 11 },
                    callback: function (value) {
                        if (value === 0) return "0 ₫";
                        return `${(value / 1000000).toFixed(0)}M ₫`;
                    }
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar />
            <div className="flex-1 overflow-x-hidden">
                <div className="p-6 space-y-8">

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <LayoutDashboard className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Dashboard</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tổng quan cửa hàng cầu lông TripleT năm {new Date().getFullYear()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="rounded-xl bg-white p-5 shadow dark:bg-slate-800 flex items-center gap-4 transition-transform hover:scale-[1.02] duration-200">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bg} bg-opacity-20 shadow-inner`}>{stat.icon}</div>
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{stat.title}</div>
                                    <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Biểu đồ cột */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Báo cáo doanh thu định kỳ</h2>
                                <p className="text-xs text-slate-400">So sánh tăng giảm doanh thu trực quan giữa các tháng</p>
                            </div>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">Năm {new Date().getFullYear()}</span>
                        </div>

                        <div className="w-full overflow-x-auto pt-2">
                            <div className="min-w-[700px] h-[300px] relative">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Danh sách đơn hàng */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Đơn hàng mới gần đây</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Mã Đơn</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Sản phẩm</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Thời gian</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Tổng tiền</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {recentOrders.map((order) => (
                                        <tr key={order.orderId} className="text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-emerald-600">#{order.orderId}</td>
                                            <td className="px-4 py-3 max-w-xs truncate">
                                                {order.items && order.items.length > 0
                                                    ? order.items.map(item => `${item.productName} (x${item.quantity})`).join(", ")
                                                    : "Sản phẩm cầu lông"}
                                            </td>
                                            <td className="px-4 py-3">
                                                {new Date(order.orderDate).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${order.orderStatus === "Completed" || order.orderStatus === "Thành công"
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                                    : order.orderStatus === "Declined" || order.orderStatus === "Hủy đơn"
                                                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                                                    }`}>
                                                    {order.orderStatus === "Completed" ? "Thành công" : order.orderStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
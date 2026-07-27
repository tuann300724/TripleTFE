import { useState, useEffect } from "react";
import { ClipboardList, Loader2, Eye, Search, X, Calendar, CreditCard, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE } from "../config";
import { useToast } from "../components/Toast";


export default function Order() {
    const columns = ["Mã đơn", "Mã KH", "Ngày đặt", "Tổng tiền", "Trạng thái", "Thao tác"];
    const ITEMS_PER_PAGE = 10; // Giới hạn 10 đơn hàng trên mỗi trang
    const toast = useToast();

    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE TÌM KIẾM & BỘ LỌC ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);

    // --- STATE MODAL XEM CHI TIẾT ĐƠN HÀNG ---
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- FETCH DATA TỪ API ORDERS ---
    useEffect(() => {
        fetch(API_BASE + "/Orders")
            .then((res) => {
                if (!res.ok) throw new Error("Không thể lấy danh sách đơn hàng!");
                return res.json();
            })
            .then((data) => {

                const sortedOrders = data.sort((a, b) => {

                    return new Date(b.orderDate || b.createdDate) - new Date(a.orderDate || a.createdDate);

                });

                setOrders(sortedOrders);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    // Mỗi khi thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái thì reset về trang 1
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // --- LOGIC LỌC VÀ TÌM KIẾM ĐƠN HÀNG ---
    const filteredOrders = orders.filter((order) => {
        const matchSearch = order.orderId?.toString().includes(searchTerm) ||
            order.userId?.toString().includes(searchTerm);
        const matchStatus = statusFilter === "" || order.orderStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    // --- THUẬT TOÁN PHÂN TRANG (PAGINATION) ---
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    // Danh sách 10 đơn hàng thực tế hiển thị trên trang hiện tại
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    // --- HÀM MỞ CHI TIẾT ĐƠN HÀNG ---
    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // --- HÀM ĐỊNH DẠNG TIỀN VND ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    // --- HÀM ĐỊNH DẠNG NGÀY THÁNG ---
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    };
    // --- HÀM XỬ LÝ CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG LÊN BACKEND ---
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(API_BASE + `/Orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Cập nhật trạng thái thất bại!");

            // Cập nhật ngay lập tức trạng thái mới vào State ở Client để UI thay đổi theo
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
                )
            );

            toast(`Đơn hàng #${orderId} đã được chuyển sang trạng thái: ${newStatus}`, "success");
        } catch (err) {
            toast(err.message, "error");
        }
    };
    return (
        <>
            <div className="flex-1 min-w-0">
                <div className="p-6 space-y-6 max-w-7xl mx-auto">

                    {/* Hero section */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <ClipboardList className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý đơn hàng</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Theo dõi và xử lý đơn hàng hệ thống</p>
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
                                    placeholder="Tìm theo mã đơn hàng, mã khách hàng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200/80 bg-white/80 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white"
                                />
                            </div>
                            <div>
                                <select
                                    className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none dark:border-slate-600 dark:bg-slate-800/80 dark:text-white md:w-48"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="Completed">Completed (Đã xong)</option>
                                    <option value="Pending">Pending (Chờ duyệt)</option>
                                    <option value="Cancelled">Cancelled (Đã hủy)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bảng danh sách đơn hàng */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Danh sách đơn hàng</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        {columns.map((col) => (
                                            <th key={col} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">

                                    {isLoading && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                                                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Đang tải danh sách đơn hàng...
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {error && !isLoading && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-10 text-center text-rose-500 text-sm font-medium">Lỗi: {error}</td>
                                        </tr>
                                    )}

                                    {!isLoading && !error && filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">Không tìm thấy đơn hàng nào.</td>
                                        </tr>
                                    )}

                                    {/* Duyệt mảng dữ liệu đã cắt slice phân trang (currentItems) */}
                                    {!isLoading && !error && currentItems.map((order) => (
                                        <tr key={order.orderId} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900 dark:text-white">#{order.orderId}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">KH - {order.userId}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{formatDate(order.orderDate)}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border outline-none cursor-pointer font-sans shadow-sm transition duration-150 focus:ring-2 focus:ring-offset-1 ${order.orderStatus === "Completed"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500"
                                                        : order.orderStatus === "Pending"
                                                            ? "bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500"
                                                            : "bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500"
                                                        }`}
                                                >
                                                    <option value="Pending" className="bg-white text-amber-700 font-semibold">Pending</option>
                                                    <option value="Completed" className="bg-white text-emerald-700 font-semibold">Completed</option>
                                                    <option value="Declined" className="bg-white text-rose-700 font-semibold">Declined</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetailModal(order)}
                                                    className="tt-btn-primary h-8 px-3 gap-1.5 text-xs"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- THANH DIỀU HƯỚNG PHÂN TRANG (PAGINATION) --- */}
                        {!isLoading && !error && totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 mt-4 pt-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Hiển thị <span className="font-semibold text-slate-800 dark:text-white">{indexOfFirstItem + 1}</span> đến{" "}
                                    <span className="font-semibold text-slate-800 dark:text-white">
                                        {indexOfLastItem > filteredOrders.length ? filteredOrders.length : indexOfLastItem}
                                    </span>{" "}
                                    trong tổng số <span className="font-semibold text-slate-800 dark:text-white">{filteredOrders.length}</span> đơn hàng
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* Nút trang trước */}
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    {/* Danh sách các số trang */}
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`h-9 w-9 text-sm font-semibold rounded-lg transition ${currentPage === pageNumber
                                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                                                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    {/* Nút trang sau */}
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>

            {/* --- MODAL DIALOG CHI TIẾT ĐƠN HÀNG --- */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col overflow-hidden">

                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chi tiết đơn hàng #{selectedOrder.orderId}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Mã khách hàng: KH - {selectedOrder.userId}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            {/* Thông tin chung */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl text-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <Calendar className="h-4 w-4 text-emerald-600" />
                                    <span><strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <CreditCard className="h-4 w-4 text-emerald-600" />
                                    <span><strong>Thanh toán:</strong> {selectedOrder.paymentMethod}</span>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm đặt mua */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <ShoppingBag className="h-4 w-4 text-emerald-600" /> Danh sách sản phẩm ({selectedOrder.items?.length || 0})
                                </h4>
                                <div className="divide-y divide-slate-100 dark:divide-slate-700 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 items-center hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="h-14 w-14 rounded-lg object-cover bg-slate-100 border border-slate-200 dark:border-slate-700"
                                                onError={(e) => { e.target.src = "https://placehold.co/150"; }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.productName}</h5>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Phân loại: <span className="text-slate-600 dark:text-slate-300 font-medium">{item.version} | {item.color} | {item.size}</span>
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Số lượng: <span className="text-slate-800 dark:text-slate-200 font-bold">x{item.quantity}</span>
                                                </p>
                                            </div>
                                            <div className="text-right whitespace-nowrap">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.unitPrice)}</p>
                                                <p className="text-xs text-slate-400">Thành tiền: {formatCurrency(item.unitPrice * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tổng tiền đơn hàng</p>
                                <p className="text-2xl font-black text-emerald-600">{formatCurrency(selectedOrder.totalAmount)}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-semibold transition hover:opacity-90"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </>
    );
}
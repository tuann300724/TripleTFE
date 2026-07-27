import { useState, useEffect } from "react";
import { CreditCard, Loader2, Eye, Search, X, Calendar, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE } from "../config";
import { useToast } from "../components/Toast";


export default function Payment() {
    const columns = ["Mã GD", "Mã Đơn", "Phương thức", "Số tiền", "Ngày GD", "Trạng thái", "Thao tác"];
    const ITEMS_PER_PAGE = 10; // Giới hạn hiển thị 10 dòng trên 1 trang
    const toast = useToast();

    // --- STATE QUẢN LÝ DỮ LIỆU PAYMENT ---
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE PHÂN TRANG & BỘ LỌC ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // --- STATE XEM CHI TIẾT ORDER TỪ PAYMENT ---
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- FETCH DANH SÁCH PAYMENTS ---
    useEffect(() => {
        fetch(API_BASE + "/Payments")
            .then((res) => {
                if (!res.ok) throw new Error("Không thể lấy danh sách giao dịch!");
                return res.json();
            })
            .then((data) => {

                const sortedPayments = data.sort((a, b) => {

                    return new Date(b.paymentDate || b.createdDate) - new Date(a.paymentDate || a.createdDate);

                });

                setPayments(sortedPayments);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    // Reset về trang 1 khi tìm kiếm hoặc lọc thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // --- HÀM XEM CHI TIẾT ORDER DỰA VÀO ORDERID CỦA PAYMENT ---
    const handleViewOrderDetail = async (orderId) => {
        if (!orderId) {
            toast("Giao dịch này không gắn với mã đơn hàng nào!", "error");
            return;
        }

        setIsModalOpen(true);
        setIsLoadingOrder(true);
        setSelectedOrder(null);

        try {
            const response = await fetch(API_BASE + `/Orders/${orderId}`);
            if (!response.ok) throw new Error("Không thể tải thông tin chi tiết đơn hàng này!");
            const orderData = await response.json();
            setSelectedOrder(orderData);
        } catch (err) {
            toast(err.message, "error");
            setIsModalOpen(false);
        } finally {
            setIsLoadingOrder(false);
        }
    };

    // --- LOGIC LỌC & TÌM KIẾM ---
    const filteredPayments = payments.filter((p) => {
        const matchSearch = p.paymentId?.toString().includes(searchTerm) ||
            p.orderId?.toString().includes(searchTerm);
        const matchStatus = statusFilter === "" || p.paymentStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    // --- TÍNH TỔNG TIỀN THEO TRẠNG THÁI (Tính dựa trên danh sách đã lọc hoặc toàn bộ tùy ý, ở đây tính trên toàn bộ `payments` gốc để chuẩn thống kê) ---
    const totalSuccess = payments
        .filter(p => p.paymentStatus === "Paid")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalWaiting = payments
        .filter(p => p.paymentStatus === "Unpaid" || p.paymentStatus === "Pending")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    // --- THUẬT TOÁN PHÂN TRANG ---
    const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

    // --- UTILS FORMAT ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <div className="flex-1 min-w-0">
                <div className="p-6 space-y-6 max-w-7xl mx-auto">

                    {/* Hero Section */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <CreditCard className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý thanh toán</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lịch sử giao dịch và dòng tiền hệ thống</p>
                            </div>
                        </div>
                    </div>

                    {/* Khối Thống Kê Tổng Số Tiền Dòng Giao Dịch */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
                        {/* Thẻ Thống Kê Thành Công */}
                        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng tiền thành công</p>
                                <h3 className="text-2xl font-black text-emerald-600 font-sans">{formatCurrency(totalSuccess)}</h3>
                            </div>
                            <div className="flex h-11 px-2.5 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <span className="text-xs font-black tracking-wider">SUCCESS</span>
                            </div>
                        </div>

                        {/* Thẻ Thống Kê Đang Chờ */}
                        <div className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng tiền đang chờ</p>
                                <h3 className="text-2xl font-black text-amber-600 font-sans">{formatCurrency(totalWaiting)}</h3>
                            </div>
                            <div className="flex h-11 px-3 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                <span className="text-xs font-black tracking-wider">WAITING</span>
                            </div>
                        </div>
                    </div>

                    {/* Bộ lọc & Tìm kiếm */}
                    <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <div className="flex flex-col gap-3 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="search"
                                    placeholder="Tìm theo mã giao dịch, mã đơn hàng..."
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
                                    <option value="Paid">Success (Đã thanh toán)</option>
                                    <option value="Unpaid">Waiting (Chưa thanh toán)</option>
                                    <option value="Failed">Failed (Giao dịch lỗi)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bảng Danh Sách Giao Dịch */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Lịch sử thanh toán</h2>
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
                                            <td colSpan={columns.length} className="px-4 py-12 text-center">
                                                <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                                                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Đang tải danh sách giao dịch...
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {error && !isLoading && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-10 text-center text-rose-500 text-sm font-medium">Lỗi: {error}</td>
                                        </tr>
                                    )}

                                    {!isLoading && !error && filteredPayments.length === 0 && (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">Không tìm thấy giao dịch nào.</td>
                                        </tr>
                                    )}

                                    {!isLoading && !error && currentPayments.map((p) => (
                                        <tr key={p.paymentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900 dark:text-white">#GD-{p.paymentId}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-semibold text-emerald-600">#{p.orderId}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">{p.paymentMethod}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(p.amount)}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{formatDate(p.paymentDate)}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${p.paymentStatus === "Paid"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : p.paymentStatus === "Unpaid" || p.paymentStatus === "Pending"
                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                                    }`}>
                                                    {p.paymentStatus === "Paid" ? "Success" : (p.paymentStatus === "Unpaid" || p.paymentStatus === "Pending" ? "Waiting" : "Failed")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewOrderDetail(p.orderId)}
                                                    className="tt-btn-primary h-8 px-3 gap-1.5 text-xs"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> Xem đơn hàng
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- THANH PHÂN TRANG --- */}
                        {!isLoading && !error && totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 mt-4 pt-4">
                                <div className="text-sm text-slate-500">
                                    Mục <span className="font-semibold text-slate-800 dark:text-white">{indexOfFirstItem + 1}</span> - {" "}
                                    <span className="font-semibold text-slate-800 dark:text-white">
                                        {indexOfLastItem > filteredPayments.length ? filteredPayments.length : indexOfLastItem}
                                    </span>{" "}
                                    / tổng số <span className="font-semibold text-slate-800 dark:text-white">{filteredPayments.length}</span> giao dịch
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`h-9 w-9 text-sm font-semibold rounded-lg transition ${currentPage === index + 1
                                                ? "bg-emerald-600 text-white"
                                                : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>

            {/* --- MODAL DIALOG XEM CHI TIẾT ĐƠN HÀNG CỦA GIAO DỊCH --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col overflow-hidden">

                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {isLoadingOrder ? "Đang truy vấn đơn hàng..." : `Chi tiết đơn hàng liên kết #${selectedOrder?.orderId}`}
                                </h3>
                                {!isLoadingOrder && selectedOrder && (
                                    <p className="text-xs text-slate-400 mt-0.5">Mã khách hàng: KH - {selectedOrder.userId}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-800">
                            {isLoadingOrder ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
                                    <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
                                    <p className="text-sm font-medium">Đang tìm dữ liệu đơn hàng tương ứng từ máy chủ...</p>
                                </div>
                            ) : selectedOrder ? (
                                <div className="space-y-6">
                                    {/* Trạng thái & Ngày tạo đơn */}
                                    <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl text-sm border border-slate-100">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <Calendar className="h-4 w-4 text-emerald-600" />
                                            <span><strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <span><strong>Trạng thái đơn:</strong></span>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${selectedOrder.orderStatus === "Completed" || selectedOrder.orderStatus === "Success"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : selectedOrder.orderStatus === "Pending" || selectedOrder.orderStatus === "Waiting"
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                                }`}>
                                                {selectedOrder.orderStatus === "Completed" || selectedOrder.orderStatus === "Success" ? "Success" : (selectedOrder.orderStatus === "Pending" || selectedOrder.orderStatus === "Waiting" ? "Waiting" : selectedOrder.orderStatus)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sản phẩm nằm trong đơn hàng */}
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <ShoppingBag className="h-4 w-4 text-emerald-600" /> Danh sách sản phẩm mua ({selectedOrder.items?.length || 0})
                                        </h4>
                                        <div className="divide-y divide-slate-100 dark:divide-slate-700 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden">
                                            {selectedOrder.items?.map((item, index) => (
                                                <div key={index} className="flex gap-4 p-4 items-center bg-white dark:bg-slate-800">
                                                    <img
                                                        src={item.image}
                                                        alt={item.productName}
                                                        className="h-14 w-14 rounded-lg object-cover bg-slate-100 border"
                                                        onError={(e) => { e.target.src = "https://placehold.co/150"; }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.productName}</h5>
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            Phân loại: <span className="text-slate-600 dark:text-slate-300 font-medium">{item.version} | {item.color} | {item.size}</span>
                                                        </p>
                                                        <p className="text-xs text-slate-400">Số lượng: <span className="font-bold text-slate-800 dark:text-white">x{item.quantity}</span></p>
                                                    </div>
                                                    <div className="text-right whitespace-nowrap">
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.unitPrice)}</p>
                                                        <p className="text-xs text-slate-400">Tổng: {formatCurrency(item.unitPrice * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-rose-500 font-medium">Không thể định vị được thông tin của đơn hàng này.</div>
                            )}
                        </div>

                        {/* Footer Modal */}
                        {!isLoadingOrder && selectedOrder && (
                            <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tổng giá trị đơn hàng</p>
                                    <p className="text-2xl font-black text-emerald-600">{formatCurrency(selectedOrder.totalAmount)}</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-semibold transition hover:opacity-90"
                                >
                                    Đóng
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
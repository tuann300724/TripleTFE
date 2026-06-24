import { useState } from "react";

const getStatusDetails = (status) => {
    // Chuyển về chữ thường để so sánh chính xác nhất
    switch (status?.toLowerCase()) {
        case 'pending':
            return {
                name: 'Chờ xử lý',
                className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse',
                dotClass: 'bg-amber-500'
            };
        case 'Processing':
            return {
                name: 'Chờ xử lý',
                className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse',
                dotClass: 'bg-amber-500'
            };
        case 'shipping':
            return {
                name: 'Đang giao hàng',
                className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse',
                dotClass: 'bg-blue-500'
            };
        case 'completed':
            return {
                name: 'Đã hoàn thành',
                className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                dotClass: 'bg-emerald-500'
            };
        case 'cancelled':
            return {
                name: 'Đã hủy',
                className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
                dotClass: 'bg-rose-500'
            };
        default:
            return {
                name: status || 'Không xác định',
                className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
                dotClass: 'bg-slate-500'
            };
    }
};

const formatPrice = (price) => {
    if (price === undefined || price === null) return "0 đ";
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

export default function ProfileOrders({ orders }) {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lịch sử mua hàng</h3>
                    <p className="text-xs text-slate-400 mt-1">Quản lý và kiểm tra tình trạng các đơn đặt hàng của bạn.</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                    Tổng số: {orders.length} đơn
                </span>
            </div>

            {/* List Đơn Hàng */}
            <div className="space-y-4">
                {currentOrders.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 border border-dashed rounded-2xl">Bạn chưa có đơn hàng nào.</div>
                ) : (
                    currentOrders.map((order) => {
                        const statusInfo = getStatusDetails(order.orderStatus);
                        return (
                            <div
                                key={order.orderId}
                                className="border border-slate-200/70 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                {/* Order Header */}
                                <div className="bg-slate-50 dark:bg-slate-900/60 px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-3">
                                    <div className="space-y-1">
                                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">ĐƠN HÀNG #{order.orderId}</span>
                                        <span className="block text-xs text-slate-400">
                                            Đặt lúc: {new Date(order.orderDate).toLocaleDateString('vi-VN')} {new Date(order.orderDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
                                            {statusInfo.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 px-5">
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx} className="py-4 flex gap-4">
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="h-16 w-16 rounded-xl object-cover border border-slate-200/50 dark:border-slate-700/50 shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate hover:text-emerald-500 transition-colors">
                                                    {item.productName}
                                                </h4>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Phân loại: {item.color || 'Mặc định'} | {item.size || 'Mặc định'} | {item.version || 'Mặc định'}
                                                </p>
                                                <p className="text-xs text-slate-400">Số lượng: {item.quantity}</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{formatPrice(item.unitPrice)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="bg-slate-50/50 dark:bg-slate-900/20 px-5 py-4 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="text-xs text-slate-400">
                                        <span>Hình thức: </span>
                                        <span className="font-semibold text-slate-500 dark:text-slate-300">{order.paymentMethod}</span>
                                    </div>
                                    <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-4">
                                        <div>
                                            <span className="text-xs text-slate-400 mr-2">Tổng tiền:</span>
                                            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatPrice(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* THANH ĐIỀU HƯỚNG CHUYỂN TRANG (PAGINATION PANEL) */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${currentPage === 1
                            ? "text-slate-300 bg-slate-50 cursor-not-allowed border-slate-200"
                            : "text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-95"
                            }`}
                    >
                        ⬅ Trực diện trước
                    </button>

                    <span className="text-xs font-semibold text-slate-500">
                        Trang <strong className="text-slate-800 dark:text-white">{currentPage}</strong> trên tổng {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${currentPage === totalPages
                            ? "text-slate-300 bg-slate-50 cursor-not-allowed border-slate-200"
                            : "text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-95"
                            }`}
                    >
                        Tiếp sau ➡
                    </button>
                </div>
            )}
        </div>
    );
}

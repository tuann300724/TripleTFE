import React, { useState, useEffect } from "react";
import { Package, Plus, Loader2, Edit, Trash2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";


export default function Product() {
    const columns = ["Hình ảnh", "Sản phẩm", "Thương hiệu / Danh mục", "Giá bán", "Trạng thái", "Thao tác"];
    
    // --- STATE QUẢN LÝ DỮ LIỆU VÀ PHÂN TRANG ---
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State quản lý xem dòng nào đang mở Dropdown đổi Trạng thái (Lưu productId)
    const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);

    // --- FETCH DATA TỪ API PRODUCTS ---
    useEffect(() => {
        fetch("https://localhost:7147/api/Products")
            .then((res) => {
                if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm!");
                return res.json();
            })
            .then((data) => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    // --- HÀM FORMAT TIỀN VÀ XỬ LÝ ĐƯỜNG DẪN ẢNH ---
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    // --- XỬ LÝ LOGIC PHÂN TRANG (PAGINATION) ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleStatusChange = async (productId, newStatus) => {
        try {
            // Đóng dropdown sau khi chọn phân loại trạng thái
            setOpenStatusDropdownId(null);

            // Gọi API đổi trạng thái bằng Query String (status=1 hoặc status=2) theo phương thức PUT
            const response = await fetch(
                `https://localhost:7147/api/Products/change-status/${productId}?status=${newStatus}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // Kiểm tra nếu API phản hồi lỗi (ví dụ: lỗi 400, 404, 500)
            if (!response.ok) {
                throw new Error("Cập nhật trạng thái lên hệ thống thất bại!");
            }

            // Nếu API chạy thành công (200 OK), cập nhật lại mảng dữ liệu trên giao diện UI
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.productId === productId ? { ...p, status: newStatus } : p
                )
            );

        } catch (err) {
            // Hiển thị thông báo nếu gặp sự cố kết nối hoặc lỗi nghiệp vụ từ API
            alert(err.message || "Gặp lỗi khi xử lý đổi trạng thái!");
        }
    };

    // --- HÀM XỬ LÝ XÓA SẢN PHẨM ---
    const handleDelete = async (productId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                const response = await fetch(`https://localhost:7147/api/Products/${productId}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Xóa sản phẩm thất bại!");
                setProducts(products.filter(p => p.productId !== productId));
                alert("Đã xóa sản phẩm thành công!");
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="flex bg-slate-50 dark:bg-slate-900 min-h-screen">
            <AdminSidebar />
            <div className="flex-1 min-w-0">
                
                <div className="p-6">
                    
                    {/* Hero section */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <Package className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý sản phẩm</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Vợt, giày, phụ kiện cầu lông</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <a href="/admin/products/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Thêm sản phẩm
                            </a>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Danh sách sản phẩm</h2>
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
                                            <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                                                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Đang tải danh sách...
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {error && !isLoading && (
                                        <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-rose-500 text-sm font-medium">Lỗi: {error}</td></tr>
                                    )}

                                    {!isLoading && !error && products.length === 0 && (
                                        <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400 text-sm">Chưa có sản phẩm nào.</td></tr>
                                    )}

                                    {/* MAP DỮ LIỆU PHÂN TRANG (10 sản phẩm mỗi trang) */}
                                    {!isLoading && !error && currentItems.map((product) => {
                                        // Định dạng giá hiển thị khoảng giá Min - Max trực tiếp từ Backend trả về
                                        const priceRange = product.minPrice === product.maxPrice 
                                            ? formatPrice(product.minPrice)
                                            : `${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`;

                                        return (
                                            <tr key={product.productId} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                                
                                                {/* Ảnh Thumbnail */}
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-700">
                                                        <img 
                                                            src={product.thumbnail} 
                                                            alt={product.productName} 
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => { e.target.src = "https://placehold.co/50x50?text=No+Image"; }}
                                                        />
                                                    </div>
                                                </td>

                                                {/* Tên sản phẩm */}
                                                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                                                    <div className="max-w-[240px] truncate" title={product.productName}>
                                                        {product.productName}
                                                    </div>
                                                </td>

                                                {/* Phân loại Brand & Category tên chữ từ Backend */}
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300 mr-1.5">
                                                        {product.brandName}
                                                    </span>
                                                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                        {product.categoryName}
                                                    </span>
                                                </td>

                                                {/* Khoảng Giá */}
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                                                    {priceRange}
                                                </td>

                                                {/* CỘT TOGGLE ĐỔI TRẠNG THÁI (STATUS DROPDOWN) */}
                                                <td className="px-4 py-3 whitespace-nowrap text-sm relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenStatusDropdownId(openStatusDropdownId === product.productId ? null : product.productId)}
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all border ${
                                                            product.status === 1
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                                                                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                                                        }`}
                                                    >
                                                        <span className={`h-1.5 w-1.5 rounded-full ${product.status === 1 ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                                                        {product.status === 1 ? "Đang bán" : "Tạm ẩn"}
                                                        <ChevronDown className="h-3 w-3 opacity-60" />
                                                    </button>

                                                    {/* Menu Dropdown đổ xuống khi click */}
                                                    {openStatusDropdownId === product.productId && (
                                                        <>
                                                            {/* Lớp phủ vô hình để nhấn ra ngoài tự đóng menu */}
                                                            <div className="fixed inset-0 z-10" onClick={() => setOpenStatusDropdownId(null)}></div>
                                                            <div className="absolute left-4 mt-1 w-32 rounded-lg bg-white shadow-xl border border-slate-100 py-1 z-20 dark:bg-slate-700 dark:border-slate-600 animate-[fadeUp_0.15s_ease-out]">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStatusChange(product.productId, 1)}
                                                                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2"
                                                                >
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Đang bán (1)
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStatusChange(product.productId, 2)}
                                                                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2"
                                                                >
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> Tạm ẩn (2)
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>

                                                {/* Các nút sửa / xóa */}
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <a href={`/admin/products/${product.productId}`} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition dark:bg-slate-700 dark:text-slate-300">
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

                        {/* --- THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION BAR) --- */}
                        {!isLoading && !error && products.length > itemsPerPage && (
                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                                <p className="text-sm text-slate-500">
                                    Hiển thị <span className="font-semibold text-slate-700 dark:text-white">{indexOfFirstItem + 1}</span> đến{" "}
                                    <span className="font-semibold text-slate-700 dark:text-white">
                                        {indexOfLastItem > products.length ? products.length : indexOfLastItem}
                                    </span>{" "}
                                    trong tổng số <span className="font-semibold text-slate-700 dark:text-white">{products.length}</span> sản phẩm
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    
                                    {/* Hiển thị số trang hiện tại */}
                                    <span className="text-sm font-semibold text-slate-700 dark:text-white px-3 py-1 bg-slate-50 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                                        Trang {currentPage} / {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                    
                </div>
            </div>
        </div>
    );
}
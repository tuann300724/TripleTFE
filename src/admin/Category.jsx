import { FolderTree } from "lucide-react";
import { API_BASE } from "../config";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

// Hàm hỗ trợ tạo slug đơn giản từ tên danh mục
const convertToSlug = (text) => {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")        // Xóa ký tự đặc biệt
        .replace(/\s+/g, "-")            // Thay khoảng trắng bằng dấu -
        .trim();
};

export default function Category() {
    // Đổi tiêu đề cột thành cụ thể để tương thích trực quan hơn
    const columns = ["Tên danh mục", "Slug", "Thao tác"];
    const toast = useToast();

    // 1. Khởi tạo state lưu trữ danh sách danh mục và trạng thái tải dữ liệu
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 2. Hàm gọi API lấy dữ liệu (được tách ra để gọi lại sau khi xóa thành công)
    const fetchCategories = async () => {
        try {
            const response = await fetch(API_BASE + "/Categories");
            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu từ server");
            }
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 3. Hàm xử lý XÓA danh mục kèm bắt lỗi logic ràng buộc sản phẩm
    const handleDelete = async (cat) => {
        // Cảnh báo xác nhận trước khi xóa tránh người dùng bấm nhầm
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.categoryName}" không?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(API_BASE + `/Categories/${cat.categoryId}`, {
                method: "DELETE",
            });

            // Nếu server trả về lỗi hệ thống hoặc chặn xóa do ràng buộc dữ liệu (DB Constraint)
            if (!response.ok) {
                // Kiểm tra nếu status code là 400 hoặc 409 (thường gặp khi dính khoá ngoại)
                if (response.status === 400 || response.status === 409) {
                    throw new Error("Danh mục này hiện đang có sản phẩm (Product) bên trong nên không thể xóa!");
                }
                throw new Error("Danh mục này hiện đang có sản phẩm (Product) bên trong nên không thể xóa!");
            }

            // Xóa thành công
            toast("Xóa danh mục thành công!", "success");
            fetchCategories(); 

        } catch (err) {
            // Hiển thị thông báo lỗi thân thiện được bắt ở trên
            toast(err.message, "error");
        }
    };

    return (
        <div className="flex-1">
                <div className="p-6">
                    {/* Hero section */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <FolderTree className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý danh mục</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Phân loại sản phẩm TripleT</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => navigate("/admin/categories/add")}
                                className="tt-btn-primary text-sm px-4 py-2"
                            >
                                Thêm danh mục
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Danh sách danh mục</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-6 text-center text-red-500 dark:text-red-400 font-medium">{error}</td>
                                        </tr>
                                    ) : categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">Không có danh mục nào.</td>
                                        </tr>
                                    ) : (
                                        categories.map((cat) => (
                                            <tr key={cat.categoryId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                                    <div>
                                                        <p>{cat.categoryName}</p>
                                                        {cat.description && <p className="text-xs text-slate-400 font-normal mt-0.5">{cat.description}</p>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 font-mono text-xs">
                                                    {convertToSlug(cat.categoryName)}
                                                </td>

                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex gap-2">
                                                        {/* Bấm sửa */}
                                                        <button 
                                                            onClick={() => navigate(`/admin/categories/edit/${cat.categoryId}`)} 
                                                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                                        >
                                                            Sửa
                                                        </button>
                                                        {/* Bấm xóa - Truyền nguyên object 'cat' vào để lấy cả Name và ID hiển thị cảnh báo */}
                                                        <button 
                                                            onClick={() => handleDelete(cat)} 
                                                            className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/80"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
    );
}
import AdminSidebar from "./components/AdminSidebar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams dùng để lấy ID trên URL

export default function CategoryEdit() {
    const { id } = useParams(); // Lấy trực tiếp tham số ID từ URL /edit/:id
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Lấy dữ liệu cũ của danh mục này để hiển thị lên form trước khi sửa
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await fetch(`https://localhost:7147/api/Categories/${id}`);
                if (!response.ok) throw new Error("Không lấy được thông tin chi tiết danh mục");
                const data = await response.json();
                setCategoryName(data.categoryName);
                setDescription(data.description || "");
            } catch (err) {
                alert(err.message);
                navigate("/admin/categories");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`https://localhost:7147/api/Categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryId: parseInt(id), // Ép kiểu về số nguyên đúng định dạng API yêu cầu
                    categoryName: categoryName,
                    description: description
                })
            });

            if (!response.ok) throw new Error("Cập nhật thất bại");
            alert("Cập nhật danh mục thành công!");
            navigate("/admin/categories");
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Đang tải thông tin danh mục...</div>;

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 p-6">
                <div className="max-w-xl rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Chỉnh sửa danh mục (ID: {id})</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tên danh mục *</label>
                            <input
                                type="text"
                                required
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Mô tả chi tiết</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div className="flex gap-2 pt-4">
                            <button type="button" onClick={() => navigate("/admin/categories")} className="rounded-lg border px-4 py-2 text-sm font-medium">Hủy</button>
                            <button type="submit" disabled={submitting} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                                {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
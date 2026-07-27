import { FolderPlus, ArrowLeft } from "lucide-react";
import { API_BASE } from "../config";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function CategoryAdd() {
    const navigate = useNavigate();
    const toast = useToast();
    
    // Khởi tạo state cho Form
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            toast("Vui lòng điền tên danh mục!", "error");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(API_BASE + "/Categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    categoryName: categoryName,
                    description: description
                })
            });

            if (!response.ok) {
                throw new Error("Không thể thêm danh mục mới");
            }

            toast("Thêm danh mục mới thành công!", "success");
            navigate("/admin/categories"); // Quay lại trang danh sách
        } catch (err) {
            toast(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1">
                <div className="p-6">
                    {/* Header section */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                <FolderPlus className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">TripleT Badminton</p>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Thêm danh mục</h1>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate("/admin/categories")}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" /> Quay lại
                        </button>
                    </div>

                    {/* Form Section */}
                    <div className="max-w-2xl rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                                    Tên danh mục <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="Ví dụ: Vợt cầu lông, Phụ kiện, Giày cầu lông..."
                                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                                    Mô tả danh mục
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Nhập mô tả ngắn gọn cho loại sản phẩm này..."
                                    rows="4"
                                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-700 dark:text-white resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/categories")}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-700 dark:hover:bg-slate-600"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="tt-btn-primary text-sm px-5 py-2 disabled:opacity-50"
                                >
                                    {submitting ? "Đang lưu..." : "Xác nhận thêm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    );
}
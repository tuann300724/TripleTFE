import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Image } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import axios from "axios";

// 1. Nhập React Quill và file CSS giao diện của nó
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function AddNews() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // Lưu chuỗi HTML bao gồm chữ định dạng và ảnh chèn thêm
    const [imageFile, setImageFile] = useState(null); // Ảnh bìa chính (Thumbnail)
    const [previewUrl, setPreviewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cấu hình các công cụ hiển thị trên thanh soạn thảo văn bản
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'], // Kiểu chữ
            [{ 'color': [] }, { 'background': [] }],   // Màu chữ, màu nền
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'], // Chèn đường dẫn và CHÈN HÌNH ẢNH TRỰC TIẾP
            ['clean'] 
        ],
    };

    // Xử lý xem trước ảnh bìa chính (Thumbnail)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Xử lý gửi dữ liệu lên .NET
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kiểm tra nội dung rỗng (Quill khi rỗng sẽ là "<p><br></p>")
        if (!title.trim() || !content.trim() || content === "<p><br></p>") {
            alert("Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết!");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("Title", title.trim());
        formData.append("Content", content); // Chuỗi HTML chứa text định dạng + ảnh base64 gửi lên NVARCHAR(MAX)
        formData.append("UserId", 1); 

        if (imageFile) {
            formData.append("thumbnail", imageFile); // Ảnh bìa chính cho trường Thumbnail
        }

        try {
            const response = await axios.post("https://localhost:7147/api/News", formData);

            if (response.status === 200 || response.status === 201) {
                alert("Đăng bài viết thành công!");
                navigate("/admin/news");
            }
        } catch (error) {
            console.error("Lỗi gửi bài viết:", error);
            const serverError = error.response?.data?.errors || error.response?.data || error.message;
            alert("Lỗi từ Server: " + JSON.stringify(serverError));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
                <div className="mb-6">
                    <Link to="/admin/news" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Quay lại quản lý tin tức
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Thêm bài viết mới</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow max-w-4xl space-y-6">
                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tiêu đề bài viết</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề tin tức nổi bật..."
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Nội dung bài viết phong phú (Rich Text) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nội dung chi tiết (Có thể chèn hình, chỉnh chữ)</label>
                        <div className="h-full bg-white text-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            <ReactQuill 
                                theme="snow" 
                                value={content} 
                                onChange={setContent} 
                                modules={quillModules}
                                placeholder="Viết nội dung chi tiết tại đây. Bạn có thể kéo thả hoặc copy-paste hình ảnh trực tiếp vào ô này..."
                                className="min-h-[300px]"
                            />
                        </div>
                    </div>

                    {/* Ảnh bìa chính (Thumbnail) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ảnh bìa bài viết (Thumbnail ngoài danh sách)</label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30 relative">
                            {previewUrl ? (
                                <div className="relative w-full h-64">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                    <label htmlFor="file-upload" className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-md cursor-pointer hover:bg-black/80 transition">
                                        Thay ảnh khác
                                    </label>
                                </div>
                            ) : (
                                <label htmlFor="file-upload" className="flex flex-col items-center justify-center py-6 cursor-pointer w-full group">
                                    <Image className="h-10 w-10 text-slate-400 group-hover:text-emerald-500 transition-colors mb-2" />
                                    <span className="text-sm text-slate-500">Bấm để tải ảnh đại diện bài viết</span>
                                </label>
                            )}
                            <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>
                    </div>

                    {/* Nút xử lý */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/news")}
                            className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow transition disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" /> {isSubmitting ? "Đang lưu..." : "Đăng bài viết"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
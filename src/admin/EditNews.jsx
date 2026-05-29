import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import axios from "axios"; // Sử dụng axios đồng bộ hiệu năng gửi file
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";


export default function EditNews() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [currentThumbnail, setCurrentThumbnail] = useState(""); 
    const [imageFile, setImageFile] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cấu hình thanh công cụ (Toolbar) cho ReactQuill
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    // 1. Tải thông tin bài viết cũ đổ vào Form khi mở trang
    useEffect(() => {
        axios.get(`https://localhost:7147/api/News/${id}`)
            .then((response) => {
                const data = response.data;
                setTitle(data.title || "");
                setContent(data.content || "");
                setCurrentThumbnail(data.thumbnail || "");
            })
            .catch((err) => {
                console.error("Lỗi lấy chi tiết bài viết:", err);
                alert("Không tìm thấy hoặc không thể lấy dữ liệu bài viết này!");
                navigate("/admin/news");
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    // Xử lý khi Admin chọn một file ảnh mới thay thế
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // 2. Xử lý cập nhật bài viết (Gửi dữ liệu PUT lên API)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || content === "<p><br></p>") {
            alert("Tiêu đề và nội dung không được bỏ trống!");
            return;
        }

        setIsSubmitting(true);

        // Khởi tạo đối tượng FormData để đóng gói hỗn hợp văn bản + file nhị phân
        const formData = new FormData();
        
        formData.append("Title", title.trim());
        formData.append("Content", content.trim());
        formData.append("UserId", 1); // UserId cố định hoặc động theo hệ thống

        // Đính kèm tệp tin hình ảnh mới nếu có thay đổi
        if (imageFile) {
            formData.append("thumbnail", imageFile);
        }

        try {
            // Gửi request PUT lên endpoint API
            const response = await axios.put(`https://localhost:7147/api/News/${id}`, formData);

            if (response.status === 200 || response.status === 204) {
                alert("Cập nhật bài viết thành công!");
                navigate("/admin/news");
            }
        } catch (error) {
            console.error("Lỗi cập nhật bài viết:", error);
            const serverError = error.response?.data?.errors || error.response?.data || error.message;
            alert("Cập nhật thất bại: " + JSON.stringify(serverError));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-6 text-center text-slate-500">Đang tải dữ liệu bài viết cũ...</div>
            </div>
        );
    }

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
                <div className="mb-6">
                    <Link to="/admin/news" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Hủy và quay lại danh sách
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Chỉnh sửa bài viết</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow max-w-3xl space-y-6">
                    {/* Ô nhập tiêu đề */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tiêu đề bài viết</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Nhập tiêu đề bài viết mới..."
                        />
                    </div>

                    {/* Ô nhập nội dung ReactQuill (Giống hệt trang Add) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Nội dung chi tiết (Có thể chèn hình, chỉnh chữ)
                        </label>
                        {/* CSS bổ sung để ép chiều cao khung trắng đều nhau không bị lệch */}
                        <div className="bg-white text-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 [.ql-container]:!min-h-[300px] [.ql-editor]:!min-h-[300px]">
                            <ReactQuill 
                                theme="snow" 
                                value={content} 
                                onChange={setContent} 
                                modules={quillModules}
                                placeholder="Viết nội dung chi tiết tại đây. Bạn có thể kéo thả hoặc copy-paste hình ảnh trực tiếp vào ô này..."
                            />
                        </div>
                    </div>

                    {/* Ô xử lý hình ảnh */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hình ảnh hiển thị</label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30 relative">
                            <div className="relative w-full h-64">
                                <img 
                                    src={previewUrl || currentThumbnail || "https://via.placeholder.com/800x400"} 
                                    alt="Thumbnail" 
                                    className="w-full h-full object-cover rounded-lg" 
                                />
                                <label htmlFor="file-edit-upload" className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-md cursor-pointer hover:bg-black/80 transition">
                                    Thay ảnh mới
                                </label>
                            </div>
                            <input id="file-edit-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>
                    </div>

                    {/* Thanh nút bấm hành động */}
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
                            <Save className="h-4 w-4" /> {isSubmitting ? "Đang lưu..." : "Cập nhật thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
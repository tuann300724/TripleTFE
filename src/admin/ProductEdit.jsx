import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Save, Tag, Trash2, Image as ImageIcon, Plus, Loader2, Upload } from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white";
const labelClass = "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

export default function ProductEdit() {
    const { id } = useParams(); // Lấy productId từ URL
    const navigate = useNavigate();

    // --- STATE HỆ THỐNG ---
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- STATE DỮ LIỆU PRODUCT CHA ---
    const [productName, setProductName] = useState("");
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("1");
    const [images, setImages] = useState([]);

    // --- STATE QUẢN LÝ BIẾN THỂ (LẤY TỪ API PRODUCTVARIANTS) ---
    const [variants, setVariants] = useState([]);

    // --- 1. LOAD DỮ LIỆU CŨ LÊN FORM KHI VÀO TRANG ---
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Bước 1: Load danh mục, thương hiệu và thông tin Product cha trước
                const [catRes, brandRes, productRes] = await Promise.all([
                    fetch("https://localhost:7147/api/Categories"),
                    fetch("https://localhost:7147/api/Brands"),
                    fetch(`https://localhost:7147/api/Products/${id}`)
                ]);

                if (!productRes.ok) throw new Error("Không tìm thấy thông tin sản phẩm!");

                const catData = await catRes.json();
                const brandData = await brandRes.json();
                const productData = await productRes.json();

                setCategories(catData);
                setBrands(brandData);

                // Đổ dữ liệu product cha vào các ô input
                setProductName(productData.productName || "");
                setDescription(productData.description || "");
                setBrandId(productData.brandId?.toString() || "");
                setCategoryId(productData.categoryId?.toString() || "");
                setStatus(productData.status?.toString() || "1");

                // Xử lý nạp ảnh cũ hiển thị lên UI preview
                const initialImages = [];
                if (productData.thumbnail) {
                    initialImages.push({ id: "thumb-old", isOld: true, previewUrl: productData.thumbnail });
                }
                if (productData.images && Array.isArray(productData.images)) {
                    productData.images.forEach((imgUrl, idx) => {
                        initialImages.push({ id: `img-old-${idx}`, isOld: true, previewUrl: imgUrl });
                    });
                }
                setImages(initialImages);

                // Bước 2: Gọi API ProductVariants để lấy danh sách biến thể theo ProductId này
                const variantRes = await fetch(`https://localhost:7147/api/ProductVariants`);
                if (variantRes.ok) {
                    const allVariants = await variantRes.json();
                    
                    // Lọc ra các biến thể thuộc về productId hiện tại
                    const filteredVariants = allVariants.filter(v => v.productId === parseInt(id));

                    if (filteredVariants.length > 0) {
                        setVariants(filteredVariants.map(v => ({
                            variantId: v.variantId, // Giữ ID này lại để tí nữa gọi PUT cập nhật đúng dòng
                            color: v.color || "",
                            size: v.size || "",
                            version: v.version || "Chính hãng",
                            price: v.price?.toString() || "",
                            stock: v.stock?.toString() || "",
                            sku: v.sku || ""
                        })));
                    } else {
                        // Nếu sản phẩm cha chưa có biến thể nào, tự tạo 1 dòng trống mặc định
                        setVariants([{ color: "", size: "", version: "Chính hãng", price: "", stock: "", sku: "" }]);
                    }
                } else {
                    setVariants([{ color: "", size: "", version: "Chính hãng", price: "", stock: "", sku: "" }]);
                }

                setIsPageLoading(false);
            } catch (err) {
                console.error("Lỗi khởi tạo dữ liệu form:", err);
                alert(err.message || "Gặp sự cố khi kết nối máy chủ!");
                navigate("/admin/products");
            }
        };

        fetchAllData();
    }, [id, navigate]);

    // --- 2. CÁC HÀM TƯƠNG TÁC BIẾN THỂ ĐỘNG ---
    const handleAddVariant = () => {
        setVariants([...variants, { color: "", size: "", version: "Chính hãng", price: "", stock: "", sku: "" }]);
    };

    const handleRemoveVariant = async (index) => {
        const targetVariant = variants[index];
        
        if (variants.length === 1) {
            alert("Sản phẩm bắt buộc phải duy trì ít nhất một cấu hình biến thể!");
            return;
        }

        // Nếu biến thể này đã tồn tại dưới Database (có variantId), tiến hành gọi API DELETE xóa luôn
        if (targetVariant.variantId) {
            if (window.confirm("Biến thể này đã lưu trên hệ thống, bạn có chắc chắn muốn XÓA hẳn không?")) {
                try {
                    const res = await fetch(`https://localhost:7147/api/ProductVariants/${targetVariant.variantId}`, {
                        method: "DELETE"
                    });
                    if (!res.ok) throw new Error("Không thể xóa biến thể này trên Database!");
                    alert("Đã xóa biến thể thành công!");
                } catch (err) {
                    alert(err.message);
                    return; // Dừng lại không xóa trên UI nếu API lỗi
                }
            } else {
                return; // Người dùng hủy lệnh xóa
            }
        }

        // Cập nhật lại giao diện UI sau khi xóa dòng thành công
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    // --- 3. XỬ LÝ QUẢN LÝ ẢNH ---
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert("Tải lên tối đa 5 hình ảnh!");
            return;
        }
        const newImages = files.map((file) => ({
            id: `img-new-${Date.now()}-${Math.random()}`,
            isOld: false,
            file: file,
            previewUrl: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => {
            const updated = [...prev];
            if (!updated[index].isOld) URL.revokeObjectURL(updated[index].previewUrl);
            updated.splice(index, 1);
            return updated;
        });
    };

    // --- 4. HÀM SUBMIT LƯU THAY ĐỔI ĐỒNG BỘ (PUT / POST / DELETE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName || !brandId || !categoryId) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }
        if (!variants.every(v => v.price && v.stock)) {
            alert("Vui lòng điền đầy đủ Giá bán và Tồn kho cho toàn bộ biến thể!");
            return;
        }

        setIsSubmitting(true);

        try {
            // 4.1: CẬP NHẬT THÔNG TIN PRODUCT CHA (PUT)
            const formData = new FormData();
            formData.append("ProductId", id);
            formData.append("ProductName", productName);
            formData.append("Description", description);
            formData.append("BrandId", parseInt(brandId));
            formData.append("CategoryId", parseInt(categoryId));
            formData.append("Status", parseInt(status));

            if (images.length > 0) {
                if (!images[0].isOld) formData.append("Thumbnail", images[0].file);
                images.slice(1).forEach((img) => {
                    if (!img.isOld) formData.append("Images", img.file);
                });
            }

            const productResponse = await fetch(`https://localhost:7147/api/Products/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!productResponse.ok) throw new Error("Cập nhật sản phẩm cha thất bại!");

            // 4.2: ĐỒNG BỘ MẢNG BIẾN THỂ CON (VỪA PUT SỬA CŨ - VỪA POST THÊM MỚI)
            const variantPromises = variants.map((variant) => {
                const variantPayload = {
                    productId: parseInt(id),
                    color: variant.color || "Mặc định",
                    size: variant.size || "Mặc định",
                    version: variant.version || "Chính hãng",
                    sku: variant.sku || `TT-${id}-${Math.floor(Math.random() * 1000)}`,
                    price: parseFloat(variant.price),
                    stock: parseInt(variant.stock)
                };

                // Phân biệt: Nếu có variantId thì chạy PUT sửa dòng cũ, không có thì chạy POST tạo dòng mới
                const hasId = !!variant.variantId;
                const url = hasId 
                    ? `https://localhost:7147/api/ProductVariants/${variant.variantId}`
                    : `https://localhost:7147/api/ProductVariants`;

                return fetch(url, {
                    method: hasId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(variantPayload),
                }).then(res => {
                    if (!res.ok) throw new Error("Gặp lỗi khi lưu thông tin biến thể!");
                    return res.json();
                });
            });

            // Đợi tất cả các tiến trình sửa/thêm biến thể con hoàn tất thành công
            await Promise.all(variantPromises);

            alert("Đã cập nhật toàn bộ sản phẩm và danh sách biến thể thành công!");
            navigate("/admin/products");

        } catch (error) {
            console.error(error);
            alert(error.message || "Hệ thống gặp sự cố khi lưu dữ liệu!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-500">Đang đồng bộ dữ liệu biến thể sản phẩm...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link to="/admin/products" className="hover:text-emerald-600 flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Danh sách sản phẩm</Link>
                <span>/</span><span className="text-slate-800 dark:text-white font-medium">Chỉnh sửa</span>
            </nav>

            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Chỉnh sửa sản phẩm</h1>
                <p className="mt-1 text-sm text-slate-500">Đồng bộ cập nhật thông tin gốc và các biến thể phân loại</p>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Thông tin chính */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white"><Package className="h-5 w-5 text-emerald-600" />Thông tin cơ bản</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Tên sản phẩm *</label>
                                <input type="text" className={inputClass} value={productName} onChange={(e) => setProductName(e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Mô tả sản phẩm</label>
                                <textarea rows={4} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* KHU VỰC NHẬP/CHỈNH SỬA BIẾN THỂ LẤY TỪ API */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Tag className="h-5 w-5 text-emerald-600" /> Quản lý chi tiết biến thể hệ thống
                            </h2>
                            <button type="button" onClick={handleAddVariant} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <Plus className="h-3.5 w-3.5" /> Thêm loại mới
                            </button>
                        </div>

                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div key={index} className="relative grid gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/30 sm:grid-cols-6 pt-8 sm:pt-4">
                                    {/* Nút xóa biến thể */}
                                    <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute right-2 top-2 text-slate-400 hover:text-rose-500 sm:static sm:flex sm:items-center sm:justify-center sm:pt-6">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Màu sắc</label>
                                        <input type="text" className={inputClass} value={variant.color} onChange={(e) => handleVariantChange(index, "color", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Kích thước</label>
                                        <input type="text" className={inputClass} value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Giá bán *</label>
                                        <input type="number" className={inputClass} value={variant.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Tồn kho *</label>
                                        <input type="number" className={inputClass} value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Mã SKU</label>
                                        <input type="text" className={inputClass} value={variant.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} disabled={!!variant.variantId} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: PHÂN LOẠI & ẢNH */}
                <div className="space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Phân loại dữ liệu</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Danh mục *</label>
                                <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Thương hiệu *</label>
                                <select className={inputClass} value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map((b) => (
                                        <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Trạng thái hiển thị</label>
                                <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="1">Đang bán</option>
                                    <option value="2">Tạm ẩn</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Khung quản lý hình ảnh */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><ImageIcon className="h-5 w-5 text-emerald-600" /> Ảnh sản phẩm</h2>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{images.length}/5 tấm</span>
                        </div>
                        <div className="space-y-4">
                            {images.length < 5 && (
                                <label className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-700">
                                    <Upload className="h-5 w-5 text-slate-400 mb-1" />
                                    <p className="text-xs text-slate-500">Tải thêm ảnh mới</p>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            )}
                            {images.length > 0 && (
                                <div className="space-y-2">
                                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border">
                                        <img src={images[0].previewUrl} alt="Thumb" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                        {images.map((img, i) => (
                                            <div key={img.id} className="group relative aspect-square overflow-hidden rounded border">
                                                <img src={img.previewUrl} className="h-full w-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveImage(i)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Khối nút bấm submit */}
                    <div className="space-y-2">
                        <button className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50" type="submit" disabled={isSubmitting}>
                            <Save className="h-5 w-5" /> {isSubmitting ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
                        </button>
                        <Link to="/admin/products" className="block text-center w-full rounded-xl border py-3 text-slate-700 font-bold bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-600">Hủy</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
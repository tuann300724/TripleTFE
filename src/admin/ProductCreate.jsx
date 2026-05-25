import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Save, Tag, X, Upload, Trash2, Image as ImageIcon, Plus } from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white";
const labelClass = "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

export default function ProductCreate() {
    const navigate = useNavigate();

    // --- STATE DANH SÁCH LẤY TỪ API ---
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // --- STATE QUẢN LÝ THÔNG TIN PRODUCT CHA ---
    const [productName, setProductName] = useState("");
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("1");
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- STATE QUẢN LÝ DANH SÁCH BIẾN THỂ CON (Mặc định có sẵn 1 dòng) ---
    const [variants, setVariants] = useState([
        { color: "", size: "", version: "Chính hãng", price: "", stock: "", sku: "" }
    ]);

    // --- 1. GỌI API ĐỂ LẤY DANH MỤC VÀ THƯƠNG HIỆU ---
    useEffect(() => {
        // Lấy danh mục
        fetch("https://localhost:7147/api/Categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Lỗi lấy danh mục:", err));

        // Lấy thương hiệu (Bạn thay URL đúng của API Brands nhé)
        fetch("https://localhost:7147/api/Brands")
            .then((res) => res.json())
            .then((data) => setBrands(data))
            .catch((err) => console.error("Lỗi lấy thương hiệu:", err));
    }, []);

    // --- 2. CÁC HÀM XỬ LÝ BIẾN THỂ (DYNAMIC VARIANT FORM) ---
    const handleAddVariant = () => {
        setVariants([...variants, { color: "", size: "", version: "Chính hãng", price: "", stock: "", sku: "" }]);
    };

    const handleRemoveVariant = (index) => {
        if (variants.length === 1) {
            alert("Sản phẩm phải có ít nhất một biến thể giá và kho hàng!");
            return;
        }
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    // --- 3. XỬ LÝ ẢNH ---
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert("Bạn chỉ được tải lên tối đa 5 hình ảnh!");
            return;
        }
        const newImages = files.map((file) => ({
            id: `img-${Date.now()}-${Math.random()}`,
            file: file,
            previewUrl: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].previewUrl);
            updated.splice(index, 1);
            return updated;
        });
    };

    // --- 4. HÀM SUBMIT LƯU PRODUCT VÀ TOÀN BỘ VARIANT ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName || !brandId || !categoryId) {
            alert("Vui lòng điền đầy đủ thông tin sản phẩm bắt buộc!");
            return;
        }
        if (images.length === 0) {
            alert("Vui lòng chọn ít nhất một ảnh bìa!");
            return;
        }

        // Kiểm tra xem các dòng variant đã nhập đủ Giá và Kho chưa
        const isVariantsValid = variants.every(v => v.price && v.stock);
        if (!isVariantsValid) {
            alert("Vui lòng nhập đầy đủ Giá bán và Tồn kho cho tất cả các biến thể!");
            return;
        }

        setIsSubmitting(true);

        try {
            // BƯỚC 4.1: TẠO PRODUCT CHA
            const formData = new FormData();
            formData.append("ProductName", productName);
            formData.append("Description", description);
            formData.append("BrandId", parseInt(brandId));
            formData.append("CategoryId", parseInt(categoryId));
            formData.append("Status", parseInt(status));
            formData.append("Thumbnail", images[0].file);

            if (images.length > 1) {
                images.slice(1).forEach((img) => {
                    formData.append("Images", img.file);
                });
            }

            const productResponse = await fetch("https://localhost:7147/api/Products", {
                method: "POST",
                body: formData,
            });

            if (!productResponse.ok) throw new Error("Tạo sản phẩm thất bại!");
            const createdProduct = await productResponse.json();
            const newProductId = createdProduct.productId;

            // BƯỚC 4.2: CHẠY VÒNG LẶP GỬI LOẠT BIẾN THỂ LÊN API VARIANT
            const variantPromises = variants.map((variant) => {
                const variantPayload = {
                    productId: newProductId,
                    color: variant.color || "Mặc định",
                    size: variant.size || "Mặc định",
                    version: variant.version || "Chính hãng",
                    sku: variant.sku || `TT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    price: parseFloat(variant.price),
                    stock: parseInt(variant.stock)
                };

                return fetch("https://localhost:7147/api/ProductVariants", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(variantPayload),
                }).then(res => {
                    if (!res.ok) throw new Error("Lỗi khi tạo một trong các biến thể!");
                    return res.json();
                });
            });

            // Đợi toàn bộ API Variant chạy xong thành công
            await Promise.all(variantPromises);

            alert("Đã thêm sản phẩm và toàn bộ biến thể thành công!");
            navigate("/admin/products");

        } catch (error) {
            console.error(error);
            alert(error.message || "Hệ thống gặp lỗi khi lưu dữ liệu!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb & Title */}
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link to="/admin/products" className="hover:text-emerald-600 flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Sản phẩm</Link>
                <span>/</span><span>Thêm mới</span>
            </nav>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"><Package className="h-7 w-7" /></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Thêm sản phẩm đa biến thể</h1>
                        <p className="mt-1 text-sm text-slate-500">Quản lý nhiều phiên bản màu sắc, kích thước và giá bán</p>
                    </div>
                </div>
            </div>

            {/* FORM CHÍNH */}
            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Thông tin cơ bản */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white"><Package className="h-5 w-5 text-emerald-600" />Thông tin cơ bản</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Tên sản phẩm *</label>
                                <input type="text" className={inputClass} value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="VD: Yonex Astrox 99 Pro" />
                            </div>
                            <div>
                                <label className={labelClass}>Mô tả sản phẩm</label>
                                <textarea rows={4} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập mô tả..." />
                            </div>
                        </div>
                    </div>

                    {/* KHU VỰC QUẢN LÝ NHIỀU BIẾN THỂ (VARIANTS) */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Tag className="h-5 w-5 text-emerald-600" /> Các phiên bản / Biến thể sản phẩm
                            </h2>
                            <button type="button" onClick={handleAddVariant} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <Plus className="h-3.5 w-3.5" /> Thêm biến thể
                            </button>
                        </div>

                        {/* Danh sách các dòng Variant nhập liệu */}
                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div key={index} className="relative grid gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/30 sm:grid-cols-6 pt-8 sm:pt-4">
                                    {/* Nút xóa dòng biến thể */}
                                    <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute right-2 top-2 text-slate-400 hover:text-rose-500 sm:static sm:flex sm:items-center sm:justify-center sm:pt-6">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Màu sắc</label>
                                        <input type="text" placeholder="Đỏ, Đen..." className={inputClass} value={variant.color} onChange={(e) => handleVariantChange(index, "color", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Kích thước</label>
                                        <input type="text" placeholder="3U, 4U, 41..." className={inputClass} value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Giá bán *</label>
                                        <input type="number" placeholder="Giá ₫" className={inputClass} value={variant.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Tồn kho *</label>
                                        <input type="number" placeholder="Số lượng" className={inputClass} value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Mã SKU</label>
                                        <input type="text" placeholder="Tự sinh" className={inputClass} value={variant.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: PHÂN LOẠI ĐỘNG VÀ ẢNH */}
                <div className="space-y-6">
                    {/* Phân loại load từ API */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Phân loại dữ liệu</h2>
                        <div className="space-y-4">
                            {/* Danh mục gọi từ API */}
                            <div>
                                <label className={labelClass}>Danh mục *</label>
                                <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName || cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Thương hiệu gọi từ API */}
                            <div>
                                <label className={labelClass}>Thương hiệu *</label>
                                <select className={inputClass} value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map((b) => (
                                        <option key={b.brandId} value={b.brandId}>
                                            {b.brandName || b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Trạng thái hiển thị</label>
                                <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="1">Đang bán</option>
                                    <option value="0">Tạm ẩn</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Ảnh sản phẩm (Giữ nguyên logic cũ của bạn) */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><ImageIcon className="h-5 w-5 text-emerald-600" /> Ảnh sản phẩm *</h2>
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">{images.length}/5 tấm</span>
                        </div>
                        <div className="space-y-4">
                            {images.length < 5 && (
                                <label className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30">
                                    <Upload className="h-5 w-5 text-slate-400 mb-1" />
                                    <p className="text-xs text-slate-500">Tải ảnh lên</p>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            )}
                            {images.length > 0 && (
                                <div className="space-y-2">
                                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border"><img src={images[0].previewUrl} alt="Thumb" className="h-full w-full object-cover" /><span className="absolute left-2 top-2 rounded bg-emerald-600 px-2 py-0.5 text-[10px] text-white">Ảnh bìa</span></div>
                                    <div className="grid grid-cols-4 gap-1">
                                        {images.map((img, i) => (
                                            <div key={img.id} className="group relative aspect-square overflow-hidden rounded border">
                                                <img src={img.previewUrl} className="h-full w-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveImage(i)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút submit */}
                    <div className="space-y-2">
                        <button className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50" type="submit" disabled={isSubmitting}>
                            <Save className="h-5 w-5" /> {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
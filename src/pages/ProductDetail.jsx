import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../service/api";
import { ShoppingCart } from "lucide-react";
import { FadeIn } from "../components/Animate";
import { useToast } from "../components/Toast";
import { useAuth } from "../hooks/useAuth";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specs");
    const [showAlert, setShowAlert] = useState(false);
    const toast = useToast();

    // 1. Fetch Product Data
    useEffect(() => {
        api
            .get(`/Products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setSelectedImage(res.data.thumbnail || "");
            })
            .catch((err) => {
                console.error("Lỗi lấy chi tiết sản phẩm:", err);
                setError(err.message);
            });
    }, [id]);

    // 2. Fetch Variants Data (Nên tối ưu API lọc theo productId từ backend nếu được)
    useEffect(() => {
        api
            .get("/ProductVariants")
            .then((res) => {
                const filteredVariants = res.data.filter(
                    (item) => item.productId === Number(id)
                );
                setVariants(filteredVariants);
            })
            .catch((err) => {
                console.error("Lỗi lấy biến thể sản phẩm:", err);
                setError(err.message);
            });
    }, [id]);

    // Đồng bộ cập nhật ảnh khi chọn màu sắc (dùng thumbnail nếu có, không thì giữ ảnh mặc định)
    useEffect(() => {
        if (selectedColor && product?.thumbnail) {
            setSelectedImage(product.thumbnail);
        }
    }, [selectedColor, variants, product?.thumbnail]);

    // Loading check đặt dưới hooks để tránh vi phạm Rules of Hooks
    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/50 py-16 px-8 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-3 text-sm text-emerald-600 hover:underline">Thử lại</button>
                </div>
            </div>
        );
    }

    if (!product) return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
    );

    // Lấy danh sách Size và Color độc nhất
    const sizes = [...new Set(variants.map((v) => v.size))];
    const colors = [...new Set(variants.map((v) => v.color))];

    // Tính toán các lựa chọn hợp lệ dựa trên thuộc tính đã chọn trước đó
    const validColors = selectedSize
        ? [...new Set(variants.filter((v) => v.size === selectedSize).map((v) => v.color))]
        : colors;

    const validSizes = selectedColor
        ? [...new Set(variants.filter((v) => v.color === selectedColor).map((v) => v.size))]
        : sizes;

    const sumStock = variants.reduce((acc, v) => acc + v.stock, 0);

    const specs = [
        { label: "Thương hiệu", value: product.brandName || "Đang cập nhật" },
        { label: "Danh mục", value: product.categoryName || "Đang cập nhật" },
        { label: "Xuất xứ", value: product.country || "Chính hãng" },
        { label: "Kho tổng", value: `${sumStock} sản phẩm` },
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price || 0);
    };

    // Hàm kiểm tra điều kiện trước khi Add to cart hoặc Mua ngay
    const checkValidSelection = () => {
        if (!user) {
            toast("Vui lòng đăng nhập để tiếp tục mua sắm!", "error");
            navigate("/login");
            return null;
        }

        if (!selectedSize || !selectedColor) {
            toast("Vui lòng chọn đầy đủ Kích thước và Màu sắc sản phẩm!", "error");
            return null;
        }

        const selectedVariant = variants.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        );

        if (!selectedVariant) {
            toast("Phiên bản sản phẩm này hiện không tồn tại!", "error");
            return null;
        }

        if (selectedVariant.stock < quantity) {
            toast(`Sản phẩm này chỉ còn lại ${selectedVariant.stock} mặt hàng trong kho!`, "error");
            return null;
        }

        return { user, selectedVariant };
    };

    // Xử lý Thêm giỏ hàng
    const handleAddToCart = async () => {
        const validation = checkValidSelection();
        if (!validation) return;

        const { user, selectedVariant } = validation;

        try {
            await api.post("/Carts/add-to-cart", {
                userId: user.userId,
                variantId: selectedVariant.variantId,
                quantity: quantity,
            });

            setShowAlert(true);
            window.dispatchEvent(new Event("cartUpdated")); // Notify Navbar update
            setQuantity(1);
            setTimeout(() => setShowAlert(false), 3000);
        } catch (error) {
            console.error(error);
            toast("Thêm vào giỏ hàng thất bại. Vui lòng thử lại sau.", "error");
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-8 transition-colors duration-300 min-h-screen">
            {/* Alert Notification */}
            {showAlert && (
                <div className="fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-400 backdrop-blur-xl shadow-xl animate-bounce">
                    <ShoppingCart size={20} />
                    <div>
                        <p className="font-semibold text-sm">Đã thêm vào giỏ hàng thành công!</p>
                        <p className="text-xs opacity-80 max-w-[200px] truncate">Sản phẩm: {product.productName}</p>
                    </div>
                    <Link to="/cart" className="ml-4 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">
                        Xem giỏ
                    </Link>
                </div>
            )}

            <div className="mx-auto max-w-6xl px-6 md:px-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Link to="/" className="hover:text-emerald-500 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/product" className="hover:text-emerald-500 transition-colors">Sản phẩm</Link>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{product.productName}</span>
                </nav>

                {/* Main Content */}
                <div className="mt-8 grid gap-8 lg:grid-cols-12">
                    {/* Left: Image Gallery */}
                    <FadeIn delay={100} className="lg:col-span-6">
                        <div className="space-y-4">
                        <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 aspect-square flex items-center justify-center shadow-sm">
                            <img
                                src={selectedImage}
                                alt={product.productName}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        </div>
                        {/* Thumbnails list */}
                        <div className="grid grid-cols-4 gap-3">
                            {/* thumbnail mặc định */}
                            <button
                                type="button"
                                onClick={() => setSelectedImage(product.thumbnail)}
                                className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:ring-2 hover:ring-emerald-500 ${selectedImage === product.thumbnail ? "border-emerald-500 scale-95" : "border-slate-200"}`}
                            >
                                <img src={product.thumbnail} alt="Main" className="h-full w-full object-cover" />
                            </button>
                            {/* Các ảnh phụ khác nếu có */}
                            {product.images?.map((img, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:ring-2 hover:ring-emerald-500 ${selectedImage === img ? "border-emerald-500 scale-95" : "border-slate-200"}`}
                                >
                                    <img src={img} alt="Detail" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                    </FadeIn>

                    {/* Right: Info Config */}
                    <FadeIn className="lg:col-span-6">
                        <div className="flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400">{product.categoryName}</span>
                                {product.badge && (
                                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                                {product.productName}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center text-amber-500">{"★".repeat(5)}</div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">4.9</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-500 dark:text-slate-400">120 Đánh giá</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-500 dark:text-slate-400">254 Đã bán</span>
                            </div>

                            {/* Pricing Display Dynamic */}
                            <div className="flex items-baseline gap-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                                {(() => {
                                    let activeVariant = null;
                                    if (selectedColor && selectedSize) {
                                        activeVariant = variants.find(v => v.color === selectedColor && v.size === selectedSize);
                                    } else if (selectedColor) {
                                        activeVariant = variants.find(v => v.color === selectedColor);
                                    }

                                    if (activeVariant?.price) {
                                        return (
                                            <>
                                                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatPrice(activeVariant.price)}
                                                </span>
                                            </>
                                        );
                                    } else if (variants.length > 0) {
                                        const prices = variants.map(v => v.price).filter(Boolean);
                                        if (prices.length === 0) return null;
                                        const minPrice = Math.min(...prices);
                                        const maxPrice = Math.max(...prices);
                                        return (
                                            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                                {minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
                                            </span>
                                        );
                                    }
                                    return <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(product.minPrice)}</span>;
                                })()}
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {product.description || "Sản phẩm chính hãng chất lượng cao, thiết kế tối ưu hóa đảm bảo trải nghiệm đỉnh cao cho người sử dụng."}
                            </p>

                            {/* Size UI */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    <span>Chọn kích thước:</span>
                                    <span className="text-emerald-500 hover:underline cursor-pointer text-xs font-normal">Bảng quy đổi size</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => {
                                        const disabled = selectedColor && !validSizes.includes(size);
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => !disabled && setSelectedSize(selectedSize === size ? "" : size)}
                                                className={`rounded-xl border px-4 py-2 text-sm transition-all duration-200 active:scale-[0.96] ${selectedSize === size
                                                    ? "border-emerald-500 bg-emerald-500/10 font-medium text-emerald-600"
                                                    : "border-slate-200 text-slate-700 dark:text-slate-300 dark:border-slate-800"
                                                    } ${disabled ? "opacity-30 cursor-not-allowed" : "hover:border-slate-400"}`}
                                                disabled={disabled}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Color UI */}
                            <div className="space-y-2">
                                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">Chọn màu sắc:</span>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((color) => {
                                        const disabled = selectedSize && !validColors.includes(color);
                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => !disabled && setSelectedColor(selectedColor === color ? "" : color)}
                                                className={`rounded-xl border px-4 py-2 text-sm transition-all duration-200 active:scale-[0.96] ${selectedColor === color
                                                    ? "border-emerald-500 bg-emerald-500/10 font-medium text-emerald-600"
                                                    : "border-slate-200 text-slate-700 dark:text-slate-300 dark:border-slate-800"
                                                    } ${disabled ? "opacity-30 cursor-not-allowed" : "hover:border-slate-400"}`}
                                                disabled={disabled}
                                            >
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quantity UI */}
                            <div className="flex items-center gap-4 py-2">
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Số lượng:</span>
                                <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 h-full font-bold transition-all"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 h-full font-bold transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="flex-1 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-500/10 font-bold py-3.5 flex justify-center items-center gap-2 transition-all"
                            >
                                Thêm vào giỏ
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    const validation = checkValidSelection();
                                    if (!validation) return;
                                    const { user, selectedVariant } = validation;
                                    try {
                                        await api.post("/Carts/add-to-cart", { userId: user.userId, variantId: selectedVariant.variantId, quantity });
                                        window.dispatchEvent(new Event("cartUpdated"));
                                        navigate("/checkout");
                                    } catch { toast("Thêm vào giỏ thất bại!", "error"); }
                                }}
                                className="flex-1 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 font-bold py-3.5 flex justify-center items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                    </FadeIn>
                </div>

                {/* Tabs Information (Specs/Desc) */}
                <FadeIn delay={150}>
                    <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <div className="flex border-b border-slate-200 dark:border-slate-700 gap-6">
                        {[
                            { id: "specs", label: "Thông số kỹ thuật" },
                            { id: "desc", label: "Mô tả sản phẩm" },
                            { id: "policies", label: "Chính sách & Bảo hành" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 text-sm font-semibold relative transition-all duration-300 ${activeTab === tab.id ? "text-emerald-500" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6">
                        {activeTab === "specs" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <tbody>
                                        {specs.map((spec, i) => (
                                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800/80">
                                                <td className="py-3.5 pr-4 font-semibold text-slate-500 dark:text-slate-400 w-1/3">{spec.label}</td>
                                                <td className="py-3.5 text-slate-800 dark:text-slate-200">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === "desc" && (
                            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>Sản phẩm mang lại khả năng trợ lực tối đa, giảm tối đa phản lực tác động gây chấn thương.</p>
                            </div>
                        )}
                        {activeTab === "policies" && (
                            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <p>✓ Bảo hành chính hãng trong vòng 3 tháng.</p>
                                <p>✓ Đổi trả miễn phí trong vòng 7 ngày nếu lỗi do nhà sản xuất.</p>
                            </div>
                        )}
                    </div>
                </div>
                </FadeIn>
            </div>
        </div>
    );
}
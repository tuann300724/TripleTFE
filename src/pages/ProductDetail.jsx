import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);

    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specs");
    const [showAlert, setShowAlert] = useState(false);

    // Product
    useEffect(() => {
        axios
            .get(`https://localhost:7147/api/Products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setSelectedImage(res.data.thumbnail || "");
            })
            .catch((err) => console.log(err));
    }, [id]);

    // Variants
    useEffect(() => {
        axios
            .get("https://localhost:7147/api/ProductVariants")
            .then((res) => {
                const filteredVariants = res.data.filter(
                    (item) => item.productId === Number(id)
                );

                setVariants(filteredVariants);
            })
            .catch((err) => console.log(err));
    }, [id]);

    // Loading phải nằm dưới hooks
    if (!product) return <div>Loading...</div>;

    console.log("pro", product);
    console.log("val", variants);

    const sizes = [...new Set(variants.map((v) => v.size))];

    const colors = [...new Set(variants.map((v) => v.color))];
    const specs = [
        {
            label: "Thương hiệu",
            value: product.brandName,
        },
        {
            label: "Danh mục",
            value: product.categoryName,
        },
        {
            label: "Xuất xứ",
            value: product.country,
        },
        {
            label: "Kho",
            value: `${product.stock} sản phẩm`,
        },
    ];

    const relatedProducts = [];
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price || 0);
    };

    const handleAddToCart = () => {
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const handleBuyNow = () => {
        navigate("/checkout");
    };


    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-8 transition-colors duration-300">
            {/* Alert Notification */}
            {showAlert && (
                <div className="fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-400 backdrop-blur-xl shadow-xl animate-bounce">
                    <span className="text-xl">🛒</span>
                    <div>
                        <p className="font-semibold text-sm">Đã thêm vào giỏ hàng!</p>
                        <p className="text-xs opacity-80">Sản phẩm: {product.productName}</p>
                    </div>
                    <Link to="/cart" className="ml-4 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">
                        Xem giỏ hàng
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

                {/* Main Product Info Container */}
                <div className="mt-8 grid gap-8 lg:grid-cols-12">
                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 aspect-square flex items-center justify-center shadow-sm">
                            <img
                                src={selectedImage}
                                alt={product.productName}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        </div>
                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-3">
                            {product.images?.map((img, index) => {
                                const imageUrl = `${img}`;

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSelectedImage(imageUrl)}
                                        className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 ${selectedImage === imageUrl
                                            ? "border-emerald-500 shadow-md shadow-emerald-500/10 scale-95"
                                            : "border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600"
                                            }`}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt="Thumbnail"
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Order Configuration */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="tt-label text-xs">{product.categoryName}</span>
                                {product.badge && (
                                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                                {product.productName}
                            </h1>

                            {/* Ratings & Sales Info */}
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center text-amber-500">
                                    {"★".repeat(5)}
                                </div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">4.9</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-500 dark:text-slate-400">120 Đánh giá</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-500 dark:text-slate-400">254 Đã bán</span>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-baseline gap-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatPrice(product.price)}
                                </span>
                                {product.oldPrice && (
                                    <>
                                        <span className="text-base text-slate-400 line-through">
                                            {formatPrice(product.oldPrice)}
                                        </span>
                                        <span className="rounded-lg bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                                            Giảm {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="tt-body text-sm">
                                Sản phẩm chính hãng chất lượng cao, thiết kế tối ưu hóa cho lối chơi tấn công uy lực hoặc di chuyển linh hoạt. Đảm bảo trải nghiệm thể thao đỉnh cao cho người sử dụng.
                            </p>

                            {/* Size Options */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    <span>Chọn kích thước:</span>
                                    <span className="text-emerald-500 hover:underline cursor-pointer text-xs font-normal">Bảng quy đổi size</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`rounded-xl border px-4 py-2 text-sm ${selectedSize === size
                                                ? "border-emerald-500 bg-emerald-100"
                                                : "border-slate-300"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Options */}
                            <div className="space-y-2">
                                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">Chọn màu sắc:</span>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`rounded-xl border px-4 py-2 text-sm transition ${selectedColor === color
                                                    ? "border-emerald-500 bg-emerald-100 text-emerald-700"
                                                    : "border-slate-300"
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity and Actions */}
                            <div className="flex items-center gap-4 py-2">
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Số lượng:</span>
                                <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 h-full font-bold transition-all"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 h-full font-bold transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="tt-btn-ghost w-full border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-bold py-3.5 flex justify-center items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                                Thêm vào giỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                className="tt-btn-primary w-full py-3.5 shadow-lg shadow-emerald-500/20 font-bold"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>

                {/* Information Tabs */}
                <div className="mt-16 tt-card p-6 md:p-8">
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
                                className={`pb-4 text-sm font-semibold relative transition-all duration-300 ${activeTab === tab.id
                                    ? "text-emerald-500"
                                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === "specs" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <tbody>
                                        {specs.map((spec, i) => (
                                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800/80">
                                                <td className="py-3.5 pr-4 font-semibold text-slate-500 dark:text-slate-400 w-1/3">
                                                    {spec.label}
                                                </td>
                                                <td className="py-3.5 text-slate-800 dark:text-slate-200">
                                                    {spec.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "desc" && (
                            <div className="space-y-4 text-sm tt-body">
                                <p>
                                    Được phát triển với những công nghệ tiên tiến nhất từ các thương hiệu cầu lông hàng đầu, sản phẩm mang lại khả năng trợ lực tối đa cho người chơi, giảm rung chấn chấn thương khuỷu tay và bả vai.
                                </p>
                                <p>
                                    Thiết kế khí động học kết hợp cùng cấu trúc sợi carbon mô-đun cao giúp người chơi thực hiện các động tác vung vợt nhanh hơn, cắm cầu chuẩn hơn. Đối với giày, lớp đệm êm hỗ trợ hấp thụ lực tốt bảo vệ bàn chân khỏi các cú nhảy đập cầu cực mạnh.
                                </p>
                            </div>
                        )}

                        {activeTab === "policies" && (
                            <div className="space-y-4 text-sm tt-body">
                                <h4 className="font-semibold text-slate-900 dark:text-white">Chính sách vận chuyển:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Miễn phí vận chuyển toàn quốc cho tất cả các đơn hàng có giá trị từ 500,000đ trở lên.</li>
                                    <li>Hỗ trợ giao hàng hỏa tốc trong nội thành từ 1 - 2 tiếng.</li>
                                </ul>
                                <h4 className="font-semibold text-slate-900 dark:text-white mt-4">Chính sách bảo hành & Đổi trả:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Bảo hành chính hãng trong vòng 3 tháng đối với các lỗi từ nhà sản xuất.</li>
                                    <li>Đổi mới sản phẩm hoặc đổi size hoàn toàn miễn phí trong vòng 7 ngày kể từ ngày nhận hàng (sản phẩm còn nguyên tem mác chưa qua sử dụng).</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sản phẩm liên quan</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedProducts.map((p) => (
                                <article key={p.id} className="group tt-card-interactive flex h-full flex-col overflow-hidden">
                                    <div className="relative aspect-square shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700/80">
                                        <img
                                            src={p.thumbnail}
                                            alt={p.name}
                                            className="tt-img-zoom h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <p className="tt-label text-xs">{p.category}</p>
                                        <h3 className="mt-1 line-clamp-2 min-h-14 text-lg font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                            {p.name}
                                        </h3>
                                        <div className="mt-3 flex min-h-8 flex-wrap items-baseline gap-2">
                                            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatPrice(p.price)}
                                            </span>
                                        </div>
                                        <Link to={`/product/${p.id}`} className="tt-btn-dark mt-auto w-full py-2.5 text-sm text-center">
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

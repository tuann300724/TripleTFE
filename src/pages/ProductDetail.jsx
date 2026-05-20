import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products, formatPrice } from "../data/products";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the product by ID or default to the first product if not found
    const product = products.find((p) => p.id === parseInt(id)) || products[0];

    // State for gallery images, size, color, quantity, and active info tab
    const [selectedImage, setSelectedImage] = useState(product.image);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specs");
    const [showAlert, setShowAlert] = useState(false);

    // Mock options based on category
    const isRacket = product.category === "Vợt cầu lông";
    const isShoes = product.category === "Giày thể thao";
    const isClothing = product.category === "Trang phục";

    const sizes = isRacket
        ? ["3U/G5", "4U/G5", "5U/G5"]
        : isShoes
        ? ["39", "40", "41", "42", "43"]
        : isClothing
        ? ["S", "M", "L", "XL", "XXL"]
        : ["Tiêu chuẩn"];

    const colors = [
        { name: "Đen Emerald", value: "#059669" },
        { name: "Xanh Sapphire", value: "#1d4ed8" },
        { name: "Trắng Titan", value: "#f8fafc" },
        { name: "Đỏ Crimson", value: "#dc2626" },
    ];

    // Specs mock data
    const specs = isRacket
        ? [
              { label: "Trọng lượng / Chu vi cán", value: "3U (Avg. 88g) G5, 4U (Avg. 83g) G5" },
              { label: "Độ cứng đũa vợt", value: "Cứng (Stiff)" },
              { label: "Khung vợt", value: "HM Graphite / Namd / VOLUME CUT RESIN / Tungsten" },
              { label: "Sức căng khuyến nghị", value: "4U: 20 - 28 lbs, 3U: 21 - 29 lbs" },
              { label: "Thương hiệu", value: "Yonex (Nhật Bản)" },
          ]
        : isShoes
        ? [
              { label: "Công nghệ đế", value: "Power Cushion +, Radial Blade Sole" },
              { label: "Chất liệu thân", value: "Synthetic Leather, Durable Skin Light" },
              { label: "Chất liệu đế", value: "Rubber Sole (Đế cao su chuyên dụng)" },
              { label: "Trọng lượng", value: "Khoảng 290g / chiếc (Size 41)" },
              { label: "Thương hiệu", value: "Yonex (Nhật Bản)" },
          ]
        : [
              { label: "Chất liệu", value: "100% Polyester Cao Cấp" },
              { label: "Công nghệ vải", value: "TruBreeze (Thấm hút mồ hôi siêu tốc)" },
              { label: "Khả năng co giãn", value: "4 chiều, thoáng khí tối đa" },
              { label: "Thương hiệu", value: "TripleT Badminton" },
          ];

    // Find 3 related products
    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    const handleAddToCart = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
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
                        <p className="text-xs opacity-80">Sản phẩm: {product.name}</p>
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
                    <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* Main Product Info Container */}
                <div className="mt-8 grid gap-8 lg:grid-cols-12">
                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 aspect-square flex items-center justify-center shadow-sm">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        </div>
                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-3">
                            {[product.image, "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=600&q=80", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80", product.image].map((img, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                        selectedImage === img
                                            ? "border-emerald-500 shadow-md shadow-emerald-500/10 scale-95"
                                            : "border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600"
                                    }`}
                                >
                                    <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Order Configuration */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="tt-label text-xs">{product.category}</span>
                                {product.badge && (
                                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                                {product.name}
                            </h1>

                            {/* Ratings & Sales Info */}
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center text-amber-500">
                                    {"★" .repeat(5)}
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
                                            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                                                selectedSize === size
                                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
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
                                            key={color.name}
                                            type="button"
                                            onClick={() => setSelectedColor(color.name)}
                                            title={color.name}
                                            className={`group relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                                                selectedColor === color.name ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900" : "border-slate-300"
                                            }`}
                                            style={{ backgroundColor: color.value === "#f8fafc" ? "#fff" : color.value }}
                                        >
                                            {selectedColor === color.name && (
                                                <span className={`h-2.5 w-2.5 rounded-full ${color.value === "#f8fafc" ? "bg-slate-900" : "bg-white"}`} />
                                            )}
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
                                className={`pb-4 text-sm font-semibold relative transition-all duration-300 ${
                                    activeTab === tab.id
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
                                            src={p.image}
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

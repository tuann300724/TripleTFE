import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";

// Sample products for Wishlist (consistent with products.js)
const wishlistItems = [
    {
        id: 2,
        name: "Vợt Lining Axforce 90 Max",
        category: "Vợt cầu lông",
        price: 3590000,
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80",
    },
    {
        id: 5,
        name: "Túi đựng vợt Victor BR6218",
        category: "Túi vợt",
        price: 1290000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    },
    {
        id: 6,
        name: "Áo thi đấu Li-Ning Pro",
        category: "Trang phục",
        price: 590000,
        oldPrice: 790000,
        image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    },
];

// Sample orders history
const mockOrders = [
    {
        id: "TT-8829",
        date: "20/05/2026",
        status: "shipping", // shipping, delivered, cancelled
        statusName: "Đang giao hàng",
        paymentMethod: "Thanh toán MoMo",
        items: [
            { name: "Vợt Yonex Astrox 99 Pro", price: 4290000, qty: 1, image: "https://imgs.search.brave.com/msEpqzANUjXgm933hlBhdKOcf0Bks1nVZsm0dmwmHlY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iaXp3/ZWIuZGt0Y2RuLm5l/dC90aHVtYi9sYXJn/ZS8xMDAvMDc4LzE0/NC9wcm9kdWN0cy8y/NDI3OTQyNTEtNDY2/NDc3NDA1MDIwMDMz/MC00Njc0NDc2Njgw/NDkzMTE0NDUxLW4u/anBnP3Y9MTY4NTA3/MTc3NTczMA" },
            { name: "Quả cầu Yonex AS-50", price: 890000, qty: 1, image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80" }
        ],
        total: 5180000,
    },
    {
        id: "TT-7650",
        date: "12/04/2026",
        status: "delivered",
        statusName: "Đã giao thành công",
        paymentMethod: "Thanh toán khi nhận hàng (COD)",
        items: [
            { name: "Giày Yonex Power Cushion 65 Z3", price: 2890000, qty: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
            { name: "Áo thi đấu Li-Ning Pro", price: 590000, qty: 2, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80" }
        ],
        total: 4070000,
    }
];

// Sample Vouchers
const mockVouchers = [
    { code: "TRIPLET50K", desc: "Giảm ngay 50.000₫ cho mọi đơn hàng từ 600.000₫", expiry: "HSD: 30/06/2026", isCopied: false },
    { code: "FREESHIP", desc: "Miễn phí vận chuyển toàn quốc cho đơn hàng bất kỳ", expiry: "HSD: 15/07/2026", isCopied: false },
    { code: "SMASH30", desc: "Giảm 30% tối đa 150.000₫ khi mua áo quần cầu lông", expiry: "HSD: 05/06/2026", isCopied: false }
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState("info");
    const [showSaveToast, setShowSaveToast] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    
    // User fields state
    const [formData, setFormData] = useState({
        fullName: "Nguyễn Văn A",
        phone: "0987 654 321",
        email: "nguyenvana@example.com",
        address: "123 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
        gender: "male",
        birthdate: "1998-05-15",
        level: "Khá", // Newcomer, Intermediate, Advanced, Pro
        hand: "Phải", // Left, Right
    });

    // Password state
    const [pwdData, setPwdData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

    // Social accounts linked mock state
    const [socials, setSocials] = useState({
        google: true,
        facebook: false
    });

    // 2FA mock state
    const [twoFA, setTwoFA] = useState(false);

    const handleSaveInfo = (e) => {
        e.preventDefault();
        setShowSaveToast(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setShowSaveToast(false), 3500);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (!pwdData.oldPassword || !pwdData.newPassword || !pwdData.confirmPassword) {
            setPwdMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin mật khẩu!" });
            return;
        }
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setPwdMessage({ type: "error", text: "Xác nhận mật khẩu mới không khớp!" });
            return;
        }
        setPwdMessage({ type: "success", text: "Thay đổi mật khẩu thành công!" });
        setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPwdMessage({ type: "", text: "" }), 3000);
    };

    const handleCopyCode = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const tabs = [
        { id: "info", name: "Thông tin cá nhân", icon: "👤" },
        { id: "orders", name: "Lịch sử mua hàng", icon: "📦", badge: "2" },
        { id: "wishlist", name: "Danh sách yêu thích", icon: "❤️", badge: "3" },
        { id: "vouchers", name: "Kho ưu đãi & Voucher", icon: "🎟️" },
        { id: "security", name: "Bảo mật tài khoản", icon: "🔒" },
    ];

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-8 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <div className="mx-auto max-w-6xl px-6">
                
                {/* Banner & Cover */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-lime-500 h-36 md:h-48 shadow-xl shadow-emerald-500/5 mb-6">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -right-10 top-5 h-48 w-48 rounded-full bg-white blur-2xl animate-pulse" />
                        <div className="absolute left-10 bottom-5 h-36 w-36 rounded-full bg-white blur-xl" />
                    </div>
                </div>

                {/* Profile Header Details */}
                <div className="tt-card relative -mt-20 md:-mt-24 px-6 py-6 md:px-8 bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                        <div className="relative group cursor-pointer">
                            <img 
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" 
                                alt="Avatar" 
                                className="h-28 w-28 md:h-36 md:w-36 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-2xl dark:border-slate-800 transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800 shadow" />
                            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white text-xs font-semibold">
                                Đổi ảnh
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2.5 justify-center md:justify-start">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{formData.fullName}</h1>
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    🏆 Thành viên Vàng
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{formData.email}</p>
                            <p className="text-xs text-slate-400">Tham gia: 15/05/2024</p>
                        </div>
                    </div>

                    {/* Loyalty Points Block */}
                    <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4 min-w-[240px] shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🏸</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Điểm tích lũy</span>
                        </div>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">1,250 <span className="text-sm font-medium text-slate-400">điểm</span></span>
                        
                        <div className="w-full mt-1.5">
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                                <span>VÀNG (GOLD)</span>
                                <span>KIM CƯƠNG (DIAMOND)</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full" style={{ width: "83%" }}></div>
                            </div>
                            <p className="text-[10px] text-right mt-1 text-slate-400">Còn 250 điểm để lên hạng</p>
                        </div>
                    </div>
                </div>

                {/* Save Success Alert Banner */}
                {showSaveToast && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/5 animate-fadeIn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 shrink-0">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.748-5.25z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-bold text-sm">Cập nhật thành công!</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Thông tin cá nhân của bạn đã được cập nhật trên hệ thống TripleT.</p>
                        </div>
                    </div>
                )}

                {/* Main 2-Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="tt-card bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 p-4 rounded-3xl shadow-md">
                            <h2 className="px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                                Danh mục quản lý
                            </h2>
                            <nav className="space-y-1.5">
                                {tabs.map((tab) => {
                                    const isSelected = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                                                isSelected 
                                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25" 
                                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-emerald-500 dark:hover:text-emerald-400"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-base">{tab.icon}</span>
                                                <span>{tab.name}</span>
                                            </div>
                                            {tab.badge && (
                                                <span className={`inline-flex items-center justify-center h-5 px-2 text-[10px] font-bold rounded-full ${
                                                    isSelected ? "bg-white text-emerald-600" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200/30"
                                                }`}>
                                                    {tab.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Badminton Tip Box */}
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                            <div className="absolute right-0 bottom-0 text-7xl opacity-10 font-bold select-none">🏸</div>
                            <h3 className="font-extrabold text-sm mb-1 text-emerald-100 uppercase tracking-wide">Mẹo sân chơi hôm nay</h3>
                            <p className="text-xs text-slate-100 leading-relaxed">
                                "Để tăng lực đập smash, hãy thư giãn cổ tay của bạn trước khi tiếp xúc cầu và chỉ siết chặt tay vào cán vợt ngay đúng khoảnh khắc chạm cầu!"
                            </p>
                        </div>
                    </div>

                    {/* Right Column Content Card */}
                    <div className="lg:col-span-8">
                        <div className="tt-card bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-md min-h-[500px]">
                            
                            {/* Tab 1: Personal Info */}
                            {activeTab === "info" && (
                                <div>
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h3>
                                        <p className="text-xs text-slate-400 mt-1">Cập nhật chi tiết thông tin của bạn để nhận dịch vụ tối ưu và theo dõi thành tích.</p>
                                    </div>
                                    
                                    <form onSubmit={handleSaveInfo} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Họ và tên</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                                    className="tt-input" 
                                                    placeholder="Nguyễn Văn A" 
                                                    required 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Số điện thoại</label>
                                                <input 
                                                    type="tel" 
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    className="tt-input" 
                                                    placeholder="0987 654 321" 
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Địa chỉ Email</label>
                                                <input 
                                                    type="email" 
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    className="tt-input bg-slate-50 dark:bg-slate-900 cursor-not-allowed border-slate-200/60" 
                                                    placeholder="nguyenvana@example.com" 
                                                    disabled 
                                                    title="Email đăng nhập không thể thay đổi"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Ngày sinh</label>
                                                <input 
                                                    type="date" 
                                                    value={formData.birthdate}
                                                    onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                                                    className="tt-input" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Địa chỉ nhận hàng mặc định</label>
                                            <input 
                                                type="text" 
                                                value={formData.address}
                                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                className="tt-input" 
                                                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Giới tính</label>
                                                <select 
                                                    value={formData.gender}
                                                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                                    className="tt-input"
                                                >
                                                    <option value="male">Nam</option>
                                                    <option value="female">Nữ</option>
                                                    <option value="other">Khác</option>
                                                </select>
                                            </div>

                                            {/* Badminton customizations */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Trình độ chơi cầu</label>
                                                <select 
                                                    value={formData.level}
                                                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                                                    className="tt-input"
                                                >
                                                    <option value="Mới chơi">Nhập môn / Giải trí</option>
                                                    <option value="Trung bình">Trung bình</option>
                                                    <option value="Khá">Khá (Có phong trào)</option>
                                                    <option value="Chuyên nghiệp">Chuyên nghiệp / VĐV</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tay thuận</label>
                                                <select 
                                                    value={formData.hand}
                                                    onChange={(e) => setFormData({...formData, hand: e.target.value})}
                                                    className="tt-input"
                                                >
                                                    <option value="Phải">Tay phải</option>
                                                    <option value="Trái">Tay trái</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({
                                                    fullName: "Nguyễn Văn A",
                                                    phone: "0987 654 321",
                                                    email: "nguyenvana@example.com",
                                                    address: "123 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
                                                    gender: "male",
                                                    birthdate: "1998-05-15",
                                                    level: "Khá",
                                                    hand: "Phải",
                                                })}
                                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                Hủy
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="tt-btn-primary px-6 py-2.5 text-sm"
                                            >
                                                Lưu thay đổi
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Tab 2: Order History */}
                            {activeTab === "orders" && (
                                <div className="space-y-6">
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lịch sử mua hàng</h3>
                                        <p className="text-xs text-slate-400 mt-1">Quản lý và kiểm tra tình trạng các đơn đặt hàng của bạn.</p>
                                    </div>

                                    <div className="space-y-4">
                                        {mockOrders.map((order) => (
                                            <div 
                                                key={order.id} 
                                                className="border border-slate-200/70 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                {/* Order card header */}
                                                <div className="bg-slate-50 dark:bg-slate-900/60 px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-3">
                                                    <div className="space-y-1">
                                                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">ĐƠN HÀNG #{order.id}</span>
                                                        <span className="block text-xs text-slate-400">Đặt lúc: {order.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                            order.status === "shipping" 
                                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse" 
                                                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                                        }`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${order.status === "shipping" ? "bg-amber-500" : "bg-emerald-500"}`} />
                                                            {order.statusName}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Order card items */}
                                                <div className="divide-y divide-slate-100 dark:divide-slate-800 px-5">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="py-4 flex gap-4">
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.name} 
                                                                className="h-16 w-16 rounded-xl object-cover border border-slate-200/50 dark:border-slate-700/50 shrink-0" 
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate hover:text-emerald-500 transition-colors">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="text-xs text-slate-400 mt-0.5">Số lượng: {item.qty}</p>
                                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{formatPrice(item.price)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Order card footer */}
                                                <div className="bg-slate-50/50 dark:bg-slate-900/20 px-5 py-4 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div className="text-xs text-slate-400">
                                                        <span>Hình thức: </span>
                                                        <span className="font-semibold text-slate-500 dark:text-slate-300">{order.paymentMethod}</span>
                                                    </div>
                                                    <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-4">
                                                        <div>
                                                            <span className="text-xs text-slate-400 mr-2">Tổng tiền:</span>
                                                            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatPrice(order.total)}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {order.status === "delivered" ? (
                                                                <>
                                                                    <button className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                                        Đánh giá
                                                                    </button>
                                                                    <button className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
                                                                        Mua lại
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                                    Theo dõi đơn hàng
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab 3: Wishlist */}
                            {activeTab === "wishlist" && (
                                <div className="space-y-6">
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sản phẩm yêu thích</h3>
                                        <p className="text-xs text-slate-400 mt-1">Danh sách sản phẩm cầu lông bạn đã lưu lại để tham khảo sau.</p>
                                    </div>

                                    {wishlistItems.length === 0 ? (
                                        <div className="text-center py-12 space-y-3">
                                            <span className="text-4xl">💔</span>
                                            <p className="font-semibold text-slate-400">Danh sách yêu thích của bạn trống!</p>
                                            <Link to="/product" className="tt-btn-primary px-5 py-2 text-xs">Đi mua sắm ngay</Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {wishlistItems.map((item) => (
                                                <div 
                                                    key={item.id} 
                                                    className="group relative flex gap-4 p-4 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-slate-50/30 dark:bg-slate-900/10 hover:border-emerald-500/20"
                                                >
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        className="h-20 w-20 rounded-xl object-cover border border-slate-200/30 dark:border-slate-800/50 shrink-0 group-hover:scale-[1.02] transition-transform duration-300"
                                                    />
                                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                                        <div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{item.category}</span>
                                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-emerald-500 transition-colors">
                                                                {item.name}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{formatPrice(item.price)}</span>
                                                                {item.oldPrice && (
                                                                    <span className="text-xs text-slate-400 line-through">{formatPrice(item.oldPrice)}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                            <button 
                                                                type="button" 
                                                                title="Bỏ thích"
                                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5 text-red-500">
                                                                    <path d="M11.645 20.91l-.007-.003-.003-.001a3.752 3.752 0 01-2.148-2.167 6 6 0 01-1.014-4.072 4.022 4.022 0 01-1.022-.074l-.015-.004-.03-.008a3.9 3.9 0 01-2.135-1.077L3.72 12.04a3.9 3.9 0 010-5.517l.006-.006a3.9 3.9 0 015.51 0l.54.54.54-.54a3.9 3.9 0 015.511 0l.006.006a3.9 3.9 0 010 5.517l-1.554 1.555a3.9 3.9 0 01-2.135 1.077l-.03.008-.015.004a4.022 4.022 0 01-1.022.074 6 6 0 01-1.014 4.072 3.752 3.752 0 01-2.148 2.167z" />
                                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                                </svg>
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                className="flex-1 text-center py-1 px-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                                            >
                                                                Thêm vào giỏ
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab 4: Vouchers */}
                            {activeTab === "vouchers" && (
                                <div className="space-y-6">
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Kho Voucher & Ưu đãi</h3>
                                        <p className="text-xs text-slate-400 mt-1">Các mã giảm giá được áp dụng trực tiếp tại bước thanh toán của bạn.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {mockVouchers.map((v, index) => (
                                            <div 
                                                key={v.code} 
                                                className="relative overflow-hidden bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex gap-4 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-300"
                                            >
                                                {/* Dash border separating standard coupon visual */}
                                                <div className="absolute left-[80px] top-0 bottom-0 border-r border-dashed border-slate-200 dark:border-slate-800/80" />
                                                
                                                {/* Left card graphic */}
                                                <div className="w-[60px] shrink-0 flex flex-col justify-center items-center gap-1.5 select-none text-emerald-600 dark:text-emerald-400">
                                                    <span className="text-3xl">🎟️</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">T-CODE</span>
                                                </div>

                                                {/* Right card details */}
                                                <div className="flex-1 pl-4 flex flex-col justify-between min-w-0">
                                                    <div>
                                                        <span className="inline-block bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-2">
                                                            {v.code}
                                                        </span>
                                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-normal line-clamp-2">
                                                            {v.desc}
                                                        </h4>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/30 dark:border-slate-800/40">
                                                        <span className="text-[10px] text-slate-400 font-bold">{v.expiry}</span>
                                                        <button 
                                                            onClick={() => handleCopyCode(v.code, index)}
                                                            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all duration-300 ${
                                                                copiedIndex === index 
                                                                    ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400" 
                                                                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/10"
                                                            }`}
                                                        >
                                                            {copiedIndex === index ? "Đã chép" : "Sao chép"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab 5: Security */}
                            {activeTab === "security" && (
                                <div className="space-y-6">
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bảo mật tài khoản</h3>
                                        <p className="text-xs text-slate-400 mt-1">Đổi mật khẩu bảo vệ và liên kết các mạng xã hội để tăng bảo mật.</p>
                                    </div>

                                    {/* Change password section */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Cập nhật mật khẩu</h4>
                                        
                                        {pwdMessage.text && (
                                            <div className={`p-4 rounded-xl text-xs font-semibold ${
                                                pwdMessage.type === "success" 
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                                                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                            }`}>
                                                {pwdMessage.text}
                                            </div>
                                        )}

                                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mật khẩu hiện tại</label>
                                                <input 
                                                    type="password" 
                                                    value={pwdData.oldPassword}
                                                    onChange={(e) => setPwdData({...pwdData, oldPassword: e.target.value})}
                                                    className="tt-input" 
                                                    placeholder="••••••••" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mật khẩu mới</label>
                                                <input 
                                                    type="password" 
                                                    value={pwdData.newPassword}
                                                    onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})}
                                                    className="tt-input" 
                                                    placeholder="••••••••" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Xác nhận mật khẩu mới</label>
                                                <input 
                                                    type="password" 
                                                    value={pwdData.confirmPassword}
                                                    onChange={(e) => setPwdData({...pwdData, confirmPassword: e.target.value})}
                                                    className="tt-input" 
                                                    placeholder="••••••••" 
                                                />
                                            </div>
                                            <button type="submit" className="tt-btn-dark px-5 py-2.5 text-xs font-semibold">
                                                Cập nhật mật khẩu
                                            </button>
                                        </form>
                                    </div>

                                    <hr className="border-slate-100 dark:border-slate-800 my-6" />

                                    {/* Link accounts section */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Tài khoản liên kết</h4>
                                        <div className="space-y-3 max-w-md">
                                            <div className="flex items-center justify-between p-3 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs font-bold">Google</p>
                                                        <p className="text-[10px] text-slate-400">Đã kết nối</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setSocials({...socials, google: !socials.google})}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                                                        socials.google 
                                                            ? "border-red-200/50 hover:bg-red-500/5 text-red-500 dark:border-red-900/30" 
                                                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                                    }`}
                                                >
                                                    {socials.google ? "Hủy kết nối" : "Kết nối"}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-3 border border-slate-200/50 dark:border-slate-800/80 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" fill="#1877F2"/>
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs font-bold">Facebook</p>
                                                        <p className="text-[10px] text-slate-400">{socials.facebook ? "Đã kết nối" : "Chưa kết nối"}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setSocials({...socials, facebook: !socials.facebook})}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                                                        socials.facebook 
                                                            ? "border-red-200/50 hover:bg-red-500/5 text-red-500 dark:border-red-900/30" 
                                                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                                    }`}
                                                >
                                                    {socials.facebook ? "Hủy kết nối" : "Kết nối"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100 dark:border-slate-800 my-6" />

                                    {/* 2FA Option */}
                                    <div className="flex items-center justify-between max-w-md p-3 border border-slate-200/50 dark:border-slate-800/80 rounded-xl bg-slate-50/20 dark:bg-slate-900/20">
                                        <div className="space-y-0.5">
                                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Xác thực 2 yếu tố (2FA)</h4>
                                            <p className="text-[10px] text-slate-400">Yêu cầu mã xác thực gửi về điện thoại mỗi khi đăng nhập.</p>
                                        </div>
                                        <button 
                                            onClick={() => setTwoFA(!twoFA)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                twoFA ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
                                            }`}
                                        >
                                            <span 
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    twoFA ? "translate-x-5" : "translate-x-0"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

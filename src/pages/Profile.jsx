import { useState, useEffect, useRef } from "react"; // Đã thêm useRef vào đây
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../data/products";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("info");
    const [showSaveToast, setShowSaveToast] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // CHỈ KHAI BÁO MỘT STATE USERDATA DUY NHẤT (Có sẵn trường mặc định nếu API chưa kịp phản hồi)
    const [userData, setUserData] = useState({
        fullName: "",
        phone: "",
        address: "",
        email: ""
    });
    const [userLoaded, setUserLoaded] = useState(false);

    // Quản lý riêng biệt link ảnh để hiển thị (preview) và file ảnh thực tế để gửi đi
    const [avatarPreview, setAvatarPreview] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80");
    const [avatarFile, setAvatarFile] = useState(null);

    // Các state quản lý API địa chính Việt Nam
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const fileInputRef = useRef(null);

    // Lấy dữ liệu user từ API khi mount component
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.userId) {
            setUserLoaded(true);
            return;
        }
        axios.get(`https://localhost:7147/api/User/${user.userId}`)
            .then((res) => {
                const data = res.data;
                if (data.userId === Number(user.userId)) {
                    // Map API response map vào state phẳng (tuỳ thuộc cấu trúc DB thực tế của bạn)
                    setUserData({
                        fullName: data.profile?.fullName || data.fullName || "",
                        phone: data.profile?.phone || data.phone || "",
                        address: data.profile?.address || data.address || "",
                        email: data.email || ""
                    });
                    if (data.profile?.avatar || data.avatar) {
                        setAvatarPreview(data.profile?.avatar || data.avatar);
                    }
                }
                setUserLoaded(true);
            })
            .catch((err) => {
                console.error("Lỗi khi tải thông tin user:", err);
                setUserLoaded(true);
            });
    }, []);

    // Tải danh sách Tỉnh/Thành phố khi component mount
    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/p/")
            .then(res => setProvinces(res.data))
            .catch(err => console.error("Lỗi tải tỉnh thành:", err));
    }, []);

    // Theo dõi thay đổi Tỉnh -> Tải Huyện
    useEffect(() => {
        if (!selectedProvince) return setDistricts([]);
        axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
            .then(res => {
                setDistricts(res.data.districts);
                setWards([]);
                setSelectedDistrict("");
                setSelectedWard("");
            });
    }, [selectedProvince]);

    // Theo dõi thay đổi Huyện -> Tải Xã
    useEffect(() => {
        if (!selectedDistrict) return setWards([]);
        axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
            .then(res => {
                setWards(res.data.wards);
                setSelectedWard("");
            });
    }, [selectedDistrict]);

    // Xử lý thay đổi dữ liệu text trong các ô nhập thông tin cá nhân
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý khi chọn file ảnh mới (Lưu file gốc và tạo link preview)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // HÀM SUBMIT GỘP DUY NHẤT (Vừa đẩy API backend vừa chạy hiệu ứng mượt)
    const handleSaveInfo = async (e) => {
        e.preventDefault();

        // Xử lý nối chuỗi địa chỉ từ các dropdown tỉnh thành
        const pText = provinces.find(p => p.code == selectedProvince)?.name || "";
        const dText = districts.find(d => d.code == selectedDistrict)?.name || "";
        const wText = wards.find(w => w.code == selectedWard)?.name || "";

        const computedAddress = `${detailAddress ? detailAddress + ", " : ""}${wText ? wText + ", " : ""}${dText ? dText + ", " : ""}${pText}`.trim().replace(/^,\s*|,\s*$/, '');
        const finalAddress = computedAddress || userData.address;

        try {
            // Khởi tạo FormData gửi dữ liệu hỗn hợp Text + Binary File
            const formData = new FormData();
            formData.append("fullName", userData.fullName);
            formData.append("phone", userData.phone);
            formData.append("address", finalAddress);

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            // Gọi API thực tế (Thay endpoint cứng bằng ID động từ LocalStorage nếu cần thiết)
            const userToken = JSON.parse(localStorage.getItem("user"));
            const targetId = userToken?.userId;

            const response = await axios.put(`https://localhost:7147/api/UserProfile/${targetId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200 || response.status === 204) {
                // Đồng bộ lại state hiển thị tại client
                setUserData(prev => ({ ...prev, address: finalAddress }));

                // Kích hoạt Banner Toast thông báo mượt mà của bạn
                setShowSaveToast(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => setShowSaveToast(false), 3500);
            }
            console.log("API PUT thành công:", response.data);
        } catch (error) {
            console.error("Lỗi API PUT:", error);
            alert("Cập nhật thất bại, vui lòng kiểm tra lại kết nối API!");
        }
    };



    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4; // Giới hạn hiển thị 4 đơn hàng trên mỗi trang

    useEffect(() => {
        if (activeTab !== "orders") return;

        fetch('https://localhost:7147/api/Orders/user/6')
            .then((res) => {
                if (!res.ok) throw new Error('Không thể tải dữ liệu lịch sử đơn hàng.');
                return res.json();
            })
            .then((data) => {
                // SẮP XẾP: Đảm bảo đơn hàng mới nhất (ID lớn nhất / Ngày mới nhất) luôn lên đầu
                const sortedOrders = data.sort((a, b) => b.orderId - a.orderId);
                setOrders(sortedOrders);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [activeTab]);


    useEffect(() => {
        if (activeTab === "orders") {
            setCurrentPage(1);
        }
    }, [activeTab]);

    // LỒGIC PHÂN TRANG:
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    // Cắt mảng dữ liệu để chỉ lấy đúng 4 phần tử thuộc trang hiện tại
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    // Tính tổng số trang cần có
    const totalPages = Math.ceil(orders.length / ordersPerPage);
    // Hàm trả về Class CSS và Tên hiển thị tương ứng với trạng thái đơn hàng
    const getStatusDetails = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { name: 'Chờ xử lý', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse', dotClass: 'bg-amber-500' };
            case 'shipping':
                return { name: 'Đang giao hàng', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse', dotClass: 'bg-blue-500' };
            case 'delivered':
                return { name: 'Đã giao hàng', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20', dotClass: 'bg-emerald-500' };
            default:
                return { name: status || 'Hủy đơn', className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20', dotClass: 'bg-rose-500' };
        }
    };

    const navigate = useNavigate(); // Khởi tạo điều hướng

    const [pwdData, setPwdData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwdMessage({ type: "", text: "" });

        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setPwdMessage({ type: "error", text: "Mật khẩu xác nhận mới không trùng khớp!" });
            return;
        }

        try {
            const userId = localStorage.getItem("userId") || 6;
            const response = await fetch(`https://localhost:7147/api/User/${userId}/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldPassword: pwdData.oldPassword,
                    newPassword: pwdData.newPassword
                }),
            });

            const resultText = await response.text();

            if (!response.ok) {
                throw new Error(resultText || "Đã xảy ra lỗi không xác định.");
            }

            // --- XỬ LÝ LOGOUT VÀ CHUYỂN TRANG KHI ĐỔI MẬT KHẨU THÀNH CÔNG ---

            // 1. Hiển thị thông báo thành công cho user thấy trong 1.5 giây trước khi đá ra ngoài
            setPwdMessage({
                type: "success",
                text: "Đổi mật khẩu thành công! Hệ thống đang đăng xuất và quay về trang đăng nhập..."
            });

            // Xóa trắng form nhập liệu
            setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "" });

            setTimeout(() => {
                // 2. Xóa sạch dữ liệu đăng nhập cũ lưu trong localStorage / sessionStorage
                localStorage.removeItem("userId");
                localStorage.removeItem("token"); // Nếu bạn có xài JWT Token
                localStorage.clear(); // Hoặc xóa hết cho chắc chắn

                // 3. Đẩy user về trang login (thay "/login" bằng đường dẫn route login thực tế của bạn)
                navigate("/login");
            }, 1500); // Chờ 1.5 giây để user kịp đọc thông báo thông thái

        } catch (error) {
            setPwdMessage({ type: "error", text: error.message });
        }
    };
    // Quản lý trạng thái ẩn/hiện của 3 ô: old (hiện tại), new (mới), confirm (xác nhận)
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    // Hàm helper để đảo ngược trạng thái ẩn/hiện của một ô cụ thể
    const toggleShowPassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };
    const tabs = [
        { id: "info", name: "Thông tin cá nhân", icon: "👤" },
        { id: "orders", name: "Lịch sử mua hàng", icon: "📦", badge: orders.length },
        { id: "security", name: "Bảo mật tài khoản", icon: "🔒" },
    ];

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-8 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <div className="mx-auto max-w-6xl px-6">

                {/* Banner Cover */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-lime-500 h-36 md:h-48 shadow-xl shadow-emerald-500/5 mb-6">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -right-10 top-5 h-48 w-48 rounded-full bg-white blur-2xl animate-pulse" />
                        <div className="absolute left-10 bottom-5 h-36 w-36 rounded-full bg-white blur-xl" />
                    </div>
                </div>

                {/* Profile Header Details */}
                <div className="tt-card relative -mt-20 md:-mt-24 px-6 py-6 md:px-8 bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="h-28 w-28 md:h-36 md:w-36 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-2xl dark:border-slate-800 transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <span className="absolute bottom-1 right-1 flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800 shadow" />
                            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white text-xs font-semibold">
                                Đổi ảnh
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2.5 justify-center md:justify-start">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{userData?.fullName || "Chưa cập nhật"}</h1>
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    🏆 Thành viên Vàng
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{userData?.email || "Chưa có email"}</p>
                            <p className="text-xs text-slate-400">Tham gia: 15/05/2024</p>
                        </div>
                    </div>

                    {/* Điểm tích lũy */}
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

                {/* Toast Thông báo lưu thành công */}
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

                {/* Grid Layout chính */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cột trái Sidebar */}
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
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${isSelected
                                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-emerald-500 dark:hover:text-emerald-400"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-base">{tab.icon}</span>
                                                <span>{tab.name}</span>
                                            </div>
                                            {tab.badge && (
                                                <span className={`inline-flex items-center justify-center h-5 px-2 text-[10px] font-bold rounded-full ${isSelected ? "bg-white text-emerald-600" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200/30"}`}>
                                                    {tab.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                            <div className="absolute right-0 bottom-0 text-7xl opacity-10 font-bold select-none">🏸</div>
                            <h3 className="font-extrabold text-sm mb-1 text-emerald-100 uppercase tracking-wide">Mẹo sân chơi hôm nay</h3>
                            <p className="text-xs text-slate-100 leading-relaxed">
                                "Để tăng lực đập smash, hãy thư giãn cổ tay của bạn trước khi tiếp xúc cầu và chỉ siết chặt tay vào cán vợt ngay đúng khoảnh khắc chạm cầu!"
                            </p>
                        </div>
                    </div>

                    {/* Cột phải Content */}
                    <div className="lg:col-span-8">
                        <div className="tt-card bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-md min-h-[500px]">

                            {/* TAB 1: THÔNG TIN CÁ NHÂN */}
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
                                                    name="fullName"
                                                    value={userData.fullName}
                                                    onChange={handleInputChange}
                                                    className="tt-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Nguyễn Văn A"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Số điện thoại</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={userData.phone}
                                                    onChange={handleInputChange}
                                                    className="tt-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                                                    value={userData.email}
                                                    readOnly
                                                    className="tt-input bg-slate-50 dark:bg-slate-900 cursor-not-allowed border-slate-200/60 text-slate-400 w-full px-4 py-2.5 rounded-xl"
                                                    disabled
                                                    title="Email đăng nhập không thể thay đổi"
                                                />
                                            </div>
                                        </div>

                                        {/* Dropdown 3 cấp Open API tỉnh thành */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Địa chỉ nhận hàng mới (Để trống nếu giữ nguyên: {userData.address || "Chưa có"})</label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <select
                                                    value={selectedProvince}
                                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">-- Chọn Tỉnh / Thành phố --</option>
                                                    {provinces.map((p) => (
                                                        <option key={p.code} value={p.code}>{p.name}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={selectedDistrict}
                                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                                    disabled={!selectedProvince}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="">-- Chọn Quận / Huyện --</option>
                                                    {districts.map((d) => (
                                                        <option key={d.code} value={d.code}>{d.name}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={selectedWard}
                                                    onChange={(e) => setSelectedWard(e.target.value)}
                                                    disabled={!selectedDistrict}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="">-- Chọn Phường / Xã --</option>
                                                    {wards.map((w) => (
                                                        <option key={w.code} value={w.code}>{w.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Số nhà, tên đường, ngách..."
                                                value={detailAddress}
                                                onChange={(e) => setDetailAddress(e.target.value)}
                                                disabled={!selectedWard}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => window.location.reload()}
                                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="tt-btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all duration-200"
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
                                    {/* Header */}
                                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-end">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lịch sử mua hàng</h3>
                                            <p className="text-xs text-slate-400 mt-1">Quản lý và kiểm tra tình trạng các đơn đặt hàng của bạn.</p>
                                        </div>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                                            Tổng số: {orders.length} đơn
                                        </span>
                                    </div>

                                    {/* List Đơn Hàng */}
                                    <div className="space-y-4">
                                        {currentOrders.length === 0 ? (
                                            <div className="text-center py-10 text-slate-400 border border-dashed rounded-2xl">Bạn chưa có đơn hàng nào.</div>
                                        ) : (
                                            currentOrders.map((order) => {
                                                const statusInfo = getStatusDetails(order.orderStatus);
                                                return (
                                                    <div
                                                        key={order.orderId}
                                                        className="border border-slate-200/70 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                                    >
                                                        {/* Order Header */}
                                                        <div className="bg-slate-50 dark:bg-slate-900/60 px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-3">
                                                            <div className="space-y-1">
                                                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">ĐƠN HÀNG #{order.orderId}</span>
                                                                <span className="block text-xs text-slate-400">
                                                                    Đặt lúc: {new Date(order.orderDate).toLocaleDateString('vi-VN')} {new Date(order.orderDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                                                                    <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
                                                                    {statusInfo.name}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Order Items */}
                                                        <div className="divide-y divide-slate-100 dark:divide-slate-800 px-5">
                                                            {order.items && order.items.map((item, idx) => (
                                                                <div key={idx} className="py-4 flex gap-4">
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.productName}
                                                                        className="h-16 w-16 rounded-xl object-cover border border-slate-200/50 dark:border-slate-700/50 shrink-0"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate hover:text-emerald-500 transition-colors">
                                                                            {item.productName}
                                                                        </h4>
                                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                                            Phân loại: {item.color || 'Mặc định'} | {item.size || 'Mặc định'} | {item.version || 'Mặc định'}
                                                                        </p>
                                                                        <p className="text-xs text-slate-400">Số lượng: {item.quantity}</p>
                                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{formatPrice(item.unitPrice)}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Order Footer */}
                                                        <div className="bg-slate-50/50 dark:bg-slate-900/20 px-5 py-4 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                            <div className="text-xs text-slate-400">
                                                                <span>Hình thức: </span>
                                                                <span className="font-semibold text-slate-500 dark:text-slate-300">{order.paymentMethod}</span>
                                                            </div>
                                                            <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-4">
                                                                <div>
                                                                    <span className="text-xs text-slate-400 mr-2">Tổng tiền:</span>
                                                                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatPrice(order.totalAmount)}</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                                        Theo dõi đơn đặt
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* THANH ĐIỀU HƯỚNG CHUYỂN TRANG (PAGINATION PANEL) */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${currentPage === 1
                                                    ? "text-slate-300 bg-slate-50 cursor-not-allowed border-slate-200"
                                                    : "text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-95"
                                                    }`}
                                            >
                                                ⬅ Trực diện trước
                                            </button>

                                            <span className="text-xs font-semibold text-slate-500">
                                                Trang <strong className="text-slate-800 dark:text-white">{currentPage}</strong> trên tổng {totalPages}
                                            </span>

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${currentPage === totalPages
                                                    ? "text-slate-300 bg-slate-50 cursor-not-allowed border-slate-200"
                                                    : "text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-95"
                                                    }`}
                                            >
                                                Tiếp sau ➡
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
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
                <div className={`p-4 rounded-xl text-xs font-semibold border ${
                    pwdMessage.type === "success"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                }`}>
                    {pwdMessage.text}
                </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                
                {/* 1. MẬT KHẨU HIỆN TẠI */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mật khẩu hiện tại</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPassword.old ? "text" : "password"}
                            required
                            value={pwdData.oldPassword}
                            onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                            className="tt-input w-full pr-10" // pr-10 để chừa khoảng trống bên phải không bị đè chữ lên icon
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('old')}
                            className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm focus:outline-none select-none"
                        >
                            {showPassword.old ? "👁️" : "🙈"}
                        </button>
                    </div>
                </div>
                
                {/* 2. MẬT KHẨU MỚI */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mật khẩu mới</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPassword.new ? "text" : "password"}
                            required
                            value={pwdData.newPassword}
                            onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                            className="tt-input w-full pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('new')}
                            className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm focus:outline-none select-none"
                        >
                            {showPassword.new ? "👁️" : "🙈"}
                        </button>
                    </div>
                </div>
                
                {/* 3. XÁC NHẬN MẬT KHẨU MỚI */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Xác nhận mật khẩu mới</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            required
                            value={pwdData.confirmPassword}
                            onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                            className="tt-input w-full pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('confirm')}
                            className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm focus:outline-none select-none"
                        >
                            {showPassword.confirm ? "👁️" : "🙈"}
                        </button>
                    </div>
                </div>
                
                <button type="submit" className="tt-btn-dark px-5 py-2.5 text-xs font-semibold active:scale-95 transition-transform">
                    Cập nhật mật khẩu
                </button>
            </form>
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

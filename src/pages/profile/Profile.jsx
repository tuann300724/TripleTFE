import { useState, useEffect, useRef } from "react";
import api from "../../service/api";
import axios from "axios";
import { API_BASE } from "../../config";
import ProfileInfo from "./ProfileInfo";
import Breadcrumb from "../../components/Breadcrumb";
import ProfileOrders from "./ProfileOrders";
import ProfileSecurity from "./ProfileSecurity";
import ProfileCourts from "./ProfileCourts";
import { User, Target, Trophy } from "lucide-react";
import { FadeIn } from "../../components/Animate";
import { useToast } from "../../components/Toast";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("info");
    const [showSaveToast, setShowSaveToast] = useState(false);
    const toast = useToast();

    const [profileLoading, setProfileLoading] = useState(true);

    // ProfileInfo & Header states
    const [userData, setUserData] = useState({
        fullName: "",
        phone: "",
        address: "",
        email: ""
    });
    const [avatarPreview, setAvatarPreview] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80");
    const [avatarFile, setAvatarFile] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const fileInputRef = useRef(null);

    // Orders state
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.userId) {
            return;
        }
        api.get(`/User/${user.userId}`)
            .then((res) => {
                const data = res.data;
                if (data.userId === Number(user.userId)) {
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
                setProfileLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi tải thông tin user:", err);
                setProfileLoading(false);
            });
    }, []);

    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/p/")
            .then(res => setProvinces(res.data))
            .catch(err => console.error("Lỗi tải tỉnh thành:", err));
    }, []);

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

    useEffect(() => {
        if (!selectedDistrict) return setWards([]);
        axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
            .then(res => {
                setWards(res.data.wards);
                setSelectedWard("");
            });
    }, [selectedDistrict]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveInfo = async (e) => {
        e.preventDefault();

        const pText = provinces.find(p => p.code == selectedProvince)?.name || "";
        const dText = districts.find(d => d.code == selectedDistrict)?.name || "";
        const wText = wards.find(w => w.code == selectedWard)?.name || "";

        const computedAddress = `${detailAddress ? detailAddress + ", " : ""}${wText ? wText + ", " : ""}${dText ? dText + ", " : ""}${pText}`.trim().replace(/^,\s*|,\s*$/, '');
        const finalAddress = computedAddress || userData.address;

        try {
            const formData = new FormData();
            formData.append("fullName", userData.fullName);
            formData.append("phone", userData.phone);
            formData.append("address", finalAddress);

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const userToken = JSON.parse(localStorage.getItem("user"));
            const targetId = userToken?.userId;

            const response = await api.put(`/UserProfile/${targetId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200 || response.status === 204) {
                setUserData(prev => ({ ...prev, address: finalAddress }));
                setShowSaveToast(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => setShowSaveToast(false), 3500);
            }
            console.log("API PUT thành công:", response.data);
        } catch (error) {
            console.error("Lỗi API PUT:", error);
            toast("Cập nhật thất bại, vui lòng kiểm tra lại kết nối API!", "error");
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.userId || activeTab !== "orders") return;

        fetch(API_BASE + `/Orders/user/${user.userId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Không thể tải dữ liệu lịch sử đơn hàng.');
                return res.json();
            })
            .then((data) => {
                const sortedOrders = data.sort((a, b) => b.orderId - a.orderId);
                setOrders(sortedOrders);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [activeTab]);

    const tabs = [
        { id: "info", name: "Thông tin cá nhân", icon: <User size={16} /> },
        { id: "orders", name: "Lịch sử mua hàng", icon: "📦", badge: orders.length },
        { id: "courts", name: "Quản lý sân", icon: <Target size={16} /> },
        { id: "security", name: "Bảo mật tài khoản", icon: "🔒" },
    ];

    if (profileLoading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-screen bg-slate-50 dark:bg-[#0c1219]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-[#0c1219] py-8 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <div className="mx-auto max-w-6xl px-6">
                <Breadcrumb items={[{ label: "Tài khoản" }]} />

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
                                    <Trophy size={14} className="inline" /> Thành viên Vàng
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{userData?.email || "Chưa có email"}</p>
                            <p className="text-xs text-slate-400">Tham gia: 15/05/2024</p>
                        </div>
                    </div>

                    {/* Điểm tích lũy */}
                    <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4 min-w-[240px] shadow-sm">
                        <div className="flex items-center gap-2">
                            <Target size={20} />
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
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 active:scale-[0.97] ${isSelected
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
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                            <div className="absolute right-0 bottom-0 opacity-10 select-none"><Target size={72} /></div>
                            <h3 className="font-extrabold text-sm mb-1 text-emerald-100 uppercase tracking-wide">Mẹo sân chơi hôm nay</h3>
                            <p className="text-xs text-slate-100 leading-relaxed">
                                "Để tăng lực đập smash, hãy thư giãn cổ tay của bạn trước khi tiếp xúc cầu và chỉ siết chặt tay vào cán vợt ngay đúng khoảnh khắc chạm cầu!"
                            </p>
                        </div>
                    </div>

                    {/* Cột phải Content */}
                    <div className="lg:col-span-8">
                        <FadeIn>
                            <div className="tt-card bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-md min-h-[500px]">
                            {activeTab === "info" && (
                                <ProfileInfo 
                                    userData={userData}
                                    handleInputChange={handleInputChange}
                                    provinces={provinces}
                                    districts={districts}
                                    wards={wards}
                                    selectedProvince={selectedProvince}
                                    setSelectedProvince={setSelectedProvince}
                                    selectedDistrict={selectedDistrict}
                                    setSelectedDistrict={setSelectedDistrict}
                                    selectedWard={selectedWard}
                                    setSelectedWard={setSelectedWard}
                                    detailAddress={detailAddress}
                                    setDetailAddress={setDetailAddress}
                                    handleSaveInfo={handleSaveInfo}
                                />
                            )}

                            {activeTab === "orders" && (
                                <FadeIn delay={100}>
                                    <ProfileOrders orders={orders} />
                                </FadeIn>
                            )}

                            {activeTab === "courts" && (
                                <ProfileCourts />
                            )}

                            {activeTab === "security" && (
                                <ProfileSecurity />
                            )}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}

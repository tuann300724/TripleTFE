import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    MapPin, Clock, Phone, Star, ArrowLeft, Calendar,
    CheckCircle2, ChevronRight, Layers, Wifi, ShowerHead,
    Coffee, Car, Lightbulb, Users, Trophy, Sparkles, XCircle
} from "lucide-react";

/* ─── Dữ liệu sân ─── */
const branchesData = [
    {
        id: "tran-bien",
        name: "Sân Cầu Lông Premium - Trấn Biên",
        coords: [10.9612, 106.7972],
        address: "Đường Chu Văn An, P. Quang Vinh, TP. Biên Hòa, Đồng Nai",
        phone: "0251.3847.111",
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
        openTime: "05:00 - 22:00",
        priceRange: "100.000đ - 150.000đ/h",
        rating: 4.8,
        freeCourts: 2,
        description: "Tọa lạc tại khu vực Văn Miếu Trấn Biên thoáng đãng, cơ sở vật chất khang trang. Sân trang bị thảm PVC tiêu chuẩn quốc tế BWF, có hệ thống thông gió mát mẻ và khu căng tin hiện đại.",
        amenities: ["Bãi giữ xe", "WiFi miễn phí", "Nhà vệ sinh", "Căng tin", "Phòng thay đồ", "Cho thuê vợt"],
        courts: [
            { id: 1, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000 },
            { id: 2, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000 },
            { id: 3, name: "Sân 3 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000 },
            { id: 4, name: "Sân 4 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000 }
        ]
    },
    {
        id: "chien-khu-d",
        name: "CLB Cầu Lông Thử Thách - Chiến Khu Đ",
        coords: [11.1718, 107.0125],
        address: "Khu bảo tồn di tích lịch sử Chiến khu Đ, Vĩnh Cửu, Đồng Nai",
        phone: "0251.3961.222",
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
        openTime: "06:00 - 21:00",
        priceRange: "80.000đ - 120.000đ/h",
        rating: 4.5,
        freeCourts: 1,
        description: "Địa điểm tập luyện lý tưởng hòa mình cùng thiên nhiên lịch sử chiến khu. Sân thích hợp tổ chức các giải đấu phong trào, trang bị đèn chống lóa mắt giúp bảo vệ tầm nhìn vợt thủ.",
        amenities: ["Bãi giữ xe", "Nhà vệ sinh", "Căng tin", "Hệ thống chiếu sáng cao cấp"],
        courts: [
            { id: 5, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 6, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 7, name: "Sân 3 - Cao cấp", type: "Thảm cao su", price: "120.000đ/h", pricePerSlot: 60000 }
        ]
    },
    {
        id: "tan-hiep",
        name: "Sân Cầu Lông Đẳng Cấp - Tân Hiệp",
        coords: [10.9628, 106.8291],
        address: "114 Nguyễn Ái Quốc, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai",
        phone: "0251.3822.333",
        image: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=1200&q=80",
        openTime: "05:00 - 23:00",
        priceRange: "100.000đ - 150.000đ/h",
        rating: 4.9,
        freeCourts: 2,
        description: "Chi nhánh ngay trung tâm thành phố Biên Hòa, thiết kế trần cao cực thoáng mát, hệ thống thảm chống trượt tuyệt vời. Có cửa hàng thể thao chuyên căng vợt, bán phụ kiện cầu lông tại chỗ.",
        amenities: ["Bãi giữ xe", "WiFi miễn phí", "Nhà vệ sinh", "Căng tin", "Shop thể thao", "Phòng thay đồ", "Cho thuê vợt"],
        courts: [
            { id: 8, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000 },
            { id: 9, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "100.000đ/h", pricePerSlot: 50000 },
            { id: 10, name: "Sân 3 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000 },
            { id: 11, name: "Sân 4 - VIP", type: "Thảm cao su cao cấp", price: "150.000đ/h", pricePerSlot: 75000 }
        ]
    },
    {
        id: "phu-rieng-do",
        name: "Sân Cầu Lông Premium - Phú Riềng Đỏ",
        coords: [11.6667, 106.9022],
        address: "Đường ĐT 741, Xã Phú Riềng, Huyện Phú Riềng, Bình Phước",
        phone: "0271.3999.444",
        image: "https://images.unsplash.com/photo-1613918431208-6752c2ecdfd4?auto=format&fit=crop&w=1200&q=80",
        openTime: "06:00 - 22:00",
        priceRange: "80.000đ - 120.000đ/h",
        rating: 4.6,
        freeCourts: 1,
        description: "Cơ sở thể thao hiện đại nổi bật tại Bình Phước. Thảm trải sàn đệm êm giảm chấn thương đầu gối hiệu quả, thích hợp cho cả người lớn tuổi và trẻ em tham gia câu lạc bộ tập luyện.",
        amenities: ["Bãi giữ xe", "Nhà vệ sinh", "Căng tin", "Phòng thay đồ"],
        courts: [
            { id: 12, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 13, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 14, name: "Sân 3 - Cao cấp", type: "Thảm cao su", price: "120.000đ/h", pricePerSlot: 60000 }
        ]
    },
    {
        id: "ta-thiet",
        name: "CLB Cầu Lông Thử Thách - Tà Thiết",
        coords: [11.8384, 106.5367],
        address: "Khu di tích lịch sử Căn cứ Tà Thiết, Lộc Ninh, Bình Phước",
        phone: "0271.3555.666",
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
        openTime: "05:30 - 21:30",
        priceRange: "90.000đ - 140.000đ/h",
        rating: 4.7,
        freeCourts: 3,
        description: "Thiết kế CLB cầu lông chuyên nghiệp phục vụ người dân địa phương và cán bộ chiến sĩ tập luyện thể thao. Không gian sạch sẽ, bồn rửa tay, phòng tắm nước nóng đầy đủ.",
        amenities: ["Bãi giữ xe", "WiFi miễn phí", "Nhà vệ sinh", "Phòng tắm nước nóng", "Căng tin"],
        courts: [
            { id: 15, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "90.000đ/h", pricePerSlot: 45000 },
            { id: 16, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "90.000đ/h", pricePerSlot: 45000 },
            { id: 17, name: "Sân 3 - VIP", type: "Thảm cao su", price: "140.000đ/h", pricePerSlot: 70000 },
            { id: 18, name: "Sân 4 - VIP", type: "Thảm cao su", price: "140.000đ/h", pricePerSlot: 70000 }
        ]
    },
    {
        id: "soc-bom-bo",
        name: "Sân Cầu Lông Đẳng Cấp - Sóc Bom Bo",
        coords: [11.7584, 107.1983],
        address: "Khu di tích bảo tồn văn hóa Sóc Bom Bo, Bù Đăng, Bình Phước",
        phone: "0271.3777.888",
        image: "https://images.unsplash.com/photo-1609121826763-149b5d278f2f?auto=format&fit=crop&w=1200&q=80",
        openTime: "06:00 - 22:00",
        priceRange: "80.000đ - 130.000đ/h",
        rating: 4.8,
        freeCourts: 2,
        description: "Điểm đến giao lưu văn hóa kết hợp thể thao của đồng bào địa phương. Cơ sở trang bị thảm giảm rung chấn, khán đài ngồi theo dõi các trận đấu kịch tính thoải mái.",
        amenities: ["Bãi giữ xe", "Nhà vệ sinh", "Căng tin", "Khán đài", "Hệ thống chiếu sáng cao cấp"],
        courts: [
            { id: 19, name: "Sân 1 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 20, name: "Sân 2 - Tiêu chuẩn", type: "Thảm PVC", price: "80.000đ/h", pricePerSlot: 40000 },
            { id: 21, name: "Sân 3 - Premium", type: "Thảm cao su", price: "130.000đ/h", pricePerSlot: 65000 }
        ]
    }
];

const mockedBookedSlots = {
    1: ["07:00","07:30","08:00"], 2: ["12:00","12:30","16:00"],
    3: ["18:00","18:30","19:00","19:30","20:00","20:30"], 4: ["06:00","06:30"],
    5: ["08:00","08:30","09:00"], 6: ["14:00","14:30"],
    7: ["19:00","19:30","20:00"], 8: ["07:00","07:30"],
    9: ["12:00","12:30"], 10: ["17:00","17:30","18:00"],
    11: ["20:00","20:30"], 12: ["09:00","09:30"],
    13: ["15:00","15:30"], 14: ["18:00","18:30"],
    15: ["06:00","06:30"], 16: ["11:00","11:30"],
    17: ["16:00","16:30"], 18: ["19:00","19:30"],
    19: ["08:00","08:30"], 20: ["13:00","13:30"], 21: ["17:00","17:30"]
};

/* Tạo khung giờ 06:00 → 21:30, mỗi bước 30 phút */
const timeSlots = Array.from({ length: 32 }, (_, i) => {
    const h = Math.floor(i / 2) + 6;
    const m = i % 2 === 0 ? "00" : "30";
    return `${String(h).padStart(2,"0")}:${m}`;
});

const amenityIcon = (name) => {
    if (name.includes("WiFi"))   return <Wifi size={13} />;
    if (name.includes("tắm") || name.includes("sinh")) return <ShowerHead size={13} />;
    if (name.includes("Căng") || name.includes("Shop")) return <Coffee size={13} />;
    if (name.includes("xe"))     return <Car size={13} />;
    if (name.includes("sáng") || name.includes("đèn")) return <Lightbulb size={13} />;
    if (name.includes("Khán"))   return <Users size={13} />;
    return <CheckCircle2 size={13} />;
};

/* ═══════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════ */
export default function CourtDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const branch = branchesData.find(b => b.id === id);

    const [selectedDate, setSelectedDate]   = useState(() => new Date().toISOString().split("T")[0]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [activeTab, setActiveTab]         = useState("booking");

    useEffect(() => { setSelectedCells([]); }, [selectedDate]);

    if (!branch) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <XCircle size={48} className="text-rose-500" />
                <h1 className="text-xl font-bold text-white">Không tìm thấy sân</h1>
                <Link to="/booking"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all">
                    <ArrowLeft size={16}/> Quay lại danh sách
                </Link>
            </div>
        );
    }

    const handleCellClick = (courtId, time) => {
        if (mockedBookedSlots[courtId]?.includes(time)) return;
        setSelectedCells(prev => {
            const exists = prev.find(c => c.courtId === courtId && c.time === time);
            return exists
                ? prev.filter(c => !(c.courtId === courtId && c.time === time))
                : [...prev, { courtId, time }];
        });
    };

    const totalMoney  = selectedCells.reduce((acc, cell) => {
        const court = branch.courts.find(c => c.id === cell.courtId);
        return acc + (court?.pricePerSlot ?? 0);
    }, 0);
    const totalMins   = selectedCells.length * 30;
    const timeStr     = totalMins >= 60
        ? `${Math.floor(totalMins/60)}h${totalMins%60>0 ? totalMins%60+"m":""}`
        : totalMins > 0 ? `${totalMins} phút` : "—";

    const handleConfirm = () => {
        if (!selectedCells.length) return;
        setBookingSuccess(true);
        setSelectedCells([]);
        setTimeout(() => setBookingSuccess(false), 3500);
    };

    return (
        <div style={{ background: "#08101a", minHeight: "100vh", paddingBottom: 40 }}>
            <style>{`
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(14px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .anim-up { animation: fadeUp .3s ease both; }

                @keyframes successPop {
                    0%   { transform:scale(.75); opacity:0; }
                    65%  { transform:scale(1.04); opacity:1; }
                    100% { transform:scale(1); }
                }
                .anim-pop { animation: successPop .4s cubic-bezier(.34,1.56,.64,1) both; }

                .slot-cell {
                    width: 40px;
                    min-width: 40px;
                    height: 38px;
                    border-right: 1px solid rgba(255,255,255,0.06);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    cursor: pointer;
                    transition: background .12s;
                }
                .slot-cell.free:hover  { background: rgba(16,185,129,.25) !important; }
                .slot-cell.booked      { background: rgba(239,68,68,.70) !important; cursor:not-allowed; }
                .slot-cell.chosen      { background: #10b981 !important; box-shadow:inset 0 0 0 2px #34d399; }
            `}</style>

            {/* ══ HERO ══ */}
            <div style={{ position:"relative", width:"100%", height:280, overflow:"hidden" }}>
                <img
                    src={branch.image}
                    alt={branch.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }}
                />
                {/* dark gradient overlay */}
                <div style={{
                    position:"absolute", inset:0,
                    background:"linear-gradient(to bottom, rgba(8,16,26,.35) 0%, rgba(8,16,26,.92) 80%, #08101a 100%)"
                }}/>

                {/* back button */}
                <Link to="/booking" style={{
                    position:"absolute", top:18, left:18, zIndex:10,
                    display:"flex", alignItems:"center", gap:6,
                    background:"rgba(0,0,0,.45)", backdropFilter:"blur(8px)",
                    color:"#fff", padding:"6px 14px", borderRadius:99,
                    fontSize:12, fontWeight:700, textDecoration:"none",
                    border:"1px solid rgba(255,255,255,.12)"
                }}>
                    <ArrowLeft size={13}/> Quay lại
                </Link>

                {/* badge */}
                <span style={{
                    position:"absolute", top:18, right:18, zIndex:10,
                    background:"rgba(16,185,129,.15)", border:"1px solid rgba(16,185,129,.4)",
                    color:"#6ee7b7", fontSize:10, fontWeight:800,
                    padding:"4px 12px", borderRadius:99, letterSpacing:1
                }}>TripleT Court</span>

                {/* title block — đã chuyển ra ngoài hero xuống dưới */}
            </div>

            {/* ══ WRAPPER ══ */}
            <div style={{ maxWidth:960, margin:"0 auto", padding:"0 20px" }}>

                {/* ── TITLE BLOCK ── */}
                <div className="anim-up" style={{ padding:"20px 0 0" }}>
                    <h1 style={{ color:"#fff", fontSize:24, fontWeight:900, lineHeight:1.25, margin:0, textShadow:"0 2px 12px rgba(0,0,0,.6)" }}>
                        {branch.name}
                    </h1>
                    <p style={{ margin:"6px 0 0", color:"#94a3b8", fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
                        <MapPin size={12} color="#f87171" style={{flexShrink:0}}/> {branch.address}
                    </p>
                </div>

                {/* ── INFO BADGES ── */}
                <div style={{
                    display:"flex", flexWrap:"wrap", gap:10,
                    padding:"18px 0", borderBottom:"1px solid rgba(255,255,255,.07)"
                }} className="anim-up">
                    {[
                        { icon:<Trophy size={13} color="#fbbf24"/>, text:`${branch.rating} ★`, color:"rgba(251,191,36,.15)", border:"rgba(251,191,36,.3)", textColor:"#fde68a" },
                        { icon:<Clock size={13} color="#60a5fa"/>,  text:branch.openTime,        color:"rgba(96,165,250,.12)", border:"rgba(96,165,250,.3)", textColor:"#93c5fd" },
                        { icon:<Sparkles size={13} color="#34d399"/>, text:branch.priceRange,    color:"rgba(52,211,153,.12)", border:"rgba(52,211,153,.3)", textColor:"#6ee7b7" },
                        { icon:<Phone size={13} color="#a78bfa"/>,  text:branch.phone,           color:"rgba(167,139,250,.12)", border:"rgba(167,139,250,.3)", textColor:"#c4b5fd" },
                    ].map((b,i)=>(
                        <div key={i} style={{
                            display:"flex", alignItems:"center", gap:7,
                            background:b.color, border:`1px solid ${b.border}`,
                            borderRadius:10, padding:"6px 13px"
                        }}>
                            {b.icon}
                            <span style={{ fontSize:11, fontWeight:700, color:b.textColor }}>{b.text}</span>
                        </div>
                    ))}
                    <div style={{
                        marginLeft:"auto", display:"flex", alignItems:"center", gap:7,
                        background:"rgba(0,245,160,.1)", border:"1px solid rgba(0,245,160,.3)",
                        borderRadius:10, padding:"6px 13px"
                    }}>
                        <CheckCircle2 size={13} color="#00f5a0"/>
                        <span style={{ fontSize:11, fontWeight:800, color:"#00f5a0" }}>
                            Còn {branch.freeCourts} sân trống
                        </span>
                    </div>
                </div>

                {/* ── TABS ── */}
                <div style={{ display:"flex", gap:6, margin:"20px 0 0", background:"rgba(255,255,255,.04)", borderRadius:12, padding:5, width:"fit-content" }}>
                    {[
                        { key:"info",    label:"Thông tin sân" },
                        { key:"booking", label:"🏸 Đặt lịch ngay" }
                    ].map(tab => (
                        <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
                            style={{
                                padding:"8px 22px", borderRadius:9, fontSize:12, fontWeight:700,
                                border:"none", cursor:"pointer", transition:"all .2s",
                                background: activeTab===tab.key ? "#059669" : "transparent",
                                color: activeTab===tab.key ? "#fff" : "#64748b",
                                boxShadow: activeTab===tab.key ? "0 4px 14px rgba(5,150,105,.25)" : "none"
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ══════════════ TAB: THÔNG TIN ══════════════ */}
                {activeTab === "info" && (
                    <div className="anim-up" style={{ marginTop:22, display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

                        {/* Mô tả */}
                        <div style={{ background:"#0d1627", borderRadius:16, padding:22, border:"1px solid rgba(255,255,255,.07)" }}>
                            <h2 style={{ color:"#fff", fontSize:13, fontWeight:800, margin:"0 0 12px", display:"flex", alignItems:"center", gap:7 }}>
                                <Layers size={14} color="#34d399"/> Mô tả chi nhánh
                            </h2>
                            <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.7, margin:0 }}>{branch.description}</p>
                        </div>

                        {/* Tiện ích */}
                        <div style={{ background:"#0d1627", borderRadius:16, padding:22, border:"1px solid rgba(255,255,255,.07)" }}>
                            <h2 style={{ color:"#fff", fontSize:13, fontWeight:800, margin:"0 0 12px", display:"flex", alignItems:"center", gap:7 }}>
                                <CheckCircle2 size={14} color="#34d399"/> Tiện ích có sẵn
                            </h2>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                                {(branch.amenities||[]).map((a,i)=>(
                                    <div key={i} style={{
                                        display:"flex", alignItems:"center", gap:7,
                                        background:"rgba(52,211,153,.07)", border:"1px solid rgba(52,211,153,.18)",
                                        borderRadius:8, padding:"7px 11px",
                                        color:"#6ee7b7", fontSize:11, fontWeight:600
                                    }}>
                                        {amenityIcon(a)} {a}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Danh sách sân con */}
                        <div style={{ gridColumn:"1/-1", background:"#0d1627", borderRadius:16, padding:22, border:"1px solid rgba(255,255,255,.07)" }}>
                            <h2 style={{ color:"#fff", fontSize:13, fontWeight:800, margin:"0 0 14px", display:"flex", alignItems:"center", gap:7 }}>
                                <Trophy size={14} color="#fbbf24"/> Danh sách sân con
                            </h2>
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10 }}>
                                {branch.courts.map(c=>(
                                    <div key={c.id} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"12px 14px" }}>
                                        <p style={{ color:"#fff", fontSize:12, fontWeight:700, margin:"0 0 3px" }}>{c.name}</p>
                                        <p style={{ color:"#64748b", fontSize:11, margin:"0 0 6px" }}>{c.type}</p>
                                        <p style={{ color:"#34d399", fontSize:14, fontWeight:900, margin:0 }}>{c.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ gridColumn:"1/-1", display:"flex", justifyContent:"center", paddingBottom:4 }}>
                            <button onClick={()=>setActiveTab("booking")} style={{
                                display:"flex", alignItems:"center", gap:8,
                                padding:"12px 32px", borderRadius:14, border:"none", cursor:"pointer",
                                background:"#059669", color:"#fff", fontSize:13, fontWeight:800,
                                boxShadow:"0 6px 20px rgba(5,150,105,.28)", transition:"all .2s"
                            }}>
                                🏸 Đặt lịch sân ngay <ChevronRight size={15}/>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════ TAB: ĐẶT LỊCH ══════════════ */}
                {activeTab === "booking" && (
                    <div className="anim-up" style={{ marginTop:22 }}>

                        {/* Toolbar */}
                        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:16 }}>
                            <div style={{ display:"flex", gap:18, alignItems:"center" }}>
                                {[
                                    { cls:"free",   color:"rgba(255,255,255,.06)", border:"rgba(255,255,255,.14)", label:"Trống" },
                                    { cls:"booked", color:"rgba(239,68,68,.70)",   border:"transparent",          label:"Đã đặt" },
                                    { cls:"chosen", color:"#10b981",               border:"transparent",          label:"Đang chọn" },
                                ].map(l=>(
                                    <div key={l.cls} style={{ display:"flex", alignItems:"center", gap:7 }}>
                                        <span style={{ display:"block", width:16, height:16, borderRadius:4, background:l.color, border:`1px solid ${l.border}` }}/>
                                        <span style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>{l.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                                <label style={{ fontSize:11, color:"#64748b", fontWeight:700 }}>Ngày thi đấu:</label>
                                <input type="date" value={selectedDate}
                                    onChange={e=>setSelectedDate(e.target.value)}
                                    style={{
                                        background:"#0d1627", border:"1px solid rgba(255,255,255,.12)",
                                        borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700,
                                        color:"#fff", outline:"none", cursor:"pointer"
                                    }}/>
                            </div>
                        </div>

                        {/* ── BẢNG LƯỚI GIỜ ── */}
                        <div style={{
                            border:"1px solid rgba(255,255,255,.08)",
                            borderRadius:14, overflow:"hidden",
                            background:"#0b1422"
                        }}>
                            {/* scroll wrapper */}
                            <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                                <table style={{ borderCollapse:"collapse", tableLayout:"fixed", minWidth:"max-content" }}>
                                    <thead>
                                        <tr>
                                            {/* sticky tên sân */}
                                            <th style={{
                                                position:"sticky", left:0, zIndex:20,
                                                width:130, minWidth:130,
                                                background:"#0d1627",
                                                borderRight:"1px solid rgba(255,255,255,.1)",
                                                borderBottom:"1px solid rgba(255,255,255,.08)",
                                                padding:"10px 14px",
                                                textAlign:"left", fontSize:10, fontWeight:800,
                                                color:"#475569", textTransform:"uppercase", letterSpacing:.8
                                            }}>
                                                Sân / Giờ
                                            </th>
                                            {timeSlots.map(t=>(
                                                <th key={t} style={{
                                                    width:40, minWidth:40,
                                                    background:"#0c1525",
                                                    borderRight:"1px solid rgba(255,255,255,.06)",
                                                    borderBottom:"1px solid rgba(255,255,255,.08)",
                                                    padding:"10px 0",
                                                    fontSize:9, fontWeight:700, color:"#475569",
                                                    textAlign:"center", whiteSpace:"nowrap"
                                                }}>
                                                    {t}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {branch.courts.map((court, ri)=>(
                                            <tr key={court.id} style={{ background: ri%2===0 ? "#0b1422" : "#0c1525" }}>
                                                {/* tên sân sticky */}
                                                <td style={{
                                                    position:"sticky", left:0, zIndex:10,
                                                    width:130, minWidth:130,
                                                    background: ri%2===0 ? "#0d1730" : "#0d1830",
                                                    borderRight:"1px solid rgba(255,255,255,.1)",
                                                    borderBottom:"1px solid rgba(255,255,255,.05)",
                                                    padding:"10px 14px"
                                                }}>
                                                    <p style={{ margin:0, fontSize:11, fontWeight:800, color:"#34d399" }}>
                                                        {court.name.split(" - ")[0]}
                                                    </p>
                                                    <p style={{ margin:"2px 0 0", fontSize:10, color:"#475569" }}>{court.price}</p>
                                                </td>
                                                {timeSlots.map(time=>{
                                                    const booked = mockedBookedSlots[court.id]?.includes(time);
                                                    const chosen = selectedCells.some(c=>c.courtId===court.id&&c.time===time);
                                                    return (
                                                        <td key={`${court.id}-${time}`}
                                                            onClick={()=>handleCellClick(court.id,time)}
                                                            className={`slot-cell ${booked?"booked":chosen?"chosen":"free"}`}
                                                            style={{
                                                                background: booked
                                                                    ? "rgba(239,68,68,.65)"
                                                                    : chosen
                                                                    ? "#10b981"
                                                                    : "transparent"
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── FOOTER THANH TOÁN ── */}
                        <div style={{
                            marginTop:16,
                            borderRadius:14,
                            border: selectedCells.length ? "1px solid rgba(16,185,129,.35)" : "1px solid rgba(255,255,255,.07)",
                            background: selectedCells.length ? "rgba(4,120,87,.15)" : "#0d1627",
                            padding:"18px 24px",
                            display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:16,
                            transition:"all .3s"
                        }}>
                            <div style={{ display:"flex", gap:32 }}>
                                {[
                                    { label:"Tổng thời gian", value:timeStr, color:"#34d399" },
                                    { label:"Tổng tiền",       value:totalMoney>0 ? totalMoney.toLocaleString("vi-VN")+" đ" : "—", color:"#fbbf24" },
                                    ...(selectedCells.length ? [{ label:"Khung giờ đã chọn", value:`${selectedCells.length} ô`, color:"#fff" }] : [])
                                ].map((s,i)=>(
                                    <div key={i}>
                                        <p style={{ margin:0, fontSize:9, textTransform:"uppercase", letterSpacing:.8, color:"#475569", fontWeight:700 }}>{s.label}</p>
                                        <p style={{ margin:"4px 0 0", fontSize:22, fontWeight:900, color:s.color }}>{s.value}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleConfirm} disabled={!selectedCells.length}
                                style={{
                                    display:"flex", alignItems:"center", gap:8,
                                    padding:"13px 30px", borderRadius:12, border:"none", cursor: selectedCells.length?"pointer":"not-allowed",
                                    fontSize:13, fontWeight:900,
                                    background: selectedCells.length ? "#f59e0b" : "#1e293b",
                                    color: selectedCells.length ? "#1c1917" : "#475569",
                                    boxShadow: selectedCells.length ? "0 6px 20px rgba(245,158,11,.3)" : "none",
                                    transition:"all .2s"
                                }}>
                                XÁC NHẬN ĐẶT SÂN <ChevronRight size={15}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ══ TOAST SUCCESS ══ */}
            {bookingSuccess && (
                <div style={{
                    position:"fixed", inset:0, zIndex:300,
                    background:"rgba(0,0,0,.65)", backdropFilter:"blur(6px)",
                    display:"flex", alignItems:"center", justifyContent:"center", padding:20
                }}>
                    <div className="anim-pop" style={{
                        background:"#0d1f17", border:"1px solid rgba(16,185,129,.35)",
                        borderRadius:24, padding:"36px 32px",
                        display:"flex", flexDirection:"column", alignItems:"center", gap:16,
                        maxWidth:320, width:"100%", textAlign:"center",
                        boxShadow:"0 24px 60px rgba(0,0,0,.5)"
                    }}>
                        <div style={{
                            width:64, height:64, borderRadius:"50%",
                            background:"rgba(16,185,129,.15)", border:"2px solid #34d399",
                            display:"flex", alignItems:"center", justifyContent:"center"
                        }}>
                            <CheckCircle2 size={34} color="#34d399"/>
                        </div>
                        <h3 style={{ margin:0, color:"#fff", fontSize:18, fontWeight:900 }}>Đặt sân thành công!</h3>
                        <p style={{ margin:0, color:"#94a3b8", fontSize:13, lineHeight:1.6 }}>
                            Lịch đặt tại <strong style={{color:"#34d399"}}>{branch.name}</strong> đã được ghi nhận. Vui lòng thanh toán theo hướng dẫn.
                        </p>
                        <button onClick={()=>setBookingSuccess(false)} style={{
                            padding:"10px 28px", borderRadius:10, border:"none", cursor:"pointer",
                            background:"#059669", color:"#fff", fontSize:13, fontWeight:800
                        }}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
}

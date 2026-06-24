import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ProfileCourtsCreate({ onBack }) {
    // 1. Basic Info
    const [courtName, setCourtName] = useState("");
    const [description, setDescription] = useState("");
    const [courtCount, setCourtCount] = useState(1);
    
    // SubCourts
    const [subCourts, setSubCourts] = useState([{ id: 1, name: "Sân 1" }]);

    // TimeSlots
    const [timeSlots, setTimeSlots] = useState([
        { id: Date.now(), startTime: "05:00", endTime: "22:00", price: "" }
    ]);

    // Thumbnail
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Address
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    // Amenities
    const amenitiesList = [
        { id: "Wifi", name: "Wifi miễn phí", icon: "📶" },
        { id: "Bãi để xe", name: "Bãi để xe", icon: "🅿️" },
        { id: "Căn tin", name: "Căn tin/Nước giải khát", icon: "🥤" },
        { id: "Thuê vợt", name: "Thuê vợt/Cầu", icon: "🏸" },
        { id: "Điều hòa", name: "Quạt/Điều hòa", icon: "❄️" },
        { id: "Tủ đồ", name: "Tủ đồ cá nhân", icon: "🗄️" },
    ];
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    // -- USE EFFECTS FOR ADDRESS --
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

    // -- HANDLERS FOR SUB COURTS --
    const handleCourtCountChange = (e) => {
        const count = parseInt(e.target.value) || 1;
        const validCount = Math.max(1, Math.min(50, count));
        setCourtCount(validCount);

        setSubCourts(prev => {
            const newCourts = [...prev];
            if (validCount > prev.length) {
                for (let i = prev.length + 1; i <= validCount; i++) {
                    newCourts.push({ id: i, name: `Sân ${i}` });
                }
            } else {
                newCourts.length = validCount; // Truncate
            }
            return newCourts;
        });
    };

    const handleSubCourtNameChange = (id, newName) => {
        setSubCourts(prev => prev.map(sc => sc.id === id ? { ...sc, name: newName } : sc));
    };

    // -- HANDLERS FOR TIME SLOTS --
    const addTimeSlot = () => {
        setTimeSlots(prev => [
            ...prev,
            { id: Date.now(), startTime: "00:00", endTime: "00:00", price: "" }
        ]);
    };

    const removeTimeSlot = (id) => {
        if (timeSlots.length <= 1) return; // Must have at least 1
        setTimeSlots(prev => prev.filter(ts => ts.id !== id));
    };

    const updateTimeSlot = (id, field, value) => {
        setTimeSlots(prev => prev.map(ts => ts.id === id ? { ...ts, [field]: value } : ts));
    };

    // -- HANDLERS FOR THUMBNAIL --
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const removeThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // -- HANDLERS FOR AMENITIES --
    const toggleAmenity = (id) => {
        setSelectedAmenities(prev => 
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    // -- SUBMIT --
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedProvince || !selectedDistrict || !selectedWard || !detailAddress) {
            alert("Vui lòng nhập đầy đủ địa chỉ sân!");
            return;
        }

        if (!thumbnail) {
            alert("Vui lòng tải lên ảnh đại diện (Thumbnail) cho cụm sân!");
            return;
        }

        // Validate timeslots
        for (let i = 0; i < timeSlots.length; i++) {
            const slot = timeSlots[i];
            if (!slot.price || parseFloat(slot.price) <= 0) {
                alert(`Vui lòng nhập giá hợp lệ cho khung giờ ${slot.startTime} - ${slot.endTime}`);
                return;
            }
            if (slot.startTime >= slot.endTime) {
                alert(`Khung giờ ${slot.startTime} - ${slot.endTime} không hợp lệ (Giờ bắt đầu phải nhỏ hơn giờ kết thúc)`);
                return;
            }
        }

        setIsSubmitting(true);

        // Build Final Description with Amenities
        let finalDescription = description;
        if (selectedAmenities.length > 0) {
            const amenitiesString = selectedAmenities.join(", ");
            finalDescription += `\n\nTiện ích có sẵn: ${amenitiesString}`;
        }

        // --- PREPARE DATA TO SEND TO API ---
        const pText = provinces.find(p => p.code == selectedProvince)?.name || "";
        const dText = districts.find(d => d.code == selectedDistrict)?.name || "";
        const wText = wards.find(w => w.code == selectedWard)?.name || "";
        const finalAddress = `${detailAddress}, ${wText}, ${dText}, ${pText}`.replace(/^,\s*|,\s*$/, '');

        const payload = {
            CourtName: courtName,
            Address: finalAddress,
            Description: finalDescription,
            SubCourts: subCourts.map(sc => sc.name),
            TimeSlots: timeSlots.map(ts => ({
                StartTime: ts.startTime,
                EndTime: ts.endTime,
                Price: parseFloat(ts.price)
            }))
            // Note: Thumbnail would be handled via FormData if sending actual file
        };

        console.log("PAYLOAD SẼ GỬI LÊN SERVER:", payload);

        // Mock API Call
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Tạo sân thành công! Dữ liệu đang được chờ phê duyệt bởi admin.");
            onBack();
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <button 
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tạo cụm sân mới</h3>
                    <p className="text-xs text-slate-400 mt-1">Hệ thống sẽ tự động tạo bảng SubCourts và TimeSlots cho bạn.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. THÔNG TIN CƠ BẢN */}
                <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5 shadow-sm">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 w-6 h-6 flex items-center justify-center rounded-lg">1</span>
                        Thông tin cơ bản
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tên cụm sân <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={courtName}
                                onChange={(e) => setCourtName(e.target.value)}
                                className="tt-input bg-white dark:bg-slate-900 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                                placeholder="VD: Sân cầu lông Lão Tướng"
                                required
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Ảnh đại diện (Thumbnail) <span className="text-red-500">*</span></label>
                            {!thumbnailPreview ? (
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-[46px] rounded-xl border-2 border-dashed border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-center text-emerald-600 transition-colors"
                                >
                                    <span className="text-xs font-bold flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                        Tải ảnh lên
                                    </span>
                                </button>
                            ) : (
                                <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 shadow-sm h-[46px]">
                                    <div className="flex items-center gap-3">
                                        <img src={thumbnailPreview} alt="thumb" className="h-8 w-12 object-cover rounded-md" />
                                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate max-w-[120px]">{thumbnail.name}</span>
                                    </div>
                                    <button type="button" onClick={removeThumbnail} className="text-red-500 hover:text-red-600 p-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleThumbnailChange} />
                        </div>
                    </div>
                </div>

                {/* 2. ĐỊA CHỈ SÂN */}
                <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5 shadow-sm">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 w-6 h-6 flex items-center justify-center rounded-lg">2</span>
                        Vị trí & Địa chỉ
                    </h4>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                required
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
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                required
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
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                required
                            >
                                <option value="">-- Chọn Phường / Xã --</option>
                                {wards.map((w) => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="text"
                            placeholder="Số nhà, hẻm, tên đường..."
                            value={detailAddress}
                            onChange={(e) => setDetailAddress(e.target.value)}
                            disabled={!selectedWard}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                            required
                        />
                    </div>
                </div>

                {/* 3. QUẢN LÝ SÂN CON (CourtSubItems) */}
                <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5 shadow-sm">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 dark:bg-emerald-900/30 w-6 h-6 flex items-center justify-center rounded-lg">3</span>
                            Danh sách sân con
                        </div>
                        
                        <div className="flex items-center gap-2 font-normal">
                            <span className="text-xs text-slate-500">Số lượng:</span>
                            <input 
                                type="number" 
                                min="1" max="50"
                                value={courtCount}
                                onChange={handleCourtCountChange}
                                className="w-16 px-2 py-1 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {subCourts.map((sc, idx) => (
                            <div key={sc.id} className="relative group">
                                <span className="absolute -top-2 -left-2 bg-slate-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10 shadow-sm">{idx + 1}</span>
                                <input 
                                    type="text"
                                    value={sc.name}
                                    onChange={(e) => handleSubCourtNameChange(sc.id, e.target.value)}
                                    placeholder={`Tên sân ${idx+1}`}
                                    className="w-full pl-4 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-400 focus:ring-2 focus:ring-emerald-500 text-center transition-all shadow-sm group-hover:border-emerald-300"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. KHUNG GIỜ & BẢNG GIÁ (CourtTimeSlots) */}
                <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5 shadow-sm">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 dark:bg-emerald-900/30 w-6 h-6 flex items-center justify-center rounded-lg">4</span>
                            Khung giờ & Bảng giá
                        </div>
                        <button 
                            type="button" 
                            onClick={addTimeSlot}
                            className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-800/60 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1"
                        >
                            <span>+</span> Thêm khung giờ
                        </button>
                    </h4>
                    
                    <div className="space-y-3">
                        {timeSlots.map((slot, index) => (
                            <div key={slot.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <span className="text-xs font-bold text-slate-400">Từ</span>
                                    <input 
                                        type="time" 
                                        value={slot.startTime}
                                        onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                                        className="tt-input px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-1 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <span className="text-xs font-bold text-slate-400">Đến</span>
                                    <input 
                                        type="time" 
                                        value={slot.endTime}
                                        onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                                        className="tt-input px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-1 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
                                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Giá 1h (VNĐ)</span>
                                    <input 
                                        type="number" 
                                        min="0" step="1000"
                                        placeholder="VD: 80000"
                                        value={slot.price}
                                        onChange={(e) => updateTimeSlot(slot.id, 'price', e.target.value)}
                                        className="tt-input flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-1 focus:ring-emerald-500 font-semibold text-emerald-600 dark:text-emerald-400"
                                        required
                                    />
                                </div>
                                {timeSlots.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeTimeSlot(slot.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                                        title="Xóa khung giờ"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. TIỆN ÍCH & MÔ TẢ */}
                <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5 shadow-sm">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 w-6 h-6 flex items-center justify-center rounded-lg">5</span>
                        Tiện ích & Mô tả thêm
                    </h4>
                    
                    <div className="space-y-5">
                        {/* Tiện ích */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {amenitiesList.map((amenity) => {
                                const isSelected = selectedAmenities.includes(amenity.id);
                                return (
                                    <button
                                        type="button"
                                        key={amenity.id}
                                        onClick={() => toggleAmenity(amenity.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                                            isSelected 
                                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm" 
                                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-300"
                                        }`}
                                    >
                                        <span className="text-xl">{amenity.icon}</span>
                                        <span className="text-xs font-semibold">{amenity.name}</span>
                                        {isSelected && (
                                            <div className="ml-auto w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Mô tả */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mô tả chi tiết sân</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                                placeholder="Viết vài dòng giới thiệu về chất lượng thảm, độ sáng, không gian..."
                                className="tt-input bg-white dark:bg-slate-900 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white resize-none"
                            ></textarea>
                            <p className="text-[10px] text-slate-400 mt-1">* Các tiện ích bạn chọn ở trên sẽ được tự động nối vào cuối phần mô tả này.</p>
                        </div>
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="tt-btn-primary flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl text-sm shadow-xl shadow-emerald-500/20 transition-all duration-200 min-w-[160px] disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                            </>
                        ) : (
                            "Tạo sân ngay"
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}

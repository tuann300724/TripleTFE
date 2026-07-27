// Dữ liệu giả lập 6 chi nhánh của hệ thống sân cầu lông TripleT
export const branchesData = [
    {
        id: "tran-bien",
        name: "Sân Cầu Lông Premium - Trấn Biên",
        coords: [10.9612, 106.7972],
        address: "Đường Chu Văn An, P. Quang Vinh, TP. Biên Hòa, Đồng Nai",
        phone: "0251.3847.111",
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1613918431208-6752c2ecdfd4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80"
        ],
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
        ],
        comments: [
            {
                id: 1,
                user: "Nguyễn Minh Tuấn",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                date: "2026-06-25",
                content: "Sân rất đẹp, thảm mới và rất êm chân. Ánh sáng thiết kế cực tốt không bị chói khi đập cầu."
            },
            {
                id: 2,
                user: "Phạm Thuỳ Linh",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                rating: 4,
                date: "2026-06-23",
                content: "Nhân viên nhiệt tình, có căng tin phục vụ nước uống mát lạnh. Tuy nhiên giờ cao điểm hơi đông và khó gửi xe một chút."
            },
            {
                id: 3,
                user: "Hoàng Anh Đức",
                avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                date: "2026-06-18",
                content: "Sân trần cao và thoáng gió. Dịch vụ cho thuê vợt chất lượng tốt. Sẽ tiếp tục ủng hộ CLB lâu dài!"
            }
        ]
    },
    {
        id: "chien-khu-d",
        name: "CLB Cầu Lông Thử Thách - Chiến Khu Đ",
        coords: [11.1718, 107.0125],
        address: "Khu bảo tồn di tích lịch sử Chiến khu Đ, Vĩnh Cửu, Đồng Nai",
        phone: "0251.3961.222",
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1609121826763-149b5d278f2f?auto=format&fit=crop&w=800&q=80"
        ],
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
        ],
        comments: [
            {
                id: 1,
                user: "Lê Văn Tiến",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                rating: 4,
                date: "2026-06-20",
                content: "Sân sạch sẽ, không gian thoáng mát gần gũi thiên nhiên. Thích hợp cho anh em đi giao lưu cuối tuần."
            },
            {
                id: 2,
                user: "Bùi Thị Mai",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                date: "2026-06-15",
                content: "Hệ thống đèn chiếu sáng cực kỳ tốt, không bị chói. Có chỗ đỗ xe rộng rãi an toàn."
            }
        ]
    },
    {
        id: "tan-hiep",
        name: "Sân Cầu Lông Đẳng Cấp - Tân Hiệp",
        coords: [10.9628, 106.8291],
        address: "114 Nguyễn Ái Quốc, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai",
        phone: "0251.3822.333",
        image: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80"
        ],
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
        ],
        comments: [
            {
                id: 1,
                user: "Đinh Xuân Trường",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                date: "2026-06-26",
                content: "Đúng chất sân đẳng cấp. Thảm êm, trần cao không bị bí bách. Quầy shop thể thao phục vụ chuyên nghiệp và căng dây rất chuẩn."
            },
            {
                id: 2,
                user: "Vũ Khánh Huyền",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                date: "2026-06-24",
                content: "Sân nằm ngay mặt tiền đường dễ tìm. Nhà vệ sinh và phòng thay đồ cực kỳ sạch sẽ và hiện đại. Vote 5 sao!"
            },
            {
                id: 3,
                user: "Lý Gia Kiệt",
                avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
                rating: 4.7,
                date: "2026-06-21",
                content: "Sân tuyệt vời, giá cả hợp lý so với chất lượng. Nước uống phong phú, nhân viên quầy phục vụ rất thân thiện."
            }
        ]
    },
    {
        id: "phu-rieng-do",
        name: "Sân Cầu Lông Premium - Phú Riềng Đỏ",
        coords: [11.6667, 106.9022],
        address: "Đường ĐT 741, Xã Phú Riềng, Huyện Phú Riềng, Bình Phước",
        phone: "0271.3999.444",
        image: "https://images.unsplash.com/photo-1613918431208-6752c2ecdfd4?auto=format&fit=crop&w=800&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1613918431208-6752c2ecdfd4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1611251189753-e11fc3cf7f24?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80"
        ],
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
        ],
        comments: [
            {
                id: 1,
                user: "Nguyễn Hải Đăng",
                avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
                rating: 4.5,
                date: "2026-06-22",
                content: "Sân chất lượng cao, thảm đệm êm chân đúng như giới thiệu. Đá đôi hay đá đơn đều rất phê."
            },
            {
                id: 2,
                user: "Trần Kim Oanh",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
                rating: 4.7,
                date: "2026-06-19",
                content: "Rất thích hợp cho các gia đình đưa con em đi tập luyện nâng cao sức khỏe vào dịp hè."
            }
        ]
    },
    {
        id: "ta-thiet",
        name: "CLB Cầu Lông Thử Thách - Tà Thiết",
        coords: [11.8384, 106.5367],
        address: "Khu di tích lịch sử Căn cứ Tà Thiết, Lộc Ninh, Bình Phước",
        phone: "0271.3555.666",
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1609121826763-149b5d278f2f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"
        ],
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
        ],
        comments: [
            {
                id: 1,
                user: "Tạ Hoàng Minh",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                date: "2026-06-25",
                content: "CLB sạch sẽ, đặc biệt có phòng tắm nước nóng xịn xò sau khi chơi mồ hôi đầm đìa."
            },
            {
                id: 2,
                user: "Lê Thảo Vy",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
                rating: 4.4,
                date: "2026-06-20",
                content: "Sân rộng rãi và an ninh tốt. Anh chủ sân cũng rất dễ tính và hay hỗ trợ người chơi."
            }
        ]
    },
    {
        id: "soc-bom-bo",
        name: "Sân Cầu Lông Đẳng Cấp - Sóc Bom Bo",
        coords: [11.7584, 107.1983],
        address: "Khu di tích bảo tồn văn hóa Sóc Bom Bo, Bù Đăng, Bình Phước",
        phone: "0271.3777.888",
        image: "https://images.unsplash.com/photo-1609121826763-149b5d278f2f?auto=format&fit=crop&w=800&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1609121826763-149b5d278f2f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80"
        ],
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
        ],
        comments: [
            {
                id: 1,
                user: "Điểu Giang",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
                rating: 5,
                date: "2026-06-24",
                content: "Sân rất hoành tráng, có khán đài ngồi cổ vũ xem sướng cực kỳ. Giao lưu vui vẻ!"
            },
            {
                id: 2,
                user: "Thị Hồng",
                avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=150&q=80",
                rating: 4.6,
                date: "2026-06-22",
                content: "Hệ thống thảm cao cấp giảm rung rất êm chân khi chạy nhảy cứu cầu."
            }
        ]
    }
];

export const mockedBookedSlots = {
    1: ["07:00", "07:30", "08:00"],
    2: ["12:00", "12:30", "16:00"],
    3: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
    4: ["06:00", "06:30"],
    5: ["08:00", "08:30", "09:00"],
    6: ["14:00", "14:30"],
    7: ["19:00", "19:30", "20:00"],
    8: ["07:00", "07:30"],
    9: ["12:00", "12:30"],
    10: ["17:00", "17:30", "18:00"],
    11: ["20:00", "20:30"],
    12: ["09:00", "09:30"],
    13: ["15:00", "15:30"],
    14: ["18:00", "18:30"],
    15: ["06:00", "06:30"],
    16: ["11:00", "11:30"],
    17: ["16:00", "16:30"],
    18: ["19:00", "19:30"],
    19: ["08:00", "08:30"],
    20: ["13:00", "13:30"],
    21: ["17:00", "17:30"]
};

export const normalizeTime = (t) => {
    const [h, m] = t.split(":");
    return `${h.padStart(2, '0')}:${m}`;
};

export const timeSlots = Array.from({ length: 33 }, (_, i) => {
    const h = Math.floor(i / 2) + 6;
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
});

export const normalizedTimeSlots = timeSlots.map(normalizeTime);

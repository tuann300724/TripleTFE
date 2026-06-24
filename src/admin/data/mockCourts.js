export const MOCK_COURTS = [
    {
        courtId: 1,
        courtName: "Sân cầu lông Lão Tướng",
        address: "123 Nguyễn Văn Linh, Phường 7, Quận 7, TP. Hồ Chí Minh",
        description:
            "Sân thảm cao cấp, ánh sáng đèn LED đầy đủ, không gian thoáng mát. Tiện ích: Wifi, Bãi để xe, Căn tin",
        thumbnail:
            "https://images.unsplash.com/photo-1626224583764-f87db7ac1f00?w=600&q=80",
        isApproved: false,
        status: "Active",
        createdAt: "2026-06-20T08:30:00Z",
        owner: { userId: 5, fullName: "Nguyễn Văn Tuấn", email: "tuan@gmail.com", phone: "0901234567" },
        amenities: ["Wifi", "Bãi để xe", "Căn tin"],
        subCourts: [
            { subCourtId: 1, subCourtName: "Sân 1", status: 1, floorType: "Thảm PVC" },
            { subCourtId: 2, subCourtName: "Sân 2", status: 1, floorType: "Thảm PVC" },
            { subCourtId: 3, subCourtName: "Sân VIP", status: 1, floorType: "Thảm cao su" },
        ],
        timeSlots: [
            { slotId: 1, startTime: "05:00", endTime: "08:00", price: 120000 },
            { slotId: 2, startTime: "08:00", endTime: "17:00", price: 80000 },
            { slotId: 3, startTime: "17:00", endTime: "22:00", price: 150000 },
        ],
    },
    {
        courtId: 2,
        courtName: "Trung tâm cầu lông Bình Thạnh",
        address: "45 Đinh Tiên Hoàng, Phường 1, Bình Thạnh, TP. Hồ Chí Minh",
        description: "Sân trong nhà, điều hòa mát lạnh. Tiện ích: Điều hòa, Tủ đồ, Thuê vợt",
        thumbnail:
            "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50e?w=600&q=80",
        isApproved: true,
        status: "Active",
        createdAt: "2026-06-18T10:00:00Z",
        owner: { userId: 8, fullName: "Trần Minh Khoa", email: "khoa.tran@gmail.com", phone: "0912345678" },
        amenities: ["Điều hòa", "Tủ đồ", "Thuê vợt"],
        subCourts: [
            { subCourtId: 4, subCourtName: "Sân A", status: 1, floorType: "Thảm PVC" },
            { subCourtId: 5, subCourtName: "Sân B", status: 1, floorType: "Thảm PVC" },
        ],
        timeSlots: [{ slotId: 4, startTime: "06:00", endTime: "21:00", price: 100000 }],
    },
    {
        courtId: 3,
        courtName: "Sân Phú Nhuận Sport Center",
        address: "88 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP. Hồ Chí Minh",
        description: "Sân mới xây, sàn gỗ chống trượt cao cấp. Tiện ích: Wifi, Căn tin",
        thumbnail:
            "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80",
        isApproved: false,
        status: "Active",
        createdAt: "2026-06-21T14:15:00Z",
        owner: { userId: 12, fullName: "Lê Thị Hương", email: "huong.le@gmail.com", phone: "0923456789" },
        amenities: ["Wifi", "Căn tin", "Bãi để xe ô tô"],
        subCourts: [
            { subCourtId: 6, subCourtName: "Sân 1", status: 1, floorType: "Sàn gỗ" },
            { subCourtId: 7, subCourtName: "Sân 2", status: 1, floorType: "Sàn gỗ" },
            { subCourtId: 8, subCourtName: "Sân 3", status: 1, floorType: "Sàn gỗ" },
            { subCourtId: 9, subCourtName: "Sân 4", status: 1, floorType: "Sàn gỗ" },
        ],
        timeSlots: [
            { slotId: 5, startTime: "05:30", endTime: "08:30", price: 110000 },
            { slotId: 6, startTime: "08:30", endTime: "16:30", price: 75000 },
            { slotId: 7, startTime: "16:30", endTime: "22:00", price: 130000 },
        ],
    },
    {
        courtId: 4,
        courtName: "Sân Cầu Lông Quận 12",
        address: "22 Quang Trung, Phường Hiệp Thành, Quận 12, TP. Hồ Chí Minh",
        description: "Sân cộng đồng giá rẻ. Tiện ích: Bãi để xe máy, Wifi",
        thumbnail:
            "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80",
        isApproved: false,
        status: "Active",
        createdAt: "2026-06-22T09:00:00Z",
        owner: { userId: 17, fullName: "Phạm Văn Đức", email: "duc.pham@gmail.com", phone: "0934567890" },
        amenities: ["Bãi để xe máy", "Wifi"],
        subCourts: [
            { subCourtId: 10, subCourtName: "Sân 1", status: 1, floorType: "Thảm PVC" },
            { subCourtId: 11, subCourtName: "Sân 2", status: 1, floorType: "Thảm PVC" },
        ],
        timeSlots: [{ slotId: 8, startTime: "06:00", endTime: "22:00", price: 60000 }],
    },
];

export function getCourtById(id) {
    return MOCK_COURTS.find((c) => c.courtId === Number(id)) ?? null;
}

export const formatCourtPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export const formatCourtDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

export const formatTime = (time) => time?.substring(0, 5) ?? "";

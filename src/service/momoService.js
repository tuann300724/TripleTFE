import axios from "axios";

export const createMomoPayment = async (orderId, amount) => {
    try {
        // Chuẩn hóa orderInfo: viết liền không dấu, không khoảng trắng để chống lỗi chữ ký tuyệt đối
        const cleanOrderInfo = `Thanh-toan-don-hang-${orderId}`;

        const res = await axios.post(
            "https://localhost:7147/api/Momo/create-momo",
            {
                orderId: String(orderId),
                amount: Number(amount), // 🔥 BẮT BUỘC ĐỔI THÀNH SỐ (Number) để khớp với kiểu long của Backend C#
                orderInfo: cleanOrderInfo,
                redirectUrl: "http://localhost:5173/success",
                ipnUrl: "https://localhost:7147/api/Momo/ipn",
                extraData: ""
            }
        );

        const data = res.data;
        console.log("MOMO SERVICE RESPONSE:", data);

        if (data?.resultCode === 0 && data?.payUrl) {
         
            window.location.href = data.payUrl; 
        }

        return {
            success: data?.resultCode === 0,
            payUrl: data?.payUrl || null,
            raw: data
        };

    } catch (error) {
        console.error("MOMO ERROR:", error.response?.data || error.message);

        return {
            success: false,
            payUrl: null,
            raw: error.response?.data || null
        };
    }
};
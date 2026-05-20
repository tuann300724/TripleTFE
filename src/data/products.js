export const products = [
    {
        id: 1,
        name: "Vợt Yonex Astrox 99 Pro",
        category: "Vợt cầu lông",
        price: 4290000,
        oldPrice: 4890000,
        badge: "Bán chạy",
        image: "https://imgs.search.brave.com/msEpqzANUjXgm933hlBhdKOcf0Bks1nVZsm0dmwmHlY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iaXp3/ZWIuZGt0Y2RuLm5l/dC90aHVtYi9sYXJn/ZS8xMDAvMDc4LzE0/NC9wcm9kdWN0cy8y/NDI3OTQyNTEtNDY2/NDc3NDA1MDIwMDMz/MC00Njc0NDc2Njgw/NDkzMTE0NDUxLW4u/anBnP3Y9MTY4NTA3/MTc3NTczMA",
    },
    {
        id: 2,
        name: "Vợt Lining Axforce 90 Max",
        category: "Vợt cầu lông",
        price: 3590000,
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80",
    },
    {
        id: 3,
        name: "Giày Yonex Power Cushion 65 Z3",
        category: "Giày thể thao",
        price: 2890000,
        badge: "Mới",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    },
    {
        id: 4,
        name: "Quả cầu Yonex AS-50",
        category: "Phụ kiện",
        price: 890000,
        image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80",
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

export const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

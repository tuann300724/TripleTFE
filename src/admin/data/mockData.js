/** Mock data — cửa hàng cầu lông TripleT (liên kết KH ↔ đơn ↔ SP) */

export const PRODUCTS = [
  { id: "P01", name: "Vợt Yonex Astrox 99 Pro", category: "Vợt", price: 4590000, stock: 24, status: "in_stock", image: "https://images.unsplash.com/photo-1626224583764-f87db7ef7350?w=400&h=400&fit=crop", description: "Vợt tấn công cực mạnh, cân bằng HEAD HEAVY, phù hợp đánh công." },
  { id: "P02", name: "Vợt Victor Thruster K 9900", category: "Vợt", price: 3890000, stock: 18, status: "in_stock", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop", description: "Lực smash mạnh, độ ổn định cao cho vận động viên chuyên nghiệp." },
  { id: "P03", name: "Giày Yonex Power Cushion 65 Z3", category: "Giày", price: 3490000, stock: 35, status: "in_stock", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop", description: "Đệm Power Cushion, bám sân tốt, nhẹ và linh hoạt." },
  { id: "P04", name: "Giày Victor A970ACE", category: "Giày", price: 2890000, stock: 42, status: "in_stock", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", description: "Giày đua tốc độ, hỗ trợ cổ chân khi di chuyển đa hướng." },
  { id: "P05", name: "Áo cầu lông Yonex 10426EX", category: "Áo", price: 890000, stock: 80, status: "in_stock", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", description: "Vải thoáng khí Very Cool Dry, co giãn 4 chiều." },
  { id: "P06", name: "Áo Lining AYMU469", category: "Áo", price: 750000, stock: 65, status: "in_stock", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop", description: "Áo thi đấu nhẹ, thấm hút mồ hôi nhanh." },
  { id: "P07", name: "Quấn cán Yonex Super Grap", category: "Quấn cán", price: 120000, stock: 200, status: "in_stock", image: "https://images.unsplash.com/photo-1612036789812-39ea61bbf1c2?w=400&h=400&fit=crop", description: "Quấn cán mỏng, thấm mồ hôi, cảm giác cầm chắc tay." },
  { id: "P08", name: "Quấn cán Victor GR233", category: "Quấn cán", price: 95000, stock: 150, status: "in_stock", image: "https://images.unsplash.com/photo-1598289431512-97c090cc8e80?w=400&h=400&fit=crop", description: "Độ bám cao, bền, phù hợp tập luyện hàng ngày." },
  { id: "P09", name: "Túi cầu lông Yonex Pro 9", category: "Túi", price: 1250000, stock: 28, status: "in_stock", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", description: "Túi 9 vợt, ngăn giày riêng, chống nước nhẹ." },
  { id: "P10", name: "Túi Victor BR3620", category: "Túi", price: 980000, stock: 0, status: "out_of_stock", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", description: "Túi 6 vợt gọn nhẹ, đai đeo vai tiện lợi." },
  { id: "P11", name: "Quả cầu Yonex AS-50 (12 quả)", category: "Phụ kiện", price: 890000, stock: 120, status: "in_stock", image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=400&fit=crop", description: "Cầu thi đấu chính thức, độ bền và đường bay ổn định." },
  { id: "P12", name: "Vợt Lining N7II Light", category: "Vợt", price: 3290000, stock: 8, status: "low_stock", image: "https://images.unsplash.com/photo-1622163642999-6c4e27d313c7?w=400&h=400&fit=crop", description: "Vợt nhẹ, dễ điều khiển, phù hợp người mới chơi nâng cao." },
];

export const CUSTOMERS = [
  { id: "C01", name: "Nguyễn Văn An", phone: "0901234567", email: "an.nguyen@gmail.com", joined: "12/01/2024", totalSpent: 12540000, avatar: "https://i.pravatar.cc/150?u=c01" },
  { id: "C02", name: "Trần Thị Bích", phone: "0912345678", email: "bich.tran@yahoo.com", joined: "05/03/2024", totalSpent: 8920000, avatar: "https://i.pravatar.cc/150?u=c02" },
  { id: "C03", name: "Lê Hoàng Cường", phone: "0923456789", email: "cuong.le@outlook.com", joined: "20/11/2023", totalSpent: 24680000, avatar: "https://i.pravatar.cc/150?u=c03" },
  { id: "C04", name: "Phạm Minh Đức", phone: "0934567890", email: "duc.pham@gmail.com", joined: "08/06/2025", totalSpent: 4590000, avatar: "https://i.pravatar.cc/150?u=c04" },
  { id: "C05", name: "Hoàng Thị Lan", phone: "0945678901", email: "lan.hoang@gmail.com", joined: "15/06/2023", totalSpent: 15320000, avatar: "https://i.pravatar.cc/150?u=c05" },
  { id: "C06", name: "Vũ Đức Thành", phone: "0956789012", email: "thanh.vu@gmail.com", joined: "22/09/2023", totalSpent: 18750000, avatar: "https://i.pravatar.cc/150?u=c06" },
  { id: "C07", name: "Đỗ Minh Tuấn", phone: "0967890123", email: "tuan.do@icloud.com", joined: "01/05/2026", totalSpent: 3290000, avatar: "https://i.pravatar.cc/150?u=c07" },
  { id: "C08", name: "Bùi Thị Mai", phone: "0978901234", email: "mai.bui@gmail.com", joined: "30/12/2025", totalSpent: 5640000, avatar: "https://i.pravatar.cc/150?u=c08" },
  { id: "C09", name: "Ngô Quốc Huy", phone: "0989012345", email: "huy.ngo@gmail.com", joined: "14/02/2024", totalSpent: 22100000, avatar: "https://i.pravatar.cc/150?u=c09" },
  { id: "C10", name: "Dương Thị Hà", phone: "0990123456", email: "ha.duong@gmail.com", joined: "03/08/2024", totalSpent: 9780000, avatar: "https://i.pravatar.cc/150?u=c10" },
  { id: "C11", name: "Trịnh Văn Phúc", phone: "0901122334", email: "phuc.trinh@gmail.com", joined: "19/04/2025", totalSpent: 7120000, avatar: "https://i.pravatar.cc/150?u=c11" },
];

export const ORDERS = [
  { id: "HD-001", customerId: "C01", productId: "P01", quantity: 1, total: 4590000, date: "18/05/2026", paymentStatus: "paid", orderStatus: "delivered" },
  { id: "HD-002", customerId: "C02", productId: "P04", quantity: 1, total: 2890000, date: "18/05/2026", paymentStatus: "paid", orderStatus: "shipping" },
  { id: "HD-003", customerId: "C03", productId: "P01", quantity: 1, total: 4590000, date: "17/05/2026", paymentStatus: "paid", orderStatus: "delivered" },
  { id: "HD-004", customerId: "C03", productId: "P09", quantity: 1, total: 1250000, date: "17/05/2026", paymentStatus: "paid", orderStatus: "delivered" },
  { id: "HD-005", customerId: "C04", productId: "P01", quantity: 1, total: 4590000, date: "17/05/2026", paymentStatus: "pending", orderStatus: "processing" },
  { id: "HD-006", customerId: "C05", productId: "P05", quantity: 2, total: 1780000, date: "16/05/2026", paymentStatus: "paid", orderStatus: "delivered" },
  { id: "HD-007", customerId: "C06", productId: "P02", quantity: 1, total: 3890000, date: "16/05/2026", paymentStatus: "paid", orderStatus: "shipping" },
  { id: "HD-008", customerId: "C07", productId: "P12", quantity: 1, total: 3290000, date: "15/05/2026", paymentStatus: "failed", orderStatus: "cancelled" },
  { id: "HD-009", customerId: "C08", productId: "P07", quantity: 5, total: 600000, date: "15/05/2026", paymentStatus: "paid", orderStatus: "delivered" },
  { id: "HD-010", customerId: "C09", productId: "P03", quantity: 1, total: 3490000, date: "14/05/2026", paymentStatus: "paid", orderStatus: "delivered" },
  { id: "HD-011", customerId: "C09", productId: "P11", quantity: 2, total: 1780000, date: "14/05/2026", paymentStatus: "paid", orderStatus: "delivered" },
  { id: "HD-012", customerId: "C10", productId: "P06", quantity: 3, total: 2250000, date: "13/05/2026", paymentStatus: "paid", orderStatus: "delivered" },
];

export const MONTHLY_REVENUE = [
  { m: "T1", v: 185 }, { m: "T2", v: 210 }, { m: "T3", v: 198 }, { m: "T4", v: 245 },
  { m: "T5", v: 268 }, { m: "T6", v: 312 }, { m: "T7", v: 289 }, { m: "T8", v: 335 },
  { m: "T9", v: 298 }, { m: "T10", v: 356 }, { m: "T11", v: 378 }, { m: "T12", v: 429 },
];

export const NOTIFICATIONS = [
  { id: 1, text: "Đơn HD-001 đã giao thành công", time: "5 phút", read: false },
  { id: 2, text: "Sản phẩm P10 hết hàng", time: "20 phút", read: false },
  { id: 3, text: "Khách C07 thanh toán thất bại", time: "1 giờ", read: false },
  { id: 4, text: "Doanh thu tháng 5 tăng 12%", time: "3 giờ", read: true },
];

export const STATS = {
  revenue: 2847500000,
  orders: ORDERS.length + 3835,
  customers: CUSTOMERS.length + 12829,
  products: PRODUCTS.length + 144,
  revenueGrowth: 12.4,
  ordersGrowth: 8.2,
  customersGrowth: 15.7,
  productsGrowth: 3.1,
};

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getCustomer(id) {
  return CUSTOMERS.find((c) => c.id === id);
}

export function enrichOrder(order) {
  const customer = getCustomer(order.customerId);
  const product = getProduct(order.productId);
  return { ...order, customer, product };
}

export function formatCurrency(n) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export function formatNumber(n) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

export const STOCK_LABEL = {
  in_stock: { label: "Còn hàng", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
  low_stock: { label: "Sắp hết", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  out_of_stock: { label: "Hết hàng", cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
};

export const PAYMENT_LABEL = {
  paid: { label: "Đã thanh toán", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
  pending: { label: "Chờ TT", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  failed: { label: "Thất bại", cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
};

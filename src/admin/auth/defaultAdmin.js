/** Tài khoản demo — production: thay bằng API thật */

export const DEMO_CREDENTIALS = {
  email: "admin@triplet.vn",
  password: "admin123",
};

export const DEFAULT_PROFILE = {
  id: "admin-001",
  fullName: "Nguyễn Văn TripleT",
  email: "admin@triplet.vn",
  phone: "0909888777",
  role: "Super Admin",
  department: "Quản trị hệ thống",
  joined: "15/01/2024",
  status: "online",
  avatar: "https://i.pravatar.cc/150?u=admin-triplet",
  bio: "Quản trị viên cửa hàng cầu lông TripleT — chịu trách nhiệm vận hành dashboard.",
};

export const RECENT_ACTIVITY = [
  { id: 1, action: "Đăng nhập hệ thống", time: "Vừa xong" },
  { id: 2, action: "Cập nhật sản phẩm Yonex Astrox 99", time: "2 giờ trước" },
  { id: 3, action: "Duyệt đơn hàng HD-3847", time: "5 giờ trước" },
  { id: 4, action: "Thêm khách hàng mới", time: "Hôm qua" },
];

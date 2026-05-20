/** Cài đặt mặc định — TripleT Badminton Admin */

export const DEFAULT_SETTINGS = {
  general: {
    siteName: "TripleT",
    tagline: "Badminton Store",
    logo: "",
    favicon: "",
    adminEmail: "admin@triplet.vn",
    phone: "1900 6868",
    address: "123 Đường Cầu Lông, Quận 1, TP. Hồ Chí Minh",
    hours: "8:00 – 22:00 (Thứ 2 – Chủ nhật)",
    description: "Cửa hàng cầu lông chuyên nghiệp — vợt, giày, phụ kiện chính hãng Yonex, Victor, Lining.",
  },
  theme: {
    primaryColor: "emerald",
    fontFamily: "inter",
    sidebarCollapsed: false,
  },
  notifications: {
    emailEnabled: true,
    popupEnabled: true,
    orderNew: true,
    customerNew: true,
    revenueAlerts: true,
  },
  security: {
    twoFactorEnabled: false,
    autoLogoutMinutes: 30,
    confirmSensitiveChanges: true,
  },
  store: {
    currency: "VND",
    dateFormat: "dd/MM/yyyy",
    vatPercent: 10,
    storeOpen: true,
    defaultShippingFee: 30000,
  },
  preferences: {
    autosave: true,
    autosaveDelayMs: 2000,
  },
};

export const PRIMARY_COLORS = [
  { id: "emerald", label: "Emerald", hex: "#10b981" },
  { id: "blue", label: "Blue", hex: "#3b82f6" },
  { id: "violet", label: "Violet", hex: "#8b5cf6" },
  { id: "orange", label: "Orange", hex: "#f97316" },
  { id: "rose", label: "Rose", hex: "#f43f5e" },
];

export const FONT_OPTIONS = [
  { id: "inter", label: "Inter", family: "Inter, system-ui, sans-serif" },
  { id: "system", label: "System UI", family: "system-ui, -apple-system, sans-serif" },
  { id: "roboto", label: "Roboto", family: "'Roboto', system-ui, sans-serif" },
];

export const SETTINGS_TABS = [
  { id: "general", label: "Chung", icon: "Globe" },
  { id: "account", label: "Tài khoản", icon: "User" },
  { id: "theme", label: "Giao diện", icon: "Palette" },
  { id: "notifications", label: "Thông báo", icon: "Bell" },
  { id: "security", label: "Bảo mật", icon: "Shield" },
  { id: "store", label: "Cửa hàng", icon: "Store" },
  { id: "advanced", label: "Nâng cao", icon: "Wrench" },
];

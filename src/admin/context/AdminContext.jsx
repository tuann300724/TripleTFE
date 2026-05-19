import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { NOTIFICATIONS, PRODUCTS, CUSTOMERS, ORDERS } from "../data/mockData";

const AdminContext = createContext(null);

export const MENU = {
  overview: "Dashboard",
  products: "Products",
  customers: "Customers",
  orders: "Orders",
  invoices: "Invoices",
  analytics: "Analytics",
  profile: "Hồ sơ",
  settings: "Settings",
};

export function AdminProvider({ children }) {
  const [page, setPage] = useState("overview");
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("triplet-dark") || "true"); } catch { return true; }
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("triplet-dark", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const withLoading = useCallback((fn, ms = 400) => {
    setLoading(true);
    setTimeout(() => { fn?.(); setLoading(false); }, ms);
  }, []);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const unread = notifications.filter((n) => !n.read).length;

  const openModal = (type, data) => setModal({ type, data });
  const closeModal = () => setModal(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return {
      products: PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
      customers: CUSTOMERS.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)),
      orders: ORDERS.filter((o) => o.id.toLowerCase().includes(q)),
    };
  }, [search]);

  return (
    <AdminContext.Provider
      value={{
        page, setPage, darkMode, setDarkMode, search, setSearch, searchResults,
        loading, withLoading, notifOpen, setNotifOpen, notifications, markAllRead, unread,
        modal, openModal, closeModal, toast, showToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin trong AdminProvider");
  return ctx;
}

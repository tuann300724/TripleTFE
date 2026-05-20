import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  NOTIFICATIONS,
  PRODUCTS as INIT_PRODUCTS,
  CUSTOMERS as INIT_CUSTOMERS,
  ORDERS as INIT_ORDERS,
  computeStockStatus,
  enrichOrder,
} from "../data/mockData";
import { nextId } from "../utils/generateId";

const AdminContext = createContext(null);
const DATA_KEY = "triplet-admin-data";

function loadPersistedData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.products?.length && parsed.customers?.length && parsed.orders) {
        return parsed;
      }
    }
  } catch { /* ignore */ }
  return {
    products: INIT_PRODUCTS,
    customers: INIT_CUSTOMERS,
    orders: INIT_ORDERS,
  };
}

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

  const [products, setProducts] = useState(() => loadPersistedData().products);
  const [customers, setCustomers] = useState(() => loadPersistedData().customers);
  const [orders, setOrders] = useState(() => loadPersistedData().orders);

  const [crudModal, setCrudModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify({ products, customers, orders }));
  }, [products, customers, orders]);

  useEffect(() => {
    localStorage.setItem("triplet-dark", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const withLoading = useCallback((fn, ms = 450) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const result = fn?.();
          resolve(result);
        } finally {
          setLoading(false);
        }
      }, ms);
    });
  }, []);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const unread = notifications.filter((n) => !n.read).length;

  const openModal = (type, data) => setModal({ type, data });
  const closeModal = () => setModal(null);

  const openCrud = (entity, mode, data = null) => setCrudModal({ entity, mode, data });
  const closeCrud = () => setCrudModal(null);

  const openDelete = (entity, item) => setDeleteTarget({ entity, item });
  const closeDelete = () => setDeleteTarget(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return {
      products: products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
      customers: customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)),
      orders: orders.filter((o) => o.id.toLowerCase().includes(q)),
    };
  }, [search, products, customers, orders]);

  const enrichOrders = useCallback(
    (list = orders) => list.map((o) => enrichOrder(o, customers, products)),
    [orders, customers, products]
  );

  /* ——— Products CRUD ——— */
  const createProduct = useCallback(async (payload) => {
    await withLoading(() => {
      const stock = Number(payload.stock);
      const item = {
        id: nextId(products, "P"),
        name: payload.name.trim(),
        category: payload.category,
        price: Number(payload.price),
        stock,
        status: payload.status || computeStockStatus(stock),
        image: payload.image || "https://images.unsplash.com/photo-1626224583764-f87db7ef7350?w=400&h=400&fit=crop",
        description: payload.description?.trim() || "",
      };
      setProducts((prev) => [item, ...prev]);
      showToast("Đã thêm sản phẩm mới");
      closeCrud();
    });
  }, [products, withLoading, showToast]);

  const updateProduct = useCallback(async (id, payload) => {
    await withLoading(() => {
      const stock = Number(payload.stock);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                name: payload.name.trim(),
                category: payload.category,
                price: Number(payload.price),
                stock,
                status: payload.status || computeStockStatus(stock),
                image: payload.image || p.image,
                description: payload.description?.trim() || "",
              }
            : p
        )
      );
      showToast("Đã cập nhật sản phẩm");
      closeCrud();
    });
  }, [withLoading, showToast]);

  const deleteProduct = useCallback(async (id) => {
    const linked = orders.some((o) => o.productId === id);
    if (linked) {
      showToast("Không thể xóa — sản phẩm đang có trong đơn hàng", "error");
      closeDelete();
      return;
    }
    await withLoading(() => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Đã xóa sản phẩm");
      closeDelete();
    });
  }, [orders, withLoading, showToast]);

  /* ——— Customers CRUD ——— */
  const createCustomer = useCallback(async (payload) => {
    await withLoading(() => {
      const item = {
        id: nextId(customers, "C"),
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        joined: payload.joined || new Date().toLocaleDateString("vi-VN"),
        totalSpent: Number(payload.totalSpent) || 0,
        avatar: payload.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
      };
      setCustomers((prev) => [item, ...prev]);
      showToast("Đã thêm khách hàng");
      closeCrud();
    });
  }, [customers, withLoading, showToast]);

  const updateCustomer = useCallback(async (id, payload) => {
    await withLoading(() => {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                name: payload.name.trim(),
                phone: payload.phone.trim(),
                email: payload.email.trim(),
                joined: payload.joined || c.joined,
                totalSpent: Number(payload.totalSpent) ?? c.totalSpent,
                avatar: payload.avatar || c.avatar,
              }
            : c
        )
      );
      showToast("Đã cập nhật khách hàng");
      closeCrud();
    });
  }, [withLoading, showToast]);

  const deleteCustomer = useCallback(async (id) => {
    const linked = orders.some((o) => o.customerId === id);
    if (linked) {
      showToast("Không thể xóa — khách hàng có đơn hàng liên kết", "error");
      closeDelete();
      return;
    }
    await withLoading(() => {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast("Đã xóa khách hàng");
      closeDelete();
    });
  }, [orders, withLoading, showToast]);

  /* ——— Orders CRUD ——— */
  const createOrder = useCallback(async (payload) => {
    await withLoading(() => {
      const product = products.find((p) => p.id === payload.productId);
      const qty = Number(payload.quantity) || 1;
      const total = product ? product.price * qty : Number(payload.total);
      const item = {
        id: nextId(orders, "HD"),
        customerId: payload.customerId,
        productId: payload.productId,
        quantity: qty,
        total,
        date: payload.date || new Date().toLocaleDateString("vi-VN"),
        paymentStatus: payload.paymentStatus,
        orderStatus: payload.orderStatus,
      };
      setOrders((prev) => [item, ...prev]);
      if (product) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== product.id) return p;
            const stock = Math.max(0, p.stock - qty);
            return { ...p, stock, status: computeStockStatus(stock) };
          })
        );
      }
      const cust = customers.find((c) => c.id === payload.customerId);
      if (cust) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === cust.id ? { ...c, totalSpent: c.totalSpent + total } : c))
        );
      }
      showToast("Đã tạo đơn hàng / hóa đơn");
      closeCrud();
    });
  }, [orders, products, customers, withLoading, showToast]);

  const updateOrder = useCallback(async (id, payload) => {
    await withLoading(() => {
      const old = orders.find((o) => o.id === id);
      const product = products.find((p) => p.id === payload.productId);
      const qty = Number(payload.quantity) || 1;
      const total = product ? product.price * qty : Number(payload.total);

      if (old && old.productId === payload.productId) {
        const diff = qty - old.quantity;
        if (diff !== 0) {
          setProducts((prev) =>
            prev.map((p) => {
              if (p.id !== old.productId) return p;
              const stock = Math.max(0, p.stock - diff);
              return { ...p, stock, status: computeStockStatus(stock) };
            })
          );
        }
        const spentDiff = total - old.total;
        if (spentDiff !== 0) {
          setCustomers((prev) =>
            prev.map((c) =>
              c.id === old.customerId ? { ...c, totalSpent: Math.max(0, c.totalSpent + spentDiff) } : c
            )
          );
        }
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                customerId: payload.customerId,
                productId: payload.productId,
                quantity: qty,
                total,
                date: payload.date || o.date,
                paymentStatus: payload.paymentStatus,
                orderStatus: payload.orderStatus,
              }
            : o
        )
      );
      showToast("Đã cập nhật đơn hàng");
      closeCrud();
    });
  }, [orders, products, withLoading, showToast]);

  const deleteOrder = useCallback(async (id) => {
    await withLoading(() => {
      const order = orders.find((o) => o.id === id);
      if (order) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== order.productId) return p;
            const stock = p.stock + order.quantity;
            return { ...p, stock, status: computeStockStatus(stock) };
          })
        );
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === order.customerId
              ? { ...c, totalSpent: Math.max(0, c.totalSpent - order.total) }
              : c
          )
        );
      }
      setOrders((prev) => prev.filter((o) => o.id !== id));
      showToast("Đã xóa đơn hàng / hóa đơn");
      closeDelete();
    });
  }, [orders, withLoading, showToast]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const { entity, item } = deleteTarget;
    if (entity === "product") await deleteProduct(item.id);
    else if (entity === "customer") await deleteCustomer(item.id);
    else if (entity === "order") await deleteOrder(item.id);
  }, [deleteTarget, deleteProduct, deleteCustomer, deleteOrder]);

  const resetDashboardData = useCallback(() => {
    setProducts(INIT_PRODUCTS);
    setCustomers(INIT_CUSTOMERS);
    setOrders(INIT_ORDERS);
  }, []);

  const exportDashboardData = useCallback(() => ({
    products,
    customers,
    orders,
    exportedAt: new Date().toISOString(),
    version: 1,
  }), [products, customers, orders]);

  const importDashboardData = useCallback((data) => {
    if (data.products?.length) setProducts(data.products);
    if (data.customers?.length) setCustomers(data.customers);
    if (data.orders) setOrders(data.orders);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        page, setPage, darkMode, setDarkMode, search, setSearch, searchResults,
        loading, withLoading, notifOpen, setNotifOpen, notifications, markAllRead, unread,
        modal, openModal, closeModal, toast, showToast,
        products, customers, orders, enrichOrders,
        crudModal, openCrud, closeCrud,
        deleteTarget, openDelete, closeDelete, handleDeleteConfirm,
        createProduct, updateProduct, deleteProduct,
        createCustomer, updateCustomer, deleteCustomer,
        createOrder, updateOrder, deleteOrder,
        resetDashboardData, exportDashboardData, importDashboardData,
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

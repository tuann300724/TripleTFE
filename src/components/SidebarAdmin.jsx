import { NavLink } from "react-router-dom";

export default function SidebarAdmin() {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white fixed left-0 top-0">

      {/* Logo */}
      <div className="p-5 text-xl font-bold border-b border-blue-700">
        ADMIN
      </div>

      {/* Menu */}
      <nav className="mt-5 flex flex-col gap-1">

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "px-5 py-3 bg-blue-700 flex items-center gap-3"
              : "px-5 py-3 hover:bg-blue-800 flex items-center gap-3"
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "px-5 py-3 bg-blue-700 flex items-center gap-3"
              : "px-5 py-3 hover:bg-blue-800 flex items-center gap-3"
          }
        >
          👤 Users
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "px-5 py-3 bg-blue-700 flex items-center gap-3"
              : "px-5 py-3 hover:bg-blue-800 flex items-center gap-3"
          }
        >
          📦 Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "px-5 py-3 bg-blue-700 flex items-center gap-3"
              : "px-5 py-3 hover:bg-blue-800 flex items-center gap-3"
          }
        >
          🧾 Orders
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            isActive
              ? "px-5 py-3 bg-blue-700 flex items-center gap-3"
              : "px-5 py-3 hover:bg-blue-800 flex items-center gap-3"
          }
        >
          ⚙️ Settings
        </NavLink>

      </nav>
    </div>
  );
}
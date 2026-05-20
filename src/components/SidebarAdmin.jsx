import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Feather,
} from "lucide-react";
import { useAdmin, MENU } from "../admin/context/AdminContext";
import { useSettings } from "../admin/context/SettingsContext";

const NAV = [
  { id: "overview", icon: LayoutDashboard },
  { id: "products", icon: Package },
  { id: "customers", icon: Users },
  { id: "orders", icon: ShoppingCart },
  { id: "invoices", icon: FileText },
  { id: "analytics", icon: BarChart3 },
  { id: "settings", icon: Settings },
];

export default function SidebarAdmin() {
  const { page, setPage } = useAdmin();
  const { draft } = useSettings();
  const collapsed = draft.theme?.sidebarCollapsed;
  const general = draft.general;

  return (
    <aside
      className={`shrink-0 bg-slate-900 text-white flex flex-col min-h-[calc(100vh-56px)] border-r border-slate-800 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <header className={`flex items-center gap-3 border-b border-slate-800 ${collapsed ? "justify-center px-2 py-4" : "px-4 py-5"}`}>
        {general.logo ? (
          <img src={general.logo} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
        ) : (
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 admin-brand-gradient">
            <Feather size={20} />
          </span>
        )}
        {!collapsed && (
          <section className="min-w-0">
            <h2 className="text-lg font-bold leading-tight truncate">{general.siteName || "TripleT"}</h2>
            <p className="text-[11px] text-slate-400 truncate">{general.tagline || "Badminton Store"}</p>
          </section>
        )}
      </header>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto admin-scroll">
        {!collapsed && (
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Menu</p>
        )}
        {NAV.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            title={collapsed ? MENU[id] : undefined}
            onClick={() => setPage(id)}
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
            } ${
              page === id
                ? "admin-nav-active text-white shadow-md"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={18} strokeWidth={2} />
            {!collapsed && MENU[id]}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <footer className="p-4 border-t border-slate-800 text-xs text-slate-500">
          © 2026 {general.siteName || "TripleT"} Admin
        </footer>
      )}
    </aside>
  );
}

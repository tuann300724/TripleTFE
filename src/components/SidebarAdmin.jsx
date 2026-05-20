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

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-white flex flex-col min-h-[calc(100vh-56px)] border-r border-slate-800">
      <header className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Feather size={20} />
        </span>
        <section>
          <h2 className="text-lg font-bold leading-tight">TripleT</h2>
          <p className="text-[11px] text-slate-400">Badminton Store</p>
        </section>
      </header>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto admin-scroll">
        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Menu</p>
        {NAV.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPage(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              page === id
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={18} strokeWidth={2} />
            {MENU[id]}
          </button>
        ))}
      </nav>

      <footer className="p-4 border-t border-slate-800 text-xs text-slate-500">
        © 2026 TripleT Admin
      </footer>
    </aside>
  );
}

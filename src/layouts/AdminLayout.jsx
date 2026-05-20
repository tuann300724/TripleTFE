import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* Header full width */}
      <div className="w-full">
        <HeaderAdmin />
      </div>

      {/* Body */}
      <div className="flex">

        {/* Sidebar */}
        <div className="w-64">
          <SidebarAdmin />
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
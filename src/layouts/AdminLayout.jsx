import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import { AdminProvider } from "../admin/context/AdminContext";
import { SettingsProvider } from "../admin/context/SettingsContext";
import DetailModal from "../admin/components/DetailModal";
import CrudModalManager from "../admin/components/modals/CrudModalManager";
import ConfirmDialog from "../admin/components/ConfirmDialog";
import LoadingOverlay from "../admin/components/LoadingOverlay";
import Toast from "../admin/components/Toast";
import "../admin/admin.css";

export default function AdminLayout() {
  return (
    <AdminProvider>
      <SettingsProvider>
        <section className="admin-wrap min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <HeaderAdmin />
          <section className="flex flex-1 overflow-hidden">
            <SidebarAdmin />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto admin-scroll">
              <Outlet />
            </main>
          </section>
          <DetailModal />
          <CrudModalManager />
          <ConfirmDialog />
          <LoadingOverlay />
          <Toast />
        </section>
      </SettingsProvider>
    </AdminProvider>
  );
}

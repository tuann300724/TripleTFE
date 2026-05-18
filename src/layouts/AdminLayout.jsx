import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <HeaderAdmin />
            <div className="flex flex-1">
                <SidebarAdmin />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
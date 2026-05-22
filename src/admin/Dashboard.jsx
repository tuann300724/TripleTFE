import { LayoutDashboard } from "lucide-react";
import { AdminChart, AdminPageActions, AdminPageHero, AdminStatGrid, AdminTable } from "./components";

const message = "Chức năng quản lý người dùng sẽ được phát triển trong tương lai.";

export default function Dashboard() {
    return (
        <div className="space-y-6 animate-[fadeUp_0.5s_ease-out]">
            <AdminPageHero
                title="Dashboard"
                subtitle="Tổng quan cửa hàng cầu lông TripleT"
                icon={LayoutDashboard}
                actions={<AdminPageActions />}
            />
            <AdminStatGrid />
            <AdminChart />
            <AdminTable
                title="Hoạt động gần đây"
                columns={["Mục", "Mô tả", "Thời gian", "Trạng thái"]}
                message={message}
                colSpan={4}
                footer={null}
            />
        </div>
    );
}

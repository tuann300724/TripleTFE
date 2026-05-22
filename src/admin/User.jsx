import { Users } from "lucide-react";
import { AdminPageActions, AdminPageBody, AdminPageHero } from "./components";

const message = "Chức năng quản lý người dùng sẽ được phát triển trong tương lai.";

export default function User() {
    return (
        <>
            <AdminPageHero
                title="Quản lý người dùng"
                subtitle="Tài khoản và quyền truy cập"
                icon={Users}
                actions={<AdminPageActions />}
            />
            <AdminPageBody
                message={message}
                columns={["Người dùng", "Email", "Vai trò", "Thao tác"]}
                searchPlaceholder="Tìm theo tên, email..."
                tableTitle="Danh sách người dùng"
            />
        </>
    );
}

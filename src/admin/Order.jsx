import { ClipboardList } from "lucide-react";
import { AdminPageActions, AdminPageBody, AdminPageHero } from "./components";

const message = "Chức năng quản lý đơn hàng sẽ được phát triển trong tương lai.";

export default function Order() {
    return (
        <>
            <AdminPageHero
                title="Quản lý đơn hàng"
                subtitle="Theo dõi và xử lý đơn hàng"
                icon={ClipboardList}
                actions={<AdminPageActions />}
            />
            <AdminPageBody
                message={message}
                columns={["Mã đơn", "Khách hàng", "Tổng tiền", "Trạng thái", "Thao tác"]}
                searchPlaceholder="Tìm mã đơn..."
                tableTitle="Danh sách đơn hàng"
            />
        </>
    );
}

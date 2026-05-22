import { CreditCard } from "lucide-react";
import { AdminPageActions, AdminPageBody, AdminPageHero } from "./components";

const message = "Chức năng quản lý thanh toán sẽ được phát triển trong tương lai.";

export default function Payment() {
    return (
        <>
            <AdminPageHero
                title="Quản lý thanh toán"
                subtitle="Giao dịch và phương thức thanh toán"
                icon={CreditCard}
                actions={<AdminPageActions />}
            />
            <AdminPageBody
                message={message}
                columns={["Mã GD", "Phương thức", "Số tiền", "Trạng thái", "Thao tác"]}
                searchPlaceholder="Tìm mã giao dịch..."
                tableTitle="Lịch sử thanh toán"
            />
        </>
    );
}

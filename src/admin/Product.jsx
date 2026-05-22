import { Package } from "lucide-react";
import { AdminPageActions, AdminPageBody, AdminPageHero } from "./components";

const message = "Chức năng quản lý sản phẩm sẽ được phát triển trong tương lai.";

export default function Product() {
    return (
        <>
            <AdminPageHero
                title="Quản lý sản phẩm"
                subtitle="Vợt, giày, phụ kiện cầu lông"
                icon={Package}
                actions={<AdminPageActions />}
            />
            <AdminPageBody
                message={message}
                columns={["Sản phẩm", "Giá", "Tồn kho", "Thao tác"]}
                searchPlaceholder="Tìm tên sản phẩm..."
                tableTitle="Danh sách sản phẩm"
            />
        </>
    );
}

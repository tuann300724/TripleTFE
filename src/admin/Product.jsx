import { Package, Plus } from "lucide-react";
import AdminBtn from "./components/AdminBtn";
import { AdminPageActions, AdminPageBody, AdminPageHero } from "./components";

const message = "Chức năng quản lý sản phẩm sẽ được phát triển trong tương lai.";

export default function Product() {
    return (
        <>
            <AdminPageHero
                title="Quản lý sản phẩm"
                subtitle="Vợt, giày, phụ kiện cầu lông"
                icon={Package}
                actions={
                    <>
                        <AdminBtn variant="ghost">Lọc</AdminBtn>
                        <AdminBtn variant="primary" icon={Plus} to="/admin/products/new">
                            Thêm sản phẩm
                        </AdminBtn>
                    </>
                }
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

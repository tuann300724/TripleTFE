import { FolderTree } from "lucide-react";
import { AdminPageActions, AdminPageBody, AdminPageHero } from "./components";

const message = "Chức năng quản lý danh mục sẽ được phát triển trong tương lai.";

export default function Category() {
    return (
        <>
            <AdminPageHero
                title="Quản lý danh mục"
                subtitle="Phân loại sản phẩm TripleT"
                icon={FolderTree}
                actions={<AdminPageActions />}
            />
            <AdminPageBody
                message={message}
                columns={["Tên danh mục", "Slug", "Số SP", "Thao tác"]}
                searchPlaceholder="Tìm danh mục..."
                tableTitle="Danh sách danh mục"
            />
        </>
    );
}

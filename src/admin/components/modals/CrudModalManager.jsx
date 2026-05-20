import Modal from "../Modal";
import { useAdmin } from "../../context/AdminContext";
import ProductForm from "../forms/ProductForm";
import CustomerForm from "../forms/CustomerForm";
import OrderForm from "../forms/OrderForm";

export default function CrudModalManager() {
  const {
    crudModal,
    closeCrud,
    loading,
    createProduct,
    updateProduct,
    createCustomer,
    updateCustomer,
    createOrder,
    updateOrder,
    customers,
    products,
  } = useAdmin();

  if (!crudModal) return null;

  const { entity, mode, data } = crudModal;
  const isEdit = mode === "edit";
  const submitting = loading;

  const titles = {
    product: isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới",
    customer: isEdit ? "Chỉnh sửa khách hàng" : "Thêm khách hàng",
    order: isEdit ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng / hóa đơn",
  };

  return (
    <Modal open wide title={titles[entity]} onClose={closeCrud}>
      {entity === "product" && (
        <ProductForm
          key={data?.id || "new-product"}
          initial={isEdit ? data : undefined}
          submitting={submitting}
          onSubmit={(payload) =>
            isEdit ? updateProduct(data.id, payload) : createProduct(payload)
          }
        />
      )}
      {entity === "customer" && (
        <CustomerForm
          key={data?.id || "new-customer"}
          initial={isEdit ? data : undefined}
          submitting={submitting}
          onSubmit={(payload) =>
            isEdit ? updateCustomer(data.id, payload) : createCustomer(payload)
          }
        />
      )}
      {entity === "order" && (
        <OrderForm
          key={data?.id || "new-order"}
          initial={isEdit ? data : undefined}
          customers={customers}
          products={products}
          isEdit={isEdit}
          submitting={submitting}
          onSubmit={(payload) =>
            isEdit ? updateOrder(data.id, payload) : createOrder(payload)
          }
        />
      )}
    </Modal>
  );
}

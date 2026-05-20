import { useMemo, useState } from "react";
import FormField, { inputCls, selectCls } from "./FormField";
import { formatCurrency } from "../../data/mockData";
import ProductImage from "../products/ProductImage";

const EMPTY = {
  customerId: "",
  productId: "",
  quantity: "1",
  date: "",
  paymentStatus: "paid",
  orderStatus: "processing",
};

function validate(values, products, isEdit, initialQty = 0) {
  const errors = {};
  if (!values.customerId) errors.customerId = "Chọn khách hàng";
  if (!values.productId) errors.productId = "Chọn sản phẩm";
  const qty = Number(values.quantity);
  if (!qty || qty < 1) errors.quantity = "Số lượng tối thiểu là 1";
  const product = products.find((p) => p.id === values.productId);
  const available = product ? product.stock + (isEdit ? Number(initialQty) || 0 : 0) : 0;
  if (product && qty > available) errors.quantity = `Chỉ còn ${available} trong kho`;
  return errors;
}

export default function OrderForm({ initial, customers, products, onSubmit, submitting, isEdit }) {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    customerId: initial?.customerId || customers[0]?.id || "",
    productId: initial?.productId || products[0]?.id || "",
    quantity: initial?.quantity ?? "1",
    date: initial?.date || "",
    paymentStatus: initial?.paymentStatus || "paid",
    orderStatus: initial?.orderStatus || "processing",
  }));
  const [errors, setErrors] = useState({});
  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const selectedProduct = products.find((p) => p.id === values.productId);
  const previewTotal = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.price * (Number(values.quantity) || 1);
  }, [selectedProduct, values.quantity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values, products, isEdit, initial?.quantity);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ ...values, total: previewTotal });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Khách hàng" required error={errors.customerId}>
        <select className={selectCls} value={values.customerId} onChange={(e) => set("customerId", e.target.value)}>
          <option value="">— Chọn khách —</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
          ))}
        </select>
      </FormField>

      <FormField label="Sản phẩm" required error={errors.productId}>
        <select className={selectCls} value={values.productId} onChange={(e) => set("productId", e.target.value)}>
          <option value="">— Chọn sản phẩm —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id} disabled={!isEdit && p.stock <= 0}>
              {p.name} — {formatCurrency(p.price)} (kho: {p.stock})
            </option>
          ))}
        </select>
      </FormField>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Số lượng" required error={errors.quantity}>
          <input type="number" min="1" className={inputCls} value={values.quantity} onChange={(e) => set("quantity", e.target.value)} />
        </FormField>
        <FormField label="Ngày đặt">
          <input className={inputCls} value={values.date} onChange={(e) => set("date", e.target.value)} placeholder="dd/mm/yyyy" />
        </FormField>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Thanh toán" required>
          <select className={selectCls} value={values.paymentStatus} onChange={(e) => set("paymentStatus", e.target.value)}>
            <option value="paid">Đã thanh toán</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="failed">Thất bại</option>
          </select>
        </FormField>
        <FormField label="Trạng thái đơn" required>
          <select className={selectCls} value={values.orderStatus} onChange={(e) => set("orderStatus", e.target.value)}>
            <option value="processing">Xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </FormField>
      </section>

      {selectedProduct && (
        <article className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40 p-3 flex items-center gap-3">
          <ProductImage
            src={selectedProduct.image}
            productId={selectedProduct.id}
            alt={selectedProduct.name}
            className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
          />
          <section>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedProduct.name}</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(previewTotal)}</p>
          </section>
        </article>
      )}

      <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2">
        {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full anim-spin" />}
        {submitting ? "Đang lưu..." : isEdit ? "Cập nhật đơn hàng" : "Tạo đơn hàng"}
      </button>
    </form>
  );
}

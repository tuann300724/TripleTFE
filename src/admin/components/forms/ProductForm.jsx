import { useState } from "react";
import FormField, { inputCls, selectCls } from "./FormField";
import ImageUploadField from "./ImageUploadField";
import { PRODUCT_CATEGORIES, STOCK_LABEL } from "../../data/mockData";

const EMPTY = {
  name: "",
  category: PRODUCT_CATEGORIES[0],
  price: "",
  stock: "",
  description: "",
  status: "in_stock",
  image: "",
};

function validate(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = "Vui lòng nhập tên sản phẩm";
  if (!values.category) errors.category = "Chọn danh mục";
  if (!values.price || Number(values.price) <= 0) errors.price = "Giá phải lớn hơn 0";
  if (values.stock === "" || Number(values.stock) < 0) errors.stock = "Số lượng không hợp lệ";
  if (!values.image?.trim()) errors.image = "Thêm hình ảnh hoặc URL";
  return errors;
}

export default function ProductForm({ initial, onSubmit, submitting }) {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    ...initial,
    price: initial?.price ?? "",
    stock: initial?.stock ?? "",
  }));
  const [errors, setErrors] = useState({});

  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUploadField label="Hình ảnh" value={values.image} onChange={(v) => set("image", v)} error={errors.image} />

      <FormField label="Tên sản phẩm" required error={errors.name}>
        <input className={inputCls} value={values.name} onChange={(e) => set("name", e.target.value)} placeholder="Vợt Yonex Astrox 99 Pro" />
      </FormField>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Danh mục" required error={errors.category}>
          <select className={selectCls} value={values.category} onChange={(e) => set("category", e.target.value)}>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Trạng thái kho" required>
          <select className={selectCls} value={values.status} onChange={(e) => set("status", e.target.value)}>
            {Object.entries(STOCK_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </FormField>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Giá (VND)" required error={errors.price}>
          <input type="number" min="0" className={inputCls} value={values.price} onChange={(e) => set("price", e.target.value)} />
        </FormField>
        <FormField label="Số lượng" required error={errors.stock}>
          <input type="number" min="0" className={inputCls} value={values.stock} onChange={(e) => set("stock", e.target.value)} />
        </FormField>
      </section>

      <FormField label="Mô tả">
        <textarea
          rows={3}
          className={inputCls}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Mô tả chi tiết sản phẩm..."
        />
      </FormField>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full anim-spin" />}
        {submitting ? "Đang lưu..." : "Lưu sản phẩm"}
      </button>
    </form>
  );
}

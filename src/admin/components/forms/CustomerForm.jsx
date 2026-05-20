import { useState } from "react";
import FormField, { inputCls } from "./FormField";
import ImageUploadField from "./ImageUploadField";

const EMPTY = { name: "", phone: "", email: "", joined: "", totalSpent: "0", avatar: "" };

function validate(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = "Nhập họ tên";
  if (!values.phone?.trim() || !/^[0-9]{9,11}$/.test(values.phone.replace(/\s/g, ""))) {
    errors.phone = "Số điện thoại không hợp lệ (9–11 số)";
  }
  if (!values.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Email không hợp lệ";
  }
  return errors;
}

export default function CustomerForm({ initial, onSubmit, submitting }) {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    ...initial,
    totalSpent: initial?.totalSpent ?? "0",
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
      <ImageUploadField label="Ảnh đại diện" value={values.avatar} onChange={(v) => set("avatar", v)} />

      <FormField label="Họ tên" required error={errors.name}>
        <input className={inputCls} value={values.name} onChange={(e) => set("name", e.target.value)} placeholder="Nguyễn Văn An" />
      </FormField>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Số điện thoại" required error={errors.phone}>
          <input className={inputCls} value={values.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0901234567" />
        </FormField>
        <FormField label="Email" required error={errors.email}>
          <input type="email" className={inputCls} value={values.email} onChange={(e) => set("email", e.target.value)} />
        </FormField>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Ngày tham gia">
          <input className={inputCls} value={values.joined} onChange={(e) => set("joined", e.target.value)} placeholder="dd/mm/yyyy" />
        </FormField>
        <FormField label="Tổng đã mua (VND)" hint="Tự cập nhật khi có đơn hàng mới">
          <input type="number" min="0" className={inputCls} value={values.totalSpent} onChange={(e) => set("totalSpent", e.target.value)} />
        </FormField>
      </section>

      <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2">
        {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full anim-spin" />}
        {submitting ? "Đang lưu..." : "Lưu khách hàng"}
      </button>
    </form>
  );
}

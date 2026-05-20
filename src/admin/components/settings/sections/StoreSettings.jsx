import { useSettings } from "../../../context/SettingsContext";
import SettingsCard from "../SettingsCard";
import SettingsActions from "../SettingsActions";
import ToggleSwitch from "../ToggleSwitch";
import FormField, { inputCls, selectCls } from "../../forms/FormField";

export default function StoreSettings() {
  const { draft, updateSection, saveSection, resetSection } = useSettings();
  const st = draft.store;

  return (
    <SettingsCard title="Cửa hàng" description="Tiền tệ, thuế và vận hành cửa hàng cầu lông">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Đơn vị tiền tệ">
          <select className={selectCls} value={st.currency} onChange={(e) => updateSection("store", { currency: e.target.value })}>
            <option value="VND">Việt Nam Đồng (₫)</option>
          </select>
        </FormField>
        <FormField label="Định dạng ngày">
          <select className={selectCls} value={st.dateFormat} onChange={(e) => updateSection("store", { dateFormat: e.target.value })}>
            <option value="dd/MM/yyyy">dd/MM/yyyy</option>
            <option value="MM/dd/yyyy">MM/dd/yyyy</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd</option>
          </select>
        </FormField>
        <FormField label="Thuế VAT (%)">
          <input type="number" min="0" max="100" className={inputCls} value={st.vatPercent} onChange={(e) => updateSection("store", { vatPercent: Number(e.target.value) })} />
        </FormField>
        <FormField label="Phí vận chuyển mặc định (₫)">
          <input type="number" min="0" className={inputCls} value={st.defaultShippingFee} onChange={(e) => updateSection("store", { defaultShippingFee: Number(e.target.value) })} />
        </FormField>
      </section>

      <ToggleSwitch
        label="Cửa hàng đang mở"
        description="Tắt để hiển thị trạng thái đóng cửa trên website"
        checked={st.storeOpen}
        onChange={(v) => updateSection("store", { storeOpen: v })}
      />

      <SettingsActions
        onSave={() => saveSection("store", "Lưu cài đặt cửa hàng")}
        onReset={() => resetSection("store")}
      />
    </SettingsCard>
  );
}

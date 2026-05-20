import { useSettings } from "../../../context/SettingsContext";
import SettingsCard from "../SettingsCard";
import SettingsActions from "../SettingsActions";
import ImageSettingField from "../ImageSettingField";
import FormField, { inputCls } from "../../forms/FormField";

export default function GeneralSettings() {
  const { draft, updateSection, saveSection, resetSection } = useSettings();
  const g = draft.general;

  return (
    <SettingsCard
      title="Cài đặt chung"
      description="Thông tin website và cửa hàng hiển thị trên hệ thống"
      footer={
        <SettingsActions
          onSave={() => saveSection("general", "Lưu cài đặt chung")}
          onReset={() => resetSection("general")}
        />
      }
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Tên website" required>
          <input className={inputCls} value={g.siteName} onChange={(e) => updateSection("general", { siteName: e.target.value })} />
        </FormField>
        <FormField label="Tagline">
          <input className={inputCls} value={g.tagline} onChange={(e) => updateSection("general", { tagline: e.target.value })} />
        </FormField>
      </section>

      <ImageSettingField label="Logo website" value={g.logo} onChange={(v) => updateSection("general", { logo: v })} hint="PNG/SVG nền trong, khuyến nghị 200×200px" />
      <ImageSettingField label="Favicon" value={g.favicon} onChange={(v) => updateSection("general", { favicon: v })} hint="ICO hoặc PNG 32×32" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Email quản trị" required>
          <input type="email" className={inputCls} value={g.adminEmail} onChange={(e) => updateSection("general", { adminEmail: e.target.value })} />
        </FormField>
        <FormField label="Số điện thoại">
          <input className={inputCls} value={g.phone} onChange={(e) => updateSection("general", { phone: e.target.value })} />
        </FormField>
      </section>

      <FormField label="Địa chỉ cửa hàng">
        <input className={inputCls} value={g.address} onChange={(e) => updateSection("general", { address: e.target.value })} />
      </FormField>

      <FormField label="Giờ hoạt động">
        <input className={inputCls} value={g.hours} onChange={(e) => updateSection("general", { hours: e.target.value })} placeholder="8:00 – 22:00" />
      </FormField>

      <FormField label="Mô tả website">
        <textarea rows={3} className={inputCls} value={g.description} onChange={(e) => updateSection("general", { description: e.target.value })} />
      </FormField>
    </SettingsCard>
  );
}

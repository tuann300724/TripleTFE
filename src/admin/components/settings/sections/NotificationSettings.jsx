import { useSettings } from "../../../context/SettingsContext";
import SettingsCard from "../SettingsCard";
import SettingsActions from "../SettingsActions";
import ToggleSwitch from "../ToggleSwitch";

export default function NotificationSettings() {
  const { draft, updateSection, saveSection, resetSection } = useSettings();
  const n = draft.notifications;

  const items = [
    { key: "emailEnabled", label: "Email notification", description: "Gửi email khi có sự kiện quan trọng" },
    { key: "popupEnabled", label: "Popup notification", description: "Hiện popup trên dashboard" },
    { key: "orderNew", label: "Đơn hàng mới", description: "Thông báo khi có đơn đặt hàng" },
    { key: "customerNew", label: "Khách hàng mới", description: "Thông báo khi đăng ký khách mới" },
    { key: "revenueAlerts", label: "Doanh thu", description: "Cảnh báo mốc doanh thu / báo cáo" },
  ];

  return (
    <SettingsCard title="Thông báo" description="Kiểm soát kênh và loại thông báo admin">
      <section className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item) => (
          <section key={item.key} className="pt-4 first:pt-0">
            <ToggleSwitch
              label={item.label}
              description={item.description}
              checked={n[item.key]}
              onChange={(v) => updateSection("notifications", { [item.key]: v })}
            />
          </section>
        ))}
      </section>
      <SettingsActions
        onSave={() => saveSection("notifications", "Lưu cài đặt thông báo")}
        onReset={() => resetSection("notifications")}
      />
    </SettingsCard>
  );
}

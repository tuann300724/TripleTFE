import { Settings, Save } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import SettingsTabs from "../components/settings/SettingsTabs";
import ActivityPanel from "../components/settings/ActivityPanel";
import UnsavedChangesBar from "../components/settings/UnsavedChangesBar";
import SettingsConfirmModal from "../components/settings/SettingsConfirmModal";
import GeneralSettings from "../components/settings/sections/GeneralSettings";
import AccountSettings from "../components/settings/sections/AccountSettings";
import ThemeSettings from "../components/settings/sections/ThemeSettings";
import NotificationSettings from "../components/settings/sections/NotificationSettings";
import SecuritySettings from "../components/settings/sections/SecuritySettings";
import StoreSettings from "../components/settings/sections/StoreSettings";
import AdvancedSettings from "../components/settings/sections/AdvancedSettings";

const SECTIONS = {
  general: GeneralSettings,
  account: AccountSettings,
  theme: ThemeSettings,
  notifications: NotificationSettings,
  security: SecuritySettings,
  store: StoreSettings,
  advanced: AdvancedSettings,
};

export default function SettingsView() {
  const { activeTab, saveAll, isDirty } = useSettings();
  const Section = SECTIONS[activeTab] || GeneralSettings;

  return (
    <section className="anim-in settings-page pb-24">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="text-[rgb(var(--admin-primary))]" size={26} />
            Cài đặt hệ thống
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý website, tài khoản, giao diện và bảo mật — TripleT Badminton Admin
          </p>
        </section>
        <button
          type="button"
          onClick={saveAll}
          disabled={!isDirty}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgb(var(--admin-primary))] text-white text-sm font-medium shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
        >
          <Save size={16} />
          Lưu tất cả
        </button>
      </header>

      <section className="flex flex-col lg:flex-row gap-6">
        <SettingsTabs />
        <section className="flex-1 min-w-0 space-y-6">
          <Section />
        </section>
        <ActivityPanel />
      </section>

      <UnsavedChangesBar />
      <SettingsConfirmModal />
    </section>
  );
}

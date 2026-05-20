import {
  Globe, User, Palette, Bell, Shield, Store, Wrench,
} from "lucide-react";
import { SETTINGS_TABS } from "../../settings/defaults";
import { useSettings } from "../../context/SettingsContext";

const ICONS = { Globe, User, Palette, Bell, Shield, Store, Wrench };

export default function SettingsTabs() {
  const { activeTab, setActiveTab, isDirty } = useSettings();

  return (
    <nav className="lg:w-56 shrink-0">
      <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden lg:block">
        Cài đặt hệ thống
      </p>
      <section className="flex lg:flex-col gap-1 overflow-x-auto admin-scroll pb-1 lg:pb-0">
        {SETTINGS_TABS.map((tab) => {
          const Icon = ICONS[tab.icon];
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                active
                  ? "bg-[rgb(var(--admin-primary))] text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={17} />
              {tab.label}
              {isDirty && active && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 ml-auto hidden lg:block" title="Chưa lưu" />
              )}
            </button>
          );
        })}
      </section>
    </nav>
  );
}

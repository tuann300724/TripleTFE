import { Sun, Moon } from "lucide-react";
import { useSettings } from "../../../context/SettingsContext";
import SettingsCard from "../SettingsCard";
import SettingsActions from "../SettingsActions";
import ToggleSwitch from "../ToggleSwitch";
import { PRIMARY_COLORS, FONT_OPTIONS } from "../../../settings/defaults";

export default function ThemeSettings() {
  const { draft, updateSection, saveSection, resetSection, darkMode, setDarkMode } = useSettings();
  const t = draft.theme;
  const p = draft.preferences;

  return (
    <>
      <SettingsCard title="Chế độ hiển thị" description="Dark / Light mode và tùy biến giao diện">
        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
          <section className="flex items-center gap-3">
            {darkMode ? <Moon size={20} className="text-emerald-500" /> : <Sun size={20} className="text-amber-500" />}
            <section>
              <p className="font-medium text-sm">Dark mode</p>
              <p className="text-xs text-slate-500">{darkMode ? "Đang bật giao diện tối" : "Đang bật giao diện sáng"}</p>
            </section>
          </section>
          <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
        </label>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pt-2">Màu chủ đạo</p>
        <section className="flex flex-wrap gap-2">
          {PRIMARY_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => updateSection("theme", { primaryColor: c.id })}
              className={`w-10 h-10 rounded-xl border-2 transition-transform hover:scale-105 ${
                t.primaryColor === c.id ? "border-slate-900 dark:border-white scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </section>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Font chữ UI</p>
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateSection("theme", { fontFamily: f.id })}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                t.fontFamily === f.id
                  ? "border-[rgb(var(--admin-primary))] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              style={{ fontFamily: f.family }}
            >
              {f.label}
            </button>
          ))}
        </section>

        <ToggleSwitch
          label="Thu gọn sidebar"
          description="Chỉ hiện icon menu trên desktop"
          checked={t.sidebarCollapsed}
          onChange={(v) => updateSection("theme", { sidebarCollapsed: v })}
        />

        <ToggleSwitch
          label="Tự động lưu cài đặt"
          description="Lưu sau khi ngừng chỉnh sửa"
          checked={p.autosave}
          onChange={(v) => updateSection("preferences", { autosave: v })}
        />

        <SettingsActions
          onSave={() => saveSection("theme", "Lưu giao diện")}
          onReset={() => resetSection("theme")}
        />
      </SettingsCard>
    </>
  );
}

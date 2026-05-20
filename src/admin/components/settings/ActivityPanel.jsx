import { Activity } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../auth/AuthProvider";

function PrefRow({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span>{label}</span>
      <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{value}</span>
    </div>
  );
}

export default function ActivityPanel() {
  const { activityLog, draft } = useSettings();
  const { recentActivity } = useAuth();

  return (
    <aside className="hidden xl:block w-72 shrink-0 space-y-4">
      <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm">
        <header className="flex items-center gap-2 mb-3">
          <Activity size={18} className="text-emerald-600" />
          <h3 className="font-semibold text-sm">Hoạt động gần đây</h3>
        </header>
        <ul className="space-y-2 text-xs">
          {activityLog.slice(0, 5).map((log) => (
            <li key={log.id} className="text-slate-600 dark:text-slate-400 border-l-2 border-emerald-500/40 pl-2">
              {log.action}
              <span className="block text-[10px] text-slate-400 mt-0.5">{log.time}</span>
            </li>
          ))}
          {activityLog.length === 0 && <p className="text-slate-500">Chưa có log settings</p>}
        </ul>
      </article>

      <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm">
        <h3 className="font-semibold text-sm mb-2">Tùy chọn nhanh</h3>
        <dl className="text-xs space-y-2 text-slate-500">
          <PrefRow label="Autosave" value={draft.preferences?.autosave ? "Bật" : "Tắt"} />
          <PrefRow label="Màu chủ đạo" value={draft.theme?.primaryColor} />
          <PrefRow label="Sidebar" value={draft.theme?.sidebarCollapsed ? "Thu gọn" : "Mở rộng"} />
          <PrefRow label="Cửa hàng" value={draft.store?.storeOpen ? "Đang mở" : "Đóng cửa"} />
        </dl>
      </article>

      <article className="glass rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm">
        <h3 className="font-semibold text-sm mb-2">Hệ thống</h3>
        <ul className="text-xs space-y-2 text-slate-500">
          {recentActivity.slice(0, 4).map((a) => (
            <li key={a.id}>{a.action} · {a.time}</li>
          ))}
        </ul>
      </article>
    </aside>
  );
}

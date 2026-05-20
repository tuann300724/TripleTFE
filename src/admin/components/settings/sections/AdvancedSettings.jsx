import { useRef } from "react";
import { Download, Upload, Database, Trash2, HardDrive } from "lucide-react";
import { useSettings } from "../../../context/SettingsContext";
import { useAdmin } from "../../../context/AdminContext";
import SettingsCard from "../SettingsCard";
export default function AdvancedSettings() {
  const {
    resetAllSettings,
    exportDashboardData,
    importDashboardData,
    resetDashboardData,
    setConfirmModal,
    activityLog,
  } = useSettings();
  const { withLoading, showToast } = useAdmin();
  const fileRef = useRef(null);

  const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackup = () => {
    withLoading(() => {
      const bundle = {
        settings: JSON.parse(localStorage.getItem("triplet-admin-settings") || "{}"),
        dashboard: exportDashboardData(),
        profile: JSON.parse(localStorage.getItem("triplet-admin-profile") || "{}"),
        backedUpAt: new Date().toISOString(),
      };
      downloadJson(bundle, `triplet-backup-${Date.now()}.json`);
      showToast("Đã tải file backup");
    });
  };

  const handleExport = () => {
    withLoading(() => {
      downloadJson(exportDashboardData(), `triplet-data-${Date.now()}.json`);
      showToast("Đã export dữ liệu dashboard");
    });
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.dashboard) importDashboardData(data.dashboard);
        else importDashboardData(data);
        showToast("Import dữ liệu thành công");
      } catch {
        showToast("File không hợp lệ", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const actions = [
    {
      icon: Database,
      label: "Backup toàn bộ",
      desc: "Tải file JSON gồm settings + dashboard",
      onClick: handleBackup,
      color: "text-blue-600",
    },
    {
      icon: Download,
      label: "Export dữ liệu",
      desc: "Xuất SP, KH, đơn hàng",
      onClick: handleExport,
      color: "text-emerald-600",
    },
    {
      icon: Upload,
      label: "Import dữ liệu",
      desc: "Nhập từ file JSON",
      onClick: () => fileRef.current?.click(),
      color: "text-violet-600",
    },
    {
      icon: HardDrive,
      label: "Clear cache",
      desc: "Xóa cache (giữ đăng nhập)",
      onClick: () =>
        setConfirmModal({
          type: "clearCache",
          onConfirm: () =>
            withLoading(() => {
              ["triplet-admin-settings", "triplet-admin-activity"].forEach((k) => {
                if (k !== "triplet-auth-session") localStorage.removeItem(k);
              });
              showToast("Đã xóa cache");
            }),
        }),
      color: "text-amber-600",
    },
    {
      icon: Trash2,
      label: "Reset dashboard data",
      desc: "Khôi phục dữ liệu mẫu SP/KH/đơn",
      onClick: () =>
        setConfirmModal({
          type: "resetData",
          onConfirm: () =>
            withLoading(() => {
              resetDashboardData();
              showToast("Đã reset dữ liệu dashboard");
            }),
        }),
      color: "text-red-500",
    },
  ];

  return (
    <>
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />

      <SettingsCard title="Nâng cao" description="Sao lưu, import/export và bảo trì hệ thống">
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors card-hover"
            >
              <a.icon size={22} className={`shrink-0 ${a.color}`} />
              <section>
                <p className="font-medium text-sm">{a.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
              </section>
            </button>
          ))}
        </section>

        <button
          type="button"
          onClick={resetAllSettings}
          className="w-full mt-2 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Đặt lại toàn bộ cài đặt hệ thống
        </button>
      </SettingsCard>

      <SettingsCard title="Nhật ký hoạt động gần đây" description="Lịch sử thao tác trên settings">
        {activityLog.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có hoạt động nào.</p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto admin-scroll">
            {activityLog.slice(0, 12).map((log) => (
              <li key={log.id} className="flex justify-between gap-2 text-sm py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-slate-700 dark:text-slate-300">{log.action}</span>
                <span className="text-xs text-slate-500 shrink-0">{log.time}</span>
              </li>
            ))}
          </ul>
        )}
      </SettingsCard>
    </>
  );
}

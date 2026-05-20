import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAdmin } from "./AdminContext";
import { useAuth } from "../auth/AuthProvider";
import { DEFAULT_SETTINGS } from "../settings/defaults";
import { loadSettings, saveSettings, loadActivityLog, pushActivity, clearSettingsStorage } from "../settings/storage";
import { applyThemeSettings, applyBranding } from "../settings/themeUtils";
import { loadSession } from "../auth/authStorage";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const {
    darkMode, setDarkMode, showToast, withLoading,
    resetDashboardData, exportDashboardData, importDashboardData,
    setNotifications,
  } = useAdmin();
  const { profile, updateProfile, changePassword } = useAuth();

  const [saved, setSaved] = useState(loadSettings);
  const [draft, setDraft] = useState(saved);
  const [activeTab, setActiveTab] = useState("general");
  const [dirty, setDirty] = useState(false);
  const [activityLog, setActivityLog] = useState(loadActivityLog);
  const [confirmModal, setConfirmModal] = useState(null);
  const autosaveTimer = useRef(null);

  const isDirty = dirty || JSON.stringify(draft) !== JSON.stringify(saved);

  useEffect(() => {
    applyThemeSettings(draft.theme, darkMode);
    applyBranding(draft.general);
  }, [draft.theme, draft.general, darkMode]);

  useEffect(() => {
    const initial = loadSettings();
    applyThemeSettings(initial.theme, darkMode);
    applyBranding(initial.general);
  }, []);

  const updateSection = useCallback((section, patch) => {
    setDraft((d) => ({ ...d, [section]: { ...d[section], ...patch } }));
    setDirty(true);
  }, []);

  const persist = useCallback((label) => {
    setSaved(draft);
    saveSettings(draft);
    setDirty(false);
    setActivityLog((log) => pushActivity(log, label));
    applyThemeSettings(draft.theme, darkMode);
    applyBranding(draft.general);
  }, [draft, darkMode]);

  const saveAll = useCallback(async (label = "Lưu toàn bộ cài đặt") => {
    await withLoading(() => persist(label));
    showToast("Đã lưu cài đặt thành công");
  }, [withLoading, persist, showToast]);

  const saveSection = useCallback(async (section, label) => {
    const run = () => {
      const merged = { ...saved, [section]: draft[section] };
      setSaved(merged);
      setDraft((d) => ({ ...d, [section]: draft[section] }));
      saveSettings(merged);
      setDirty(false);
      setActivityLog((log) => pushActivity(log, label));
      applyThemeSettings(merged.theme, darkMode);
      applyBranding(merged.general);
    };

    if (draft.security?.confirmSensitiveChanges && ["security", "account"].includes(section)) {
      setConfirmModal({ type: "save", section, label, onConfirm: () => withLoading(() => { run(); showToast("Đã lưu"); }) });
      return;
    }
    await withLoading(() => { run(); showToast("Đã lưu"); });
  }, [saved, draft, darkMode, withLoading, showToast]);

  const resetAllSettings = useCallback(async () => {
    setConfirmModal({
      type: "reset",
      onConfirm: () =>
        withLoading(() => {
          const fresh = structuredClone(DEFAULT_SETTINGS);
          setDraft(fresh);
          setSaved(fresh);
          saveSettings(fresh);
          setDirty(false);
          setActivityLog((log) => pushActivity(log, "Đặt lại cài đặt mặc định"));
          showToast("Đã khôi phục cài đặt mặc định");
        }),
    });
  }, [withLoading, showToast]);

  const resetSection = useCallback((section) => {
    if (!DEFAULT_SETTINGS[section]) return;
    setDraft((d) => ({ ...d, [section]: structuredClone(DEFAULT_SETTINGS[section]) }));
    setDirty(true);
    showToast("Đã khôi phục giá trị mặc định (chưa lưu)");
  }, [showToast]);

  const discardChanges = useCallback(() => {
    setDraft(saved);
    setDirty(false);
  }, [saved]);

  const requestTabChange = useCallback((tabId) => {
    if (isDirty) {
      setConfirmModal({
        type: "unsaved",
        tabId,
        onConfirm: () => {
          setDraft(saved);
          setDirty(false);
          setActiveTab(tabId);
        },
      });
      return;
    }
    setActiveTab(tabId);
  }, [isDirty, saved]);

  useEffect(() => {
    if (!draft.preferences?.autosave || !isDirty) return;
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      persist("Tự động lưu cài đặt");
    }, draft.preferences.autosaveDelayMs || 2000);
    return () => clearTimeout(autosaveTimer.current);
  }, [draft, isDirty, draft.preferences?.autosave, draft.preferences?.autosaveDelayMs, persist]);

  const sessions = useMemoSessions();

  const updateNotificationPrefs = useCallback((patch) => {
    updateSection("notifications", patch);
  }, [updateSection]);

  const value = {
    saved,
    draft,
    updateSection,
    activeTab,
    setActiveTab: requestTabChange,
    isDirty,
    saveAll,
    saveSection,
    resetAllSettings,
    resetSection,
    discardChanges,
    activityLog,
    confirmModal,
    setConfirmModal,
    darkMode,
    setDarkMode,
    profile,
    updateProfile,
    changePassword,
    sessions,
    resetDashboardData,
    exportDashboardData,
    importDashboardData,
    setNotifications,
    updateNotificationPrefs,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

function useMemoSessions() {
  const session = loadSession();
  const now = Date.now();
  return [
    {
      id: "current",
      device: "Chrome · Windows",
      location: "TP. Hồ Chí Minh",
      lastActive: "Hiện tại",
      current: true,
      expiresAt: session?.expiresAt,
    },
    {
      id: "prev-1",
      device: "Safari · iPhone",
      location: "Hà Nội",
      lastActive: "2 ngày trước",
      current: false,
      expiresAt: now - 86400000,
    },
  ];
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings trong SettingsProvider");
  return ctx;
}

import { DEFAULT_SETTINGS } from "./defaults";

const SETTINGS_KEY = "triplet-admin-settings";
const ACTIVITY_KEY = "triplet-admin-activity";

function deepMerge(base, patch) {
  const out = { ...base };
  for (const key of Object.keys(patch || {})) {
    if (patch[key] && typeof patch[key] === "object" && !Array.isArray(patch[key])) {
      out[key] = deepMerge(base[key] || {}, patch[key]);
    } else {
      out[key] = patch[key];
    }
  }
  return out;
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return deepMerge(DEFAULT_SETTINGS, JSON.parse(raw));
  } catch { /* ignore */ }
  return structuredClone(DEFAULT_SETTINGS);
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearSettingsStorage() {
  localStorage.removeItem(SETTINGS_KEY);
}

export function loadActivityLog() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function saveActivityLog(log) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log.slice(0, 50)));
}

export function pushActivity(log, action) {
  const entry = {
    id: Date.now(),
    action,
    time: new Date().toLocaleString("vi-VN"),
  };
  const next = [entry, ...log];
  saveActivityLog(next);
  return next;
}

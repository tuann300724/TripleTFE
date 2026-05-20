const SESSION_KEY = "triplet-auth-session";
const PROFILE_KEY = "triplet-admin-profile";

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session, rememberMe = false) {
  const expiresAt = Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
  const data = { ...session, expiresAt, rememberMe };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return data;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

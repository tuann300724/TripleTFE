import { useState, useCallback, useSyncExternalStore } from "react";

function getSnapshot() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot);
  const [loading, setLoading] = useState(false);

  const login = useCallback((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("storage"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
  }, []);

  return { user, loading, setLoading, login, logout, isAuthenticated: !!user };
}

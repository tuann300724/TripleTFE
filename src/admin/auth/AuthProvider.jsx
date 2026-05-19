import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loadSession, saveSession, clearSession, loadProfile, saveProfile } from "./authStorage";
import { DEMO_CREDENTIALS, DEFAULT_PROFILE, RECENT_ACTIVITY } from "./defaultAdmin";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const session = loadSession();
    const savedProfile = loadProfile();
    if (session?.user) {
      setUser(session.user);
      setIsAuthenticated(true);
    }
    if (savedProfile) setProfile((p) => ({ ...p, ...savedProfile }));
    setAuthLoading(false);
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setLoginLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const ok =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;

    if (!ok) {
      setLoginLoading(false);
      return { success: false, error: "Email hoặc mật khẩu không đúng. Vui lòng thử lại." };
    }

    const authUser = {
      id: DEFAULT_PROFILE.id,
      email: DEMO_CREDENTIALS.email,
      name: profile.fullName,
    };
    saveSession({ user: authUser, token: `triplet_${Date.now()}` }, rememberMe);
    setUser(authUser);
    setIsAuthenticated(true);
    setLoginLoading(false);
    return { success: true };
  }, [profile.fullName]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateProfile = useCallback((data) => {
    const next = { ...profile, ...data };
    setProfile(next);
    saveProfile(next);
    if (user) setUser((u) => ({ ...u, name: next.fullName, email: next.email }));
    return next;
  }, [profile, user]);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    await new Promise((r) => setTimeout(r, 600));
    if (currentPassword !== DEMO_CREDENTIALS.password) {
      return { success: false, error: "Mật khẩu hiện tại không đúng." };
    }
    if (newPassword.length < 6) {
      return { success: false, error: "Mật khẩu mới tối thiểu 6 ký tự." };
    }
    return { success: true, message: "Đổi mật khẩu thành công (demo — chưa lưu server)." };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated,
        authLoading,
        loginLoading,
        login,
        logout,
        updateProfile,
        changePassword,
        recentActivity: RECENT_ACTIVITY,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải nằm trong AuthProvider");
  return ctx;
}

/** Hook logout + redirect */
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return () => {
    logout();
    navigate("/admin/login", { replace: true });
  };
}

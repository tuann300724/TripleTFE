import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedAdmin({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <article className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-[3px] border-emerald-200 border-t-emerald-500 rounded-full anim-spin" />
          <p className="text-sm text-slate-400">Đang xác thực...</p>
        </article>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

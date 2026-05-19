import { CheckCircle, XCircle } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function Toast() {
  const { toast } = useAdmin();
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <aside className={`fixed bottom-5 right-5 z-[120] admin-toast flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
      isError
        ? "bg-white dark:bg-slate-800 border-red-200 dark:border-red-800 text-red-600"
        : "bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
    }`}>
      {isError ? <XCircle size={18} /> : <CheckCircle size={18} />}
      {toast.message}
    </aside>
  );
}

import { useAdmin } from "../context/AdminContext";

export default function LoadingOverlay() {
  const { loading } = useAdmin();
  if (!loading) return null;
  return (
    <section className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px]">
      <article className="glass rounded-2xl px-8 py-5 flex flex-col items-center gap-3 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
        <span className="w-9 h-9 border-[3px] border-emerald-200 border-t-emerald-500 rounded-full anim-spin" />
        <p className="text-sm text-slate-600 dark:text-slate-300">Đang tải...</p>
      </article>
    </section>
  );
}

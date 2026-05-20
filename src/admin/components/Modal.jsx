import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <section className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" aria-label="đóng" className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={onClose} />
      <article className={`relative w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-2xl glass border border-slate-200/80 dark:border-slate-700/80 shadow-2xl modal-in`}>
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{title}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <X size={18} />
          </button>
        </header>
        <section className="p-5 max-h-[70vh] overflow-y-auto admin-scroll">{children}</section>
      </article>
    </section>
  );
}
